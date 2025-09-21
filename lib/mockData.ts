import type {
  Claim,
  AIDecision,
  ServiceProvider,
  ClaimTimeline,
  Notification,
  ServiceDispatch,
  CoverageDecision,
  DecisionAuditEntry
} from '@/types'

// Customer Policies Database
export interface CustomerPolicy {
  policyNumber: string
  customerName: string
  phone: string
  email: string
  planType: 'Basic' | 'Premium' | 'Premium Plus'
  effectiveDate: Date
  expirationDate: Date
  deductible: number
  coverageLimit: number
  services: {
    towing: boolean
    batteryJump: boolean
    lockout: boolean
    fuelDelivery: boolean
    tireChange: boolean
    winchOut: boolean
  }
  monthlyLimits: {
    towing: number
    batteryJump: number
    lockout: number
    fuelDelivery: number
    tireChange: number
  }
  usageThisMonth: {
    towing: number
    batteryJump: number
    lockout: number
    fuelDelivery: number
    tireChange: number
  }
}

export const mockPolicies: CustomerPolicy[] = [
  {
    policyNumber: 'POL-ABC123456',
    customerName: 'John Smith',
    phone: '(555) 123-4567',
    email: 'john.smith@email.com',
    planType: 'Premium Plus',
    effectiveDate: new Date('2024-01-01'),
    expirationDate: new Date('2024-12-31'),
    deductible: 25,
    coverageLimit: 200,
    services: {
      towing: true,
      batteryJump: true,
      lockout: true,
      fuelDelivery: true,
      tireChange: true,
      winchOut: true
    },
    monthlyLimits: {
      towing: 2,
      batteryJump: 4,
      lockout: 3,
      fuelDelivery: 2,
      tireChange: 3
    },
    usageThisMonth: {
      towing: 0,
      batteryJump: 1,
      lockout: 0,
      fuelDelivery: 0,
      tireChange: 0
    }
  },
  {
    policyNumber: 'POL-XYZ789012',
    customerName: 'Sarah Johnson',
    phone: '(555) 987-6543',
    email: 'sarah.johnson@email.com',
    planType: 'Premium',
    effectiveDate: new Date('2024-01-01'),
    expirationDate: new Date('2024-12-31'),
    deductible: 50,
    coverageLimit: 150,
    services: {
      towing: true,
      batteryJump: true,
      lockout: true,
      fuelDelivery: true,
      tireChange: true,
      winchOut: false
    },
    monthlyLimits: {
      towing: 1,
      batteryJump: 3,
      lockout: 2,
      fuelDelivery: 1,
      tireChange: 2
    },
    usageThisMonth: {
      towing: 0,
      batteryJump: 3,
      lockout: 1,
      fuelDelivery: 0,
      tireChange: 0
    }
  },
  {
    policyNumber: 'POL-DEF456789',
    customerName: 'Mike Davis',
    phone: '(555) 456-7890',
    email: 'mike.davis@email.com',
    planType: 'Basic',
    effectiveDate: new Date('2024-01-01'),
    expirationDate: new Date('2024-12-31'),
    deductible: 75,
    coverageLimit: 100,
    services: {
      towing: true,
      batteryJump: true,
      lockout: false,
      fuelDelivery: false,
      tireChange: true,
      winchOut: false
    },
    monthlyLimits: {
      towing: 1,
      batteryJump: 2,
      lockout: 0,
      fuelDelivery: 0,
      tireChange: 1
    },
    usageThisMonth: {
      towing: 1,
      batteryJump: 0,
      lockout: 0,
      fuelDelivery: 0,
      tireChange: 0
    }
  }
]

// Service Providers Database
export const mockServiceProviders: ServiceProvider[] = [
  {
    id: 'SP-001',
    name: 'QuickFix Towing',
    type: 'towing',
    rating: 4.8,
    estimatedArrival: 15,
    distance: 2.1,
    cost: 85
  },
  {
    id: 'SP-002',
    name: 'Reliable Roadside',
    type: 'towing',
    rating: 4.6,
    estimatedArrival: 25,
    distance: 4.3,
    cost: 75
  },
  {
    id: 'SP-003',
    name: 'Auto Rescue Pro',
    type: 'mechanic',
    rating: 4.9,
    estimatedArrival: 20,
    distance: 3.1,
    cost: 95
  },
  {
    id: 'SP-004',
    name: 'Emergency Lock Service',
    type: 'locksmith',
    rating: 4.7,
    estimatedArrival: 18,
    distance: 2.8,
    cost: 60
  },
  {
    id: 'SP-005',
    name: 'FastFuel Delivery',
    type: 'fuel-delivery',
    rating: 4.5,
    estimatedArrival: 12,
    distance: 1.5,
    cost: 45
  }
]

