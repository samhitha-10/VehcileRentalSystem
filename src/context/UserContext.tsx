import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserPlace, UserProfile } from '../types';
import { SUPPORTED_PLACES, PRESET_USERS } from '../data/places';
import { formatCurrency, convertUsd, formatUsdInPlace } from '../utils/pricing';

interface UserContextType {
  user: UserProfile;
  place: UserPlace;
  isLoggedIn: boolean;
  login: (userData: Partial<UserProfile>) => void;
  logout: () => void;
  setPlaceByCode: (countryCode: string) => void;
  formatPrice: (baseUsd: number) => string;
  convertPrice: (baseUsd: number) => number;
  formatConverted: (amount: number) => string;
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
  isPlaceModalOpen: boolean;
  setIsPlaceModalOpen: (open: boolean) => void;
}

const STORAGE_KEYS = {
  USER: 'autorent_user_profile_v2',
  PLACE_CODE: 'autorent_user_place_v2'
};

const defaultUser: UserProfile = {
  id: 'usr-samhitha',
  name: 'Samhitha Reddy',
  email: 'samhithareddy006@gmail.com',
  phone: '+91 98490 12345',
  drivingLicense: 'TS-092023004812',
  countryCode: 'IN',
  city: 'Hyderabad',
  isLoggedIn: true
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load saved place or default to India (IN)
  const [place, setPlace] = useState<UserPlace>(() => {
    try {
      const savedCode = localStorage.getItem(STORAGE_KEYS.PLACE_CODE);
      if (savedCode) {
        const found = SUPPORTED_PLACES.find(p => p.countryCode === savedCode);
        if (found) return found;
      }
    } catch {}
    return SUPPORTED_PLACES[0]; // India (₹ INR)
  });

  // Load saved user or default to Samhitha Reddy (India)
  const [user, setUser] = useState<UserProfile>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.USER);
      if (saved) return JSON.parse(saved);
    } catch {}
    return defaultUser;
  });

  // Modals visibility
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [isPlaceModalOpen, setIsPlaceModalOpen] = useState<boolean>(false);

  // Sync place with storage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.PLACE_CODE, place.countryCode);
    } catch {}
  }, [place]);

  // Sync user with storage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
    } catch {}
  }, [user]);

  const setPlaceByCode = (countryCode: string) => {
    const matched = SUPPORTED_PLACES.find(p => p.countryCode === countryCode);
    if (matched) {
      setPlace(matched);
      setUser(prev => ({
        ...prev,
        countryCode: matched.countryCode,
        city: matched.defaultCity
      }));
    }
  };

  const login = (userData: Partial<UserProfile>) => {
    const matchedPlace = SUPPORTED_PLACES.find(p => p.countryCode === (userData.countryCode || user.countryCode)) || place;
    const updatedUser: UserProfile = {
      id: userData.id || `usr-${Date.now()}`,
      name: userData.name || 'Valued Traveler',
      email: userData.email || 'traveler@example.com',
      phone: userData.phone || '+91 98765 43210',
      drivingLicense: userData.drivingLicense || 'DL-PENDING',
      countryCode: matchedPlace.countryCode,
      city: userData.city || matchedPlace.defaultCity,
      isLoggedIn: true
    };
    setUser(updatedUser);
    setPlace(matchedPlace);
    setIsAuthModalOpen(false);
  };

  const logout = () => {
    setUser(prev => ({
      ...prev,
      isLoggedIn: false
    }));
  };

  const formatPrice = (baseUsd: number): string => {
    return formatUsdInPlace(baseUsd, place);
  };

  const convertPrice = (baseUsd: number): number => {
    return convertUsd(baseUsd, place.exchangeRate, place.currencyCode);
  };

  const formatConverted = (amount: number): string => {
    return formatCurrency(amount, place.currencyCode, place.locale);
  };

  return (
    <UserContext.Provider
      value={{
        user,
        place,
        isLoggedIn: user.isLoggedIn,
        login,
        logout,
        setPlaceByCode,
        formatPrice,
        convertPrice,
        formatConverted,
        isAuthModalOpen,
        setIsAuthModalOpen,
        isPlaceModalOpen,
        setIsPlaceModalOpen
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
