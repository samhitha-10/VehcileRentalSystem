import React, { useState, useEffect, useRef } from 'react';
import { 
  Navigation, 
  ShieldAlert, 
  Lock, 
  Unlock, 
  Radio, 
  Compass, 
  Fuel, 
  BatteryCharging, 
  AlertTriangle, 
  FileText, 
  CheckCircle2, 
  Car, 
  RefreshCw, 
  Volume2, 
  VolumeX, 
  MapPin, 
  Check, 
  Copy, 
  Printer, 
  X,
  Clock,
  UserCheck,
  ShieldCheck,
  Zap,
  Gauge
} from 'lucide-react';
import { Vehicle, Booking } from '../types';
import { useUser } from '../context/UserContext';

interface LiveTrackerViewProps {
  vehicles: Vehicle[];
  bookings: Booking[];
  initialVehicleId?: string;
  initialBookingId?: string;
  onCloseModal?: () => void;
  isModal?: boolean;
}

export const LiveTrackerView: React.FC<LiveTrackerViewProps> = ({
  vehicles,
  bookings,
  initialVehicleId,
  initialBookingId,
  onCloseModal,
  isModal = false
}) => {
  const { place } = useUser();

  // Find target vehicle/booking
  const defaultBooking = initialBookingId 
    ? bookings.find(b => b.id === initialBookingId) 
    : bookings.find(b => b.status === 'Active' || b.status === 'Confirmed') || bookings[0];

  const defaultVehicle = initialVehicleId 
    ? vehicles.find(v => v.id === initialVehicleId) 
    : (defaultBooking ? vehicles.find(v => v.id === defaultBooking.vehicleId) : null) || vehicles[0];

  const [selectedVehicleId, setSelectedVehicleId] = useState<string>(defaultVehicle?.id || vehicles[0]?.id || '');
  const activeVehicle = vehicles.find(v => v.id === selectedVehicleId) || vehicles[0];
  const linkedBooking = bookings.find(b => b.vehicleId === selectedVehicleId && (b.status === 'Active' || b.status === 'Confirmed')) || bookings.find(b => b.vehicleId === selectedVehicleId);

  // Dynamic Telemetry State
  const [speed, setSpeed] = useState<number>(56);
  const [isEngineRunning, setIsEngineRunning] = useState<boolean>(true);
  const [isImmobilized, setIsImmobilized] = useState<boolean>(false);
  const [isAlarmActive, setIsAlarmActive] = useState<boolean>(false);
  const [isDoorsLocked, setIsDoorsLocked] = useState<boolean>(true);
  const [batteryFuelLevel, setBatteryFuelLevel] = useState<number>(76);
  const [odometer, setOdometer] = useState<number>(14820);
  const [satellites, setSatellites] = useState<number>(12);
  const [showTheftDossier, setShowTheftDossier] = useState<boolean>(false);
  const [copiedReport, setCopiedReport] = useState<boolean>(false);
  const [actionNotice, setActionNotice] = useState<string | null>(null);

  // Route animation progression (0 to 100%)
  const [routeProgress, setRouteProgress] = useState<number>(38);
  const [isLiveSimulating, setIsLiveSimulating] = useState<boolean>(true);

  // Simulated GPS Coordinates
  const baseLat = 12.9716;
  const baseLng = 77.5946;
  const currentLat = (baseLat + (routeProgress * 0.00085)).toFixed(5);
  const currentLng = (baseLng + (routeProgress * 0.0011)).toFixed(5);

  // Periodic Telemetry Fluctuations
  useEffect(() => {
    if (!isLiveSimulating || isImmobilized) {
      if (isImmobilized) setSpeed(0);
      return;
    }

    const interval = setInterval(() => {
      // Advance route
      setRouteProgress(prev => {
        const next = prev + 0.4;
        return next >= 95 ? 10 : next;
      });

      // Fluctuate speed slightly
      setSpeed(prev => {
        const delta = (Math.random() - 0.5) * 6;
        const target = Math.max(38, Math.min(84, prev + delta));
        return Math.round(target);
      });

      // Fluctuate satellites occasionally
      if (Math.random() > 0.8) {
        setSatellites(prev => Math.min(16, Math.max(9, prev + (Math.random() > 0.5 ? 1 : -1))));
      }
    }, 1200);

    return () => clearInterval(interval);
  }, [isLiveSimulating, isImmobilized]);

  // Notice helper
  const triggerNotice = (msg: string) => {
    setActionNotice(msg);
    setTimeout(() => setActionNotice(null), 4000);
  };

  // Remote Kill Switch / Engine Immobilizer
  const handleToggleImmobilizer = () => {
    if (isImmobilized) {
      setIsImmobilized(false);
      setIsEngineRunning(true);
      setSpeed(45);
      triggerNotice('Engine immobilizer disengaged via satellite command. Vehicle unlocked for ignition.');
    } else {
      setIsImmobilized(true);
      setIsEngineRunning(false);
      setSpeed(0);
      triggerNotice('🚨 Emergency Anti-Theft Kill Switch Activated! Fuel & powertrain cutoff signal transmitted via GPS satellite.');
    }
  };

  // Remote Alarm
  const handleToggleAlarm = () => {
    setIsAlarmActive(prev => !prev);
    triggerNotice(!isAlarmActive ? '📢 Vehicle Horn & Emergency Hazard Strobe Activated!' : 'Vehicle alarm deactivated.');
  };

  // Remote Doors
  const handleToggleDoors = () => {
    setIsDoorsLocked(prev => !prev);
    triggerNotice(!isDoorsLocked ? '🔒 Remote Central Locking Engaged on all 4 doors.' : '🔓 Remote Central Locking Disengaged.');
  };

  // Copy Police Report
  const handleCopyReport = () => {
    const reportText = `POLICE VEHICLE THEFT RECOVERY DOSSIER
---------------------------------------
Generated At: ${new Date().toLocaleString()}
Vehicle: ${activeVehicle.brand} ${activeVehicle.name} (${activeVehicle.modelYear})
Registration / License Plate: ${activeVehicle.registrationNumber}
Category / Fuel: ${activeVehicle.category} | ${activeVehicle.fuelType}
Color / Model: ${activeVehicle.description.slice(0, 45)}...

LAST KNOWN GPS TELEMETRY:
- Latitude: ${currentLat}° N
- Longitude: ${currentLng}° E
- Current Speed: ${speed} km/h
- Engine Immobilizer Status: ${isImmobilized ? 'ACTIVE (ENGINE CUT OFF)' : 'RUNNING'}
- GPS Lock: ${satellites} Satellites Active (RTK Precision)

VERIFIED RENTER DETAILS (FOR POLICE APPREHENSION):
- Driver Name: ${linkedBooking ? linkedBooking.customerName : 'Registered Fleet Driver'}
- Driving License Number: ${linkedBooking ? linkedBooking.drivingLicenseNumber : 'DL-VERIFIED-9912'}
- Phone Number: ${linkedBooking ? linkedBooking.customerPhone : '+1 (555) 019-2834'}
- Booking Reference: ${linkedBooking ? linkedBooking.bookingCode : 'BOOK-LIVE-REF'}
- Pickup Location: ${linkedBooking ? linkedBooking.pickupLocation : activeVehicle.location}
- Scheduled Dropoff: ${linkedBooking ? linkedBooking.dropoffLocation : 'City Central Hub'}

SECURITY STATUS:
- Highway Toll / FASTag ANPR Cameras: AUTO-FLAGGED FOR INTERCEPTION
- Digital Contract Status: Breach of trust / Stolen vehicle investigation active.`;

    navigator.clipboard.writeText(reportText);
    setCopiedReport(true);
    setTimeout(() => setCopiedReport(false), 3000);
  };

  return (
    <div className={`space-y-6 ${isModal ? 'p-6 max-h-[90vh] overflow-y-auto' : ''}`}>
      
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-neutral-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              LIVE TELEMETRY ACTIVE
            </span>
            <span className="text-xs text-neutral-400 font-mono">
              GPS 5G-IoT • {satellites} SATS
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-neutral-900 flex items-center gap-2">
            <Navigation className="w-6 h-6 text-emerald-600" />
            Live GPS Tracker & Anti-Theft System
          </h1>
          <p className="text-xs text-neutral-500 mt-0.5">
            Real-time geospatial satellite tracking, live engine telemetry, and remote law-enforcement theft recovery.
          </p>
        </div>

        {/* Vehicle Switcher */}
        <div className="flex items-center gap-2">
          {isModal && onCloseModal && (
            <button
              onClick={onCloseModal}
              className="p-2 text-neutral-400 hover:text-neutral-700 rounded-lg hover:bg-neutral-100 transition"
              title="Close Tracker"
            >
              <X className="w-5 h-5" />
            </button>
          )}

          <div className="flex items-center gap-2">
            <label className="text-xs font-semibold text-neutral-600 hidden sm:inline">Select Fleet Vehicle:</label>
            <select
              value={selectedVehicleId}
              onChange={(e) => setSelectedVehicleId(e.target.value)}
              className="text-xs font-bold bg-neutral-100 border border-neutral-200 rounded-xl px-3 py-2 text-neutral-900 focus:outline-none focus:ring-2 focus:ring-neutral-900"
            >
              {vehicles.map(v => (
                <option key={v.id} value={v.id}>
                  {v.brand} {v.name} ({v.registrationNumber})
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Action Notice Alert */}
      {actionNotice && (
        <div className="bg-neutral-900 text-white px-4 py-3 rounded-xl text-xs font-medium flex items-center justify-between shadow-lg animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center gap-2">
            <Radio className="w-4 h-4 text-emerald-400 animate-pulse shrink-0" />
            <span>{actionNotice}</span>
          </div>
          <button onClick={() => setActionNotice(null)} className="text-neutral-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Main Grid: Map & Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left 8 Cols: Interactive GPS Simulated Map Canvas */}
        <div className="lg:col-span-8 space-y-4">
          <div className="bg-neutral-950 text-white rounded-2xl border border-neutral-800 p-5 shadow-sm relative overflow-hidden">
            
            {/* Map Top Bar */}
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-neutral-800 text-xs">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="font-mono text-neutral-300">
                  LAT: {currentLat}°N | LNG: {currentLng}°E
                </span>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-[11px] text-neutral-400">
                  Elevation: <strong>920m</strong>
                </span>
                <span className="text-[11px] text-neutral-400">
                  Heading: <strong>48° NE</strong>
                </span>
                <button
                  type="button"
                  onClick={() => setIsLiveSimulating(!isLiveSimulating)}
                  className="px-2 py-1 bg-neutral-800 hover:bg-neutral-700 rounded text-[10px] font-mono uppercase transition"
                >
                  {isLiveSimulating ? 'Pause Sim' : 'Resume Sim'}
                </button>
              </div>
            </div>

            {/* Map Simulation Graphic Area */}
            <div className="relative h-72 sm:h-96 w-full rounded-xl bg-neutral-900 border border-neutral-800 overflow-hidden flex items-center justify-center select-none">
              
              {/* Map Grid Pattern */}
              <div 
                className="absolute inset-0 opacity-20"
                style={{
                  backgroundImage: `
                    linear-gradient(to right, #404040 1px, transparent 1px),
                    linear-gradient(to bottom, #404040 1px, transparent 1px)
                  `,
                  backgroundSize: '40px 40px'
                }}
              />

              {/* Highway / Road vectors */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none" xmlns="http://www.w3.org/2000/svg">
                {/* Background Roads */}
                <path d="M 0 100 Q 200 150, 400 120 T 800 240" stroke="#333333" strokeWidth="12" fill="none" />
                <path d="M 120 0 Q 180 200, 350 280 T 700 380" stroke="#262626" strokeWidth="8" fill="none" />
                <path d="M 300 0 L 300 400" stroke="#262626" strokeWidth="6" fill="none" strokeDasharray="6 6" />
                <path d="M 0 300 L 900 300" stroke="#262626" strokeWidth="6" fill="none" strokeDasharray="6 6" />

                {/* Active Planned Route */}
                <path 
                  id="active-route-path"
                  d="M 60 260 C 180 280, 240 140, 480 180 S 720 100, 840 80" 
                  stroke="#10b981" 
                  strokeWidth="5" 
                  fill="none" 
                  strokeDasharray="8 4"
                />

                {/* Completed Route portion */}
                <path 
                  d="M 60 260 C 180 280, 240 140, 480 180 S 720 100, 840 80" 
                  stroke="#3b82f6" 
                  strokeWidth="5" 
                  fill="none" 
                  strokeDasharray="400"
                  strokeDashoffset={400 - (routeProgress * 4)}
                />
              </svg>

              {/* Start Pin: Pickup Hub */}
              <div className="absolute left-8 bottom-12 flex flex-col items-center">
                <div className="px-2 py-0.5 rounded bg-neutral-800 text-[10px] font-mono text-neutral-300 border border-neutral-700 shadow-md mb-1 whitespace-nowrap">
                  Pickup Hub ({linkedBooking?.pickupLocation || 'Central Depot'})
                </div>
                <div className="w-4 h-4 rounded-full bg-emerald-500 border-2 border-white shadow-lg" />
              </div>

              {/* Destination Pin: Return Hub */}
              <div className="absolute right-8 top-12 flex flex-col items-center">
                <div className="px-2 py-0.5 rounded bg-neutral-800 text-[10px] font-mono text-neutral-300 border border-neutral-700 shadow-md mb-1 whitespace-nowrap">
                  Dropoff ({linkedBooking?.dropoffLocation || 'Airport Hub'})
                </div>
                <div className="w-4 h-4 rounded-full bg-sky-500 border-2 border-white shadow-lg" />
              </div>

              {/* Moving Vehicle GPS Marker */}
              <div 
                className="absolute transition-all duration-700 flex flex-col items-center z-20"
                style={{
                  left: `${Math.min(84, Math.max(12, routeProgress))}%`,
                  top: `${Math.max(22, Math.min(68, 55 - (routeProgress * 0.35)))}%`
                }}
              >
                {/* Vehicle Tooltip Label */}
                <div className="px-2.5 py-1 rounded-lg bg-emerald-950 text-emerald-300 border border-emerald-500 text-[11px] font-bold shadow-xl flex items-center gap-1.5 whitespace-nowrap mb-1">
                  <Car className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{activeVehicle.name} • {speed} km/h</span>
                </div>

                {/* Radar Ripple Effect */}
                <div className="relative flex items-center justify-center">
                  <div className="w-10 h-10 rounded-full bg-emerald-500/20 animate-ping absolute" />
                  <div className="w-7 h-7 rounded-full bg-emerald-500/40 animate-pulse absolute" />
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center border-2 border-white shadow-xl ${isImmobilized ? 'bg-red-600' : 'bg-emerald-500'}`}>
                    <Navigation className="w-3 h-3 text-white transform rotate-45" />
                  </div>
                </div>
              </div>

              {/* Bottom Overlay Info Card */}
              <div className="absolute bottom-3 left-3 right-3 bg-neutral-950/90 backdrop-blur-md p-3 rounded-xl border border-neutral-800 flex flex-wrap items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-3">
                  <img 
                    src={activeVehicle.imageUrl} 
                    alt={activeVehicle.name} 
                    className="w-12 h-9 rounded-md object-cover border border-neutral-700 shrink-0" 
                  />
                  <div>
                    <div className="font-extrabold text-white flex items-center gap-2">
                      <span>{activeVehicle.brand} {activeVehicle.name}</span>
                      <span className="font-mono text-[10px] px-1.5 py-0.2 bg-neutral-800 rounded text-neutral-300 border border-neutral-700">
                        {activeVehicle.registrationNumber}
                      </span>
                    </div>
                    <div className="text-[11px] text-neutral-400">
                      Rented to: <strong>{linkedBooking?.customerName || 'Verified Fleet Customer'}</strong>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div>
                    <span className="text-[10px] text-neutral-400 block">Est. Return In</span>
                    <span className="font-bold text-sky-400">42 mins (18.4 km)</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-neutral-400 block">Engine State</span>
                    <span className={`font-bold ${isImmobilized ? 'text-red-400' : 'text-emerald-400'}`}>
                      {isImmobilized ? 'IMMOBILIZED' : 'Active (Road)'}
                    </span>
                  </div>
                </div>
              </div>

            </div>

            {/* Telemetry Sensor Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
              <div className="p-3 bg-neutral-900 rounded-xl border border-neutral-800 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-neutral-400 uppercase tracking-wider block">Live Speed</span>
                  <span className="text-xl font-black text-white">{speed} <span className="text-xs font-normal text-neutral-400">km/h</span></span>
                </div>
                <Gauge className="w-5 h-5 text-emerald-400" />
              </div>

              <div className="p-3 bg-neutral-900 rounded-xl border border-neutral-800 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-neutral-400 uppercase tracking-wider block">
                    {activeVehicle.fuelType === 'Electric' ? 'Battery' : 'Fuel'} Level
                  </span>
                  <span className="text-xl font-black text-white">{batteryFuelLevel}%</span>
                </div>
                {activeVehicle.fuelType === 'Electric' ? (
                  <BatteryCharging className="w-5 h-5 text-sky-400" />
                ) : (
                  <Fuel className="w-5 h-5 text-amber-400" />
                )}
              </div>

              <div className="p-3 bg-neutral-900 rounded-xl border border-neutral-800 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-neutral-400 uppercase tracking-wider block">Odometer</span>
                  <span className="text-base font-black text-white font-mono">{odometer} km</span>
                </div>
                <Compass className="w-5 h-5 text-indigo-400" />
              </div>

              <div className="p-3 bg-neutral-900 rounded-xl border border-neutral-800 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-neutral-400 uppercase tracking-wider block">Tire Pressure</span>
                  <span className="text-base font-black text-emerald-400">34 PSI <span className="text-xs text-neutral-400">All OK</span></span>
                </div>
                <Zap className="w-5 h-5 text-emerald-400" />
              </div>
            </div>

          </div>
        </div>

        {/* Right 4 Cols: Anti-Theft Security Controls & Recovery Actions */}
        <div className="lg:col-span-4 space-y-4">
          
          {/* Box 1: Remote Hardware Control */}
          <div className="bg-white p-5 rounded-2xl border border-neutral-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
              <h3 className="font-extrabold text-sm text-neutral-900 flex items-center gap-1.5">
                <ShieldAlert className="w-4 h-4 text-neutral-900" />
                Anti-Theft Remote Controls
              </h3>
              <span className="text-[10px] uppercase font-bold text-neutral-500 bg-neutral-100 px-2 py-0.5 rounded">
                IoT Satellite
              </span>
            </div>

            {/* Remote Engine Immobilizer */}
            <div className={`p-4 rounded-xl border transition ${
              isImmobilized 
                ? 'bg-red-50 border-red-300 text-red-900' 
                : 'bg-neutral-50 border-neutral-200 text-neutral-800'
            }`}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold uppercase tracking-wide">
                  Remote Engine Cutoff (Kill Switch)
                </span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  isImmobilized ? 'bg-red-600 text-white' : 'bg-emerald-600 text-white'
                }`}>
                  {isImmobilized ? 'IMMOBILIZED' : 'ENABLED'}
                </span>
              </div>
              <p className="text-xs text-neutral-500 mb-3">
                Instantly cut fuel injection or EV high-voltage contactors to prevent unauthorized movement if the car is stolen or overdue.
              </p>
              <button
                type="button"
                onClick={handleToggleImmobilizer}
                className={`w-full py-2.5 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition shadow-xs ${
                  isImmobilized
                    ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                    : 'bg-red-600 hover:bg-red-700 text-white'
                }`}
              >
                <Zap className="w-4 h-4" />
                <span>{isImmobilized ? 'Disengage Cutoff (Enable Engine)' : 'Activate Emergency Engine Cutoff'}</span>
              </button>
            </div>

            {/* Secondary Controls: Doors & Alarm */}
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={handleToggleDoors}
                className={`p-3 rounded-xl border text-xs font-bold flex flex-col items-center gap-1.5 transition ${
                  isDoorsLocked 
                    ? 'bg-neutral-900 text-white border-neutral-900' 
                    : 'bg-neutral-100 text-neutral-700 border-neutral-200 hover:bg-neutral-200'
                }`}
              >
                {isDoorsLocked ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
                <span>{isDoorsLocked ? 'Doors Locked' : 'Doors Unlocked'}</span>
              </button>

              <button
                type="button"
                onClick={handleToggleAlarm}
                className={`p-3 rounded-xl border text-xs font-bold flex flex-col items-center gap-1.5 transition ${
                  isAlarmActive 
                    ? 'bg-amber-600 text-white border-amber-600 animate-bounce' 
                    : 'bg-neutral-100 text-neutral-700 border-neutral-200 hover:bg-neutral-200'
                }`}
              >
                {isAlarmActive ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                <span>{isAlarmActive ? 'Alarm Blaring!' : 'Sound Siren'}</span>
              </button>
            </div>
          </div>

          {/* Box 2: Law Enforcement & Police Recovery Dossier */}
          <div className="bg-white p-5 rounded-2xl border border-neutral-200 shadow-xs space-y-3">
            <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
              <h3 className="font-extrabold text-sm text-neutral-900 flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-neutral-900" />
                Theft Recovery & Police FIR
              </h3>
              <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
                Verified KYC
              </span>
            </div>

            <p className="text-xs text-neutral-600">
              When a vehicle is overdue or reported stolen, generate the official <strong>Police Interception Packet</strong> linking the verified driver's identity, driving license number, and real-time highway toll cameras.
            </p>

            <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-200 text-xs space-y-1 font-mono">
              <div className="text-neutral-500">Driver: <strong className="text-neutral-900">{linkedBooking?.customerName || 'Verified Customer'}</strong></div>
              <div className="text-neutral-500">License: <strong className="text-neutral-900">{linkedBooking?.drivingLicenseNumber || 'DL-88219-90'}</strong></div>
              <div className="text-neutral-500">Plate: <strong className="text-neutral-900">{activeVehicle.registrationNumber}</strong></div>
              <div className="text-neutral-500">Highway Toll Status: <span className="text-emerald-700 font-bold">Auto-Flagged (FASTag)</span></div>
            </div>

            <button
              type="button"
              onClick={() => setShowTheftDossier(true)}
              className="w-full py-2.5 px-3 rounded-xl text-xs font-bold bg-neutral-900 hover:bg-neutral-800 text-white flex items-center justify-center gap-2 transition"
            >
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Open Police Theft Recovery Dossier</span>
            </button>
          </div>

        </div>

      </div>

      {/* MODAL: Police Recovery Dossier Document */}
      {showTheftDossier && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-neutral-200 shadow-2xl animate-in zoom-in-95">
            
            {/* Modal Header */}
            <div className="p-5 border-b border-neutral-200 flex items-center justify-between bg-neutral-900 text-white rounded-t-2xl">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-red-600 text-white">
                  <ShieldAlert className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-base">Law Enforcement Vehicle Recovery Dossier</h3>
                  <p className="text-xs text-neutral-400">Official incident report & verified renter identification for police recovery</p>
                </div>
              </div>
              <button 
                onClick={() => setShowTheftDossier(false)}
                className="text-neutral-400 hover:text-white p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Document Body */}
            <div className="p-6 space-y-5 text-neutral-800 text-xs">
              
              {/* Document Stamp / Status */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-red-50 border border-red-200 text-red-900">
                <div className="flex items-center gap-2 font-bold">
                  <AlertTriangle className="w-4 h-4 text-red-600" />
                  <span>INCIDENT CLASSIFICATION: VEHICLE THEFT / CRIMINAL BREACH OF TRUST</span>
                </div>
                <span className="font-mono text-[11px] font-bold">CASE REF #FIR-{Math.floor(100000 + Math.random() * 900000)}</span>
              </div>

              {/* Section 1: Verified Renter Identity (Why User Verification gets the vehicle back!) */}
              <div>
                <h4 className="font-black text-neutral-900 uppercase tracking-wider mb-2 flex items-center gap-1.5 text-xs">
                  <UserCheck className="w-4 h-4 text-indigo-600" />
                  1. Verified Renter Legal Identity
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-3 bg-neutral-50 rounded-xl border border-neutral-200">
                  <div>
                    <span className="text-[10px] text-neutral-400 block uppercase">Full Legal Name</span>
                    <strong className="text-neutral-900">{linkedBooking?.customerName || 'Verified Primary Driver'}</strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-neutral-400 block uppercase">Driver License #</span>
                    <strong className="text-neutral-900 font-mono">{linkedBooking?.drivingLicenseNumber || 'DL-2024-9182390'}</strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-neutral-400 block uppercase">Verified Phone</span>
                    <strong className="text-neutral-900">{linkedBooking?.customerPhone || '+1 (555) 019-2834'}</strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-neutral-400 block uppercase">Registered Email</span>
                    <strong className="text-neutral-900">{linkedBooking?.customerEmail || 'driver@rental-client.com'}</strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-neutral-400 block uppercase">Booking Reference</span>
                    <strong className="text-neutral-900 font-mono">{linkedBooking?.bookingCode || 'BOOK-AF-902'}</strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-neutral-400 block uppercase">Signed Agreement</span>
                    <strong className="text-emerald-700">Digital KYC Signature on Record</strong>
                  </div>
                </div>
              </div>

              {/* Section 2: Vehicle Telemetry & Live Location */}
              <div>
                <h4 className="font-black text-neutral-900 uppercase tracking-wider mb-2 flex items-center gap-1.5 text-xs">
                  <Navigation className="w-4 h-4 text-emerald-600" />
                  2. Live Satellite GPS Position & Vehicle Specs
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3 bg-neutral-50 rounded-xl border border-neutral-200">
                  <div>
                    <span className="text-[10px] text-neutral-400 block uppercase">License Plate</span>
                    <strong className="text-neutral-900 font-mono">{activeVehicle.registrationNumber}</strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-neutral-400 block uppercase">Make / Model</span>
                    <strong className="text-neutral-900">{activeVehicle.brand} {activeVehicle.name}</strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-neutral-400 block uppercase">Exact Coordinates</span>
                    <strong className="text-neutral-900 font-mono">{currentLat}° N, {currentLng}° E</strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-neutral-400 block uppercase">Engine Immobilizer</span>
                    <strong className={isImmobilized ? 'text-red-700 font-bold' : 'text-amber-700'}>
                      {isImmobilized ? 'ACTIVATED (SHUTDOWN)' : 'STANDBY'}
                    </strong>
                  </div>
                </div>
              </div>

              {/* Section 3: Recovery Protocol */}
              <div className="p-4 rounded-xl bg-neutral-900 text-neutral-300 space-y-2">
                <div className="text-white font-bold flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  Immediate Recovery Actions Transmitted
                </div>
                <ul className="list-disc list-inside space-y-1 text-[11px] text-neutral-400">
                  <li>Automated ANPR Notice sent to all State & National Highway Toll Plazas.</li>
                  <li>Official FIR lodged with Traffic Police and Cyber Crime Vehicle Theft Division.</li>
                  <li>Insurance Theft Waiver Claim initiated (Policy #CDW-THEFT-2024).</li>
                  <li>Remote satellite lock engaged on central door solenoids.</li>
                </ul>
              </div>

            </div>

            {/* Modal Footer Actions */}
            <div className="p-4 border-t border-neutral-200 bg-neutral-50 flex items-center justify-between rounded-b-2xl">
              <button
                type="button"
                onClick={handleCopyReport}
                className="px-3.5 py-2 rounded-xl text-xs font-bold bg-neutral-200 hover:bg-neutral-300 text-neutral-800 flex items-center gap-1.5 transition"
              >
                {copiedReport ? <Check className="w-4 h-4 text-emerald-700" /> : <Copy className="w-4 h-4" />}
                <span>{copiedReport ? 'Copied to Clipboard!' : 'Copy Official Dossier Text'}</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="px-3.5 py-2 rounded-xl text-xs font-bold bg-neutral-900 hover:bg-neutral-800 text-white flex items-center gap-1.5 transition"
                >
                  <Printer className="w-4 h-4" />
                  <span>Print Police FIR Packet</span>
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
