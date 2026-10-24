# WebSite React SSR Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Yeni React görünümünü koruyarak arşiv uygulamanın işlevlerini, SSR, API proxy, lokal debug ve Vercel dağıtım hazırlığını tamamlamak.

**Architecture:** React Router framework modu mevcut `src` bileşenlerini kullanır. Sunucu loader'ları ve `/api/*` resource route aynı sunucuya özel API istemcisini kullanır. Framework SSR ve hydration verisini taşır; özel SSR sunucusu veya deneysel RSC yazılmaz.

**Tech Stack:** React 19, TypeScript, React Router 7 framework modu, Vite, Tailwind, Node.js fetch/test/assert, npm, Vercel React Router preset.

**Spec:** `docs/superpowers/specs/2026-10-24-website-react-ssr-design.md`

## Global Constraints

- Yeni ürün özelliği veya görsel yeniden tasarım yapılmayacak.
- Arşiv, mevcut kullanıcı değişiklikleri, API iş mantığı ve veritabanı korunacak.
- Deneysel React Server Components kullanılmayacak.
- Lokal web portu prototipteki `3000` olarak korunacak.
- Lokal API varsayılanı `http://localhost:5050`; Compose `http://localhost:8080`; üretim `https://api.hayrihabip.com`.
- API kökü sunucuya özel `API_URL` ile belirlenir; SSR ve proxy aynı hedefi kullanır.
- Eksik sayfalama değerleri `0` ve `25` olur; yerel JSON fallback kullanılmaz.
- `dev:ssr`, `build:ssr` ve `serve:ssr` komutları sağlanır; aktif paket yöneticisi npm'dir.
- Gerçek Vercel dağıtımı ve hesap/proje ayarlarının değiştirilmesi otomatik kapsam dışındadır.
- Her görevde yalnızca kendi değişikliklerini stage et; mevcut taşıma/prototip değişikliklerini topluca commit etme.

## Review Focus

- Kaydedilmiş tema ve erişimi engellenmiş localStorage: tercih ezilmeden hydration tamamlanmalı. Görev 2/5.
- Sorgulu feed ve upstream 404/5xx: proxy HTML'e çevirmeden durum/gövde/Content-Type korumalı. Görev 1/5.
- Hızlı A→B yazı geçişi: eski istek/script B sayfasını A içeriğine çevirmemeli. Görev 2/3/5.
- Kod vurgulama hatası ve `javascript:` içerik URL'si: HTML/script çalışmamalı. Görev 3.
- Yanlış API hedefi veya kapalı API ile build: derleme ağdan bağımsız, runtime hatası anlaşılır olmalı. Görev 1/4/5.

## Dosya ve sorumluluk haritası

Yeni dosyalar:
- `WebSite/src/services/api.server.ts`: API hedefi, timeout, güvenli fetch ve proxy.
- `WebSite/src/services/blog.server.ts`: API yanıt kontrolü ve blog sunucu istemcisi.
- `WebSite/src/services/blogParams.ts`: saf sayfalama/kimlik doğrulaması.
- `WebSite/src/root.tsx`: HTML belge kabuğu, stiller, framework bileşenleri ve kök hata sınırı.
- `WebSite/src/routes.ts`: açık URL eşlemesi.
- `WebSite/src/routes/{redirect,index-list,blog-list,post,about,api}.tsx`: küçük route modülleri; redirect modülü `/`, `/blog-post` ve catch-all yönlendirmelerini pathname'e göre yapar.
- `WebSite/react-router.config.ts`: `appDirectory: 'src'`, `ssr: true`, Vercel preset.
- `WebSite/tests/api.test.ts`: Node test/assert ile API/proxy/sözleşme kontrolleri.
- `WebSite/tests/render.test.tsx`: React server render ile HTML/içerik güvenliği kontrolleri.
- `WebSite/tests/ssr.test.mjs`: geçici API fixture'ı ve gerçek production sunucusuyla HTTP kontrolleri.
- `WebSite/tests/browser-checklist.md`: mevcut Playwright aracıyla tekrar çalıştırılabilir tarayıcı senaryoları.

