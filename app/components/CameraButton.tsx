'use client';

interface CameraButtonProps {
  onClick: () => void;
}

export default function CameraButton({ onClick }: CameraButtonProps) {
  return (
    <button 
      onClick={onClick} 
      style={{ 
        margin: '1rem',
        padding: '0.75rem 1.5rem',
        fontSize: '1.1rem',
        backgroundColor: '#007bff',
        color: 'white',
        border: 'none',
        borderRadius: '8px',
        cursor: 'pointer',
        transition: 'background-color 0.2s'
      }}
      onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#0056b3'}
      onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#007bff'}
    >
      📸 写真を撮る
    </button>
  );
}
