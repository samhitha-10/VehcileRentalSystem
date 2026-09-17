import React, { useMemo } from 'react';
import { MapPin, Calendar, Search, Sparkles, CheckCircle2, Shield, Fuel, Globe2, ChevronDown } from 'lucide-react';
import { LOCATIONS } from '../data/locations';
import { FilterState, VehicleCategory } from '../types';
import { useUser } from '../context/UserContext';

interface HeroSearchProps {
  filter: FilterState;
  setFilter: React.Dispatch<React.SetStateAction<FilterState>>;
  onSearchClick: () => void;
}

export const HeroSearch: React.FC<HeroSearchProps> = ({
  filter,
  setFilter,
  onSearchClick
}) => {
  const { place, setIsPlaceModalOpen, user, isLoggedIn, setIsAuthModalOpen } = useUser();
  const categories: VehicleCategory[] = ['All', 'Sedan', 'SUV', 'Electric', 'Luxury', 'Sports', 'Motorcycle', 'Van'];

  const sortedLocations = useMemo(() => {
    return [...LOCATIONS].sort((a, b) => {
      if (a.countryCode === place.countryCode && b.countryCode !== place.countryCode) return -1;
      if (a.countryCode !== place.countryCode && b.countryCode === place.countryCode) return 1;
      return 0;
    });
  }, [place.countryCode]);

  const handleLocationChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const loc = e.target.value;
    setFilter(prev => ({
      ...prev,
      pickupLocation: loc,
      dropoffLocation: prev.dropoffLocation || loc
    }));
  };

  return (
    <div className="relative bg-neutral-900 text-white pt-10 pb-16 px-4 sm:px-6 lg:px-8 overflow-hidden rounded-2xl mb-8 shadow-xl">
      {/* Decorative gradient overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(40,40,45,0.8),rgba(15,15,18,1))] pointer-events-none" />
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-6xl mx-auto">
        
        {/* Course / Project Header */}
        <div className="text-center max-w-3xl mx-auto mb-8">
          
          <div className="flex flex-wrap items-center justify-center gap-2 mb-3">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-neutral-800 border border-neutral-700 text-xs font-medium text-neutral-300">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Web Technologies Academic Project • Vehicle Fleet & Reservation Engine</span>
            </div>

            {/* Region / Place Badge with Switcher */}
            <button
              type="button"
              id="btn-hero-place-switcher"
              onClick={() => setIsPlaceModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 text-xs font-semibold text-emerald-400 transition cursor-pointer"
              title="Click to change your location & currency"
            >
              <span>{place.flag}</span>
              <span>{place.countryName} ({place.currencyDisplay})</span>
              <ChevronDown className="w-3 h-3 text-neutral-400" />
            </button>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white mb-3">
            Rent Smart. Drive Free.
          </h1>
          <p className="text-sm sm:text-base text-neutral-400 max-w-2xl mx-auto">
            Book certified cars, SUVs, electric vehicles, and motorcycles localized in <strong>{place.currencyDisplay} ({place.currencyName})</strong> with instant digital vouchers, zero hidden fees, and seamless hub pickup.
          </p>
        </div>

        {/* Quick Category Selector Pills */}
        <div className="flex items-center justify-center gap-2 mb-6 overflow-x-auto pb-2 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              id={`hero-category-${cat.toLowerCase()}`}
              type="button"
              onClick={() => setFilter(prev => ({ ...prev, category: cat }))}
              className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all whitespace-nowrap ${
                filter.category === cat
                  ? 'bg-white text-neutral-950 shadow font-semibold scale-105'
                  : 'bg-neutral-800/80 hover:bg-neutral-700 text-neutral-300 border border-neutral-700/60'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Interactive Booking Search Card */}
        <div className="bg-white text-neutral-900 rounded-xl p-4 sm:p-5 shadow-2xl border border-neutral-200">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            
            {/* Pickup Location */}
            <div>
              <label htmlFor="search-pickup-location" className="block text-xs font-semibold text-neutral-600 mb-1.5 uppercase tracking-wider">
                <span className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-neutral-900" /> Pickup Hub ({place.countryName})
                </span>
              </label>
              <select
                id="search-pickup-location"
                value={filter.pickupLocation}
                onChange={handleLocationChange}
                className="w-full bg-neutral-50 border border-neutral-300 rounded-lg px-3 py-2 text-sm text-neutral-900 font-medium focus:ring-2 focus:ring-neutral-900 focus:border-transparent outline-none transition"
              >
                <option value="">All Available City Hubs</option>
                {sortedLocations.map((loc) => (
                  <option key={loc.id} value={loc.id}>
                    {loc.countryCode === place.countryCode ? '★ ' : ''}{loc.name} - {loc.city} {loc.isAirport ? '✈️' : ''}
                  </option>
                ))}
              </select>
            </div>

            {/* Pickup Date */}
            <div>
              <label htmlFor="search-pickup-date" className="block text-xs font-semibold text-neutral-600 mb-1.5 uppercase tracking-wider">
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-neutral-900" /> Pickup Date
                </span>
              </label>
              <input
                type="date"
                id="search-pickup-date"
                value={filter.pickupDate}
                onChange={(e) => setFilter(prev => ({ ...prev, pickupDate: e.target.value }))}
                className="w-full bg-neutral-50 border border-neutral-300 rounded-lg px-3 py-2 text-sm text-neutral-900 font-medium focus:ring-2 focus:ring-neutral-900 focus:border-transparent outline-none transition"
              />
            </div>

            {/* Return Date */}
            <div>
              <label htmlFor="search-return-date" className="block text-xs font-semibold text-neutral-600 mb-1.5 uppercase tracking-wider">
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-neutral-900" /> Return Date
                </span>
              </label>
              <input
                type="date"
                id="search-return-date"
                value={filter.returnDate}
                min={filter.pickupDate}
                onChange={(e) => setFilter(prev => ({ ...prev, returnDate: e.target.value }))}
                className="w-full bg-neutral-50 border border-neutral-300 rounded-lg px-3 py-2 text-sm text-neutral-900 font-medium focus:ring-2 focus:ring-neutral-900 focus:border-transparent outline-none transition"
              />
            </div>

            {/* Search Submit CTA */}
            <div className="flex items-end">
              <button
                id="btn-search-fleet"
                type="button"
                onClick={onSearchClick}
                className="w-full bg-neutral-900 hover:bg-neutral-800 text-white font-semibold py-2.5 px-4 rounded-lg flex items-center justify-center gap-2 text-sm transition-all shadow hover:shadow-md cursor-pointer"
              >
                <Search className="w-4 h-4" />
                <span>Search Fleet</span>
              </button>
            </div>

          </div>

          {/* Quick value props footer */}
          <div className="mt-4 pt-3 border-t border-neutral-100 flex flex-wrap items-center justify-between gap-3 text-xs text-neutral-500">
            <div className="flex items-center gap-4 flex-wrap">
              <span className="flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Zero Hidden Fees</span>
              </span>
              <span className="flex items-center gap-1">
                <Shield className="w-3.5 h-3.5 text-emerald-600" />
                <span>Comprehensive Insurance</span>
              </span>
              <span className="flex items-center gap-1">
                <Globe2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Currency: <strong className="text-neutral-900">{place.currencyDisplay}</strong></span>
              </span>
            </div>

            <span className="text-[11px] text-neutral-400">
              Free Cancellation up to 24 hours before pickup
            </span>
          </div>
        </div>

      </div>
    </div>
  );
};