// Demo Conversation Scenarios
export interface DemoScenario {
  id: string
  title: string
  description: string
  customerProfile: {
    name: string
    policy: string
    phone: string
  }
  scenario: {
    location: string
    vehicle: string
    issue: string
    urgency: 'low' | 'medium' | 'high' | 'urgent'
  }
  expectedOutcome: 'approved' | 'denied' | 'requires-review'
  sampleUserInputs: string[]
  aiResponses: string[]
}

export const demoScenarios: DemoScenario[] = [
  {
    id: 'demo-flat-tire',
    title: 'Flat Tire - Standard Scenario',
    description: 'Customer with Premium Plus plan needs tire change assistance',
    customerProfile: {
      name: 'John Smith',
      policy: 'POL-ABC123456',
      phone: '(555) 123-4567'
    },
    scenario: {
      location: '123 Main St, Springfield, IL 62701',
      vehicle: '2020 Blue Toyota Camry, License: ABC123',
      issue: 'Flat tire - front left tire is completely flat',
      urgency: 'medium'
    },
    expectedOutcome: 'approved',
    sampleUserInputs: [
      "Hi, my name is John Smith and I have a flat tire on Main Street",
      "My policy number is ABC123456",
      "I'm at 123 Main Street in Springfield Illinois",
      "I drive a 2020 blue Toyota Camry, license plate ABC123",
      "My front left tire is completely flat and I need help changing it",
      "Yes, that's all correct"
    ],
    aiResponses: [
      "Hello John! I'm sorry to hear about your flat tire. I'll help you get roadside assistance right away. Can you provide your policy number?",
      "Perfect! I found your Premium Plus policy. Now, can you tell me your exact location?",
      "Got it, 123 Main Street in Springfield. What vehicle are you driving today?",
      "Thank you. Now, can you describe the specific issue with your vehicle?",
      "I understand - a flat front left tire. Let me process this claim for you.",
      "Great! Your claim has been approved. QuickFix Towing is being dispatched and will arrive in approximately 15 minutes."
    ]
  },
  {
    id: 'demo-battery-limit',
    title: 'Battery Jump - Service Limit Exceeded',
    description: 'Customer has exceeded monthly battery jump limit',
    customerProfile: {
      name: 'Sarah Johnson',
      policy: 'POL-XYZ789012',
      phone: '(555) 987-6543'
    },
    scenario: {
      location: '456 Oak Ave, Springfield, IL 62702',
      vehicle: '2019 Red Honda Civic, License: XYZ789',
      issue: 'Dead battery - car won\'t start',
      urgency: 'high'
    },
    expectedOutcome: 'requires-review',
    sampleUserInputs: [
      "Hello, this is Sarah Johnson and my car won't start",
      "My policy is XYZ789012",
      "I'm at 456 Oak Avenue in Springfield",
      "2019 red Honda Civic, license XYZ789",
      "The battery is completely dead, I need a jump start",
      "Yes, please review it"
    ],
    aiResponses: [
      "Hi Sarah! I'll help you with your car trouble. Can you provide your policy number?",
      "I see your Premium policy. What's your current location?",
      "Thank you. What vehicle are you driving?",
      "And what's the specific issue you're experiencing?",
      "I see you need a battery jump. However, I notice you've already used 3 battery jump services this month, which meets your plan limit. This request will need agent review for approval.",
      "An agent will review your case shortly. In the meantime, I'm putting you in priority queue given the urgency."
    ]
  },
  {
    id: 'demo-no-coverage',
    title: 'Lockout - Service Not Covered',
    description: 'Customer with Basic plan requesting uncovered service',
    customerProfile: {
      name: 'Mike Davis',
      policy: 'POL-DEF456789',
      phone: '(555) 456-7890'
    },
    scenario: {
      location: '789 Pine St, Springfield, IL 62703',
      vehicle: '2018 White Ford F-150, License: DEF456',
      issue: 'Locked out of vehicle with keys inside',
      urgency: 'medium'
    },
    expectedOutcome: 'denied',
    sampleUserInputs: [
      "Hi, I'm Mike Davis and I'm locked out of my truck",
      "Policy DEF456789",
      "789 Pine Street, Springfield Illinois",
      "2018 white Ford F-150, license DEF456",
      "I locked my keys inside and can't get in",
      "Oh, I understand"
    ],
    aiResponses: [
      "Hello Mike! I'll help you with your lockout situation. What's your policy number?",
      "I found your Basic plan policy. Where are you located?",
      "Got it. What vehicle are you locked out of?",
      "What's the specific situation you're dealing with?",
      "I understand the frustration of being locked out. Unfortunately, your Basic plan doesn't include lockout services. However, I can provide you with contact information for local locksmith services, or you can upgrade your plan for future coverage.",
      "I'm sending you contact information for reputable local locksmiths. Would you like me to also provide information about upgrading your coverage?"
    ]
  }
]

