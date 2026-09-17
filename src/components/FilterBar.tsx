import React from 'react';
import { Search, SlidersHorizontal, RotateCcw } from 'lucide-react';
import { FilterState, VehicleCategory, FuelType, TransmissionType } from '../types';
import { useUser } from '../context/UserContext';

interface FilterBarProps {
  filter: FilterState;
  setFilter: React.Dispatch<React.SetStateAction<FilterState>>;
  totalFound: number;
  onReset: () => void;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  filter,
  setFilter,
  totalFound,
  onReset
}) => {
  const { formatPrice, place } = useUser();
  const [showAdvanced, setShowAdvanced] = React.useState(false);

  const categories: VehicleCategory[] = ['All', 'Sedan', 'SUV', 'Electric', 'Luxury', 'Sports', 'Motorcycle', 'Scooter', 'Van'];
  const fuelTypes: ('All' | FuelType)[] = ['All', 'Petrol', 'Diesel', 'Electric', 'Hybrid'];
  const transmissions: ('All' | TransmissionType)[] = ['All', 'Automatic', 'Manual'];

  return (
    <div className="bg-white rounded-xl border border-neutral-200 p-4 mb-6 shadow-sm">
      
      {/* Top row: Search input + Category Pills + Advanced Toggle */}
      <div className="flex flex-col lg:flex-row gap-3 items-stretch lg:items-center justify-between">
        
        {/* Search by text */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            id="filter-search-input"
            type="text"
            placeholder="Search by brand, model (e.g. Tesla, BMW, RAV4)..."
            value={filter.searchTerm}
            onChange={(e) => setFilter(prev => ({ ...prev, searchTerm: e.target.value }))}
            className="w-full pl-9 pr-3 py-2 text-sm bg-neutral-50 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:bg-white transition"
          />
        </div>

        {/* Sort & Advanced Filters toggles */}
        <div className="flex items-center gap-2 flex-wrap">
          
          {/* Sort selector */}
          <div className="flex items-center gap-1.5 text-xs text-neutral-600 font-medium">
            <span>Sort:</span>
            <select
              id="filter-sort-select"
              value={filter.sortBy}
              onChange={(e) => setFilter(prev => ({ ...prev, sortBy: e.target.value as FilterState['sortBy'] }))}
              className="bg-neutral-50 border border-neutral-200 rounded-lg px-2.5 py-1.5 text-xs text-neutral-900 font-medium focus:ring-1 focus:ring-neutral-900 outline-none"
            >
              <option value="recommended">Featured / Popular</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Top Rated</option>
            </select>
          </div>

          <button
            id="btn-toggle-advanced-filters"
            type="button"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition ${
              showAdvanced
                ? 'bg-neutral-900 text-white border-neutral-900'
                : 'bg-neutral-50 hover:bg-neutral-100 text-neutral-700 border-neutral-200'
            }`}
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>{showAdvanced ? 'Hide Filters' : 'Filters'}</span>
          </button>

          <button
            id="btn-reset-filters"
            type="button"
            onClick={onReset}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100 transition"
            title="Reset all filters"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Reset</span>
          </button>
        </div>

      </div>

      {/* Category horizontal pills */}
      <div className="mt-3 pt-3 border-t border-neutral-100 flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        <span className="text-xs text-neutral-500 font-medium mr-1 shrink-0">Category:</span>
        {categories.map((cat) => (
          <button
            key={cat}
            id={`filter-pill-${cat.toLowerCase()}`}
            type="button"
            onClick={() => setFilter(prev => ({ ...prev, category: cat }))}
            className={`px-3 py-1 rounded-md text-xs font-medium shrink-0 transition ${
              filter.category === cat
                ? 'bg-neutral-900 text-white font-semibold'
                : 'bg-neutral-100 hover:bg-neutral-200 text-neutral-700'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Collapsible Advanced Filters Drawer */}
      {showAdvanced && (
        <div className="mt-4 pt-4 border-t border-neutral-200 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 animate-in fade-in duration-200">
          
          {/* Fuel Type */}
          <div>
            <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
              Fuel / Powertrain
            </label>
            <select
              id="filter-fuel-select"
              value={filter.fuelType}
              onChange={(e) => setFilter(prev => ({ ...prev, fuelType: e.target.value as FilterState['fuelType'] }))}
              className="w-full bg-neutral-50 border border-neutral-200 rounded-lg px-2.5 py-1.5 text-xs text-neutral-900"
            >
              {fuelTypes.map((f) => (
                <option key={f} value={f}>{f === 'All' ? 'All Powertrains' : f}</option>
              ))}
            </select>
          </div>

          {/* Transmission */}
          <div>
            <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
              Transmission
            </label>
            <select
              id="filter-transmission-select"
              value={filter.transmission}
              onChange={(e) => setFilter(prev => ({ ...prev, transmission: e.target.value as FilterState['transmission'] }))}
              className="w-full bg-neutral-50 border border-neutral-200 rounded-lg px-2.5 py-1.5 text-xs text-neutral-900"
            >
              {transmissions.map((t) => (
                <option key={t} value={t}>{t === 'All' ? 'All Transmissions' : t}</option>
              ))}
            </select>
          </div>

          {/* Minimum Seats */}
          <div>
            <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
              Min Seats ({filter.minSeats}+ seats)
            </label>
            <input
              id="filter-seats-range"
              type="range"
              min="1"
              max="8"
              step="1"
              value={filter.minSeats}
              onChange={(e) => setFilter(prev => ({ ...prev, minSeats: Number(e.target.value) }))}
              className="w-full accent-neutral-900 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-neutral-400">
              <span>1 Seat</span>
              <span>4 Seats</span>
              <span>8+ Seats</span>
            </div>
          </div>

          {/* Max Price Per Day */}
          <div>
            <label className="block text-xs font-semibold text-neutral-700 mb-1.5 flex justify-between">
              <span>Max Daily Rate:</span>
              <strong className="text-neutral-900">{formatPrice(filter.maxPrice)}/day</strong>
            </label>
            <input
              id="filter-price-range"
              type="range"
              min="20"
              max="200"
              step="5"
              value={filter.maxPrice}
              onChange={(e) => setFilter(prev => ({ ...prev, maxPrice: Number(e.target.value) }))}
              className="w-full accent-neutral-900 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-neutral-400">
              <span>{formatPrice(20)}</span>
              <span>{formatPrice(100)}</span>
              <span>{formatPrice(200)}</span>
            </div>
          </div>

        </div>
      )}

      {/* Result stats */}
      <div className="mt-3 flex items-center justify-between text-xs text-neutral-500">
        <span>Showing <strong className="text-neutral-900">{totalFound}</strong> vehicles ready to book</span>
        {(filter.category !== 'All' || filter.searchTerm || filter.fuelType !== 'All' || filter.transmission !== 'All' || filter.minSeats > 1 || filter.maxPrice < 200) && (
          <span className="text-neutral-600 bg-neutral-100 px-2 py-0.5 rounded text-[11px]">
            Filters active
          </span>
        )}
      </div>

    </div>
  );
};
