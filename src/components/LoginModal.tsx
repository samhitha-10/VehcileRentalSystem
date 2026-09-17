import React, { useState } from 'react';
import { 
  X, User, Mail, Phone, ShieldCheck, MapPin, Globe2, Sparkles, 
  CheckCircle2, ArrowRight, LogIn, Home, Users, Check, AlertCircle, 
  CreditCard, FileCheck, Shield, RefreshCw
} from 'lucide-react';
import { useUser } from '../context/UserContext';
import { SUPPORTED_PLACES, PRESET_USERS } from '../data/places';
import { AddressDetails, FamilyContact, UserProfile } from '../types';

interface LoginModalProps {
  onClose: () => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({ onClose }) => {
  const { user, login, setPlaceByCode, place } = useUser();

  // Mode: 'login' (fast preset/existing) or 'register' (full custom dynamic registration)
  const [activeTab, setActiveTab] = useState<'personal' | 'kyc' | 'address' | 'family'>('personal');
  
  // Personal Info
  const [name, setName] = useState(user.name || '');
  const [age, setAge] = useState<number | ''>(user.age || 24);
  const [gender, setGender] = useState<'Male' | 'Female' | 'Other' | 'Prefer not to say'>(user.gender || 'Female');
  const [phone, setPhone] = useState(user.phone || '');
  const [isPhoneVerified, setIsPhoneVerified] = useState(user.isPhoneVerified ?? true);
  const [email, setEmail] = useState(user.email || '');
  const [isEmailVerified, setIsEmailVerified] = useState(user.isEmailVerified ?? true);
  const [drivingLicense, setDrivingLicense] = useState(user.drivingLicense || '');
  const [countryCode, setCountryCode] = useState(place.countryCode);
  const [city, setCity] = useState(user.city || place.defaultCity || '');

  // KYC: PAN & Aadhaar
  const [panCard, setPanCard] = useState(user.panCard || 'ABCSR8491A');
  const [isPanVerified, setIsPanVerified] = useState(user.isPanVerified ?? true);
  const [aadhaarCard, setAadhaarCard] = useState(user.aadhaarCard || '4928 1092 3841');
  const [isAadhaarVerified, setIsAadhaarVerified] = useState(user.isAadhaarVerified ?? true);

  // Security Addresses: Permanent House Address
  const [permHouseNo, setPermHouseNo] = useState(user.permanentAddress?.houseNo || 'Flat 402, Sri Nilayam Residency');
  const [permStreet, setPermStreet] = useState(user.permanentAddress?.street || 'Road No. 12, Banjara Hills');
  const [permLandmark, setPermLandmark] = useState(user.permanentAddress?.areaLandmark || 'Opp. Taj Krishna Gate');
  const [permCity, setPermCity] = useState(user.permanentAddress?.city || 'Hyderabad');
  const [permState, setPermState] = useState(user.permanentAddress?.state || 'Telangana');
  const [permPincode, setPermPincode] = useState(user.permanentAddress?.pincode || '500034');

  // Current Address
  const [sameAsPermanent, setSameAsPermanent] = useState(user.currentAddress?.sameAsPermanent ?? true);
  const [currHouseNo, setCurrHouseNo] = useState(user.currentAddress?.houseNo || 'Flat 402, Sri Nilayam Residency');
  const [currStreet, setCurrStreet] = useState(user.currentAddress?.street || 'Road No. 12, Banjara Hills');
  const [currLandmark, setCurrLandmark] = useState(user.currentAddress?.areaLandmark || 'Opp. Taj Krishna Gate');
  const [currCity, setCurrCity] = useState(user.currentAddress?.city || 'Hyderabad');
  const [currState, setCurrState] = useState(user.currentAddress?.state || 'Telangana');
  const [currPincode, setCurrPincode] = useState(user.currentAddress?.pincode || '500034');

  // Family Emergency Contact
  const [familyName, setFamilyName] = useState(user.familyContact?.name || 'V. R. Reddy');
  const [familyRelation, setFamilyRelation] = useState(user.familyContact?.relationship || 'Father');
  const [familyPhone, setFamilyPhone] = useState(user.familyContact?.phone || '+91 94401 98765');

  // UI status
  const [verificationFeedback, setVerificationFeedback] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const selectedPlace = SUPPORTED_PLACES.find(p => p.countryCode === countryCode) || SUPPORTED_PLACES[0];

  const handleCountryChange = (newCode: string) => {
    setCountryCode(newCode);
    const p = SUPPORTED_PLACES.find(item => item.countryCode === newCode);
    if (p) {
      setCity(p.defaultCity || '');
    }
  };

  const handleQuickLogin = (preset: typeof PRESET_USERS[0]) => {
    setName(preset.name);
    setAge(preset.age);
    setGender(preset.gender);
    setEmail(preset.email);
    setIsEmailVerified(preset.isEmailVerified);
    setPhone(preset.phone);
    setIsPhoneVerified(preset.isPhoneVerified);
    setDrivingLicense(preset.drivingLicense);
    setPanCard(preset.panCard);
    setIsPanVerified(preset.isPanVerified);
    setAadhaarCard(preset.aadhaarCard);
    setIsAadhaarVerified(preset.isAadhaarVerified);
    
    setPermHouseNo(preset.permanentAddress.houseNo);
    setPermStreet(preset.permanentAddress.street);
    setPermLandmark(preset.permanentAddress.areaLandmark || '');
    setPermCity(preset.permanentAddress.city);
    setPermState(preset.permanentAddress.state);
    setPermPincode(preset.permanentAddress.pincode);

    setSameAsPermanent(preset.currentAddress.sameAsPermanent ?? true);
    setCurrHouseNo(preset.currentAddress.houseNo);
    setCurrStreet(preset.currentAddress.street);
    setCurrLandmark(preset.currentAddress.areaLandmark || '');
    setCurrCity(preset.currentAddress.city);
    setCurrState(preset.currentAddress.state);
    setCurrPincode(preset.currentAddress.pincode);

    setFamilyName(preset.familyContact.name);
    setFamilyRelation(preset.familyContact.relationship);
    setFamilyPhone(preset.familyContact.phone);

    setCountryCode(preset.countryCode);
    setCity(preset.city);

    // Apply immediately to context
    login({
      id: preset.id,
      name: preset.name,
      age: preset.age,
      gender: preset.gender,
      email: preset.email,
      isEmailVerified: preset.isEmailVerified,
      phone: preset.phone,
      isPhoneVerified: preset.isPhoneVerified,
      drivingLicense: preset.drivingLicense,
      panCard: preset.panCard,
      isPanVerified: preset.isPanVerified,
      aadhaarCard: preset.aadhaarCard,
      isAadhaarVerified: preset.isAadhaarVerified,
      permanentAddress: preset.permanentAddress,
      currentAddress: preset.currentAddress,
      familyContact: preset.familyContact,
      countryCode: preset.countryCode,
      city: preset.city
    });
    setPlaceByCode(preset.countryCode);
    setVerificationFeedback(`Switched to ${preset.name} with 100% KYC verified credentials.`);
    setTimeout(() => {
      onClose();
    }, 400);
  };

  const handleClearToNewRegistration = () => {
    setName('');
    setAge('');
    setGender('Male');
    setEmail('');
    setIsEmailVerified(false);
    setPhone('');
    setIsPhoneVerified(false);
    setDrivingLicense('');
    setPanCard('');
    setIsPanVerified(false);
    setAadhaarCard('');
    setIsAadhaarVerified(false);
    
    setPermHouseNo('');
    setPermStreet('');
    setPermLandmark('');
    setPermCity(place.defaultCity || '');
    setPermState('');
    setPermPincode('');

    setSameAsPermanent(true);
    setCurrHouseNo('');
    setCurrStreet('');
    setCurrLandmark('');
    setCurrCity(place.defaultCity || '');
    setCurrState('');
    setCurrPincode('');

    setFamilyName('');
    setFamilyRelation('Father');
    setFamilyPhone('');

    setErrors({});
    setActiveTab('personal');
    setVerificationFeedback('Cleared form. Enter your own details to register dynamically.');
  };

  // Instant Verification Simulators
  const triggerEmailVerify = () => {
    if (!email || !email.includes('@')) {
      setErrors(prev => ({ ...prev, email: 'Enter a valid email before verifying' }));
      return;
    }
    setIsEmailVerified(true);
    setErrors(prev => ({ ...prev, email: '' }));
    setVerificationFeedback(`Email [${email}] successfully verified with OTP code.`);
  };

  const triggerPhoneVerify = () => {
    if (!phone || phone.trim().length < 8) {
      setErrors(prev => ({ ...prev, phone: 'Enter a valid mobile phone number' }));
      return;
    }
    setIsPhoneVerified(true);
    setErrors(prev => ({ ...prev, phone: '' }));
    setVerificationFeedback(`Mobile [${phone}] verified via instant SMS OTP.`);
  };

  const triggerPanVerify = () => {
    const cleaned = panCard.trim().toUpperCase();
    setPanCard(cleaned);
    const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
    if (!panRegex.test(cleaned)) {
      setErrors(prev => ({ ...prev, pan: 'Invalid PAN format. Standard: 5 Letters, 4 Digits, 1 Letter (e.g. ABCDE1234F)' }));
      setIsPanVerified(false);
      return;
    }
    setIsPanVerified(true);
    setErrors(prev => ({ ...prev, pan: '' }));
    setVerificationFeedback(`PAN Card [${cleaned}] verified with Income Tax NSDL database.`);
  };

  const triggerAadhaarVerify = () => {
    const digitsOnly = aadhaarCard.replace(/\D/g, '');
    if (digitsOnly.length !== 12) {
      setErrors(prev => ({ ...prev, aadhaar: 'Aadhaar must be exactly 12 numeric digits' }));
      setIsAadhaarVerified(false);
      return;
    }
    // Format nicely
    const formatted = `${digitsOnly.slice(0, 4)} ${digitsOnly.slice(4, 8)} ${digitsOnly.slice(8, 12)}`;
    setAadhaarCard(formatted);
    setIsAadhaarVerified(true);
    setErrors(prev => ({ ...prev, aadhaar: '' }));
    setVerificationFeedback(`Aadhaar [${formatted}] verified via UIDAI e-KYC sandbox.`);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!name.trim()) newErrors.name = 'Full name is required';
    if (!age || Number(age) < 18) newErrors.age = 'Renter must be at least 18 years of age';
    if (!email.trim() || !email.includes('@')) newErrors.email = 'Valid email is required';
    if (!phone.trim()) newErrors.phone = 'Mobile contact number is required';
    if (!drivingLicense.trim()) newErrors.license = 'Driving license number is required for rentals';

    if (panCard.trim()) {
      const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
      if (!panRegex.test(panCard.trim().toUpperCase())) {
        newErrors.pan = 'PAN format must be ABCDE1234F';
      }
    }

    if (aadhaarCard.trim()) {
      const digits = aadhaarCard.replace(/\D/g, '');
      if (digits.length !== 12) {
        newErrors.aadhaar = 'Aadhaar must be 12 digits';
      }
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      // Auto switch to tab where error is located
      if (newErrors.name || newErrors.age || newErrors.email || newErrors.phone || newErrors.license) {
        setActiveTab('personal');
      } else if (newErrors.pan || newErrors.aadhaar) {
        setActiveTab('kyc');
      }
      return;
    }

    const permanentAddress: AddressDetails = {
      houseNo: permHouseNo.trim() || 'House / Flat',
      street: permStreet.trim() || 'Main Road',
      areaLandmark: permLandmark.trim(),
      city: permCity.trim() || city || 'Hyderabad',
      state: permState.trim() || 'State',
      pincode: permPincode.trim() || '500001'
    };

    const currentAddress = sameAsPermanent
      ? { ...permanentAddress, sameAsPermanent: true }
      : {
          houseNo: currHouseNo.trim() || permanentAddress.houseNo,
          street: currStreet.trim() || permanentAddress.street,
          areaLandmark: currLandmark.trim(),
          city: currCity.trim() || permanentAddress.city,
          state: currState.trim() || permanentAddress.state,
          pincode: currPincode.trim() || permanentAddress.pincode,
          sameAsPermanent: false
        };

    const familyContact: FamilyContact = {
      name: familyName.trim() || 'Emergency Contact',
      relationship: familyRelation,
      phone: familyPhone.trim() || phone
    };

    login({
      id: user.id || `usr-${Date.now()}`,
      name: name.trim(),
      age: Number(age),
      gender,
      email: email.trim(),
      isEmailVerified,
      phone: phone.trim(),
      isPhoneVerified,
      drivingLicense: drivingLicense.trim(),
      panCard: panCard.trim().toUpperCase(),
      isPanVerified,
      aadhaarCard: aadhaarCard.trim(),
      isAadhaarVerified,
      permanentAddress,
      currentAddress,
      familyContact,
      countryCode,
      city: city || permCity
    });

    setPlaceByCode(countryCode);
    onClose();
  };

