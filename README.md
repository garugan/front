# Mogu Frontend

Vite + React で作成した Mogu のフロントエンドです。

## 開発

```bash
npm install
npm run dev
```

## 環境変数

`.env.example` をコピーして `.env.local` を作成します。

```bash
cp .env.example .env.local
```

```env
VITE_API_BASE_URL=http://localhost:3000
VITE_RECAPTCHA_ENABLED=false
VITE_RECAPTCHA_SITE_KEY=your_recaptcha_site_key
```

`VITE_RECAPTCHA_ENABLED=false` の場合、ログイン/新規登録時に reCAPTCHA は実行されません。
本番では `true` にして、Google reCAPTCHA v3 の Site Key を `VITE_RECAPTCHA_SITE_KEY` に設定します。

## ビルド

```bash
npm run build
npm run preview
```

## 構成

```txt
front/
  src/
    app/
    styles/
  index.html
  vite.config.ts
```
