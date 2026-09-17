import React from 'react';
import { Users, Fuel, Gauge, Briefcase, Star, Zap, Check, ArrowRight } from 'lucide-react';
import { Vehicle } from '../types';
import { useUser } from '../context/UserContext';

interface VehicleCardProps {
  vehicle: Vehicle;
  onViewDetails: (vehicle: Vehicle) => void;
  onBookNow: (vehicle: Vehicle) => void;
}

export const VehicleCard: React.FC<VehicleCardProps> = ({
  vehicle,
  onViewDetails,
  onBookNow
}) => {
  const { formatPrice } = useUser();
  const isAvailable = vehicle.status === 'Available';

  return (
    <div 
      id={`vehicle-card-${vehicle.id}`}
      className="group bg-white rounded-2xl border border-neutral-200 overflow-hidden shadow-sm hover:shadow-md transition-all duration-200 flex flex-col"
    >
      {/* Vehicle Image Container */}
      <div className="relative aspect-16/10 bg-neutral-100 overflow-hidden">
        <img
          src={vehicle.imageUrl}
          alt={`${vehicle.brand} ${vehicle.name}`}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />

        {/* Category & Status Badges */}
        <div className="absolute top-3 left-3 flex items-center gap-1.5 flex-wrap">
          <span className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-neutral-900/90 text-white backdrop-blur-sm shadow-sm">
            {vehicle.category}
          </span>
          {vehicle.fuelType === 'Electric' && (
            <span className="px-2 py-1 text-xs font-semibold rounded-lg bg-emerald-600/95 text-white backdrop-blur-sm flex items-center gap-1 shadow-sm">
              <Zap className="w-3 h-3" /> EV
            </span>
          )}
        </div>

        {/* Availability Badge */}
        <div className="absolute top-3 right-3">
          {isAvailable ? (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-semibold rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/80 shadow-xs">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Available
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-semibold rounded-full bg-amber-50 text-amber-800 border border-amber-200 shadow-xs">
              {vehicle.status}
            </span>
          )}
        </div>

        {/* Location tag bottom right */}
        <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded text-[10px] font-medium bg-black/60 text-white/90 backdrop-blur-xs">
          Reg: {vehicle.registrationNumber}
        </div>
      </div>

      {/* Body Content */}
      <div className="p-5 flex-1 flex flex-col">
        
        {/* Brand & Model Name + Rating */}
        <div className="flex items-start justify-between gap-2 mb-2">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-neutral-500">
              {vehicle.brand} • {vehicle.modelYear}
            </span>
            <h3 className="text-base font-bold text-neutral-900 leading-tight">
              {vehicle.name}
            </h3>
          </div>

          <div className="flex items-center gap-1 px-2 py-1 bg-amber-50 rounded-lg border border-amber-200/60 shrink-0">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
            <span className="text-xs font-bold text-neutral-900">{vehicle.rating}</span>
            <span className="text-[10px] text-neutral-500">({vehicle.reviewCount})</span>
          </div>
        </div>

        {/* Key Features Chips */}
        <div className="flex items-center gap-1.5 flex-wrap my-2">
          {vehicle.features.slice(0, 2).map((feat, idx) => (
            <span key={idx} className="inline-flex items-center gap-1 text-[11px] text-neutral-600 bg-neutral-100 px-2 py-0.5 rounded-md">
              <Check className="w-3 h-3 text-emerald-600" /> {feat}
            </span>
          ))}
          {vehicle.features.length > 2 && (
            <span className="text-[10px] text-neutral-400 font-medium self-center">
              +{vehicle.features.length - 2} more
            </span>
          )}
        </div>

        {/* Specifications Matrix */}
        <div className="grid grid-cols-4 gap-1 py-3 my-2 border-y border-neutral-100 text-center">
          <div className="flex flex-col items-center">
            <Users className="w-4 h-4 text-neutral-400 mb-1" />
            <span className="text-[11px] font-semibold text-neutral-700">{vehicle.seats} Seats</span>
          </div>
          <div className="flex flex-col items-center">
            <Gauge className="w-4 h-4 text-neutral-400 mb-1" />
            <span className="text-[11px] font-semibold text-neutral-700 truncate max-w-[65px]">{vehicle.transmission}</span>
          </div>
          <div className="flex flex-col items-center">
            <Fuel className="w-4 h-4 text-neutral-400 mb-1" />
            <span className="text-[11px] font-semibold text-neutral-700 truncate max-w-[65px]">{vehicle.fuelType}</span>
          </div>
          <div className="flex flex-col items-center">
            <Briefcase className="w-4 h-4 text-neutral-400 mb-1" />
            <span className="text-[11px] font-semibold text-neutral-700">{vehicle.luggageCount} Bags</span>
          </div>
        </div>

        {/* Pricing and Action Footer */}
        <div className="mt-auto pt-3 flex items-center justify-between gap-3">
          <div>
            <div className="flex items-baseline gap-1">
              <span className="text-xl font-black text-neutral-900">
                {formatPrice(vehicle.pricePerDay)}
              </span>
              <span className="text-xs text-neutral-500 font-medium">/ day</span>
            </div>
            <span className="text-[10px] text-neutral-400">
              {vehicle.mileageLimit} mileage
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              id={`btn-view-details-${vehicle.id}`}
              type="button"
              onClick={() => onViewDetails(vehicle)}
              className="px-3 py-2 text-xs font-semibold rounded-xl text-neutral-700 bg-neutral-100 hover:bg-neutral-200 transition"
            >
              Specs
            </button>
            <button
              id={`btn-book-vehicle-${vehicle.id}`}
              type="button"
              disabled={!isAvailable}
              onClick={() => onBookNow(vehicle)}
              className={`px-4 py-2 text-xs font-semibold rounded-xl flex items-center gap-1.5 transition shadow-sm ${
                isAvailable
                  ? 'bg-neutral-900 hover:bg-neutral-800 text-white cursor-pointer'
                  : 'bg-neutral-200 text-neutral-400 cursor-not-allowed'
              }`}
            >
              <span>{isAvailable ? 'Book Now' : 'Reserved'}</span>
              {isAvailable && <ArrowRight className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
