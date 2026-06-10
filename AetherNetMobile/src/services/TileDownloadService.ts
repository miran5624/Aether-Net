import AsyncStorage from '@react-native-async-storage/async-storage';

export interface DownloadProgress {
  downloaded: number;
  total: number;
  percentage: number;
  status: 'idle' | 'downloading' | 'complete' | 'error';
}

export function latLngToTile(lat: number, lng: number, zoom: number) {
  const n = Math.pow(2, zoom);
  const x = Math.floor(((lng + 180) / 360) * n);
  const latRad = (lat * Math.PI) / 180;
  const y = Math.floor(
    ((1 - Math.log(Math.tan(latRad) + 1 / Math.cos(latRad)) / Math.PI) / 2) * n
  );
  return { x, y };
}

export function getTileBounds(lat: number, lng: number, radiusKm: number, zoom: number) {
  const degreesPerKm = 1 / 111.0;
  const latDiff = radiusKm * degreesPerKm;
  const lngDiff = radiusKm * (degreesPerKm / Math.cos((lat * Math.PI) / 180));

  const minLatLng = { lat: lat - latDiff, lng: lng - lngDiff };
  const maxLatLng = { lat: lat + latDiff, lng: lng + lngDiff };

  const minTile = latLngToTile(maxLatLng.lat, minLatLng.lng, zoom);
  const maxTile = latLngToTile(minLatLng.lat, maxLatLng.lng, zoom);

  return {
    xMin: minTile.x,
    xMax: maxTile.x,
    yMin: minTile.y,
    yMax: maxTile.y,
  };
}

const delay = (ms: number) => new Promise<void>(resolve => setTimeout(() => resolve(), ms));

async function fetchTileBase64(z: number, x: number, y: number): Promise<string | null> {
  try {
    const url = `https://tile.openstreetmap.org/${z}/${x}/${y}.png`;
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'AetherNet-Emergency/1.0',
      },
    });

    if (!response.ok) {
      return null;
    }

    const blob = await response.blob();
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          // returns data:image/png;base64,... 
          // we only need the base64 part, or we can store the whole data URL.
          // Let's store just the base64 string to be clean, or the data string itself.
          // The instructions say "base64 data" and later "data:image/png;base64," + data.base64
          // so we'll strip the data url prefix.
          const base64 = reader.result.split(',')[1];
          resolve(base64);
        } else {
          reject(new Error('Failed to convert to base64'));
        }
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  } catch (error) {
    return null;
  }
}

export async function downloadTilesForLocation(
  lat: number,
  lng: number,
  onProgress: (p: DownloadProgress) => void
): Promise<void> {
  try {
    onProgress({ downloaded: 0, total: 0, percentage: 0, status: 'downloading' });

    const tilesToDownload: { z: number; x: number; y: number }[] = [];

    // 50km radius for zoom levels 10-15
    for (let z = 10; z <= 15; z++) {
      const bounds = getTileBounds(lat, lng, 50, z);
      for (let x = bounds.xMin; x <= bounds.xMax; x++) {
        for (let y = bounds.yMin; y <= bounds.yMax; y++) {
          tilesToDownload.push({ z, x, y });
        }
      }
    }

    // 5km radius for zoom levels 16-17
    for (let z = 16; z <= 17; z++) {
      const bounds = getTileBounds(lat, lng, 5, z);
      for (let x = bounds.xMin; x <= bounds.xMax; x++) {
        for (let y = bounds.yMin; y <= bounds.yMax; y++) {
          tilesToDownload.push({ z, x, y });
        }
      }
    }

    const total = tilesToDownload.length;
    let downloaded = 0;

    onProgress({ downloaded, total, percentage: 0, status: 'downloading' });

    const CONCURRENCY = 15;
    let i = 0;

    const worker = async () => {
      while (i < total) {
        const index = i++;
        const tile = tilesToDownload[index];
        const key = `tile_${tile.z}_${tile.x}_${tile.y}`;
        try {
          const isCached = await AsyncStorage.getItem(key);
          if (!isCached) {
            const base64 = await fetchTileBase64(tile.z, tile.x, tile.y);
            if (base64) {
              await AsyncStorage.setItem(key, base64);
            }
          }
        } catch (error) {
          // Ignore individual tile errors
        }

        downloaded++;
        // Emit progress periodically to avoid UI lag
        if (downloaded % 50 === 0 || downloaded === total) {
          onProgress({
            downloaded,
            total,
            percentage: Math.floor((downloaded / total) * 100),
            status: 'downloading',
          });
        }
      }
    };

    const workers = [];
    for (let w = 0; w < CONCURRENCY; w++) {
      workers.push(worker());
    }

    await Promise.all(workers);

    // After completion, save metadata
    await AsyncStorage.setItem('tile_cache_lat', lat.toString());
    await AsyncStorage.setItem('tile_cache_lng', lng.toString());
    await AsyncStorage.setItem('tile_cache_date', Date.now().toString());

    onProgress({ downloaded: total, total, percentage: 100, status: 'complete' });
  } catch (error) {
    console.error('Error downloading tiles:', error);
    onProgress({ downloaded: 0, total: 0, percentage: 0, status: 'error' });
  }
}

export async function isTileCached(z: number, x: number, y: number): Promise<boolean> {
  const key = `tile_${z}_${x}_${y}`;
  const value = await AsyncStorage.getItem(key);
  return value !== null;
}

export async function getTile(z: number, x: number, y: number): Promise<string | null> {
  const key = `tile_${z}_${x}_${y}`;
  return await AsyncStorage.getItem(key);
}

function getDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371; // Radius of the earth in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c; // Distance in km
  return d;
}

export async function isCacheValid(lat: number, lng: number): Promise<boolean> {
  try {
    const cachedLatStr = await AsyncStorage.getItem('tile_cache_lat');
    const cachedLngStr = await AsyncStorage.getItem('tile_cache_lng');
    const cachedDateStr = await AsyncStorage.getItem('tile_cache_date');

    if (!cachedLatStr || !cachedLngStr || !cachedDateStr) {
      return false;
    }

    const cachedLat = parseFloat(cachedLatStr);
    const cachedLng = parseFloat(cachedLngStr);
    const cachedDate = parseInt(cachedDateStr, 10);

    const distanceKm = getDistanceKm(lat, lng, cachedLat, cachedLng);
    if (distanceKm > 10) {
      return false; // Moved more than 10km
    }

    const THIRTY_DAYS_MS = 30 * 24 * 60 * 60 * 1000;
    if (Date.now() - cachedDate > THIRTY_DAYS_MS) {
      return false; // Cache older than 30 days
    }

    return true;
  } catch (error) {
    return false;
  }
}
