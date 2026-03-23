"use client";

import { QRCodeSVG } from "qrcode.react";
import { JSONData } from "@/lib/types";

interface QRCodeDisplayProps {
  jsonData: JSONData | null;
  isApproved: boolean;
}

const QRCodeDisplay = ({ jsonData, isApproved }: QRCodeDisplayProps) => {
  if (!jsonData) {
    return null;
  }

  const jsonString = JSON.stringify(jsonData, null, 2);

  return (
    <div className="mt-8 rounded-lg border-2 border-gray-200 bg-gray-50 p-6 dark:border-gray-700 dark:bg-gray-900/30">
      <div className="mb-4 flex items-center justify-between gap-3">
        <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">QR Kod</h2>
        {isApproved && (
          <span
            className="inline-flex items-center rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-800 dark:bg-green-900/40 dark:text-green-300"
            aria-label="Onaylı iş emri"
          >
            Onaylı İş Emri
          </span>
        )}
      </div>
      <div className="flex flex-col md:flex-row gap-6 items-start">
        <div className="flex-shrink-0 bg-white p-4 rounded-lg shadow-md">
          <QRCodeSVG
            value={jsonString}
            size={256}
            level="H"
            includeMargin={true}
            aria-label="QR kod görüntüsü"
          />
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-800 mb-2 dark:text-gray-200">
            JSON Verisi
          </h3>
          <pre className="overflow-auto rounded-lg border border-gray-300 bg-white p-4 font-mono text-sm text-gray-700 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-200">
            {jsonString}
          </pre>
        </div>
      </div>
    </div>
  );
};

export default QRCodeDisplay;