Değişecek dosyalar:
- `src/App.tsx`: Routes yerine Outlet kullanan mevcut görsel kabuk.
- `src/pages/{BlogListPage,BlogPostPage}.tsx`: loader verisini prop olarak alan sunumsal sayfalar.
- `src/context/ThemeContext.tsx`: SSR güvenli, tercihi koruyan tema yükleme.
- `src/components/{BlogNavigator,BlogPostItemRenderer,TweetEmbed,DisqusThread,Header}.tsx`: gerekli eşitlik ve tarayıcı yaşam döngüsü düzeltmeleri.
- `src/types/blog.ts`: güvenli API/içerik tipleri; `any` yerine yalnızca kullanılan alanlar.
- `package.json`, `package-lock.json`, `vite.config.ts`, `tsconfig.json`, `.gitignore`, `.env.example`, `vercel.json`: tek SSR build/runtime akışı.
- `.vscode/{launch,tasks}.json`, `WebSite/README.md`, `README.md`: debug ve işletim bilgileri.
- `WebSite/public/`: yalnızca eksik içerik görselleri ve doğrulama dosyaları.

Emekliye ayrılacak aktif girişler: `WebSite/src/main.tsx`, `WebSite/index.html`, Angular'dan kalan aktif `tsconfig.{app,spec,server}.json` referansları ve aktif `bun.lock`. Önce gerçek kullanımını kontrol et; gerekli HTML metadata/font bağlantılarını `root.tsx` içine taşı. `src/services/blogService.ts` yalnızca tüm çağrıları taşındıktan sonra kaldırılır. `src/data` ve arşiv dosyaları bu iş için silinmez.

## Task 1: Gerçek API istemcisi ve güvenli proxy çekirdeği

**Files:** Yeni `src/services/{api.server,blog.server,blogParams}.ts`, `tests/api.test.ts`; değişen `src/types/blog.ts`, `package.json`, `package-lock.json`.

**Interfaces:**
- `parsePage(search: URLSearchParams): Page` → güvenli tam sayılar; `PageSize > 0`, `PageIndex >= 0`.
- `parsePostId(value: string): string` → `latest`, `0` için `latest`, geçerli ObjectId; diğerleri `Response(404)` fırlatır.
- `getApiBaseUrl(): URL` → yalnızca yapılandırılmış HTTP(S) kökü; trailing slash tutarlı.
- `fetchApi(path: string, init?: RequestInit): Promise<Response>` → yapılandırılmış kök altında istek; dış origin path kabul etmez; 10 saniye timeout, çağıran sinyalini korur.
- `forwardApi(request: Request): Promise<Response>` → `/api` öneki çıkarılmış upstream isteği; ağ hatası 502, timeout 504.
- `getPosts(page: Page, signal?: AbortSignal): Promise<Pager<BlogPost>>` ve `getPostById(id: string, signal?: AbortSignal): Promise<BlogPost>` → doğrulanmış yanıt; detay yoksa 404, bozuk/başarısız upstream için 502/504.

- [ ] **1. Failing test yaz.** Node `node:test` ve `node:assert/strict` kullan. TypeScript/TSX testleri için yalnızca `tsx` geliştirme bağımlılığı ekle; yeni test framework'ü kurma. `test:unit` komutu `node --import tsx --test tests/api.test.ts tests/render.test.tsx` olacak; render testi henüz yoksa bu görevde doğrudan API testini çalıştır.

  `parses_page_and_id`: `assert.deepEqual(parsePage(new URLSearchParams()), {PageIndex: 0, PageSize: 25})`; `pageIndex=-1&pageSize=0`, `pageIndex=x&pageSize=1.5` aynı varsayılanı verir. `parsePostId('0') === 'latest'`; `assert.throws(() => parsePostId('bad'), e => e instanceof Response && e.status === 404)`. Güvenli integer dışındaki değerler API'ye gitmez.

  `forwards_proxy_response`: geçici `node:http` fixture'ına `/api/BlogPosts/feed?x=1` gönder; upstream `/BlogPosts/feed?x=1` görür, 404/XML ve 503/JSON gövde/durum/Content-Type değişmez. HEAD gövdesizdir; POST yöntemi/gövdesi korunur. İstemci `host`, `connection` ve `connection` ile adlandırılmış hop-by-hop başlıkları aktarılmaz.

  `checks_blog_contract`: fixture için geçerli Pager/BlogPost geçer, boş liste 200'dür, bozuk JSON/eksik Rows yapısı 502, upstream 404/başarısız detay sonucu 404, upstream 500 → 502 olur. Abort upstream isteğini durdurur; hedef URL'yi sorgu parametresi değiştiremez.

