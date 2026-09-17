import React from 'react';
import { X, Printer, ShieldCheck, FileCheck, CheckCircle2, Building2, User, Car, Download, Shield } from 'lucide-react';
import { Booking, Vehicle } from '../types';
import { useUser } from '../context/UserContext';

interface RentalAgreementModalProps {
  booking?: Booking | null;
  vehicle?: Vehicle | null;
  onClose: () => void;
}

export const RentalAgreementModal: React.FC<RentalAgreementModalProps> = ({
  booking,
  vehicle,
  onClose
}) => {
  const { user } = useUser();

  const handlePrint = () => {
    window.print();
  };

  // Fallbacks if viewing a blank sample template
  const renterName = booking?.customerName || user?.name || 'Verified Primary Driver';
  const renterAge = booking?.customerAge || user?.age || 24;
  const renterGender = booking?.customerGender || user?.gender || 'Female';
  const renterLicense = booking?.drivingLicenseNumber || user?.drivingLicense || 'DL-VERIFIED-XXXXX';
  const renterEmail = booking?.customerEmail || user?.email || 'renter@email.com';
  const renterPhone = booking?.customerPhone || user?.phone || '+91 98490 12345';
  const renterPan = booking?.panCard || user?.panCard || 'ABCSR8491A';
  const renterAadhaar = booking?.aadhaarCard || user?.aadhaarCard || '4928 1092 3841';
  const renterAddress = booking?.permanentAddress || (user?.permanentAddress ? `${user.permanentAddress.houseNo}, ${user.permanentAddress.street}, ${user.permanentAddress.city} - ${user.permanentAddress.pincode}` : 'Flat 402, Sri Nilayam Residency, Road No. 12, Banjara Hills, Hyderabad - 500034');
  const familyPhone = booking?.familyContactPhone || user?.familyContact?.phone || '+91 94401 98765';
  const familyName = booking?.familyContactName || user?.familyContact?.name || 'V. R. Reddy';
  const familyRelation = booking?.familyContactRelation || user?.familyContact?.relationship || 'Father';

  const vehicleName = booking ? `${booking.vehicleBrand} ${booking.vehicleName}` : (vehicle ? `${vehicle.brand} ${vehicle.name}` : 'Commercial Fleet Vehicle');
  const vehicleReg = booking?.vehicleRegistrationNumber || vehicle?.registrationNumber || 'REG-FLEET-990';
  const vehicleCat = vehicle?.category || 'Premium Category';
  const bookingCode = booking?.bookingCode || 'AGREE-TEMPLATE-2026';
  const pickupLoc = booking?.pickupLocation || 'AutoFleet Central Hub';
  const dropoffLoc = booking?.dropoffLocation || 'AutoFleet Return Depot';
  const pickupDate = booking?.pickupDate || 'Scheduled Pickup Date';
  const returnDate = booking?.returnDate || 'Scheduled Return Date';
  const rentalDays = booking?.rentalDays || 3;
  const agreementDate = booking?.createdAt ? new Date(booking.createdAt).toLocaleDateString() : new Date().toLocaleDateString();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-neutral-950/80 backdrop-blur-xs">
      <div 
        id="rental-agreement-card"
        className="relative bg-white rounded-2xl max-w-3xl w-full overflow-hidden shadow-2xl border border-neutral-200 my-6 animate-in fade-in zoom-in-95 duration-200 print:m-0 print:border-none print:shadow-none"
      >
        
        {/* Top Control Bar (Hidden when printing) */}
        <div className="px-6 py-3.5 bg-neutral-900 text-white flex items-center justify-between print:hidden">
          <div className="flex items-center gap-2">
            <FileCheck className="w-4 h-4 text-emerald-400" />
            <span className="text-xs font-bold uppercase tracking-wider">
              Legally Binding Master Rental Agreement (Owner & User)
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="px-3 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-semibold flex items-center gap-1.5 transition"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Save Contract PDF</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="w-7 h-7 rounded-full bg-neutral-800 hover:bg-neutral-700 text-neutral-300 flex items-center justify-center transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Printable Legal Agreement Document */}
        <div className="p-6 sm:p-10 space-y-6 text-neutral-900 font-sans text-xs">
          
          {/* Header */}
          <div className="text-center pb-6 border-b-2 border-neutral-900 space-y-1">
            <div className="flex items-center justify-center gap-2 mb-1">
              <div className="w-7 h-7 rounded-lg bg-neutral-900 text-white flex items-center justify-center">
                <Car className="w-4 h-4" />
              </div>
              <span className="font-black text-xl tracking-tight text-neutral-900">AUTOFLEET VEHICLE LOGISTICS</span>
            </div>
            <h2 className="text-base font-extrabold uppercase tracking-wide text-neutral-900">
              Master Self-Drive Vehicle Rental & Bailment Contract
            </h2>
            <p className="text-[11px] text-neutral-500">
              Contract Agreement Ref: <strong className="font-mono text-neutral-900">{bookingCode}</strong> • Signed Date: {agreementDate}
            </p>
          </div>

          {/* Parties Identification Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* The Owner (Lessor) */}
            <div className="p-4 rounded-xl bg-neutral-50 border border-neutral-200 space-y-2">
              <div className="flex items-center gap-2 font-bold text-neutral-900 border-b border-neutral-200 pb-1.5">
                <Building2 className="w-4 h-4 text-neutral-700" />
                <span>THE OWNER / LESSOR</span>
              </div>
              <div className="space-y-1 text-[11px] text-neutral-600">
                <p><strong>Entity Name:</strong> AutoFleet Vehicle Rental Services Ltd.</p>
                <p><strong>Corporate Identification:</strong> WT-CORP-RENT-2026-90X</p>
                <p><strong>Operating Station:</strong> {pickupLoc}</p>
                <p><strong>Official Support:</strong> legal@autofleet-logistics.com</p>
              </div>
            </div>

            {/* The User (Lessee / Renter) */}
            <div className="p-4 rounded-xl bg-neutral-50 border border-neutral-200 space-y-2">
              <div className="flex items-center justify-between border-b border-neutral-200 pb-1.5">
                <div className="flex items-center gap-2 font-bold text-neutral-900">
                  <User className="w-4 h-4 text-neutral-700" />
                  <span>THE USER / RENTER (LESSEE)</span>
                </div>
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100/70 px-1.5 py-0.5 rounded flex items-center gap-0.5">
                  <CheckCircle2 className="w-2.5 h-2.5" />
                  <span>e-KYC Verified</span>
                </span>
              </div>
              <div className="space-y-1 text-[11px] text-neutral-600">
                <p><strong>Primary Driver:</strong> <span className="font-semibold text-neutral-900">{renterName}</span> ({renterAge} yrs, {renterGender})</p>
                <p><strong>Driving License:</strong> <span className="font-mono font-bold text-neutral-900">{renterLicense}</span></p>
                <div className="grid grid-cols-2 gap-1 text-[10px] py-0.5">
                  <p><strong>PAN:</strong> <span className="font-mono text-neutral-800">{renterPan} ✓</span></p>
                  <p><strong>Aadhaar:</strong> <span className="font-mono text-neutral-800">{renterAadhaar} ✓</span></p>
                </div>
                <p><strong>Verified Contacts:</strong> {renterPhone} • {renterEmail}</p>
                <p><strong>Permanent Address:</strong> <span className="text-neutral-800">{renterAddress}</span></p>
                <p><strong>Family Emergency Contact:</strong> <span className="text-neutral-800">{familyName} ({familyRelation}) — {familyPhone}</span></p>
              </div>
            </div>

          </div>

          {/* Vehicle & Schedule Schedule Table */}
          <div className="p-4 rounded-xl bg-neutral-50 border border-neutral-200">
            <span className="font-bold text-neutral-900 block mb-2 uppercase text-[10px] tracking-wider">
              Schedule A: Vehicle Specifications & Bailment Period
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-[11px]">
              <div>
                <span className="text-neutral-400 block text-[10px]">VEHICLE</span>
                <strong className="text-neutral-900">{vehicleName}</strong>
              </div>
              <div>
                <span className="text-neutral-400 block text-[10px]">REGISTRATION #</span>
                <strong className="font-mono text-neutral-900">{vehicleReg}</strong>
              </div>
              <div>
                <span className="text-neutral-400 block text-[10px]">PICKUP DATE</span>
                <span className="text-neutral-800">{pickupDate}</span>
              </div>
              <div>
                <span className="text-neutral-400 block text-[10px]">SCHEDULED RETURN</span>
                <span className="text-neutral-800">{returnDate} ({rentalDays}d)</span>
              </div>
            </div>
          </div>

          {/* Key Legal Clauses */}
          <div className="space-y-3 text-[11px] text-neutral-700 leading-relaxed">
            <h3 className="font-black text-neutral-900 uppercase text-xs tracking-wider">
              Contract Terms & Operating Conditions
            </h3>

            <div className="space-y-2.5">
              <div>
                <strong className="text-neutral-900">1. Bailment & Ownership:</strong> The vehicle remains the sole, exclusive property of the Owner. This Agreement creates a temporary bailment for hire solely for the period specified. The Renter acquires no title, equity, or security interest.
              </div>

              <div>
                <strong className="text-neutral-900">2. Authorized Driver & License Warranty:</strong> The Renter warrants that they possess a valid, unexpired government driving license, are at least 21 years of age, and shall not permit any unauthorized third party to operate the vehicle.
              </div>

              <div>
                <strong className="text-neutral-900">3. Prohibited Uses:</strong> The Renter agrees NOT to: (a) operate the vehicle under the influence of alcohol, narcotics, or medications; (b) participate in racing, speed testing, or off-road navigation; (c) sublease or use the vehicle for illegal transit; (d) transport flammable or hazardous goods.
              </div>

              <div>
                <strong className="text-neutral-900">4. GPS Telemetry, Anti-Theft & Law Enforcement Consent:</strong> The Renter acknowledges that the vehicle is equipped with active 5G-IoT GPS tracking, speed sensors, and an emergency remote engine immobilizer. In the event of an unreturned vehicle, suspicion of theft, or violation of territorial boundaries, the Owner reserves the unconditional right to:
                <ul className="list-disc list-inside mt-1 pl-2 text-neutral-600">
                  <li>Remotely disable the vehicle's engine and engage central door locks.</li>
                  <li>Transmit the Renter's verified license, contact data, and real-time GPS coordinates directly to state highway police and FASTag toll interception databases.</li>
                </ul>
              </div>

              <div>
                <strong className="text-neutral-900">5. Return Policy & Late Penalty:</strong> The vehicle must be returned to the agreed drop-off hub ({dropoffLoc}) on or before {returnDate} in identical operating condition, subject only to ordinary wear. Late returns exceeding a 2-hour grace period will incur default hourly penalties.
              </div>

              <div>
                <strong className="text-neutral-900">6. Insurance & Damage Deductibles:</strong> The vehicle is covered by standard commercial liability insurance and Collision Damage Waiver (CDW). Any damages resulting from willful neglect, driving off-road, or breach of prohibited uses are the personal financial liability of the Renter.
              </div>
            </div>
          </div>

          {/* Signatures & Execution Section */}
          <div className="pt-6 border-t-2 border-neutral-900">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              
              {/* Renter Signature */}
              <div className="space-y-2">
                <span className="text-[10px] uppercase font-bold text-neutral-400 block tracking-wider">
                  Signed & Confirmed By Renter
                </span>
                <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-200 space-y-1">
                  <div className="font-serif italic text-base text-neutral-900 font-bold">
                    {renterName}
                  </div>
                  <div className="text-[10px] text-neutral-500 font-mono">
                    Digitally Authenticated via License #{renterLicense}
                  </div>
                  <div className="text-[10px] text-emerald-700 font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>Consent & KYC Verified on {agreementDate}</span>
                  </div>
                </div>
              </div>

              {/* Owner Authorized Signatory */}
              <div className="space-y-2">
                <span className="text-[10px] uppercase font-bold text-neutral-400 block tracking-wider">
                  Authorized Fleet Owner Signatory
                </span>
                <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-200 space-y-1">
                  <div className="font-serif italic text-base text-neutral-900 font-bold">
                    Marcus Vance, Fleet Director
                  </div>
                  <div className="text-[10px] text-neutral-500 font-mono">
                    AutoFleet Solutions Corporate Stamp #WT-99
                  </div>
                  <div className="text-[10px] text-emerald-700 font-bold flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3" />
                    <span>Official Counter-Signature & Vehicle Bailment Approved</span>
                  </div>
                </div>
              </div>

            </div>
          </div>

        </div>

        {/* Modal Bottom Action Bar (Hidden when printing) */}
        <div className="p-4 bg-neutral-50 border-t border-neutral-200 flex items-center justify-between print:hidden">
          <button
            type="button"
            onClick={handlePrint}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-neutral-900 hover:bg-neutral-800 text-white flex items-center gap-2 transition"
          >
            <Printer className="w-4 h-4" />
            <span>Print or Save Legal PDF</span>
          </button>

          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl text-xs font-bold text-neutral-700 bg-white border border-neutral-300 hover:bg-neutral-100 transition shadow-xs"
          >
            Close Agreement
          </button>
        </div>

      </div>
    </div>
  );
};
