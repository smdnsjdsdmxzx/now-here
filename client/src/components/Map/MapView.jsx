import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
} from "react-leaflet";
import { CustomZoom, RecenterMap } from "./MapUtils";

export default function MapView({
  location,
  posts,
  route,
  getRoute,
  getAddress,
  selectedPlace,
  setSelectedPlace,
  searchLocation,
}) {
  return (
    <MapContainer center={location} zoom={16} zoomControl={false} style={{ height: "100vh" }}>
      <CustomZoom />
      <RecenterMap location={searchLocation || location} />

      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

      <Marker position={location}>
        <Popup>Sen buradasın</Popup>
      </Marker>

      {route && <Polyline positions={route} color="blue" />}

      {posts.map((p) => (
        <Marker
          key={p._id}
          position={[p.lat, p.lng]}
          eventHandlers={{
            click: async () => {
              const address = await getAddress(p.lat, p.lng);
              setSelectedPlace({ lat: p.lat, address });
            },
          }}
        >
          <Popup>
            {selectedPlace?.lat === p.lat && <b>{selectedPlace.address}</b>}
            <br />
            {p.description}
            <br />
            {p.image && <img src={p.image} width="120" />}
            <br />
            <button onClick={() => getRoute(p.lat, p.lng)}>🚗</button>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}