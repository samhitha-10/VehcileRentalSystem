import { LocationHub } from '../types';

export const LOCATIONS: LocationHub[] = [
  // India Hubs
  {
    id: 'loc-in-1',
    name: 'Rajiv Gandhi Int\'l Airport (RGIA)',
    city: 'Hyderabad',
    address: 'Terminal 1, Arrivals Bay 3, Shamshabad',
    isAirport: true,
    phone: '+91 40 6654 6370',
    countryCode: 'IN'
  },
  {
    id: 'loc-in-2',
    name: 'Kempegowda Int\'l Airport (T2)',
    city: 'Bengaluru',
    address: 'Terminal 2 Ground Transportation Hub, Devanahalli',
    isAirport: true,
    phone: '+91 80 2201 2401',
    countryCode: 'IN'
  },
  {
    id: 'loc-in-3',
    name: 'Indira Gandhi Int\'l Airport (T3)',
    city: 'New Delhi',
    address: 'Terminal 3 Arrivals Multi-Level Car Parking',
    isAirport: true,
    phone: '+91 11 4963 8000',
    countryCode: 'IN'
  },
  {
    id: 'loc-in-4',
    name: 'Chhatrapati Shivaji Maharaj Airport (T2)',
    city: 'Mumbai',
    address: 'Terminal 2 P4 Car Rental Zone, Andheri East',
    isAirport: true,
    phone: '+91 22 6685 1010',
    countryCode: 'IN'
  },
  {
    id: 'loc-in-5',
    name: 'Hitech City Cyber Towers Hub',
    city: 'Hyderabad',
    address: 'Opposite Cyber Towers, Madhapur',
    isAirport: false,
    phone: '+91 40 2311 8890',
    countryCode: 'IN'
  },
  {
    id: 'loc-in-6',
    name: 'Whitefield IT Tech Park Hub',
    city: 'Bengaluru',
    address: 'ITPL Main Road, Pattandur Agrahara',
    isAirport: false,
    phone: '+91 80 4118 7000',
    countryCode: 'IN'
  },
  {
    id: 'loc-in-7',
    name: 'Bandra Kurla Complex (BKC)',
    city: 'Mumbai',
    address: 'G Block, BKC Avenue 3',
    isAirport: false,
    phone: '+91 22 2659 0000',
    countryCode: 'IN'
  },
  {
    id: 'loc-in-8',
    name: 'Chennai Central / Anna Nagar Hub',
    city: 'Chennai',
    address: 'Station Plaza East, EVR Periyar Salai',
    isAirport: false,
    phone: '+91 44 2535 3520',
    countryCode: 'IN'
  },
  // Global / US / EU Hubs
  {
    id: 'loc-1',
    name: 'Metro City International Airport (Hub A)',
    city: 'Metro City',
    address: 'Terminal 2, Arrivals Blvd, Gate 4',
    isAirport: true,
    phone: '+1 (555) 019-2831',
    countryCode: 'US'
  },
  {
    id: 'loc-2',
    name: 'Downtown Central Station Square',
    city: 'Metro City',
    address: '450 Grand Avenue, Station Square',
    isAirport: false,
    phone: '+1 (555) 019-2832',
    countryCode: 'US'
  },
  {
    id: 'loc-3',
    name: 'Silicon Tech Park Innovation District',
    city: 'Metro City',
    address: '100 Silicon Way, Sector 5',
    isAirport: false,
    phone: '+1 (555) 019-2833',
    countryCode: 'US'
  },
  {
    id: 'loc-4',
    name: 'University Campus Center Hub',
    city: 'Metro City',
    address: 'University Road, West Campus Gate',
    isAirport: false,
    phone: '+1 (555) 019-2834',
    countryCode: 'US'
  },
  {
    id: 'loc-5',
    name: 'North Point Marina & Resort',
    city: 'Metro City',
    address: '88 Coastal Highway, Pier 3',
    isAirport: false,
    phone: '+1 (555) 019-2835',
    countryCode: 'US'
  }
];
