"use client";

import { useEffect, useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { FormData, JSONData, BakimTuru, IsEmri } from "@/lib/types";
import {
  TALEP_EDEN_BIRIMLER,
  ISI_YAPACAK_BIRIMLER,
  PERSONEL_SICIL,
} from "@/lib/constants";
import {
  generateUUID,
  formatDate,
  turkceKarakterTemizle,
} from "@/lib/utils";
import LocationSelector from "./LocationSelector";
import QRCodeDisplay from "./QRCodeDisplay";

const IS_EMIRLERI_STORAGE_KEY = "isEmirleri";
type DurumFiltresi = "Tum" | "Onay Bekliyor" | "Onaylandı";

const FormComponent = () => {
  const [formData, setFormData] = useState<FormData>({
    talepEdenBirim: "",
    isiYapacakBirim: "",
    sicilNo: "",
    isim: "",
    bakimTuru: "",
    lokasyon: "",
    aciklama: "",
  });

  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>(
    {}
  );
  const [jsonData, setJsonData] = useState<JSONData | null>(null);
  const [isEmirleri, setIsEmirleri] = useState<IsEmri[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [durumFiltresi, setDurumFiltresi] = useState<DurumFiltresi>("Tum");

  useEffect(() => {
    const raw = window.localStorage.getItem(IS_EMIRLERI_STORAGE_KEY);
    if (!raw) {
      return;
    }

    try {
      const parsed = JSON.parse(raw) as IsEmri[];
      if (Array.isArray(parsed)) {
        setIsEmirleri(parsed);
      }
    } catch {
      setIsEmirleri([]);
    }
  }, []);

  const saveIsEmirleriToStorage = (items: IsEmri[]) => {
    window.localStorage.setItem(IS_EMIRLERI_STORAGE_KEY, JSON.stringify(items));
    setIsEmirleri(items);
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof FormData, string>> = {};

    if (!formData.talepEdenBirim.trim()) {
      newErrors.talepEdenBirim = "Talep eden birim seçilmelidir";
    }
    if (!formData.isiYapacakBirim.trim()) {
      newErrors.isiYapacakBirim = "İşi yapacak birim seçilmelidir";
    }
    if (!formData.sicilNo.trim()) {
      newErrors.sicilNo = "Sicil no girilmelidir";
    }
    if (!formData.isim.trim()) {
      newErrors.isim = "İsim girilmelidir";
    }
    if (!formData.bakimTuru) {
      newErrors.bakimTuru = "İş emri türü seçilmelidir";
    }
    if (!formData.lokasyon.trim()) {
      newErrors.lokasyon = "Lokasyon seçilmelidir";
    }
    if (!formData.aciklama.trim()) {
      newErrors.aciklama = "Açıklama girilmelidir";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isFormValid = (): boolean => {
    return (
      formData.talepEdenBirim.trim() !== "" &&
      formData.isiYapacakBirim.trim() !== "" &&
      formData.sicilNo.trim() !== "" &&
      formData.isim.trim() !== "" &&
      formData.bakimTuru !== "" &&
      formData.lokasyon.trim() !== "" &&
      formData.aciklama.trim() !== ""
    );
  };

  const handleInputChange = (
    field: keyof FormData,
    value: string | BakimTuru
  ) => {
    setFormData((prev) => {
      const next = { ...prev, [field]: value };
      if (field === "sicilNo" && typeof value === "string") {
        const trimmed = value.trim();
        const personelIsim = PERSONEL_SICIL[trimmed];
        if (personelIsim) {
          next.isim = personelIsim;
        }
      }
      return next;
    });
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
    if (field === "sicilNo" && PERSONEL_SICIL[(value as string).trim()]) {
      setErrors((prev) => ({ ...prev, isim: undefined }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const jsonData: JSONData = {
      id: generateUUID(),
      talep_eden: turkceKarakterTemizle(formData.talepEdenBirim),
      hedef_birim: turkceKarakterTemizle(formData.isiYapacakBirim),
      sicil: turkceKarakterTemizle(formData.sicilNo),
      tip: turkceKarakterTemizle(formData.bakimTuru),
      lokasyon: turkceKarakterTemizle(formData.lokasyon),
      aciklama: turkceKarakterTemizle(formData.aciklama),
      tarih: formatDate(),
    };

    const yeniIsEmri: IsEmri = {
      ...jsonData,
      isim: turkceKarakterTemizle(formData.isim),
      status: "Onay Bekliyor",
      timestamp: Date.now(),
    };

    const guncelListe = [yeniIsEmri, ...isEmirleri];
    saveIsEmirleriToStorage(guncelListe);
    setJsonData(jsonData);
    setFormData({
      talepEdenBirim: "",
      isiYapacakBirim: "",
      sicilNo: "",
      isim: "",
      bakimTuru: "",
      lokasyon: "",
      aciklama: "",
    });
    setErrors({});
  };

  const handleApprove = (id: string) => {
    const guncelListe: IsEmri[] = isEmirleri.map((isEmri): IsEmri => {
      if (isEmri.id !== id) {
        return isEmri;
      }

      return {
        ...isEmri,
        status: "Onaylandı",
      };
    });

    saveIsEmirleriToStorage(guncelListe);
  };

  const handleClearAll = () => {
    const onay = window.confirm(
      "Tüm iş emirlerini silmek istediğinize emin misiniz?"
    );
    if (!onay) {
      return;
    }
    saveIsEmirleriToStorage([]);
    setJsonData(null);
  };

  const handleExportExcel = async () => {
    if (filtrelenmisIsEmirleri.length === 0) {
      window.alert("Aktarılacak iş emri bulunamadı.");
      return;
    }

    const ExcelJS = await import("exceljs");
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("İş Emirleri", {
      views: [{ state: "frozen", ySplit: 1 }],
    });

    worksheet.columns = [
      { header: "ID", key: "id", width: 20 },
      { header: "Tarih", key: "tarih", width: 22 },
      { header: "Lokasyon", key: "lokasyon", width: 24 },
      { header: "Arıza", key: "aciklama", width: 48 },
      { header: "Durum", key: "status", width: 16 },
      { header: "Sicil", key: "sicil", width: 14 },
      { header: "İsim", key: "isim", width: 28 },
    ];

    filtrelenmisIsEmirleri.forEach((isEmri) => {
      worksheet.addRow({
        id: isEmri.id,
        tarih: formatDisplayDate(isEmri.tarih),
        lokasyon: isEmri.lokasyon,
        aciklama: isEmri.aciklama,
        status: isEmri.status,
        sicil: isEmri.sicil,
        isim: isEmri.isim,
      });
    });

    worksheet.autoFilter = {
      from: "A1",
      to: "G1",
    };

    const headerRow = worksheet.getRow(1);
    headerRow.height = 22;
    headerRow.eachCell((cell) => {
      cell.font = { bold: true, color: { argb: "FFFFFFFF" }, size: 11 };
      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FF1D4ED8" },
      };
      cell.alignment = { vertical: "middle", horizontal: "center" };
      cell.border = {
        top: { style: "thin", color: { argb: "FFBFDBFE" } },
        left: { style: "thin", color: { argb: "FFBFDBFE" } },
        bottom: { style: "thin", color: { argb: "FFBFDBFE" } },
        right: { style: "thin", color: { argb: "FFBFDBFE" } },
      };
    });

    worksheet.eachRow((row, rowNumber) => {
      if (rowNumber === 1) {
        return;
      }

      row.eachCell((cell) => {
        cell.alignment = { vertical: "middle", horizontal: "left", wrapText: true };
        cell.border = {
          top: { style: "thin", color: { argb: "FFE5E7EB" } },
          left: { style: "thin", color: { argb: "FFE5E7EB" } },
          bottom: { style: "thin", color: { argb: "FFE5E7EB" } },
          right: { style: "thin", color: { argb: "FFE5E7EB" } },
        };
      });

      if (rowNumber % 2 === 0) {
        row.eachCell((cell) => {
          cell.fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: "FFF8FAFC" },
          };
        });
      }

      const statusCell = row.getCell(5);
      const statusText = String(statusCell.value ?? "");
      if (statusText === "Onaylandı") {
        statusCell.font = { bold: true, color: { argb: "FF166534" } };
        statusCell.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: "FFDCFCE7" },
        };
      } else {
        statusCell.font = { bold: true, color: { argb: "FFA16207" } };
        statusCell.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: "FFFEF9C3" },
        };
      }
      statusCell.alignment = { vertical: "middle", horizontal: "center" };
    });

    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `is-emri-takip-${new Date().toISOString().slice(0, 10)}.xlsx`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  };

  const formatDisplayDate = (dateText: string) => {
    const date = new Date(dateText);
    if (Number.isNaN(date.getTime())) {
      return dateText;
    }
    return date.toLocaleString("tr-TR");
  };

  const formIsValid = isFormValid();
  const seciliIsEmri = jsonData
    ? isEmirleri.find((isEmri) => isEmri.id === jsonData.id)
    : null;
  const isQrApproved = seciliIsEmri?.status === "Onaylandı";
  const normalizedSearch = searchTerm.trim().toLowerCase();
  const filtrelenmisIsEmirleri = isEmirleri.filter((isEmri) => {
    if (durumFiltresi !== "Tum" && isEmri.status !== durumFiltresi) {
      return false;
    }

    if (!normalizedSearch) {
      return true;
    }

    const aramaMetni = [
      isEmri.id,
      isEmri.lokasyon,
      isEmri.aciklama,
      isEmri.sicil,
      isEmri.isim,
    ]
      .join(" ")
      .toLowerCase();

    return aramaMetni.includes(normalizedSearch);
  });

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* 1. İsim ve Sicil No - En Üstte */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label
            htmlFor="sicil-no"
            className="block text-sm font-medium text-gray-900 mb-1"
          >
            Sicil No <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="sicil-no"
            value={formData.sicilNo}
            onChange={(e) => handleInputChange("sicilNo", e.target.value)}
            placeholder="12345"
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white text-gray-900 ${
              errors.sicilNo ? "border-red-500" : "border-gray-300"
            }`}
            aria-label="Sicil no girin"
            aria-required="true"
            tabIndex={0}
          />
          {errors.sicilNo && (
            <p className="text-sm text-red-500 mt-1">{errors.sicilNo}</p>
          )}
        </div>
        <div>
          <label
            htmlFor="isim"
            className="block text-sm font-medium text-gray-900 mb-1"
          >
            İsim <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="isim"
            value={formData.isim}
            onChange={(e) => handleInputChange("isim", e.target.value)}
            placeholder="Ahmet Yılmaz"
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white text-gray-900 ${
              errors.isim ? "border-red-500" : "border-gray-300"
            }`}
            aria-label="İsim girin"
            aria-required="true"
            tabIndex={0}
          />
          {errors.isim && (
            <p className="text-sm text-red-500 mt-1">{errors.isim}</p>
          )}
        </div>
      </div>

      {/* 2. Lokasyon ve Açıklama - Yan Yana */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <LocationSelector
            value={formData.lokasyon}
            onChange={(value) => handleInputChange("lokasyon", value)}
            error={errors.lokasyon}
          />
        </div>
        <div>
          <label
            htmlFor="aciklama"
            className="block text-sm font-medium text-gray-900 mb-1"
          >
            Açıklama <span className="text-red-500">*</span>
          </label>
          <textarea
            id="aciklama"
            value={formData.aciklama}
            onChange={(e) => handleInputChange("aciklama", e.target.value)}
            placeholder="Rulman yatağında aşırı ısınma."
            rows={4}
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none bg-white text-gray-900 ${
              errors.aciklama ? "border-red-500" : "border-gray-300"
            }`}
            aria-label="Açıklama girin"
            aria-required="true"
            tabIndex={0}
          />
          {errors.aciklama && (
            <p className="text-sm text-red-500 mt-1">{errors.aciklama}</p>
          )}
        </div>
      </div>

      {/* 3. Talep Eden ve İşi Yapacak Birim - Yan Yana */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label
            htmlFor="talep-eden-birim"
            className="block text-sm font-medium text-gray-900 mb-1"
          >
            Talep Eden Birim <span className="text-red-500">*</span>
          </label>
          <select
            id="talep-eden-birim"
            value={formData.talepEdenBirim}
            onChange={(e) => handleInputChange("talepEdenBirim", e.target.value)}
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white text-gray-900 ${
              errors.talepEdenBirim ? "border-red-500" : "border-gray-300"
            }`}
            aria-label="Talep eden birim seçin"
            aria-required="true"
            tabIndex={0}
          >
            <option value="">Seçiniz...</option>
            {TALEP_EDEN_BIRIMLER.map((birim) => (
              <option key={birim} value={birim}>
                {birim}
              </option>
            ))}
          </select>
          {errors.talepEdenBirim && (
            <p className="text-sm text-red-500 mt-1">{errors.talepEdenBirim}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="isi-yapacak-birim"
            className="block text-sm font-medium text-gray-900 mb-1"
          >
            İşi Yapacak Birim <span className="text-red-500">*</span>
          </label>
          <select
            id="isi-yapacak-birim"
            value={formData.isiYapacakBirim}
            onChange={(e) => handleInputChange("isiYapacakBirim", e.target.value)}
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white text-gray-900 ${
              errors.isiYapacakBirim ? "border-red-500" : "border-gray-300"
            }`}
            aria-label="İşi yapacak birim seçin"
            aria-required="true"
            tabIndex={0}
          >
            <option value="">Seçiniz...</option>
            {ISI_YAPACAK_BIRIMLER.map((birim) => (
              <option key={birim} value={birim}>
                {birim}
              </option>
            ))}
          </select>
          {errors.isiYapacakBirim && (
            <p className="text-sm text-red-500 mt-1">{errors.isiYapacakBirim}</p>
          )}
        </div>
      </div>

      {/* 4. İş Emri Türü - En Altta */}
      <div>
        <label className="block text-sm font-medium text-gray-900 mb-2">
          İş Emri Türü <span className="text-red-500">*</span>
        </label>
        <div className="flex flex-wrap gap-6">
          <label className="flex items-center cursor-pointer">
            <input
              type="radio"
              name="bakim-turu"
              value="Ariza"
              checked={formData.bakimTuru === "Ariza"}
              onChange={(e) => handleInputChange("bakimTuru", e.target.value as BakimTuru)}
              className="w-4 h-4 text-blue-600 focus:ring-blue-500"
              aria-label="Arıza bakım türü"
              tabIndex={0}
            />
            <span className="ml-2 text-gray-900">Arıza</span>
          </label>
          <label className="flex items-center cursor-pointer">
            <input
              type="radio"
              name="bakim-turu"
              value="Planli"
              checked={formData.bakimTuru === "Planli"}
              onChange={(e) => handleInputChange("bakimTuru", e.target.value as BakimTuru)}
              className="w-4 h-4 text-blue-600 focus:ring-blue-500"
              aria-label="Planlı bakım türü"
              tabIndex={0}
            />
            <span className="ml-2 text-gray-900">Planlı</span>
          </label>
          <label className="flex items-center cursor-pointer">
            <input
              type="radio"
              name="bakim-turu"
              value="Revizyon"
              checked={formData.bakimTuru === "Revizyon"}
              onChange={(e) => handleInputChange("bakimTuru", e.target.value as BakimTuru)}
              className="w-4 h-4 text-blue-600 focus:ring-blue-500"
              aria-label="Revizyon bakım türü"
              tabIndex={0}
            />
            <span className="ml-2 text-gray-900">Revizyon</span>
          </label>
          <label className="flex items-center cursor-pointer">
            <input
              type="radio"
              name="bakim-turu"
              value="IsIstek"
              checked={formData.bakimTuru === "IsIstek"}
              onChange={(e) => handleInputChange("bakimTuru", e.target.value as BakimTuru)}
              className="w-4 h-4 text-blue-600 focus:ring-blue-500"
              aria-label="İş İstek iş emri türü"
              tabIndex={0}
            />
            <span className="ml-2 text-gray-900">İş İstek</span>
          </label>
          <label className="flex items-center cursor-pointer">
            <input
              type="radio"
              name="bakim-turu"
              value="Yatirim"
              checked={formData.bakimTuru === "Yatirim"}
              onChange={(e) => handleInputChange("bakimTuru", e.target.value as BakimTuru)}
              className="w-4 h-4 text-blue-600 focus:ring-blue-500"
              aria-label="Yatırım bakım türü"
              tabIndex={0}
            />
            <span className="ml-2 text-gray-900">Yatırım</span>
          </label>
        </div>
        {errors.bakimTuru && (
          <p className="text-sm text-red-500 mt-1">{errors.bakimTuru}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={!formIsValid}
        className={`w-full py-3 px-6 rounded-lg font-semibold text-white transition-colors ${
          formIsValid
            ? "bg-blue-600 hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            : "bg-gray-400 cursor-not-allowed"
        }`}
        aria-label="QR kod oluştur"
        tabIndex={0}
      >
        QR Oluştur
      </button>
      {!formIsValid && (
        <p className="text-sm font-medium text-red-600">
          Lütfen tüm bilgileri doldurunuz.
        </p>
      )}

      <QRCodeDisplay jsonData={jsonData} isApproved={isQrApproved} />

      <div className="mt-8 rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-900">
        <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
            Canlı İş Emri Takip Paneli
          </h2>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={handleExportExcel}
              className="rounded-md bg-emerald-600 px-3 py-2 text-xs font-semibold text-white hover:bg-emerald-700"
              aria-label="Excel'e aktar"
            >
              Excel&apos;e Aktar
            </button>
            <button
              type="button"
              onClick={handleClearAll}
              className="rounded-md bg-red-600 px-3 py-2 text-xs font-semibold text-white hover:bg-red-700"
              aria-label="Tüm iş emirlerini temizle"
            >
              Tümünü Temizle
            </button>
          </div>
        </div>
        <div className="mb-4 grid grid-cols-1 gap-3 md:grid-cols-2">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="ID, sicil, isim, lokasyon veya açıklama ara"
            className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-100"
            aria-label="İş emri ara"
          />
          <select
            value={durumFiltresi}
            onChange={(e) => setDurumFiltresi(e.target.value as DurumFiltresi)}
            className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-100"
            aria-label="Durum filtresi seç"
          >
            <option value="Tum">Tüm Durumlar</option>
            <option value="Onay Bekliyor">Onay Bekliyor</option>
            <option value="Onaylandı">Onaylandı</option>
          </select>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-100 dark:bg-gray-800">
              <tr>
                <th className="px-3 py-2 text-left text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300">
                  QR
                </th>
                <th className="px-3 py-2 text-left text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300">
                  Tarih
                </th>
                <th className="px-3 py-2 text-left text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300">
                  Lokasyon
                </th>
                <th className="px-3 py-2 text-left text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300">
                  Arıza
                </th>
                <th className="px-3 py-2 text-left text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300">
                  Durum
                </th>
                <th className="px-3 py-2 text-left text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300">
                  İşlem
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 bg-white dark:divide-gray-800 dark:bg-gray-900">
              {filtrelenmisIsEmirleri.length === 0 && (
                <tr>
                  <td
                    colSpan={6}
                    className="px-3 py-6 text-center text-sm text-gray-500 dark:text-gray-400"
                  >
                    İş emri bulunamadı.
                  </td>
                </tr>
              )}
              {filtrelenmisIsEmirleri.map((isEmri) => (
                <tr key={isEmri.id}>
                  <td className="whitespace-nowrap px-3 py-3 text-sm font-medium text-gray-900 dark:text-gray-100">
                    <div className="inline-block rounded bg-white p-1 dark:bg-gray-950">
                      <QRCodeSVG
                        value={JSON.stringify(isEmri)}
                        size={48}
                        level="M"
                        includeMargin={false}
                        aria-label="İş emri QR kodu"
                      />
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-3 py-3 text-sm text-gray-700 dark:text-gray-300">
                    {formatDisplayDate(isEmri.tarih)}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3 text-sm text-gray-700 dark:text-gray-300">
                    {isEmri.lokasyon}
                  </td>
                  <td className="max-w-xs truncate px-3 py-3 text-sm text-gray-700 dark:text-gray-300">
                    {isEmri.aciklama}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3 text-sm">
                    {isEmri.status === "Onaylandı" ? (
                      <span className="inline-flex rounded-full bg-green-100 px-2.5 py-1 text-xs font-semibold text-green-700 dark:bg-green-900/40 dark:text-green-300">
                        Onaylandı
                      </span>
                    ) : (
                      <span className="inline-flex rounded-full bg-yellow-100 px-2.5 py-1 text-xs font-semibold text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300">
                        Onay Bekliyor
                      </span>
                    )}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3 text-sm">
                    <button
                      type="button"
                      onClick={() => handleApprove(isEmri.id)}
                      disabled={isEmri.status === "Onaylandı"}
                      className={`rounded-md px-3 py-1.5 text-xs font-semibold text-white ${
                        isEmri.status === "Onaylandı"
                          ? "cursor-not-allowed bg-gray-400"
                          : "bg-blue-600 hover:bg-blue-700"
                      }`}
                      aria-label="İş emrini onayla"
                    >
                      Onayla
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </form>
  );
};

export default FormComponent;
