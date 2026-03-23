"use client";

import { useState, useEffect } from "react";
import { LOKASYON_HIYERARSI } from "@/lib/constants";

interface LocationSelectorProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

const LocationSelector = ({ value, onChange, error }: LocationSelectorProps) => {
  const [selectedMainLocation, setSelectedMainLocation] = useState<string>("");
  const [selectedSubLocation, setSelectedSubLocation] = useState<string>("");

  useEffect(() => {
    if (value) {
      const parts = value.split(" - ");
      if (parts.length === 2) {
        setSelectedMainLocation(parts[0]);
        setSelectedSubLocation(parts[1]);
      } else {
        setSelectedMainLocation(value);
        setSelectedSubLocation("");
      }
    } else {
      setSelectedMainLocation("");
      setSelectedSubLocation("");
    }
  }, [value]);

  const handleMainLocationChange = (mainLocation: string) => {
    setSelectedMainLocation(mainLocation);
    setSelectedSubLocation("");
    onChange(mainLocation);
  };

  const handleSubLocationChange = (subLocation: string) => {
    setSelectedSubLocation(subLocation);
    const fullLocation = `${selectedMainLocation} - ${subLocation}`;
    onChange(fullLocation);
  };

  const mainLocations = Object.keys(LOKASYON_HIYERARSI);
  const subLocations = selectedMainLocation
    ? LOKASYON_HIYERARSI[selectedMainLocation] || []
    : [];

  return (
    <div className="space-y-3">
      <div>
        <label
          htmlFor="main-location"
          className="block text-sm font-medium text-gray-900 mb-1"
        >
          Ana Lokasyon <span className="text-red-500">*</span>
        </label>
        <select
          id="main-location"
          value={selectedMainLocation}
          onChange={(e) => handleMainLocationChange(e.target.value)}
          className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white text-gray-900 ${
            error ? "border-red-500" : "border-gray-300"
          }`}
          aria-label="Ana lokasyon seçin"
          tabIndex={0}
        >
          <option value="">Seçiniz...</option>
          {mainLocations.map((location) => (
            <option key={location} value={location}>
              {location}
            </option>
          ))}
        </select>
      </div>

      {selectedMainLocation && subLocations.length > 0 && (
        <div>
          <label
            htmlFor="sub-location"
            className="block text-sm font-medium text-gray-900 mb-1"
          >
            Alt Lokasyon
          </label>
          <select
            id="sub-location"
            value={selectedSubLocation}
            onChange={(e) => handleSubLocationChange(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white text-gray-900"
            aria-label="Alt lokasyon seçin"
            tabIndex={0}
          >
            <option value="">Seçiniz...</option>
            {subLocations.map((location) => (
              <option key={location} value={location}>
                {location}
              </option>
            ))}
          </select>
        </div>
      )}

      {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
    </div>
  );
};

export default LocationSelector;
