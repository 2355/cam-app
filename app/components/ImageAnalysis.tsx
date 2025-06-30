'use client';

import { useState } from 'react';

interface DetectedText {
  text: string;
  confidence: number;
  boundingBox: Array<{x?: number, y?: number}>;
}

interface ImageAnalysisProps {
  photo: string | null;
}

export default function ImageAnalysis({ photo }: ImageAnalysisProps) {
  const [fullText, setFullText] = useState<string>('');
  const [detectedTexts, setDetectedTexts] = useState<DetectedText[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isCopied, setIsCopied] = useState(false);

  const analyzeImage = async () => {
    if (!photo) return;

    setIsAnalyzing(true);
    setError(null);

    try {
      console.log('Sending image for analysis...');
      
      const response = await fetch('/api/analyze-image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ image: photo }),
      });

      const result = await response.json();
      console.log('Analysis result:', result);

      if (result.success) {
        console.log('Setting fullText:', result.fullText);
        console.log('Setting detectedTexts:', result.detectedTexts);
        setFullText(result.fullText || '');
        setDetectedTexts(result.detectedTexts || []);
      } else {
        setError(result.error || '画像解析に失敗しました');
      }
    } catch (err) {
      console.error('Network error:', err);
      setError('ネットワークエラーが発生しました');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const copyToClipboard = async () => {
    if (!fullText) return;
    
    try {
      await navigator.clipboard.writeText(fullText);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000); // 2秒後にリセット
    } catch (err) {
      console.error('Failed to copy text:', err);
    }
  };

  if (!photo) return null;

  return (
    <div style={{ margin: '2rem', textAlign: 'center' }}>
      <button
        onClick={analyzeImage}
        disabled={isAnalyzing}
        style={{
          padding: '0.75rem 1.5rem',
          fontSize: '1rem',
          backgroundColor: isAnalyzing ? '#6c757d' : '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: '6px',
          cursor: isAnalyzing ? 'not-allowed' : 'pointer',
          fontWeight: 'bold',
          transition: 'background-color 0.2s'
        }}
        onMouseOver={(e) => {
          if (!isAnalyzing) {
            e.currentTarget.style.backgroundColor = '#0056b3';
          }
        }}
        onMouseOut={(e) => {
          if (!isAnalyzing) {
            e.currentTarget.style.backgroundColor = '#007bff';
          }
        }}
      >
        {isAnalyzing ? '🔍 解析中...' : '📝 テキストを検出'}
      </button>

      {error && (
        <div style={{
          margin: '1rem 0',
          padding: '0.75rem',
          backgroundColor: '#ffebee',
          border: '1px solid #f44336',
          borderRadius: '6px',
          color: '#c62828',
          fontSize: '0.9rem'
        }}>
          <strong>エラー:</strong> {error}
        </div>
      )}

      {(fullText || (detectedTexts && detectedTexts.length > 0)) && (
        <div style={{
          margin: '1rem 0',
          padding: '1rem',
          backgroundColor: '#f8f9fa',
          border: '1px solid #dee2e6',
          borderRadius: '8px',
          textAlign: 'left',
          maxWidth: '500px',
          marginLeft: 'auto',
          marginRight: 'auto'
        }}>
          <h3 style={{ 
            margin: '0 0 1rem 0', 
            textAlign: 'center',
            color: '#495057',
            fontSize: '1.1rem'
          }}>
            📝 検出されたテキスト
          </h3>
          
          {fullText && (
            <div style={{
              marginBottom: '1rem',
              padding: '0.75rem',
              backgroundColor: '#ffffff',
              border: '1px solid #dee2e6',
              borderRadius: '6px'
            }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '0.5rem'
              }}>
                <h4 style={{
                  margin: '0',
                  color: '#28a745',
                  fontSize: '0.9rem'
                }}>
                  全体のテキスト:
                </h4>
                <button
                  onClick={copyToClipboard}
                  style={{
                    padding: '0.25rem 0.5rem',
                    fontSize: '0.75rem',
                    backgroundColor: isCopied ? '#28a745' : '#007bff',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    transition: 'background-color 0.2s'
                  }}
                >
                  {isCopied ? '✓ コピー済み' : '📋 コピー'}
                </button>
              </div>
              <p style={{
                margin: 0,
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-word',
                fontSize: '0.9rem',
                lineHeight: 1.4,
                color: '#212529'
              }}>
                {fullText}
              </p>
            </div>
          )}

          {detectedTexts && detectedTexts.length > 0 && (
            <div>
              <h4 style={{
                margin: '0 0 0.5rem 0',
                color: '#007bff',
                fontSize: '0.9rem'
              }}>
                個別のテキスト要素:
              </h4>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                {detectedTexts.map((textItem, index) => (
                  <li key={index} style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '0.5rem 0',
                    borderBottom: index < detectedTexts.length - 1 ? '1px solid #dee2e6' : 'none'
                  }}>
                    <span style={{ 
                      fontWeight: 'bold',
                      color: '#495057',
                      fontSize: '0.85rem',
                      wordBreak: 'break-word',
                      flex: 1,
                      marginRight: '0.5rem'
                    }}>
                      &ldquo;{textItem.text || ''}&rdquo;
                    </span>
                    {/* テキスト検出では信頼度スコアが利用できないため、表示しない */}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