  // Verification score calculator
  const checksPassed = [
    Boolean(name.trim()),
    Boolean(age && Number(age) >= 18),
    isEmailVerified,
    isPhoneVerified,
    isPanVerified,
    isAadhaarVerified,
    Boolean(permHouseNo.trim()),
    Boolean(familyPhone.trim())
  ].filter(Boolean).length;
  const kycPercent = Math.round((checksPassed / 8) * 100);

  return (
    <div 
      id="login-modal-overlay"
      className="fixed inset-0 z-50 bg-neutral-950/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div 
        id="login-modal-card"
        className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-neutral-200 overflow-hidden my-auto max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-neutral-900 text-white p-5 sm:p-6 relative shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-neutral-800 text-xs font-semibold text-emerald-400 border border-neutral-700">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>KYC & Security Verified System</span>
            </span>

            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-neutral-800 text-[11px] font-bold text-neutral-300 border border-neutral-700">
              <span>Security Score: {kycPercent}%</span>
            </span>
          </div>

          <h2 className="text-xl sm:text-2xl font-black text-white">
            Dynamic User Profile & Security Login
          </h2>
          <p className="text-xs sm:text-sm text-neutral-400 mt-1">
            Personal identity, verified email, PAN card, Aadhaar, permanent & current security addresses, and family emergency contacts.
          </p>
        </div>

        {/* Feedback Alert if triggered */}
        {verificationFeedback && (
          <div className="bg-emerald-50 border-b border-emerald-200 px-5 py-2 text-xs font-medium text-emerald-900 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{verificationFeedback}</span>
            </span>
            <button
              type="button"
              onClick={() => setVerificationFeedback(null)}
              className="text-emerald-700 hover:text-emerald-950 font-bold"
            >
              ×
            </button>
          </div>
        )}

        {/* Scrollable Body Content */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-5 flex-1">
          
          {/* Quick 1-Click Profile Switcher */}
          <div className="p-3.5 rounded-xl bg-neutral-50 border border-neutral-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-neutral-800 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>Fast 1-Click Verified Profiles</span>
              </span>
              <button
                type="button"
                onClick={handleClearToNewRegistration}
                className="text-[11px] font-semibold text-indigo-600 hover:text-indigo-800 underline"
              >
                + Register New Blank Profile
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {PRESET_USERS.map((preset) => {
                const presetPlace = SUPPORTED_PLACES.find(p => p.countryCode === preset.countryCode);
                const isCurrent = user.email === preset.email && user.isLoggedIn;
                return (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => handleQuickLogin(preset)}
                    className={`flex items-center gap-2.5 p-2 rounded-lg text-left transition border ${
                      isCurrent
                        ? 'bg-emerald-50 border-emerald-300 text-emerald-950 font-semibold'
                        : 'bg-white border-neutral-200 hover:border-neutral-300 text-neutral-800 hover:bg-neutral-100/60'
                    }`}
                  >
                    <span className="text-lg">{presetPlace?.flag}</span>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-bold truncate flex items-center gap-1">
                        <span>{preset.name}</span>
                        <span className="text-[10px] text-neutral-500 font-normal">({preset.age}y, {preset.gender})</span>
                        {isCurrent && <CheckCircle2 className="w-3 h-3 text-emerald-600 inline" />}
                      </div>
                      <div className="text-[10px] text-neutral-500 truncate">
                        Aadhaar: {preset.aadhaarCard.slice(0, 4)}... • PAN: {preset.panCard}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Navigation Tabs for the 4 Security Sections */}
          <div className="flex border-b border-neutral-200 text-xs font-semibold gap-1 sm:gap-2 overflow-x-auto">
            <button
              type="button"
              onClick={() => setActiveTab('personal')}
              className={`pb-2.5 px-2.5 sm:px-3 border-b-2 whitespace-nowrap transition flex items-center gap-1.5 ${
                activeTab === 'personal'
                  ? 'border-neutral-900 text-neutral-900'
                  : 'border-transparent text-neutral-500 hover:text-neutral-800'
              }`}
            >
              <User className="w-3.5 h-3.5" />
              <span>1. Personal & Contact</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('kyc')}
              className={`pb-2.5 px-2.5 sm:px-3 border-b-2 whitespace-nowrap transition flex items-center gap-1.5 ${
                activeTab === 'kyc'
                  ? 'border-neutral-900 text-neutral-900'
                  : 'border-transparent text-neutral-500 hover:text-neutral-800'
              }`}
            >
              <CreditCard className="w-3.5 h-3.5" />
              <span>2. PAN & Aadhaar KYC</span>
              {(isPanVerified && isAadhaarVerified) && (
                <Check className="w-3 h-3 text-emerald-600 font-bold" />
              )}
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('address')}
              className={`pb-2.5 px-2.5 sm:px-3 border-b-2 whitespace-nowrap transition flex items-center gap-1.5 ${
                activeTab === 'address'
                  ? 'border-neutral-900 text-neutral-900'
                  : 'border-transparent text-neutral-500 hover:text-neutral-800'
              }`}
            >
              <Home className="w-3.5 h-3.5" />
              <span>3. Residential Addresses</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('family')}
              className={`pb-2.5 px-2.5 sm:px-3 border-b-2 whitespace-nowrap transition flex items-center gap-1.5 ${
                activeTab === 'family'
                  ? 'border-neutral-900 text-neutral-900'
                  : 'border-transparent text-neutral-500 hover:text-neutral-800'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>4. Family Emergency Contact</span>
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* TAB 1: PERSONAL & CONTACT */}
            {activeTab === 'personal' && (
              <div className="space-y-3.5 animate-in fade-in-50 duration-150">
                
                {/* Country / Place selector (determines currency and dispatch hubs) */}
                <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-xl">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-bold text-amber-950 flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-amber-700" />
                      <span>Nationality & Location (Sets Currency):</span>
                    </span>
                    <span className="text-[11px] font-bold text-amber-900">
                      {selectedPlace.currencyDisplay}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <select
                      id="input-login-country"
                      value={countryCode}
                      onChange={(e) => handleCountryChange(e.target.value)}
                      className="w-full bg-white border border-neutral-300 rounded-lg px-2.5 py-1.5 text-xs text-neutral-900 font-medium focus:ring-2 focus:ring-neutral-900 outline-none"
                    >
                      {SUPPORTED_PLACES.map((p) => (
                        <option key={p.countryCode} value={p.countryCode}>
                          {p.flag} {p.countryName} ({p.currencyCode} - {p.currencySymbol})
                        </option>
                      ))}
                    </select>

                    <input
                      id="input-login-city"
                      type="text"
                      placeholder="Primary City (e.g. Hyderabad, Bengaluru)"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full bg-white border border-neutral-300 rounded-lg px-2.5 py-1.5 text-xs text-neutral-900 focus:ring-2 focus:ring-neutral-900 outline-none"
                    />
                  </div>
                </div>

                {/* Name, Age & Gender */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="sm:col-span-1">
                    <label className="block text-xs font-semibold text-neutral-700 mb-1">
                      User Full Name *
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 text-neutral-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                      <input
                        id="input-login-name"
                        type="text"
                        placeholder="Samhitha Reddy"
                        value={name}
                        onChange={(e) => {
                          setName(e.target.value);
                          if (errors.name) setErrors(prev => ({ ...prev, name: '' }));
                        }}
                        className={`w-full pl-8 pr-3 py-1.5 text-xs bg-neutral-50 border rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:bg-white ${
                          errors.name ? 'border-red-500' : 'border-neutral-300'
                        }`}
                      />
                    </div>
                    {errors.name && <span className="text-[10px] text-red-600 mt-0.5 block">{errors.name}</span>}
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 mb-1">
                      Age (Years) *
                    </label>
                    <input
                      id="input-login-age"
                      type="number"
                      min={18}
                      max={95}
                      placeholder="24"
                      value={age}
                      onChange={(e) => {
                        const val = e.target.value === '' ? '' : parseInt(e.target.value, 10);
                        setAge(val);
                        if (errors.age) setErrors(prev => ({ ...prev, age: '' }));
                      }}
                      className={`w-full px-3 py-1.5 text-xs bg-neutral-50 border rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:bg-white ${
                        errors.age ? 'border-red-500' : 'border-neutral-300'
                      }`}
                    />
                    {errors.age && <span className="text-[10px] text-red-600 mt-0.5 block">{errors.age}</span>}
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 mb-1">
                      Gender *
                    </label>
                    <select
                      id="input-login-gender"
                      value={gender}
                      onChange={(e) => setGender(e.target.value as any)}
                      className="w-full px-2.5 py-1.5 text-xs bg-neutral-50 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:bg-white"
                    >
                      <option value="Female">Female</option>
                      <option value="Male">Male</option>
                      <option value="Other">Other / Non-Binary</option>
                      <option value="Prefer not to say">Prefer not to say</option>
                    </select>
                  </div>
                </div>

                {/* Email with Verification */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-semibold text-neutral-700">
                      Email Address *
                    </label>
                    {isEmailVerified ? (
                      <span className="text-[11px] font-bold text-emerald-700 flex items-center gap-1 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        <span>Verified Email ✓</span>
                      </span>
                    ) : (
                      <span className="text-[11px] text-amber-700 font-semibold">Unverified</span>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <Mail className="w-4 h-4 text-neutral-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                      <input
                        id="input-login-email"
                        type="email"
                        placeholder="samhithareddy006@gmail.com"
                        value={email}
                        onChange={(e) => {
                          setEmail(e.target.value);
                          setIsEmailVerified(false);
                          if (errors.email) setErrors(prev => ({ ...prev, email: '' }));
                        }}
                        className={`w-full pl-8 pr-3 py-1.5 text-xs bg-neutral-50 border rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:bg-white ${
                          errors.email ? 'border-red-500' : 'border-neutral-300'
                        }`}
                      />
                    </div>
                    <button
                      type="button"
                      onClick={triggerEmailVerify}
                      className="px-3 py-1.5 text-xs font-bold rounded-lg bg-neutral-800 hover:bg-neutral-900 text-white transition shrink-0"
                    >
                      {isEmailVerified ? 'Re-verify' : 'Verify Email'}
                    </button>
                  </div>
                  {errors.email && <span className="text-[10px] text-red-600 mt-0.5 block">{errors.email}</span>}
                </div>

                {/* Mobile Phone with Verification */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-semibold text-neutral-700">
                      Mobile Contact Number *
                    </label>
                    {isPhoneVerified ? (
                      <span className="text-[11px] font-bold text-emerald-700 flex items-center gap-1 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        <span>Phone Verified ✓</span>
                      </span>
                    ) : (
                      <span className="text-[11px] text-amber-700 font-semibold">Pending OTP</span>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <Phone className="w-4 h-4 text-neutral-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                      <input
                        id="input-login-phone"
                        type="tel"
                        placeholder="+91 98490 12345"
                        value={phone}
                        onChange={(e) => {
                          setPhone(e.target.value);
                          setIsPhoneVerified(false);
                          if (errors.phone) setErrors(prev => ({ ...prev, phone: '' }));
                        }}
                        className={`w-full pl-8 pr-3 py-1.5 text-xs bg-neutral-50 border rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:bg-white ${
                          errors.phone ? 'border-red-500' : 'border-neutral-300'
                        }`}
                      />
                    </div>
                    <button
                      type="button"
                      onClick={triggerPhoneVerify}
                      className="px-3 py-1.5 text-xs font-bold rounded-lg bg-neutral-800 hover:bg-neutral-900 text-white transition shrink-0"
                    >
                      {isPhoneVerified ? 'Verified' : 'Verify Phone'}
                    </button>
                  </div>
                  {errors.phone && <span className="text-[10px] text-red-600 mt-0.5 block">{errors.phone}</span>}
                </div>

                {/* Driving License */}
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">
                    Government Driving License Number *
                  </label>
                  <div className="relative">
                    <ShieldCheck className="w-4 h-4 text-neutral-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                    <input
                      id="input-login-license"
                      type="text"
                      placeholder="TS-092023004812"
                      value={drivingLicense}
                      onChange={(e) => {
                        setDrivingLicense(e.target.value);
                        if (errors.license) setErrors(prev => ({ ...prev, license: '' }));
                      }}
                      className={`w-full pl-8 pr-3 py-1.5 text-xs bg-neutral-50 border rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:bg-white ${
                        errors.license ? 'border-red-500' : 'border-neutral-300'
                      }`}
                    />
                  </div>
                  {errors.license && <span className="text-[10px] text-red-600 mt-0.5 block">{errors.license}</span>}
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    type="button"
                    onClick={() => setActiveTab('kyc')}
                    className="px-4 py-2 bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 transition"
                  >
                    <span>Next: PAN & Aadhaar KYC</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

              </div>
            )}

            {/* TAB 2: PAN & AADHAAR KYC */}
            {activeTab === 'kyc' && (
              <div className="space-y-4 animate-in fade-in-50 duration-150">
                <div className="p-3 bg-neutral-50 border border-neutral-200 rounded-xl text-xs text-neutral-600">
                  <p className="font-bold text-neutral-900 flex items-center gap-1.5">
                    <Shield className="w-4 h-4 text-indigo-600" />
                    <span>Government Identity Verification (Fraud Prevention)</span>
                  </p>
                  <p className="text-[11px] text-neutral-500 mt-0.5">
                    Under motor vehicle rental safety regulations, verifying PAN and Aadhaar identity safeguards both user bailment and fleet security.
                  </p>
                </div>

                {/* PAN Card Input & Verification */}
                <div className="p-3.5 rounded-xl border border-neutral-200 bg-white space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-neutral-900">
                      Permanent Account Number (PAN Card)
                    </label>
                    {isPanVerified ? (
                      <span className="text-[11px] font-bold text-emerald-700 flex items-center gap-1 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        <span>PAN Verified (NSDL Active)</span>
                      </span>
                    ) : (
                      <span className="text-[11px] text-amber-700 font-semibold">Verification Pending</span>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <input
                      id="input-login-pancard"
                      type="text"
                      maxLength={10}
                      placeholder="ABCSR8491A (5 Letters, 4 Digits, 1 Letter)"
                      value={panCard}
                      onChange={(e) => {
                        setPanCard(e.target.value.toUpperCase());
                        setIsPanVerified(false);
                        if (errors.pan) setErrors(prev => ({ ...prev, pan: '' }));
                      }}
                      className={`flex-1 font-mono uppercase px-3 py-1.5 text-xs bg-neutral-50 border rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:bg-white ${
                        errors.pan ? 'border-red-500' : 'border-neutral-300'
                      }`}
                    />
                    <button
                      type="button"
                      onClick={triggerPanVerify}
                      className="px-3 py-1.5 text-xs font-bold rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white transition shrink-0"
                    >
                      {isPanVerified ? 'Re-Verify' : 'Verify NSDL'}
                    </button>
                  </div>
                  {errors.pan && <span className="text-[10px] text-red-600 block">{errors.pan}</span>}
                  <span className="text-[10px] text-neutral-400 block">
                    Format: 5 uppercase letters, 4 digits, 1 uppercase letter.
                  </span>
                </div>

                {/* Aadhaar Card Input & Verification */}
                <div className="p-3.5 rounded-xl border border-neutral-200 bg-white space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-neutral-900">
                      12-Digit Aadhaar Card Number
                    </label>
                    {isAadhaarVerified ? (
                      <span className="text-[11px] font-bold text-emerald-700 flex items-center gap-1 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        <span>Aadhaar e-KYC Verified ✓</span>
                      </span>
                    ) : (
                      <span className="text-[11px] text-amber-700 font-semibold">Verification Pending</span>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <input
                      id="input-login-aadhaar"
                      type="text"
                      maxLength={14}
                      placeholder="4928 1092 3841 (12 digits)"
                      value={aadhaarCard}
                      onChange={(e) => {
                        setAadhaarCard(e.target.value);
                        setIsAadhaarVerified(false);
                        if (errors.aadhaar) setErrors(prev => ({ ...prev, aadhaar: '' }));
                      }}
                      className={`flex-1 font-mono px-3 py-1.5 text-xs bg-neutral-50 border rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:bg-white ${
                        errors.aadhaar ? 'border-red-500' : 'border-neutral-300'
                      }`}
                    />
                    <button
                      type="button"
                      onClick={triggerAadhaarVerify}
                      className="px-3 py-1.5 text-xs font-bold rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white transition shrink-0"
                    >
                      {isAadhaarVerified ? 'Re-Verify' : 'Verify UIDAI'}
                    </button>
                  </div>
                  {errors.aadhaar && <span className="text-[10px] text-red-600 block">{errors.aadhaar}</span>}
                  <span className="text-[10px] text-neutral-400 block">
                    Verified via 12-digit UIDAI sandbox verification simulation.
                  </span>
                </div>

                <div className="pt-2 flex justify-between">
                  <button
                    type="button"
                    onClick={() => setActiveTab('personal')}
                    className="px-3.5 py-2 text-xs font-semibold text-neutral-600 hover:text-neutral-900"
                  >
                    Back
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveTab('address')}
                    className="px-4 py-2 bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 transition"
                  >
                    <span>Next: Security Addresses</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}

            {/* TAB 3: RESIDENTIAL SECURITY ADDRESSES */}
            {activeTab === 'address' && (
              <div className="space-y-4 animate-in fade-in-50 duration-150">
                
                {/* Permanent House Address */}
                <div className="p-3.5 rounded-xl border border-neutral-200 bg-neutral-50/60 space-y-2.5">
                  <div className="flex items-center gap-1.5">
                    <Home className="w-4 h-4 text-neutral-700" />
                    <span className="text-xs font-bold text-neutral-900">
                      Permanent Security House Address (As per ID Proof)
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <input
                      id="input-perm-houseno"
                      type="text"
                      placeholder="Flat / House / Door No. (e.g. Flat 402, Sri Nilayam)"
                      value={permHouseNo}
                      onChange={(e) => setPermHouseNo(e.target.value)}
                      className="w-full px-2.5 py-1.5 text-xs bg-white border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900"
                    />

                    <input
                      id="input-perm-street"
                      type="text"
                      placeholder="Street / Road / Colony (e.g. Road No. 12, Banjara Hills)"
                      value={permStreet}
                      onChange={(e) => setPermStreet(e.target.value)}
                      className="w-full px-2.5 py-1.5 text-xs bg-white border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <input
                      id="input-perm-landmark"
                      type="text"
                      placeholder="Landmark (Optional)"
                      value={permLandmark}
                      onChange={(e) => setPermLandmark(e.target.value)}
                      className="w-full px-2.5 py-1.5 text-xs bg-white border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900"
                    />

                    <input
                      id="input-perm-city"
                      type="text"
                      placeholder="City (e.g. Hyderabad)"
                      value={permCity}
                      onChange={(e) => setPermCity(e.target.value)}
                      className="w-full px-2.5 py-1.5 text-xs bg-white border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900"
                    />

                    <div className="grid grid-cols-2 gap-1.5">
                      <input
                        id="input-perm-state"
                        type="text"
                        placeholder="State"
                        value={permState}
                        onChange={(e) => setPermState(e.target.value)}
                        className="w-full px-2 py-1.5 text-xs bg-white border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900"
                      />
                      <input
                        id="input-perm-pincode"
                        type="text"
                        placeholder="PIN Code"
                        value={permPincode}
                        onChange={(e) => setPermPincode(e.target.value)}
                        className="w-full px-2 py-1.5 text-xs bg-white border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900"
                      />
                    </div>
                  </div>
                </div>

                {/* Current / Present Address */}
                <div className="p-3.5 rounded-xl border border-neutral-200 bg-white space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-neutral-900">
                      Current / Present Residence Address
                    </span>
                    <label className="flex items-center gap-1.5 cursor-pointer text-xs font-semibold text-neutral-700">
                      <input
                        id="checkbox-same-address"
                        type="checkbox"
                        checked={sameAsPermanent}
                        onChange={(e) => setSameAsPermanent(e.target.checked)}
                        className="w-4 h-4 rounded text-neutral-900 focus:ring-neutral-900"
                      />
                      <span>Same as Permanent House Address</span>
                    </label>
                  </div>

                  {!sameAsPermanent && (
                    <div className="space-y-2 pt-1 border-t border-neutral-100">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <input
                          id="input-curr-houseno"
                          type="text"
                          placeholder="Current Flat / Door No."
                          value={currHouseNo}
                          onChange={(e) => setCurrHouseNo(e.target.value)}
                          className="w-full px-2.5 py-1.5 text-xs bg-neutral-50 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:bg-white"
                        />
                        <input
                          id="input-curr-street"
                          type="text"
                          placeholder="Current Street / Road"
                          value={currStreet}
                          onChange={(e) => setCurrStreet(e.target.value)}
                          className="w-full px-2.5 py-1.5 text-xs bg-neutral-50 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:bg-white"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                        <input
                          id="input-curr-landmark"
                          type="text"
                          placeholder="Landmark"
                          value={currLandmark}
                          onChange={(e) => setCurrLandmark(e.target.value)}
                          className="w-full px-2.5 py-1.5 text-xs bg-neutral-50 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:bg-white"
                        />
                        <input
                          id="input-curr-city"
                          type="text"
                          placeholder="Current City"
                          value={currCity}
                          onChange={(e) => setCurrCity(e.target.value)}
                          className="w-full px-2.5 py-1.5 text-xs bg-neutral-50 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:bg-white"
                        />
                        <div className="grid grid-cols-2 gap-1.5">
                          <input
                            id="input-curr-state"
                            type="text"
                            placeholder="State"
                            value={currState}
                            onChange={(e) => setCurrState(e.target.value)}
                            className="w-full px-2 py-1.5 text-xs bg-neutral-50 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:bg-white"
                          />
                          <input
                            id="input-curr-pincode"
                            type="text"
                            placeholder="PIN Code"
                            value={currPincode}
                            onChange={(e) => setCurrPincode(e.target.value)}
                            className="w-full px-2 py-1.5 text-xs bg-neutral-50 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:bg-white"
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="pt-2 flex justify-between">
                  <button
                    type="button"
                    onClick={() => setActiveTab('kyc')}
                    className="px-3.5 py-2 text-xs font-semibold text-neutral-600 hover:text-neutral-900"
                  >
                    Back
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveTab('family')}
                    className="px-4 py-2 bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 transition"
                  >
                    <span>Next: Family Emergency Contact</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

              </div>
            )}

            {/* TAB 4: FAMILY EMERGENCY CONTACT & SUBMISSION */}
            {activeTab === 'family' && (
              <div className="space-y-4 animate-in fade-in-50 duration-150">
                <div className="p-3 bg-neutral-50 border border-neutral-200 rounded-xl text-xs text-neutral-600">
                  <p className="font-bold text-neutral-900 flex items-center gap-1.5">
                    <Users className="w-4 h-4 text-emerald-600" />
                    <span>Family / Next of Kin Emergency Contact</span>
                  </p>
                  <p className="text-[11px] text-neutral-500 mt-0.5">
                    Required for high-value vehicle safety bailment, roadside breakdown assistance, and official FIR police recovery records.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 mb-1">
                      Family Member Name *
                    </label>
                    <input
                      id="input-family-name"
                      type="text"
                      placeholder="V. R. Reddy"
                      value={familyName}
                      onChange={(e) => setFamilyName(e.target.value)}
                      className="w-full px-3 py-1.5 text-xs bg-neutral-50 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 mb-1">
                      Relationship *
                    </label>
                    <select
                      id="input-family-relation"
                      value={familyRelation}
                      onChange={(e) => setFamilyRelation(e.target.value)}
                      className="w-full px-2.5 py-1.5 text-xs bg-neutral-50 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:bg-white"
                    >
                      <option value="Father">Father</option>
                      <option value="Mother">Mother</option>
                      <option value="Spouse">Spouse / Partner</option>
                      <option value="Brother">Brother</option>
                      <option value="Sister">Sister</option>
                      <option value="Guardian">Legal Guardian</option>
                      <option value="Other">Other Relative</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 mb-1">
                      Family Phone Number *
                    </label>
                    <input
                      id="input-family-phone"
                      type="tel"
                      placeholder="+91 94401 98765"
                      value={familyPhone}
                      onChange={(e) => setFamilyPhone(e.target.value)}
                      className="w-full px-3 py-1.5 text-xs bg-neutral-50 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:bg-white"
                    />
                  </div>
                </div>

                {/* Final Summary Card */}
                <div className="p-3.5 bg-neutral-50 rounded-xl border border-neutral-200 text-[11px] text-neutral-600 space-y-1">
                  <div className="font-bold text-neutral-900 flex items-center gap-1.5">
                    <FileCheck className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Dynamic KYC Profile Verification Summary:</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 pt-1 text-neutral-700">
                    <div>User: <strong>{name || 'Traveler'}</strong> ({age || 24}y, {gender})</div>
                    <div>Email: <strong className={isEmailVerified ? 'text-emerald-700' : 'text-amber-700'}>{email || 'Not provided'} {isEmailVerified ? '✓' : ''}</strong></div>
                    <div>PAN: <strong>{panCard || 'None'} {isPanVerified ? '(NSDL Verified ✓)' : ''}</strong></div>
                    <div>Aadhaar: <strong>{aadhaarCard || 'None'} {isAadhaarVerified ? '(e-KYC ✓)' : ''}</strong></div>
                    <div className="col-span-2">Permanent House: <strong>{permHouseNo ? `${permHouseNo}, ${permStreet}, ${permCity}` : 'None'}</strong></div>
                    <div className="col-span-2">Family Contact: <strong>{familyName} ({familyRelation}) - {familyPhone}</strong></div>
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => setActiveTab('address')}
                    className="px-3.5 py-2 text-xs font-semibold text-neutral-600 hover:text-neutral-900"
                  >
                    Back
                  </button>

                  <button
                    id="btn-save-full-profile"
                    type="submit"
                    className="py-2.5 px-6 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs transition flex items-center gap-2 shadow-sm"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Save Profile & Apply Verified KYC ({selectedPlace.currencyDisplay})</span>
                  </button>
                </div>
              </div>
            )}

            {/* Quick Submit button on bottom if on other tabs */}
            {activeTab !== 'family' && (
              <div className="pt-2 border-t border-neutral-100 flex items-center justify-between">
                <span className="text-[11px] text-neutral-400">
                  Step {activeTab === 'personal' ? '1' : activeTab === 'kyc' ? '2' : '3'} of 4
                </span>
                <button
                  type="submit"
                  className="px-4 py-2 bg-neutral-900 hover:bg-neutral-800 text-white font-bold rounded-xl text-xs transition flex items-center gap-1.5 shadow-sm"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  <span>Save & Sign In Now</span>
                </button>
              </div>
            )}

          </form>

        </div>
      </div>
    </div>
  );
};
