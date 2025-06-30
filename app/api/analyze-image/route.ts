import { NextRequest, NextResponse } from 'next/server';
import { ImageAnnotatorClient } from '@google-cloud/vision';

// Google Cloud Vision APIクライアントの初期化
let client: ImageAnnotatorClient;

try {
  const credentials = process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON;
  if (!credentials) {
    throw new Error('GOOGLE_APPLICATION_CREDENTIALS_JSON is not set');
  }

  client = new ImageAnnotatorClient({
    credentials: JSON.parse(credentials),
    projectId: process.env.GOOGLE_CLOUD_PROJECT_ID,
  });
  // client = new ImageAnnotatorClient();
} catch (error) {
  console.error('Failed to initialize Google Cloud Vision client:', error);
}

export async function POST(request: NextRequest) {
  try {
    // クライアントが初期化されていない場合のエラーハンドリング
    if (!client) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Google Cloud Vision API client is not initialized. Please check your credentials.' 
        },
        { status: 500 }
      );
    }

    const body = await request.json();
    const { image } = body;

    if (!image) {
      return NextResponse.json(
        { success: false, error: 'No image provided' },
        { status: 400 }
      );
    }

    // Base64画像をバッファに変換
    // data:image/png;base64, の部分を除去
    const base64Data = image.split(',')[1];
    if (!base64Data) {
      return NextResponse.json(
        { success: false, error: 'Invalid image format' },
        { status: 400 }
      );
    }

    const imageBuffer = Buffer.from(base64Data, 'base64');

    console.log('Analyzing image with Google Cloud Vision API...');

    // Vision APIでテキスト検出
    const [result] = await client.textDetection({
      image: { content: imageBuffer },
    });

    const textAnnotations = result.textAnnotations || [];

    console.log('Analysis complete. Found', textAnnotations.length, 'text annotations');

    // 最初の要素は全体のテキスト、残りは個別の単語/フレーズ
    const fullText = textAnnotations.length > 0 ? (textAnnotations[0].description || '') : '';
    const detectedTexts = textAnnotations.slice(1).map(annotation => ({
      text: annotation.description || '',
      confidence: 0, // テキスト検出では信頼度スコアが提供されない場合が多い
      // バウンディングボックスの座標も取得
      boundingBox: annotation.boundingPoly?.vertices || []
    }));

    console.log('Full text:', fullText);
    console.log('Detected texts count:', detectedTexts.length);

    return NextResponse.json({
      success: true,
      fullText: fullText,
      detectedTexts: detectedTexts.slice(0, 20) // 上位20件のテキスト要素
    });
    
  } catch (error) {
    console.error('Vision API Error:', error);
    
    // エラーの種類に応じてメッセージを変更
    let errorMessage = 'Image analysis failed';
    if (error instanceof Error) {
      if (error.message.includes('quota')) {
        errorMessage = 'API quota exceeded. Please try again later.';
      } else if (error.message.includes('permission')) {
        errorMessage = 'Permission denied. Please check your API credentials.';
      } else if (error.message.includes('invalid')) {
        errorMessage = 'Invalid image format.';
      }
    }

    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 }
    );
  }
}
