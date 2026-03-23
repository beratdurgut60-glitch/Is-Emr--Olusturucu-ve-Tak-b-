/** Personel sicil no → isim eşlemesi. Sicil no yazıldığında isim otomatik dolar. */
export const PERSONEL_SICIL: Record<string, string> = {
  "2053": "Hüseyin Berat Durgut",
  // Buraya yeni personel ekleyebilirsin: "sicil_no": "Ad Soyad",
};

export const TALEP_EDEN_BIRIMLER = [
  "Makina bakım",
  "Elektrik bakım",
  "Üretim",
  "Atölye bakım",
  "WHR",
  "Oto bakım",
  "Planlı Bakım",
];

export const ISI_YAPACAK_BIRIMLER = [
  "Makina bakım",
  "Elektrik bakım",
  "Üretim",
  "Atölye bakım",
  "WHR",
  "Oto bakım",
  "Planlı Bakım",
];

export const LOKASYON_HIYERARSI: { [key: string]: string[] } = {
  "Döner Fırın 1": ["Konkasör", "Değirmen", "Fırın"],
  "Döner Fırın 2": ["Konkasör", "Değirmen", "Fırın"],
  Paketleme: ["Eski Paketleme", "Yeni Paketleme", "Keramik"],
  WHR: ["Kazan", "Türbin", "Kondenser", "Pompa", "Elektrik Odası"],
  "Üretim Binaları": ["Paketleme Binası", "Hammadde Binası", "Klinker Binası", "Kontrol Odası"],
  "Mobil Ekipmanlar": ["Forklift", "Loader", "Ekskavatör", "Transpalet", "Mobil Kompresör"],
  "Ağır Araçlar": ["Kamyon", "Tır", "Dorse", "Beton Mikseri", "Çekici"],
  "Farin Değirmeni 1": ["Değirmen", "Besleme", "Elektrik"],
  "Farin Değirmeni 2": ["Değirmen", "Besleme", "Elektrik"],
  "Farin Değirmeni 3": ["Değirmen", "Besleme", "Elektrik"],
  "Çimento Değirmeni 1": ["Değirmen", "Besleme", "Elektrik"],
  "Çimento Değirmeni 2": ["Değirmen", "Besleme", "Elektrik"],
  "Çimento Değirmeni 3": ["Değirmen", "Besleme", "Elektrik"],
  "Çimento Değirmeni 4": ["Değirmen", "Besleme", "Elektrik"],
  "Çimento Değirmeni 5": ["Değirmen", "Besleme", "Elektrik"],
  "Çimento Ortak": ["Ortak Alan", "Depolama", "Elektrik"],
  "Kömür Değirmeni 1": ["Değirmen", "Besleme", "Elektrik"],
  "Kömür Değirmeni 2": ["Değirmen", "Besleme", "Elektrik"],
  "Kırıcı 1": ["Kırıcı", "Besleme", "Elektrik"],
  "Kırıcı 2": ["Kırıcı", "Besleme", "Elektrik"],
  "Kırıcı 3": ["Kırıcı", "Besleme", "Elektrik"],
};
