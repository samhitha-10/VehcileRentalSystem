import React from 'react';
import { X, Printer, CheckCircle2, ShieldCheck, MapPin, Calendar, Clock, Car, QrCode, FileText } from 'lucide-react';
import { Booking } from '../types';
import { formatConverted } from '../utils/pricing';

interface ReceiptModalProps {
  booking: Booking | null;
  onClose: () => void;
  onViewAgreement?: (booking: Booking) => void;
}

export const ReceiptModal: React.FC<ReceiptModalProps> = ({ booking, onClose, onViewAgreement }) => {
  if (!booking) return null;

  const handlePrint = () => {
    window.print();
  };

  const fmt = (amount: number) => formatConverted(amount, booking.currencyCode || 'USD', booking.currencySymbol || '$');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-neutral-900/75 backdrop-blur-xs">
      <div 
        id="receipt-modal-card"
        className="relative bg-white rounded-2xl max-w-2xl w-full overflow-hidden shadow-2xl border border-neutral-200 my-6 animate-in fade-in zoom-in-95 duration-200 print:m-0 print:border-none print:shadow-none"
      >
        
        {/* Top Action Bar (hidden when printing) */}
        <div className="px-6 py-3 bg-neutral-900 text-white flex items-center justify-between print:hidden">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span className="text-xs font-bold uppercase tracking-wider">Official Digital Rental Voucher</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              id="btn-print-receipt"
              type="button"
              onClick={handlePrint}
              className="px-3 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-semibold flex items-center gap-1.5 transition"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Save PDF</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="w-7 h-7 rounded-full bg-neutral-800 hover:bg-neutral-700 text-neutral-300 flex items-center justify-center transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Printable Voucher Document */}
        <div className="p-6 sm:p-8 space-y-6 text-neutral-900">
          
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-6 border-b-2 border-neutral-900">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <div className="w-8 h-8 rounded-lg bg-neutral-900 text-white flex items-center justify-center">
                  <Car className="w-4 h-4" />
                </div>
                <span className="font-extrabold text-xl tracking-tight text-neutral-900">AutoFleet Solutions</span>
              </div>
              <p className="text-xs text-neutral-500">
                Web Technologies Project • Vehicle Rental & Fleet Logistics
              </p>
              <p className="text-[11px] text-neutral-400 mt-0.5">
                License: WT-RENT-2026-X9 • 24/7 Helpline: +1 (555) 019-2831
              </p>
            </div>

            <div className="sm:text-right">
              <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block">Booking Reference</span>
              <span className="font-mono text-xl font-black text-neutral-900 tracking-wider">
                {booking.bookingCode}
              </span>
              <div className="mt-1">
                <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-emerald-100 text-emerald-800">
                  {booking.status}
                </span>
              </div>
            </div>
          </div>

          {/* Customer & Vehicle Info Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pb-6 border-b border-neutral-200 text-xs">
            
            {/* Primary Driver */}
            <div className="p-4 rounded-xl bg-neutral-50 border border-neutral-200/80 space-y-1.5">
              <span className="text-[10px] uppercase font-bold text-neutral-400 tracking-wider block">
                Primary Driver (Renter)
              </span>
              <div className="text-sm font-bold text-neutral-900">{booking.customerName}</div>
              <div className="text-neutral-600">Driving License: <strong className="font-mono">{booking.drivingLicenseNumber}</strong></div>
              <div className="text-neutral-600">Email: {booking.customerEmail}</div>
              <div className="text-neutral-600">Phone: {booking.customerPhone}</div>
            </div>

            {/* Vehicle Details */}
            <div className="p-4 rounded-xl bg-neutral-50 border border-neutral-200/80 space-y-1.5">
              <span className="text-[10px] uppercase font-bold text-neutral-400 tracking-wider block">
                Allocated Vehicle
              </span>
              <div className="text-sm font-bold text-neutral-900">
                {booking.vehicleBrand} {booking.vehicleName}
              </div>
              <div className="text-neutral-600">License Plate: <strong className="font-mono">{booking.registrationNumber}</strong></div>
              <div className="text-neutral-600">Category: {booking.vehicleCategory}</div>
              <div className="text-neutral-600">Fuel & Return Policy: Full-to-Full</div>
            </div>

          </div>

          {/* Itinerary Schedule */}
          <div className="p-4 rounded-xl border border-neutral-200 text-xs space-y-3">
            <span className="text-[10px] uppercase font-bold text-neutral-400 tracking-wider block">
              Trip Itinerary & Hub Dispatch
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <span className="text-neutral-500 font-semibold block text-[11px]">PICKUP HUB & TIME</span>
                <div className="font-bold text-neutral-900 mt-0.5">{booking.pickupLocation}</div>
                <div className="text-neutral-600 mt-0.5 flex items-center gap-2">
                  <span>📅 {booking.pickupDate}</span>
                  <span>⏰ {booking.pickupTime}</span>
                </div>
              </div>

              <div>
                <span className="text-neutral-500 font-semibold block text-[11px]">RETURN HUB & TIME</span>
                <div className="font-bold text-neutral-900 mt-0.5">{booking.dropoffLocation}</div>
                <div className="text-neutral-600 mt-0.5 flex items-center gap-2">
                  <span>📅 {booking.returnDate}</span>
                  <span>⏰ {booking.returnTime}</span>
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-neutral-100 flex items-center justify-between text-neutral-600 text-[11px]">
              <span>Duration: <strong>{booking.rentalDays} Days</strong></span>
              <span>Protection: <strong className="capitalize">{booking.insurancePlan} Cover</strong></span>
            </div>
          </div>

          {/* Financial Invoice Breakdown */}
          <div className="space-y-2 text-xs">
            <span className="text-[10px] uppercase font-bold text-neutral-400 tracking-wider block">
              Billing & Payment Statement
            </span>

            <div className="p-4 rounded-xl bg-neutral-50 border border-neutral-200 space-y-2">
              <div className="flex justify-between text-neutral-700">
                <span>Vehicle Daily Rate ({fmt(booking.pricePerDay)} × {booking.rentalDays} days)</span>
                <span>{fmt(booking.baseRentalFee)}</span>
              </div>

              {booking.insuranceFee > 0 && (
                <div className="flex justify-between text-neutral-700">
                  <span>Protection Coverage ({booking.insurancePlan})</span>
                  <span>+{fmt(booking.insuranceFee)}</span>
                </div>
              )}

              {booking.addonsFee > 0 && (
                <div className="flex justify-between text-neutral-700">
                  <span>Add-on Services & Equipment</span>
                  <span>+{fmt(booking.addonsFee)}</span>
                </div>
              )}

              <div className="flex justify-between text-neutral-700">
                <span>Dispatch & Hub Sanitization Fee</span>
                <span>+{fmt(booking.serviceFee)}</span>
              </div>

              <div className="flex justify-between text-neutral-700">
                <span>Applicable State Road Taxes</span>
                <span>+{fmt(booking.taxAmount)}</span>
              </div>

              <div className="pt-2 border-t border-neutral-300 flex justify-between items-baseline font-black text-sm text-neutral-900">
                <span>Total Amount Paid ({booking.currencyCode || 'USD'})</span>
                <span className="text-base text-neutral-950">{fmt(booking.totalAmount)}</span>
              </div>

              <div className="text-[10px] text-neutral-500 pt-1 flex justify-between">
                <span>Payment Mode: {booking.paymentMethod}</span>
                <span>Transaction Status: Approved</span>
              </div>
            </div>
          </div>

          {/* QR Code / Counter verification footer */}
          <div className="pt-4 border-t border-neutral-200 flex items-center justify-between gap-4 text-xs text-neutral-500">
            <div>
              <p className="font-bold text-neutral-800">Vehicle Key Handover Protocol:</p>
              <p className="text-[11px]">Present this voucher on your smartphone or printout along with physical driver license at pickup station.</p>
            </div>

            <div className="w-16 h-16 border-2 border-neutral-900 rounded-lg p-1 flex flex-col items-center justify-center shrink-0">
              <QrCode className="w-10 h-10 text-neutral-900" />
              <span className="text-[8px] font-mono font-bold text-neutral-900 mt-0.5">VERIFIED</span>
            </div>
          </div>

        </div>

        {/* Modal Bottom Close */}
        <div className="p-4 bg-neutral-50 border-t border-neutral-200 flex items-center justify-between print:hidden">
          {onViewAgreement ? (
            <button
              id="btn-receipt-view-agreement"
              type="button"
              onClick={() => onViewAgreement(booking)}
              className="px-4 py-2 rounded-xl text-xs font-bold text-neutral-900 bg-neutral-100 hover:bg-neutral-200 border border-neutral-300 flex items-center gap-1.5 transition"
            >
              <FileText className="w-3.5 h-3.5 text-indigo-600" />
              <span>View Signed Rental Agreement (Owner & User)</span>
            </button>
          ) : <div />}

          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl text-xs font-bold text-neutral-700 bg-white border border-neutral-300 hover:bg-neutral-100 transition shadow-xs"
          >
            Close Voucher
          </button>
        </div>

      </div>
    </div>
  );
};
