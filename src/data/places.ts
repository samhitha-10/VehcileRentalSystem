import { UserPlace } from '../types';

export type { UserPlace };

export const SUPPORTED_PLACES: UserPlace[] = [
  {
    countryCode: 'IN',
    countryName: 'India',
    flag: '🇮🇳',
    currencyCode: 'INR',
    currencySymbol: '₹',
    currencyDisplay: 'Rs (₹)',
    currencyName: 'Indian Rupee',
    exchangeRate: 85,
    locale: 'en-IN',
    maxFilterPrice: 20000,
    filterStep: 500,
    defaultCity: 'Hyderabad',
    sampleCities: ['Hyderabad', 'Bengaluru', 'New Delhi', 'Mumbai', 'Chennai', 'Pune']
  },
  {
    countryCode: 'US',
    countryName: 'United States',
    flag: '🇺🇸',
    currencyCode: 'USD',
    currencySymbol: '$',
    currencyDisplay: 'USD ($)',
    currencyName: 'US Dollar',
    exchangeRate: 1.0,
    locale: 'en-US',
    maxFilterPrice: 200,
    filterStep: 5,
    defaultCity: 'New York',
    sampleCities: ['New York', 'San Francisco', 'Chicago', 'Los Angeles', 'Miami']
  },
  {
    countryCode: 'GB',
    countryName: 'United Kingdom',
    flag: '🇬🇧',
    currencyCode: 'GBP',
    currencySymbol: '£',
    currencyDisplay: 'GBP (£)',
    currencyName: 'British Pound',
    exchangeRate: 0.79,
    locale: 'en-GB',
    maxFilterPrice: 180,
    filterStep: 5,
    defaultCity: 'London',
    sampleCities: ['London', 'Manchester', 'Edinburgh', 'Birmingham']
  },
  {
    countryCode: 'EU',
    countryName: 'European Union',
    flag: '🇪🇺',
    currencyCode: 'EUR',
    currencySymbol: '€',
    currencyDisplay: 'EUR (€)',
    currencyName: 'Euro',
    exchangeRate: 0.92,
    locale: 'de-DE',
    maxFilterPrice: 190,
    filterStep: 5,
    defaultCity: 'Frankfurt',
    sampleCities: ['Paris', 'Frankfurt', 'Amsterdam', 'Rome', 'Madrid']
  },
  {
    countryCode: 'AE',
    countryName: 'United Arab Emirates',
    flag: '🇦🇪',
    currencyCode: 'AED',
    currencySymbol: 'AED',
    currencyDisplay: 'AED',
    currencyName: 'UAE Dirham',
    exchangeRate: 3.67,
    locale: 'en-AE',
    maxFilterPrice: 750,
    filterStep: 20,
    defaultCity: 'Dubai',
    sampleCities: ['Dubai', 'Abu Dhabi', 'Sharjah']
  },
  {
    countryCode: 'CA',
    countryName: 'Canada',
    flag: '🇨🇦',
    currencyCode: 'CAD',
    currencySymbol: 'C$',
    currencyDisplay: 'CAD (C$)',
    currencyName: 'Canadian Dollar',
    exchangeRate: 1.36,
    locale: 'en-CA',
    maxFilterPrice: 280,
    filterStep: 10,
    defaultCity: 'Toronto',
    sampleCities: ['Toronto', 'Vancouver', 'Montreal', 'Calgary']
  },
  {
    countryCode: 'AU',
    countryName: 'Australia',
    flag: '🇦🇺',
    currencyCode: 'AUD',
    currencySymbol: 'A$',
    currencyDisplay: 'AUD (A$)',
    currencyName: 'Australian Dollar',
    exchangeRate: 1.52,
    locale: 'en-AU',
    maxFilterPrice: 320,
    filterStep: 10,
    defaultCity: 'Sydney',
    sampleCities: ['Sydney', 'Melbourne', 'Brisbane', 'Perth']
  },
  {
    countryCode: 'JP',
    countryName: 'Japan',
    flag: '🇯🇵',
    currencyCode: 'JPY',
    currencySymbol: '¥',
    currencyDisplay: 'JPY (¥)',
    currencyName: 'Japanese Yen',
    exchangeRate: 155,
    locale: 'ja-JP',
    maxFilterPrice: 35000,
    filterStep: 1000,
    defaultCity: 'Tokyo',
    sampleCities: ['Tokyo', 'Osaka', 'Kyoto', 'Yokohama']
  }
];

