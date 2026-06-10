/**
 * Calculates the great-circle distance between two GPS coordinates
 * using the Haversine formula.
 *
 * Formula:
 *   a = sin²(Δlat/2) + cos(lat1) * cos(lat2) * sin²(Δlng/2)
 *   c = 2 * atan2(√a, √(1−a))
 *   d = R * c   where R = 6371 km (Earth's mean radius)
 *
 * @param lat1 - Latitude of point 1 in decimal degrees
 * @param lng1 - Longitude of point 1 in decimal degrees
 * @param lat2 - Latitude of point 2 in decimal degrees
 * @param lng2 - Longitude of point 2 in decimal degrees
 * @returns Distance in kilometres, rounded to 2 decimal places. Returns 0 on error.
 */
export function getDistanceKm(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number,
): number {
  try {
    const R = 6371; // Earth radius in km
    const toRad = (deg: number) => (deg * Math.PI) / 180;

    const dLat = toRad(lat2 - lat1);
    const dLng = toRad(lng2 - lng1);

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(lat1)) *
        Math.cos(toRad(lat2)) *
        Math.sin(dLng / 2) *
        Math.sin(dLng / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;

    return Math.round(distance * 100) / 100;
  } catch {
    return 0;
  }
}

export function getBearing(
  lat1: number, lng1: number,
  lat2: number, lng2: number
): number {
  const lat1Rad = lat1 * Math.PI / 180;
  const lat2Rad = lat2 * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const x = Math.sin(dLng) * Math.cos(lat2Rad);
  const y = Math.cos(lat1Rad) * Math.sin(lat2Rad) -
            Math.sin(lat1Rad) * Math.cos(lat2Rad) * Math.cos(dLng);
  const bearing = (Math.atan2(x, y) * 180 / Math.PI + 360) % 360;
  return Math.round(bearing);
}

export function bearingToCardinal(bearing: number): string {
  const directions = ['N','NNE','NE','ENE','E','ESE','SE','SSE',
                      'S','SSW','SW','WSW','W','WNW','NW','NNW'];
  return directions[Math.round(bearing / 22.5) % 16];
}
