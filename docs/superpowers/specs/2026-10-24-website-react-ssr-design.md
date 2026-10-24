# WebSite React SSR geçiş tasarımı

Durum: Yaklaşım ve yazılı tasarım kullanıcı tarafından onaylandı.

## Amaç ve sınırlar

`WebSite/` içindeki React prototipi, yeni görünümü korunarak
`WebSite/v1-archive/` uygulamasıyla işlevsel eşitliğe getirilecek.
Lokal geliştirme/debug, istek bazlı SSR, API erişimi ve Vercel dağıtımı
çalışır olacak. Yeni ürün özelliği veya görsel yeniden tasarım yapılmayacak.

Arşiv, mevcut kullanıcı değişiklikleri, API iş mantığı ve veritabanı korunacak.
Gerçek Vercel dağıtımı ve hesap/proje ayarlarının değiştirilmesi bu çalışmanın
otomatik parçası değil; dağıtıma hazır kod ve doğrulama sağlanacak.

## Mevcut durum

- Prototip React 19, React Router 7 ve Vite kullanıyor.
- `src/services/blogService.ts`, API yerine yerel JSON ve yapay gecikme kullanıyor.
- Liste ve detay verileri `useEffect` içinde yükleniyor; ilk HTML içerik taşımıyor.
- `ThemeContext.tsx`, başlangıçta doğrudan `localStorage` okuyor.
- Arşiv tüm sayfaları sunucuda render edecek şekilde yapılandırılmış.
- `vercel.json`, `/api/*` isteklerini API'ye iletiyor; kalan yolları `/` adresine
  yazması SSR sunucusu sağlamıyor.
- Arşivin API hedefi `localhost:5000`, mevcut VS Code API debug hedefi
  `localhost:5050`. Docker Compose belgeleri ayrıca `localhost:8080` kullanıyor.
- Arşiv içerik renderer'ında bulunan `icon` türü React renderer'ında eksik.

## Mimari karar

React Router framework modu ve standart SSR veri yükleme akışı kullanılacak.
Mevcut React bileşenleri, Tailwind stilleri ve Vite tabanı yeniden kullanılacak.
Deneysel React Server Components kullanılmayacak.

Next.js daha fazla taşıma gerektiriyor; özel bir Vite SSR sunucusu ise
render, hydration ve dağıtım için gereksiz bakım yükü oluşturuyor.

Sayfa loader'ları sunucuda API verisini alacak. Framework ilk HTML ile
hydration verisini birlikte gönderecek. Tarayıcı geçişlerinde de aynı loader
sözleşmesi kullanılacak; ilk açılışta ikinci bir `useEffect` veri isteği olmayacak.
Veri her istekte yüklenebilecek; build sırasında çalışan API gerekmeyecek.

## URL ve özellik eşitliği

| Yol / özellik | Beklenen davranış |
| --- | --- |
| `/` | `/index` adresine sunucu yönlendirmesi |
| `/index` | API tabanlı yazı listesi ve sayfalama |
| `/blog-list` | Eski liste URL'si korunur; sayfalama bu yolu terk etmez |
| `/blog-post` | Prototipteki `/blog-post/latest` kısayolu korunur |
| `/blog-post/:id` | API'den yazı, gövde ve önceki/sonraki bağlantıları |
| `/blog-post/latest` | En güncel yazıyı API belirler |
| `/about` | Yeni tasarımdaki hakkımda sayfası sunucuda render edilir |
| Bilinmeyen sayfa yolu | Prototipteki gibi `/index` adresine yönlendirme |
| Disqus | `hayrihabip` shortname ve gerçek yazı kimliği korunur |
| Tweet, video, tablo, kod, ikon | Arşivde desteklenen içerik türleri korunur |
| Tema, menü, mobil görünüm | Prototip görünümü ve etkileşimleri korunur |
| Statik dosyalar | İçerik görselleri, favicon ve mevcut doğrulama dosyaları erişilebilir |
| `/api/BlogPosts/feed` | API proxy üzerinden RSS yanıtı erişilebilir |

