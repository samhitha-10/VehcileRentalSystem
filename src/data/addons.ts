import { BookingAddon } from '../types';

export const ADDONS: BookingAddon[] = [
  {
    id: 'gps',
    name: 'Satellite GPS Navigation',
    description: 'Pre-loaded offline maps with real-time traffic updates and speed camera alerts.',
    pricePerDay: 8,
    iconName: 'Compass'
  },
  {
    id: 'child-seat',
    name: 'Child Safety Car Seat',
    description: 'ISOFIX compliant certified safety seat suitable for toddlers & infants.',
    pricePerDay: 10,
    iconName: 'Baby'
  },
  {
    id: 'additional-driver',
    name: 'Additional Verified Driver',
    description: 'Authorize an additional companion driver covered under the rental policy.',
    pricePerDay: 12,
    iconName: 'UserPlus'
  },
  {
    id: 'toll-pass',
    name: 'Express Electronic Toll Pass',
    description: 'Unlimited electronic highway toll tag for seamless non-stop express lane drive.',
    pricePerDay: 6,
    iconName: 'CreditCard'
  },
  {
    id: 'roadside',
    name: '24/7 Roadside Assistance',
    description: 'Priority towing, battery jumpstarts, flat tire support and lockout service.',
    pricePerDay: 5,
    iconName: 'ShieldAlert'
  }
];

export const INSURANCE_OPTIONS = [
  {
    id: 'basic' as const,
    name: 'Basic Cover',
    pricePerDay: 0,
    description: 'Standard third-party liability with $1,000 deductible excess.',
    features: ['Third-party liability', '$1,000 deductible', 'Standard customer service']
  },
  {
    id: 'standard' as const,
    name: 'Comprehensive Care',
    pricePerDay: 16,
    recommended: true,
    description: 'Collision damage waiver (CDW) with reduced $250 deductible excess.',
    features: ['Collision Damage Waiver (CDW)', 'Reduced $250 deductible', 'Theft protection coverage']
  },
  {
    id: 'premium' as const,
    name: 'Zero-Liability Platinum',
    pricePerDay: 28,
    description: 'Total peace of mind with $0 excess deductible, windscreen & tire cover.',
    features: ['Zero deductible ($0 excess)', 'Tire, glass & roof protection', 'Free 24/7 roadside assist']
  }
];
