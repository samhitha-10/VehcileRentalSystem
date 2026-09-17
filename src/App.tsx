import React, { useState, useEffect, useMemo } from 'react';
import { Navbar } from './components/Navbar';
import { HeroSearch } from './components/HeroSearch';
import { FilterBar } from './components/FilterBar';
import { VehicleCard } from './components/VehicleCard';
import { VehicleDetailsModal } from './components/VehicleDetailsModal';
import { BookingModal } from './components/BookingModal';
import { MyBookingsView } from './components/MyBookingsView';
import { AdminFleetView } from './components/AdminFleetView';
import { ReceiptModal } from './components/ReceiptModal';
import { ProjectDocsModal } from './components/ProjectDocsModal';
import { LoginModal } from './components/LoginModal';
import { PlaceCurrencyModal } from './components/PlaceCurrencyModal';
import { LiveTrackerView } from './components/LiveTrackerView';
import { RentalAgreementModal } from './components/RentalAgreementModal';
import { INITIAL_VEHICLES, INITIAL_BOOKINGS } from './data/mockVehicles';
import { Vehicle, Booking, FilterState, VehicleStatus } from './types';
import { LOCATIONS } from './data/locations';
import { UserProvider, useUser } from './context/UserContext';
import { Sparkles, Car, HelpCircle, Shield, CheckCircle2, Navigation, FileCheck } from 'lucide-react';

const STORAGE_KEYS = {
  VEHICLES: 'autorent_fleet_v1',
  BOOKINGS: 'autorent_bookings_v1'
};

