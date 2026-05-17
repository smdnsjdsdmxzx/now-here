# NOW Here

Konum bazli fotograf, not, yorum, begeni, profil ve rozet uygulamasi. React/Vite istemci, Express API ve MongoDB destekli calisir. MongoDB baglanamazsa API bellek ici yedek modda acilir.

## Ilk Kurulum

Zip'i actiktan sonra bir kere bagimliliklari kur:

```bash
cd client
npm install

cd ../server
npm install
```

Sonra proje kok klasorunden calistir:

```bash
cd ..
npm run dev
```

Istemci: http://localhost:5173  
API: http://localhost:5000

## Yeni Ozellikler

- Harita artik giris yapmadan acilmaz.
- Sadece e-posta ile giris ve kayit yapilir.
- Kayit sirasinda Brevo uzerinden e-posta dogrulama kodu gonderilir.
- Dogrulama kodu sitede veya terminalde gosterilmez.
- Profil sayfasi; paylasimlar, alinan begeniler, atilan begeniler, yorumlar ve rozetleri gosterir.
- Kullanici profil fotografi, gercek ad, soyad ve avatar adi ekleyebilir.
- Yorum ve begeniler kullanici hesabina baglanir.
- Rota adimlari, rota bitirme ve mesafeyi profile isleme eklendi.
- Arama backend proxy ile calisir; yazim hatasi ornegi olarak `burer king` sorgusu `burger king` sonucuna yonlenir.
- Ayni bolgede cok paylasim varsa markerlar kume halinde gosterilir.
- Kategori renkleri daha ayrik ve okunur hale getirildi.
- Uygulama icin yeni amblem ve favicon eklendi.

## Brevo E-posta Dogrulama

Backend artik yalnizca Brevo ile e-posta dogrulama kodu gonderir. Telefon ve SMS akislari kaldirildi. Ayarlari eklemek icin:

```bash
cd server
copy .env.example .env
```

Sonra `server/.env` icindeki alanlari doldur:

```bash
BREVO_API_KEY=xkeysib-xxxxxxxxxxxxxxxx
BREVO_FROM_EMAIL=dogrulanmis-gonderici@example.com
BREVO_FROM_NAME=NOW Here
```

Brevo API key veya dogrulanmis gonderici adresi eksikse kayit kodu uretilmez ve kullaniciya ayar hatasi gosterilir. Kod sadece e-posta ile gider; sitede veya terminalde acik sekilde yazdirilmaz.

Brevo anahtarini kontrol etmek icin:

```bash
npm run brevo:check
```

Bu komut hem API key'i hem de `BREVO_FROM_EMAIL` adresinin Brevo'da aktif sender olarak tanimli olup olmadigini kontrol eder.

Belirli bir aliciya giden son Brevo transactional loglarini kontrol etmek icin:

```bash
npm run brevo:logs -- alici@gmail.com
```

`Key not found` veya `Brevo API key dogrulanamadi` hatasi gelirse Brevo panelinde `SMTP & API > API Keys` bolumunden yeni bir API key olusturup `server/.env` icindeki `BREVO_API_KEY` alanina yapistir ve server'i yeniden baslat.

## Komutlar

```bash
npm run dev
npm run build
npm run lint
npm test
npm run start
```

## 431 Header Hatasi Notu

Eski surumde profil fotografi JWT token icine girebildigi icin tarayici cok buyuk `Authorization` header'i gonderebiliyordu. Bu surumde token sadece kullanici id'si tasir ve eski buyuk token uygulama acilisinda otomatik temizlenir.

Tarayicida hala `431 Request Header Fields Too Large` gorursen sayfayi `Ctrl + F5` ile sert yenile. DevTools Console aciksa su komut da eski tarayici verisini temizler:

```js
localStorage.removeItem("token");
localStorage.removeItem("user");
location.reload();
```

## Ortam Degiskenleri

- `server/.env` icinde MongoDB Atlas, JWT ve Brevo bilgileri bulunur.
- Atlas baglantisi icin URI formatinda veritabani adi bulunmali: `/now-here?retryWrites=true&w=majority&appName=Cluster0`.
- MongoDB baglanamazsa uygulama bellek ici demo modda calisir; bu durumda Atlas Database Access kullanicisini ve Network Access IP iznini kontrol et.
- Eski surumde tarayicida yerel olarak olusan hesap varsa ve MongoDB'de bulunmuyorsa, giris sirasinda ayni e-posta/sifre ile otomatik olarak MongoDB'ye tasinir.