Eksik görseller yalnızca gerekli arşiv dosyalarıyla tamamlanacak; arşiv
taşınmayacak veya değiştirilmeyecek. İlgisiz arşiv bağımlılıkları taşınmayacak.

## API ve proxy sözleşmesi

- Liste: `GET /api/BlogPosts?pageIndex=0&pageSize=25`.
- Detay: `GET /api/BlogPosts/{id}`; `latest` API tarafından destekleniyor.
- Proxy yalnızca baştaki `/api` önekini kaldırır; yolun kalanı ve sorgu korunur.
- API yanıtlarındaki `Pager` ve `APIResult` alan adları korunur.
- Sıralama, tarihler ve yazı navigasyonu API'den gelir; JSON/ObjectId tabanlı
  yerel veri üretimi ve sessiz sahte-veri fallback'i çalışma akışından çıkarılır.
- Sunucu loader'ları aynı API hedefini doğrudan kullanabilir; kendi genel
  adresine HTTP isteği yapıp yeniden proxy üzerinden dolaşmaları gerekmez.
- Tarayıcıdan yapılan API istekleri aynı origin'deki `/api` yolunu kullanır.
- API kökü sunucuya özel `API_URL` ile belirlenir. Lokal varsayılan
  `http://localhost:5050`; Compose için `http://localhost:8080`, üretim için
  `https://api.hayrihabip.com` belgelenir.
- Ortam değişkeni SSR ve `/api` proxy için aynı hedefi belirler; Vercel'de
  değişkenden bağımsız, ikinci bir sabit hedef tutulmaz.
- Proxy hedefi istek parametresinden veya istemcinin verdiği URL'den alınmaz.
  Proxy hata durumlarını HTML sayfasına dönüştürmez; yanıt durumu, gövde ve
  gerekli başlıklar korunur. Hop-by-hop başlıklar iletilmez.
- MongoDB/Notion sırları frontend'e taşınmaz. Frontend `.env.example` yalnızca
  ihtiyacı olan sunucu yapılandırmasını açıklar.

## Hata ve güvenlik davranışı

- Eksik sayfalama değerleri `0` ve `25` olur. Geçersiz, negatif veya tam sayı
  olmayan değerler güvenli varsayılana döner; API'ye `NaN` gönderilmez.
- Yazı kimliği `latest` veya geçerli 24 haneli hexadecimal ObjectId olmalıdır.
  Geçersiz kimlik API'yi çağırmadan 404 üretir; prototipin `0` kısayolu
  kullanılırsa `latest` olarak ele alınır.
- API'nin 404 yanıtı veya başarısız detay sonucu yazı-bulunamadı sayfasıdır.
  Sunucu HTML yanıtı da 404 olur.
- Ağ kesintisi, timeout, geçersiz API yanıtı ve upstream 5xx boş liste veya
  bulunamayan yazı gibi gösterilmez; anlaşılır hata durumu ve uygun 5xx üretilir.
- Boş başarılı liste 200 ve boş durum görünümüdür.
- Fetch istekleri sonlu timeout ve iptal desteğine sahip olur.
- API verisi güven sınırı olarak ele alınır; kullanılan yanıt alanlarının
  temel yapısı kontrol edilir. Genel amaçlı yeni şema altyapısı kurulmaz.
- Metinler React tarafından escape edilir. Kod vurgulama başarısızsa ham kod
  HTML olarak değil metin olarak render edilir. İçerik URL'lerinde tehlikeli
  protokoller ve keyfi script/olay öznitelikleri kabul edilmez.

## SSR ve tarayıcı ayrımı

Tema sunucu ve ilk tarayıcı render'ında aynı varsayılanla başlar; kayıtlı tema
hydration sonrasında güvenli şekilde okunur. Depolama erişimi engellense de
sayfa çalışır. Kullanıcının kayıtlı tercihi okunmadan varsayılanla ezilmez.

