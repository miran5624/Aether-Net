const fs = require('fs');
const https = require('https');

async function download(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(data));
    }).on('error', reject);
  });
}

function escapeForTemplateLiteral(str) {
  return str
    .replace(/\\/g, '\\\\')
    .replace(/\`/g, '\\`')
    .replace(/\$/g, '\\$');
}

async function main() {
  console.log('Downloading Leaflet CSS...');
  const css = await download('https://unpkg.com/leaflet@1.9.4/dist/leaflet.css');
  console.log('Downloading Leaflet JS...');
  const js = await download('https://unpkg.com/leaflet@1.9.4/dist/leaflet.js');

  const html = `<!DOCTYPE html>
<html>
<head>
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
  <style>
    ${css}
    body { padding: 0; margin: 0; background: #1a1a2e; }
    .leaflet-container { background: #1a1a2e !important; }
    #map { height: 100vh; width: 100vw; }
    
    /* Marker CSS */
    .sos-marker {
      background-color: red;
      border-radius: 50%;
      width: 20px;
      height: 20px;
      border: 2px solid white;
      box-shadow: 0 0 10px rgba(255,0,0,0.8);
    }
    .user-marker-dot {
      background-color: #00ff41;
      border-radius: 50%;
      width: 16px;
      height: 16px;
      border: 3px solid white;
      box-shadow: 0 0 10px rgba(0,255,65,0.8);
      position: absolute;
      top: 0;
      left: 0;
    }
    .user-marker {
      background: transparent;
      border: none;
    }
    @keyframes navTargetPulse {
      0% { transform: scale(1); box-shadow: 0 0 10px rgba(255,0,0,0.8); }
      50% { transform: scale(1.5); box-shadow: 0 0 20px rgba(255,0,0,1); }
      100% { transform: scale(1); box-shadow: 0 0 10px rgba(255,0,0,0.8); }
    }
    .nav-target {
      animation: navTargetPulse 1s infinite !important;
      z-index: 9999 !important;
    }
  </style>
  <script>
    ${js}
  </script>
</head>
<body>
  <div id="map"></div>
  <script>
    // 1. Define OfflineTileLayer
    const OfflineTileLayer = L.TileLayer.extend({
      createTile: function(coords, done) {
        const img = document.createElement('img');
        const key = 'tile_' + coords.z + '_' + coords.x + '_' + coords.y;
        
        // Request tile from React Native via postMessage
        if (window.ReactNativeWebView) {
          window.ReactNativeWebView.postMessage(JSON.stringify({
            type: 'GET_TILE',
            z: coords.z,
            x: coords.x,
            y: coords.y,
            key: key
          }));
        }
        
        // Store reference so we can populate it when RN responds
        window._pendingTiles = window._pendingTiles || {};
        window._pendingTiles[key] = { img, done };
        
        return img;
      }
    });

    // Initialize Map
    const map = L.map('map', {
      zoomControl: false,
      attributionControl: false
    }).setView([22.7722, 86.1445], 13);
    
    new OfflineTileLayer('', {
      minZoom: 10,
      maxZoom: 17
    }).addTo(map);

    map.whenReady(function() {
      if (window.ReactNativeWebView) {
        window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'MAP_READY' }));
      }
    });

    let userMarker = null;
    const sosMarkers = [];

    function updateUserLocation(lat, lng, heading, followMode) {
      const latlng = [lat, lng];

      // Remove existing markers
      if (userMarker) map.removeLayer(userMarker);

      // Create the pulsing blue dot for user location
      const userIcon = L.divIcon({
        className: '',
        html: \`
          <div style="
            width: 20px;
            height: 20px;
            background: #4A90E2;
            border: 3px solid white;
            border-radius: 50%;
            box-shadow: 0 0 0 2px #4A90E2;
            animation: pulse 2s infinite;
          "></div>
          <style>
            @keyframes pulse {
              0% { box-shadow: 0 0 0 0 rgba(74,144,226,0.6); }
              70% { box-shadow: 0 0 0 12px rgba(74,144,226,0); }
              100% { box-shadow: 0 0 0 0 rgba(74,144,226,0); }
            }
          </style>
        \`,
        iconSize: [20, 20],
        iconAnchor: [10, 10]
      });

      userMarker = L.marker(latlng, { icon: userIcon, zIndexOffset: 1000 })
        .addTo(map)
        .bindPopup('YOU ARE HERE');

      if (followMode) {
        // Smooth animated pan to new location
        map.setView(latlng, map.getZoom(), {
          animate: true,
          duration: 0.8,
          easeLinearity: 0.25
        });
      }
    }

    map.on('dragstart', function() {
      if (window.ReactNativeWebView) {
        window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'MAP_DRAGGED' }));
      }
    });

    window.handleTileResponse = function(key, base64) {
      if (window._pendingTiles && window._pendingTiles[key]) {
        const { img, done } = window._pendingTiles[key];
        img.src = 'data:image/png;base64,' + base64;
        done(null, img);
        delete window._pendingTiles[key];
      }
    };

    window.handleTileNotFound = function(key, z, x, y) {
      if (window._pendingTiles && window._pendingTiles[key]) {
        const { img, done } = window._pendingTiles[key];
        // If not cached, fallback to live URL
        img.src = 'https://tile.openstreetmap.org/' + z + '/' + x + '/' + y + '.png';
        done(null, img);
        delete window._pendingTiles[key];
      }
    };

    document.addEventListener('message', function(event) {
      handleMessage(event.data);
    });
    window.addEventListener('message', function(event) {
      handleMessage(event.data);
    });

    function handleMessage(dataStr) {
      try {
        const msg = JSON.parse(dataStr);
        if (msg.type === 'SET_LOCATION') {
          updateUserLocation(msg.lat, msg.lng, msg.heading, msg.followMode);
        } 
        else if (msg.type === 'ADD_PACKET') {
          const icon = L.divIcon({ className: 'sos-marker', iconSize: [20, 20], iconAnchor: [10, 10] });
          const marker = L.marker([msg.packet.location.lat, msg.packet.location.lng], { icon })
            .addTo(map)
            .bindPopup('SOS: ' + msg.packet.type + '<br/>Distance: ' + msg.packet.distanceKm + ' km');
          
          marker.packetId = msg.packet.packetId;
          marker.on('click', function() {
            if (window.ReactNativeWebView) {
              window.ReactNativeWebView.postMessage(JSON.stringify({
                type: 'BEACON_TAPPED',
                packetId: msg.packet.packetId
              }));
            }
          });

          sosMarkers.push(marker);
        }
        else if (msg.type === 'CLEAR') {
          sosMarkers.forEach(m => map.removeLayer(m));
          sosMarkers.length = 0;
        }
        else if (msg.type === 'START_NAVIGATION') {
          if (window._navPolyline) map.removeLayer(window._navPolyline);
          window._navPolyline = L.polyline([
            [msg.userLat, msg.userLng],
            [msg.targetLat, msg.targetLng]
          ], { color: 'red', dashArray: '5, 10', weight: 4 }).addTo(map);

          window._navTargetMarker = sosMarkers.find(m => m.packetId === msg.packetId);
          if (window._navTargetMarker && window._navTargetMarker._icon) {
            L.DomUtil.addClass(window._navTargetMarker._icon, 'nav-target');
          }

          const bounds = L.latLngBounds([
            [msg.userLat, msg.userLng],
            [msg.targetLat, msg.targetLng]
          ]);
          map.fitBounds(bounds, { padding: [60, 60] });
        }
        else if (msg.type === 'UPDATE_NAVIGATION') {
          if (window._navPolyline) {
            const latlngs = window._navPolyline.getLatLngs();
            latlngs[0] = L.latLng(msg.userLat, msg.userLng);
            window._navPolyline.setLatLngs(latlngs);

            const userPt = map.latLngToContainerPoint([msg.userLat, msg.userLng]);
            const mapSize = map.getSize();
            if (userPt.x < -200 || userPt.x > mapSize.x + 200 || userPt.y < -200 || userPt.y > mapSize.y + 200) {
                map.fitBounds(L.latLngBounds([latlngs[0], latlngs[1]]), { padding: [60, 60] });
            }
          }
        }
        else if (msg.type === 'STOP_NAVIGATION') {
          if (window._navPolyline) {
            map.removeLayer(window._navPolyline);
            window._navPolyline = null;
          }
          if (window._navTargetMarker && window._navTargetMarker._icon) {
            L.DomUtil.removeClass(window._navTargetMarker._icon, 'nav-target');
            window._navTargetMarker = null;
          }
          const group = new L.featureGroup(sosMarkers);
          if (sosMarkers.length > 0) {
            map.fitBounds(group.getBounds(), { padding: [40, 40] });
          }
        }
      } catch (e) {
        console.error(e);
      }
    }
  </script>
</body>
</html>`;

  const tsContent = `export function generateLeafletHTML(): string {\n  return \`${escapeForTemplateLiteral(html)}\`;\n}\n`;

  fs.writeFileSync('src/utils/LeafletMap.ts', tsContent);
  console.log('src/utils/LeafletMap.ts generated successfully.');
}

main().catch(console.error);