- [ ] **2. Red doğrula.** `cd WebSite` içinde `node --import tsx --test tests/api.test.ts`; yeni modüller olmadığı için FAIL beklenir.
- [ ] **3. Minimal modülleri uygula.** Yukarıdaki imzaları kullan; URL kökü HTTP(S) ve credentials kontrolü yap, hem proxy hem blog istemcisi `fetchApi` kullansın. Başarı gövdelerini yalnızca kullanılan alanlar ve recursive içerik şekli için kontrol et. Proxy gövdesini akış olarak aktar; upstream decompression nedeniyle yanlış Content-Length/Content-Encoding iletme. Kapanan istemci ve tamamlanmış isteklerin timeout kaynaklarını temizle.
- [ ] **4. Green doğrula.** Aynı test komutu PASS; testler yerel gerçek API/MongoDB gerektirmez, fixture her test sonunda kapanır.
- [ ] **5. Commit.** Yalnızca bu görevin diff'lerini seç: `feat(website): add server API client and proxy`.

## Task 2: Framework SSR, route loader'ları ve hydration

**Files:** Haritadaki root/routes/config dosyaları; `src/App.tsx`, `src/pages/{BlogListPage,BlogPostPage}.tsx`, `src/context/ThemeContext.tsx`, `src/components/BlogNavigator.tsx`, `tests/render.test.tsx`, ilgili paket/tsconfig/env/ignore dosyaları.

**Consumes:** Task 1 `getPosts`, `getPostById`, `forwardApi`, `parsePage`, `parsePostId`.
**Produces:**
- `BlogListPage({pager}: {pager: Pager<BlogPost>})`, `BlogPostPage({post}: {post: BlogPost})`.
- Route loader'ları `({request, params}: Route.LoaderArgs)`; liste `{pager}`, detay `{post}` döndürür. API resource route component export etmez, loader ve action `forwardApi` döndürür.
- `root.tsx` içinde framework `Links`, `Meta`, `Outlet`, `Scripts`, `ScrollRestoration`; `App` Header/Footer/ThemeProvider ile Outlet sarar.

- [ ] **1. Failing render testi yaz.** `renderToStaticMarkup` ve router bağlamı içinde `BlogListPage` için fixture başlığı ve sayfalama linki; `BlogPostPage` için başlık ve gövde ilk HTML'de bulunmalı. `ThemeProvider` window/localStorage yokken render olmalı. `/blog-list` bağlamında sonraki sayfa href'i `/blog-list?pageIndex=1&pageSize=25` olmalı.
- [ ] **2. Red doğrula.** `npm run test:unit`; eski effect tabanlı sayfalar yalnızca loading döndürdüğü için FAIL beklenir.
- [ ] **3. Framework yapılandırmasını uygula.** Uyumlu stabil React Router 7 `@react-router/dev`, `@react-router/node`, `@react-router/serve` ve `@vercel/react-router` sürümlerini peer/Node gereksinimleriyle seç; React Router paketlerini aynı sürümde tut. Vite React plugin yerine framework plugin, mevcut Tailwind plugin korunur. Config `appDirectory: 'src'`, `ssr: true`, `presets: [vercelPreset()]`; özel entry gerekmedikçe framework varsayılanlarını kullan. Framework typegen ve `tsc --noEmit` için tek aktif tsconfig kullan; arşiv, build ve test fixture verileri uygulama derlemesine dahil edilmez.
- [ ] **4. Route ve sunumsal sayfaları bağla.** İki liste yolu için ayrı route ID/modülü, aynı sunumsal sayfa ve ortak API istemcisi kullan. Detay `params.id` ve `request.signal` geçirir. Sayfa effect fetch'lerini/document.title yazımını kaldır; metadata ilk HTML'de üretilir. Mevcut loading görünümünü navigation pending sırasında kullan. 404 ve 502/504 hata sınırları ayrı mesaj/durum taşır. Yönlendirmeleri HTTP redirect olarak yap; `/api/*` catch-all'a düşmesin.
- [ ] **5. Tema ve CSS girişini taşı.** İlk render `theme-2`; effect içinde try/catch ile kayıtlı tercih oku ve ancak okuma sonrasında sakla. Aynı effect döngüsünde kaydı varsayılanla ezme. `index.html` metadata/font/body stillerini koru. Eski bootstrap girişlerini, artık kullanılmayan servis ve aktif Angular config referanslarını ancak import/çağrı kontrolünden sonra emekliye ayır; public ve arşiv verilerini silme.
- [ ] **6. Green/build doğrula.** `npm run test:unit`, `npm run typecheck`, `npm run build:ssr`; API kapalıyken build PASS. Scriptler: `dev`/`dev:ssr` → framework dev port 3000; `build`/`build:ssr` → framework build; `serve:ssr` → `react-router-serve build/server/index.js`. Lokal production başlangıcı `.env` okumayı Node'un desteklenen env-file seçeneğiyle sağlar; `API_URL` istemci bundle'ına girmez.
- [ ] **7. Commit.** `feat(website): enable framework SSR and loaders`.

