import { PolicyInfo, ServiceProvider, MockDatabase } from '@/types/api'

// Mock Policy Database
export const mockPolicies: { [policyNumber: string]: PolicyInfo } = {
  'POL123456': {
    policyNumber: 'POL123456',
    customerName: 'John Smith',
    status: 'active',
    roadsideAssistance: {
      included: true,
      maxCalls: 4,
      usedCalls: 1,
      maxTowDistance: 100,
      coverageTypes: ['towing', 'battery-jump', 'tire-change', 'lockout', 'fuel-delivery']
    },
    deductible: 0,
    expirationDate: new Date('2025-12-31')
  },
  'POL789012': {
    policyNumber: 'POL789012',
    customerName: 'Sarah Johnson',
    status: 'active',
    roadsideAssistance: {
      included: true,
      maxCalls: 6,
      usedCalls: 0,
      maxTowDistance: 150,
      coverageTypes: ['towing', 'battery-jump', 'tire-change', 'lockout', 'fuel-delivery', 'roadside-repair']
    },
    deductible: 50,
    expirationDate: new Date('2025-06-30')
  },
  'POL345678': {
    policyNumber: 'POL345678',
    customerName: 'Mike Davis',
    status: 'active',
    roadsideAssistance: {
      included: false,
      maxCalls: 0,
      usedCalls: 0,
      maxTowDistance: 0,
      coverageTypes: []
    },
    deductible: 100,
    expirationDate: new Date('2025-03-15')
  }
}

// Mock Service Providers
export const mockServiceProviders: ServiceProvider[] = [
  {
    id: 'SP001',
    name: 'QuickTow Springfield',
    type: 'towing',
    phone: '(555) TOW-TRUCK',
    location: {
      address: '123 Industrial Blvd',
      city: 'Springfield',
      state: 'IL',
      coordinates: { lat: 39.7817, lng: -89.6501 }
    },
    rating: 4.8,
    availableServices: ['towing', 'tire-change', 'battery-jump', 'lockout'],
    estimatedResponseTime: 25
  },
  {
    id: 'SP002',
    name: 'RoadHelper Mobile Repair',
    type: 'roadside',
    phone: '(555) ROAD-FIX',
    location: {
      address: '456 Service St',
      city: 'Springfield',
      state: 'IL',
      coordinates: { lat: 39.7956, lng: -89.6444 }
    },
    rating: 4.9,
    availableServices: ['roadside-repair', 'battery-jump', 'tire-change', 'fuel-delivery'],
    estimatedResponseTime: 20
  },
  {
    id: 'SP003',
    name: 'Emergency Auto Services',
    type: 'roadside',
    phone: '(555) EMERGENCY',
    location: {
      address: '789 Highway Dr',
      city: 'Springfield',
      state: 'IL',
      coordinates: { lat: 39.7665, lng: -89.6532 }
    },
    rating: 4.6,
    availableServices: ['lockout', 'battery-jump', 'fuel-delivery', 'tire-change'],
    estimatedResponseTime: 30
  },
  {
    id: 'SP004',
    name: 'Metro Towing & Recovery',
    type: 'towing',
    phone: '(555) METRO-TOW',
    location: {
      address: '321 Commerce Ave',
      city: 'Springfield',
      state: 'IL',
      coordinates: { lat: 39.8014, lng: -89.6438 }
    },
    rating: 4.7,
    availableServices: ['towing', 'roadside-repair', 'tire-change'],
    estimatedResponseTime: 35
  }
]

// Service type mapping for dispatch decisions
export const serviceTypeMapping: { [key: string]: string } = {
  'flat-tire': 'tire-change',
  'dead-battery': 'battery-jump',
  'lockout': 'lockout',
  'towing': 'towing',
  'fuel-delivery': 'fuel-delivery',
  'engine-trouble': 'roadside-repair',
  'accident': 'towing',
  'other': 'roadside-repair'
}

// Coverage decision factors
export const coverageFactors = {
  urgencyMultiplier: {
    'low': 1.0,
    'medium': 1.2,
    'high': 1.5,
    'urgent': 2.0
  },
  baseCosts: {
    'towing': 125,
    'roadside-repair': 85,
    'battery-jump': 65,
    'tire-change': 75,
    'lockout': 55,
    'fuel-delivery': 45
  },
  timeOfDayMultiplier: {
    'business': 1.0,    // 8 AM - 6 PM
    'evening': 1.3,     // 6 PM - 10 PM
    'night': 1.6,       // 10 PM - 6 AM
    'weekend': 1.2      // Saturday/Sunday
  }
}

// Initialize mock database
export const mockDatabase: MockDatabase = {
  policies: mockPolicies,
  serviceProviders: mockServiceProviders,
  claims: {}
}