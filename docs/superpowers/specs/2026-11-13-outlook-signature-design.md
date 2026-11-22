# Yeni Outlook için e-posta imzası

## Onaylanan tasarım
Sitenin AuthorHero kartını, yeni Outlook'un imza düzenleyicisine tarayıcıdan kopyalanabilecek bağımsız bir HTML dosyasına uyarlamak. Fotoğraf, Hayri HABİP adı, mevcut unvan ve tanıtım, teknoloji listesi, site ve dört sosyal profil bağlantısı korunacak. Web sitesi değiştirilmeyecek; yeni bağımlılık eklenmeyecek.

## Yaklaşımlar
- Seçilen: Tıklanabilir HTML. Metin seçilebilir, bağlantılar ayrı ayrı çalışır; Outlook'un desteklemediği görsel ayrıntılar sadeleştirilir.
- Elenen: Tek parça görsel. Görünüm sabittir ancak bağlantılar ayrı çalışmaz ve resim engellenince içerik kaybolur.

## Uygulayıcının kararları ve sınırlar
E-posta uyumlu tablo yerleşimi, satır içi stiller ve sistem yazı tipleri kullanılacak. Sosyal bağlantılar SVG yerine metin olarak gösterilecek. Fotoğraf için sitenin herkese açık HTTPS adresi kullanılacak; alıcı uzak resimleri engelleyebilir. Script, harici CSS ve takip kodu olmayacak. Yeni Outlook'a ekleme yönergesi ayrı dosyada verilecek. Gerçek Outlook oturumu olmadan istemci içi görünüm doğrulaması iddia edilmeyecek.
