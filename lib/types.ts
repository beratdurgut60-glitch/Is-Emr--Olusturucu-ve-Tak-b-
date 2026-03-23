export type BakimTuru =
  | "Ariza"
  | "Planli"
  | "Revizyon"
  | "Yatirim"
  | "IsIstek";

export interface FormData {
  talepEdenBirim: string;
  isiYapacakBirim: string;
  sicilNo: string;
  isim: string;
  bakimTuru: BakimTuru | "";
  lokasyon: string;
  aciklama: string;
}

export interface JSONData {
  id: string;
  talep_eden: string;
  hedef_birim: string;
  sicil: string;
  tip: string;
  lokasyon: string;
  aciklama: string;
  tarih: string;
}

export type IsEmriDurumu = "Onay Bekliyor" | "Onaylandı";

export interface IsEmri extends JSONData {
  isim: string;
  status: IsEmriDurumu;
  timestamp: number;
}
