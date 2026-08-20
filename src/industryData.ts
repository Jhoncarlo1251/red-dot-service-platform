import { IndustryType, ProductItem, WorkflowRule } from './types';

export interface LocationNode {
  id: string;
  name: string;
  x: number;
  y: number;
  description: string;
  type: 'Queue' | 'Consultation' | 'Billing' | 'Forms' | 'Attendance' | 'Classroom' | 'Inventory' | 'Service' | 'Security' | 'Warehouse' | 'Laboratory' | 'Device';
}

export interface ScenarioDef {
  label: string;
  id: string;
  description: string;
  portalView: 'QUEUE' | 'FORM' | 'MENU' | 'ATTENDANCE' | 'MAP';
  clientName: string;
  clientServiceType?: string;
  clientPriority: 'LOW' | 'MEDIUM' | 'HIGH' | 'EMERGENCY';
  formAnswers?: Record<string, string>;
  attendanceData?: { studentId: string; name: string; gradeSection: string };
  orderItems?: Record<string, number>;
}

export interface IndustryConfig {
  id: IndustryType;
  name: string;
  label: string;
  welcomeText: string;
  icon: string;
  locations: LocationNode[];
  catalog: ProductItem[];
  formFields: {
    id: string;
    label: string;
    type: 'text' | 'number' | 'select' | 'textarea';
    required: boolean;
    placeholder?: string;
    options?: string[];
  }[];
  workflows: WorkflowRule[];
  samplePrompts: string[];
  scenarios: ScenarioDef[];
}

