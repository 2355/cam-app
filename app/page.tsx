'use client';

import { useEffect, useRef, useState } from 'react';
import CameraButton from './components/CameraButton';
import PhotoDisplay from './components/PhotoDisplay';

export default function Page() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [photo, setPhoto] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const startCamera = async () => {
      try {
        // Check if mediaDevices is available
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
          throw new Error('このブラウザではカメラAPIがサポートされていません。HTTPSでアクセスしてください。');
        }

        console.log('Requesting camera access...');
        const stream = await navigator.mediaDevices.getUserMedia({ 
          video: { 
            width: { ideal: 320 },
            height: { ideal: 240 },
            facingMode: 'user'
          } 
        });
        
        console.log('Camera access granted, setting up video element...');
        
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          
          // Add event listeners to ensure video plays
          videoRef.current.onloadedmetadata = () => {
            console.log('Video metadata loaded');
            if (videoRef.current) {
              videoRef.current.play().catch(e => console.log('Play failed:', e));
            }
          };
          
          videoRef.current.oncanplay = () => {
            console.log('Video can start playing');
          };
          
          videoRef.current.onplaying = () => {
            console.log('Video is now playing');
          };
          
          setError(null);
        }
      } catch (err) {
        console.error('カメラの起動に失敗しました:', err);
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('カメラの起動に失敗しました。HTTPSでアクセスするか、localhostを使用してください。');
        }
      } finally {
        setIsLoading(false);
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

      {isLoading && (
        <div style={{ margin: '2rem', fontSize: '1.2rem' }}>
          カメラを起動中...
        </div>
      )}

      {error && (
        <div style={{ 
          margin: '2rem', 
          padding: '1rem', 
          backgroundColor: '#ffebee', 
          border: '1px solid #f44336', 
          borderRadius: '8px',
          color: '#c62828',
          fontSize: '1rem'
        }}>
          <strong>エラー:</strong> {error}
          <br />
          <br />
          <strong>解決方法:</strong>
          <ul style={{ textAlign: 'left', maxWidth: '500px', margin: '0 auto' }}>
            <li>HTTPSでアクセスしてください（例: https://192.168.x.x:3000）</li>
            <li>または、localhost:3000 でアクセスしてください</li>
            <li>ブラウザでカメラの許可を確認してください</li>
          </ul>
        </div>
      )}

      {!error && (
        <>
          <video 
            ref={videoRef} 
            autoPlay 
            playsInline 
            muted
            width="320" 
            height="240"
            style={{
              border: '2px solid #ddd',
              borderRadius: '8px',
              backgroundColor: '#f0f0f0',
              display: 'block',
              margin: '0 auto'
            }}
          />
          <br />
          {!isLoading && <CameraButton onClick={takePhoto} />}
        </>
      )}

      <canvas ref={canvasRef} style={{ display: 'none' }} />

      <PhotoDisplay photo={photo} />
    </main>
  );
}