// Quick Demo Functions
export function getRandomScenario(): DemoScenario {
  return demoScenarios[Math.floor(Math.random() * demoScenarios.length)]
}

export function getScenarioById(id: string): DemoScenario | undefined {
  return demoScenarios.find(scenario => scenario.id === id)
}

export function getPolicyByNumber(policyNumber: string): CustomerPolicy | undefined {
  return mockPolicies.find(policy => policy.policyNumber === policyNumber)
}

export function getServiceProvidersByType(type: ServiceProvider['type']): ServiceProvider[] {
  return mockServiceProviders.filter(provider => provider.type === type)
}

// Historical Claims for Dashboard (add this missing export)
export const mockHistoricalClaims: Claim[] = [
  {
    id: 'CLM-2024-001',
    customerId: 'CUST-001',
    customerName: 'John Smith',
    customerPhone: '(555) 123-4567',
    vehicleInfo: {
      make: 'Toyota',
      model: 'Camry',
      year: 2020,
      color: 'Blue',
      licensePlate: 'ABC123'
    },
    location: {
      address: '123 Main St',
      city: 'Springfield',
      state: 'IL',
      zipCode: '62701'
    },
    issueType: 'flat-tire',
    description: 'Front left tire is flat, need roadside assistance',
    status: 'in-progress',
    priority: 'medium',
    createdAt: new Date(Date.now() - 45 * 60 * 1000),
    updatedAt: new Date(Date.now() - 10 * 60 * 1000),
    assignedAgentId: 'AGENT-001',
    estimatedArrival: new Date(Date.now() + 8 * 60 * 1000)
  },
  {
    id: 'CLM-2024-002',
    customerId: 'CUST-002',
    customerName: 'Sarah Johnson',
    customerPhone: '(555) 987-6543',
    vehicleInfo: {
      make: 'Honda',
      model: 'Civic',
      year: 2019,
      color: 'Red',
      licensePlate: 'XYZ789'
    },
    location: {
      address: '456 Oak Ave',
      city: 'Springfield',
      state: 'IL',
      zipCode: '62702'
    },
    issueType: 'dead-battery',
    description: 'Car won\'t start, battery appears to be dead',
    status: 'pending',
    priority: 'high',
    createdAt: new Date(Date.now() - 120 * 60 * 1000),
    updatedAt: new Date(Date.now() - 90 * 60 * 1000)
  },
  {
    id: 'CLM-2024-003',
    customerId: 'CUST-003',
    customerName: 'Mike Davis',
    customerPhone: '(555) 456-7890',
    vehicleInfo: {
      make: 'Ford',
      model: 'F-150',
      year: 2018,
      color: 'White',
      licensePlate: 'DEF456'
    },
    location: {
      address: '789 Pine St',
      city: 'Springfield',
      state: 'IL',
      zipCode: '62703'
    },
    issueType: 'lockout',
    description: 'Locked keys inside vehicle',
    status: 'cancelled',
    priority: 'medium',
    createdAt: new Date(Date.now() - 180 * 60 * 1000),
    updatedAt: new Date(Date.now() - 150 * 60 * 1000)
  },
  {
    id: 'CLM-2024-004',
    customerId: 'CUST-004',
    customerName: 'Emily Chen',
    customerPhone: '(555) 321-9876',
    vehicleInfo: {
      make: 'Tesla',
      model: 'Model 3',
      year: 2021,
      color: 'Black',
      licensePlate: 'GHI789'
    },
    location: {
      address: '321 Elm St',
      city: 'Springfield',
      state: 'IL',
      zipCode: '62704'
    },
    issueType: 'towing',
    description: 'Vehicle won\'t start, needs towing to service center',
    status: 'completed',
    priority: 'high',
    createdAt: new Date(Date.now() - 240 * 60 * 1000),
    updatedAt: new Date(Date.now() - 60 * 60 * 1000)
  },
  {
    id: 'CLM-2024-005',
    customerId: 'CUST-005',
    customerName: 'Robert Wilson',
    customerPhone: '(555) 654-3210',
    vehicleInfo: {
      make: 'BMW',
      model: 'X3',
      year: 2022,
      color: 'Silver',
      licensePlate: 'JKL012'
    },
    location: {
      address: '654 Maple Ave',
      city: 'Springfield',
      state: 'IL',
      zipCode: '62705'
    },
    issueType: 'fuel-delivery',
    description: 'Ran out of gas on highway',
    status: 'completed',
    priority: 'medium',
    createdAt: new Date(Date.now() - 300 * 60 * 1000),
    updatedAt: new Date(Date.now() - 270 * 60 * 1000)
  }
]

