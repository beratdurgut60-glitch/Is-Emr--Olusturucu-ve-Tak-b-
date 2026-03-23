# Arıza & İş Emri Oluşturucu

Sahadaki operatörlerin arıza bildirimlerini standart bir formatta (JSON) oluşturup, bu veriyi QR kod aracılığıyla yetkili kişilere aktarmasını sağlayan web tabanlı, sunucu gerektirmeyen (client-side) bir araçtır.

## Özellikler

- ✅ Tüm zorunlu alanların validasyonu
- ✅ Hiyerarşik lokasyon seçimi
- ✅ Türkçe karakter temizleme
- ✅ JSON formatında veri üretimi
- ✅ QR kod oluşturma
- ✅ Modern ve responsive UI/UX
- ✅ Erişilebilirlik özellikleri

## Kurulum

```bash
npm install
```

## Geliştirme

```bash
npm run dev
```

Uygulama [http://localhost:3000](http://localhost:3000) adresinde çalışacaktır.

## Build

```bash
npm run build
npm start
```

## Teknolojiler

- Next.js 14
- React 18
- TypeScript
- TailwindCSS
- qrcode.react
- uuid