## Task 3: İçerik ve üçüncü taraf özellik eşitliği

**Files:** `src/components/{BlogPostItemRenderer,TweetEmbed,DisqusThread,Header}.tsx`, `src/types/blog.ts`, `tests/render.test.tsx`, gerekli `public` dosyaları.

**Consumes:** SSR sayfaları, API'den gelen `BlogPostItem` ağacı, gerçek `post.id`.
**Produces:** Arşiv içerik türlerini güvenli sunucu render'ıyla gösteren mevcut renderer; script yükleme işlemleri yalnızca browser effect'lerinde kalır. Yeni genel script-loader katmanı kurulmaz.

- [ ] **1. Failing test ekle.** `renders_archive_content` için figure/caption/link/image/headings/list/blockquote/footer/div/icon/code/table/video/tweet fixture'ını render et; ikon SVG'si, escape edilmiş `<script>` kodu ve tablonun hücreleri bulunmalı. `rejects_unsafe_content` için `javascript:`/`data:text/html` link ve iframe URL'leri aktif HTML'e girmemeli. Bilinen dilde highlight başarısız olduğunda kod metni escape edilmiş kalmalı; güvenlik testi yalnızca başarılı highlight yolunu test etmekle yetinmez.
- [ ] **2. Red doğrula.** `npm run test:unit`; eksik icon/güvenlik/fallback testleri FAIL beklenir.
- [ ] **3. Renderer eşitliğini tamamla.** Mevcut Font Awesome bağımlılıklarıyla arşiv icon tanımlarını eşle; gerçek arşiv JSON örneklerini kullan. React text fallback kullan; tehlikeli protokolleri filtrele, attribute'ları toplu spread etme. Mevcut tasarımı değiştirmeden tablo/video taşmalarını kontrol et. Eksik `Angular&SSR&AWS.jpeg` ve gerçek referanslı diğer asset'leri arşivden kopyala; doğrulama dosyalarını public içine koy.
- [ ] **4. Browser script yarışlarını düzelt.** Tweet scripti zaten yükleniyor olsa bile sonraki embed'ler load tamamlanınca işlenmeli; cleanup eski container'a geç işlem uygulamasın. Disqus `hayrihabip`, gerçek yazı id'si ve geçişte reset korunur. Engellenmiş scriptler ana içeriği bozmaz. Header butonlarına gerekli `aria-expanded`/`aria-controls` bağlarını ekle; görsel tasarım değişmez.
- [ ] **5. Green doğrula.** `npm run test:unit` ve `npm run typecheck` PASS. Browser'da hızlı A→B geçişi ve engellenmiş üçüncü taraf script senaryosu Task 5 listesine eklenmiş olmalı.
- [ ] **6. Commit.** `fix(website): preserve content and embed behavior`.

## Task 4: Lokal debug ve Vercel işletim ayarları

**Files:** `.vscode/{launch,tasks}.json`, `WebSite/{vercel.json,package.json,.env.example,.gitignore,README.md}`, kök `README.md`.

