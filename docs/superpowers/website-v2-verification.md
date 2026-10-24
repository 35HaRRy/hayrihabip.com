# WebSite v2 doğrulama kaydı

Dal: `feature/website-v2`.

## Çalıştırılan kontroller

- `npm ci`: başarılı.
- `npm test`: 6 birim/server-render kontrolü başarılı.
- `npm run typecheck`: başarılı.
- `npm run build:ssr`: gerçek API çalışmadan başarılı.
- `VERCEL=1` ile `npm run build`: Vercel preset sunucu bundle'ları üretildi.
- `npm run test:ssr`: 2 config/production HTTP kontrolü başarılı; alt
  senaryolarda ilk HTML, yönlendirme, hata, timeout, proxy ve statik dosyalar var.
- Geliştirme sunucusunda detay SSR ve XML proxy: 200.
- `npm audit`: 0 açık.
- Arşiv: başlangıç kopyasındaki 215 dosyayla byte düzeyinde aynı.
- `API/`: değişiklik yok.
- İstemci JS çıktısında `API_URL`, localhost API hedefi veya örnek backend
  secret değişken adları bulunmadı.
- Playwright: JavaScript kapalı içerik, tek ilk API çağrısı, tema
  saklama/geri yükleme/engellenmiş storage, sayfalama/refresh, önceki-sonraki
  ve hızlı iptal edilen navigasyon, iki gecikmeli tweet, Disqus kimliği/reset,
  mobil menü/palet ve 390px yatay taşma kontrolleri başarılı.
- Browser pageerror/hydration hatası yok; yalnızca kasıtlı 502 senaryosunda
  beklenen kaynak yükleme hatası görüldü.

Tekrarlama adımları: [tarayıcı kabul listesi](../../WebSite/tests/browser-checklist.md).

## Uygulama sırasında alınan kararlar

1. Skill yardımcı scriptleri Windows'ta Git Bash ile çalıştırıldı; sistem
   `bash` komutu WSL'ye işaret ediyor. Etki: yalnızca geliştirme araçları.
2. Başlangıçta kullanıcıya ait commit edilmemiş prototip/taşıma değişiklikleri
   vardı. Yalnızca yeni yazılan veya başlangıçta temiz olan dosyalar commit
   edildi; kullanıcı işiyle karışık dosyalar stage edilmedi. Etki: tüm uygulama
   değişikliklerini yayımlamadan önce kalan çalışma ağacı ayrıca commit edilmeli.
3. Config assertion'ları gerçek HTTP/browser testleriyle tamamlandı. Etki:
   interaktif VS Code F5 oturumu yine kullanıcı ortamında kontrol edilmeli.
4. Node server-render testlerinde CSS import'ları test hook'u ile atlandı;
   gerçek CSS Vite/browser üzerinden test edildi. Etki: saf Node testi görsel
   CSS regresyonunu tek başına yakalamaz.
5. Vercel preset 7.x istediğinden tüm React Router paketleri 7.18.4 hattında
   tutuldu; güncel 8.x'e geçilmedi. Etki: ileride major geçiş ayrı iş.
6. Vercel preset yalnızca `VERCEL` ortamında açıldı; koşulsuz açıldığında
   standart lokal `build/server/index.js` yerine platform bundle yolu üretiyor.
   Etki: lokal ve Vercel build'leri ayrı doğrulanmalı; ikisi de çalıştırıldı.
7. Vercel static-config bağımlılığındaki ajv 8.6.3 güvenlik uyarısı için
   uyumlu düzeltilmiş 8.x override kullanıldı. Etki: preset uyumluluğu build
   ile doğrulanmalı; build başarılı ve audit temiz.
8. highlight.js dil desteği daraltılmadı. Etki: yazı chunk'ı yaklaşık 985KB;
   dil azaltma/performance optimizasyonu bu geçişten ayrı tutuldu.
9. HTTP smoke XML Content-Type üzerinde framework'ün eklediği UTF-8 charset'i
   kabul ediyor; MIME ve gövde aynı. Etki: header'ın byte eşitliği değil
   içerik türü/gövde eşitliği doğrulanıyor.
10. Kullanıcının port 3000 sürecine dokunmamak için testler 3100/3101 üzerinde
    çalıştı. Ürün varsayılanı 3000 kaldı. Etki: kullanıcı aynı portta eski
    sunucuyu açık bırakırsa kapatmalı veya farklı port seçmeli.
11. Tasarım detector'ünün font tercihi uyarısına rağmen prototip fontları
    korundu; görsel yeniden tasarım istenmedi. Etki: estetik tercih uyarısı sürer.

## Canlı ortam sınırları

- Gerçek API 5050/8080 üzerinde açık değildi; veri sözleşmesi fixture ile
  doğrulandı. Gerçek API/MongoDB uçtan uca kontrolü yayın öncesi yapılmalı.
- Twitter/Disqus servislerinin canlı erişilebilirliği değil, yerel entegrasyon
  davranışı ve engellenmiş/gecikmiş script senaryoları doğrulandı.
- Canlı Vercel deploy veya hesap/proje ayarı değişikliği yapılmadı.
- İnteraktif VS Code F5 breakpoint oturumu çalıştırılmadı.
- Bağımsız inceleme iki önemli sorun buldu; ikisi de hata üreten regresyon
  testiyle doğrulanıp düzeltildi. Kritik veya ertelenmiş küçük bulgu yok.

## Son inceleme düzeltmeleri

- Proxy 307'yi 502'ye çeviriyordu. Test önce `502 != 307` ile başarısız oldu;
  `redirect: manual` ile durum, Location ve gövde takip edilmeden korunuyor.
- Tweet widget'ı iframe'e dönüştükten sonra yazı değişiminde eski tweet
  kalabiliyordu. Gerçek DOM dönüşümü yapan test önce `1234,9999` sonucuyla
  başarısız oldu; tweet kimliğini içeren React key ile sonuç `5678,9999` oldu.
- Düzeltme sonrası 6/6 birim/render testi, 2/2 production HTTP testi ve tweet
  browser regresyonu başarılı; typecheck ve SSR build başarılı.

İncelemede canlı API/MongoDB, Vercel dağıtımı, üçüncü taraf servis erişimi ve
F5 oturumu ayrıca değerlendirme dışında tutuldu. Karar: bunlar yayın öncesi
ortam kontrolleri olarak kalıyor; mevcut yerel kanıt onların yerine geçmiyor.
Yanlışsa maliyet, yalnızca gerçek ortamda ortaya çıkan entegrasyon hatasıdır.

İnceleme çalışma ağacını değerlendirdi; commit'ler tek başına tüm prototip
değişikliklerini içermiyor. Karar: kullanıcı işiyle karışık dosyalar stage
edilmeden korundu. Yayın öncesi kalan değişikliklerin commit edilmesi gerekir.
Görsel yeniden tasarım/performance azaltımı yapılmadı; mevcut görünüm ve dil
desteğinin tradeoff'ları bilinçli olarak korunuyor.
