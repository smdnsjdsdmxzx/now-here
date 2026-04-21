import { useEffect } from "react";
import { startCamera, takePhoto } from "./Camera";

export default function PostPanel({
  text,
  setText,
  handleShare,
  image,
  setImage,
  cameraOpen,
  setCameraOpen,
  videoRef,
  canvasRef,
}) {
  const handleFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => setImage(reader.result);
    reader.readAsDataURL(file);
  };

  // 🔥 kamera açılınca başlat
  useEffect(() => {
    if (cameraOpen && videoRef.current) {
      startCamera(videoRef);
    }
  }, [cameraOpen]);

  return (
    <div
      style={{
        position: "absolute",
        top: 20,
        left: 20,
        zIndex: 1000,
        background: "black",
        padding: 10,
        borderRadius: 10,
      }}
    >
      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Ne yapıyorsun?"
      />

      <button onClick={handleShare}>Paylaş</button>

      <br />

      <button onClick={() => setCameraOpen(true)}>📷 Kamera</button>
      <input type="file" onChange={handleFile} />

      {cameraOpen && (
        <div
          style={{
            marginTop: 10,
            background: "#111",
            padding: 10,
            borderRadius: 10,
          }}
        >
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            style={{ width: 250, borderRadius: 10 }}
          />

          <br />

          <button
            onClick={() =>
              takePhoto(videoRef, canvasRef, setImage, setCameraOpen)
            }
          >
            📸 Çek
          </button>
        </div>
      )}

      <canvas ref={canvasRef} style={{ display: "none" }} />

      {image && (
        <img src={image} width="100" style={{ marginTop: 10 }} />
      )}
    </div>
  );
}