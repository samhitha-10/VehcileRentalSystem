import React from 'react';
import { X, Users, Fuel, Gauge, Briefcase, Star, Zap, CheckCircle2, ShieldAlert, ArrowRight, ShieldCheck, HelpCircle } from 'lucide-react';
import { Vehicle } from '../types';
import { useUser } from '../context/UserContext';
import { LOCATIONS } from '../data/locations';

interface VehicleDetailsModalProps {
  vehicle: Vehicle | null;
  onClose: () => void;
  onBookNow: (vehicle: Vehicle) => void;
}

export const VehicleDetailsModal: React.FC<VehicleDetailsModalProps> = ({
  vehicle,
  onClose,
  onBookNow
}) => {
  const { formatPrice } = useUser();
  if (!vehicle) return null;

  const locationInfo = LOCATIONS.find(l => l.id === vehicle.location) || LOCATIONS[0];
  const isAvailable = vehicle.status === 'Available';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-neutral-900/70 backdrop-blur-xs">
      <div 
        id="vehicle-details-modal-box"
        className="relative bg-white rounded-2xl max-w-2xl w-full overflow-hidden shadow-2xl border border-neutral-200 my-8 animate-in fade-in zoom-in-95 duration-200"
      >
        
        {/* Modal Header & Close Button */}
        <div className="relative aspect-16/9 bg-neutral-900">
          <img
            src={vehicle.imageUrl}
            alt={vehicle.name}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/40" />

          {/* Close button */}
          <button
            id="btn-close-vehicle-details"
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/50 hover:bg-black/80 text-white flex items-center justify-center backdrop-blur-sm transition"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Overlay titles */}
          <div className="absolute bottom-4 left-4 right-4 text-white">
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-white/20 backdrop-blur-md">
                {vehicle.category}
              </span>
              <span className="text-xs text-neutral-300">
                Reg: {vehicle.registrationNumber}
              </span>
            </div>
            <h2 className="text-2xl font-black tracking-tight">
              {vehicle.brand} {vehicle.name} ({vehicle.modelYear})
            </h2>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 max-h-[60vh] overflow-y-auto">
          
          {/* Rating and price row */}
          <div className="flex items-center justify-between pb-4 border-b border-neutral-100">
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 px-2.5 py-1 bg-amber-50 rounded-lg border border-amber-200">
                <Star className="w-4 h-4 fill-amber-400 text-amber-500" />
                <span className="text-sm font-bold text-neutral-900">{vehicle.rating}</span>
                <span className="text-xs text-neutral-500">({vehicle.reviewCount} customer reviews)</span>
              </div>
              <span className="text-xs text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200 font-semibold">
                Available at {locationInfo.name}
              </span>
            </div>

            <div className="text-right">
              <div className="text-2xl font-black text-neutral-900">
                {formatPrice(vehicle.pricePerDay)}
                <span className="text-xs text-neutral-500 font-normal"> / day</span>
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-500 mb-2">Overview</h4>
            <p className="text-sm text-neutral-700 leading-relaxed">
              {vehicle.description}
            </p>
          </div>

          {/* Key Mechanical Specifications Grid */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-500 mb-3">Vehicle Specifications</h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div className="p-3 rounded-xl bg-neutral-50 border border-neutral-200/80">
                <span className="text-[11px] text-neutral-500 block mb-0.5">Seating Capacity</span>
                <div className="flex items-center gap-1.5 font-bold text-neutral-900 text-sm">
                  <Users className="w-4 h-4 text-neutral-500" />
                  <span>{vehicle.seats} Passengers</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-neutral-50 border border-neutral-200/80">
                <span className="text-[11px] text-neutral-500 block mb-0.5">Transmission</span>
                <div className="flex items-center gap-1.5 font-bold text-neutral-900 text-sm">
                  <Gauge className="w-4 h-4 text-neutral-500" />
                  <span>{vehicle.transmission}</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-neutral-50 border border-neutral-200/80">
                <span className="text-[11px] text-neutral-500 block mb-0.5">Fuel / Efficiency</span>
                <div className="flex items-center gap-1.5 font-bold text-neutral-900 text-sm">
                  <Fuel className="w-4 h-4 text-neutral-500" />
                  <span>{vehicle.fuelEfficiency}</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-neutral-50 border border-neutral-200/80">
                <span className="text-[11px] text-neutral-500 block mb-0.5">Luggage Room</span>
                <div className="flex items-center gap-1.5 font-bold text-neutral-900 text-sm">
                  <Briefcase className="w-4 h-4 text-neutral-500" />
                  <span>{vehicle.luggageCount} Suitcases</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-neutral-50 border border-neutral-200/80">
                <span className="text-[11px] text-neutral-500 block mb-0.5">Top Speed</span>
                <div className="flex items-center gap-1.5 font-bold text-neutral-900 text-sm">
                  <Zap className="w-4 h-4 text-neutral-500" />
                  <span>{vehicle.topSpeedKmH} km/h</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-neutral-50 border border-neutral-200/80">
                <span className="text-[11px] text-neutral-500 block mb-0.5">Mileage Policy</span>
                <div className="flex items-center gap-1.5 font-bold text-neutral-900 text-sm">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>{vehicle.mileageLimit}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Included Features */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-500 mb-3">Included Amenities & Tech</h4>
            <div className="grid grid-cols-2 gap-2">
              {vehicle.features.map((feat, idx) => (
                <div key={idx} className="flex items-center gap-2 text-xs font-medium text-neutral-700">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{feat}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Rental Requirements & Terms */}
          <div className="p-4 rounded-xl bg-neutral-50 border border-neutral-200 text-xs text-neutral-600 space-y-1.5">
            <div className="flex items-center gap-1.5 font-semibold text-neutral-900 mb-1">
              <ShieldCheck className="w-4 h-4 text-sky-600" />
              <span>Rental Requirements</span>
            </div>
            <p>• Valid Driver's License held for at least 1 year required at pickup.</p>
            <p>• Minimum driver age: 21 years (18 for two-wheelers).</p>
            <p>• Clean return policy with full-tank return or prepaid electric charge level.</p>
          </div>

        </div>

        {/* Modal Footer CTA */}
        <div className="p-5 bg-neutral-50 border-t border-neutral-200 flex items-center justify-between gap-4">
          <div>
            <span className="text-xs text-neutral-500 block">Estimated daily rate</span>
            <span className="text-xl font-bold text-neutral-900">{formatPrice(vehicle.pricePerDay)}</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              id="btn-modal-cancel"
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-xs font-semibold text-neutral-700 hover:bg-neutral-200/80 transition"
            >
              Close
            </button>
            <button
              id="btn-modal-book-now"
              type="button"
              disabled={!isAvailable}
              onClick={() => {
                onClose();
                onBookNow(vehicle);
              }}
              className={`px-5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition shadow-sm ${
                isAvailable
                  ? 'bg-neutral-900 hover:bg-neutral-800 text-white cursor-pointer'
                  : 'bg-neutral-300 text-neutral-500 cursor-not-allowed'
              }`}
            >
              <span>{isAvailable ? 'Proceed to Reservation' : 'Currently Rented'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
