import React, { useState } from 'react';
import { 
  CalendarCheck, Clock, MapPin, Download, Ban, 
  PlusCircle, CheckCircle2, AlertTriangle, ArrowRight, ShieldCheck, Car, Navigation, FileCheck
} from 'lucide-react';
import { Booking } from '../types';
import { formatConverted } from '../utils/pricing';

interface MyBookingsViewProps {
  bookings: Booking[];
  onViewReceipt: (booking: Booking) => void;
  onCancelBooking: (bookingId: string) => void;
  onExtendBooking: (bookingId: string, extraDays: number) => void;
  onBrowseFleet: () => void;
  onTrackBooking?: (booking: Booking) => void;
  onViewAgreement?: (booking: Booking) => void;
}

export const MyBookingsView: React.FC<MyBookingsViewProps> = ({
  bookings,
  onViewReceipt,
  onCancelBooking,
  onExtendBooking,
  onBrowseFleet,
  onTrackBooking,
  onViewAgreement
}) => {
  const [activeTab, setActiveTab] = useState<'All' | 'Confirmed' | 'Active' | 'Completed' | 'Cancelled'>('All');
  const [extendingId, setExtendingId] = useState<string | null>(null);
  const [cancelPromptId, setCancelPromptId] = useState<string | null>(null);

  const filtered = bookings.filter(b => {
    if (activeTab === 'All') return true;
    return b.status === activeTab;
  });

  return (
    <div className="max-w-6xl mx-auto py-4">
      
      {/* Page Title & Status Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-extrabold text-neutral-900 tracking-tight flex items-center gap-2">
            <CalendarCheck className="w-6 h-6 text-neutral-900" />
            <span>My Vehicle Rentals</span>
          </h1>
          <p className="text-xs text-neutral-500 mt-0.5">
            Manage your booked cars, download rental vouchers, or extend duration.
          </p>
        </div>

        {/* Tab Filters */}
        <div className="flex items-center gap-1.5 p-1 bg-neutral-100 rounded-xl overflow-x-auto">
          {(['All', 'Confirmed', 'Active', 'Completed', 'Cancelled'] as const).map(tab => {
            const count = tab === 'All' ? bookings.length : bookings.filter(b => b.status === tab).length;
            return (
              <button
                key={tab}
                id={`bookings-tab-${tab.toLowerCase()}`}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
                  activeTab === tab 
                    ? 'bg-white text-neutral-900 shadow-xs' 
                    : 'text-neutral-600 hover:text-neutral-900'
                }`}
              >
                {tab} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {/* Bookings List or Empty State */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 px-4 bg-white rounded-2xl border border-neutral-200 shadow-xs">
          <div className="w-14 h-14 bg-neutral-100 rounded-full flex items-center justify-center mx-auto text-neutral-400 mb-3">
            <Car className="w-7 h-7" />
          </div>
          <h3 className="text-base font-bold text-neutral-900">No {activeTab !== 'All' ? activeTab : ''} Reservations Found</h3>
          <p className="text-xs text-neutral-500 max-w-sm mx-auto mt-1 mb-5">
            You don't have any bookings matching this category. Check out our certified fleet and reserve your preferred ride today.
          </p>
          <button
            id="btn-empty-browse-fleet"
            type="button"
            onClick={onBrowseFleet}
            className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-neutral-900 hover:bg-neutral-800 transition shadow-sm inline-flex items-center gap-2"
          >
            <span>Explore Vehicle Fleet</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map(booking => {
            const isConfirmed = booking.status === 'Confirmed';
            const isActive = booking.status === 'Active';
            const isCancelled = booking.status === 'Cancelled';
            const canModify = isConfirmed || isActive;

            return (
              <div
                key={booking.id}
                id={`booking-card-${booking.id}`}
                className="bg-white rounded-2xl border border-neutral-200 p-5 shadow-xs hover:shadow-sm transition"
              >
                <div className="flex flex-col lg:flex-row gap-5 items-start lg:items-center justify-between">
                  
                  {/* Left: Vehicle Image & Basic Info */}
                  <div className="flex items-start gap-4 flex-1">
                    <img
                      src={booking.vehicleImage}
                      alt={booking.vehicleName}
                      referrerPolicy="no-referrer"
                      className="w-24 h-18 sm:w-28 sm:h-20 rounded-xl object-cover border border-neutral-200 shrink-0"
                    />

                    <div>
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-neutral-100 text-neutral-800 border border-neutral-200">
                          {booking.bookingCode}
                        </span>

                        {isConfirmed && (
                          <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" /> Confirmed
                          </span>
                        )}
                        {isActive && (
                          <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-sky-50 text-sky-700 border border-sky-200 flex items-center gap-1">
                            <Clock className="w-3 h-3" /> Active Rental
                          </span>
                        )}
                        {booking.status === 'Completed' && (
                          <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-neutral-100 text-neutral-600">
                            Completed
                          </span>
                        )}
                        {isCancelled && (
                          <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-red-50 text-red-600 border border-red-200">
                            Cancelled
                          </span>
                        )}

                        <span className="text-xs text-neutral-400">
                          Plate: {booking.registrationNumber}
                        </span>
                      </div>

                      <h3 className="text-base font-extrabold text-neutral-900">
                        {booking.vehicleBrand} {booking.vehicleName}
                      </h3>

                      <div className="text-xs text-neutral-600 mt-1 flex flex-wrap items-center gap-x-4 gap-y-1">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-neutral-400" />
                          <span>Pickup: <strong>{booking.pickupLocation}</strong></span>
                        </span>
                        <span>
                          Dates: <strong>{booking.pickupDate}</strong> to <strong>{booking.returnDate}</strong> ({booking.rentalDays}d)
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Middle: Driver & Payment Snapshot */}
                  <div className="text-xs text-neutral-600 space-y-1 lg:text-right border-t lg:border-t-0 pt-3 lg:pt-0 w-full lg:w-auto">
                    <div>Driver: <strong className="text-neutral-900">{booking.customerName}</strong></div>
                    <div>License: <span className="font-mono">{booking.drivingLicenseNumber}</span></div>
                    <div className="text-sm font-black text-neutral-900 pt-1">
                      Total: <span className="text-emerald-700">{formatConverted(booking.totalAmount, booking.currencyCode || 'USD', booking.currencySymbol || '$')}</span>
                      <span className="text-[10px] text-neutral-400 font-normal"> ({booking.paymentMethod})</span>
                    </div>
                  </div>

                  {/* Right: Actions */}
                  <div className="flex items-center gap-2 flex-wrap border-t lg:border-t-0 pt-3 lg:pt-0 w-full lg:w-auto justify-end">
                    
                    {/* Live GPS Tracker Button */}
                    {onTrackBooking && (
                      <button
                        id={`btn-track-booking-${booking.id}`}
                        type="button"
                        onClick={() => onTrackBooking(booking)}
                        className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white flex items-center gap-1.5 transition shadow-xs"
                      >
                        <Navigation className="w-3.5 h-3.5" />
                        <span>Live GPS Tracker</span>
                      </button>
                    )}

                    {/* View Voucher / Receipt */}
                    <button
                      id={`btn-view-receipt-${booking.id}`}
                      type="button"
                      onClick={() => onViewReceipt(booking)}
                      className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-neutral-900 hover:bg-neutral-800 text-white flex items-center gap-1.5 transition shadow-xs"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Receipt Voucher</span>
                    </button>

                    {/* View Rental Agreement */}
                    {onViewAgreement && (
                      <button
                        id={`btn-view-agreement-${booking.id}`}
                        type="button"
                        onClick={() => onViewAgreement(booking)}
                        className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-neutral-100 hover:bg-neutral-200 text-neutral-800 border border-neutral-300 flex items-center gap-1.5 transition shadow-xs"
                        title="View legally binding rental contract between owner and user"
                      >
                        <FileCheck className="w-3.5 h-3.5 text-indigo-600" />
                        <span>Rental Agreement</span>
                      </button>
                    )}

                    {/* Extend days */}
                    {canModify && (
                      <button
                        id={`btn-extend-${booking.id}`}
                        type="button"
                        onClick={() => setExtendingId(extendingId === booking.id ? null : booking.id)}
                        className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-neutral-100 hover:bg-neutral-200 text-neutral-700 flex items-center gap-1 transition"
                      >
                        <PlusCircle className="w-3.5 h-3.5" />
                        <span>Extend</span>
                      </button>
                    )}

                    {/* Cancel button */}
                    {canModify && (
                      <button
                        id={`btn-cancel-prompt-${booking.id}`}
                        type="button"
                        onClick={() => setCancelPromptId(cancelPromptId === booking.id ? null : booking.id)}
                        className="px-2.5 py-1.5 text-xs font-semibold rounded-lg text-red-600 hover:bg-red-50 border border-red-200 transition"
                      >
                        Cancel
                      </button>
                    )}
                  </div>

                </div>

                {/* Sub-panel: Extend duration dropdown */}
                {extendingId === booking.id && (
                  <div className="mt-4 pt-3 border-t border-neutral-100 p-3 bg-neutral-50 rounded-xl flex items-center justify-between gap-3 text-xs animate-in fade-in">
                    <div>
                      <span className="font-bold text-neutral-800 block">Extend Reservation:</span>
                      <span className="text-neutral-500 text-[11px]">Add additional days at standard daily rate (${booking.pricePerDay}/day).</span>
                    </div>

                    <div className="flex items-center gap-2">
                      {[1, 2, 3].map(days => (
                        <button
                          key={days}
                          type="button"
                          onClick={() => {
                            onExtendBooking(booking.id, days);
                            setExtendingId(null);
                          }}
                          className="px-2.5 py-1 rounded bg-neutral-900 text-white hover:bg-neutral-800 font-bold transition text-xs"
                        >
                          +{days} Day{days > 1 ? 's' : ''} (+{formatConverted(booking.pricePerDay * days, booking.currencyCode || 'USD', booking.currencySymbol || '$')})
                        </button>
                      ))}
                      <button
                        type="button"
                        onClick={() => setExtendingId(null)}
                        className="text-neutral-500 hover:text-neutral-800 text-xs ml-1"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}

                {/* Sub-panel: Cancel Confirmation */}
                {cancelPromptId === booking.id && (
                  <div className="mt-4 pt-3 border-t border-red-100 p-3 bg-red-50/70 rounded-xl flex items-center justify-between gap-3 text-xs animate-in fade-in">
                    <div className="flex items-center gap-2 text-red-800">
                      <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
                      <span>Are you sure you want to cancel booking <strong>{booking.bookingCode}</strong>? Full refund will be credited.</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        id={`btn-confirm-cancel-${booking.id}`}
                        type="button"
                        onClick={() => {
                          onCancelBooking(booking.id);
                          setCancelPromptId(null);
                        }}
                        className="px-3 py-1 rounded bg-red-600 hover:bg-red-700 text-white font-bold text-xs"
                      >
                        Yes, Cancel Booking
                      </button>
                      <button
                        type="button"
                        onClick={() => setCancelPromptId(null)}
                        className="px-2.5 py-1 rounded bg-white text-neutral-600 border border-neutral-200 text-xs"
                      >
                        Keep Booking
                      </button>
                    </div>
                  </div>
                )}

              </div>
            );
          })}
        </div>
      )}

    </div>
  );
};
