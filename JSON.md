# PRD: Arıza & İş Emri Oluşturucu (v1.0)

**Tarih:** 12 Şubat 2026  
**Durum:** Taslak (Draft)  
**Hazırlayan:** Senior Full Stack Developer & Endüstri Mühendisi (Sen)

---

## 1. Proje Özeti (Executive Summary)
**Amaç:** Sahadaki operatörlerin arıza bildirimlerini standart bir formatta (JSON) oluşturup, bu veriyi QR kod aracılığıyla yetkili kişilere (Mühendis/Ambar) aktarmasını sağlayan web tabanlı, sunucu gerektirmeyen (client-side) bir araçtır.

**Temel Değer:** * Kağıt israfını önlemek.
* El yazısı okunama hatalarını bitirmek.
* Veriyi SAP entegrasyonuna hazır standart (JSON) hale getirmek.

---

## 2. Kullanıcı Profilleri (User Personas)

### 👤 Operatör (Talep Eden)
* **Özellikler:** Sahadadır, teknolojiyle arası orta seviyedir, hızlı işlem yapmak ister.
* **Beklenti:** Formu hızlıca doldurup, hatasız bir QR kod üretmek.

### 👤 Mühendis/Ambarcı (Talep Alan)
* **Özellikler:** Ofis veya ambardadır, veriyi işleyen kişidir.
* **Beklenti:** QR kodu okuttuğunda karmaşık yazılar yerine düzenli bir veri seti görmek.

---

## 3. Kullanıcı Hikayeleri (User Stories)

1. **Operatör olarak;** arıza formundaki kritik alanları boş geçmemek istiyorum ki eksik bilgi ile iş emri açılmasın.
2. **Operatör olarak;** formu doldurduğumda anında bir QR kod görmek istiyorum.
3. **Yönetici olarak;** QR kodu okuttuğumda verinin standart bir yapıda (JSON) gelmesini istiyorum ki SAP sistemine kolayca aktarabileyim.

---

## 4. Fonksiyonel Gereksinimler (Requirements)

### A. Veri Giriş Formu (Zorunlu Alanlar)
Aşağıdaki alanların tamamı doldurulmadan "QR Oluştur" butonu aktif olmayacaktır:

| Alan Adı | Tip | Örnek Veri |
| :--- | :--- | :--- |
| **Talep Eden Birim** | Seçim (Dropdown) | Mekanik Bakım |
| **İşi Yapacak Birim** | Seçim (Dropdown) | Elektrik Bakım |
| **Sicil No / İsim** | Metin (Input) | 12345 - Ahmet Yılmaz |
| **Bakım Türü** | Radyo Buton | Arıza / Planlı |
| **Lokasyon** | Hiyerarşik Seçim | Döner Fırın 1 > Konkasör |
| **Açıklama** | Uzun Metin | Rulman yatağında aşırı ısınma. |

### B. Çıktı Formatı (JSON Yapısı)
Sistem arka planda şu formatta bir JSON üretecektir:

```json
{
  "id": "UUID-RST-102",
  "talep_eden": "Mekanik Bakim",
  "hedef_birim": "Elektrik Bakim",
  "sicil": "12345",
  "tip": "Ariza",
  "lokasyon": "Doner Firin 1 - Konkasor",
  "aciklama": "Rulman yataginda asiri isinma.",
  "tarih": "2026-02-12T14:30:00"
}