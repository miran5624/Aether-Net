import React, { useState, useEffect, useMemo } from 'react';
import { Text, View, ActivityIndicator, TouchableOpacity, NativeModules, FlatList, Vibration, Animated } from 'react-native';
import { useRef } from 'react';
// Bypass unused online connectivity hooks for mesh ops
import { requestAllPermissions } from './src/hooks/usePermissions';
import { savePacket, getAllPackets, clearPacketsByOrigin, deletePacketById, getDeviceUuid, SosPacket } from './src/services/StorageService';

// OnlineScreen bypassed

import { useKeepAwake } from '@sayem314/react-native-keep-awake';
import { ManetService } from './src/services/ManetService';

import Geolocation from '@react-native-community/geolocation';
import NetInfo from '@react-native-community/netinfo';

import { getDistanceKm, getBearing, bearingToCardinal } from './src/utils/GeoUtils';
import { WebView } from 'react-native-webview';

import { OfflineMap, OfflineMapRef } from './src/components/OfflineMap';
import { isCacheValid, downloadTilesForLocation, DownloadProgress } from './src/services/TileDownloadService';
import { useCompass } from './src/hooks/useCompass';
import { ChatbotScreen } from './src/screens/ChatbotScreen';
import { SosModal } from './src/components/SosModal';
const OfflineScreen = () => {
  useKeepAwake();

  const { heading: deviceHeading, accuracy: compassAccuracy } = useCompass();

  const [permissionsGranted, setPermissionsGranted] = useState<boolean | null>(null);
  const [packetCount, setPacketCount] = useState(0);
  const [peersCount, setPeersCount] = useState(0);
  const [allPackets, setAllPackets] = useState<SosPacket[]>([]);
  const [userLocation, setUserLocation] = useState<{ lat: number, lng: number, accuracy: number, heading?: number } | null>(null);
  const [showLocationWarning, setShowLocationWarning] = useState(false);
  const [deviceName, setDeviceName] = useState<string>('...');
  const [deviceUuid, setDeviceUuid] = useState<string>('');
  const [mapReady, setMapReady] = useState(false);
  const [followUser, setFollowUser] = useState(true);
  const [activeNavTarget, setActiveNavTarget] = useState<SosPacket | null>(null);
  const [navStats, setNavStats] = useState<{ distanceKm: number, bearing: number, cardinalDirection: string, arrowRotation: number } | null>(null);
  const [showChatbot, setShowChatbot] = useState(false);
  const [sosModalVisible, setSosModalVisible] = useState(false);

  const mapRef = useRef<OfflineMapRef>(null);
  const hasVibratedRef = useRef(false);
  const arrowAnim = useRef(new Animated.Value(0)).current;
  const currentRotation = useRef(0);

  // Fetch device identity once on mount
  useEffect(() => {
    NativeModules.NearbyModule.getDeviceName()
      .then((name: string) => setDeviceName(name))
      .catch(() => setDeviceName('Unknown'));

    getDeviceUuid().then(uuid => setDeviceUuid(uuid));

    // Self-test for arrowRotation
    console.log('Test 1:', ((0 - 0) % 360 + 360) % 360); // Expected: 0
    console.log('Test 2:', ((0 - 90) % 360 + 360) % 360); // Expected: 270
    console.log('Test 3:', ((90 - 0) % 360 + 360) % 360); // Expected: 90
    console.log('Test 4:', ((317 - 317) % 360 + 360) % 360); // Expected: 0
  }, []);

  // Packets enriched with distance and sorted nearest-first
  const sortedPackets = useMemo(() => {
    return allPackets
      .map(p => ({
        ...p,
        distanceKm: userLocation
          ? getDistanceKm(userLocation.lat, userLocation.lng, p.location.lat, p.location.lng)
          : 999,
      }))
      .sort((a, b) => a.distanceKm - b.distanceKm);
  }, [allPackets, userLocation]);

  const nearestPacket = sortedPackets[0] ?? null;

  // The SOS packet created by THIS device (null if none active)
  const myActiveSos = useMemo(
    () => allPackets.find(p => p.originUserId === deviceUuid) ?? null,
    [allPackets, deviceUuid]
  );

  useEffect(() => {
    if (userLocation && mapReady) {
      mapRef.current?.setUserLocation(userLocation.lat, userLocation.lng, userLocation.heading ?? null, followUser);
    }
  }, [userLocation, mapReady, followUser]);

  useEffect(() => {
    if (!activeNavTarget || !userLocation) return;
    const dist = getDistanceKm(
      userLocation.lat, userLocation.lng,
      activeNavTarget.location.lat, activeNavTarget.location.lng
    );
    const geographicBearing = getBearing(
      userLocation.lat, userLocation.lng,
      activeNavTarget.location.lat, activeNavTarget.location.lng
    );
    const arrowRot = ((geographicBearing - deviceHeading) % 360 + 360) % 360;

    setNavStats({
      distanceKm: dist,
      bearing: geographicBearing,
      arrowRotation: arrowRot,
      cardinalDirection: bearingToCardinal(arrowRot)
    });
    mapRef.current?.updateNavigation(userLocation.lat, userLocation.lng);

    if (dist < 0.05 && !hasVibratedRef.current) {
      Vibration.vibrate([0, 500, 200, 500]);
      hasVibratedRef.current = true;
    }
  }, [userLocation, activeNavTarget, deviceHeading]);

  useEffect(() => {
    if (!navStats) return;
    let delta = navStats.arrowRotation - currentRotation.current;
    if (delta > 180) delta -= 360;
    if (delta < -180) delta += 360;
    const target = currentRotation.current + delta;
    currentRotation.current = target;

    Animated.spring(arrowAnim, {
      toValue: target,
      useNativeDriver: true,
      tension: 40,
      friction: 8
    }).start();
  }, [navStats?.arrowRotation]);

  const handleStopNavigation = () => {
    setActiveNavTarget(null);
    setNavStats(null);
    hasVibratedRef.current = false;
    mapRef.current?.stopNavigation();
  };

  const allPacketsStr = JSON.stringify(allPackets);
  useEffect(() => {
    if (mapReady) {
      mapRef.current?.clearMarkers();
      allPackets.forEach(packet => {
        mapRef.current?.addPacket(packet);
      });
    }
  }, [allPacketsStr, mapReady]);

  useEffect(() => {
    let intervalId: ReturnType<typeof setInterval>;
    let watchId: number | null = null;

    const startOfflineMesh = async () => {
      const granted = await requestAllPermissions();
      setPermissionsGranted(granted);

      if (granted) {
        // Start GPS
        Geolocation.getCurrentPosition(
          (position) => {
            setUserLocation({
              lat: position.coords.latitude,
              lng: position.coords.longitude,
              accuracy: position.coords.accuracy,
              heading: position.coords.heading !== null ? position.coords.heading : undefined,
            });
          },
          (error) => console.log(error.code, error.message),
          { enableHighAccuracy: false, timeout: 5000, maximumAge: 10000 }
        );

        watchId = Geolocation.watchPosition(
          (position) => {
            setUserLocation({
              lat: position.coords.latitude,
              lng: position.coords.longitude,
              accuracy: position.coords.accuracy,
              heading: position.coords.heading !== null ? position.coords.heading : undefined,
            });
          },
          (error) => console.log(error.code, error.message),
          { enableHighAccuracy: true, distanceFilter: 1, interval: 2000, fastestInterval: 1000 }
        );

        ManetService.startMesh(
          async (packet) => {
            const packets = await getAllPackets();
            setAllPackets(packets);
            setPacketCount(packets.length);
          },
          (peers) => {
            setPeersCount(peers.length);
          }
        );

        intervalId = setInterval(() => {
          ManetService.broadcastAllPackets();
        }, 10000);
      }

      const packets = await getAllPackets();
      setAllPackets(packets);
      setPacketCount(packets.length);
    };

    startOfflineMesh();

    return () => {
      if (intervalId) clearInterval(intervalId);
      if (watchId !== null) Geolocation.clearWatch(watchId);
      ManetService.stopMesh();
    };
  }, []);

  const handleRaiseSos = async (description: string, type: string) => {
    if (myActiveSos) { return; }

    let loc = userLocation;
    let fallback = false;
    if (!loc) {
      loc = { lat: 0, lng: 0, accuracy: -1 };
      fallback = true;
      setShowLocationWarning(true);
    } else {
      setShowLocationWarning(false);
    }

    const packet: SosPacket = {
      packetId: Math.random().toString(36).substring(2, 12),
      originUserId: deviceUuid,
      location: { lat: fallback ? 0 : loc.lat, lng: fallback ? 0 : loc.lng, accuracy: loc.accuracy },
      hopCount: 0,
      timestamp: Date.now(),
      type: type,
      description: description.length > 0 ? description : undefined
    };

    await savePacket(packet);
    const packets = await getAllPackets();
    setAllPackets(packets);
    setPacketCount(packets.length);
    ManetService.broadcastAllPackets();
  };

  const handleDeleteSos = async () => {
    if (!myActiveSos) { return; }
    const packetId = myActiveSos.packetId;
    await deletePacketById(packetId);
    // Tell all connected peers to delete it too — tombstone spreads epidemically
    ManetService.broadcastDelete(packetId);
    const remaining = await getAllPackets();
    setAllPackets(remaining);
    setPacketCount(remaining.length);
    setShowLocationWarning(false);
  };

  const arrowStyle = {
    transform: [{
      rotate: arrowAnim.interpolate({
        inputRange: [-3600, 0, 3600],
        outputRange: ['-3600deg', '0deg', '3600deg']
      })
    }]
  };

  return (
    <View style={{ flex: 1, paddingTop: 30, alignItems: 'center', backgroundColor: '#000000' }}>
      {showChatbot && (
        <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 999, backgroundColor: '#0a0a0a' }}>
          <ChatbotScreen onClose={() => setShowChatbot(false)} />
        </View>
      )}
      
      <SosModal
        visible={sosModalVisible}
        onCancel={() => setSosModalVisible(false)}
        onConfirm={async (description, type) => {
          setSosModalVisible(false);
          await handleRaiseSos(description, type);
        }}
      />

      <Text style={{ backgroundColor: '#ffff00', color: 'black', padding: 5, fontWeight: 'bold', marginBottom: 4 }}>
        ⚡ Stay Awake Active
      </Text>
      <Text style={{ backgroundColor: '#003300', color: '#00ff41', padding: 4, fontWeight: 'bold', marginBottom: 10, fontSize: 12 }}>
        🔗 This Device: {deviceName}
      </Text>

      {permissionsGranted === true ? (
        <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#ff4444', marginBottom: 10 }}>🔴 MESH ACTIVE</Text>
      ) : (
        <Text style={{ fontSize: 20, fontWeight: 'bold', color: 'gray', marginBottom: 10 }}>OFFLINE MODE</Text>
      )}

      {permissionsGranted === true && (
        <View style={{ height: '45%', width: '100%', marginBottom: 10 }}>
          <OfflineMap
            ref={mapRef}
            style={{ flex: 1 }}
            onMapReady={() => setMapReady(true)}
            onMapDragged={() => setFollowUser(false)}
            onBeaconTapped={(packetId) => {
              const packet = allPackets.find(p => p.packetId === packetId);
              if (packet && userLocation) {
                setActiveNavTarget(packet);
                hasVibratedRef.current = false;
                mapRef.current?.startNavigation(packet, userLocation.lat, userLocation.lng);
              }
            }}
          />
          {!showChatbot && (
            <>
              <TouchableOpacity
                onPress={() => setFollowUser(!followUser)}
                style={{
                  position: 'absolute',
                  top: 10,
                  right: 10,
                  backgroundColor: 'rgba(255,255,255,0.9)',
                  borderRadius: 20,
                  width: 40,
                  height: 40,
                  justifyContent: 'center',
                  alignItems: 'center',
                  elevation: 5,
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.3,
                  shadowRadius: 3,
                }}
              >
                <Text style={{ fontSize: 20 }}>{followUser ? '📍' : '🎯'}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setShowChatbot(true)}
                style={{
                  position: 'absolute',
                  top: 60,
                  right: 10,
                  width: 40,
                  height: 40,
                  borderRadius: 20,
                  backgroundColor: '#ffffff',
                  borderWidth: 1,
                  borderColor: '#cccccc',
                  justifyContent: 'center',
                  alignItems: 'center',
                  elevation: 5,
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.3,
                  shadowRadius: 3,
                }}
              >
                <Text style={{ fontSize: 20 }}>⚕</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      )}

      {permissionsGranted === false && (
        <Text style={{ color: 'red', fontWeight: 'bold', textAlign: 'center', marginHorizontal: 20, marginBottom: 20 }}>
          PERMISSIONS DENIED — Mesh network cannot start.
        </Text>
      )}

      {permissionsGranted === true && (
        <View style={{ width: '80%', marginBottom: 10 }}>
          {userLocation ? (
            <Text style={{ fontSize: 14, color: '#add8e6', fontWeight: 'bold', marginBottom: 5 }}>
              📍 Your Location: {userLocation.lat.toFixed(4)}, {userLocation.lng.toFixed(4)} | Accuracy: {Math.round(userLocation.accuracy)}m
            </Text>
          ) : (
            <Text style={{ fontSize: 14, color: '#add8e6', fontWeight: 'bold', marginBottom: 5 }}>
              📍 Acquiring GPS... <ActivityIndicator size="small" color="#add8e6" />
            </Text>
          )}

          {showLocationWarning && (
            <Text style={{ color: 'yellow', fontWeight: 'bold', marginBottom: 5, fontSize: 12 }}>
              ⚠️ Location unavailable — SOS sent without coordinates
            </Text>
          )}

          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <Text style={{ fontSize: 14, color: '#00ff00', fontWeight: 'bold' }}>Peers in range: {peersCount}</Text>
            <Text style={{ fontSize: 14, color: '#ffffff', fontWeight: 'bold' }}>Stored Packets: {packetCount}</Text>
          </View>
        </View>
      )}

      {permissionsGranted === true && (
        <View style={{ flex: 1, width: '92%', marginBottom: 10 }}>
          {activeNavTarget ? (
            <View style={{ flex: 1, backgroundColor: '#0d1117', borderColor: '#00ff41', borderWidth: 1, padding: 10, borderRadius: 10, alignItems: 'center', justifyContent: 'center' }}>
              {navStats?.distanceKm !== undefined && navStats.distanceKm < 0.05 ? (
                <>
                  <Text style={{ color: '#00ff41', fontSize: 24, fontWeight: 'bold', textAlign: 'center' }}>DESTINATION REACHED</Text>
                  <TouchableOpacity onPress={handleStopNavigation} style={{ marginTop: 20, backgroundColor: '#ff4444', padding: 10, borderRadius: 5 }}>
                    <Text style={{ color: 'white', fontWeight: 'bold' }}>✕ CLOSE</Text>
                  </TouchableOpacity>
                </>
              ) : (
                <>
                  <Animated.View style={[arrowStyle, { marginBottom: 10 }]}>
                    <Text style={{ color: '#00ff41', fontSize: 50, fontWeight: 'bold' }}>↑</Text>
                  </Animated.View>
                  <Text style={{ color: 'white', fontSize: 32, fontWeight: 'bold' }}>{navStats?.bearing ?? 0}°</Text>
                  {compassAccuracy < 2 && (
                    <Text style={{ color: '#ffff00', fontSize: 11, textAlign: 'center' }}>
                      ⚠️ Wave phone in figure-8 to calibrate compass
                    </Text>
                  )}
                  <Text style={{ color: '#00ff41', fontFamily: 'monospace', fontSize: 18, marginVertical: 5 }}>HEAD {navStats?.cardinalDirection ?? 'N'}</Text>
                  <Text style={{ color: '#555555', fontSize: 10, textAlign: 'center', marginTop: 4 }}>
                    Facing {deviceHeading}° | Target {navStats?.bearing}°
                  </Text>
                  <Text style={{ color: 'white', fontSize: 20, marginBottom: 10 }}>
                    {(navStats?.distanceKm ?? 0) >= 1
                      ? `${(navStats?.distanceKm ?? 0).toFixed(2)} km away`
                      : `${Math.round((navStats?.distanceKm ?? 0) * 1000)} m away`}
                  </Text>
                  <Text style={{ color: '#aaa', fontSize: 12, marginBottom: 15 }}>
                    🆘 {activeNavTarget.type} | SOS raised {Math.round((Date.now() - activeNavTarget.timestamp) / 60000)} mins ago | Hop {activeNavTarget.hopCount}
                  </Text>
                  <TouchableOpacity onPress={handleStopNavigation} style={{ backgroundColor: '#ff4444', paddingHorizontal: 20, paddingVertical: 10, borderRadius: 5 }}>
                    <Text style={{ color: 'white', fontWeight: 'bold' }}>✕ CANCEL NAVIGATION</Text>
                  </TouchableOpacity>
                </>
              )}
            </View>
          ) : (
            <>
              <Text style={{ color: '#666', marginBottom: 4, fontWeight: 'bold', fontSize: 12 }}>VICTIMS (nearest first):</Text>
              <FlatList
                data={sortedPackets}
                keyExtractor={item => item.packetId}
                renderItem={({ item }) => {
                  let emoji = '🆘';
                  const time = new Intl.DateTimeFormat('en-GB', {
                    hour: '2-digit', minute: '2-digit', second: '2-digit',
                  }).format(new Date(item.timestamp));
                  const logEntry = item.description
                    ? `[${time}] ${emoji} ${item.type.toUpperCase()} | ${item.distanceKm}km | Hop ${item.hopCount} | "${item.description.slice(0, 40)}${item.description.length > 40 ? '...' : ''}"`
                    : `[${time}] ${emoji} ${item.type.toUpperCase()} | ${item.distanceKm}km | Hop ${item.hopCount}`;
                  return (
                    <Text style={{ color: '#fff', fontSize: 12, paddingVertical: 3, fontFamily: 'monospace' }}>
                      {logEntry}
                    </Text>
                  );
                }}
              />
            </>
          )}
        </View>
      )}

      {permissionsGranted === true && !activeNavTarget && (
        <View style={{ flexDirection: 'row', gap: 15, marginBottom: 10 }}>
          {/* Raise SOS — disabled if this device already has an active SOS */}
          <TouchableOpacity
            onPress={() => setSosModalVisible(true)}
            disabled={!!myActiveSos}
            style={{
              backgroundColor: myActiveSos ? '#7a2222' : '#ff4444',
              paddingHorizontal: 20, paddingVertical: 10, borderRadius: 10,
              opacity: myActiveSos ? 0.5 : 1,
            }}>
            <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 14 }}>
              {myActiveSos ? `Active: ${myActiveSos.type}` : 'Raise SOS'}
            </Text>
          </TouchableOpacity>

          {/* Delete SOS — disabled if no active SOS from this device */}
          <TouchableOpacity
            onPress={handleDeleteSos}
            disabled={!myActiveSos}
            style={{
              backgroundColor: myActiveSos ? '#cc4400' : '#555',
              paddingHorizontal: 20, paddingVertical: 10, borderRadius: 10,
              opacity: myActiveSos ? 1 : 0.4,
            }}>
            <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 14 }}>Delete SOS</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const App = () => {
  const [showWebView, setShowWebView] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState<DownloadProgress | null>(null);
  const [downloadMessage, setDownloadMessage] = useState<string | null>(null);

  useEffect(() => {
    const checkAndDownloadMaps = async () => {
      const netInfo = await NetInfo.fetch();
      if (netInfo.type !== 'wifi' || !netInfo.isConnected) {
        return; // Only download on WiFi
      }

      Geolocation.getCurrentPosition(
        async (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;

          const valid = await isCacheValid(lat, lng);
          if (valid) return;

          setDownloadMessage('📥 Downloading offline map...');

          await downloadTilesForLocation(lat, lng, (progress) => {
            setDownloadProgress(progress);
            if (progress.status === 'complete') {
              setDownloadMessage('✅ Offline map ready');
              setTimeout(() => {
                setDownloadMessage(null);
                setDownloadProgress(null);
              }, 3000);
            } else if (progress.status === 'error') {
              setDownloadMessage(null);
              setDownloadProgress(null);
            }
          });
        },
        (error) => console.log('Location error during tile download:', error),
        { enableHighAccuracy: false, timeout: 5000, maximumAge: 10000 }
      );
    };

    checkAndDownloadMaps();
  }, []);

  return (
    <View style={{ flex: 1 }}>
      {/* Offline mesh — always mounted so mesh keeps running in background */}
      <View style={{ flex: 1, display: showWebView ? 'none' : 'flex' }}>
        <OfflineScreen />
      </View>

      {/* WebView — only shown when toggled */}
      {showWebView && (
        <View style={{ flex: 1 }}>
          <WebView
            source={{ uri: 'https://nearhelp-frontend.vercel.app/' }}
            style={{ flex: 1 }}
            startInLoadingState={true}
            renderLoading={() => (
              <View style={{ position: 'absolute', top: 0, bottom: 0, left: 0, right: 0, justifyContent: 'center', alignItems: 'center', backgroundColor: '#000' }}>
                <ActivityIndicator size="large" color="#00ff41" />
                <Text style={{ color: '#00ff41', marginTop: 10, fontWeight: 'bold' }}>Loading NearHelp...</Text>
              </View>
            )}
          />
        </View>
      )}

      {/* Floating toggle button — always visible in top-right corner */}
      <TouchableOpacity
        onPress={() => setShowWebView(v => !v)}
        style={{
          position: 'absolute',
          top: 36,
          right: 16,
          width: 44,
          height: 44,
          borderRadius: 22,
          backgroundColor: showWebView ? '#ff4444' : '#00aa55',
          justifyContent: 'center',
          alignItems: 'center',
          elevation: 8,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.4,
          shadowRadius: 4,
          zIndex: 999,
        }}>
        <Text style={{ fontSize: 20 }}>{showWebView ? '📡' : '🌐'}</Text>
      </TouchableOpacity>

      {/* Download Banner */}
      {downloadMessage && (
        <View style={{
          position: 'absolute',
          top: 30,
          left: 10,
          backgroundColor: 'rgba(0,0,0,0.8)',
          paddingHorizontal: 20,
          paddingVertical: 10,
          borderRadius: 20,
          zIndex: 1000,
        }}>
          <Text style={{ color: 'white', fontWeight: 'bold' }}>
            {downloadMessage} {downloadProgress?.status === 'downloading' ? `${downloadProgress?.percentage ?? 0}%` : ''}
          </Text>
        </View>
      )}
    </View>
  );
};

export default App;