`window`, `document`, `localStorage`, scroll ve üçüncü taraf script işlemleri
yalnızca tarayıcı yaşam döngüsünde çalışır. Disqus ve tweet scriptleri
tekrarlanmaz; yazı geçişinde doğru içerik yüklenir. Üçüncü taraf hizmetlerin
yokluğu yazı metninin render edilmesini engellemez.

Sayfa başlığı ilk HTML içinde doğru üretilir. API'nin `publishDate` değeri
kullanılır; sunucu ve tarayıcı bağımsız zaman hesabıyla hydration farkı yaratmaz.

## Lokal geliştirme ve Vercel

- `dev:ssr`, `build:ssr` ve `serve:ssr` komutları korunacak/yeniden sağlanacak.
  `dev` ve `build` aynı SSR uygulamasının standart girişleri olacak.
- Lokal web portu prototipteki `3000` olarak korunacak.
- VS Code'a frontend sunucu ve tarayıcı debug yapılandırmaları ile mevcut
  API debug yapılandırmasını kullanan birleşik başlatma eklenecek.
- Vercel için React Router'ın desteklenen entegrasyonu ve sunucu çıktısı
  kullanılacak; genel SPA rewrite kaldırılacak. Statik dosyalar ve `/api`
  yolları SSR sayfa yönlendirmesince yakalanmayacak.
- Vercel proje kökü `WebSite`; kurulum/build ayarları, Node gereksinimi ve
  `API_URL` yapılandırması README'de açıkça belirtilecek.
- Tek paket yöneticisi/lockfile aktif uygulama için seçilip belgelenir;
  arşiv lockfile'ları değiştirilmez. Varsayılan npm'dir.
- Vercel hesap erişimi veya gerçek deploy yoksa yerel build doğrulanır,
  platform doğrulaması ayrıca bekliyor olarak raporlanır.

## Kabul ve doğrulama

1. Temiz bağımlılık kurulumu, typecheck ve üretim SSR build başarılıdır.
2. Kontrollü bir test API'siyle liste ve detay HTML'inde JavaScript çalışmadan
   gerçek test yazısının başlığı/gövdesi bulunur; yalnızca loading kabuğu dönmez.
3. İlk hydration gereksiz ikinci veri isteği yapmaz; tarayıcı konsolunda
   hydration hatası oluşmaz.
4. Sayfalama, doğrudan URL açılışı, yenileme ve önceki/sonraki yazı geçişi
   yeni tasarımla çalışır; `/index` ve `/blog-list` ayrı ayrı kontrol edilir.
5. `/api` önek kaldırma, sorgu aktarımı, JSON/XML yanıtı ve upstream hata
   durumları çalışan sunucu üzerinden doğrulanır.
6. Boş liste, hatalı kimlik, bulunamayan yazı, API kesintisi ve bozuk yanıt
   davranışları küçük, tekrar çalıştırılabilir kontrollerle kapsanır.
7. Kod/ikon/tablo/video/tweet render'ı, Disqus kimliği, tema saklama, mobil
   menü ve ilgili statik dosyalar kontrol edilir.
8. Build'in çalışan API'ye bağımlı olmadığı ve production sunucusunun
   geliştirme sunucusuna ihtiyaç duymadan çalıştığı doğrulanır.
9. Vercel uyumlu build çıktısı kontrol edilir; gerçek dağıtım yapılmadıysa
   canlı ortam test edilmiş gibi raporlanmaz.

## Süreç takibi

- [x] Mevcut ve arşiv uygulamanın temel akışlarını incele.
- [x] Amaç, sınırlar ve alternatifleri kullanıcıya sun.
- [x] Mimari yaklaşım için kullanıcı onayı al.
- [x] Yazılı tasarımı hazırla ve tutarlılık/kapsam incelemesini yap.
- [x] Kullanıcıdan bu yazılı tasarımın onayını al.
- [ ] Onaylanan tasarımdan uygulama planı çıkar ve yürütme yöntemini seçtir.
- [ ] Onaylı planı uygula ve kabul kontrollerini çalıştır.
