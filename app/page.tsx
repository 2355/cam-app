'use client';

import { useEffect, useRef, useState } from 'react';
import CameraButton from './components/CameraButton';
import PhotoDisplay from './components/PhotoDisplay';

export default function Page() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [photo, setPhoto] = useState<string | null>(null);

  useEffect(() => {
    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.error('カメラの起動に失敗しました:', err);
      }
    };

    startCamera();
  }, []);

  const takePhoto = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const context = canvas.getContext('2d');
    if (!context) return;

    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    const dataUrl = canvas.toDataURL('image/png');
    setPhoto(dataUrl);
  };

  return (
    <main style={{ textAlign: 'center', padding: '2rem' }}>
      <h1>📷 カメラアプリ（App Router）</h1>

      <video ref={videoRef} autoPlay playsInline width="320" height="240" />
      <br />
      <CameraButton onClick={takePhoto} />

      <canvas ref={canvasRef} style={{ display: 'none' }} />

      <PhotoDisplay photo={photo} />
    </main>
  );
}
