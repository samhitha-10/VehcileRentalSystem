import React, { useState, useMemo } from 'react';
import { 
  X, Calendar, Clock, MapPin, ShieldCheck, Check, 
  CreditCard, User, Mail, Phone, FileText, CheckCircle2, 
  ArrowRight, ArrowLeft, Download, Sparkles, Globe2
} from 'lucide-react';
import { Vehicle, Booking, InsurancePlan } from '../types';
import { LOCATIONS } from '../data/locations';
import { ADDONS, INSURANCE_OPTIONS } from '../data/addons';
import { calculateDaysBetween, calculatePricingBreakdown, generateBookingCode, convertUsd } from '../utils/pricing';
import { useUser } from '../context/UserContext';

interface BookingModalProps {
  vehicle: Vehicle;
  defaultPickupDate?: string;
  defaultReturnDate?: string;
  defaultLocation?: string;
  onClose: () => void;
  onBookingSuccess: (newBooking: Booking) => void;
  onViewReceipt: (booking: Booking) => void;
  onViewAgreement?: (booking?: Booking, vehicle?: Vehicle) => void;
}

export const BookingModal: React.FC<BookingModalProps> = ({
  vehicle,
  defaultPickupDate,
  defaultReturnDate,
  defaultLocation,
  onClose,
  onBookingSuccess,
  onViewReceipt,
  onViewAgreement
}) => {
  const { user, place, formatPrice, formatConverted, setIsAuthModalOpen } = useUser();

  // Booking Steps: 1: Dates & Hubs, 2: Insurance & Add-ons, 3: Driver Details & Payment, 4: Confirmation
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  // Available locations sorted with user's country hubs at the top
  const sortedLocations = useMemo(() => {
    return [...LOCATIONS].sort((a, b) => {
      if (a.countryCode === place.countryCode && b.countryCode !== place.countryCode) return -1;
      if (a.countryCode !== place.countryCode && b.countryCode === place.countryCode) return 1;
      return 0;
    });
  }, [place.countryCode]);

  const defaultHub = useMemo(() => {
    if (defaultLocation) return defaultLocation;
    const matchingCountryHub = sortedLocations.find(l => l.countryCode === place.countryCode);
    return matchingCountryHub ? matchingCountryHub.id : sortedLocations[0].id;
  }, [defaultLocation, sortedLocations, place.countryCode]);

  // Form states
  const [pickupLocation, setPickupLocation] = useState(defaultHub);
  const [dropoffLocation, setDropoffLocation] = useState(defaultHub);
  
  const todayStr = new Date().toISOString().split('T')[0];
  const [pickupDate, setPickupDate] = useState(defaultPickupDate || todayStr);
  const [pickupTime, setPickupTime] = useState('10:00');
  
  // Return date defaults to +3 days
  const defaultReturn = () => {
    if (defaultReturnDate) return defaultReturnDate;
    const d = new Date();
    d.setDate(d.getDate() + 3);
    return d.toISOString().split('T')[0];
  };
  const [returnDate, setReturnDate] = useState(defaultReturn);
  const [returnTime, setReturnTime] = useState('18:00');

  const [insurancePlan, setInsurancePlan] = useState<InsurancePlan>('standard');
  const [selectedAddons, setSelectedAddons] = useState<string[]>(['gps']);

  // Driver details initialized from UserContext
  const [customerName, setCustomerName] = useState(user.name || '');
  const [customerEmail, setCustomerEmail] = useState(user.email || '');
  const [customerPhone, setCustomerPhone] = useState(user.phone || '');
  const [drivingLicenseNumber, setDrivingLicenseNumber] = useState(user.drivingLicense || '');
  const [paymentMethod, setPaymentMethod] = useState<Booking['paymentMethod']>(
    place.countryCode === 'IN' ? 'UPI / Digital Wallet' : 'Credit Card'
  );

  // Form errors
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [confirmedBooking, setConfirmedBooking] = useState<Booking | null>(null);

  // Calculations in user's currency!
  const rentalDays = calculateDaysBetween(pickupDate, returnDate);
  const pricing = calculatePricingBreakdown({
    pricePerDay: vehicle.pricePerDay,
    days: rentalDays,
    insurancePlan,
    selectedAddonIds: selectedAddons,
    exchangeRate: place.exchangeRate,
    currencyCode: place.currencyCode
  });

  const handleAddonToggle = (addonId: string) => {
    setSelectedAddons(prev => 
      prev.includes(addonId) ? prev.filter(id => id !== addonId) : [...prev, addonId]
    );
  };

  const validateStep3 = () => {
    const newErrors: Record<string, string> = {};
    if (!customerName.trim()) newErrors.customerName = 'Full Name is required';
    if (!customerEmail.trim() || !customerEmail.includes('@')) newErrors.customerEmail = 'Valid email is required';
    if (!customerPhone.trim() || customerPhone.length < 7) newErrors.customerPhone = 'Valid contact phone number is required';
    if (!drivingLicenseNumber.trim()) newErrors.drivingLicenseNumber = 'Driving License ID is required for vehicle verification';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleConfirmReservation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep3()) return;

    const pickupHub = LOCATIONS.find(l => l.id === pickupLocation)?.name || pickupLocation;
    const dropoffHub = LOCATIONS.find(l => l.id === dropoffLocation)?.name || dropoffLocation;

    const newBooking: Booking = {
      id: 'book-' + Date.now(),
      bookingCode: generateBookingCode(),
      vehicleId: vehicle.id,
      vehicleName: vehicle.name,
      vehicleBrand: vehicle.brand,
      vehicleCategory: vehicle.category,
      vehicleImage: vehicle.imageUrl,
      registrationNumber: vehicle.registrationNumber,
      
      customerName,
      customerEmail,
      customerPhone,
      drivingLicenseNumber,
      
      pickupLocation: pickupHub,
      dropoffLocation: dropoffHub,
      pickupDate,
      pickupTime,
      returnDate,
      returnTime,
      rentalDays,
      
      pricePerDay: pricing.convertedDailyRate,
      baseRentalFee: pricing.baseRentalFee,
      insurancePlan,
      insuranceFee: pricing.insuranceFee,
      selectedAddons,
      addonsFee: pricing.addonsFee,
      serviceFee: pricing.serviceFee,
      taxAmount: pricing.taxAmount,
      totalAmount: pricing.totalAmount,
      
      currencyCode: place.currencyCode,
      currencySymbol: place.currencySymbol,
      userCountry: place.countryName,
      userCity: user.city || place.defaultCity,

      status: 'Confirmed',
      paymentMethod,
      createdAt: new Date().toISOString()
    };

    setConfirmedBooking(newBooking);
    onBookingSuccess(newBooking);
    setStep(4);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 overflow-y-auto bg-neutral-900/75 backdrop-blur-xs">
      <div 
        id="booking-modal-container"
        className="relative bg-white rounded-2xl max-w-3xl w-full overflow-hidden shadow-2xl border border-neutral-200 my-6 animate-in fade-in zoom-in-95 duration-200"
      >
        
        {/* Header Bar */}
        <div className="px-6 py-4 bg-neutral-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-neutral-800 flex items-center justify-center text-white border border-neutral-700">
              <Calendar className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold leading-tight">
                  {step === 4 ? 'Reservation Confirmed!' : `Reserve: ${vehicle.brand} ${vehicle.name}`}
                </h2>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-neutral-800 text-neutral-300 border border-neutral-700">
                  {place.flag} {place.currencyDisplay}
                </span>
              </div>
              <p className="text-xs text-neutral-400">
                {step === 1 && 'Step 1 of 3: Trip Schedule & Hub Locations'}
                {step === 2 && 'Step 2 of 3: Protection & Optional Add-ons'}
                {step === 3 && 'Step 3 of 3: Driver Credentials & Payment'}
                {step === 4 && 'Digital Rental Voucher Generated'}
              </p>
            </div>
          </div>

          <button
            type="button"
            id="btn-close-booking-modal"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-neutral-800 hover:bg-neutral-700 flex items-center justify-center text-neutral-300 hover:text-white transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Multi-step progress tracker */}
        {step < 4 && (
          <div className="bg-neutral-100 px-6 py-2.5 border-b border-neutral-200 flex items-center justify-between text-xs font-semibold">
            <div className={`flex items-center gap-2 ${step >= 1 ? 'text-neutral-900 font-bold' : 'text-neutral-400'}`}>
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${step >= 1 ? 'bg-neutral-900 text-white' : 'bg-neutral-300 text-neutral-600'}`}>1</span>
              <span>Schedule & Hubs</span>
            </div>
            <div className="h-0.5 w-8 bg-neutral-300" />
            <div className={`flex items-center gap-2 ${step >= 2 ? 'text-neutral-900 font-bold' : 'text-neutral-400'}`}>
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${step >= 2 ? 'bg-neutral-900 text-white' : 'bg-neutral-300 text-neutral-600'}`}>2</span>
              <span>Protection & Add-ons</span>
            </div>
            <div className="h-0.5 w-8 bg-neutral-300" />
            <div className={`flex items-center gap-2 ${step >= 3 ? 'text-neutral-900 font-bold' : 'text-neutral-400'}`}>
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${step >= 3 ? 'bg-neutral-900 text-white' : 'bg-neutral-300 text-neutral-600'}`}>3</span>
              <span>Driver Credentials</span>
            </div>
          </div>
        )}

        {/* Modal Scrollable Body */}
        <div className="p-6 max-h-[62vh] overflow-y-auto">
          
          {/* STEP 1: Dates & Locations */}
          {step === 1 && (
            <div className="space-y-6">
              
              {/* Selected Vehicle Snippet */}
              <div className="flex items-center gap-4 p-3.5 rounded-xl bg-neutral-50 border border-neutral-200">
                <img
                  src={vehicle.imageUrl}
                  alt={vehicle.name}
                  referrerPolicy="no-referrer"
                  className="w-20 h-14 rounded-lg object-cover border border-neutral-200 shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <div className="text-xs text-neutral-500 uppercase font-bold">{vehicle.brand} • {vehicle.category}</div>
                  <div className="text-sm font-bold text-neutral-900 truncate">{vehicle.name}</div>
                  <div className="text-xs text-neutral-600">
                    <strong className="text-neutral-900">{formatPrice(vehicle.pricePerDay)}</strong>/day • {vehicle.seats} Seats • {vehicle.transmission} • {vehicle.fuelType}
                  </div>
                </div>
              </div>

              {/* Pickup & Dropoff Hubs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-neutral-700 mb-1.5 uppercase flex items-center justify-between">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-neutral-900" /> Pickup Hub Location
                    </span>
                    <span className="text-[10px] text-neutral-400 font-normal">{place.flag} {place.countryName}</span>
                  </label>
                  <select
                    id="booking-pickup-loc"
                    value={pickupLocation}
                    onChange={(e) => setPickupLocation(e.target.value)}
                    className="w-full bg-neutral-50 border border-neutral-300 rounded-lg p-2.5 text-xs text-neutral-900 font-medium focus:ring-2 focus:ring-neutral-900 outline-none"
                  >
                    {sortedLocations.map((loc) => (
                      <option key={loc.id} value={loc.id}>
                        {loc.countryCode === place.countryCode ? '★ ' : ''}{loc.name} - {loc.city} {loc.isAirport ? '(Airport)' : ''}
                      </option>
                    ))}
                  </select>
                  <p className="text-[11px] text-neutral-500 mt-1">
                    Direct counter handover & 24/7 key deposit box
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-700 mb-1.5 uppercase flex items-center justify-between">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-neutral-900" /> Return Hub Location
                    </span>
                    <span className="text-[10px] text-neutral-400 font-normal">{place.flag} {place.countryName}</span>
                  </label>
                  <select
                    id="booking-dropoff-loc"
                    value={dropoffLocation}
                    onChange={(e) => setDropoffLocation(e.target.value)}
                    className="w-full bg-neutral-50 border border-neutral-300 rounded-lg p-2.5 text-xs text-neutral-900 font-medium focus:ring-2 focus:ring-neutral-900 outline-none"
                  >
                    {sortedLocations.map((loc) => (
                      <option key={loc.id} value={loc.id}>
                        {loc.countryCode === place.countryCode ? '★ ' : ''}{loc.name} - {loc.city} {loc.isAirport ? '(Airport)' : ''}
                      </option>
                    ))}
                  </select>
                  <p className="text-[11px] text-neutral-500 mt-1">
                    Inter-city return permitted across all network hubs
                  </p>
                </div>
              </div>

              {/* Schedule Dates & Times */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="p-3.5 rounded-xl border border-neutral-200 bg-white space-y-3">
                  <div className="flex items-center gap-2 text-xs font-bold text-neutral-900 uppercase">
                    <Calendar className="w-4 h-4 text-emerald-600" />
                    <span>Pickup Date & Time</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[10px] text-neutral-500 mb-1">Date</label>
                      <input
                        type="date"
                        min={todayStr}
                        value={pickupDate}
                        onChange={(e) => setPickupDate(e.target.value)}
                        className="w-full text-xs p-2 border border-neutral-200 rounded-lg bg-neutral-50"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] text-neutral-500 mb-1">Time</label>
                      <input
                        type="time"
                        value={pickupTime}
                        onChange={(e) => setPickupTime(e.target.value)}
                        className="w-full text-xs p-2 border border-neutral-200 rounded-lg bg-neutral-50"
                      />
                    </div>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl border border-neutral-200 bg-white space-y-3">
                  <div className="flex items-center gap-2 text-xs font-bold text-neutral-900 uppercase">
                    <Clock className="w-4 h-4 text-emerald-600" />
                    <span>Return Date & Time</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[10px] text-neutral-500 mb-1">Date</label>
                      <input
                        type="date"
                        min={pickupDate}
                        value={returnDate}
                        onChange={(e) => setReturnDate(e.target.value)}
                        className="w-full text-xs p-2 border border-neutral-200 rounded-lg bg-neutral-50"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] text-neutral-500 mb-1">Time</label>
                      <input
                        type="time"
                        value={returnTime}
                        onChange={(e) => setReturnTime(e.target.value)}
                        className="w-full text-xs p-2 border border-neutral-200 rounded-lg bg-neutral-50"
                      />
                    </div>
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* STEP 2: Insurance & Add-ons */}
          {step === 2 && (
            <div className="space-y-6">
              
              {/* Insurance Tier Cards */}
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-600 mb-3 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" /> Select Damage Protection Tier
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {INSURANCE_OPTIONS.map((plan) => {
                    const isSelected = insurancePlan === plan.id;
                    const convertedDaily = convertUsd(plan.pricePerDay, place.exchangeRate, place.currencyCode);
                    return (
                      <div
                        key={plan.id}
                        id={`insurance-plan-${plan.id}`}
                        onClick={() => setInsurancePlan(plan.id)}
                        className={`cursor-pointer rounded-xl p-4 border transition-all flex flex-col justify-between ${
                          isSelected 
                            ? 'border-neutral-900 bg-neutral-900 text-white shadow-md ring-2 ring-neutral-900' 
                            : 'border-neutral-200 bg-white text-neutral-900 hover:border-neutral-300'
                        }`}
                      >
                        <div>
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold uppercase tracking-wider">{plan.name}</span>
                            {plan.recommended && (
                              <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                                isSelected ? 'bg-white/20 text-white' : 'bg-emerald-100 text-emerald-800'
                              }`}>
                                Popular
                              </span>
                            )}
                          </div>
                          <div className="text-xs font-extrabold my-1">
                            {plan.pricePerDay === 0 ? 'Included' : `+${formatConverted(convertedDaily)} / day`}
                          </div>
                          <p className={`text-[11px] leading-tight mb-3 ${isSelected ? 'text-neutral-300' : 'text-neutral-500'}`}>
                            {plan.description}
                          </p>
                        </div>

                        <div className={`space-y-1 pt-2 border-t text-[10px] ${
                          isSelected ? 'border-neutral-800 text-neutral-300' : 'border-neutral-100 text-neutral-600'
                        }`}>
                          {plan.features.map((f, i) => (
                            <div key={i} className="flex items-center gap-1">
                              <Check className={`w-3 h-3 shrink-0 ${isSelected ? 'text-emerald-400' : 'text-emerald-600'}`} />
                              <span>{f}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Add-ons Checklist */}
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-600 mb-3 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-neutral-900" /> Optional Add-on Equipment & Services
                </h3>

                <div className="space-y-2">
                  {ADDONS.map((addon) => {
                    const isChecked = selectedAddons.includes(addon.id);
                    const convertedDaily = convertUsd(addon.pricePerDay, place.exchangeRate, place.currencyCode);
                    return (
                      <div
                        key={addon.id}
                        id={`addon-row-${addon.id}`}
                        onClick={() => handleAddonToggle(addon.id)}
                        className={`cursor-pointer p-3 rounded-xl border transition flex items-center justify-between gap-3 ${
                          isChecked 
                            ? 'border-neutral-900 bg-neutral-50/70' 
                            : 'border-neutral-200 hover:border-neutral-300 bg-white'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => {}}
                            className="w-4 h-4 accent-neutral-900 rounded cursor-pointer"
                          />
                          <div>
                            <span className="text-xs font-bold text-neutral-900 block">{addon.name}</span>
                            <span className="text-[11px] text-neutral-500">{addon.description}</span>
                          </div>
                        </div>

                        <div className="text-right shrink-0">
                          <span className="text-xs font-bold text-neutral-900 block">+{formatConverted(convertedDaily)}/day</span>
                          <span className="text-[10px] text-neutral-400">Total: {formatConverted(convertedDaily * rentalDays)}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>
          )}

          {/* STEP 3: Driver Information & Payment */}
          {step === 3 && (
            <form onSubmit={handleConfirmReservation} className="space-y-5">
              
              {/* Profile Autofill Bar */}
              <div className="p-3 bg-neutral-50 border border-neutral-200 rounded-xl flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-base">{place.flag}</span>
                  <div>
                    <span className="text-xs font-bold text-neutral-900">
                      Primary Traveler: {customerName || 'Guest'} ({place.countryName})
                    </span>
                    <span className="text-[11px] text-neutral-500 block">
                      Invoiced in {place.currencyDisplay} • Pickup in {place.countryName} Hubs
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setIsAuthModalOpen(true)}
                  className="text-[11px] font-semibold text-indigo-600 hover:text-indigo-800 underline"
                >
                  Switch Profile / Place
                </button>
              </div>

              {/* Form Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* Primary Driver Name */}
                <div>
                  <label className="block text-xs font-bold text-neutral-700 mb-1">
                    Primary Driver Full Name *
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      id="input-driver-name"
                      type="text"
                      placeholder="e.g. Samhitha Reddy"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      className={`w-full pl-9 pr-3 py-2 text-xs rounded-lg border bg-neutral-50 focus:bg-white focus:ring-2 focus:ring-neutral-900 outline-none ${
                        errors.customerName ? 'border-red-500' : 'border-neutral-300'
                      }`}
                    />
                  </div>
                  {errors.customerName && <p className="text-[10px] text-red-600 mt-1">{errors.customerName}</p>}
                </div>

                {/* Driving License Number */}
                <div>
                  <label className="block text-xs font-bold text-neutral-700 mb-1">
                    Driver's License Number *
                  </label>
                  <div className="relative">
                    <FileText className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      id="input-driver-license"
                      type="text"
                      placeholder={place.countryCode === 'IN' ? 'TS-092023004812' : 'DL-XXXXXXXX'}
                      value={drivingLicenseNumber}
                      onChange={(e) => setDrivingLicenseNumber(e.target.value)}
                      className={`w-full pl-9 pr-3 py-2 text-xs rounded-lg border bg-neutral-50 focus:bg-white focus:ring-2 focus:ring-neutral-900 outline-none ${
                        errors.drivingLicenseNumber ? 'border-red-500' : 'border-neutral-300'
                      }`}
                    />
                  </div>
                  {errors.drivingLicenseNumber && <p className="text-[10px] text-red-600 mt-1">{errors.drivingLicenseNumber}</p>}
                </div>

                {/* Email Address */}
                <div>
                  <label className="block text-xs font-bold text-neutral-700 mb-1">
                    Email Address (for Voucher & Receipt) *
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      id="input-driver-email"
                      type="email"
                      placeholder="samhithareddy006@gmail.com"
                      value={customerEmail}
                      onChange={(e) => setCustomerEmail(e.target.value)}
                      className={`w-full pl-9 pr-3 py-2 text-xs rounded-lg border bg-neutral-50 focus:bg-white focus:ring-2 focus:ring-neutral-900 outline-none ${
                        errors.customerEmail ? 'border-red-500' : 'border-neutral-300'
                      }`}
                    />
                  </div>
                  {errors.customerEmail && <p className="text-[10px] text-red-600 mt-1">{errors.customerEmail}</p>}
                </div>

                {/* Phone Number */}
                <div>
                  <label className="block text-xs font-bold text-neutral-700 mb-1">
                    Phone Number (SMS Notifications) *
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      id="input-driver-phone"
                      type="tel"
                      placeholder={place.countryCode === 'IN' ? '+91 98490 12345' : '+1 (555) 000-0000'}
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      className={`w-full pl-9 pr-3 py-2 text-xs rounded-lg border bg-neutral-50 focus:bg-white focus:ring-2 focus:ring-neutral-900 outline-none ${
                        errors.customerPhone ? 'border-red-500' : 'border-neutral-300'
                      }`}
                    />
                  </div>
                  {errors.customerPhone && <p className="text-[10px] text-red-600 mt-1">{errors.customerPhone}</p>}
                </div>

              </div>

              {/* Payment Method Selector */}
              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-2">
                  Payment Preference {place.countryCode === 'IN' && '(UPI Instant & Card enabled)'}
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {(['UPI / Digital Wallet', 'Credit Card', 'Debit Card', 'Pay at Hub'] as const).map((method) => (
                    <button
                      key={method}
                      type="button"
                      id={`payment-method-${method.replace(/\s+/g, '-').toLowerCase()}`}
                      onClick={() => setPaymentMethod(method)}
                      className={`p-2.5 rounded-lg text-xs font-semibold border transition text-center ${
                        paymentMethod === method
                          ? 'border-neutral-900 bg-neutral-900 text-white shadow-xs'
                          : 'border-neutral-200 bg-neutral-50 hover:bg-neutral-100 text-neutral-700'
                      }`}
                    >
                      {method === 'UPI / Digital Wallet' && place.countryCode === 'IN' ? '⚡ UPI / GPay / PhonePe' : method}
                    </button>
                  ))}
                </div>
              </div>

              {/* Legal Agreement Notice between User & Owner */}
              <div className="p-3 bg-neutral-100 rounded-xl border border-neutral-200 text-[11px] text-neutral-600 flex items-start justify-between gap-3">
                <div>
                  <p className="font-semibold text-neutral-800">
                    Master Rental Agreement (User & Owner):
                  </p>
                  <p className="text-[10px] text-neutral-500 mt-0.5">
                    By confirming this reservation, you and AutoFleet Logistics agree to the digital bailment contract, GPS telemetry, and KYC verification terms.
                  </p>
                </div>
                {onViewAgreement && (
                  <button
                    type="button"
                    onClick={() => onViewAgreement(undefined, vehicle)}
                    className="shrink-0 px-2.5 py-1 text-[11px] font-bold text-neutral-900 bg-white hover:bg-neutral-50 border border-neutral-300 rounded-lg transition"
                  >
                    Read Contract
                  </button>
                )}
              </div>

            </form>
          )}

          {/* STEP 4: Booking Confirmed Banner */}
          {step === 4 && confirmedBooking && (
            <div className="text-center py-6 space-y-6">
              
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-xs">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <div>
                <h3 className="text-xl font-bold text-neutral-900">Your Vehicle is Reserved!</h3>
                <p className="text-xs text-neutral-500 max-w-md mx-auto mt-1">
                  Confirmation voucher has been generated. Show your voucher at the hub dispatch desk upon arrival.
                </p>
              </div>

              {/* Booking Summary Box */}
              <div className="max-w-md mx-auto p-4 rounded-xl bg-neutral-50 border border-neutral-200 text-left">
                <div className="flex items-center justify-between pb-3 border-b border-neutral-200">
                  <div>
                    <span className="text-[10px] text-neutral-500 uppercase font-bold">Booking Code</span>
                    <div className="text-base font-mono font-bold text-neutral-900">{confirmedBooking.bookingCode}</div>
                  </div>
                  <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
                    Confirmed
                  </span>
                </div>

                <div className="py-3 border-b border-neutral-200 space-y-1.5 text-xs text-neutral-700">
                  <div className="flex justify-between">
                    <span className="text-neutral-500">Vehicle:</span>
                    <strong className="text-neutral-900">{confirmedBooking.vehicleBrand} {confirmedBooking.vehicleName}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-500">Primary Driver:</span>
                    <span className="font-semibold text-neutral-900">{confirmedBooking.customerName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-500">Dates ({confirmedBooking.rentalDays} Days):</span>
                    <span>{confirmedBooking.pickupDate} to {confirmedBooking.returnDate}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-500">Pickup Hub:</span>
                    <span className="text-right truncate max-w-[200px]">{confirmedBooking.pickupLocation}</span>
                  </div>
                  <div className="flex justify-between font-bold text-neutral-900 pt-1">
                    <span>Total Paid ({confirmedBooking.currencyCode || place.currencyCode}):</span>
                    <span className="text-emerald-700 text-sm">
                      {formatConverted(confirmedBooking.totalAmount)}
                    </span>
                  </div>
                </div>

                <div className="pt-2 text-[10px] text-neutral-400 text-center">
                  Voucher copy emailed to {confirmedBooking.customerEmail}
                </div>
              </div>

              {/* Action Buttons on Step 4 */}
              <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                <button
                  id="btn-view-printable-voucher"
                  type="button"
                  onClick={() => onViewReceipt(confirmedBooking)}
                  className="px-4 py-2 text-xs font-bold rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white flex items-center gap-2 shadow-sm transition"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>View Printable Voucher Receipt</span>
                </button>

                {onViewAgreement && (
                  <button
                    id="btn-step4-view-agreement"
                    type="button"
                    onClick={() => onViewAgreement(confirmedBooking)}
                    className="px-4 py-2 text-xs font-bold rounded-xl bg-neutral-100 hover:bg-neutral-200 text-neutral-800 border border-neutral-300 flex items-center gap-2 transition"
                  >
                    <FileText className="w-3.5 h-3.5 text-indigo-600" />
                    <span>View Signed Agreement</span>
                  </button>
                )}

                <button
                  id="btn-done-booking"
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-xs font-semibold rounded-xl bg-neutral-100 hover:bg-neutral-200 text-neutral-700 transition"
                >
                  Back to Fleet Catalog
                </button>
              </div>

            </div>
          )}

          {/* Pricing Breakdown Card (shown in steps 1, 2, 3) */}
          {step < 4 && (
            <div className="mt-6 p-4 rounded-xl bg-neutral-50 border border-neutral-200 text-xs space-y-2">
              <div className="flex items-center justify-between font-bold text-neutral-900 pb-1 border-b border-neutral-200">
                <span className="flex items-center gap-1.5">
                  <span>Fare Estimate</span>
                  <span className="font-normal text-[11px] text-neutral-500">({place.flag} {place.currencyDisplay})</span>
                </span>
                <span>{rentalDays} {rentalDays === 1 ? 'Day' : 'Days'}</span>
              </div>

              <div className="flex justify-between text-neutral-600">
                <span>Vehicle Daily Rate ({formatConverted(pricing.convertedDailyRate)} × {rentalDays}d)</span>
                <span>{formatConverted(pricing.baseRentalFee)}</span>
              </div>

              {pricing.insuranceFee > 0 && (
                <div className="flex justify-between text-neutral-600">
                  <span>Protection Plan ({insurancePlan})</span>
                  <span>+{formatConverted(pricing.insuranceFee)}</span>
                </div>
              )}

              {pricing.addonsFee > 0 && (
                <div className="flex justify-between text-neutral-600">
                  <span>Add-ons ({selectedAddons.length} item{selectedAddons.length > 1 ? 's' : ''})</span>
                  <span>+{formatConverted(pricing.addonsFee)}</span>
                </div>
              )}

              <div className="flex justify-between text-neutral-600">
                <span>Facility Hub & Service Fee</span>
                <span>+{formatConverted(pricing.serviceFee)}</span>
              </div>

              <div className="flex justify-between text-neutral-600">
                <span>State & Road Transport Tax (8%)</span>
                <span>+{formatConverted(pricing.taxAmount)}</span>
              </div>

              <div className="flex justify-between items-baseline font-black text-sm text-neutral-900 pt-2 border-t border-neutral-200">
                <span>Total Estimated Cost ({place.currencyDisplay})</span>
                <span className="text-base text-neutral-950 font-black">{formatConverted(pricing.totalAmount)}</span>
              </div>
            </div>
          )}

        </div>

        {/* Modal Navigation Footer (Steps 1-3) */}
        {step < 4 && (
          <div className="p-4 bg-neutral-50 border-t border-neutral-200 flex items-center justify-between">
            {step > 1 ? (
              <button
                id="btn-booking-prev-step"
                type="button"
                onClick={() => setStep((step - 1) as 1 | 2 | 3)}
                className="px-3.5 py-2 rounded-xl text-xs font-semibold text-neutral-700 bg-white border border-neutral-200 hover:bg-neutral-100 flex items-center gap-1.5 transition"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Back
              </button>
            ) : (
              <button
                type="button"
                onClick={onClose}
                className="px-3.5 py-2 rounded-xl text-xs font-semibold text-neutral-500 hover:text-neutral-900 transition"
              >
                Cancel
              </button>
            )}

            {step < 3 ? (
              <button
                id="btn-booking-next-step"
                type="button"
                onClick={() => setStep((step + 1) as 2 | 3)}
                className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-neutral-900 hover:bg-neutral-800 flex items-center gap-1.5 transition shadow-sm"
              >
                Continue to {step === 1 ? 'Protection' : 'Driver Credentials'}
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                id="btn-booking-submit-confirm"
                type="button"
                onClick={handleConfirmReservation}
                className="px-6 py-2 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 flex items-center gap-2 transition shadow-sm"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Confirm & Pay {formatConverted(pricing.totalAmount)}</span>
              </button>
            )}
          </div>
        )}

      </div>
    </div>
  );
};
