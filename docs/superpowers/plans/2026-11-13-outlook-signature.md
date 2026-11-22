# Outlook Signature Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Yeni Outlook'a kopyalanabilir, işlevsel HTML imzası sunmak.

**Architecture:** Mevcut AuthorHero içeriğinden bağımsız, tablo yerleşimli ve satır içi stilli statik HTML üret. Site kodunu değiştirme.

**Tech Stack:** HTML, Markdown.

**Spec:** `docs/superpowers/specs/2026-11-13-outlook-signature-design.md`

## Global Constraints
- Yeni bağımlılık eklenmeyecek; web sitesi değiştirilmeyecek.
- Fotoğraf, ad, mevcut unvan ve tanıtım, teknoloji listesi, site ve dört sosyal profil bağlantısı korunacak.
- Script, harici CSS ve takip kodu olmayacak.

## Review Focus
- Uzak resimler engellendiğinde ad ve bağlantılar metin olarak kalmalı.
- Yerel dosya taşındığında bağlantılar mutlak HTTPS adresleriyle çalışmalı.
- Türkçe karakterler UTF-8 ile korunmalı.
- Kopyalama sırasında yönerge imzanın içine karışmamalı; yönerge ayrı dosyada olmalı.
- Outlook stil sadeleştirmeleri içeriği veya bağlantıları işlevsiz bırakmamalı; istemci testi sınırı belirtilmeli.

### Task 1: Bağımsız imza ve yönerge

**Files:**
- Create: `email-signature/hayri-habip-outlook.html`
- Create: `email-signature/KURULUM.md`

**Interfaces:** Mevcut `WebSite/src/components/AuthorHero.tsx` içeriğini tüketir; tarayıcıda açılıp kopyalanabilen HTML üretir.

- [x] Mevcut kart içeriğini ve profil fotoğrafının canlı HTTPS adresinin erişilebilirliğini kontrol et. Microsoft'un güncel yeni Outlook imza ekleme yönergesini doğrula.
- [x] Tablo yerleşimi, satır içi stiller, UTF-8, fotoğraf alternatif metni ve mutlak HTTPS bağlantılarıyla HTML oluştur; kopyalanan gövdeye yalnızca imzayı koy.
- [x] Türkçe kurulum yönergesine tarayıcıdan kopyalama, yeni Outlook imza ayarlarına yapıştırma, varsayılan atama ve deneme e-postası adımlarını ekle. Uzak resim engelleme ve gerçek Outlook testi sınırını belirt.
- [x] HTML'yi ayrıştırarak beklenen metin ve bağlantıları, resim alternatif metnini, UTF-8 karakterlerini ve script/yerel dosya/harici CSS bulunmadığını doğrula. Fotoğraf URL'si HTTP 200 döndü. Tarayıcı/Outlook görsel testi yapılmadı.
- [x] Dosyaları kullanıcıya açık yollarla paylaş; Outlook'ta test edilmediğini belirt. Kullanıcı istemedikçe commit oluşturma.

## Uygulama kaydı
- Bağlantı sayısı altıdır: ana site, hakkımda ve dört sosyal profil. Planın ilk sürümündeki beş sayısı düzeltildi.
- Python HTMLParser kontrolü geçti: altı beklenen HTTPS bağlantısı, Türkçe içerik, fotoğraf alternatif metni, UTF-8, yönerge dosyası ve aktif içerik bulunmaması doğrulandı. İlk kontrol Windows standart girdi kodlaması nedeniyle başarısız oldu; Unicode kaçışlarıyla aynı kontrol tekrar çalıştırıldı ve geçti.
- Tasarım tarayıcısı yalnızca Arial kullanımını uyardı; e-posta uyumluluğu için onaylı sistem yazı tipi kararı korundu.
- Canlı fotoğraf 2.305.992 bayt; boyut ve uzak resim sınırları kurulum yönergesinde belirtildi.
- Mevcut kullanıcı dosyası `WebSite/signature.png` incelendi, değiştirilmedi. Site koduna dokunulmadı; commit oluşturulmadı.