**Consumes:** Task 2 SSR komutları ve preset; Task 1 `API_URL`.
**Produces:** Tek `.env` hedefiyle lokal SSR/proxy, frontend/API birlikte debug, Vercel kurulum tarifi.

- [ ] **1. Failing configuration assertion ekle.** `tests/ssr.test.mjs` içinde `checks_runtime_configuration`: package script'lerinin `dev:ssr`/`build:ssr`/`serve:ssr` varlığını, Vercel'de `destination: '/'` genel rewrite ve sabit API rewrite olmadığını, mevcut `API: Debug` kaydının korunduğunu assert et. Bu görevde HTTP süreç testlerini henüz ekleme.
- [ ] **2. Red doğrula.** `node --test tests/ssr.test.mjs`; eksik debug/yanlış rewrite için FAIL beklenir.
- [ ] **3. Debug yapılandırmasını ekle.** `WebSite: SSR Debug` npm runtime ile `dev:ssr` başlatır, `cwd` WebSite, child process auto attach açık. `WebSite: Browser Debug` port 3000 Chrome launch, source map kökü WebSite. `WebSite + API: Debug` compound mevcut `API: Debug` ve frontend'i birleştirir. Mevcut API envFile/port/build task değiştirilmez; Windows npm runtime çözümü test edilir. Node/Chrome hazır olma task'ı yalnızca gerçekten gerekiyorsa eklenir.
- [ ] **4. Ortam ve dağıtımı belgeleyip düzelt.** `.env.example` yalnızca `API_URL=http://localhost:5050` ve açıklamalar içerir. Vercel genel SPA/sabit API rewrite'larını kaldır, preset'in ürettiği routing'i kullan. npm lockfile tek aktif kilit olur; arşiv kilitleri korunur. Node sürüm tabanını seçilen paketlerin engines gereksiniminden belirle ve package/README'de eşle. `.react-router/`, `build/`, `.vercel/` ve yerel env dosyaları ignore edilir; örnek env dosyası izlenebilir kalır.
- [ ] **5. Komut ve ayarları doğrula.** Configuration testi PASS. README: `npm ci`, env kopyalama, `npm run dev:ssr`, `npm run build:ssr`, `npm run serve:ssr`, portlar ve Compose alternatifi; Vercel Root Directory `WebSite`, framework React Router, install `npm ci`, build `npm run build`, varsayılan output/preset; Preview ve Production `API_URL` değerleri. Gizli verileri kopyalama ve canlı deploy yapma.
- [ ] **6. Commit.** `chore(website): configure debug and Vercel runtime`.

## Task 5: Gerçek SSR/proxy smoke testi ve tarayıcı kabulü

**Files:** `tests/ssr.test.mjs`, `tests/browser-checklist.md`, `package.json`; doğrulama notları için planın aşağıdaki kayıt bölümü.

**Consumes:** Build çıktısı, production serve komutu, tüm route'lar ve API/proxy davranışı.
**Produces:** `test:ssr` → `node --test tests/ssr.test.mjs`; sıfır dış hizmet gerektiren fixture ile production HTTP kontrolleri ve ayrı gerçek API/browser sonucu.

