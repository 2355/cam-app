'use client';

import Image from 'next/image';

interface PhotoDisplayProps {
  photo: string | null;
}

export default function PhotoDisplay({ photo }: PhotoDisplayProps) {
  if (!photo) return null;

  return (
    <div style={{ marginTop: '2rem' }}>
      <h2>撮影した画像</h2>
      <Image
        src={photo} 
        alt="撮影結果" 
        width={320}
        height={240}
        style={{
          border: '2px solid #ddd',
          borderRadius: '8px',
          boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
        }}
      />
    </div>
  );
}
