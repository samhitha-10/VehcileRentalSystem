export interface CrashIncident {
  id: string;
  vehicleId: string;
  bookingId?: string;
  timestamp: string; // ISO string
  severity: 'Minor' | 'Moderate' | 'Severe' | 'Critical';
  impactGForce: number; // e.g. 8.4 G
  airbagsDeployed: boolean;
  speedAtImpactKmH: number;
  latitude: string;
  longitude: string;
  locationAddress: string;
  driverName: string;
  driverPhone: string;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  emergencyContactRelation?: string;
  status: 'SOS Alert Active' | 'Dispatched' | 'Assistance On Site' | 'Resolved';
  sosCallInitiated: boolean;
  sosCallNumber: string;
  notifiedOwner: boolean;
  notifiedPolice: boolean;
  notifiedAmbulance: boolean;
  ownerNotifiedAt?: string;
}
