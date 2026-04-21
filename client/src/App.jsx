import { useRef, useState } from "react";

import useLocation from "./hooks/useLocation";
import usePosts from "./hooks/usePosts";

import MapView from "./components/Map/MapView";
import PostPanel from "./components/Post/PostPanel";
import SearchBox from "./components/Search/SearchBox";

export default function App() {
  const location = useLocation();
  const { posts, setPosts } = usePosts();

  const [text, setText] = useState("");
  const [image, setImage] = useState(null);
  const [cameraOpen, setCameraOpen] = useState(false);

  const [search, setSearch] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [searchLocation, setSearchLocation] = useState(null);

  const [route, setRoute] = useState(null);
  const [selectedPlace, setSelectedPlace] = useState(null);

  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const handleShare = () => {
    if (!text || text.length < 3) return alert("Min 3 karakter");

    const newPost = {
      _id: Date.now(),
      description: text,
      lat: location[0],
      lng: location[1],
      image,
    };

    setPosts((prev) => [...prev, newPost]);

    setText("");
    setImage(null);
  };

  const getRoute = async (lat, lng) => {
    const res = await fetch(
      `https://router.project-osrm.org/route/v1/driving/${location[1]},${location[0]};${lng},${lat}?overview=full&geometries=geojson`
    );

    const data = await res.json();

    const coords = data.routes[0].geometry.coordinates.map((c) => [
      c[1],
      c[0],
    ]);

    setRoute(coords);
  };

  const getAddress = async (lat, lng) => {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
    );
    const data = await res.json();
    return data.display_name;
  };

  return (
    <div>
      <PostPanel
        text={text}
        setText={setText}
        handleShare={handleShare}
        image={image}
        setImage={setImage}
        cameraOpen={cameraOpen}
        setCameraOpen={setCameraOpen}
        videoRef={videoRef}
        canvasRef={canvasRef}
      />

      <SearchBox
        search={search}
        setSearch={setSearch}
        suggestions={suggestions}
        setSuggestions={setSuggestions}
        setSearchLocation={setSearchLocation}
      />

      <MapView
        location={location}
        posts={posts}
        route={route}
        getRoute={getRoute}
        getAddress={getAddress}
        selectedPlace={selectedPlace}
        setSelectedPlace={setSelectedPlace}
        searchLocation={searchLocation}
      />
    </div>
  );
}