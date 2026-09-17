import { InsurancePlan, BookingAddon, UserPlace } from '../types';
import { ADDONS, INSURANCE_OPTIONS } from '../data/addons';
import { SUPPORTED_PLACES } from '../data/places';

/**
 * Format a number that is ALREADY in the target currency into a localized string
 */
export function formatCurrency(
  amount: number, 
  currencyCode: string = 'USD', 
  locale: string = 'en-US'
): string {
  try {
    const isZeroDecimal = currencyCode === 'INR' || currencyCode === 'JPY';
    const formatted = new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: currencyCode,
      minimumFractionDigits: isZeroDecimal ? 0 : 0,
      maximumFractionDigits: isZeroDecimal ? 0 : 2
    }).format(amount);

    return formatted;
  } catch (e) {
    return `${currencyCode} ${amount.toFixed(2)}`;
  }
}

/**
 * Formats an amount already in target currency, with optional symbol fallback
 */
export function formatConverted(
  amount: number, 
  currencyCode: string = 'USD', 
  symbol?: string
): string {
  if (symbol && symbol === '₹') {
    return `₹${Math.round(amount).toLocaleString('en-IN')}`;
  }
  return formatCurrency(amount, currencyCode);
}

/**
 * Converts a base USD amount to target currency
 */
export function convertUsd(usdAmount: number, exchangeRate: number, currencyCode: string = 'USD'): number {
  if (exchangeRate === 1 || currencyCode === 'USD') {
    return usdAmount;
  }
  const converted = usdAmount * exchangeRate;
  if (currencyCode === 'INR' || currencyCode === 'JPY') {
    // Clean integer rounding for Rupees and Yen
    return Math.round(converted);
  }
  return Math.round(converted * 100) / 100;
}

/**
 * Directly formats a base USD amount into the target place's currency
 */
export function formatUsdInPlace(usdAmount: number, place?: UserPlace | null): string {
  const currentPlace = place || SUPPORTED_PLACES[0]; // defaults to India or passed
  const converted = convertUsd(usdAmount, currentPlace.exchangeRate, currentPlace.currencyCode);
  return formatCurrency(converted, currentPlace.currencyCode, currentPlace.locale);
}

export function calculateDaysBetween(startDateStr: string, endDateStr: string): number {
  if (!startDateStr || !endDateStr) return 1;
  const start = new Date(startDateStr);
  const end = new Date(endDateStr);
  const diffTime = end.getTime() - start.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return Math.max(1, diffDays);
}

export function calculatePricingBreakdown({
  pricePerDay, // base USD
  days,
  insurancePlan,
  selectedAddonIds,
  exchangeRate = 1,
  currencyCode = 'USD'
}: {
  pricePerDay: number;
  days: number;
  insurancePlan: InsurancePlan;
  selectedAddonIds: string[];
  exchangeRate?: number;
  currencyCode?: string;
}) {
  const convertedDailyRate = convertUsd(pricePerDay, exchangeRate, currencyCode);
  const baseRentalFee = convertedDailyRate * days;
  
  const insuranceOption = INSURANCE_OPTIONS.find(i => i.id === insurancePlan) || INSURANCE_OPTIONS[0];
  const convertedInsuranceDaily = convertUsd(insuranceOption.pricePerDay, exchangeRate, currencyCode);
  const insuranceFee = convertedInsuranceDaily * days;

  const selectedAddonsList = ADDONS.filter(a => selectedAddonIds.includes(a.id));
  const rawAddonsDaily = selectedAddonsList.reduce((acc, curr) => acc + curr.pricePerDay, 0);
  const convertedAddonsDaily = convertUsd(rawAddonsDaily, exchangeRate, currencyCode);
  const addonsFee = convertedAddonsDaily * days;

  const baseServiceFee = 15; // standard booking & hub dispatch fee in USD
  const serviceFee = convertUsd(baseServiceFee, exchangeRate, currencyCode);
  
  const subtotal = baseRentalFee + insuranceFee + addonsFee + serviceFee;
  const taxRate = 0.08; // 8% state and municipal road transport tax
  
  const isZeroDecimal = currencyCode === 'INR' || currencyCode === 'JPY';
  const taxAmount = isZeroDecimal 
    ? Math.round(subtotal * taxRate) 
    : Math.round(subtotal * taxRate * 100) / 100;
    
  const totalAmount = isZeroDecimal 
    ? Math.round(subtotal + taxAmount)
    : Math.round((subtotal + taxAmount) * 100) / 100;

  return {
    convertedDailyRate,
    baseRentalFee,
    convertedInsuranceDaily,
    insuranceFee,
    addonsFee,
    serviceFee,
    taxAmount,
    totalAmount,
    selectedAddonsList
  };
}

export function generateBookingCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = 'VR-';
  for (let i = 0; i < 5; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}
