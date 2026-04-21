import { useEffect } from "react";
import { useMap } from "react-leaflet";
import L from "leaflet";

export function RecenterMap({ location }) {
  const map = useMap();

  useEffect(() => {
    if (location) map.setView(location, 16);
  }, [location]);

  return null;
}

export function CustomZoom() {
  const map = useMap();

  useEffect(() => {
    const zoom = L.control.zoom({ position: "bottomleft" });
    zoom.addTo(map);
    return () => zoom.remove();
  }, [map]);

  return null;
}