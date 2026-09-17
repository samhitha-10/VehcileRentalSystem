import React, { useState, useEffect } from 'react';
import { 
  AlertOctagon, 
  PhoneCall, 
  ShieldAlert, 
  MapPin, 
  Navigation, 
  CheckCircle2, 
  Clock, 
  X, 
  Ambulance, 
  ShieldCheck, 
  Radio, 
  User, 
  Building2, 
  Volume2, 
  VolumeX,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import { CrashIncident } from '../types/crash';
import { Vehicle, Booking } from '../types';

interface CrashSOSModalProps {
  isOpen: boolean;
  incident: CrashIncident | null;
  vehicle: Vehicle | null;
  booking?: Booking | null;
  onClose: () => void;
  onUpdateStatus?: (status: CrashIncident['status']) => void;
  userRole?: 'renter' | 'owner' | 'both';
}

export const CrashSOSModal: React.FC<CrashSOSModalProps> = ({
  isOpen,
  incident,
  vehicle,
  booking,
  onClose,
  onUpdateStatus,
  userRole = 'both'
}) => {
  const [countdown, setCountdown] = useState<number>(10);
  const [autoDialActive, setAutoDialActive] = useState<boolean>(true);
  const [isCalling, setIsCalling] = useState<boolean>(false);
  const [activeCallTarget, setActiveCallTarget] = useState<string | null>(null);
  const [soundMuted, setSoundMuted] = useState<boolean>(false);
  const [notifiedFleetOwner, setNotifiedFleetOwner] = useState<boolean>(true);
  const [dispatchStatus, setDispatchStatus] = useState<CrashIncident['status']>(incident?.status || 'SOS Alert Active');

  // Countdown timer for automatic emergency dialing
  useEffect(() => {
    if (!isOpen || !autoDialActive || isCalling) return;

    if (countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(prev => prev - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (countdown === 0 && autoDialActive && !isCalling) {
      handleDialNumber('112', 'Emergency Highway EMS & Police (112)');
    }
  }, [isOpen, countdown, autoDialActive, isCalling]);

  if (!isOpen || !incident || !vehicle) return null;

  const handleDialNumber = (number: string, label: string) => {
    setIsCalling(true);
    setActiveCallTarget(`${label} (${number})`);
    setAutoDialActive(false);

    // Update dispatch status
    if (dispatchStatus === 'SOS Alert Active') {
      const nextStatus = 'Dispatched';
      setDispatchStatus(nextStatus);
      if (onUpdateStatus) onUpdateStatus(nextStatus);
    }
  };

  const handleEndCall = () => {
    setIsCalling(false);
    setActiveCallTarget(null);
  };

  const handleCancelAutoDial = () => {
    setAutoDialActive(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
      <div 
        id="crash-emergency-modal"
        className="bg-white rounded-3xl max-w-2xl w-full border-2 border-red-500 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 my-4"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Pulsing Red Emergency Header */}
        <div className="bg-red-600 text-white p-4 sm:p-5 relative overflow-hidden">
          <div className="absolute -right-10 -bottom-10 opacity-15 pointer-events-none">
            <AlertOctagon className="w-56 h-56" />
          </div>

          <div className="flex items-start justify-between relative z-10">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-white text-red-600 flex items-center justify-center shadow-lg shrink-0 animate-pulse">
                <AlertOctagon className="w-7 h-7" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-black/30 text-white border border-white/20">
                    High G-Force Impact Detected
                  </span>
                  <span className="w-2.5 h-2.5 rounded-full bg-white animate-ping" />
                </div>
                <h2 className="text-xl sm:text-2xl font-black tracking-tight mt-0.5">
                  CRASH DETECTED &bull; LIVE SOS TRACKER
                </h2>
                <p className="text-xs text-red-100 font-medium">
                  Autonomous crash sensors triggered at {new Date(incident.timestamp).toLocaleTimeString()}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setSoundMuted(!soundMuted)}
                className="p-2 rounded-xl bg-red-700/60 hover:bg-red-700 text-white text-xs transition"
                title={soundMuted ? 'Unmute siren' : 'Mute siren'}
              >
                {soundMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </button>
              <button
                type="button"
                onClick={onClose}
                className="p-2 rounded-xl bg-red-700/60 hover:bg-red-700 text-white text-xs transition"
                title="Dismiss"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Real-time Status Badge Banner */}
          <div className="mt-3.5 pt-3 border-t border-red-500/80 flex flex-wrap items-center justify-between gap-2 text-xs relative z-10">
            <div className="flex items-center gap-2">
              <span className="font-bold text-white">TELEMETRY IMPACT:</span>
              <span className="font-mono bg-black/40 px-2 py-0.5 rounded text-amber-200 font-bold">
                {incident.impactGForce} G-FORCE
              </span>
              <span className="font-mono bg-black/40 px-2 py-0.5 rounded text-white font-bold">
                {incident.speedAtImpactKmH} KM/H IMPACT
              </span>
              {incident.airbagsDeployed && (
                <span className="bg-amber-400 text-neutral-950 font-black px-2 py-0.5 rounded text-[10px]">
                  AIRBAGS DEPLOYED
                </span>
              )}
            </div>

            <div className="flex items-center gap-1.5 text-xs font-semibold bg-white/20 px-2.5 py-0.5 rounded-full">
              <Radio className="w-3 h-3 animate-pulse text-amber-300" />
              <span>Owner &amp; Control Room Notified</span>
            </div>
          </div>
        </div>

        {/* Modal Content */}
        <div className="p-5 sm:p-6 space-y-5 text-neutral-800">
          
          {/* Active Call In Progress Screen */}
          {isCalling ? (
            <div className="p-4 sm:p-5 rounded-2xl bg-emerald-950 text-white border border-emerald-700 space-y-3 shadow-inner text-center animate-in fade-in">
              <div className="w-14 h-14 rounded-full bg-emerald-500 text-white mx-auto flex items-center justify-center animate-bounce shadow-lg">
                <PhoneCall className="w-7 h-7" />
              </div>
              <div>
                <span className="text-[11px] uppercase tracking-wider text-emerald-300 font-bold block">
                  EMERGENCY CALL CONNECTED &bull; LIVE GPS DISPATCH
                </span>
                <h3 className="text-lg font-black text-white mt-0.5">
                  {activeCallTarget}
                </h3>
                <p className="text-xs text-emerald-200 mt-1 max-w-md mx-auto">
                  Vehicle GPS coordinates ({incident.latitude}&deg;N, {incident.longitude}&deg;E) and driver medical identity transmitted directly to dispatch terminal.
                </p>
              </div>

              <div className="pt-2 flex justify-center gap-3">
                <button
                  type="button"
                  onClick={handleEndCall}
                  className="px-5 py-2 rounded-xl text-xs font-bold bg-red-600 hover:bg-red-700 text-white transition flex items-center gap-2 shadow-md"
                >
                  <X className="w-4 h-4" />
                  <span>End Emergency Call</span>
                </button>
              </div>
            </div>
          ) : autoDialActive && (
            /* Auto-Dial Countdown Notification */
            <div className="p-4 rounded-2xl bg-amber-50 border-2 border-amber-300 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-amber-500 text-white flex items-center justify-center font-black text-base shrink-0 animate-pulse">
                  {countdown}s
                </div>
                <div>
                  <h4 className="text-xs font-black text-amber-950 uppercase tracking-wide">
                    Autonomous SOS Dispatch Countdown
                  </h4>
                  <p className="text-[11px] text-amber-800">
                    Automatically connecting to National Highway Emergency Services (112) unless cancelled.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={handleCancelAutoDial}
                className="px-3 py-1.5 rounded-xl text-xs font-bold bg-white text-neutral-800 border border-neutral-300 hover:bg-neutral-100 transition shrink-0"
              >
                I am Safe &bull; Cancel
              </button>
            </div>
          )}

          {/* Section 1: Immediate Emergency One-Click Dial Buttons */}
          <div>
            <h3 className="text-xs font-black uppercase tracking-wider text-neutral-500 mb-2 flex items-center justify-between">
              <span>Immediate Emergency Responder Hotline</span>
              <span className="text-[11px] font-semibold text-emerald-600 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> 24/7 Dedicated Line
              </span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              
              {/* Dial 112 / 911 / EMS */}
              <button
                type="button"
                id="btn-call-emergency-ems"
                onClick={() => handleDialNumber('112', 'National Emergency & Ambulance (112)')}
                className="p-3 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-bold text-left transition shadow-md flex items-center justify-between group"
              >
                <div>
                  <span className="text-[10px] text-red-200 block uppercase">Ambulance &amp; Trauma</span>
                  <span className="text-sm font-black flex items-center gap-1.5">
                    <Ambulance className="w-4 h-4" /> Call 112 / EMS
                  </span>
                </div>
                <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center group-hover:scale-110 transition">
                  <PhoneCall className="w-4 h-4 text-white" />
                </div>
              </button>

              {/* Call Vehicle Owner / Fleet Dispatch */}
              <button
                type="button"
                id="btn-call-vehicle-owner"
                onClick={() => handleDialNumber('+91 99887 76655', 'AutoFleet Vehicle Owner & Control Hub')}
                className="p-3 rounded-2xl bg-neutral-900 hover:bg-neutral-800 text-white font-bold text-left transition shadow-md flex items-center justify-between group"
              >
                <div>
                  <span className="text-[10px] text-neutral-400 block uppercase">Fleet Owner &amp; Roadside</span>
                  <span className="text-sm font-black flex items-center gap-1.5">
                    <Building2 className="w-4 h-4 text-amber-400" /> Call Owner Hub
                  </span>
                </div>
                <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center group-hover:scale-110 transition">
                  <PhoneCall className="w-4 h-4 text-white" />
                </div>
              </button>

              {/* Call Verified Family Contact */}
              <button
                type="button"
                id="btn-call-family-emergency"
                onClick={() => handleDialNumber(
                  incident.emergencyContactPhone || '+91 94401 98765', 
                  `Family Contact (${incident.emergencyContactName || 'Family'})`
                )}
                className="p-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-left transition shadow-md flex items-center justify-between group"
              >
                <div>
                  <span className="text-[10px] text-indigo-200 block uppercase">Family Emergency</span>
                  <span className="text-sm font-black flex items-center gap-1.5 truncate max-w-[130px]">
                    <User className="w-4 h-4 text-indigo-200" /> 
                    {incident.emergencyContactRelation || 'Next of Kin'}
                  </span>
                </div>
                <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center group-hover:scale-110 transition">
                  <PhoneCall className="w-4 h-4 text-white" />
                </div>
              </button>

            </div>
          </div>

          {/* Section 2: Precise Live Location & Tracker Coordinates */}
          <div className="p-4 rounded-2xl bg-neutral-900 text-white space-y-3">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-2.5">
              <div className="flex items-center gap-2">
                <Navigation className="w-4 h-4 text-emerald-400" />
                <span className="text-xs font-bold uppercase tracking-wider text-neutral-300">
                  Exact Crash Coordinates Transmitted to Owner &amp; EMS
                </span>
              </div>
              <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800">
                GPS Precision &plusmn; 2m
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-[10px] text-neutral-400 block uppercase">Crash Location</span>
                <p className="font-semibold text-white mt-0.5 flex items-start gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-red-400 shrink-0 mt-0.5" />
                  <span>{incident.locationAddress}</span>
                </p>
              </div>

              <div>
                <span className="text-[10px] text-neutral-400 block uppercase">Geospatial Coordinates</span>
                <p className="font-mono text-emerald-300 font-bold mt-0.5">
                  LAT: {incident.latitude}&deg; N &bull; LNG: {incident.longitude}&deg; E
                </p>
                <div className="mt-1 flex items-center gap-2">
                  <a
                    href={`https://maps.google.com/?q=${incident.latitude},${incident.longitude}`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-[11px] text-sky-400 hover:text-sky-300 underline font-medium"
                  >
                    <span>Open in Google Maps Navigation</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: Dual Stakeholder Status: Owner & Renter Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            
            {/* Vehicle & Owner Info */}
            <div className="p-3.5 rounded-2xl bg-neutral-50 border border-neutral-200 text-xs space-y-1.5">
              <div className="flex items-center justify-between border-b border-neutral-200 pb-1.5">
                <span className="font-black text-neutral-900 flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5 text-neutral-600" />
                  Fleet Owner Dispatch Notification
                </span>
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200">
                  {notifiedFleetOwner ? 'Alert Delivered' : 'Transmitting...'}
                </span>
              </div>
              <p><strong>Fleet Asset:</strong> {vehicle.brand} {vehicle.name} ({vehicle.modelYear})</p>
              <p><strong>License Plate:</strong> <span className="font-mono font-bold text-neutral-900">{vehicle.registrationNumber}</span></p>
              <p><strong>Owner Control Hotline:</strong> +91 99887 76655</p>
              <p><strong>Emergency Tow Truck:</strong> Dispatched from closest hub ({vehicle.location})</p>
            </div>

            {/* Driver & Legal KYC Info */}
            <div className="p-3.5 rounded-2xl bg-neutral-50 border border-neutral-200 text-xs space-y-1.5">
              <div className="flex items-center justify-between border-b border-neutral-200 pb-1.5">
                <span className="font-black text-neutral-900 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-neutral-600" />
                  Driver &amp; Emergency Contact
                </span>
                <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 px-1.5 py-0.2 rounded border border-indigo-200">
                  KYC On Record
                </span>
              </div>
              <p><strong>Driver:</strong> <span className="font-semibold">{incident.driverName}</span></p>
              <p><strong>Driver Phone:</strong> {incident.driverPhone}</p>
              <p>
                <strong>Emergency Kin:</strong> {incident.emergencyContactName} ({incident.emergencyContactRelation}) &bull; {incident.emergencyContactPhone}
              </p>
              <p><strong>Insurance Coverage:</strong> {booking?.insurancePlan ? `${booking.insurancePlan.toUpperCase()} Comprehensive Policy` : 'Premium CDW + Passenger Personal Accident'}</p>
            </div>

          </div>

          {/* Section 4: Dispatch Pipeline Tracker Steps */}
          <div className="p-3.5 bg-neutral-50 rounded-2xl border border-neutral-200">
            <span className="text-[10px] font-black uppercase tracking-wider text-neutral-500 block mb-2">
              Autonomous Crash Incident Response Pipeline
            </span>

            <div className="grid grid-cols-4 gap-2 text-center text-[10px]">
              <div className="p-2 rounded-xl bg-emerald-100 text-emerald-900 border border-emerald-300 font-bold">
                <span className="block font-black text-xs">1. Detected</span>
                <span>G-Sensor Trigger</span>
              </div>

              <div className={`p-2 rounded-xl border font-bold ${
                dispatchStatus !== 'SOS Alert Active'
                  ? 'bg-emerald-100 text-emerald-900 border-emerald-300'
                  : 'bg-amber-100 text-amber-900 border-amber-300 animate-pulse'
              }`}>
                <span className="block font-black text-xs">2. Owner Notified</span>
                <span>Satellite Alert</span>
              </div>

              <div className={`p-2 rounded-xl border font-bold ${
                dispatchStatus === 'Dispatched' || dispatchStatus === 'Assistance On Site' || dispatchStatus === 'Resolved'
                  ? 'bg-emerald-100 text-emerald-900 border-emerald-300'
                  : 'bg-neutral-100 text-neutral-500 border-neutral-200'
              }`}>
                <span className="block font-black text-xs">3. EMS In Route</span>
                <span>Ambulance Dispatched</span>
              </div>

              <div className={`p-2 rounded-xl border font-bold ${
                dispatchStatus === 'Resolved'
                  ? 'bg-emerald-100 text-emerald-900 border-emerald-300'
                  : 'bg-neutral-100 text-neutral-500 border-neutral-200'
              }`}>
                <span className="block font-black text-xs">4. Secured</span>
                <span>Safe Recovery</span>
              </div>
            </div>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-neutral-100 border-t border-neutral-200 flex flex-wrap items-center justify-between gap-3">
          <div className="text-[11px] text-neutral-500 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Insurance Claim #ACC-{incident.id.slice(-6).toUpperCase()} automatically initiated with telemetry logs.</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-neutral-900 hover:bg-neutral-800 text-white transition shadow-xs"
            >
              Continue to Live Tracker View
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
