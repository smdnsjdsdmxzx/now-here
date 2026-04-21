import { useEffect, useState } from "react";

export default function useLocation() {
  const [location, setLocation] = useState([41.0082, 28.9784]);

  useEffect(() => {
    const watch = navigator.geolocation.watchPosition(
      (pos) =>
        setLocation([pos.coords.latitude, pos.coords.longitude]),
      console.log,
      { enableHighAccuracy: true }
    );
    return () => navigator.geolocation.clearWatch(watch);
  }, []);

  return location;
}