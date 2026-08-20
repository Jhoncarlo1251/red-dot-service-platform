export type IndustryType = 'SCHOOL' | 'HOSPITAL' | 'RESTAURANT' | 'GOVERNMENT' | 'RETAIL' | 'TRANSPORT' | 'INSURANCE' | 'TELECOM' | 'ENERGY' | 'MEDIA' | 'FREELANCE' | 'SECURITY' | 'NON_PROFIT' | 'RELIGIOUS' | 'BEAUTY' | 'REPAIR' | 'EDUCATION_ADV' | 'E_COMMERCE' | 'RECRUITMENT' | 'RESEARCH' | 'GAMING' | 'SMART_HOME' | 'SPORTS';

export interface QueueItem {
  id: string;
  number: string;
  name: string;
  serviceType: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'EMERGENCY';
  status: 'WAITING' | 'SERVING' | 'COMPLETED' | 'MISSED';
  timestamp: string;
  waitTimeMinutes: number;
}

export interface Transaction {
  id: string;
  clientName: string;
  service: string;
  details: string;
  amount: number;
  status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED';
  timestamp: string;
  reference: string;
  isLocalOnly: boolean; // Indicates if stored locally in the offline buffer
  industry: IndustryType;
}

export interface FormConfig {
  id: string;
  title: string;
  description: string;
  fields: {
    id: string;
    label: string;
    type: 'text' | 'number' | 'select' | 'textarea' | 'checkbox';
    placeholder?: string;
    required: boolean;
    options?: string[];
  }[];
}

export interface SystemLog {
  id: string;
  timestamp: string;
  level: 'info' | 'warn' | 'error' | 'success';
  source: 'CLIENT_PORTAL' | 'LOCAL_SERVER' | 'CLOUD_SYNC' | 'AI_ENGINE';
  message: string;
}

export interface WorkflowRule {
  id: string;
  trigger: string;
  condition: string;
  action: string;
  isActive: boolean;
}

export interface AttendanceRecord {
  id: string;
  studentId: string;
  name: string;
  gradeSection: string;
  timestamp: string;
  status: 'PRESENT' | 'LATE';
}

export interface ProductItem {
  id: string;
  name: string;
  price: number;
  category: string;
  stock: number;
  image?: string;
}
