import { useEffect, useRef, useState } from "react";
import "./Camera.css";

export default function Camera({ onCapture, onClose }) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    async function startCamera() {
      if (!navigator.mediaDevices?.getUserMedia) {
        setError("Bu tarayici kamera erisimini desteklemiyor.");
        return;
      }

      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: { ideal: "environment" } },
          audio: false,
        });

        if (!active) {
          stream.getTracks().forEach((track) => track.stop());
          return;
        }

        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
        setReady(true);
      } catch (err) {
        setError(err.message || "Kamera acilamadi.");
      }
    }

    startCamera();

    return () => {
      active = false;
      stopStream();
    };
  }, []);

  function stopStream() {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
  }

  function closeCamera() {
    stopStream();
    onClose();
  }

  function capturePhoto() {
    const canvas = canvasRef.current;
    const video = videoRef.current;

    if (!canvas || !video || !video.videoWidth) {
      setError("Kamera goruntusu henuz hazir degil.");
      return;
    }

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext("2d").drawImage(video, 0, 0, canvas.width, canvas.height);

    const imageData = canvas.toDataURL("image/jpeg", 0.82);
    stopStream();
    onCapture(imageData);
  }

  return (
    <div className="camera-screen">
      {error ? (
        <div className="camera-error">
          <strong>Kamera kullanilamiyor</strong>
          <p>{error}</p>
          <button type="button" onClick={closeCamera}>
            Kapat
          </button>
        </div>
      ) : (
        <>
          <video ref={videoRef} autoPlay muted playsInline className="camera-video" />
          <canvas ref={canvasRef} hidden />
          <div className="camera-controls">
            <button type="button" className="camera-secondary" onClick={closeCamera}>
              Vazgec
            </button>
            <button
              type="button"
              className="camera-shutter"
              onClick={capturePhoto}
              disabled={!ready}
              aria-label="Fotograf cek"
            />
          </div>
        </>
      )}
    </div>
  );
}