// Transform CustomerPolicy to PolicyInfo format
function transformToPolicy(customerPolicy: CustomerPolicy): import('@/types/api').PolicyInfo {
  return {
    policyNumber: customerPolicy.policyNumber,
    customerName: customerPolicy.customerName,
    status: 'active' as const,
    roadsideAssistance: {
      included: customerPolicy.planType !== 'Basic',
      maxCalls: customerPolicy.planType === 'Premium Plus' ? 6 : customerPolicy.planType === 'Premium' ? 4 : 2,
      usedCalls: Object.values(customerPolicy.usageThisMonth).reduce((sum, usage) => sum + usage, 0),
      maxTowDistance: customerPolicy.planType === 'Premium Plus' ? 100 : customerPolicy.planType === 'Premium' ? 50 : 25,
      coverageTypes: Object.entries(customerPolicy.services)
        .filter(([_, enabled]) => enabled)
        .map(([service, _]) => service)
    },
    deductible: customerPolicy.deductible,
    expirationDate: customerPolicy.expirationDate
  }
}

// Transform mockServiceProviders to match ServiceProvider interface
function transformToServiceProvider(provider: ServiceProvider): import('@/types/api').ServiceProvider {
  return {
    id: provider.id,
    name: provider.name,
    type: provider.type === 'towing' ? 'towing' : 'roadside',
    phone: '(555) 123-4567', // Mock phone number
    location: {
      address: '123 Service St',
      city: 'Springfield',
      state: 'IL',
      coordinates: { lat: 39.7817, lng: -89.6501 }
    },
    rating: provider.rating,
    availableServices: provider.type === 'towing' ? ['towing', 'winchOut'] :
                      provider.type === 'mechanic' ? ['batteryJump', 'tireChange'] :
                      provider.type === 'locksmith' ? ['lockout'] :
                      provider.type === 'fuel-delivery' ? ['fuelDelivery'] :
                      ['batteryJump', 'tireChange', 'lockout'],
    estimatedResponseTime: provider.estimatedArrival
  }
}

// Create policy lookup by policyNumber
const policiesLookup: { [policyNumber: string]: import('@/types/api').PolicyInfo } = {}
mockPolicies.forEach(policy => {
  policiesLookup[policy.policyNumber] = transformToPolicy(policy)
})

// Create transformed service providers
const transformedServiceProviders = mockServiceProviders.map(transformToServiceProvider)

// Legacy exports for backward compatibility
export const mockDatabase: import('@/types/api').MockDatabase = {
  policies: policiesLookup,
  claims: {},
  serviceProviders: transformedServiceProviders
}

export const serviceTypeMapping: Record<string, string> = {
  'flat-tire': 'tireChange',
  'dead-battery': 'batteryJump',
  'lockout': 'lockout',
  'towing': 'towing',
  'fuel-delivery': 'fuelDelivery'
}

export const coverageFactors = {
  planTypes: {
    'Basic': 0.6,
    'Premium': 0.8,
    'Premium Plus': 0.95
  },
  serviceTypes: {
    'towing': 0.9,
    'batteryJump': 0.85,
    'lockout': 0.8,
    'fuelDelivery': 0.75,
    'tireChange': 0.9
  },
  baseCosts: {
    'towing': 75,
    'batteryJump': 45,
    'lockout': 60,
    'fuelDelivery': 35,
    'tireChange': 50,
    'roadside-repair': 100
  },
  urgencyMultiplier: {
    'low': 1.0,
    'medium': 1.1,
    'high': 1.25,
    'urgent': 1.5
  },
  timeOfDayMultiplier: {
    'day': 1.0,
    'evening': 1.1,
    'night': 1.3,
    'weekend': 1.2
  }
}