function AppContent() {
  const { isAuthModalOpen, setIsAuthModalOpen, isPlaceModalOpen, setIsPlaceModalOpen } = useUser();

  // Navigation View
  const [currentView, setCurrentView] = useState<'catalog' | 'bookings' | 'admin' | 'tracker' | 'docs'>('catalog');
  const [trackerVehicleId, setTrackerVehicleId] = useState<string | null>(null);
  const [trackerBookingId, setTrackerBookingId] = useState<string | null>(null);

  // Persistence: Fleet & Bookings
  const [vehicles, setVehicles] = useState<Vehicle[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.VEHICLES);
      return saved ? JSON.parse(saved) : INITIAL_VEHICLES;
    } catch {
      return INITIAL_VEHICLES;
    }
  });

  const [bookings, setBookings] = useState<Booking[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.BOOKINGS);
      return saved ? JSON.parse(saved) : INITIAL_BOOKINGS;
    } catch {
      return INITIAL_BOOKINGS;
    }
  });

  // Sync with LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.VEHICLES, JSON.stringify(vehicles));
    } catch (e) {
      console.error('Failed to persist vehicles', e);
    }
  }, [vehicles]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(bookings));
    } catch (e) {
      console.error('Failed to persist bookings', e);
    }
  }, [bookings]);

  // Default dates: Today and +3 days
  const today = new Date().toISOString().split('T')[0];
  const plusThreeDays = () => {
    const d = new Date();
    d.setDate(d.getDate() + 3);
    return d.toISOString().split('T')[0];
  };

  // Filter State
  const initialFilterState: FilterState = {
    searchTerm: '',
    category: 'All',
    fuelType: 'All',
    transmission: 'All',
    maxPrice: 200,
    minSeats: 1,
    pickupLocation: '',
    dropoffLocation: '',
    pickupDate: today,
    returnDate: plusThreeDays(),
    sortBy: 'recommended'
  };

  const [filter, setFilter] = useState<FilterState>(initialFilterState);

  // Active Modals
  const [selectedVehicleForDetails, setSelectedVehicleForDetails] = useState<Vehicle | null>(null);
  const [selectedVehicleForBooking, setSelectedVehicleForBooking] = useState<Vehicle | null>(null);
  const [receiptModalBooking, setReceiptModalBooking] = useState<Booking | null>(null);
  const [agreementModalData, setAgreementModalData] = useState<{ booking?: Booking | null; vehicle?: Vehicle | null } | null>(null);

  // Filter and Sort Vehicles
  const filteredVehicles = useMemo(() => {
    return vehicles
      .filter((vehicle) => {
        // Search term
        if (filter.searchTerm.trim()) {
          const term = filter.searchTerm.toLowerCase();
          const matchName = vehicle.name.toLowerCase().includes(term);
          const matchBrand = vehicle.brand.toLowerCase().includes(term);
          const matchReg = vehicle.registrationNumber.toLowerCase().includes(term);
          if (!matchName && !matchBrand && !matchReg) return false;
        }

        // Category
        if (filter.category !== 'All' && vehicle.category !== filter.category) {
          return false;
        }

        // Fuel
        if (filter.fuelType !== 'All' && vehicle.fuelType !== filter.fuelType) {
          return false;
        }

        // Transmission
        if (filter.transmission !== 'All' && vehicle.transmission !== filter.transmission) {
          return false;
        }

        // Max price
        if (vehicle.pricePerDay > filter.maxPrice) {
          return false;
        }

        // Minimum Seats
        if (vehicle.seats < filter.minSeats) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (filter.sortBy === 'price-low') {
          return a.pricePerDay - b.pricePerDay;
        }
        if (filter.sortBy === 'price-high') {
          return b.pricePerDay - a.pricePerDay;
        }
        if (filter.sortBy === 'rating') {
          return b.rating - a.rating;
        }
        // 'recommended' default
        return b.reviewCount - a.reviewCount;
      });
  }, [vehicles, filter]);

  // Booking handlers
  const handleBookingSuccess = (newBooking: Booking) => {
    setBookings((prev) => [newBooking, ...prev]);

    // Update vehicle status in state
    setVehicles((prev) =>
      prev.map((v) => (v.id === newBooking.vehicleId ? { ...v, status: 'Rented' as VehicleStatus } : v))
    );
  };

  const handleCancelBooking = (bookingId: string) => {
    const bookingToCancel = bookings.find((b) => b.id === bookingId);
    if (!bookingToCancel) return;

    setBookings((prev) =>
      prev.map((b) => (b.id === bookingId ? { ...b, status: 'Cancelled' as Booking['status'] } : b))
    );

    // Free up vehicle
    setVehicles((prev) =>
      prev.map((v) => (v.id === bookingToCancel.vehicleId ? { ...v, status: 'Available' as VehicleStatus } : v))
    );
  };

  const handleExtendBooking = (bookingId: string, extraDays: number) => {
    setBookings((prev) =>
      prev.map((b) => {
        if (b.id !== bookingId) return b;
        const currentEnd = new Date(b.returnDate);
        currentEnd.setDate(currentEnd.getDate() + extraDays);
        const newReturnDate = currentEnd.toISOString().split('T')[0];
        const newTotalDays = b.rentalDays + extraDays;
        const dailyAdd = b.pricePerDay;
        return {
          ...b,
          returnDate: newReturnDate,
          rentalDays: newTotalDays,
          totalAmount: b.totalAmount + (dailyAdd * extraDays)
        };
      })
    );
  };

  // Admin Fleet Handlers
  const handleAddVehicle = (newVehicle: Vehicle) => {
    setVehicles((prev) => [newVehicle, ...prev]);
  };

  const handleUpdateVehicleStatus = (vehicleId: string, status: VehicleStatus) => {
    setVehicles((prev) => prev.map((v) => (v.id === vehicleId ? { ...v, status } : v)));
  };

  const handleUpdateVehiclePrice = (vehicleId: string, newPrice: number) => {
    setVehicles((prev) => prev.map((v) => (v.id === vehicleId ? { ...v, pricePerDay: newPrice } : v)));
  };

  const handleDeleteVehicle = (vehicleId: string) => {
    setVehicles((prev) => prev.filter((v) => v.id !== vehicleId));
  };

  const handleUpdateBookingStatus = (bookingId: string, newStatus: Booking['status']) => {
    setBookings((prev) => prev.map((b) => (b.id === bookingId ? { ...b, status: newStatus } : b)));
  };

  const handleResetFleetData = () => {
    if (window.confirm('Reset fleet and booking database to default initial state?')) {
      setVehicles(INITIAL_VEHICLES);
      setBookings(INITIAL_BOOKINGS);
      localStorage.removeItem(STORAGE_KEYS.VEHICLES);
      localStorage.removeItem(STORAGE_KEYS.BOOKINGS);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-100 text-neutral-900 flex flex-col font-sans selection:bg-neutral-900 selection:text-white">
      
      {/* Navigation Header */}
      <Navbar
        currentView={currentView}
        setCurrentView={setCurrentView}
        bookingCount={bookings.filter((b) => b.status === 'Confirmed' || b.status === 'Active').length}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        
        {/* VIEW 1: FLEET CATALOG */}
        {currentView === 'catalog' && (
          <div>
            {/* Hero search banner */}
            <HeroSearch
              filter={filter}
              setFilter={setFilter}
              onSearchClick={() => {
                const el = document.getElementById('fleet-catalog-grid');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
            />

            {/* Filter and Sorting Toolbar */}
            <div id="fleet-catalog-grid">
              <FilterBar
                filter={filter}
                setFilter={setFilter}
                totalFound={filteredVehicles.length}
                onReset={() => setFilter(initialFilterState)}
              />
            </div>

            {/* Vehicle Catalog Grid */}
            {filteredVehicles.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-2xl border border-neutral-200 p-6 shadow-xs">
                <div className="w-12 h-12 rounded-full bg-neutral-100 flex items-center justify-center mx-auto text-neutral-400 mb-3">
                  <Car className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-neutral-900">No Vehicles Match Your Search</h3>
                <p className="text-xs text-neutral-500 max-w-sm mx-auto mt-1 mb-4">
                  Try clearing some filter criteria, broadening your price range, or selecting "All Powertrains".
                </p>
                <button
                  type="button"
                  onClick={() => setFilter(initialFilterState)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-neutral-900 hover:bg-neutral-800 transition"
                >
                  Reset All Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                {filteredVehicles.map((vehicle) => (
                  <VehicleCard
                    key={vehicle.id}
                    vehicle={vehicle}
                    onViewDetails={(v) => setSelectedVehicleForDetails(v)}
                    onBookNow={(v) => setSelectedVehicleForBooking(v)}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* VIEW 2: MY BOOKINGS */}
        {currentView === 'bookings' && (
          <MyBookingsView
            bookings={bookings}
            onViewReceipt={(b) => setReceiptModalBooking(b)}
            onCancelBooking={handleCancelBooking}
            onExtendBooking={handleExtendBooking}
            onBrowseFleet={() => setCurrentView('catalog')}
            onTrackBooking={(b) => {
              setTrackerBookingId(b.id);
              setTrackerVehicleId(b.vehicleId);
              setCurrentView('tracker');
            }}
            onViewAgreement={(b) => setAgreementModalData({ booking: b })}
          />
        )}

        {/* VIEW 3: FLEET ADMIN PORTAL */}
        {currentView === 'admin' && (
          <AdminFleetView
            vehicles={vehicles}
            bookings={bookings}
            onAddVehicle={handleAddVehicle}
            onUpdateVehicleStatus={handleUpdateVehicleStatus}
            onUpdateVehiclePrice={handleUpdateVehiclePrice}
            onDeleteVehicle={handleDeleteVehicle}
            onUpdateBookingStatus={handleUpdateBookingStatus}
            onResetFleetData={handleResetFleetData}
            onTrackVehicle={(v) => {
              setTrackerVehicleId(v.id);
              setCurrentView('tracker');
            }}
          />
        )}

        {/* VIEW 4: LIVE GPS TRACKER & ANTI-THEFT TELEMETRY */}
        {currentView === 'tracker' && (
          <LiveTrackerView
            vehicles={vehicles}
            bookings={bookings}
            initialVehicleId={trackerVehicleId || undefined}
            initialBookingId={trackerBookingId || undefined}
          />
        )}

        {/* VIEW 5: WEB TECHNOLOGIES PROJECT DOCS */}
        {currentView === 'docs' && (
          <ProjectDocsModal onClose={() => setCurrentView('catalog')} />
        )}

      </main>

      {/* MODAL: Vehicle Details & Mechanical Specs */}
      {selectedVehicleForDetails && (
        <VehicleDetailsModal
          vehicle={selectedVehicleForDetails}
          onClose={() => setSelectedVehicleForDetails(null)}
          onBookNow={(v) => {
            setSelectedVehicleForDetails(null);
            setSelectedVehicleForBooking(v);
          }}
        />
      )}

      {/* MODAL: Interactive Booking & Reservation Workflow */}
      {selectedVehicleForBooking && (
        <BookingModal
          vehicle={selectedVehicleForBooking}
          defaultPickupDate={filter.pickupDate}
          defaultReturnDate={filter.returnDate}
          defaultLocation={filter.pickupLocation}
          onClose={() => setSelectedVehicleForBooking(null)}
          onBookingSuccess={handleBookingSuccess}
          onViewReceipt={(booking) => {
            setSelectedVehicleForBooking(null);
            setReceiptModalBooking(booking);
          }}
          onViewAgreement={(b, v) => setAgreementModalData({ booking: b, vehicle: v || selectedVehicleForBooking })}
        />
      )}

      {/* MODAL: Printable Receipt / Rental Voucher */}
      {receiptModalBooking && (
        <ReceiptModal
          booking={receiptModalBooking}
          onClose={() => setReceiptModalBooking(null)}
          onViewAgreement={(b) => setAgreementModalData({ booking: b })}
        />
      )}

      {/* MODAL: Legally Binding Rental Agreement (Contract between User & Owner) */}
      {agreementModalData && (
        <RentalAgreementModal
          booking={agreementModalData.booking}
          vehicle={agreementModalData.vehicle}
          onClose={() => setAgreementModalData(null)}
        />
      )}

      {/* MODAL: User Authentication & Place Selector */}
      {isAuthModalOpen && (
        <LoginModal onClose={() => setIsAuthModalOpen(false)} />
      )}

      {/* MODAL: Fast Place & Currency Selector */}
      {isPlaceModalOpen && (
        <PlaceCurrencyModal onClose={() => setIsPlaceModalOpen(false)} />
      )}

      {/* Footer */}
      <footer className="bg-white border-t border-neutral-200 mt-12 py-8 print:hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-500">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-md bg-neutral-900 text-white flex items-center justify-center font-bold text-xs">
                AF
              </div>
              <span className="font-semibold text-neutral-800">AutoFleet Vehicle Rental System</span>
              <span>• Web Technologies Laboratory Project</span>
            </div>

            <div className="flex items-center gap-4 text-[11px] flex-wrap justify-center sm:justify-end">
              <button
                type="button"
                onClick={() => setAgreementModalData({})}
                className="hover:text-indigo-700 font-semibold text-indigo-900 transition flex items-center gap-1"
                title="View standard Master Rental Agreement between Renter and Fleet Owner"
              >
                <FileCheck className="w-3.5 h-3.5 text-indigo-600" />
                <span>Owner & User Agreement</span>
              </button>
              <button
                type="button"
                onClick={() => setCurrentView('tracker')}
                className="hover:text-emerald-700 font-semibold text-emerald-800 transition flex items-center gap-1"
              >
                <Navigation className="w-3 h-3" />
                Live GPS Tracker
              </button>
              <button
                type="button"
                onClick={() => setCurrentView('docs')}
                className="hover:text-neutral-900 font-medium underline transition"
              >
                Project Tech Specs
              </button>
              <button
                type="button"
                onClick={() => setCurrentView('admin')}
                className="hover:text-neutral-900 font-medium transition"
              >
                Admin Dispatch
              </button>
              <span>Built with React 19, TypeScript & Tailwind CSS</span>
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
}

export default function App() {
  return (
    <UserProvider>
      <AppContent />
    </UserProvider>
  );
}