export const INDUSTRY_DATA: Record<IndustryType, IndustryConfig> = {
  RESTAURANT: {
    id: 'RESTAURANT',
    name: 'RESTAURANT',
    label: 'Restaurant & Dining',
    welcomeText: 'Experience fast-tracked table service, contactless ordering, and real-time kitchen queues.',
    icon: 'Utensils',
    locations: [
      { id: 'r-kiosk', name: 'Front Greeting Host', x: 20, y: 80, description: 'Order ticket scan & wait-list', type: 'Queue' },
      { id: 'r-pickup', name: 'Meal Pick-up Window', x: 45, y: 25, description: 'Kitchen food dispatch station', type: 'Billing' },
      { id: 'r-table1', name: 'Dine-In Area Alpha', x: 15, y: 35, description: 'Table seats 1-8 (Local Ordering)', type: 'Consultation' },
      { id: 'r-table2', name: 'Dine-In Area Beta', x: 75, y: 25, description: 'Table seats 9-16 (Local Ordering)', type: 'Consultation' },
      { id: 'r-bar', name: 'Beverage & Brew Island', x: 50, y: 75, description: 'Draft juices, iced tea & beers', type: 'Billing' },
      { id: 'r-wash', name: 'Comfort & Washrooms', x: 80, y: 85, description: 'Sanitary facilities', type: 'Queue' }
    ],
    catalog: [
      { id: 'p-1', name: 'Premium Pork Sisig', price: 280, category: 'Main Course', stock: 45 },
      { id: 'p-2', name: 'Smoked Crispy Bagnet', price: 350, category: 'Main Course', stock: 30 },
      { id: 'p-3', name: 'Barangay Express Beef Caldereta', price: 290, category: 'Main Course', stock: 25 },
      { id: 'p-4', name: 'Premium House Brewed Iced Tea', price: 80, category: 'Beverage', stock: 120 },
      { id: 'p-5', name: 'Halo-Halo Supreme', price: 150, category: 'Dessert', stock: 60 }
    ],
    formFields: [
      { id: 'rf-1', label: 'Customer Name', type: 'text', required: true, placeholder: 'e.g. Althea Ramos' },
      { id: 'rf-2', label: 'Dine-in or Take-out', type: 'select', required: true, options: ['Dine-In Table', 'Take-Away', 'Curbside Pick-up'] },
      { id: 'rf-3', label: 'Allergies & Requests', type: 'textarea', required: false, placeholder: 'None, extra spicy, etc.' }
    ],
    workflows: [
      { id: 'rw-1', trigger: 'QR Scan Table', condition: 'True', action: 'Open Digital Restaurant Menu', isActive: true },
      { id: 'rw-2', trigger: 'Order Sent to Kitchen', condition: 'Payment Confirmed', action: 'Route receipt to prep desk, deduct stock', isActive: true }
    ],
    samplePrompts: [
      'Order pagkain: Sisig with extra rice and an iced tea',
      'Pila sa table 4 check-in',
      'Register new walk-in dining group of 3'
    ],
    scenarios: [
      {
        id: 'scenario-rest-1',
        label: '🍔 Restaurant Lunch Rush',
        description: 'Simulate high volume kitchen orders for Dine-in Table 12.',
        portalView: 'MENU',
        clientName: 'Table 12 - Balcony',
        clientPriority: 'LOW',
        orderItems: { 'p-1': 2, 'p-4': 3 }
      }
    ]
  },
  HOSPITAL: {
    id: 'HOSPITAL',
    name: 'HOSPITAL',
    label: 'Healthcare & Hospital',
    welcomeText: 'Seamless emergency triage, medical queues, on-site consultation desk allocations, and e-pharmacy routing.',
    icon: 'HeartPulse',
    locations: [
      { id: 'h-kiosk', name: 'Front Ticket Kiosk', x: 20, y: 80, description: 'Queue ticket & QR check-in point', type: 'Queue' },
      { id: 'h-er', name: 'Emergency ER Admissions', x: 45, y: 25, description: 'Acute trauma & medical triage', type: 'Consultation' },
      { id: 'h-peds', name: 'Pediatrics Department', x: 15, y: 35, description: 'Child care & vaccines', type: 'Consultation' },
      { id: 'h-cardio', name: 'Cardiology Center', x: 75, y: 25, description: 'Heart specialist & diagnostics', type: 'Consultation' },
      { id: 'h-pharm', name: 'Outpatient Pharmacy', x: 80, y: 75, description: 'Medication pickup counters', type: 'Billing' },
      { id: 'h-billing', name: 'Finance & Discharge Desk', x: 50, y: 85, description: 'Payment processing & clearance', type: 'Billing' }
    ],
    catalog: [
      { id: 'h-1', name: 'General Doctor Checkup', price: 500, category: 'Consultation', stock: 100 },
      { id: 'h-2', name: 'Pediatric Vaccine Dose', price: 600, category: 'Pediatrics', stock: 50 },
      { id: 'h-3', name: 'ECG Cardiology Screening', price: 1200, category: 'Cardiology', stock: 20 },
      { id: 'h-4', name: 'Full Blood Panel Lab Analysis', price: 1800, category: 'Diagnostics', stock: 99 },
      { id: 'h-5', name: 'Emergency Asthma Nebulizer Care', price: 450, category: 'ER Care', stock: 30 }
    ],
    formFields: [
      { id: 'hf-1', label: 'Patient Name', type: 'text', required: true, placeholder: 'e.g. Althea Ramos' },
      { id: 'hf-2', label: 'Patient Age', type: 'number', required: true, placeholder: 'e.g. 28' },
      { id: 'hf-3', label: 'Emergency Contact', type: 'text', required: true, placeholder: 'e.g. 0917-123-4567' },
      { id: 'hf-4', label: 'Symptoms / Chief Complaint', type: 'textarea', required: true, placeholder: 'Describe pain or ailment...' }
    ],
    workflows: [
      { id: 'hw-1', trigger: 'Emergency Form Checkin', condition: 'Priority = EMERGENCY', action: 'Elevate Queue Ticket, Alert Nurse Staff', isActive: true },
      { id: 'hw-2', trigger: 'Triage Completed', condition: 'Assessed', action: 'Route patient coordinates to dedicated diagnostic desk', isActive: true }
    ],
    samplePrompts: [
      'Register doctor checkup for Althea Ramos',
      'Pila sa Emergency ward queue ticket',
      'Open the medical clearance forms'
    ],
    scenarios: [
      {
        id: 'scenario-hosp-1',
        label: '🚨 ER Emergency Trauma Intake',
        description: 'Ambulance arrival requiring top-priority ER routing.',
        portalView: 'QUEUE',
        clientName: 'Gabriel Hernandez',
        clientServiceType: 'Trauma ER Intake',
        clientPriority: 'EMERGENCY'
      }
    ]
  },
  SCHOOL: {
    id: 'SCHOOL',
    name: 'SCHOOL',
    label: 'School & Academy',
    welcomeText: 'Self-serve student attendance check-ins, campus desk permits, and quick-payment tuition registers.',
    icon: 'GraduationCap',
    locations: [
      { id: 's-gate', name: 'Main Gate Scanner', x: 20, y: 80, description: 'Classroom access check-in point', type: 'Attendance' },
      { id: 's-office', name: 'Principal & Administration', x: 45, y: 25, description: 'School records & certifications', type: 'Forms' },
      { id: 's-einstein', name: 'Einstein Lecture Hall', x: 15, y: 35, description: 'Grade 12 Science classroom', type: 'Classroom' },
      { id: 's-tesla', name: 'Tesla Laboratories', x: 75, y: 25, description: 'Physics & mechanics workshop', type: 'Classroom' },
      { id: 's-library', name: 'Main Reference Library', x: 50, y: 75, description: 'Self-study & book logs', type: 'Forms' },
      { id: 's-gym', name: 'Gymnasium & Lockers', x: 80, y: 85, description: 'Physical training facility', type: 'Classroom' }
    ],
    catalog: [
      { id: 's-1', name: 'PTA Annual Community Membership', price: 300, category: 'Fees', stock: 500 },
      { id: 's-2', name: 'Science Lab Materials Kit', price: 1500, category: 'Books & Supplies', stock: 40 },
      { id: 's-3', name: 'Official School Uniform (S-XL)', price: 850, category: 'Apparel', stock: 150 },
      { id: 's-4', name: 'Library Card Clearance Certificate', price: 100, category: 'Admin Fee', stock: 999 }
    ],
    formFields: [
      { id: 'sf-1', label: 'Student Full Name', type: 'text', required: true, placeholder: 'e.g. Jhon Carlo' },
      { id: 'sf-2', label: 'Student ID Number', type: 'text', required: true, placeholder: 'e.g. STUD-2026-9821' },
      { id: 'sf-3', label: 'Grade & Section', type: 'select', required: true, options: ['Grade 12 - Einstein', 'Grade 11 - Newton', 'Grade 10 - Galileo'] },
      { id: 'sf-4', label: 'Enrollment Course Option', type: 'select', required: true, options: ['STEM Academic Track', 'ABM Business Track', 'HUMSS Liberal Arts'] }
    ],
    workflows: [
      { id: 'sw-1', trigger: 'Class QR Code Scan', condition: 'Valid Student ID', action: 'Log Classroom Attendance, Sync Grade Log', isActive: true },
      { id: 'sw-2', trigger: 'Tuition Settled', condition: 'Cleared', action: 'Unblock registration systems, dispatch portal access key', isActive: true }
    ],
    samplePrompts: [
      'Scan my student QR card STUD-2026-8801',
      'Submit new late record student David Cruz Grade 11',
      'Open class assignment LMS page'
    ],
    scenarios: [
      {
        id: 'scenario-school-1',
        label: '🎒 Morning Bell School Rush',
        description: 'Simulate instant classroom QR gate scan and log presence.',
        portalView: 'ATTENDANCE',
        clientName: 'Marcus Aurelius',
        clientPriority: 'LOW',
        attendanceData: { studentId: 'STUD-2026-9821', name: 'Marcus Aurelius', gradeSection: 'Grade 12 - Marcus' }
      }
    ]
  },
  GOVERNMENT: {
    id: 'GOVERNMENT',
    name: 'GOVERNMENT',
    label: 'Government & Public Services',
    welcomeText: 'Paperless public document processing, local clearance stamps, civil desk routing, and automated tax treasury queue lines.',
    icon: 'Building',
    locations: [
      { id: 'g-info', name: 'Information Front Desk', x: 20, y: 80, description: 'Public inquiries & ticket routing', type: 'Queue' },
      { id: 'g-mayor', name: 'Mayor’s Office', x: 45, y: 25, description: 'Executive clearances & proposals', type: 'Forms' },
      { id: 'g-clearance', name: 'Permit & Clearance Room', x: 15, y: 35, description: 'Barangay clearance issuances', type: 'Forms' },
      { id: 'g-nbi', name: 'Criminal Record Counter', x: 75, y: 25, description: 'NBI check & fingerprint scanning', type: 'Queue' },
      { id: 'g-tax', name: 'Treasury & Taxation Desk', x: 50, y: 75, description: 'Municipal fee collections', type: 'Billing' },
      { id: 'g-waiting', name: 'Public Lounge Area', x: 80, y: 85, description: 'Seating space with queue display', type: 'Queue' }
    ],
    catalog: [
      { id: 'g-1', name: 'Barangay Residency Certification', price: 150, category: 'Documents', stock: 1000 },
      { id: 'g-2', name: 'NBI Cleared Record Stamp', price: 250, category: 'Certificates', stock: 800 },
      { id: 'g-3', name: 'Community Tax Cedula Processing', price: 50, category: 'Taxation', stock: 2000 },
      { id: 'g-4', name: 'Municipal Business Operating Permit', price: 1500, category: 'Commercial Licenses', stock: 150 }
    ],
    formFields: [
      { id: 'gf-1', label: 'Full Citizen Name', type: 'text', required: true, placeholder: 'e.g. Maria Cruz' },
      { id: 'gf-2', label: 'Purpose of Certificate', type: 'select', required: true, options: ['Employment Requirement', 'Overseas Visa Application', 'Identity Validation', 'Local Business Application'] },
      { id: 'gf-3', label: 'National ID Number', type: 'text', required: true, placeholder: 'e.g. PH-ID-98012' },
      { id: 'gf-4', label: 'Home Address Declaration', type: 'textarea', required: true, placeholder: 'Enter complete residency address' }
    ],
    workflows: [
      { id: 'gw-1', trigger: 'Document Request Completed', condition: 'Fee Paid', action: 'Auto-print Clearance Stamp, Queue Document Pickup', isActive: true },
      { id: 'gw-2', trigger: 'Form Filed', condition: 'Valid ID', action: 'Notify treasury desk, queue tax billing assessment', isActive: true }
    ],
    samplePrompts: [
      'Request copy of Barangay Clearance for job employment',
      'Get a priority queue number for senior citizen desk',
      'Open citizen database forms'
    ],
    scenarios: [
      {
        id: 'scenario-gov-1',
        label: '📜 Citizen Clearance Registration',
        description: 'Simulate citizen queueing and prefilling document requests.',
        portalView: 'FORM',
        clientName: 'Isabella Santos',
        clientPriority: 'HIGH',
        formAnswers: {
          'Full Citizen Name': 'Isabella Santos',
          'Purpose of Certificate': 'Employment Requirement',
          'National ID Number': 'PH-ID-98012',
          'Home Address Declaration': 'Purok 4, Barangay San Jose'
        }
      }
    ]
  },
  RETAIL: {
    id: 'RETAIL',
    name: 'RETAIL',
    label: 'Retail & Smart POS',
    welcomeText: 'Self-checkout billing gates, electronic item inventory queries, and immediate customer return forms.',
    icon: 'ShoppingBag',
    locations: [
      { id: 'rt-entrance', name: 'Store Entrance Kiosk', x: 20, y: 80, description: 'Self-scan flyer QR codes', type: 'Queue' },
      { id: 'rt-returns', name: 'Customer Support Desk', x: 45, y: 25, description: 'Claims, returns & exchanges', type: 'Forms' },
      { id: 'rt-electro', name: 'Electronics Section', x: 15, y: 35, description: 'Pi gateway devices & smart nodes', type: 'Inventory' },
      { id: 'rt-apparel', name: 'Apparel & Fitting Rooms', x: 75, y: 25, description: 'Interactive textile inventory', type: 'Inventory' },
      { id: 'rt-self', name: 'Self-Checkout Kiosk', x: 50, y: 75, description: 'Fast automated NFC payments', type: 'Billing' },
      { id: 'rt-cashier', name: 'Manual Billing Counter', x: 80, y: 85, description: 'Traditional staff POS checkout', type: 'Billing' }
    ],
    catalog: [
      { id: 'r-1', name: 'Cloud-Enabled Raspberry Pi OS Gate', price: 4200, category: 'Hardware', stock: 15 },
      { id: 'r-2', name: 'Local Captive Portal QR Access Point', price: 1800, category: 'Hardware', stock: 24 },
      { id: 'r-3', name: 'Multi-Tenant Offline Base Dongle', price: 2900, category: 'Accessories', stock: 40 },
      { id: 'r-4', name: 'High-Top Pro Smart NFC Sneakers', price: 3800, category: 'Apparel', stock: 12 }
    ],
    formFields: [
      { id: 'rtf-1', label: 'Purchaser Name', type: 'text', required: true, placeholder: 'e.g. Jane Doe' },
      { id: 'rtf-2', label: 'Transaction Type', type: 'select', required: true, options: ['Direct Cash POS Checkout', 'Return Warranty Claim', 'Bulk Wholesale Order'] },
      { id: 'rtf-3', label: 'Barcoded Item ID', type: 'text', required: true, placeholder: 'e.g. SKU-ELECT-4811' }
    ],
    workflows: [
      { id: 'rtw-1', trigger: 'NFC Scan Detected', condition: 'Is Paid', action: 'Unlock smart checkout barrier, print receipt', isActive: true }
    ],
    samplePrompts: [
      'Order high-top sneakers item 5021 for ₱3800',
      'Check stock availability of retail shoes',
      'Go to digital POS menu'
    ],
    scenarios: [
      {
        id: 'scenario-retail-1',
        label: '🛒 Retail POS Purchase',
        description: 'Simulate high-tech self-checkout for premium hardware devices.',
        portalView: 'MENU',
        clientName: 'Walk-In Guest',
        clientPriority: 'LOW',
        orderItems: { 'r-1': 1 }
      }
    ]
  },
  TRANSPORT: {
    id: 'TRANSPORT',
    name: 'TRANSPORT',
    label: 'Transit & Smart Mobility',
    welcomeText: 'Self-booking shuttle transits, security gate QR boarding keys, and baggage claim logs.',
    icon: 'Bus',
    locations: [
      { id: 't-ticket', name: 'Smart Ticketing Desk', x: 20, y: 80, description: 'Transit card registration', type: 'Billing' },
      { id: 't-security', name: 'Security Proximity Check', x: 45, y: 25, description: 'NFC gates & boarding clearance', type: 'Queue' },
      { id: 't-gatea', name: 'Boarding Gate A1-A5', x: 15, y: 35, description: 'Simulated bus/coach boarding', type: 'Queue' },
      { id: 't-gateb', name: 'Boarding Gate B1-B5', x: 75, y: 25, description: 'Simulated regional shuttles', type: 'Queue' },
      { id: 't-baggage', name: 'Baggage Claim Hall', x: 50, y: 75, description: 'Automated conveyor logistics', type: 'Forms' },
      { id: 't-lounge', name: 'Premium Waiting Lounge', x: 80, y: 85, description: 'VIP passenger relax desks', type: 'Consultation' }
    ],
    catalog: [
      { id: 't-1', name: 'Regional Bus Transit One-Way Pass', price: 450, category: 'Tickets', stock: 200 },
      { id: 't-2', name: 'Airport Premium Express Coach Ticket', price: 1200, category: 'Tickets', stock: 50 },
      { id: 't-3', name: 'Multi-Ride RFID Commuter Card Reload', price: 500, category: 'Transit Card', stock: 999 },
      { id: 't-4', name: 'Excess Baggage Cargo Weight Fee', price: 350, category: 'Fees', stock: 500 }
    ],
    formFields: [
      { id: 'tf-1', label: 'Passenger Name', type: 'text', required: true, placeholder: 'e.g. Sienna Smith' },
      { id: 'tf-2', label: 'Route Terminal Destination', type: 'select', required: true, options: ['Manila Transit Hub', 'Clark Airport Terminal 2', 'Baguio Regional Station'] },
      { id: 'tf-3', label: 'Assigned Travel Seat', type: 'select', required: true, options: ['Row 12A (Window)', 'Row 14A (Window)', 'Row 15B (Aisle)', 'Row 18C (Middle)'] }
    ],
    workflows: [
      { id: 'tw-1', trigger: 'QR boarding gate scan', condition: 'Verified', action: 'Flash passenger boarding pass green, increment passenger count', isActive: true }
    ],
    samplePrompts: [
      'Book a ride checkin for seat 14A',
      'Check queue for the incoming shuttle bus',
      'Simulate GCash payment transaction ₱250'
    ],
    scenarios: [
      {
        id: 'scenario-trans-1',
        label: '🚌 Commuter Boarding Checkin',
        description: 'Simulate passenger booking a seat space on the Clark Express shuttle.',
        portalView: 'MENU',
        clientName: 'Sienna Smith',
        clientPriority: 'LOW',
        orderItems: { 't-2': 1 }
      }
    ]
  },
  INSURANCE: {
    id: 'INSURANCE',
    name: 'INSURANCE',
    label: 'Insurance & Claims',
    welcomeText: 'Submit policy applications, file rapid claims with offline document queues, and assess incident risk indices.',
    icon: 'ShieldCheck',
    locations: [
      { id: 'i-reception', name: 'Policy Reception & Intake', x: 20, y: 80, description: 'Filing area and document scan point', type: 'Forms' },
      { id: 'i-claims', name: 'Claims Submission Desk', x: 45, y: 25, description: 'Accident claims review', type: 'Forms' },
      { id: 'i-audit', name: 'Risk Assessment Suite', x: 15, y: 35, description: 'Risk audit diagnostics', type: 'Consultation' },
      { id: 'i-evaluator', name: 'Evaluator Assignment Hub', x: 75, y: 25, description: 'Evaluator matching counter', type: 'Queue' },
      { id: 'i-payout', name: 'Financial Payout Desk', x: 50, y: 75, description: 'Approved claims disbursement', type: 'Billing' },
      { id: 'i-lounge', name: 'Policy Owner Lounge', x: 80, y: 85, description: 'Premium consultation zone', type: 'Consultation' }
    ],
    catalog: [
      { id: 'i-1', name: 'Premium Comprehensive Auto Policy', price: 3500, category: 'Insurance', stock: 500 },
      { id: 'i-2', name: 'SaaS Business Liability Guarantee', price: 5800, category: 'Insurance', stock: 250 },
      { id: 'i-3', name: 'Claims Document Review Surcharge', price: 250, category: 'Admin Fee', stock: 1000 },
      { id: 'i-4', name: 'Risk Assessment Personal Audit', price: 1500, category: 'Consultation', stock: 100 }
    ],
    formFields: [
      { id: 'if-1', label: 'Claimant Full Name', type: 'text', required: true, placeholder: 'e.g. Althea Ramos' },
      { id: 'if-2', label: 'Insurance Policy Number', type: 'text', required: true, placeholder: 'e.g. POL-9821-ACS' },
      { id: 'if-3', label: 'Type of Incident Claim', type: 'select', required: true, options: ['Automobile Collision', 'Property Damage', 'Health & Injury', 'Commercial Liability'] },
      { id: 'if-4', label: 'Incident Narrative & Proof', type: 'textarea', required: true, placeholder: 'Describe how the damage occurred...' }
    ],
    workflows: [
      { id: 'iw-1', trigger: 'Claim Submitted', condition: 'Documents Valid', action: 'Assign dedicated evaluator, create priority queue slot', isActive: true },
      { id: 'iw-2', trigger: 'Documents Complete', condition: 'Cleared', action: 'Move policy record to approval desk', isActive: true },
      { id: 'iw-3', trigger: 'Approved Claim', condition: 'Payout Allowed', action: 'Trigger payment dispatch task to Payout Desk', isActive: true }
    ],
    samplePrompts: [
      'File a claim submission form for my car accident',
      'Assign an evaluator for policy application',
      'Check status of comprehensive home protection'
    ],
    scenarios: [
      {
        id: 'scenario-ins-1',
        label: '🛡️ Collision Claim Filing',
        description: 'Simulate motorist filing an urgent automobile insurance claim.',
        portalView: 'FORM',
        clientName: 'Dominic Cruz',
        clientPriority: 'HIGH',
        formAnswers: {
          'Claimant Full Name': 'Dominic Cruz',
          'Insurance Policy Number': 'POL-8812-CAR',
          'Type of Incident Claim': 'Automobile Collision',
          'Incident Narrative & Proof': 'Struck by another vehicle at intersections. Dashcam footage synced.'
        }
      }
    ]
  },
  TELECOM: {
    id: 'TELECOM',
    name: 'TELECOM',
    label: 'Telecom & Connectivity',
    welcomeText: 'Self-serve SIM registration kiosks, high-speed fiber upgrades, and autonomous network incident dispatchers.',
    icon: 'Smartphone',
    locations: [
      { id: 'tel-welcome', name: 'Smart Kiosk Registry Entrance', x: 20, y: 80, description: 'QR ID scan and SIM verification', type: 'Queue' },
      { id: 'tel-upgrades', name: 'Plan & Fiber Upgrade Desk', x: 45, y: 25, description: 'Subscription sales consultation', type: 'Consultation' },
      { id: 'tel-tech', name: 'Technical Incident Control', x: 15, y: 35, description: 'Troubleshooting desk', type: 'Service' },
      { id: 'tel-eSIM', name: 'Digital eSIM QR Dispatch', x: 75, y: 25, description: 'Automated code retrieval', type: 'Billing' },
      { id: 'tel-billing', name: 'Cashier & Subscription Desk', x: 50, y: 75, description: 'Payments and accounts', type: 'Billing' },
      { id: 'tel-support', name: 'Corporate Account Center', x: 80, y: 85, description: 'B2B enterprise networking support', type: 'Forms' }
    ],
    catalog: [
      { id: 'tel-1', name: 'Prepaid SIM QR Activation Card', price: 150, category: 'Hardware', stock: 2000 },
      { id: 'tel-2', name: '5G Unlimited Monthly Data Subscription', price: 1499, category: 'Plans', stock: 9999 },
      { id: 'tel-3', name: 'Home Fiber Upgrade Activation Fee', price: 1999, category: 'Plans', stock: 150 },
      { id: 'tel-4', name: 'eSIM Digital Cellular Profile Code', price: 200, category: 'Hardware', stock: 5000 }
    ],
    formFields: [
      { id: 'telf-1', label: 'Subscriber Full Name', type: 'text', required: true, placeholder: 'e.g. Liam Tan' },
      { id: 'telf-2', label: 'Mobile Contact Number', type: 'text', required: true, placeholder: 'e.g. 0918-999-8888' },
      { id: 'telf-3', label: 'Identification Type', type: 'select', required: true, options: ['National ID / UMID', 'Philippine Passport', 'Drivers License'] },
      { id: 'telf-4', label: 'Subscription Plan Selection', type: 'select', required: true, options: ['5G Unlimited Postpaid 1499', 'Family Home Fiber 1999', 'Prepaid SIM Profile Only'] }
    ],
    workflows: [
      { id: 'telw-1', trigger: 'SIM Request Submitted', condition: 'ID Verified', action: 'Assign technical queue slot, trigger eSIM activation', isActive: true },
      { id: 'telw-2', trigger: 'Payment Confirmed', condition: 'Verified', action: 'Activate cellular plan on network controller', isActive: true },
      { id: 'telw-3', trigger: 'Network Outage Resolved', condition: 'Task Closed', action: 'Auto-SMS client notifying restoration', isActive: true }
    ],
    samplePrompts: [
      'Register my new SIM card online',
      'Report broadband fiber connection failure',
      'Upgrade my plan to Unlimited 5G Postpaid'
    ],
    scenarios: [
      {
        id: 'scenario-tel-1',
        label: '📶 5G SIM Profile Activation',
        description: 'Simulate high-speed eSIM activation for walk-in client.',
        portalView: 'FORM',
        clientName: 'Patricia Reyes',
        clientPriority: 'LOW',
        formAnswers: {
          'Subscriber Full Name': 'Patricia Reyes',
          'Mobile Contact Number': '0917-882-1234',
          'Identification Type': 'National ID / UMID',
          'Subscription Plan Selection': 'Prepaid SIM Profile Only'
        }
      }
    ]
  },
  ENERGY: {
    id: 'ENERGY',
    name: 'ENERGY',
    label: 'Energy & Smart Utilities',
    welcomeText: 'Log digital smart meter readings, check grid interruption records, and schedule high-priority line dispatches.',
    icon: 'Zap',
    locations: [
      { id: 'en-kiosk', name: 'Front Utility Account Hub', x: 20, y: 80, description: 'Quick ticket and billing inquiries', type: 'Queue' },
      { id: 'en-meter', name: 'Meter Reading Validate Counter', x: 45, y: 25, description: 'Submit diagnostic values', type: 'Forms' },
      { id: 'en-maint', name: 'Line Technician Dispatch Bay', x: 15, y: 35, description: 'Maintenance crew scheduling', type: 'Service' },
      { id: 'en-billing', name: 'Treasury & Payments Counter', x: 75, y: 25, description: 'Utilities bill settlements', type: 'Billing' },
      { id: 'en-grid', name: 'Grid Outage Reporting Office', x: 50, y: 75, description: 'Incident command and alerts', type: 'Forms' },
      { id: 'en-solar', name: 'Solar Net-Metering Assessment', x: 80, y: 85, description: 'Renewable grid audits', type: 'Consultation' }
    ],
    catalog: [
      { id: 'en-1', name: 'New Smart Meter Installation Fee', price: 2500, category: 'Services', stock: 120 },
      { id: 'en-2', name: 'Line Diagnostic Maintenance Dispatch', price: 1500, category: 'Services', stock: 300 },
      { id: 'en-3', name: 'Solar Grid Integration Net Assessment', price: 5000, category: 'Consultation', stock: 50 },
      { id: 'en-4', name: 'Smart Meter Hardware Calibration Unit', price: 1200, category: 'Hardware', stock: 45 }
    ],
    formFields: [
      { id: 'enf-1', label: 'Utility Account Number', type: 'text', required: true, placeholder: 'e.g. ACCT-8824-POWER' },
      { id: 'enf-2', label: 'Meter Serial Identification', type: 'text', required: true, placeholder: 'e.g. MTR-4812-CAL' },
      { id: 'enf-3', label: 'Meter Numeric Reading (kWh)', type: 'number', required: true, placeholder: 'Current numeric display on meter' },
      { id: 'enf-4', label: 'Billing Incident Complaint', type: 'select', required: true, options: ['Submit Regular Monthly Meter Log', 'Report Water/Power Pipeline Leak', 'Request Safety Line Relocate', 'Billing Dispute Resolution'] }
    ],
    workflows: [
      { id: 'enw-1', trigger: 'Meter Log Received', condition: 'Valid Range', action: 'Auto-generate monthly billing ledger entry, print ticket', isActive: true },
      { id: 'enw-2', trigger: 'Payment Received', condition: 'Balance Paid', action: 'Update grid database status to active connection', isActive: true },
      { id: 'enw-3', trigger: 'Outage Incident Logged', condition: 'True', action: 'Queue emergency dispatch crew ticket, notify command', isActive: true }
    ],
    samplePrompts: [
      'Submit smart meter reading 4812 kWh',
      'Report power grid blackout in sector B',
      'Schedule net-metering solar diagnostic audit'
    ],
    scenarios: [
      {
        id: 'scenario-en-1',
        label: '⚡ Meter Reading Self-Log',
        description: 'Simulate citizen registering monthly electric reading.',
        portalView: 'FORM',
        clientName: 'Fernando Lopez',
        clientPriority: 'LOW',
        formAnswers: {
          'Utility Account Number': 'ACCT-8812-PWR',
          'Meter Serial Identification': 'MTR-9821-N',
          'Meter Numeric Reading (kWh)': '4812',
          'Billing Incident Complaint': 'Submit Regular Monthly Meter Log'
        }
      }
    ]
  },
  MEDIA: {
    id: 'MEDIA',
    name: 'MEDIA',
    label: 'Media & Production',
    welcomeText: 'Centralized production pipeline trackers, asset ingest buffers, video edit cues, and automated scheduler releases.',
    icon: 'Clapperboard',
    locations: [
      { id: 'med-intake', name: 'Raw Media Ingest Room', x: 20, y: 80, description: 'File uploads and cataloging', type: 'Forms' },
      { id: 'med-edit', name: 'Post-Production Video Suites', x: 45, y: 25, description: 'Editing and visual effects', type: 'Service' },
      { id: 'med-audio', name: 'Audio Dubbing & Sound Booth', x: 15, y: 35, description: 'Voiceovers and score layering', type: 'Service' },
      { id: 'med-review', name: 'Executive Screening Suite', x: 75, y: 25, description: 'Director final approval', type: 'Consultation' },
      { id: 'med-schedule', name: 'Publishing Scheduler Hub', x: 50, y: 75, description: 'Broadcast queue controller', type: 'Forms' },
      { id: 'med-lounge', name: 'Client Review Lounge', x: 80, y: 85, description: 'Creative review bar', type: 'Consultation' }
    ],
    catalog: [
      { id: 'med-1', name: 'Video Post-Production Editing Package', price: 7500, category: 'Creative Services', stock: 8 },
      { id: 'med-2', name: 'Sound Dubbing Foley Studio Booking', price: 2500, category: 'Creative Services', stock: 24 },
      { id: 'med-3', name: 'Drone 4K Raw B-Roll Asset License', price: 5000, category: 'Media Licensing', stock: 40 },
      { id: 'med-4', name: 'Social Media Publishing Scheduling Fee', price: 1800, category: 'Broadcast', stock: 150 }
    ],
    formFields: [
      { id: 'medf-1', label: 'Producer/Agency Name', type: 'text', required: true, placeholder: 'e.g. Star Media Inc' },
      { id: 'medf-2', label: 'Production Project Title', type: 'text', required: true, placeholder: 'e.g. Summer Promo 2026' },
      { id: 'medf-3', label: 'Media Deliverable Type', type: 'select', required: true, options: ['Full Promo Commercial Video', 'Sound FX / Audio Mix', 'Raw 4K Aerial Footage Asset', 'Social Media Campaign Scheduler'] },
      { id: 'medf-4', label: 'Post-Production Instructions', type: 'textarea', required: false, placeholder: 'Enter color grading preferences, sound goals...' }
    ],
    workflows: [
      { id: 'medw-1', trigger: 'File Upload Completed', condition: 'Files Received', action: 'Auto-queue edit task, notify senior editor', isActive: true },
      { id: 'medw-2', trigger: 'Screening Approved', condition: 'Checked', action: 'Move package to active publish queue', isActive: true },
      { id: 'medw-3', trigger: 'Broadcast Published', condition: 'Live', action: 'Alert executive stakeholders via cloud telemetry email', isActive: true }
    ],
    samplePrompts: [
      'Upload project raw-clip-04 for review',
      'Assign an editor for audio dubbing foley session',
      'Schedule media release on Friday'
    ],
    scenarios: [
      {
        id: 'scenario-med-1',
        label: '🎬 Promo Video Post-Prod',
        description: 'Simulate producer commissioning post-production VFX workflow.',
        portalView: 'FORM',
        clientName: 'Star Media Inc',
        clientPriority: 'MEDIUM',
        formAnswers: {
          'Producer/Agency Name': 'Star Media Inc',
          'Production Project Title': 'Summer Promo 2026',
          'Media Deliverable Type': 'Full Promo Commercial Video',
          'Post-Production Instructions': 'Cinematic LUTs, clean modern transitions, 30-sec social cuts.'
        }
      }
    ]
  },
  FREELANCE: {
    id: 'FREELANCE',
    name: 'FREELANCE',
    label: 'Freelance & Gig Platform',
    welcomeText: 'Seamless job posting, contractor matching systems, cryptographic milestone escrow checks, and active disputes.',
    icon: 'Briefcase',
    locations: [
      { id: 'fr-post', name: 'Employer Job Poster Desk', x: 20, y: 80, description: 'Post active gig requirements', type: 'Forms' },
      { id: 'fr-matching', name: 'Contractor AI Match Hub', x: 45, y: 25, description: 'Freelancer matching algorithms', type: 'Queue' },
      { id: 'fr-milestones', name: 'Project Milestone Tracker', x: 15, y: 35, description: 'Task delivery review board', type: 'Forms' },
      { id: 'fr-dispute', name: 'Dispute Resolution Office', x: 75, y: 25, description: 'Arbitration and refunds', type: 'Consultation' },
      { id: 'fr-escrow', name: 'Escrow Payment Payout Vault', x: 50, y: 75, description: 'Financial clearance and dispatch', type: 'Billing' },
      { id: 'fr-cowork', name: 'Co-working Hotdesk Lounge', x: 80, y: 85, description: 'Local LAN work spaces', type: 'Service' }
    ],
    catalog: [
      { id: 'fr-1', name: 'Full-Stack Developer Escrow Deposit', price: 10000, category: 'Escrow Hold', stock: 100 },
      { id: 'fr-2', name: 'Project Milestone Audit Processing', price: 350, category: 'Admin Fee', stock: 1000 },
      { id: 'fr-3', name: 'Pro Freelancer Headhunter Sourcing', price: 1200, category: 'Consultation', stock: 50 },
      { id: 'fr-4', name: 'Dispute Arbitration Board Review', price: 1500, category: 'Arbitration', stock: 20 }
    ],
    formFields: [
      { id: 'frf-1', label: 'Company / Project Creator', type: 'text', required: true, placeholder: 'e.g. Acme Tech Corp' },
      { id: 'frf-2', label: 'Contract Task Description', type: 'text', required: true, placeholder: 'e.g. Custom React Dashboard' },
      { id: 'frf-3', label: 'Required Expert Category', type: 'select', required: true, options: ['Full-Stack Web Engineering', 'Mobile App Development', 'Creative Brand Styling', 'Technical Copywriting'] },
      { id: 'frf-4', label: 'Project Milestone & Escrow Detail', type: 'textarea', required: true, placeholder: 'Define exact milestones, e.g., M1: Design, M2: Final Build' }
    ],
    workflows: [
      { id: 'frw-1', trigger: 'Gig Posted', condition: 'True', action: 'Dispatch match task to matching queue, alert qualified developers', isActive: true },
      { id: 'frw-2', trigger: 'Milestone Verified', condition: 'Is Approved', action: 'Auto-release escrow payment buffer to freelancer ledger', isActive: true },
      { id: 'frw-3', trigger: 'Rating Filed', condition: 'Submitted', action: 'Increment profile ratings index on smart contract', isActive: true }
    ],
    samplePrompts: [
      'Post a job request for senior React dev',
      'Escrow milestone 2 budget check',
      'Submit dispute arbitration claim'
    ],
    scenarios: [
      {
        id: 'scenario-freelance-1',
        label: '💼 Project Gig Escrow Post',
        description: 'Simulate hiring manager posting an escrow contract for React web development.',
        portalView: 'FORM',
        clientName: 'Acme Tech Corp',
        clientPriority: 'MEDIUM',
        formAnswers: {
          'Company / Project Creator': 'Acme Tech Corp',
          'Contract Task Description': 'Custom React Dashboard',
          'Required Expert Category': 'Full-Stack Web Engineering',
          'Project Milestone & Escrow Detail': 'M1: Interactive UI Mockup (₱5,000), M2: Fully Coded React & API (₱5,000)'
        }
      }
    ]
  },
  SECURITY: {
    id: 'SECURITY',
    name: 'SECURITY',
    label: 'Security & Access Control',
    welcomeText: 'Automated visitor checks, biometric QR gates, central guard incident logs, and rapid access clearances.',
    icon: 'Shield',
    locations: [
      { id: 'sec-gate', name: 'Guard Gatehouse & Check-In', x: 20, y: 80, description: 'Visitor ID screening and ticketing', type: 'Security' },
      { id: 'sec-qr', name: 'Biometric QR Scanning Hub', x: 45, y: 25, description: 'Turnstile gate NFC check-in', type: 'Security' },
      { id: 'sec-access', name: 'Area Authorization Gates', x: 15, y: 35, description: 'Zoned access barriers', type: 'Security' },
      { id: 'sec-incident', name: 'Incident Logging Office', x: 75, y: 25, description: 'Secure reports filing', type: 'Forms' },
      { id: 'sec-command', name: 'CCTV Central Command Suite', x: 50, y: 75, description: 'Live monitoring panel', type: 'Service' },
      { id: 'sec-lounge', name: 'Tactical Officer Office', x: 80, y: 85, description: 'Staff ready desk', type: 'Consultation' }
    ],
    catalog: [
      { id: 'sec-1', name: 'Visitor Smart Pass Card Activation', price: 500, category: 'Hardware', stock: 150 },
      { id: 'sec-2', name: 'High-Access Facility Security Badge', price: 1500, category: 'Security', stock: 40 },
      { id: 'sec-3', name: 'CCTV Footprint Retrieve Request Fee', price: 1000, category: 'Audit Services', stock: 100 },
      { id: 'sec-4', name: 'Incident Investigation Surcharge', price: 100, category: 'Admin Fee', stock: 999 }
    ],
    formFields: [
      { id: 'secf-1', label: 'Visitor Full Name', type: 'text', required: true, placeholder: 'e.g. Marcus Aurelius' },
      { id: 'secf-2', label: 'Host Office Location', type: 'select', required: true, options: ['Zoned Executive Offices', 'Technical Server Racks', 'General Conference Hall', 'Warehouse Inventory Bays'] },
      { id: 'secf-3', label: 'Expected Visit Date', type: 'text', required: true, placeholder: 'e.g. July 12, 2026' },
      { id: 'secf-4', label: 'Visitor Security Remarks', type: 'textarea', required: false, placeholder: 'Bringing personal laptop, drone, camera...' }
    ],
    workflows: [
      { id: 'secw-1', trigger: 'Visitor Registered', condition: 'Approved', action: 'Auto-generate secure access QR pass to email', isActive: true },
      { id: 'secw-2', trigger: 'NFC Entry Scan', condition: 'Verified', action: 'Log timestamp index, flash gate LED green', isActive: true },
      { id: 'secw-3', trigger: 'Incident Reported', condition: 'True', action: 'Notify administrator on dashboard monitor, alert guards', isActive: true }
    ],
    samplePrompts: [
      'Register guest Marcus Aurelius for secure pass',
      'Report incident: Broken fire escape lock in sector 4',
      'Check entry exit log of visitor cards'
    ],
    scenarios: [
      {
        id: 'scenario-sec-1',
        label: '🔒 Visitor Access QR Creation',
        description: 'Simulate guard office issuing an authorized guest pass.',
        portalView: 'FORM',
        clientName: 'Marcus Aurelius',
        clientPriority: 'LOW',
        formAnswers: {
          'Visitor Full Name': 'Marcus Aurelius',
          'Host Office Location': 'Technical Server Racks',
          'Expected Visit Date': 'July 8, 2026',
          'Visitor Security Remarks': 'Escorted vendor checking network rack diagnostic meters.'
        }
      }
    ]
  },
  NON_PROFIT: {
    id: 'NON_PROFIT',
    name: 'NON_PROFIT',
    label: 'Non-Profit & NGO Relief',
    welcomeText: 'Streamline charitable donations, aid package distributions, local volunteer shifts, and beneficiary audits.',
    icon: 'Heart',
    locations: [
      { id: 'np-donation', name: 'Main Charity Donation Desk', x: 20, y: 80, description: 'Secure fund intake', type: 'Billing' },
      { id: 'np-aid', name: 'Aid Package Distribution Counter', x: 45, y: 25, description: 'Care package handout desk', type: 'Service' },
      { id: 'np-volunteer', name: 'Volunteer Coordinator Office', x: 15, y: 35, description: 'Shift scheduling and tracking', type: 'Forms' },
      { id: 'np-tracking', name: 'Program Reporting & Audit Suite', x: 75, y: 25, description: 'NGO audit database desk', type: 'Forms' },
      { id: 'np-beneficiary', name: 'Beneficiary Check-in Bay', x: 50, y: 75, description: 'Aid eligibility scans', type: 'Queue' },
      { id: 'np-relief', name: 'Community Relief Center', x: 80, y: 85, description: 'Disaster aid lounge', type: 'Consultation' }
    ],
    catalog: [
      { id: 'np-1', name: 'Disaster Relief Custom Donation Package', price: 5000, category: 'Donations', stock: 9999 },
      { id: 'np-2', name: 'Community Aid Grant Process Fee', price: 10000, category: 'Donations', stock: 100 },
      { id: 'np-3', name: 'Beneficiary Care Package Assembly', price: 500, category: 'Donations', stock: 500 },
      { id: 'np-4', name: 'Volunteer Training Module Manual', price: 100, category: 'Supplies', stock: 1000 }
    ],
    formFields: [
      { id: 'npf-1', label: 'Philanthropist / Donor Name', type: 'text', required: true, placeholder: 'e.g. Jhon Carlo' },
      { id: 'npf-2', label: 'Target NGO Aid Program', type: 'select', required: true, options: ['Disaster Relief Care Packages', 'Children Textbook Education Fund', 'Clean Water Well Installations', 'General Administrative Fund'] },
      { id: 'npf-3', label: 'Selected Donation Currency', type: 'select', required: true, options: ['₱ Philippine Peso (PHP)', '$ US Dollar (USD)'] },
      { id: 'npf-4', label: 'Message of Hope to Beneficiaries', type: 'textarea', required: false, placeholder: 'Write a warm note...' }
    ],
    workflows: [
      { id: 'npw-1', trigger: 'Donation Received', condition: 'Balance Posted', action: 'Increment fund pool tally, dispatch receipt and letter', isActive: true },
      { id: 'npw-2', trigger: 'Aid Distributed', condition: 'Handout Done', action: 'Log beneficiary verification signature to ledger', isActive: true },
      { id: 'npw-3', trigger: 'Volunteer Assigned', condition: 'Shift Match', action: 'Auto-SMS volunteer schedule details, unlock lockers', isActive: true }
    ],
    samplePrompts: [
      'Submit donation for children textbook fund ₱1000',
      'Register as volunteer for weekend relief program',
      'Log aid distributed beneficiary signature'
    ],
    scenarios: [
      {
        id: 'scenario-np-1',
        label: '❤️ Philanthropic Donation Log',
        description: 'Simulate donor processing charity contribution.',
        portalView: 'FORM',
        clientName: 'Jhon Carlo',
        clientPriority: 'LOW',
        formAnswers: {
          'Philanthropist / Donor Name': 'Jhon Carlo',
          'Target NGO Aid Program': 'Children Textbook Education Fund',
          'Selected Donation Currency': '₱ Philippine Peso (PHP)',
          'Message of Hope to Beneficiaries': 'Hoping these school textbooks help fuel your education goals!'
        }
      }
    ]
  },
  RELIGIOUS: {
    id: 'RELIGIOUS',
    name: 'RELIGIOUS',
    label: 'Religious Organizations',
    welcomeText: 'Manage community registries, charitable offerings, sacrament event scheduler queues, and bulletins.',
    icon: 'Compass',
    locations: [
      { id: 'rel-info', name: 'Member Registry Information Hub', x: 20, y: 80, description: 'Family database registrations', type: 'Forms' },
      { id: 'rel-sanct', name: 'Main Chapel Sanctuary Entrance', x: 45, y: 25, description: 'Quiet prayer and service seating', type: 'Consultation' },
      { id: 'rel-hall', name: 'Community Fellowship Hall', x: 15, y: 35, description: 'Event assembly room', type: 'Consultation' },
      { id: 'rel-pastoral', name: 'Pastoral Counseling Office', x: 75, y: 25, description: 'Counseling and clearances', type: 'Queue' },
      { id: 'rel-charity', name: 'Charitable Ministry Center', x: 50, y: 75, description: 'Tithes and donation ledgers', type: 'Billing' },
      { id: 'rel-lounge', name: 'Fellowship Coffee Lounge', x: 80, y: 85, description: 'Member gathering space', type: 'Consultation' }
    ],
    catalog: [
      { id: 'rel-1', name: 'sacrament Hall Event Booking fee', price: 3500, category: 'Services', stock: 30 },
      { id: 'rel-2', name: 'Ministry Charitable Tithe Offering', price: 1000, category: 'Charity Offering', stock: 9999 },
      { id: 'rel-3', name: 'Pastoral Counseling Session Fee', price: 500, category: 'Services', stock: 100 },
      { id: 'rel-4', name: 'Special Feast Mass Commemoration', price: 150, category: 'Services', stock: 500 }
    ],
    formFields: [
      { id: 'relf-1', label: 'Member / Family Name', type: 'text', required: true, placeholder: 'e.g. Reyes Family' },
      { id: 'relf-2', label: 'Sacrament Service Requested', type: 'select', required: true, options: ['Sacramental Baptism Booking', 'Solemn Marriage Ceremony', 'Special Intention Prayer Commemoration', 'Congregation Membership Roll'] },
      { id: 'relf-3', label: 'Requested Date & Time', type: 'text', required: true, placeholder: 'e.g. Sunday, 10:00 AM' },
      { id: 'relf-4', label: 'Additional Family Intentions', type: 'textarea', required: false, placeholder: 'Add names or personal prayers...' }
    ],
    workflows: [
      { id: 'relw-1', trigger: 'Event Booked', condition: 'True', action: 'Auto-SMS congregants, publish event schedule to database', isActive: true },
      { id: 'relw-2', trigger: 'Offering Logged', condition: 'Cleared', action: 'Update charity registry ledger, print tax receipt', isActive: true },
      { id: 'relw-3', trigger: 'Sanctuary Entry Logged', condition: 'Attendance Saved', action: 'Increment congregant density, update active list', isActive: true }
    ],
    samplePrompts: [
      'Register new family member registry',
      'Record tithe donation of ₱1000',
      'Schedule sacrament hall event booking'
    ],
    scenarios: [
      {
        id: 'scenario-rel-1',
        label: '⛪ Member Sacrament Registry',
        description: 'Simulate family queueing for baptism booking.',
        portalView: 'FORM',
        clientName: 'Reyes Family',
        clientPriority: 'LOW',
        formAnswers: {
          'Member / Family Name': 'Reyes Family',
          'Sacrament Service Requested': 'Sacramental Baptism Booking',
          'Requested Date & Time': 'Sunday, July 12, 11:30 AM',
          'Additional Family Intentions': 'Commemorating baby Carlos Cruz baptism.'
        }
      }
    ]
  },
  BEAUTY: {
    id: 'BEAUTY',
    name: 'BEAUTY',
    label: 'Beauty & Wellness',
    welcomeText: 'Seamless spa appointment calendars, staff aesthetician rosters, history databases, and secure POS checkout logs.',
    icon: 'Sparkles',
    locations: [
      { id: 'b-reception', name: 'Welcome Booking Desk', x: 20, y: 80, description: 'Check-in and treatment selection', type: 'Queue' },
      { id: 'b-styling', name: 'Hair Grooming Stations', x: 45, y: 25, description: 'Haircut and blow dry stations', type: 'Service' },
      { id: 'b-facial', name: 'Facial & Skincare Suites', x: 15, y: 35, description: 'Diagnostic skin care therapy', type: 'Service' },
      { id: 'b-massage', name: 'Therapeutic Spa Chambers', x: 75, y: 25, description: 'Aromatherapy oil massages', type: 'Service' },
      { id: 'b-lash', name: 'Makeup & Esthetics Lounge', x: 50, y: 75, description: 'Bridal prep and lash sessions', type: 'Service' },
      { id: 'b-payments', name: 'Retail & POS Cashier Desk', x: 80, y: 85, description: 'Checkouts and cosmetics shop', type: 'Billing' }
    ],
    catalog: [
      { id: 'b-1', name: 'Smart Hair Cut & Styling Service', price: 450, category: 'Hair Care', stock: 200 },
      { id: 'b-2', name: 'Therapeutic Facial Spa Treatment', price: 1200, category: 'Skincare', stock: 50 },
      { id: 'b-3', name: 'Aromatherapy Essential Oil Massage', price: 1500, category: 'Spa Therapy', stock: 30 },
      { id: 'b-4', name: 'Luxury Hand & Foot Nail Styling Pack', price: 650, category: 'Esthetics', stock: 80 },
      { id: 'b-5', name: 'Premium Bridal Makeup Package', price: 8500, category: 'Makeup', stock: 15 }
    ],
    formFields: [
      { id: 'bf-1', label: 'Guest Full Name', type: 'text', required: true, placeholder: 'e.g. Althea Ramos' },
      { id: 'bf-2', label: 'Preferred Aesthetic Specialist', type: 'select', required: true, options: ['Stylist Clara (Hair Expert)', 'Esthetician Sophia (Skincare)', 'Massage Therapist Dave (Wellness)'] },
      { id: 'bf-3', label: 'Select Beauty Package', type: 'select', required: true, options: ['Smart Hair Cut & Styling', 'Therapeutic Facial Spa', 'Aromatherapy Essential Oil Massage', 'Premium Bridal Makeup Package'] },
      { id: 'bf-4', label: 'Allergies / Special Skincare Notes', type: 'textarea', required: false, placeholder: 'Sensitive skin, nut allergies, etc.' }
    ],
    workflows: [
      { id: 'bw-1', trigger: 'Booking Finalized', condition: 'Staff Available', action: 'Assign specialist staff, print service ticket', isActive: true },
      { id: 'bw-2', trigger: 'Treatment Completed', condition: 'Logged', action: 'Record diagnostic skin notes to client history file', isActive: true },
      { id: 'bw-3', trigger: 'Payment Processed', condition: 'Balance Paid', action: 'Finalize POS session, deduct salon stock', isActive: true }
    ],
    samplePrompts: [
      'Book a facial spa treatment for this afternoon',
      'Assign aesthetician Clara for a haircut appointment',
      'Finalize aromatherapy massage service payment'
    ],
    scenarios: [
      {
        id: 'scenario-beauty-1',
        label: '💆 Therapeutic Facial Booking',
        description: 'Simulate guest checking in for diagnostic facial skincare.',
        portalView: 'FORM',
        clientName: 'Althea Ramos',
        clientPriority: 'LOW',
        formAnswers: {
          'Guest Full Name': 'Althea Ramos',
          'Preferred Aesthetic Specialist': 'Esthetician Sophia (Skincare)',
          'Select Beauty Package': 'Therapeutic Facial Spa',
          'Allergies / Special Skincare Notes': 'Sensitive to tea tree oil products.'
        }
      }
    ]
  },
  REPAIR: {
    id: 'REPAIR',
    name: 'REPAIR',
    label: 'Repair & Maintenance',
    welcomeText: 'Rapid hardware diagnostics logging, technician dispatches, local parts warehouse stock syncs, and job trackers.',
    icon: 'Wrench',
    locations: [
      { id: 'rep-intake', name: 'Diagnostics Intake Counters', x: 20, y: 80, description: 'Device triage and invoice desk', type: 'Queue' },
      { id: 'rep-electro', name: 'Electronics Service Benches', x: 45, y: 25, description: 'Soldering and device disassembly', type: 'Service' },
      { id: 'rep-parts', name: 'Hardware Parts Warehouse', x: 15, y: 35, description: 'Microchips and copper pipes storage', type: 'Inventory' },
      { id: 'rep-dispatch', name: 'Technician Field Dispatch Bay', x: 75, y: 25, description: 'Mobile repair scheduling', type: 'Forms' },
      { id: 'rep-billing', name: 'Payments & Invoice Handout', x: 50, y: 75, description: 'Transaction processing', type: 'Billing' },
      { id: 'rep-lockers', name: 'Device Recovery Lockers', x: 80, y: 85, description: 'Self-serve pickup bins', type: 'Security' }
    ],
    catalog: [
      { id: 'rep-1', name: 'Smart Appliance Diagnostics Fee', price: 450, category: 'Services', stock: 500 },
      { id: 'rep-2', name: 'Full Mobile Screen & Logic Repair', price: 2800, category: 'Hardware Repair', stock: 45 },
      { id: 'rep-3', name: 'Technician Home Dispatch Fee', price: 1200, category: 'Services', stock: 150 },
      { id: 'rep-4', name: 'Replacement High-Grade Copper Valves', price: 350, category: 'Inventory', stock: 120 },
      { id: 'rep-5', name: 'PC Re-pasting & Dust Clean Package', price: 1500, category: 'Hardware Repair', stock: 60 }
    ],
    formFields: [
      { id: 'repf-1', label: 'Device Owner Name', type: 'text', required: true, placeholder: 'e.g. David Cruz' },
      { id: 'repf-2', label: 'Hardware Appliance Type', type: 'select', required: true, options: ['Smart Mobile Smartphone', 'Laptop / PC Computer', 'Home Air Conditioning Unit', 'Electric Stove / Oven'] },
      { id: 'repf-3', label: 'Primary Issue Diagnosis', type: 'select', required: true, options: ['Broken Screen Glass', 'Power Failure / Blown Fuse', 'Water Pipe Leaks / Clog', 'Software Loop / OS Reinstall'] },
      { id: 'repf-4', label: 'Specific Damage Narrative', type: 'textarea', required: true, placeholder: 'Describe exact issue or parts requested...' }
    ],
    workflows: [
      { id: 'repw-1', trigger: 'Repair Request Submitted', condition: 'Diag Paid', action: 'Assign certified technician, queue diagnostic task', isActive: true },
      { id: 'repw-2', trigger: 'Job Completed', condition: 'Checked', action: 'Move package to Secure Recovery Lockers, send SMS key', isActive: true },
      { id: 'repw-3', trigger: 'Parts Used', condition: 'Subtracted', action: 'Log item deduction from stock database', isActive: true }
    ],
    samplePrompts: [
      'File request for broken aircon water leaks repair',
      'Deduct replacement battery screen parts from stock',
      'Dispatch technician Dave to repair home stove'
    ],
    scenarios: [
      {
        id: 'scenario-repair-1',
        label: '🔧 Aircon Water Leak Repair',
        description: 'Simulate resident filing technician home dispatch service request.',
        portalView: 'FORM',
        clientName: 'David Cruz',
        clientPriority: 'HIGH',
        formAnswers: {
          'Device Owner Name': 'David Cruz',
          'Hardware Appliance Type': 'Home Air Conditioning Unit',
          'Primary Issue Diagnosis': 'Water Pipe Leaks / Clog',
          'Specific Damage Narrative': 'Indoor unit leaking water aggressively down bedroom wall when cooling.'
        }
      }
    ]
  },
  EDUCATION_ADV: {
    id: 'EDUCATION_ADV',
    name: 'EDUCATION_ADV',
    label: 'Advanced Academy & TESDA',
    welcomeText: 'Course enrollment checkins, hands-on skills metrics tracking, NFT smart certification stamps, and instant Assessments.',
    icon: 'BookOpen',
    locations: [
      { id: 'ed-enroll', name: 'Course Enrollment Desk', x: 20, y: 80, description: 'Course matching & fees check', type: 'Forms' },
      { id: 'ed-pc', name: 'Advanced Computer Lab Alpha', x: 45, y: 25, description: 'AI & machine learning coding rigs', type: 'Classroom' },
      { id: 'ed-iot', name: 'IoT Electronics Workshop', x: 15, y: 35, description: 'Microcontrollers & robotics lab', type: 'Classroom' },
      { id: 'ed-center', name: 'Assessment & Test Center', x: 75, y: 25, description: 'Official skill assessments', type: 'Forms' },
      { id: 'ed-counselor', name: 'Career Counselor Chamber', x: 50, y: 75, description: 'Interview & industry matching', type: 'Consultation' },
      { id: 'ed-lobby', name: 'Student Commons Lobby', x: 80, y: 85, description: 'Relax & study benches', type: 'Attendance' }
    ],
    catalog: [
      { id: 'ed-1', name: 'Advanced Machine Learning Track Enrollment', price: 15000, category: 'Tuition', stock: 45 },
      { id: 'ed-2', name: 'Hands-on IoT Microcontroller Workshop Kit', price: 2500, category: 'Supplies', stock: 120 },
      { id: 'ed-3', name: 'Smart Certificate NFT Generation Fee', price: 500, category: 'Credentials', stock: 999 },
      { id: 'ed-4', name: 'Midterm Practical Assessment Exam Surcharge', price: 1200, category: 'Tuition', stock: 300 },
      { id: 'ed-5', name: 'Executive Career Prep Interview Booking', price: 1500, category: 'Tuition', stock: 50 }
    ],
    formFields: [
      { id: 'edf-1', label: 'Enrollee Full Name', type: 'text', required: true, placeholder: 'e.g. Althea Ramos' },
      { id: 'edf-2', label: 'Desired Core Course Track', type: 'select', required: true, options: ['Machine Learning Engineering', 'Embedded IoT Automation', 'Cloud DevOps Architecture', 'Full-Stack JavaScript'] },
      { id: 'edf-3', label: 'Enrollee Skill Level', type: 'select', required: true, options: ['Complete Beginner', 'Intermediate Developer', 'Advanced Professional'] },
      { id: 'edf-4', label: 'Sponsorship or Subsidy ID', type: 'text', required: false, placeholder: 'Enter TESDA or grant voucher ID...' }
    ],
    workflows: [
      { id: 'edw-1', trigger: 'Course Completed', condition: 'Exam Passed', action: 'Auto-sign smart digital diploma, generate verifiable credentials', isActive: true },
      { id: 'edw-2', trigger: 'Attendance Low', condition: 'Attendance < 75%', action: 'Dispatch alert notifications to student captive portal', isActive: true },
      { id: 'edw-3', trigger: 'Assessment Passed', condition: 'Score >= 80%', action: 'Unlock subsequent advanced microservice modules', isActive: true }
    ],
    samplePrompts: [
      'Enroll in machine learning training track',
      'Issue course graduation certificate for Mark',
      'Unlock drone hardware development module'
    ],
    scenarios: [
      {
        id: 'scenario-ed-1',
        label: '🤖 AI ML Course Enrollment',
        description: 'Simulate student enrolling in Machine Learning course track.',
        portalView: 'FORM',
        clientName: 'Althea Ramos',
        clientPriority: 'LOW',
        formAnswers: {
          'Enrollee Full Name': 'Althea Ramos',
          'Desired Core Course Track': 'Machine Learning Engineering',
          'Enrollee Skill Level': 'Intermediate Developer',
          'Sponsorship or Subsidy ID': 'TESDA-GRANT-9824'
        }
      }
    ]
  },
  E_COMMERCE: {
    id: 'E_COMMERCE',
    name: 'E_COMMERCE',
    label: 'E-Commerce Warehouse & Delivery',
    welcomeText: 'Optimize smart order intake, automated item packing flows, inventory sync checks, and real-time delivery routing.',
    icon: 'Package',
    locations: [
      { id: 'ec-intake', name: 'Purchase Order Ingest Desk', x: 20, y: 80, description: 'Order stream API monitoring', type: 'Forms' },
      { id: 'ec-sorter', name: 'High-Tech Warehouse Sorters', x: 45, y: 25, description: 'Robotic inventory pickup', type: 'Warehouse' },
      { id: 'ec-pack', name: 'Packing & Boxing Stations', x: 15, y: 35, description: 'Self-pack barcode scans', type: 'Warehouse' },
      { id: 'ec-dock', name: 'Cargo Shipping Loading Bays', x: 75, y: 25, description: 'Courier truck loading docks', type: 'Security' },
      { id: 'ec-returns', name: 'Returns Inspection Suite', x: 50, y: 75, description: 'Claims diagnostics area', type: 'Forms' },
      { id: 'ec-dispatch', name: 'Fleet Dispatch Control Hub', x: 80, y: 85, description: 'Live driver tracking board', type: 'Queue' }
    ],
    catalog: [
      { id: 'ec-1', name: 'High-Speed Logistics Order Packing Surcharge', price: 150, category: 'Services', stock: 1000 },
      { id: 'ec-2', name: 'Courier Air Cargo National Shipping Pass', price: 250, category: 'Services', stock: 5000 },
      { id: 'ec-3', name: 'Same-Day Express Courier Delivery Fee', price: 450, category: 'Services', stock: 200 },
      { id: 'ec-4', name: 'Automatic Inventory Reorder Trigger Surcharge', price: 850, category: 'Inventory', stock: 150 }
    ],
    formFields: [
      { id: 'ecf-1', label: 'E-com Merchant Name', type: 'text', required: true, placeholder: 'e.g. Lazada Store-X' },
      { id: 'ecf-2', label: 'Merchant Order Identifier', type: 'text', required: true, placeholder: 'e.g. ORDER-88124-COM' },
      { id: 'ecf-3', label: 'Item Aisle & SKU Code', type: 'select', required: true, options: ['Aisle 4, Shelf B (SKU-ELECT)', 'Aisle 2, Shelf A (SKU-APPAREL)', 'Aisle 1, Shelf D (SKU-ACCESS)'] },
      { id: 'ecf-4', label: 'Delivery Dispatch Target Address', type: 'textarea', required: true, placeholder: 'Enter complete customer shipping address...' }
    ],
    workflows: [
      { id: 'ecw-1', trigger: 'Order Placed', condition: 'True', action: 'Reserve inventory stock, dispatch pick list to sorter', isActive: true },
      { id: 'ecw-2', trigger: 'Item Packed', condition: 'Barcode Scanned', action: 'Generate shipping labels, mark packages as cargo', isActive: true },
      { id: 'ecw-3', trigger: 'Cargo Delivered', condition: 'Customer Signed', action: 'Close ledger transaction, log client feedback', isActive: true }
    ],
    samplePrompts: [
      'Place warehouse order for Lazada Store-X',
      'Reserve stock item in aisle 4',
      'Mark package packed ready for shipping'
    ],
    scenarios: [
      {
        id: 'scenario-ec-1',
        label: '📦 Warehouse Packing Dispatch',
        description: 'Simulate e-commerce merchant dispatching a packing request.',
        portalView: 'FORM',
        clientName: 'Lazada Store-X',
        clientPriority: 'LOW',
        formAnswers: {
          'E-com Merchant Name': 'Lazada Store-X',
          'Merchant Order Identifier': 'ORDER-9821-DEL',
          'Item Aisle & SKU Code': 'Aisle 4, Shelf B (SKU-ELECT)',
          'Delivery Dispatch Target Address': '124 Rizal Avenue, Pasay City'
        }
      }
    ]
  },
  RECRUITMENT: {
    id: 'RECRUITMENT',
    name: 'RECRUITMENT',
    label: 'Recruitment & HR Agency',
    welcomeText: 'Automated candidate tracking, smart resume databases, interview schedules, and recruiter pairings.',
    icon: 'UserCheck',
    locations: [
      { id: 'rec-intake', name: 'Resume Submission Intake Portal', x: 20, y: 80, description: 'Application uploads and screening', type: 'Forms' },
      { id: 'rec-db', name: 'Applicant Resume Database Hub', x: 45, y: 25, description: 'AI profile matching and analytics', type: 'Forms' },
      { id: 'rec-interview', name: 'Interview Coordination Rooms', x: 15, y: 35, description: 'Technical evaluations', type: 'Queue' },
      { id: 'rec-matching', name: 'Recruiter Match Bureau', x: 75, y: 25, description: 'Sourcing and employer alignments', type: 'Consultation' },
      { id: 'rec-clearance', name: 'Candidate Background Clearance', x: 50, y: 75, description: 'Verifications and audits', type: 'Service' },
      { id: 'rec-lounge', name: 'Executive Jobseeker Lounge', x: 80, y: 85, description: 'Elite networking space', type: 'Consultation' }
    ],
    catalog: [
      { id: 'rec-1', name: 'Full Professional Recruiter Assessment', price: 1500, category: 'Services', stock: 50 },
      { id: 'rec-2', name: 'Automated AI Resume Format Diagnostic', price: 250, category: 'Services', stock: 1000 },
      { id: 'rec-3', name: 'Candidate Technical Interview Evaluation', price: 1200, category: 'Services', stock: 300 },
      { id: 'rec-4', name: 'Employer Hiring Retainer Search Fee', price: 5000, category: 'Retainers', stock: 10 },
      { id: 'rec-5', name: 'Executive Background Verification Audit', price: 1000, category: 'Services', stock: 150 }
    ],
    formFields: [
      { id: 'recf-1', label: 'Applicant Full Name', type: 'text', required: true, placeholder: 'e.g. Althea Ramos' },
      { id: 'recf-2', label: 'Primary Tech Specialty', type: 'select', required: true, options: ['Senior React/TypeScript Engineer', 'Mobile Flutter/Kotlin Architect', 'Advanced Python Data Scientist', 'Cloud DevOps Security Specialist'] },
      { id: 'recf-3', label: 'Desired Monthly Salary (₱)', type: 'number', required: true, placeholder: 'e.g. 120000' },
      { id: 'recf-4', label: 'Resume Profile Highlights', type: 'textarea', required: true, placeholder: 'Summary of experience, projects, skills...' }
    ],
    workflows: [
      { id: 'recw-1', trigger: 'Application Submitted', condition: 'Valid Resume', action: 'Assign recruitment officer, queue screening task', isActive: true },
      { id: 'recw-2', trigger: 'Interview Scheduled', condition: 'Checked', action: 'SMS calendar invites to candidate and panel', isActive: true },
      { id: 'recw-3', trigger: 'Hired Status Flagged', condition: 'Cleared', action: 'Update company dashboard metrics, close ticket', isActive: true }
    ],
    samplePrompts: [
      'Submit application form resume for Senior Dev',
      'Schedule interview for Candidate Althea on Tuesday',
      'Assign recruitment officer for applicant screening'
    ],
    scenarios: [
      {
        id: 'scenario-rec-1',
        label: '🤝 Candidate Resume Intake',
        description: 'Simulate candidate submitting professional credentials to database.',
        portalView: 'FORM',
        clientName: 'Althea Ramos',
        clientPriority: 'MEDIUM',
        formAnswers: {
          'Applicant Full Name': 'Althea Ramos',
          'Primary Tech Specialty': 'Senior React/TypeScript Engineer',
          'Desired Monthly Salary (₱)': '120000',
          'Resume Profile Highlights': '5+ years coding complex web apps, certified Cloud DevOps master.'
        }
      }
    ]
  },
  RESEARCH: {
    id: 'RESEARCH',
    name: 'RESEARCH',
    label: 'Research & Science Labs',
    welcomeText: 'Verify bio-sample tags, keep experiment databases updated, log spectrometer values, and book expensive instrument slots.',
    icon: 'FlaskConical',
    locations: [
      { id: 'res-intake', name: 'Sample Intake & Triage Desk', x: 20, y: 80, description: 'Biological sample labeling', type: 'Laboratory' },
      { id: 'res-bench', name: 'Experiment Research Log Benches', x: 45, y: 25, description: 'Wet labs and microscopy', type: 'Laboratory' },
      { id: 'res-server', name: 'Scientific Compute Server Racks', x: 15, y: 35, description: 'High-performance model training', type: 'Laboratory' },
      { id: 'res-results', name: 'Results Screening Room', x: 75, y: 25, description: 'Official data validation', type: 'Forms' },
      { id: 'res-equip', name: 'High-Tech Equipment Chambers', x: 50, y: 75, description: 'Chemical spectrometer bays', type: 'Service' },
      { id: 'res-lounge', name: 'Scholar Peer Lounge', x: 80, y: 85, description: 'Scientific writeup zone', type: 'Consultation' }
    ],
    catalog: [
      { id: 'res-1', name: 'Organic Medical Sample Triage Code', price: 350, category: 'Lab Fees', stock: 1000 },
      { id: 'res-2', name: 'Chemical Spectrometer Analysis Package', price: 3500, category: 'Diagnostics', stock: 45 },
      { id: 'res-3', name: 'Scientific Compute Cluster Hourly Surcharge', price: 2500, category: 'Compute', stock: 100 },
      { id: 'res-4', name: 'Peer-Reviewed Journal Editing Processing Fee', price: 1200, category: 'Admin Fee', stock: 150 },
      { id: 'res-5', name: 'Equipment Chamber Priority Booking Hour', price: 1800, category: 'Lab Fees', stock: 80 }
    ],
    formFields: [
      { id: 'resf-1', label: 'Primary Investigator / Scholar', type: 'text', required: true, placeholder: 'e.g. Dr. Angela Santos' },
      { id: 'resf-2', label: 'Scientific Study Category', type: 'select', required: true, options: ['Biochemical Molecular Analysis', 'Quantum Physics Compute Simulation', 'Clinical Trial Stage 2 Audit'] },
      { id: 'resf-3', label: 'Research Sample Unique Tag', type: 'text', required: true, placeholder: 'e.g. SMP-9821-CELL' },
      { id: 'resf-4', label: 'Experiment Data & Triage Log', type: 'textarea', required: true, placeholder: 'Enter initial chemical results or raw parameters...' }
    ],
    workflows: [
      { id: 'resw-1', trigger: 'Sample Received', condition: 'Barcode Tracked', action: 'Assign lab technician, queue biological prep work', isActive: true },
      { id: 'resw-2', trigger: 'Test Complete', condition: 'Checked', action: 'Auto-upload results, trigger data-set compile task', isActive: true },
      { id: 'resw-3', trigger: 'Equipment Booked', condition: 'Is Paid', action: 'Reserve hardware chamber slot, generate NFC passcode', isActive: true }
    ],
    samplePrompts: [
      'Log sample tag SMP-9821 biochemistry',
      'Book high-res spectrometer equipment chamber',
      'Upload clinical trial results for stage 2'
    ],
    scenarios: [
      {
        id: 'scenario-res-1',
        label: '🔬 Molecular Cell Triage',
        description: 'Simulate clinical investigator tagging cellular bio-samples.',
        portalView: 'FORM',
        clientName: 'Dr. Angela Santos',
        clientPriority: 'HIGH',
        formAnswers: {
          'Primary Investigator / Scholar': 'Dr. Angela Santos',
          'Scientific Study Category': 'Biochemical Molecular Analysis',
          'Research Sample Unique Tag': 'SMP-9821-CELL',
          'Experiment Data & Triage Log': 'Cell structures show high responsive binding to test compounds.'
        }
      }
    ]
  },
  GAMING: {
    id: 'GAMING',
    name: 'GAMING',
    label: 'Gaming Center & Esports Café',
    welcomeText: 'Unlock high-spec RTX 4090 gaming PC rigs, load internet top-up credits, and monitor session billings.',
    icon: 'Gamepad2',
    locations: [
      { id: 'gam-reception', name: 'Account Login & Registration', x: 20, y: 80, description: 'Session card logins & top-ups', type: 'Queue' },
      { id: 'gam-rigsa', name: 'Esports Rig Zone Alpha (RTX 4090)', x: 45, y: 25, description: 'Performance gaming seats 1-12', type: 'Device' },
      { id: 'gam-rigsb', name: 'Esports Rig Zone Beta (RTX 4090)', x: 15, y: 35, description: 'Performance gaming seats 13-24', type: 'Device' },
      { id: 'gam-console', name: 'Consoles Sofa Lounge (PS5 / Switch)', x: 75, y: 25, description: 'Cozy multiplayer couch play', type: 'Device' },
      { id: 'gam-snacks', name: 'Food & Beverage Snack Island', x: 50, y: 75, description: 'Sizzling orders of fries & juices', type: 'Billing' },
      { id: 'gam-vip', name: 'VIP Private Esports Booths', x: 80, y: 85, description: 'Private training team suites', type: 'Device' }
    ],
    catalog: [
      { id: 'gam-1', name: 'RTX 4090 High-Spec PC Rig 1-Hour Time', price: 60, category: 'PC Game Time', stock: 24 },
      { id: 'gam-2', name: 'VIP Private Esports Booth 1-Hour Booking', price: 120, category: 'PC Game Time', stock: 4 },
      { id: 'gam-3', name: 'Consoles Lounge Sofa Couch 1-Hour Booking', price: 50, category: 'Console Time', stock: 6 },
      { id: 'gam-4', name: 'Esports LAN Gigabit Fiber Network Surcharge', price: 25, category: 'PC Game Time', stock: 100 },
      { id: 'gam-5', name: 'Esports Snacks: Cheese Fries & Energy drink', price: 150, category: 'Snacks', stock: 80 }
    ],
    formFields: [
      { id: 'gamf-1', label: 'Gamer Account Username', type: 'text', required: true, placeholder: 'e.g. ProGamer-2026' },
      { id: 'gamf-2', label: 'Requested Station Location', type: 'select', required: true, options: ['Esports Rig Zone Alpha (RTX 4090)', 'VIP Private Esports Booth', 'Consoles Sofa Lounge (PS5)'] },
      { id: 'gamf-3', label: 'PC Game Credits Top-up (₱)', type: 'number', required: true, placeholder: 'Enter amount to credit' },
      { id: 'gamf-4', label: 'Custom Food / Beverage Order', type: 'select', required: false, options: ['Cheese Fries & Energy drink', 'No food orders'] }
    ],
    workflows: [
      { id: 'gamw-1', trigger: 'User Logged In', condition: 'Balance > 0', action: 'Auto-unlock PC station terminal, start active time tracking', isActive: true },
      { id: 'gamw-2', trigger: 'Session Time Expired', condition: 'Balance <= 0', action: 'Lock device terminal block, alert gamer to top-up', isActive: true },
      { id: 'gamw-3', trigger: 'Payment Received', condition: 'Cleared', action: 'Add top-up credits to user ledger, extend station time', isActive: true }
    ],
    samplePrompts: [
      'Simulate user login starting device PC-12',
      'Add ₱100 top-up gaming credits to account',
      'Lock active gaming session for time expired'
    ],
    scenarios: [
      {
        id: 'scenario-gam-1',
        label: '🎮 Gamer Account Top-up',
        description: 'Simulate esports gamer adding load credits to station.',
        portalView: 'FORM',
        clientName: 'ProGamer-2026',
        clientPriority: 'LOW',
        formAnswers: {
          'Gamer Account Username': 'ProGamer-2026',
          'Requested Station Location': 'Esports Rig Zone Alpha (RTX 4090)',
          'PC Game Credits Top-up (₱)': '100',
          'Custom Food / Beverage Order': 'Cheese Fries & Energy drink'
        }
      }
    ]
  },
  SMART_HOME: {
    id: 'SMART_HOME',
    name: 'SMART_HOME',
    label: 'Smart Home & Residential',
    welcomeText: 'Manage residential IoT device controls, security QR visitor clearances, and utility audits.',
    icon: 'Home',
    locations: [
      { id: 'sh-command', name: 'Smart Device Command Hub', x: 20, y: 80, description: 'Central home controller panels', type: 'Device' },
      { id: 'sh-gate', name: 'Front Gate Biometric Keypad', x: 45, y: 25, description: 'External security entry scans', type: 'Security' },
      { id: 'sh-living', name: 'Living Room Smart Sensors', x: 15, y: 35, description: 'Motion, temp, and lighting units', type: 'Device' },
      { id: 'sh-meters', name: 'Smart Utility Meter Area', x: 75, y: 25, description: 'Home energy and water sensors', type: 'Device' },
      { id: 'sh-appliances', name: 'Appliance Hardware Hub', x: 50, y: 75, description: 'Refrigerator and oven IoT ties', type: 'Device' },
      { id: 'sh-lounge', name: 'Living Room Control Couch', x: 80, y: 85, description: 'Comfort control console', type: 'Consultation' }
    ],
    catalog: [
      { id: 'sh-1', name: 'Smart IoT Lighting Network Controller', price: 1500, category: 'IoT Hardware', stock: 15 },
      { id: 'sh-2', name: 'Biometric QR Visitor Entry Key Code', price: 150, category: 'Services', stock: 9999 },
      { id: 'sh-3', name: 'Continuous Smart Utility Usage Audit', price: 500, category: 'Audit', stock: 500 },
      { id: 'sh-4', name: 'Smart Appliance Automation Script Charge', price: 1000, category: 'Services', stock: 120 }
    ],
    formFields: [
      { id: 'shf-1', label: 'Homeowner / Resident Name', type: 'text', required: true, placeholder: 'e.g. Jhon Carlo' },
      { id: 'shf-2', label: 'IoT Control Command Target', type: 'select', required: true, options: ['Smart Front Gate Access Lock', 'Living Room Ambient Light Network', 'Utility Power Meter Auditor', 'Smart Aircon Automation Thermostat'] },
      { id: 'shf-3', label: 'Action Script Requested', type: 'select', required: true, options: ['Issue Guest Biometric QR Key', 'Dim Lights & Run Evening Scene', 'Deduct Power Meter Tally Audit', 'Turn On Aircon Scheduled Time 6PM'] },
      { id: 'shf-4', label: 'Custom Automation Parameters', type: 'textarea', required: false, placeholder: 'Enter any delay parameters or safety guidelines...' }
    ],
    workflows: [
      { id: 'shw-1', trigger: 'Entry Detected', condition: 'Validated', action: 'Log visitor entry timestamp, ping homeowner terminal', isActive: true },
      { id: 'shw-2', trigger: 'Scheduled Automation Run', condition: 'Time Match', action: 'Auto control target smart appliances, update state logs', isActive: true },
      { id: 'shw-3', trigger: 'Security Alert Triggered', condition: 'Intrusion Check', action: 'Flash alarm logs, auto notify admin command station', isActive: true }
    ],
    samplePrompts: [
      'Create guest QR visitor pass for delivery',
      'Auto turn on aircon lights scheduled time 6 PM',
      'Log front gate biometric check-in log'
    ],
    scenarios: [
      {
        id: 'scenario-sh-1',
        label: '🏠 Resident Device Automation',
        description: 'Simulate resident setting up aircon schedule commands.',
        portalView: 'FORM',
        clientName: 'Jhon Carlo',
        clientPriority: 'LOW',
        formAnswers: {
          'Homeowner / Resident Name': 'Jhon Carlo',
          'IoT Control Command Target': 'Smart Aircon Automation Thermostat',
          'Action Script Requested': 'Turn On Aircon Scheduled Time 6PM',
          'Custom Automation Parameters': 'Temperature target 23°C, auto-shutoff if no motion for 2 hours.'
        }
      }
    ]
  },
  SPORTS: {
    id: 'SPORTS',
    name: 'SPORTS',
    label: 'Sports & Recreation Facility',
    welcomeText: 'Seamless badminton and tennis court schedules, tournament bracket coordinates, and active scoreboards.',
    icon: 'Trophy',
    locations: [
      { id: 'sp-reception', name: 'Facility Booking Reception', x: 20, y: 80, description: 'Court check-in and reservations', type: 'Forms' },
      { id: 'sp-courts', name: 'Badminton & Tennis Court Bay', x: 45, y: 25, description: 'Interactive playing zones', type: 'Service' },
      { id: 'sp-brackets', name: 'Central Tournament Control Hub', x: 15, y: 35, description: 'Playoff bracket coordinators', type: 'Forms' },
      { id: 'sp-scoreboard', name: 'Central Live Scoreboard Display', x: 75, y: 25, description: 'Simulated game stats feed', type: 'Service' },
      { id: 'sp-lockers', name: 'Sports Equipment Lockers', x: 50, y: 75, description: 'Member card NFC lockers', type: 'Security' },
      { id: 'sp-lounge', name: 'Premium Lounge & Juice Bar', x: 80, y: 85, description: 'VIP hydration zone', type: 'Consultation' }
    ],
    catalog: [
      { id: 'sp-1', name: 'Premium Badminton Court 1-Hour Booking', price: 350, category: 'Court Rentals', stock: 10 },
      { id: 'sp-2', name: 'Official Master Tournament Registration Surcharge', price: 800, category: 'Tournaments', stock: 64 },
      { id: 'sp-3', name: 'Sports Academy Athlete Profile Registry', price: 300, category: 'Academy', stock: 500 },
      { id: 'sp-4', name: 'Live Digital Scoreboard Integration Pass', price: 200, category: 'Audits', stock: 120 },
      { id: 'sp-5', name: 'VIP Locker Facility Premium Pass', price: 150, category: 'Court Rentals', stock: 100 }
    ],
    formFields: [
      { id: 'spf-1', label: 'Athlete / Lead Player', type: 'text', required: true, placeholder: 'e.g. Althea Ramos' },
      { id: 'spf-2', label: 'Facility Resource Selection', type: 'select', required: true, options: ['Premium Badminton Court 3', 'Tennis Court Alpha (Hardcourt)', 'Pro-Slam Basket Court 1'] },
      { id: 'spf-3', label: 'Game Registration Intent', type: 'select', required: true, options: ['Reserve General 1-Hour Playing Slot', 'Register Official Master Tournament Bracket', 'Athlete Performance Profile Log'] },
      { id: 'spf-4', label: 'Match Player Bracket Partners', type: 'textarea', required: false, placeholder: 'Enter player names, opponent rosters, team tags...' }
    ],
    workflows: [
      { id: 'spw-1', trigger: 'Booking Confirmed', condition: 'Checked', action: 'Reserve court physical resource, print NFC ticket', isActive: true },
      { id: 'spw-2', trigger: 'Game Finished', condition: 'Scores Submitted', action: 'Update scoreboard display, increment player stats', isActive: true },
      { id: 'spw-3', trigger: 'Tournament Stage Triggered', condition: 'True', action: 'Auto notify team rosters, schedule play-off times', isActive: true }
    ],
    samplePrompts: [
      'Book badminton court 3 for 8:00 AM',
      'Register team score 21-18 for match Alpha',
      'Update athlete performance profile log'
    ],
    scenarios: [
      {
        id: 'scenario-sports-1',
        label: '🏆 Master Tournament Registry',
        description: 'Simulate athlete registering for local doubles playoff bracket.',
        portalView: 'FORM',
        clientName: 'Althea Ramos',
        clientPriority: 'LOW',
        formAnswers: {
          'Athlete / Lead Player': 'Althea Ramos',
          'Facility Resource Selection': 'Premium Badminton Court 3',
          'Game Registration Intent': 'Register Official Master Tournament Bracket',
          'Match Player Bracket Partners': 'Partner: Beatriz Tan. Team Tag: Blue Smashers.'
        }
      }
    ]
  }
};
