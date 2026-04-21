export async function startCamera(videoRef) {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: false,
    });

    videoRef.current.srcObject = stream;

    await videoRef.current.play();
  } catch (err) {
    console.log("KAMERA HATASI:", err);
    alert("Kamera açılamadı");
  }
}

export function stopCamera(videoRef) {
  if (videoRef.current?.srcObject) {
    videoRef.current.srcObject.getTracks().forEach((t) => t.stop());
  }
}

export function takePhoto(videoRef, canvasRef, setImage, setCameraOpen) {
  const video = videoRef.current;
  const canvas = canvasRef.current;

  if (!video || !canvas) return;

  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;

  const ctx = canvas.getContext("2d");
  ctx.drawImage(video, 0, 0);

  setImage(canvas.toDataURL("image/png"));

  stopCamera(videoRef);
  setCameraOpen(false);
}