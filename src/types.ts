export type VehicleCategory = 
  | 'All'
  | 'Sedan'
  | 'SUV'
  | 'Luxury'
  | 'Electric'
  | 'Sports'
  | 'Motorcycle'
  | 'Scooter'
  | 'Van';

export type FuelType = 'Petrol' | 'Diesel' | 'Electric' | 'Hybrid';
export type TransmissionType = 'Automatic' | 'Manual';
export type VehicleStatus = 'Available' | 'Rented' | 'Maintenance';

export interface Vehicle {
  id: string;
  name: string;
  brand: string;
  modelYear: number;
  category: VehicleCategory;
  transmission: TransmissionType;
  fuelType: FuelType;
  seats: number;
  doors: number;
  luggageCount: number;
  pricePerDay: number;
  rating: number;
  reviewCount: number;
  imageUrl: string;
  features: string[];
  status: VehicleStatus;
  location: string;
  mileageLimit: string;
  registrationNumber: string;
  topSpeedKmH: number;
  fuelEfficiency: string; // e.g. "18 km/l" or "480 km range"
  description: string;
}

export type InsurancePlan = 'basic' | 'standard' | 'premium';

export interface BookingAddon {
  id: string;
  name: string;
  description: string;
  pricePerDay: number;
  iconName: string;
}

export interface Booking {
  id: string;
  bookingCode: string;
  vehicleId: string;
  vehicleName: string;
  vehicleBrand: string;
  vehicleCategory: VehicleCategory;
  vehicleImage: string;
  registrationNumber: string;
  
  // Customer info
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  drivingLicenseNumber: string;
  idProofNumber?: string;
  
  // Trip details
  pickupLocation: string;
  dropoffLocation: string;
  pickupDate: string; // YYYY-MM-DD
  pickupTime: string; // HH:mm
  returnDate: string; // YYYY-MM-DD
  returnTime: string; // HH:mm
  rentalDays: number;
  
  // Pricing breakdown
  pricePerDay: number;
  baseRentalFee: number;
  insurancePlan: InsurancePlan;
  insuranceFee: number;
  selectedAddons: string[]; // addon IDs
  addonsFee: number;
  serviceFee: number;
  taxAmount: number;
  totalAmount: number;
  currencyCode?: string;
  currencySymbol?: string;
  userCountry?: string;
  userCity?: string;
  
  // Status
  status: 'Confirmed' | 'Active' | 'Completed' | 'Cancelled';
  paymentMethod: 'Credit Card' | 'Debit Card' | 'UPI / Digital Wallet' | 'Pay at Hub';
  createdAt: string;
}

export interface FilterState {
  searchTerm: string;
  category: VehicleCategory;
  fuelType: 'All' | FuelType;
  transmission: 'All' | TransmissionType;
  maxPrice: number;
  minSeats: number;
  pickupLocation: string;
  dropoffLocation: string;
  pickupDate: string;
  returnDate: string;
  sortBy: 'recommended' | 'price-low' | 'price-high' | 'rating';
}

export interface LocationHub {
  id: string;
  name: string;
  city: string;
  address: string;
  isAirport: boolean;
  phone: string;
  countryCode?: string;
}

export interface UserPlace {
  countryCode: string;
  countryName: string;
  flag: string;
  currencyCode: string;
  currencySymbol: string;
  currencyDisplay: string;
  currencyName: string;
  exchangeRate: number;
  locale: string;
  maxFilterPrice: number;
  filterStep: number;
  defaultCity?: string;
  sampleCities: string[];
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  drivingLicense: string;
  countryCode: string;
  city: string;
  isLoggedIn: boolean;
}
