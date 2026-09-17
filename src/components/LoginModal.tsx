import React, { useState } from 'react';
import { X, User, Mail, Phone, ShieldCheck, MapPin, Globe2, Sparkles, CheckCircle2, ArrowRight, LogIn } from 'lucide-react';
import { useUser } from '../context/UserContext';
import { SUPPORTED_PLACES, PRESET_USERS } from '../data/places';

interface LoginModalProps {
  onClose: () => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({ onClose }) => {
  const { user, login, setPlaceByCode, place } = useUser();

  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [name, setName] = useState(user.name || '');
  const [email, setEmail] = useState(user.email || '');
  const [phone, setPhone] = useState(user.phone || '');
  const [license, setLicense] = useState(user.drivingLicense || '');
  const [countryCode, setCountryCode] = useState(place.countryCode);
  const [city, setCity] = useState(user.city || place.defaultCity);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const selectedPlace = SUPPORTED_PLACES.find(p => p.countryCode === countryCode) || SUPPORTED_PLACES[0];

  const handleCountryChange = (newCode: string) => {
    setCountryCode(newCode);
    const p = SUPPORTED_PLACES.find(item => item.countryCode === newCode);
    if (p) {
      setCity(p.defaultCity);
    }
  };

  const handleQuickLogin = (preset: typeof PRESET_USERS[0]) => {
    login({
      id: preset.id,
      name: preset.name,
      email: preset.email,
      phone: preset.phone,
      drivingLicense: preset.drivingLicense,
      countryCode: preset.countryCode,
      city: preset.city
    });
    setPlaceByCode(preset.countryCode);
    onClose();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!name.trim()) newErrors.name = 'Full name is required';
    if (!email.trim() || !email.includes('@')) newErrors.email = 'Valid email address is required';
    if (!phone.trim()) newErrors.phone = 'Contact number is required';
    if (!license.trim()) newErrors.license = 'Valid driving license is required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    login({
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim(),
      drivingLicense: license.trim(),
      countryCode,
      city
    });
    setPlaceByCode(countryCode);
    onClose();
  };

  return (
    <div 
      id="login-modal-overlay"
      className="fixed inset-0 z-50 bg-neutral-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div 
        id="login-modal-card"
        className="bg-white w-full max-w-xl rounded-2xl shadow-2xl border border-neutral-200 overflow-hidden my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-neutral-900 text-white p-5 sm:p-6 relative">
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-neutral-800 text-xs font-semibold text-emerald-400 mb-2 border border-neutral-700">
            <Globe2 className="w-3.5 h-3.5" />
            <span>Localized Rental System</span>
          </div>

          <h2 className="text-xl sm:text-2xl font-black text-white">
            {mode === 'login' ? 'Sign In & Select Your Place' : 'Create Customer Account'}
          </h2>
          <p className="text-xs sm:text-sm text-neutral-400 mt-1">
            Prices, currency (Rs in India, $ in US, £ in UK), and pickup hubs adapt automatically to your country.
          </p>
        </div>

        <div className="p-5 sm:p-6">
          
          {/* Quick 1-Click Login Presets */}
          <div className="mb-6 p-3.5 rounded-xl bg-neutral-50 border border-neutral-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-neutral-800 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>1-Click Fast Profile Switch</span>
              </span>
              <span className="text-[11px] text-neutral-500 font-medium">Quick Test Credentials</span>
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
                        {isCurrent && <CheckCircle2 className="w-3 h-3 text-emerald-600 inline" />}
                      </div>
                      <div className="text-[10px] text-neutral-500 truncate">
                        {preset.city}, {presetPlace?.countryName} • {presetPlace?.currencyDisplay}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="relative my-4 text-center">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-neutral-200" />
            </div>
            <span className="relative bg-white px-3 text-xs text-neutral-400 font-medium uppercase tracking-wider">
              Or Customize Credentials
            </span>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-3.5">
            
            {/* Country & Place of User (Highlighted!) */}
            <div className="p-3 bg-amber-50/60 border border-amber-200 rounded-xl">
              <label className="block text-xs font-bold text-amber-950 mb-1 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-amber-700" />
                  <span>Your Country / Place (Sets Currency):</span>
                </span>
                <span className="text-[11px] font-semibold text-amber-800">
                  Currency: {selectedPlace.currencyDisplay}
                </span>
              </label>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-1">
                <div>
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
                </div>

                <div>
                  <input
                    id="input-login-city"
                    type="text"
                    placeholder="City (e.g. Hyderabad, Bengaluru)"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full bg-white border border-neutral-300 rounded-lg px-2.5 py-1.5 text-xs text-neutral-900 focus:ring-2 focus:ring-neutral-900 outline-none"
                  />
                </div>
              </div>
              
              <p className="text-[10px] text-amber-800 mt-1.5">
                {countryCode === 'IN' 
                  ? '🇮🇳 Selected India: Rates displayed in Indian Rupees (₹ / Rs.), Indian airport & city dispatch hubs enabled.' 
                  : `Rates will be converted to ${selectedPlace.currencyName} (${selectedPlace.currencySymbol}) automatically.`}
              </p>
            </div>

            {/* Name & Email */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">
                  Full Name *
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
                  Email Address *
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-neutral-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                  <input
                    id="input-login-email"
                    type="email"
                    placeholder="samhithareddy006@gmail.com"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (errors.email) setErrors(prev => ({ ...prev, email: '' }));
                    }}
                    className={`w-full pl-8 pr-3 py-1.5 text-xs bg-neutral-50 border rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:bg-white ${
                      errors.email ? 'border-red-500' : 'border-neutral-300'
                    }`}
                  />
                </div>
                {errors.email && <span className="text-[10px] text-red-600 mt-0.5 block">{errors.email}</span>}
              </div>
            </div>

            {/* Phone & License */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">
                  Mobile Number *
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-neutral-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                  <input
                    id="input-login-phone"
                    type="tel"
                    placeholder={countryCode === 'IN' ? '+91 98490 12345' : '+1 (555) 019-2831'}
                    value={phone}
                    onChange={(e) => {
                      setPhone(e.target.value);
                      if (errors.phone) setErrors(prev => ({ ...prev, phone: '' }));
                    }}
                    className={`w-full pl-8 pr-3 py-1.5 text-xs bg-neutral-50 border rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:bg-white ${
                      errors.phone ? 'border-red-500' : 'border-neutral-300'
                    }`}
                  />
                </div>
                {errors.phone && <span className="text-[10px] text-red-600 mt-0.5 block">{errors.phone}</span>}
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">
                  Driving License Number *
                </label>
                <div className="relative">
                  <ShieldCheck className="w-4 h-4 text-neutral-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                  <input
                    id="input-login-license"
                    type="text"
                    placeholder={countryCode === 'IN' ? 'TS-092023004812' : 'DL-XXXXXXXX'}
                    value={license}
                    onChange={(e) => {
                      setLicense(e.target.value);
                      if (errors.license) setErrors(prev => ({ ...prev, license: '' }));
                    }}
                    className={`w-full pl-8 pr-3 py-1.5 text-xs bg-neutral-50 border rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:bg-white ${
                      errors.license ? 'border-red-500' : 'border-neutral-300'
                    }`}
                  />
                </div>
                {errors.license && <span className="text-[10px] text-red-600 mt-0.5 block">{errors.license}</span>}
              </div>
            </div>

            {/* Submit button */}
            <div className="pt-2">
              <button
                id="btn-submit-login"
                type="submit"
                className="w-full py-2.5 px-4 bg-neutral-900 hover:bg-neutral-800 text-white font-bold rounded-xl text-xs transition flex items-center justify-center gap-2 shadow-sm"
              >
                <LogIn className="w-4 h-4" />
                <span>Save Profile & Apply {selectedPlace.currencyDisplay}</span>
              </button>
            </div>
          </form>

        </div>
      </div>
    </div>
  );
};
