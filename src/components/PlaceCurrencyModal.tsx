import React from 'react';
import { X, Globe2, Check, MapPin, ArrowRight } from 'lucide-react';
import { useUser } from '../context/UserContext';
import { SUPPORTED_PLACES } from '../data/places';

interface PlaceCurrencyModalProps {
  onClose: () => void;
}

export const PlaceCurrencyModal: React.FC<PlaceCurrencyModalProps> = ({ onClose }) => {
  const { place, setPlaceByCode } = useUser();

  const handleSelect = (countryCode: string) => {
    setPlaceByCode(countryCode);
    onClose();
  };

  return (
    <div 
      id="place-currency-modal-overlay"
      className="fixed inset-0 z-50 bg-neutral-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div 
        id="place-currency-modal-card"
        className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-neutral-200 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="bg-neutral-900 text-white p-5 sm:p-6 relative">
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-neutral-800 text-xs font-semibold text-emerald-400 mb-2 border border-neutral-700">
            <Globe2 className="w-3.5 h-3.5" />
            <span>Currency & Regional Localization</span>
          </div>

          <h2 className="text-xl font-bold text-white">
            Select Your Place & Currency
          </h2>
          <p className="text-xs text-neutral-400 mt-1">
            Choose your regional location to automatically format fleet rates into your local currency (e.g. ₹ INR in India, $ in US).
          </p>
        </div>

        {/* List of Countries / Places */}
        <div className="p-4 sm:p-5 max-h-[65vh] overflow-y-auto space-y-2">
          {SUPPORTED_PLACES.map((p) => {
            const isSelected = p.countryCode === place.countryCode;
            return (
              <button
                key={p.countryCode}
                id={`btn-select-place-${p.countryCode.toLowerCase()}`}
                type="button"
                onClick={() => handleSelect(p.countryCode)}
                className={`w-full flex items-center justify-between p-3.5 rounded-xl border transition text-left ${
                  isSelected
                    ? 'bg-emerald-50/80 border-emerald-500/80 text-neutral-900 shadow-xs'
                    : 'bg-white border-neutral-200 hover:border-neutral-300 hover:bg-neutral-50/80 text-neutral-800'
                }`}
              >
                <div className="flex items-center gap-3.5">
                  <span className="text-2xl select-none">{p.flag}</span>
                  <div>
                    <div className="text-xs font-bold flex items-center gap-1.5">
                      <span>{p.countryName}</span>
                      {p.countryCode === 'IN' && (
                        <span className="px-1.5 py-0.2 bg-amber-100 text-amber-800 text-[10px] font-bold rounded">
                          ₹ Rs
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] text-neutral-500">
                      Currency: <span className="font-semibold text-neutral-700">{p.currencyDisplay}</span> ({p.currencyName})
                    </div>
                    <div className="text-[10px] text-neutral-400 mt-0.5">
                      Hubs: {p.sampleCities.join(', ')}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-neutral-900 px-2 py-1 bg-neutral-100 rounded-lg">
                    {p.currencySymbol}
                  </span>
                  {isSelected ? (
                    <div className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center">
                      <Check className="w-3.5 h-3.5" />
                    </div>
                  ) : (
                    <div className="w-6 h-6 rounded-full bg-neutral-100 text-neutral-400 flex items-center justify-center group-hover:text-neutral-700">
                      <ArrowRight className="w-3.5 h-3.5" />
                    </div>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* Footer */}
        <div className="p-4 bg-neutral-50 border-t border-neutral-200 flex items-center justify-between text-xs text-neutral-500">
          <span>Active place: <strong className="text-neutral-900">{place.flag} {place.countryName} ({place.currencyDisplay})</strong></span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 bg-neutral-900 text-white font-medium rounded-lg text-xs hover:bg-neutral-800 transition"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
