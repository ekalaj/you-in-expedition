// Approximate neighborhood coordinates. In production these come from geocoding
// the meeting place (Mapbox/Google). Only neighborhood-level points are stored.
export const AREAS: Record<string, { lat: number; lng: number }> = {
  Oakdale: { lat: 42.462, lng: -83.104 },
  Riverside: { lat: 42.411, lng: -83.162 },
  Greenfield: { lat: 42.383, lng: -83.118 },
};

export const AREA_NAMES = Object.keys(AREAS);

// PostGIS EWKT for a geography(point) column, or null if the area is unknown.
export function areaToEwkt(area: string | null | undefined): string | null {
  if (!area) return null;
  const c = AREAS[area];
  return c ? `SRID=4326;POINT(${c.lng} ${c.lat})` : null;
}
