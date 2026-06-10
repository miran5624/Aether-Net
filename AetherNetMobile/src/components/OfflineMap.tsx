import React, { forwardRef, useImperativeHandle, useRef, useMemo } from 'react';
import { WebView, WebViewMessageEvent } from 'react-native-webview';
import { StyleProp, ViewStyle } from 'react-native';
import { getTile } from '../services/TileDownloadService';
import { generateLeafletHTML } from '../utils/LeafletMap';

export interface OfflineMapRef {
  addPacket: (packet: any) => void;
  setUserLocation: (lat: number, lng: number, heading?: number | null, followMode?: boolean) => void;
  clearMarkers: () => void;
  startNavigation: (target: any, userLat: number, userLng: number) => void;
  updateNavigation: (userLat: number, userLng: number) => void;
  stopNavigation: () => void;
}

interface OfflineMapProps {
  style?: StyleProp<ViewStyle>;
  onMapReady?: () => void;
  onMapDragged?: () => void;
  onBeaconTapped?: (packetId: string) => void;
}

export const OfflineMap = forwardRef<OfflineMapRef, OfflineMapProps>((props, ref) => {
  const webViewRef = useRef<WebView>(null);
  
  // Memoize HTML to prevent unnecessary re-renders of the WebView
  const mapHtml = useMemo(() => generateLeafletHTML(), []);

  useImperativeHandle(ref, () => ({
    addPacket: (packet: any) => {
      if (webViewRef.current) {
        webViewRef.current.injectJavaScript(`
          if (window.handleMessage) {
            window.handleMessage(JSON.stringify({
              type: 'ADD_PACKET',
              packet: ${JSON.stringify(packet)}
            }));
          }
          true;
        `);
      }
    },
    setUserLocation: (lat: number, lng: number, heading?: number | null, followMode?: boolean) => {
      if (webViewRef.current) {
        webViewRef.current.injectJavaScript(`
          if (window.handleMessage) {
            window.handleMessage(JSON.stringify({
              type: 'SET_LOCATION',
              lat: ${lat},
              lng: ${lng},
              heading: ${heading ?? 'null'},
              followMode: ${followMode ?? true}
            }));
          }
          true;
        `);
      }
    },
    clearMarkers: () => {
      if (webViewRef.current) {
        webViewRef.current.injectJavaScript(`
          if (window.handleMessage) {
            window.handleMessage(JSON.stringify({
              type: 'CLEAR'
            }));
          }
          true;
        `);
      }
    },
    startNavigation: (target: any, userLat: number, userLng: number) => {
      if (webViewRef.current) {
        webViewRef.current.injectJavaScript(`
          if (window.handleMessage) {
            window.handleMessage(JSON.stringify({
              type: 'START_NAVIGATION',
              targetLat: ${target.location.lat},
              targetLng: ${target.location.lng},
              userLat: ${userLat},
              userLng: ${userLng},
              packetId: '${target.packetId}'
            }));
          }
          true;
        `);
      }
    },
    updateNavigation: (userLat: number, userLng: number) => {
      if (webViewRef.current) {
        webViewRef.current.injectJavaScript(`
          if (window.handleMessage) {
            window.handleMessage(JSON.stringify({
              type: 'UPDATE_NAVIGATION',
              userLat: ${userLat},
              userLng: ${userLng}
            }));
          }
          true;
        `);
      }
    },
    stopNavigation: () => {
      if (webViewRef.current) {
        webViewRef.current.injectJavaScript(`
          if (window.handleMessage) {
            window.handleMessage(JSON.stringify({
              type: 'STOP_NAVIGATION'
            }));
          }
          true;
        `);
      }
    }
  }));

  const onMessage = async (event: WebViewMessageEvent) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);
      
      if (data.type === 'GET_TILE') {
        const { z, x, y, key } = data;
        const base64 = await getTile(z, x, y);
        
        if (base64) {
          webViewRef.current?.injectJavaScript(`
            if (window.handleTileResponse) {
              window.handleTileResponse('${key}', '${base64}');
            }
            true;
          `);
        } else {
          webViewRef.current?.injectJavaScript(`
            if (window.handleTileNotFound) {
              window.handleTileNotFound('${key}', ${z}, ${x}, ${y});
            }
            true;
          `);
        }
      } else if (data.type === 'MAP_READY') {
        props.onMapReady?.();
      } else if (data.type === 'MAP_DRAGGED') {
        props.onMapDragged?.();
      } else if (data.type === 'BEACON_TAPPED') {
        props.onBeaconTapped?.(data.packetId);
      }
    } catch (e) {
      console.error('Failed to parse webview message', e);
    }
  };

  return (
    <WebView
      ref={webViewRef}
      style={props.style}
      source={{ html: mapHtml }}
      javaScriptEnabled={true}
      domStorageEnabled={true}
      originWhitelist={['*']}
      onMessage={onMessage}
      showsVerticalScrollIndicator={false}
      showsHorizontalScrollIndicator={false}
    />
  );
});

OfflineMap.displayName = 'OfflineMap';