export const PRESET_USERS = [
  {
    id: 'usr-samhitha',
    name: 'Samhitha Reddy',
    age: 24,
    gender: 'Female' as const,
    email: 'samhithareddy006@gmail.com',
    isEmailVerified: true,
    phone: '+91 98490 12345',
    isPhoneVerified: true,
    drivingLicense: 'TS-092023004812',
    panCard: 'ABCSR8491A',
    isPanVerified: true,
    aadhaarCard: '4928 1092 3841',
    isAadhaarVerified: true,
    permanentAddress: {
      houseNo: 'Flat 402, Sri Nilayam Residency',
      street: 'Road No. 12, Banjara Hills',
      areaLandmark: 'Opp. Taj Krishna Gate',
      city: 'Hyderabad',
      state: 'Telangana',
      pincode: '500034'
    },
    currentAddress: {
      houseNo: 'Flat 402, Sri Nilayam Residency',
      street: 'Road No. 12, Banjara Hills',
      areaLandmark: 'Opp. Taj Krishna Gate',
      city: 'Hyderabad',
      state: 'Telangana',
      pincode: '500034',
      sameAsPermanent: true
    },
    familyContact: {
      name: 'V. R. Reddy',
      relationship: 'Father',
      phone: '+91 94401 98765'
    },
    countryCode: 'IN',
    city: 'Hyderabad',
    avatar: 'SR'
  },
  {
    id: 'usr-alex',
    name: 'Alex Miller',
    age: 29,
    gender: 'Male' as const,
    email: 'alex.miller@example.com',
    isEmailVerified: true,
    phone: '+1 (555) 234-5678',
    isPhoneVerified: true,
    drivingLicense: 'NY-884920194',
    panCard: 'USAID9281X',
    isPanVerified: true,
    aadhaarCard: '8820 9182 3019',
    isAadhaarVerified: true,
    permanentAddress: {
      houseNo: 'Apt 8B, Hudson Tower',
      street: '450 West 42nd St',
      areaLandmark: 'Midtown West',
      city: 'New York',
      state: 'NY',
      pincode: '10036'
    },
    currentAddress: {
      houseNo: 'Apt 8B, Hudson Tower',
      street: '450 West 42nd St',
      areaLandmark: 'Midtown West',
      city: 'New York',
      state: 'NY',
      pincode: '10036',
      sameAsPermanent: true
    },
    familyContact: {
      name: 'Sarah Miller',
      relationship: 'Spouse',
      phone: '+1 (555) 876-5432'
    },
    countryCode: 'US',
    city: 'New York',
    avatar: 'AM'
  },
  {
    id: 'usr-priya',
    name: 'Priya Sharma',
    age: 27,
    gender: 'Female' as const,
    email: 'priya.sharma@example.in',
    isEmailVerified: true,
    phone: '+91 91234 56789',
    isPhoneVerified: true,
    drivingLicense: 'KA-012022009841',
    panCard: 'BPDPS2019K',
    isPanVerified: true,
    aadhaarCard: '6610 4910 8201',
    isAadhaarVerified: true,
    permanentAddress: {
      houseNo: 'House #14, Green Glen Layout',
      street: 'Outer Ring Road, Bellandur',
      areaLandmark: 'Behind Ecospace Tech Park',
      city: 'Bengaluru',
      state: 'Karnataka',
      pincode: '500103'
    },
    currentAddress: {
      houseNo: 'House #14, Green Glen Layout',
      street: 'Outer Ring Road, Bellandur',
      areaLandmark: 'Behind Ecospace Tech Park',
      city: 'Bengaluru',
      state: 'Karnataka',
      pincode: '500103',
      sameAsPermanent: true
    },
    familyContact: {
      name: 'Rakesh Sharma',
      relationship: 'Brother',
      phone: '+91 98450 11223'
    },
    countryCode: 'IN',
    city: 'Bengaluru',
    avatar: 'PS'
  },
  {
    id: 'usr-oliver',
    name: 'Oliver Clarke',
    age: 33,
    gender: 'Male' as const,
    email: 'oliver.clarke@example.co.uk',
    isEmailVerified: true,
    phone: '+44 7700 900123',
    isPhoneVerified: true,
    drivingLicense: 'CLARK805129OL99',
    panCard: 'GBRUK8821Z',
    isPanVerified: true,
    aadhaarCard: '7721 8839 0012',
    isAadhaarVerified: true,
    permanentAddress: {
      houseNo: 'Flat 12, Regent Court',
      street: '22 Kensington High St',
      areaLandmark: 'Near Kensington Gardens',
      city: 'London',
      state: 'Greater London',
      pincode: 'W8 4PT'
    },
    currentAddress: {
      houseNo: 'Flat 12, Regent Court',
      street: '22 Kensington High St',
      areaLandmark: 'Near Kensington Gardens',
      city: 'London',
      state: 'Greater London',
      pincode: 'W8 4PT',
      sameAsPermanent: true
    },
    familyContact: {
      name: 'Emma Clarke',
      relationship: 'Mother',
      phone: '+44 7700 900456'
    },
    countryCode: 'GB',
    city: 'London',
    avatar: 'OC'
  }
];
