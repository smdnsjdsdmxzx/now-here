import { useEffect, useRef, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
} from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// ICON FIX
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

function App() {
  const [posts, setPosts] = useState([]);
  const [text, setText] = useState("");
  const [image, setImage] = useState(null);
  const [location, setLocation] = useState(null);

  const [placeSearch, setPlaceSearch] = useState("");
  const [places, setPlaces] = useState([]);
  const [selectedPlace, setSelectedPlace] = useState(null);

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const fileInputRef = useRef(null);

  // 🔥 POSTLARI GETİR (GRUPLU)
  const fetchPosts = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/posts");
      const data = await res.json();
      setPosts(data);
    } catch (e) {
      console.error(e);
    }
  };

  // 📍 KONUM + POST
  useEffect(() => {
    navigator.geolocation.getCurrentPosition((pos) => {
      setLocation([pos.coords.latitude, pos.coords.longitude]);
    });

    fetchPosts();
  }, []);

  // 🔍 MEKAN
  const searchPlaces = async () => {
    if (!placeSearch) return;

    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${placeSearch}`
    );
    const data = await res.json();
    setPlaces(data);
  };

  // 📷 KAMERA
  const openCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
      });

      videoRef.current.srcObject = stream;
    } catch (e) {
      console.error(e);
      alert("Kamera açılamadı");
    }
  };

  const takePhoto = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;

    if (!video.srcObject) return alert("Önce kamera aç");

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const ctx = canvas.getContext("2d");
    ctx.drawImage(video, 0, 0);

    const img = canvas.toDataURL("image/png");
    setImage(img);

    video.srcObject.getTracks().forEach((t) => t.stop());
  };

  // 🖼️ GALERİ
  const openGallery = () => {
    fileInputRef.current.click();
  };

  const handleGallery = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setImage(reader.result);
    };
    reader.readAsDataURL(file);
  };

  // 🚀 POST
  const addPost = async () => {
    if (!text || !selectedPlace) {
      return alert("Yazı ve mekan seç!");
    }

    await fetch("http://localhost:5000/api/posts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        description: text,
        lat: selectedPlace.lat,
        lng: selectedPlace.lon,
        placeName: selectedPlace.display_name,
        image,
      }),
    });

    setText("");
    setImage(null);
    setSelectedPlace(null);
    setPlaces([]);

    fetchPosts();
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>NowHere 🚀</h1>

      {/* TEXT */}
      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Ne yapıyorsun?"
      />

      {/* BUTTONS */}
      <div>
        <button onClick={openCamera}>📷 Kamera</button>
        <button onClick={takePhoto}>📸 Çek</button>
        <button onClick={openGallery}>🖼️ Galeri</button>
      </div>

      {/* GALERİ */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleGallery}
        style={{ display: "none" }}
      />

      {/* VIDEO */}
      <video ref={videoRef} autoPlay style={{ width: "200px" }} />
      <canvas ref={canvasRef} style={{ display: "none" }} />

      {/* PREVIEW */}
      {image && <img src={image} style={{ width: "150px" }} />}

      {/* MEKAN */}
      <input
        value={placeSearch}
        onChange={(e) => setPlaceSearch(e.target.value)}
        placeholder="Mekan ara..."
      />
      <button onClick={searchPlaces}>Ara</button>

      {places.map((p, i) => (
        <div
          key={i}
          onClick={() => {
            setSelectedPlace(p);
            setLocation([p.lat, p.lon]);
            setPlaces([]);
          }}
        >
          📍 {p.display_name}
        </div>
      ))}

      {selectedPlace && (
        <p>📍 Seçilen: {selectedPlace.display_name}</p>
      )}

      <button onClick={addPost}>Paylaş</button>

      <hr />

      {/* HARİTA */}
      {location && (
        <MapContainer
          center={location}
          zoom={13}
          style={{ height: "500px" }}
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

          {/* 🔥 CLUSTER */}
          <MarkerClusterGroup>
            {posts.map((group, i) => (
              <Marker key={i} position={[group.lat, group.lng]}>
                <Popup>
                  <b>{group.placeName}</b>
                  <br />
                  👥 {group.peopleCount} kişi burada
                  <hr />

                  {group.posts.map((p) => (
                    <div key={p._id}>
                      <b>{p.description}</b>
                      <br />
                      {p.image && (
                        <img
                          src={p.image}
                          style={{ width: "120px" }}
                        />
                      )}
                      <hr />
                    </div>
                  ))}
                </Popup>
              </Marker>
            ))}
          </MarkerClusterGroup>
        </MapContainer>
      )}
    </div>
  );
}

export default App;