- [ ] **1. Failing HTTP kontrollerini yaz.** Fixture API ve production SSR sunucusunu kullanılabilir geçici portlarda başlat; `API_URL` fixture, `PORT` web. Windows uyumlu process spawn, readiness timeout ve finally cleanup kullan. `renders_real_html`: `/index` ve `/blog-post/latest` yanıtı 200, başlık/gövde HTML içinde; `/about` API çağırmaz. `preserves_routes`: `/` ve `/blog-post` doğru Location, kötü id 404 ve sıfır upstream çağrısı, `0` latest'e eşlenir. `handles_api_errors`: boş liste 200, eksik yazı 404, upstream 500/bozuk JSON 502, geciken upstream 504. `proxies_feed`: sorgu, XML, 404/503, HEAD ve request method/body korunur. Fixture değişimiyle aynı sayfa yeniden istendiğinde yeni veri görünür; prerender veri kopyası yoktur.
- [ ] **2. Red doğrula.** Smoke kontrollerini önce fixture'ın kasıtlı yanlış yanıtıyla veya davranış henüz eksikse mevcut uygulamada çalıştır; en az bir hedef assertion'ın gerçekten başarısız olduğunu kaydet. Ardından fixture'ı doğru sözleşmeye getir. Yeni testin hiç başarısız olmadan eklendiğini TDD diye raporlama.
- [ ] **3. Tam komut zincirini çalıştır.** `npm ci`, `npm run test:unit`, `npm run typecheck`, `npm run build:ssr`, `npm run test:ssr`. Build sırasında API kapalı; smoke sırasında yalnızca geçici fixture açık. Vercel preset'in ürettiği çıktı/routing içinde SSR ve resource route'un bulunduğunu kontrol et. Hesap erişimi yoksa canlı Vercel testi bekliyor olarak kaydet.
- [ ] **4. Playwright ile tarayıcı kabulü yap.** Yeni test bağımlılığı eklemek yerine mevcut Playwright aracını kullan; yeniden çalıştırma adımlarını `tests/browser-checklist.md` içine yaz. Fixture ile önce JavaScript kapalı içerik; sonra JS açık ilk hydration ve upstream sayımında gereksiz ikinci çağrı yok. `/blog-list` sayfalama, refresh, önceki/sonraki, hızlı A→B geçişi, kayıtlı `theme-8` ve localStorage SecurityError, 390px menü/palet, bozuk API hata görünümü, üçüncü taraf script bloklama, Disqus identifier/reset ve tweet load yarışını kontrol et. Console/pageerror/hydration hatalarını topla; kişisel verisiz ekran görüntüsüyle görünümün korunduğunu kontrol et.
- [ ] **5. Gerçek API kontrolünü ayrı yap.** Lokal gerçek API mevcutsa aynı liste/detay/proxy URL'lerini test et; yoksa fixture testini gerçek API doğrulaması diye sunma. API'yi açmak için veritabanı sıfırlama, seed veya credential değişikliği yapma.
- [ ] **6. Değişiklik kapsamını incele.** `git diff --check`; ilgili diff ve yeni dosyalarda arşiv/API değişmediğini, client bundle'ında sır/API_URL bulunmadığını ve emekli girişlerin aktif import'u kalmadığını doğrula. Yalnızca bu görev dosyalarını commit et: `test(website): verify SSR and proxy parity`.

## Uygulama kayıtları

- [x] Plan kullanıcı tarafından incelendi ve yürütme yöntemi seçildi: native, feature/website-v2.
- [x] Task 1: API/proxy testleri red → green.
- [x] Task 2: SSR/typecheck/build testleri red → green.
- [x] Task 3: İçerik güvenliği/eşitliği testleri red → green.
- [x] Task 4: Debug/dağıtım ayarları kontrol edildi.
- [x] Task 5: Production smoke ve browser kabul sonuçları kaydedildi: WebSite/tests/browser-checklist.md.
- [ ] Son inceleme bulguları giderildi; gerçek API ve canlı Vercel için test edilen/bekleyen durumlar açıkça raporlandı.

## Plan öz-inceleme sonucu

Tasarımın URL, API, proxy, hata, SSR/hydration, içerik, asset, debug ve Vercel gereksinimleri yukarıdaki görevlerle eşlendi. Review Focus maddeleri kendi görevlerinin testlerine bağlandı. Görevler aynı servis/prop imzalarını kullanıyor; build sırasında API gerekmiyor. Ürün kodu henüz değiştirilmedi; uygulama için plan incelemesi ve yürütme yöntemi seçimi bekleniyor.

## Belge dayanakları

- https://reactrouter.com/upgrading/router-provider — framework Vite plugin, appDirectory ve SSR geçişi.
- https://reactrouter.com/how-to/resource-routes — Response döndüren API resource route'ları.
- https://vercel.com/docs/frameworks/frontend/react-router — `@vercel/react-router/vite` içindeki `vercelPreset()`.
- https://reactrouter.com/api/other-api/serve — production server build başlatma.

Uygulama başlangıcında paket peer/engines bilgileri kontrol edilerek uyumlu stabil sürümler lockfile'a sabitlenecek; bu plan deneysel API veya doğrulanmamış sürüm numarası dayatmıyor.
