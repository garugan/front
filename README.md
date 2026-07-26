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
VITE_REGISTRATION_ENABLED=true
```

`VITE_RECAPTCHA_ENABLED=false` の場合、ログイン/新規登録時に reCAPTCHA は実行されません。
本番では `true` にして、Google reCAPTCHA v3 の Site Key を `VITE_RECAPTCHA_SITE_KEY` に設定します。

利用者の登録が完了したら `VITE_REGISTRATION_ENABLED=false` で再ビルドし、新規登録UIを
非表示にします。バックエンドの `REGISTRATION_ENABLED=false` も同時に設定してください。

ホームの店舗一覧には写真を表示しません。Google Placesの写真は店舗詳細画面を開いたとき
だけ取得し、画面を閉じると破棄します。写真URLはlocalStorageへ保存しません。

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
