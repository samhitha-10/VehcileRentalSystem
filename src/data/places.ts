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
    email: 'samhithareddy006@gmail.com',
    phone: '+91 98490 12345',
    drivingLicense: 'TS-092023004812',
    countryCode: 'IN',
    city: 'Hyderabad',
    avatar: 'SR'
  },
  {
    id: 'usr-alex',
    name: 'Alex Miller',
    email: 'alex.miller@example.com',
    phone: '+1 (555) 234-5678',
    drivingLicense: 'NY-884920194',
    countryCode: 'US',
    city: 'New York',
    avatar: 'AM'
  },
  {
    id: 'usr-priya',
    name: 'Priya Sharma',
    email: 'priya.sharma@example.in',
    phone: '+91 91234 56789',
    drivingLicense: 'KA-012022009841',
    countryCode: 'IN',
    city: 'Bengaluru',
    avatar: 'PS'
  },
  {
    id: 'usr-oliver',
    name: 'Oliver Clarke',
    email: 'oliver.clarke@example.co.uk',
    phone: '+44 7700 900123',
    drivingLicense: 'CLARK805129OL99',
    countryCode: 'GB',
    city: 'London',
    avatar: 'OC'
  }
];
