import React, { useState } from 'react';
import { 
  Car, Wrench, DollarSign, CheckCircle2, AlertCircle, Plus, 
  Trash2, Edit3, RotateCcw, Search, Shield, RefreshCw, Navigation
} from 'lucide-react';
import { Vehicle, Booking, VehicleStatus, VehicleCategory, FuelType, TransmissionType } from '../types';
import { formatCurrency, formatConverted } from '../utils/pricing';
import { LOCATIONS } from '../data/locations';
import { useUser } from '../context/UserContext';

interface AdminFleetViewProps {
  vehicles: Vehicle[];
  bookings: Booking[];
  onAddVehicle: (newVehicle: Vehicle) => void;
  onUpdateVehicleStatus: (vehicleId: string, status: VehicleStatus) => void;
  onUpdateVehiclePrice: (vehicleId: string, newPrice: number) => void;
  onDeleteVehicle: (vehicleId: string) => void;
  onUpdateBookingStatus: (bookingId: string, newStatus: Booking['status']) => void;
  onResetFleetData: () => void;
  onTrackVehicle?: (vehicle: Vehicle) => void;
}

export const AdminFleetView: React.FC<AdminFleetViewProps> = ({
  vehicles,
  bookings,
  onAddVehicle,
  onUpdateVehicleStatus,
  onUpdateVehiclePrice,
  onDeleteVehicle,
  onUpdateBookingStatus,
  onResetFleetData,
  onTrackVehicle
}) => {
  const { place, formatPrice } = useUser();
  const [activeTab, setActiveTab] = useState<'inventory' | 'reservations'>('inventory');
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  // New vehicle form state
  const [newBrand, setNewBrand] = useState('');
  const [newName, setNewName] = useState('');
  const [newYear, setNewYear] = useState(2024);
  const [newCategory, setNewCategory] = useState<VehicleCategory>('Sedan');
  const [newPrice, setNewPrice] = useState(65);
  const [newSeats, setNewSeats] = useState(5);
  const [newFuel, setNewFuel] = useState<FuelType>('Petrol');
  const [newTransmission, setNewTransmission] = useState<TransmissionType>('Automatic');
  const [newImageUrl, setNewImageUrl] = useState('https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1000&q=80');
  const [newPlate, setNewPlate] = useState('WT-2026-FL');
  const [newFeatures, setNewFeatures] = useState('Air Conditioning, Bluetooth, Backup Camera');

  // Stats
  const totalVehicles = vehicles.length;
  const availableCount = vehicles.filter(v => v.status === 'Available').length;
  const rentedCount = vehicles.filter(v => v.status === 'Rented').length;
  const maintenanceCount = vehicles.filter(v => v.status === 'Maintenance').length;
  const totalRevenue = bookings
    .filter(b => b.status !== 'Cancelled')
    .reduce((acc, b) => acc + b.totalAmount, 0);

  const filteredVehicles = vehicles.filter(v => 
    v.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    v.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
    v.registrationNumber.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBrand || !newName) return;

    const featureList = newFeatures.split(',').map(f => f.trim()).filter(Boolean);

    const vehicleObj: Vehicle = {
      id: 'veh-' + Date.now(),
      brand: newBrand,
      name: newName,
      modelYear: Number(newYear),
      category: newCategory,
      pricePerDay: Number(newPrice),
      seats: Number(newSeats),
      doors: 4,
      luggageCount: 3,
      fuelType: newFuel,
      transmission: newTransmission,
      rating: 5.0,
      reviewCount: 1,
      imageUrl: newImageUrl || 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1000&q=80',
      features: featureList.length > 0 ? featureList : ['GPS Nav', 'Bluetooth', 'Air Conditioning'],
      status: 'Available',
      location: LOCATIONS[0].id,
      mileageLimit: 'Unlimited',
      registrationNumber: newPlate || `FL-${Math.floor(100 + Math.random() * 900)}-WT`,
      topSpeedKmH: 200,
      fuelEfficiency: '16 km/l',
      description: `Modern and well-maintained ${newBrand} ${newName} with high performance and premium comfort.`
    };

    onAddVehicle(vehicleObj);
    setShowAddModal(false);
    // Reset form
    setNewBrand('');
    setNewName('');
    setNewPrice(65);
  };

  return (
    <div className="max-w-7xl mx-auto py-4">
      
      {/* Admin Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-neutral-900 text-white text-[11px] font-semibold mb-1">
            <Shield className="w-3 h-3 text-emerald-400" />
            <span>Web Technologies Admin Portal</span>
          </div>
          <h1 className="text-2xl font-extrabold text-neutral-900 tracking-tight">
            Fleet Operations & Dispatch
          </h1>
          <p className="text-xs text-neutral-500">
            CRUD operations, real-time fleet statuses, reservation management and revenue ledger.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          <button
            id="btn-admin-add-vehicle"
            type="button"
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 text-xs font-bold rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white flex items-center gap-1.5 shadow-sm transition"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Vehicle</span>
          </button>

          <button
            id="btn-admin-reset-data"
            type="button"
            onClick={onResetFleetData}
            className="px-3 py-2 text-xs font-semibold rounded-xl bg-neutral-100 hover:bg-neutral-200 text-neutral-700 flex items-center gap-1.5 transition"
            title="Reset fleet to default initial state"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Reset Defaults</span>
          </button>
        </div>
      </div>

      {/* KPI Metrics Dashboard */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 mb-6">
        <div className="p-4 rounded-xl bg-white border border-neutral-200 shadow-xs">
          <span className="text-[11px] font-bold text-neutral-500 uppercase tracking-wider block mb-1">Total Fleet</span>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-black text-neutral-900">{totalVehicles}</span>
            <Car className="w-4 h-4 text-neutral-400" />
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white border border-neutral-200 shadow-xs">
          <span className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider block mb-1">Ready / Available</span>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-black text-emerald-700">{availableCount}</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white border border-neutral-200 shadow-xs">
          <span className="text-[11px] font-bold text-sky-700 uppercase tracking-wider block mb-1">Active Rentals</span>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-black text-sky-700">{rentedCount}</span>
            <span className="text-xs text-sky-600 font-bold">{Math.round((rentedCount / (totalVehicles || 1)) * 100)}% util.</span>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white border border-neutral-200 shadow-xs">
          <span className="text-[11px] font-bold text-amber-700 uppercase tracking-wider block mb-1">Maintenance</span>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-black text-amber-700">{maintenanceCount}</span>
            <Wrench className="w-4 h-4 text-amber-500" />
          </div>
        </div>

        <div className="p-4 rounded-xl bg-neutral-900 text-white border border-neutral-800 shadow-xs col-span-2 lg:col-span-1">
          <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider block mb-1">Fleet Revenue</span>
          <div className="flex items-baseline justify-between">
            <span className="text-xl font-black text-emerald-400">
              {formatConverted(totalRevenue, place.currencyCode, place.currencySymbol)}
            </span>
            <span className="text-xs font-bold text-neutral-400">{place.currencySymbol}</span>
          </div>
        </div>
      </div>

      {/* View Switcher: Fleet Inventory vs Reservations */}
      <div className="flex items-center gap-2 mb-4 border-b border-neutral-200 pb-2">
        <button
          id="tab-admin-inventory"
          type="button"
          onClick={() => setActiveTab('inventory')}
          className={`px-4 py-2 text-xs font-bold rounded-lg transition ${
            activeTab === 'inventory' 
              ? 'bg-neutral-900 text-white shadow-xs' 
              : 'text-neutral-600 hover:bg-neutral-100'
          }`}
        >
          Vehicle Fleet Table ({vehicles.length})
        </button>

        <button
          id="tab-admin-reservations"
          type="button"
          onClick={() => setActiveTab('reservations')}
          className={`px-4 py-2 text-xs font-bold rounded-lg transition ${
            activeTab === 'reservations' 
              ? 'bg-neutral-900 text-white shadow-xs' 
              : 'text-neutral-600 hover:bg-neutral-100'
          }`}
        >
          All System Bookings ({bookings.length})
        </button>
      </div>

      {/* TAB 1: FLEET INVENTORY */}
      {activeTab === 'inventory' && (
        <div className="bg-white rounded-2xl border border-neutral-200 shadow-xs overflow-hidden">
          
          {/* Table Search bar */}
          <div className="p-4 border-b border-neutral-200 flex items-center justify-between gap-3">
            <div className="relative flex-1 max-w-sm">
              <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search fleet by make, model, plate..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 text-xs bg-neutral-50 border border-neutral-200 rounded-lg outline-none focus:bg-white focus:ring-1 focus:ring-neutral-900"
              />
            </div>
            <span className="text-xs text-neutral-500">
              Showing {filteredVehicles.length} of {vehicles.length} vehicles
            </span>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-neutral-50 text-neutral-600 font-bold border-b border-neutral-200 uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="px-4 py-3">Vehicle</th>
                  <th className="px-4 py-3">Category</th>
                  <th className="px-4 py-3">Powertrain</th>
                  <th className="px-4 py-3">Plate No</th>
                  <th className="px-4 py-3">Daily Rate</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 font-medium text-neutral-800">
                {filteredVehicles.map(vehicle => (
                  <tr key={vehicle.id} className="hover:bg-neutral-50/70 transition">
                    
                    {/* Vehicle */}
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={vehicle.imageUrl}
                          alt={vehicle.name}
                          referrerPolicy="no-referrer"
                          className="w-12 h-9 rounded-md object-cover border border-neutral-200 shrink-0"
                        />
                        <div>
                          <div className="font-bold text-neutral-900">{vehicle.brand} {vehicle.name}</div>
                          <div className="text-[11px] text-neutral-400">{vehicle.modelYear} • {vehicle.seats} Seats</div>
                        </div>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="px-4 py-3">
                      <span className="px-2 py-0.5 rounded bg-neutral-100 text-neutral-700 font-semibold text-[11px]">
                        {vehicle.category}
                      </span>
                    </td>

                    {/* Powertrain */}
                    <td className="px-4 py-3 text-neutral-600">
                      {vehicle.fuelType} • {vehicle.transmission}
                    </td>

                    {/* Plate */}
                    <td className="px-4 py-3 font-mono text-[11px] font-semibold text-neutral-600">
                      {vehicle.registrationNumber}
                    </td>

                    {/* Daily Rate with quick edit */}
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <span className="font-bold text-neutral-900">{formatPrice(vehicle.pricePerDay)}</span>
                        <span className="text-[10px] text-neutral-400">(${vehicle.pricePerDay})</span>
                        <button
                          type="button"
                          onClick={() => {
                            const p = prompt(`Enter new base USD daily rate for ${vehicle.name}:`, vehicle.pricePerDay.toString());
                            if (p && !isNaN(Number(p)) && Number(p) > 0) {
                              onUpdateVehiclePrice(vehicle.id, Number(p));
                            }
                          }}
                          className="text-neutral-400 hover:text-neutral-900 p-0.5"
                          title="Edit daily base price"
                        >
                          <Edit3 className="w-3 h-3" />
                        </button>
                      </div>
                    </td>

                    {/* Status Select */}
                    <td className="px-4 py-3">
                      <select
                        value={vehicle.status}
                        onChange={(e) => onUpdateVehicleStatus(vehicle.id, e.target.value as VehicleStatus)}
                        className={`text-xs font-semibold px-2 py-1 rounded-md border outline-none cursor-pointer ${
                          vehicle.status === 'Available'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : vehicle.status === 'Rented'
                            ? 'bg-sky-50 text-sky-700 border-sky-200'
                            : 'bg-amber-50 text-amber-800 border-amber-200'
                        }`}
                      >
                        <option value="Available">Available</option>
                        <option value="Rented">Rented</option>
                        <option value="Maintenance">Maintenance</option>
                      </select>
                    </td>

                    {/* Actions */}
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        {onTrackVehicle && (
                          <button
                            type="button"
                            onClick={() => onTrackVehicle(vehicle)}
                            className="p-1.5 text-emerald-600 hover:text-emerald-700 rounded-md hover:bg-emerald-50 transition"
                            title="Live GPS & Anti-Theft Tracker"
                          >
                            <Navigation className="w-3.5 h-3.5" />
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => {
                            if (confirm(`Remove ${vehicle.brand} ${vehicle.name} from fleet catalog?`)) {
                              onDeleteVehicle(vehicle.id);
                            }
                          }}
                          className="p-1.5 text-neutral-400 hover:text-red-600 rounded-md hover:bg-red-50 transition"
                          title="Delete vehicle"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        </div>
      )}

      {/* TAB 2: ALL RESERVATIONS */}
      {activeTab === 'reservations' && (
        <div className="bg-white rounded-2xl border border-neutral-200 shadow-xs overflow-hidden">
          <div className="p-4 border-b border-neutral-200">
            <h3 className="text-sm font-bold text-neutral-900">System Reservations & Customer Dispatches</h3>
            <p className="text-xs text-neutral-500">Live feed of all customer bookings recorded in the system.</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-neutral-50 text-neutral-600 font-bold border-b border-neutral-200 uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="px-4 py-3">Code</th>
                  <th className="px-4 py-3">Customer & Driver</th>
                  <th className="px-4 py-3">Vehicle</th>
                  <th className="px-4 py-3">Dates</th>
                  <th className="px-4 py-3">Total Paid</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Update Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 font-medium text-neutral-800">
                {bookings.map(booking => (
                  <tr key={booking.id} className="hover:bg-neutral-50/70 transition">
                    <td className="px-4 py-3 font-mono font-bold text-neutral-900">
                      {booking.bookingCode}
                    </td>

                    <td className="px-4 py-3">
                      <div className="font-bold text-neutral-900">{booking.customerName}</div>
                      <div className="text-[11px] text-neutral-500">{booking.customerEmail} • {booking.drivingLicenseNumber}</div>
                    </td>

                    <td className="px-4 py-3">
                      <div className="font-semibold text-neutral-900">{booking.vehicleBrand} {booking.vehicleName}</div>
                      <div className="text-[11px] text-neutral-400">Hub: {booking.pickupLocation}</div>
                    </td>

                    <td className="px-4 py-3 text-neutral-600">
                      <div>{booking.pickupDate} to {booking.returnDate}</div>
                      <div className="text-[10px] text-neutral-400 font-semibold">{booking.rentalDays} Days</div>
                    </td>

                    <td className="px-4 py-3 font-bold text-neutral-900">
                      {formatConverted(booking.totalAmount, booking.currencyCode || place.currencyCode, booking.currencySymbol || place.currencySymbol)}
                    </td>

                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded-full text-[11px] font-semibold ${
                        booking.status === 'Confirmed' ? 'bg-emerald-100 text-emerald-800' :
                        booking.status === 'Active' ? 'bg-sky-100 text-sky-800' :
                        booking.status === 'Completed' ? 'bg-neutral-100 text-neutral-700' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {booking.status}
                      </span>
                    </td>

                    <td className="px-4 py-3">
                      <select
                        value={booking.status}
                        onChange={(e) => onUpdateBookingStatus(booking.id, e.target.value as Booking['status'])}
                        className="text-xs bg-neutral-50 border border-neutral-300 rounded px-2 py-1 outline-none cursor-pointer"
                      >
                        <option value="Confirmed">Confirmed</option>
                        <option value="Active">Active (Handed Over)</option>
                        <option value="Completed">Completed (Returned)</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add New Vehicle Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-900/70 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-neutral-200 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-4 border-b border-neutral-200 mb-4">
              <h3 className="text-base font-bold text-neutral-900 flex items-center gap-2">
                <Plus className="w-5 h-5 text-neutral-900" />
                <span>Add New Vehicle to Fleet</span>
              </h3>
              <button 
                type="button"
                onClick={() => setShowAddModal(false)}
                className="text-neutral-400 hover:text-neutral-700"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-neutral-700 mb-1">Make / Brand *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Audi, Hyundai, Honda"
                    value={newBrand}
                    onChange={(e) => setNewBrand(e.target.value)}
                    className="w-full p-2 bg-neutral-50 border border-neutral-300 rounded-lg outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-neutral-700 mb-1">Model Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. A4 Quattro, Tucson"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    className="w-full p-2 bg-neutral-50 border border-neutral-300 rounded-lg outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-neutral-700 mb-1">Category</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as VehicleCategory)}
                    className="w-full p-2 bg-neutral-50 border border-neutral-300 rounded-lg outline-none"
                  >
                    <option value="Sedan">Sedan</option>
                    <option value="SUV">SUV</option>
                    <option value="Electric">Electric</option>
                    <option value="Luxury">Luxury</option>
                    <option value="Sports">Sports</option>
                    <option value="Motorcycle">Motorcycle</option>
                    <option value="Scooter">Scooter</option>
                    <option value="Van">Van</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-neutral-700 mb-1">Daily Price ($/day)</label>
                  <input
                    type="number"
                    min="10"
                    max="500"
                    value={newPrice}
                    onChange={(e) => setNewPrice(Number(e.target.value))}
                    className="w-full p-2 bg-neutral-50 border border-neutral-300 rounded-lg outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-neutral-700 mb-1">Seats</label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={newSeats}
                    onChange={(e) => setNewSeats(Number(e.target.value))}
                    className="w-full p-2 bg-neutral-50 border border-neutral-300 rounded-lg outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-neutral-700 mb-1">Powertrain / Fuel</label>
                  <select
                    value={newFuel}
                    onChange={(e) => setNewFuel(e.target.value as FuelType)}
                    className="w-full p-2 bg-neutral-50 border border-neutral-300 rounded-lg outline-none"
                  >
                    <option value="Petrol">Petrol</option>
                    <option value="Diesel">Diesel</option>
                    <option value="Electric">Electric</option>
                    <option value="Hybrid">Hybrid</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-neutral-700 mb-1">Transmission</label>
                  <select
                    value={newTransmission}
                    onChange={(e) => setNewTransmission(e.target.value as TransmissionType)}
                    className="w-full p-2 bg-neutral-50 border border-neutral-300 rounded-lg outline-none"
                  >
                    <option value="Automatic">Automatic</option>
                    <option value="Manual">Manual</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-neutral-700 mb-1">Registration Plate Number</label>
                <input
                  type="text"
                  placeholder="e.g. WT-882-NY"
                  value={newPlate}
                  onChange={(e) => setNewPlate(e.target.value)}
                  className="w-full p-2 bg-neutral-50 border border-neutral-300 rounded-lg outline-none font-mono"
                />
              </div>

              <div>
                <label className="block font-bold text-neutral-700 mb-1">Image URL</label>
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/..."
                  value={newImageUrl}
                  onChange={(e) => setNewImageUrl(e.target.value)}
                  className="w-full p-2 bg-neutral-50 border border-neutral-300 rounded-lg outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-neutral-700 mb-1">Key Features (comma-separated)</label>
                <input
                  type="text"
                  value={newFeatures}
                  onChange={(e) => setNewFeatures(e.target.value)}
                  className="w-full p-2 bg-neutral-50 border border-neutral-300 rounded-lg outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-neutral-200">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-lg text-neutral-600 hover:bg-neutral-100 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-white font-bold transition shadow-sm"
                >
                  Add to Fleet
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
