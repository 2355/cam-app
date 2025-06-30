# 📷 カメラ検証アプリ

ブラウザでカメラを使った写真撮影と、Google Cloud Vision APIを使用したテキスト解析を行うWebアプリケーションです。

## 🌟 機能

- **📱 カメラ撮影機能**
  - インカメラ・アウトカメラの切り替え
  - カメラのオン・オフ切り替え
  - プライバシー配慮（デフォルトでカメラオフ）

- **📝 テキスト解析機能**
  - Google Cloud Vision APIによる文字認識
  - 撮影した画像からテキストを自動抽出
  - 全体テキスト・個別要素の表示

- **🔧 技術仕様**
  - Next.js 15 (App Router)
  - TypeScript
  - Google Cloud Vision API
  - HTTPS対応（モバイルデバイス対応）

## 🚀 セットアップ

### 1. 依存関係のインストール

```bash
npm install
```

### 2. Google Cloud Vision API の設定

1. [Google Cloud Console](https://console.cloud.google.com/)でプロジェクトを作成
2. Vision APIを有効化
3. サービスアカウントを作成し、認証情報をダウンロード
4. `.env.local`ファイルを作成：

```env
# Google Cloud Vision API設定
GOOGLE_APPLICATION_CREDENTIALS_JSON={"type":"service_account",...}
GOOGLE_CLOUD_PROJECT_ID=your-project-id
```

### 3. 開発サーバーの起動

#### HTTP版（localhost用）
```bash
npm run dev
```

#### HTTPS版（モバイルデバイス・WiFi経由アクセス用）
```bash
npm run dev:https
```

### 4. アクセス

- **PC**: `http://localhost:3000` または `https://localhost:3000`
- **モバイル**: `https://192.168.x.x:3000` (HTTPS必須)

## 📱 使い方

1. **カメラをオン** - 「📷 カメラをオン」ボタンをクリック
2. **カメラ切り替え** - 「🔄 インカメラ/アウトカメラ」ボタンで切り替え
3. **写真撮影** - 「📸 写真を撮る」ボタンで撮影
4. **テキスト解析** - 「📝 テキストを検出」ボタンで文字認識

## 🔒 プライバシー

- アプリ起動時はカメラがオフ状態
- ユーザーが明示的にオンにした場合のみカメラが起動
- カメラオフ時でも撮影済み画像と解析結果は保持

## 🛠 技術スタック

- **フロントエンド**: Next.js 15, TypeScript, React 19
- **バックエンド**: Next.js API Routes
- **AI/ML**: Google Cloud Vision API
- **開発ツール**: ESLint, Tailwind CSS

## 📂 プロジェクト構造

```
app/
├── api/
│   └── analyze-image/
│       └── route.ts          # Vision API との通信
├── components/
│   ├── CameraButton.tsx      # 撮影ボタン
│   ├── PhotoDisplay.tsx      # 画像表示
│   └── ImageAnalysis.tsx     # テキスト解析
├── globals.css
├── layout.tsx
└── page.tsx                  # メインページ
```

## 🌐 注意事項

- **HTTPS必須**: モバイルデバイスからアクセスする場合はHTTPS環境が必要
- **カメラ権限**: ブラウザでカメラの使用許可が必要
- **API制限**: Google Cloud Vision APIの使用量・料金にご注意ください
