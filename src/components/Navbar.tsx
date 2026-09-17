import React, { useState } from 'react';
import { Car, CalendarCheck, BookOpen, Wrench, Globe2, User, LogOut, ChevronDown, Sparkles, Navigation, CheckCircle2 } from 'lucide-react';
import { useUser } from '../context/UserContext';

interface NavbarProps {
  currentView: 'catalog' | 'bookings' | 'admin' | 'tracker' | 'docs';
  setCurrentView: (view: 'catalog' | 'bookings' | 'admin' | 'tracker' | 'docs') => void;
  bookingCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  setCurrentView,
  bookingCount
}) => {
  const { 
    user, 
    place, 
    isLoggedIn, 
    logout, 
    setIsAuthModalOpen, 
    setIsPlaceModalOpen 
  } = useUser();

  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-neutral-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-18">
          
          {/* Logo & Subject Tag */}
          <div 
            id="brand-logo"
            onClick={() => setCurrentView('catalog')}
            className="flex items-center gap-3 cursor-pointer group select-none"
          >
            <div className="w-10 h-10 rounded-xl bg-neutral-900 flex items-center justify-center text-white shadow-sm transition-transform group-hover:scale-105">
              <Car className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg text-neutral-900 tracking-tight">AutoFleet</span>
                <span className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                  Online
                </span>
              </div>
              <p className="text-xs text-neutral-500 font-medium">Web Technologies Project</p>
            </div>
          </div>

          {/* Desktop Navigation Tabs */}
          <nav className="hidden lg:flex items-center gap-1 p-1 bg-neutral-100 rounded-xl border border-neutral-200/80">
            <button
              id="nav-tab-catalog"
              onClick={() => setCurrentView('catalog')}
              className={`flex items-center gap-2 px-3.5 py-1.5 text-xs font-medium rounded-lg transition-all ${
                currentView === 'catalog'
                  ? 'bg-white text-neutral-900 shadow-xs border border-neutral-200/60 font-semibold'
                  : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-200/50'
              }`}
            >
              <Car className="w-3.5 h-3.5" />
              <span>Explore Fleet</span>
            </button>

            <button
              id="nav-tab-bookings"
              onClick={() => setCurrentView('bookings')}
              className={`flex items-center gap-2 px-3.5 py-1.5 text-xs font-medium rounded-lg transition-all relative ${
                currentView === 'bookings'
                  ? 'bg-white text-neutral-900 shadow-xs border border-neutral-200/60 font-semibold'
                  : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-200/50'
              }`}
            >
              <CalendarCheck className="w-3.5 h-3.5" />
              <span>My Rentals</span>
              {bookingCount > 0 && (
                <span className="ml-0.5 px-1.5 py-0.2 text-[10px] font-bold rounded-full bg-neutral-900 text-white">
                  {bookingCount}
                </span>
              )}
            </button>

            <button
              id="nav-tab-admin"
              onClick={() => setCurrentView('admin')}
              className={`flex items-center gap-2 px-3.5 py-1.5 text-xs font-medium rounded-lg transition-all ${
                currentView === 'admin'
                  ? 'bg-white text-neutral-900 shadow-xs border border-neutral-200/60 font-semibold'
                  : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-200/50'
              }`}
            >
              <Wrench className="w-3.5 h-3.5" />
              <span>Fleet Admin</span>
            </button>

            <button
              id="nav-tab-tracker"
              onClick={() => setCurrentView('tracker')}
              className={`flex items-center gap-2 px-3.5 py-1.5 text-xs font-medium rounded-lg transition-all ${
                currentView === 'tracker'
                  ? 'bg-emerald-600 text-white shadow-xs font-semibold'
                  : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-200/50'
              }`}
            >
              <Navigation className={`w-3.5 h-3.5 ${currentView === 'tracker' ? 'text-white' : 'text-emerald-600'}`} />
              <span>Live GPS Tracker</span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            </button>

            <button
              id="nav-tab-docs"
              onClick={() => setCurrentView('docs')}
              className={`flex items-center gap-2 px-3.5 py-1.5 text-xs font-medium rounded-lg transition-all ${
                currentView === 'docs'
                  ? 'bg-white text-indigo-900 shadow-xs border border-indigo-200 font-semibold'
                  : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-200/50'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5 text-indigo-600" />
              <span className="text-indigo-900 font-semibold">Web Tech Specs</span>
            </button>
          </nav>

          {/* User Profile & Place / Currency Selectors */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Place & Currency Pill Button */}
            <button
              id="btn-currency-place-picker"
              type="button"
              onClick={() => setIsPlaceModalOpen(true)}
              className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-semibold bg-neutral-100 hover:bg-neutral-200/80 border border-neutral-200 transition text-neutral-800 shadow-2xs"
              title={`Active place: ${place.countryName}, Currency: ${place.currencyDisplay}`}
            >
              <span className="text-base select-none">{place.flag}</span>
              <span className="hidden sm:inline font-bold text-neutral-900">{place.currencyDisplay}</span>
              <span className="sm:hidden font-bold text-neutral-900">{place.currencySymbol}</span>
              <ChevronDown className="w-3 h-3 text-neutral-400" />
            </button>

            {/* User Account / Login State */}
            {isLoggedIn ? (
              <div className="relative">
                <button
                  id="btn-user-profile-menu"
                  type="button"
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center gap-2 p-1 sm:px-2.5 sm:py-1 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-medium transition shadow-xs"
                >
                  <div className="w-6 h-6 rounded-full bg-emerald-500 text-neutral-950 font-bold flex items-center justify-center text-[10px]">
                    {user.name.charAt(0)}
                  </div>
                  <div className="hidden sm:flex flex-col text-left">
                    <span className="font-bold leading-tight truncate max-w-[100px]">{user.name.split(' ')[0]}</span>
                    <span className="text-[9px] text-neutral-300 leading-tight">{user.city || place.countryName}</span>
                  </div>
                  <ChevronDown className="w-3 h-3 text-neutral-400" />
                </button>

                {/* Dropdown Menu */}
                {isUserMenuOpen && (
                  <div 
                    id="user-profile-dropdown"
                    className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-xl border border-neutral-200 py-2 z-50 animate-in fade-in zoom-in-95 duration-100"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="px-3.5 py-2.5 border-b border-neutral-100">
                      <div className="flex items-center justify-between">
                        <p className="text-xs font-bold text-neutral-900 truncate">{user.name}</p>
                        <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200 flex items-center gap-0.5">
                          <CheckCircle2 className="w-2.5 h-2.5 text-emerald-600" />
                          <span>KYC Verified</span>
                        </span>
                      </div>
                      <p className="text-[11px] text-neutral-500 truncate">{user.email}</p>
                      
                      {/* Demographic & Contact Details */}
                      <div className="mt-1 text-[10px] text-neutral-600 flex items-center gap-2">
                        {user.age && <span>{user.age} yrs</span>}
                        {user.gender && <span>• {user.gender}</span>}
                        <span>• {user.phone}</span>
                      </div>

                      {/* Government KYC summary */}
                      <div className="mt-1.5 pt-1.5 border-t border-neutral-100/80 text-[10px] space-y-0.5 text-neutral-600">
                        {user.aadhaarCard && (
                          <div className="flex items-center justify-between">
                            <span className="text-neutral-500">Aadhaar:</span>
                            <span className="font-mono font-medium text-neutral-800">
                              {user.aadhaarCard.slice(-9)} ✓
                            </span>
                          </div>
                        )}
                        {user.panCard && (
                          <div className="flex items-center justify-between">
                            <span className="text-neutral-500">PAN Card:</span>
                            <span className="font-mono font-medium text-neutral-800">{user.panCard} ✓</span>
                          </div>
                        )}
                        {user.familyContact?.phone && (
                          <div className="flex items-center justify-between">
                            <span className="text-neutral-500">Emergency:</span>
                            <span className="text-neutral-800 truncate max-w-[130px]">
                              {user.familyContact.name} ({user.familyContact.relationship})
                            </span>
                          </div>
                        )}
                      </div>

                      <div className="mt-2 flex items-center gap-1.5 text-[10px] text-neutral-600 bg-neutral-50 px-2 py-1 rounded">
                        <span>{place.flag}</span>
                        <span>{user.city ? `${user.city}, ` : ''}{place.countryName}</span>
                        <span className="ml-auto font-bold text-emerald-700">{place.currencyDisplay}</span>
                      </div>
                    </div>

                    <div className="py-1">
                      <button
                        type="button"
                        onClick={() => {
                          setIsUserMenuOpen(false);
                          setIsAuthModalOpen(true);
                        }}
                        className="w-full text-left px-3 py-1.5 text-xs text-neutral-700 hover:bg-neutral-100 flex items-center gap-2"
                      >
                        <User className="w-3.5 h-3.5 text-neutral-400" />
                        <span>Edit Profile & KYC Details</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setIsUserMenuOpen(false);
                          setIsPlaceModalOpen(true);
                        }}
                        className="w-full text-left px-3 py-1.5 text-xs text-neutral-700 hover:bg-neutral-100 flex items-center gap-2"
                      >
                        <Globe2 className="w-3.5 h-3.5 text-neutral-400" />
                        <span>Change Country & Currency</span>
                      </button>
                    </div>

                    <div className="pt-1 border-t border-neutral-100">
                      <button
                        type="button"
                        onClick={() => {
                          setIsUserMenuOpen(false);
                          logout();
                        }}
                        className="w-full text-left px-3 py-1.5 text-xs text-red-600 hover:bg-red-50 flex items-center gap-2"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <button
                id="btn-sign-in"
                type="button"
                onClick={() => setIsAuthModalOpen(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-bold transition shadow-xs"
              >
                <User className="w-3.5 h-3.5" />
                <span>Sign In</span>
              </button>
            )}

          </div>
        </div>

        {/* Mobile Sub-Navigation */}
        <div className="flex lg:hidden items-center justify-between py-2 border-t border-neutral-100 overflow-x-auto gap-2">
          <button
            id="mobile-nav-catalog"
            onClick={() => setCurrentView('catalog')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md whitespace-nowrap ${
              currentView === 'catalog' ? 'bg-neutral-900 text-white' : 'text-neutral-600 bg-neutral-100'
            }`}
          >
            Fleet
          </button>
          <button
            id="mobile-nav-bookings"
            onClick={() => setCurrentView('bookings')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md whitespace-nowrap flex items-center gap-1 ${
              currentView === 'bookings' ? 'bg-neutral-900 text-white' : 'text-neutral-600 bg-neutral-100'
            }`}
          >
            Rentals {bookingCount > 0 && `(${bookingCount})`}
          </button>
          <button
            id="mobile-nav-admin"
            onClick={() => setCurrentView('admin')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md whitespace-nowrap ${
              currentView === 'admin' ? 'bg-neutral-900 text-white' : 'text-neutral-600 bg-neutral-100'
            }`}
          >
            Admin
          </button>
          <button
            id="mobile-nav-tracker"
            onClick={() => setCurrentView('tracker')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md whitespace-nowrap flex items-center gap-1 ${
              currentView === 'tracker' ? 'bg-emerald-600 text-white font-bold' : 'text-emerald-700 bg-emerald-50 border border-emerald-200'
            }`}
          >
            <Navigation className="w-3 h-3" />
            GPS Tracker
          </button>
          <button
            id="mobile-nav-docs"
            onClick={() => setCurrentView('docs')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md whitespace-nowrap ${
              currentView === 'docs' ? 'bg-indigo-700 text-white' : 'text-indigo-800 bg-indigo-50 border border-indigo-200'
            }`}
          >
            Web Tech Specs
          </button>
        </div>

      </div>
    </header>
  );
};
