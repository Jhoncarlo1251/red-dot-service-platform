import React, { useState, useEffect, useRef } from 'react';
import {
  Wifi,
  WifiOff,
  Database,
  RefreshCw,
  Play,
  Trash2,
  Plus,
  CheckCircle,
  Clock,
  ArrowRight,
  Users,
  QrCode,
  FileText,
  LayoutDashboard,
  Coins,
  GraduationCap,
  HeartPulse,
  Utensils,
  Building,
  ShoppingBag,
  Bus,
  Wrench,
  Sliders,
  X,
  AlertTriangle,
  Info,
  ChevronRight,
  Sparkles,
  Smartphone,
  Map,
  ShieldCheck,
  Zap,
  Clapperboard,
  Briefcase,
  Shield,
  Heart,
  Compass,
  BookOpen,
  Package,
  UserCheck,
  FlaskConical,
  Gamepad2,
  Home,
  Trophy
} from 'lucide-react';
import { QueueItem, Transaction, SystemLog, WorkflowRule, AttendanceRecord, ProductItem, IndustryType } from './types';
import { INDUSTRY_DATA } from './industryData';
import AIAssistantWidget from './components/AIAssistantWidget';
import { RoleDashboards } from './components/RoleDashboards';

const getIndustryLocations = (industry: IndustryType) => {
  return INDUSTRY_DATA[industry]?.locations || [];
};

const renderIndustryIcon = (iconName: string, size = 16, className?: string) => {
  const IconComponent: any = {
    Utensils,
    HeartPulse,
    GraduationCap,
    Building,
    ShoppingBag,
    Bus,
    Wrench,
    Smartphone,
    ShieldCheck,
    Zap,
    Clapperboard,
    Briefcase,
    Shield,
    Heart,
    Compass,
    Sparkles,
    BookOpen,
    Package,
    UserCheck,
    FlaskConical,
    Gamepad2,
    Home,
    Trophy
  }[iconName] || Smartphone;
  
  return <IconComponent size={size} className={className} />;
};

const getToolStatus = (toolNum: number, userType: string, industry: IndustryType, role: string): 'ACTIVE' | 'STANDBY' => {
  if (role === 'ADMIN_OWNER') return 'ACTIVE';
  
  switch (toolNum) {
    case 1: // Identity & Access
      return 'ACTIVE';
    case 2: // Queue & Appointment
      return ['STUDENT', 'PATIENT', 'CUSTOMER', 'CITIZEN', 'SME', 'SCHOOL', 'HOSPITAL', 'GOVERNMENT', 'TRANSPORT'].includes(userType) ? 'ACTIVE' : 'STANDBY';
    case 3: // Forms & Data Collection
      return ['STUDENT', 'PATIENT', 'CITIZEN', 'EMPLOYEE', 'FREELANCER', 'SCHOOL', 'HOSPITAL', 'GOVERNMENT'].includes(userType) ? 'ACTIVE' : 'STANDBY';
    case 4: // Task & Workflow
      return ['EMPLOYEE', 'FREELANCER', 'SME', 'ENTERPRISE', 'CORPORATION'].includes(userType) || ['SCHOOL', 'HOSPITAL', 'GOVERNMENT'].includes(industry) ? 'ACTIVE' : 'STANDBY';
    case 5: // Transaction & Payment
      return ['CUSTOMER', 'SME', 'ENTERPRISE', 'FREELANCER', 'RETAIL', 'RESTAURANT', 'TRANSPORT'].includes(userType) ? 'ACTIVE' : 'STANDBY';
    case 6: // Communication Layer
      return 'ACTIVE';
    case 7: // File & Content
      return ['STUDENT', 'CITIZEN', 'EMPLOYEE', 'FREELANCER', 'SCHOOL', 'GOVERNMENT'].includes(userType) ? 'ACTIVE' : 'STANDBY';
    case 8: // Analytics & Reporting
      return ['ADMIN_OWNER', 'MANAGER_SUPERVISOR'].includes(role) ? 'ACTIVE' : 'STANDBY';
    case 9: // Automation Engine
      return ['ADMIN_OWNER', 'MANAGER_SUPERVISOR'].includes(role) ? 'ACTIVE' : 'STANDBY';
    case 10: // Offline-First System
      return 'ACTIVE';
    default:
      return 'STANDBY';
  }
};

export default function App() {
  // Current active profile
  const [currentIndustry, setCurrentIndustry] = useState<IndustryType>('RESTAURANT');

  // User & Client Classification & Context Engine States
  const [clientCategory, setClientCategory] = useState<'INDIVIDUAL' | 'BUSINESS'>('INDIVIDUAL');
  const [userType, setUserType] = useState<string>('STUDENT');
  const [userRole, setUserRole] = useState<'ADMIN_OWNER' | 'MANAGER_SUPERVISOR' | 'STAFF_WORKER' | 'END_USER_CUSTOMER'>('ADMIN_OWNER');
  const [broadcastMsg, setBroadcastMsg] = useState('All offline microservices are active on local LAN. Sync automatically on connection recovery.');

  // Live Task Management
  const [taskList, setTaskList] = useState<any[]>([
    { id: 'tsk-1', title: 'Prep Pork Sisig Ingredients & Rice Cooker', assignee: 'Chef Juan', status: 'IN_PROGRESS', industry: 'RESTAURANT' },
    { id: 'tsk-2', title: 'Clear table 3 for next reservations', assignee: 'Staff Ana', status: 'PENDING', industry: 'RESTAURANT' },
    { id: 'tsk-3', title: 'Pre-check oxygen inventory in ward A', assignee: 'Nurse Ramos', status: 'IN_PROGRESS', industry: 'HOSPITAL' },
    { id: 'tsk-4', title: 'Prepare ER trauma cart medications', assignee: 'Doctor Cruz', status: 'PENDING', industry: 'HOSPITAL' },
    { id: 'tsk-5', title: 'Review student scholarship clearance documents', assignee: 'Registrar Tan', status: 'PENDING', industry: 'SCHOOL' },
    { id: 'tsk-6', title: 'Check Science Lab chemical stock level', assignee: 'Prof Santos', status: 'COMPLETED', industry: 'SCHOOL' },
    { id: 'tsk-7', title: 'Review Barangay Business Permit applications', assignee: 'Officer Dela Cruz', status: 'IN_PROGRESS', industry: 'GOVERNMENT' },
    { id: 'tsk-8', title: 'Print Community Tax Cedula receipts', assignee: 'Clerk Maria', status: 'PENDING', industry: 'GOVERNMENT' },
    { id: 'tsk-9', title: 'Scan and match inventory barcode 5021', assignee: 'Cashier Sienna', status: 'COMPLETED', industry: 'RETAIL' },
    { id: 'tsk-10', title: 'Refuel incoming terminal shuttle bus B', assignee: 'Driver Jose', status: 'IN_PROGRESS', industry: 'TRANSPORT' }
  ]);

  const handleUserTypeChange = (type: string, category?: 'INDIVIDUAL' | 'BUSINESS') => {
    setUserType(type);
    if (category) setClientCategory(category);
    
    // Map selected profile to standard Industry profile (Supports All 23 Industries!)
    let targetIndustry: IndustryType = 'RESTAURANT';
    if (type === 'STUDENT' || type === 'SCHOOL') targetIndustry = 'SCHOOL';
    else if (type === 'PATIENT' || type === 'HOSPITAL') targetIndustry = 'HOSPITAL';
    else if (type === 'CUSTOMER') targetIndustry = 'RESTAURANT';
    else if (type === 'SHOPPER' || type === 'SME') targetIndustry = 'RETAIL';
    else if (type === 'PASSENGER') targetIndustry = 'TRANSPORT';
    else if (type === 'CLAIMANT') targetIndustry = 'INSURANCE';
    else if (type === 'SUBSCRIBER') targetIndustry = 'TELECOM';
    else if (type === 'UTILITY_CONSUMER') targetIndustry = 'ENERGY';
    else if (type === 'PRODUCER') targetIndustry = 'MEDIA';
    else if (type === 'FREELANCER') targetIndustry = 'FREELANCE';
    else if (type === 'VISITOR') targetIndustry = 'SECURITY';
    else if (type === 'DONOR' || type === 'NGO') targetIndustry = 'NON_PROFIT';
    else if (type === 'CONGREGANT') targetIndustry = 'RELIGIOUS';
    else if (type === 'SPA_GUEST') targetIndustry = 'BEAUTY';
    else if (type === 'DEVICE_OWNER') targetIndustry = 'REPAIR';
    else if (type === 'ENROLLEE') targetIndustry = 'EDUCATION_ADV';
    else if (type === 'MERCHANT') targetIndustry = 'E_COMMERCE';
    else if (type === 'APPLICANT' || type === 'ENTERPRISE' || type === 'CORPORATION' || type === 'EMPLOYEE') targetIndustry = 'RECRUITMENT';
    else if (type === 'SCHOLAR') targetIndustry = 'RESEARCH';
    else if (type === 'GAMER') targetIndustry = 'GAMING';
    else if (type === 'RESIDENT') targetIndustry = 'SMART_HOME';
    else if (type === 'ATHLETE') targetIndustry = 'SPORTS';
    else if (type === 'CITIZEN' || type === 'GOVERNMENT') targetIndustry = 'GOVERNMENT';
    
    // Switch industry silently (Invisible Intelligence Layer)
    handleIndustryChange(targetIndustry);
    
    // Clean up states
    setClientName('');
    setClientServiceType('');
    setClientFormAnswers({});
    setCart({});
  };
  
  // Offline state tracker (Simulates local server losing WAN uplink to central SaaS Cloud, but keeping LAN captive portal functioning!)
  const [isOnline, setIsOnline] = useState<boolean>(true);
  const [syncing, setSyncing] = useState<boolean>(false);
  const [portalView, setPortalView] = useState<'HOME' | 'QUEUE' | 'FORM' | 'MENU' | 'ATTENDANCE' | 'MAP'>('HOME');
  const [kioskAccessMethod, setKioskAccessMethod] = useState<'TOUCHSCREEN_KIOSK' | 'QR_CODE_MOBILE' | 'TABLET_STATION' | 'CUSTOMER_DEVICE'>('TOUCHSCREEN_KIOSK');
  
  // Interactive Floorplan State
  const [userLocation, setUserLocation] = useState<{ x: number; y: number }>({ x: 30, y: 75 });
  const [selectedLocationId, setSelectedLocationId] = useState<string>('');
  const [adminTab, setAdminTab] = useState<'DASHBOARD' | 'QUEUES' | 'PROCESS_ENGINE' | 'FORMS_ENGINE' | 'AUTOMATION_BUILDER' | 'DATA_INTELLIGENCE' | 'TRANSACTIONS' | 'LOGS'>('DASHBOARD');
  
  // Adaptive Dashboard Sub-Tabs State
  const [customerSubTab, setCustomerSubTab] = useState<'STATUS' | 'SERVICES' | 'ORDERS' | 'REQUESTS'>('STATUS');
  const [staffSubTab, setStaffSubTab] = useState<'QUEUE' | 'TASKS' | 'TRANSACTIONS' | 'NOTIFICATIONS'>('QUEUE');
  const [managerSubTab, setManagerSubTab] = useState<'ANALYTICS' | 'REPORTS' | 'PERFORMANCE'>('ANALYTICS');
  const [ownerSubTab, setOwnerSubTab] = useState<'INSIGHTS' | 'USERS' | 'SETTINGS'>('INSIGHTS');

  // Global App States - Synchronized with local Node.js back-end REST points
  const [queueList, setQueueList] = useState<QueueItem[]>([]);
  const [transactionList, setTransactionList] = useState<Transaction[]>([]);
  const [attendanceList, setAttendanceList] = useState<AttendanceRecord[]>([]);
  const [logs, setLogs] = useState<SystemLog[]>([]);

  // Client Offline Local Cache Buffer (Used to show true Offline-First Capabilities before remote Cloud uplink synchronization)
  const [offlineTxnBuffer, setOfflineTxnBuffer] = useState<Transaction[]>([]);
  const [offlineQueueBuffer, setOfflineQueueBuffer] = useState<QueueItem[]>([]);

  // Form Builder Builder states seeded dynamically from active industry
  const [workflowRules, setWorkflowRules] = useState<WorkflowRule[]>(INDUSTRY_DATA['RESTAURANT']?.workflows || []);

  // Form Builder fields state seeded dynamically from active industry
  const [customFields, setCustomFields] = useState<any[]>(INDUSTRY_DATA['RESTAURANT']?.formFields || []);
  const [newFieldName, setNewFieldName] = useState('');
  const [newFieldType, setNewFieldType] = useState<'text' | 'number' | 'select' | 'textarea'>('text');
  const [newFieldOptions, setNewFieldOptions] = useState('');

  // Client input states inside Captive Portal
  const [clientName, setClientName] = useState('');
  const [clientServiceType, setClientServiceType] = useState('');
  const [clientPriority, setClientPriority] = useState<'LOW' | 'MEDIUM' | 'HIGH' | 'EMERGENCY'>('MEDIUM');
  const [clientFormAnswers, setClientFormAnswers] = useState<Record<string, string>>({});

  // School Module Specific state
  const [studentIdInput, setStudentIdInput] = useState('');
  const [studentNameInput, setStudentNameInput] = useState('');
  const [studentGradeInput, setStudentGradeInput] = useState('Grade 12 - Einstein');

  // Unified shopping/booking cart
  const [cart, setCart] = useState<Record<string, number>>({});

  // Local notifications inside demo
  const [demoNotification, setDemoNotification] = useState<string | null>(null);

  // Fetch state on mount and during sync
  const loadDatabaseState = async () => {
    try {
      const res = await fetch('/api/state');
      if (res.ok) {
        const data = await res.json();
        setQueueList(data.queueList);
        setTransactionList(data.transactionList);
        setAttendanceList(data.attendanceList);
        setLogs(data.systemLogs);
      }
    } catch (e) {
      console.warn('Backend failed to load, falling back to client-side buffer states.', e);
    }
  };

  useEffect(() => {
    loadDatabaseState();
    const interval = setInterval(loadDatabaseState, 6000);
    return () => clearInterval(interval);
  }, []);

  // Post system logs locally & server-side
  const addSystemLog = async (level: 'info' | 'warn' | 'error' | 'success', message: string) => {
    const timestamp = new Date().toISOString();
    const localLogObj: SystemLog = {
      id: `log-${Date.now()}`,
      timestamp,
      level,
      source: 'LOCAL_SERVER',
      message
    };
    
    // Optimistic UI updates
    setLogs(prev => [localLogObj, ...prev]);

    try {
      await fetch('/api/logs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ level, source: 'LOCAL_SERVER', message })
      });
    } catch (err) {
      console.log('Buffered log to memory: Offline execution mode in progress.');
    }
  };

  // Helper trigger notification
  const triggerDemoAlert = (msg: string) => {
    setDemoNotification(msg);
    setTimeout(() => {
      setDemoNotification(null);
    }, 5000);
  };

  // Interactive operational task completion toggler
  const toggleTaskStatus = (id: string) => {
    setTaskList(prev => prev.map(t => {
      if (t.id === id) {
        const nextStatus = t.status === 'COMPLETED' ? 'PENDING' : 'COMPLETED';
        addSystemLog('success', `Staff Dispatch checked task [${t.title}] as ${nextStatus}.`);
        return { ...t, status: nextStatus };
      }
      return t;
    }));
  };

  // Switch Active Industry Profile
  const handleIndustryChange = (industry: IndustryType) => {
    setCurrentIndustry(industry);
    setPortalView('HOME');
    setCustomFields(INDUSTRY_DATA[industry]?.formFields || []);
    setWorkflowRules(INDUSTRY_DATA[industry]?.workflows || []);
    setCart({});
    addSystemLog('info', `OSMOS reconfigured localized firmware preset for [${industry}] industry.`);
    triggerDemoAlert(`Industry profile updated! Configured workflows and QR access schemas for ${industry}.`);
  };

  // Queue System: Client Joins
  const handleJoinQueue = async (customName?: string, customService?: string) => {
    const nameToUse = customName || clientName || 'Guest Visitor';
    const serviceToUse = customService || clientServiceType || (currentIndustry === 'HOSPITAL' ? 'General Checkup' : 'Service Desk Counter');

    if (isOnline) {
      try {
        const res = await fetch('/api/queue/join', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: nameToUse,
            serviceType: serviceToUse,
            priority: clientPriority,
            industry: currentIndustry
          })
        });
        if (res.ok) {
          const newItem = await res.json();
          setQueueList(prev => [...prev, newItem]);
          triggerDemoAlert(`Success! Issued ticket: ${newItem.number}. Wait time: ${newItem.waitTimeMinutes} mins.`);
          setClientName('');
          setClientServiceType('');
        }
      } catch (e) {
        addSystemLog('error', 'Network failure joining online queue, auto-fallback to Local Cache Buffer.');
        saveQueueOffline(nameToUse, serviceToUse);
      }
    } else {
      saveQueueOffline(nameToUse, serviceToUse);
    }
  };

  const saveQueueOffline = (name: string, service: string) => {
    const prefix = currentIndustry.substring(0, 1);
    const count = queueList.length + offlineQueueBuffer.length + 1;
    const queueNum = `${prefix}-${count.toString().padStart(3, '0')}-OFFLINE`;
    
    const localQueueItem: QueueItem = {
      id: `offline-q-${Date.now()}`,
      number: queueNum,
      name,
      serviceType: service,
      priority: clientPriority,
      status: 'WAITING',
      timestamp: new Date().toISOString(),
      waitTimeMinutes: Math.floor(Math.random() * 15) + 5
    };

    setOfflineQueueBuffer(prev => [...prev, localQueueItem]);
    addSystemLog('warn', `[Offline Captive Cache] Saved queue ticket ${queueNum} locally in offline RAM disk buffer.`);
    triggerDemoAlert(`Offline Ticket Issued! ${queueNum} saved to SQLite Buffer.`);
    setClientName('');
    setClientServiceType('');
  };

  // Staff action: Serve / Complete Queue
  const handleUpdateQueueStatus = async (id: string, nextStatus: 'SERVING' | 'COMPLETED' | 'MISSED') => {
    if (id.startsWith('offline-')) {
      // Offline queue updates stay local
      setOfflineQueueBuffer(prev =>
        prev.map(item => (item.id === id ? { ...item, status: nextStatus } : item))
      );
      addSystemLog('info', `Updated buffered queue state [${id}] to ${nextStatus}.`);
      return;
    }

    try {
      const res = await fetch('/api/queue/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: nextStatus })
      });
      if (res.ok) {
        const updated = await res.json();
        setQueueList(prev => prev.map(item => (item.id === id ? updated : item)));
        addSystemLog('success', `Queue slot ${updated.number} successfully processed to status: ${nextStatus}.`);
      }
    } catch (err) {
      addSystemLog('error', 'Could not update online queue status over local connection.');
    }
  };

  // Transactions: Client processes order
  const handlePlaceOrder = async (orderTitle: string, total: number, orderDetails: string) => {
    const buyerName = clientName || 'Anonymous Client';
    
    const transactionPayload = {
      clientName: buyerName,
      service: orderTitle,
      details: orderDetails,
      amount: total,
      isLocalOnly: !isOnline,
      industry: currentIndustry
    };

    if (isOnline) {
      try {
        const res = await fetch('/api/transaction/create', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(transactionPayload)
        });
        if (res.ok) {
          const newTxn = await res.json();
          setTransactionList(prev => [...prev, newTxn]);
          triggerDemoAlert(`Transaction finalized! Receipt Ref: ${newTxn.reference}`);
          setCart({});
          setClientName('');
        }
      } catch (err) {
        saveTransactionOffline(transactionPayload);
      }
    } else {
      saveTransactionOffline(transactionPayload);
    }
  };

  const saveTransactionOffline = (payload: any) => {
    const refNum = `TXN-${currentIndustry.substring(0, 3)}-OFFLINE-${Math.floor(1000 + Math.random() * 9000)}`;
    const offlineTxn: Transaction = {
      id: `offline-t-${Date.now()}`,
      clientName: payload.clientName,
      service: payload.service,
      details: payload.details,
      amount: payload.amount,
      status: 'PENDING',
      timestamp: new Date().toISOString(),
      reference: refNum,
      isLocalOnly: true,
      industry: currentIndustry
    };

    setOfflineTxnBuffer(prev => [...prev, offlineTxn]);
    addSystemLog('warn', `[Captive Local Storage] Cached Transaction ${refNum} (₱${payload.amount}) to local offline SQLite buffer.`);
    triggerDemoAlert(`Offline Mode Active! Cache written to system storage. Reference: ${refNum}`);
    setCart({});
    setClientName('');
  };

  // School Attendance Record Submit
  const handleAttendanceCheckin = async () => {
    if (!studentIdInput.trim() || !studentNameInput.trim()) {
      alert('Please fill out student ID and Name.');
      return;
    }

    const payload = {
      studentId: studentIdInput,
      name: studentNameInput,
      gradeSection: studentGradeInput
    };

    if (isOnline) {
      try {
        const res = await fetch('/api/attendance/checkin', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        if (res.ok) {
          const newRecord = await res.json();
          setAttendanceList(prev => [...prev, newRecord]);
          triggerDemoAlert(`Attendance checked in for student ${newRecord.name}!`);
          setStudentIdInput('');
          setStudentNameInput('');
        }
      } catch (err) {
        saveAttendanceOffline(payload);
      }
    } else {
      saveAttendanceOffline(payload);
    }
  };

  const saveAttendanceOffline = (payload: any) => {
    const localRecord: AttendanceRecord = {
      id: `offline-a-${Date.now()}`,
      studentId: payload.studentId,
      name: payload.name,
      gradeSection: payload.gradeSection,
      timestamp: new Date().toISOString(),
      status: new Date().getHours() >= 8 ? 'LATE' : 'PRESENT'
    };

    setAttendanceList(prev => [...prev, localRecord]);
    addSystemLog('warn', `[Offline SQLite Storage] Attendance checkin saved in offline table for ${payload.name}`);
    triggerDemoAlert(`Offline Attendance Logged! Synced to local buffer.`);
    setStudentIdInput('');
    setStudentNameInput('');
  };

  // Manual Trigger Force Sync (Simulate Offline server recovering cloud access!)
  const handleForceSync = async () => {
    if (!isOnline) {
      triggerDemoAlert('Cannot sync while Local Network Uplink is Disabled! Please toggle Connection to Online first.');
      addSystemLog('error', 'Database synchronization aborted: WAN Uplink state set to OFFLINE.');
      return;
    }

    if (offlineTxnBuffer.length === 0 && offlineQueueBuffer.length === 0) {
      triggerDemoAlert('All local databases are completely in sync with central SaaS Tenant.');
      return;
    }

    setSyncing(true);
    addSystemLog('info', `Initiating bulk WAN synchronization. Transferring state objects to central cloud endpoint...`);

    try {
      const res = await fetch('/api/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          transactions: offlineTxnBuffer,
          queueItems: offlineQueueBuffer
        })
      });

      if (res.ok) {
        const data = await res.json();
        setQueueList(data.queueList);
        setTransactionList(data.transactionList);
        setOfflineTxnBuffer([]);
        setOfflineQueueBuffer([]);
        triggerDemoAlert('Synchronization complete! Synchronized SQLite tables to Remote Cloud SaaS.');
        addSystemLog('success', `Enterprise sync completed successfully. Cleared local buffers.`);
      }
    } catch (e) {
      addSystemLog('error', 'Synchronization handshake failed due to transport timeouts.');
    } finally {
      setSyncing(false);
    }
  };

  // Reset demo
  const handleResetDemo = async () => {
    try {
      await fetch('/api/reset', { method: 'POST' });
      setOfflineTxnBuffer([]);
      setOfflineQueueBuffer([]);
      setCart({});
      loadDatabaseState();
      triggerDemoAlert('Demo simulation has been reset to pristine investor state.');
    } catch (err) {
      console.error(err);
    }
  };

  // AI smart callback handler from AIAssistantWidget
  const handleAIAssistantAction = (action: string, target: string, data: any, message: string) => {
    // Switch client captive portal view instantly if target matched
    if (target) {
      const targetViewMap: Record<string, 'HOME' | 'QUEUE' | 'FORM' | 'MENU' | 'ATTENDANCE' | 'MAP'> = {
        'menu': 'MENU',
        'queue': 'QUEUE',
        'forms': 'FORM',
        'attendance': 'ATTENDANCE',
        'dashboard': 'HOME',
        'map': 'MAP',
        'floorplan': 'MAP'
      };
      if (targetViewMap[target]) {
        setPortalView(targetViewMap[target]);
      }
    }

    // Process specific actions
    if (action === 'ORDER') {
      const activeCatalog = INDUSTRY_DATA[currentIndustry]?.catalog || [];
      if (activeCatalog.length > 0) {
        // Preset some items in the dynamic catalog
        const item1 = activeCatalog[0];
        const item2 = activeCatalog[1] || activeCatalog[0];
        setCart({ [item1.id]: 1, [item2.id]: 1 });
        triggerDemoAlert(`AI automated selection: Added ${item1.name} to checkout cart!`);
      } else {
        triggerDemoAlert('No catalog items available for this industry profile.');
      }
    } else if (action === 'QUEUE') {
      handleJoinQueue(data.name || 'AI Guest Prompt', data.purpose || 'Auto Queue Service');
    } else if (action === 'REGISTER_ATTENDANCE') {
      if (currentIndustry === 'SCHOOL') {
        setStudentIdInput(data.studentId || 'STUD-2026-AI');
        setStudentNameInput(data.name || 'Smart Assistant Pupil');
        triggerDemoAlert('AI populated classroom attendance registration template.');
      }
    }
  };

  // Add field to Dynamic Form builder
  const handleAddField = () => {
    if (!newFieldName.trim()) return;
    const opts = newFieldOptions ? newFieldOptions.split(',').map(s => s.trim()) : undefined;
    const newF = {
      id: `f-${Date.now()}`,
      label: newFieldName,
      type: newFieldType,
      required: true,
      options: opts
    };
    setCustomFields(prev => [...prev, newF]);
    setNewFieldName('');
    setNewFieldOptions('');
    addSystemLog('info', `SaaS dynamic Form Builder added new custom element: "${newF.label}"`);
  };

  const handleRemoveField = (id: string) => {
    setCustomFields(prev => prev.filter(f => f.id !== id));
  };

  // Handle Dynamic form submissions
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const detailsStr = Object.entries(clientFormAnswers)
      .map(([key, val]) => `${key}: ${val}`)
      .join(', ');

    handlePlaceOrder('Custom Document Request', 150, detailsStr || 'Completed certification submission form.');
    setClientFormAnswers({});
    setPortalView('HOME');
  };

  // Trigger a predefined investor scenario dynamically from INDUSTRY_DATA configuration
  const handleTriggerScenario = (scenario: any) => {
    // 1. Reconfigure active industry preset first if different
    const targetInd = Object.values(INDUSTRY_DATA).find(
      ind => ind.scenarios && ind.scenarios.some(s => s.id === scenario.id)
    );
    if (targetInd && targetInd.id !== currentIndustry) {
      handleIndustryChange(targetInd.id);
    }

    // 2. Switch portal view instantly
    if (scenario.portalView) {
      setPortalView(scenario.portalView);
    }
    
    // 3. Populate client info fields
    if (scenario.clientName) {
      setClientName(scenario.clientName);
    }
    if (scenario.clientServiceType) {
      setClientServiceType(scenario.clientServiceType);
    }
    if (scenario.clientPriority) {
      setClientPriority(scenario.clientPriority);
    }
    
    // 4. Populate dynamic form fields
    if (scenario.formAnswers) {
      setClientFormAnswers(scenario.formAnswers);
    } else {
      setClientFormAnswers({});
    }
    
    // 5. Populate booking cart items
    if (scenario.orderItems) {
      setCart(scenario.orderItems);
    } else {
      setCart({});
    }
    
    // 6. Populate school attendance parameters if active
    if (scenario.attendanceData) {
      setStudentIdInput(scenario.attendanceData.studentId || '');
      setStudentNameInput(scenario.attendanceData.name || '');
      setStudentGradeInput(scenario.attendanceData.gradeSection || 'Grade 12 - Einstein');
    }

    addSystemLog('success', `Scenario Triggered: ${scenario.label} - ${scenario.description}`);
    triggerDemoAlert(`Scenario Active: ${scenario.label}`);
  };

  // Calculate dynamic cart metrics from the active industry's services catalog
  const getCartTotal = () => {
    const activeCatalog = INDUSTRY_DATA[currentIndustry]?.catalog || [];
    return Object.entries(cart).reduce((sum, [id, qty]) => {
      const prod = activeCatalog.find(p => p.id === id);
      return sum + (prod ? prod.price * Number(qty) : 0);
    }, 0);
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col font-sans relative antialiased" id="app-root-container">
      
      {/* Dynamic Header Notification Toast */}
      {demoNotification && (
        <div className="fixed top-4 right-4 z-50 max-w-sm bg-neutral-900 border border-indigo-500/50 rounded-xl p-3 shadow-2xl animate-bounce flex items-start gap-2.5">
          <div className="p-1 rounded-lg bg-indigo-600/20 text-indigo-400">
            <Sparkles size={16} />
          </div>
          <div>
            <span className="text-xs font-semibold text-neutral-100 block">System Orchestration Notice</span>
            <p className="text-[11px] text-neutral-400 leading-normal">{demoNotification}</p>
          </div>
        </div>
      )}

      {/* TOP HEADER UTILITIES */}
      <header className="border-b border-neutral-900 bg-neutral-950/90 backdrop-blur sticky top-0 z-40 px-6 py-4 flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Brand & Concept Identity */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center shadow-lg shadow-indigo-600/20 font-bold text-lg text-white font-mono tracking-tighter">
            OS
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-bold tracking-tight text-white">OSMOS™ Autonomous System</h1>
              <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-indigo-950 text-indigo-400 border border-indigo-800">
                v1.2 SaaS Engine
              </span>
            </div>
            <p className="text-xs text-neutral-400">Offline-First Service Operating System & Captive Portal</p>
          </div>
        </div>

        {/* Real-time Hardware Server Connection & Offline Uplink Switchboard */}
        <div className="flex flex-wrap items-center gap-3 bg-neutral-900 border border-neutral-800 rounded-xl p-2">
          
          <div className="flex items-center gap-2 px-2 py-1 bg-neutral-950/80 rounded-lg border border-neutral-800">
            {isOnline ? (
              <div className="flex items-center gap-1.5 text-emerald-400 text-xs font-mono font-medium">
                <Wifi size={14} className="animate-pulse" />
                <span>WAN LINK ACTIVE (SaaS CLOUD)</span>
              </div>
            ) : (
              <div className="flex items-center gap-1.5 text-amber-500 text-xs font-mono font-medium">
                <WifiOff size={14} />
                <span>LOCAL CAPTIVE LAN ONLY</span>
              </div>
            )}
            
            <button
              onClick={() => {
                setIsOnline(!isOnline);
                addSystemLog(
                  !isOnline ? 'success' : 'warn',
                  !isOnline 
                    ? 'Cloud Wide Area Network Uplink restored. Enterprise microservices online.' 
                    : 'WAN Uplink disconnected. Operating local fallback network (Raspberry Pi SQLite node offline queue active).'
                );
              }}
              className={`ml-2 text-[10px] px-2 py-0.5 rounded font-sans transition-all font-semibold ${isOnline ? 'bg-amber-600/20 hover:bg-amber-600/30 text-amber-400 border border-amber-800' : 'bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 border border-emerald-800'}`}
            >
              {isOnline ? 'Cut Link' : 'Go Online'}
            </button>
          </div>

          {/* Sync Trigger button showing current buffered item count */}
          <button
            onClick={handleForceSync}
            disabled={syncing}
            className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border font-medium transition-all ${
              offlineTxnBuffer.length > 0 || offlineQueueBuffer.length > 0
                ? 'bg-indigo-600 text-white hover:bg-indigo-500 border-indigo-500/30 animate-pulse'
                : 'bg-neutral-950 hover:bg-neutral-800 text-neutral-400 border-neutral-800'
            }`}
          >
            <RefreshCw size={12} className={syncing ? 'animate-spin' : ''} />
            <span>Sync Cloud</span>
            {(offlineTxnBuffer.length > 0 || offlineQueueBuffer.length > 0) && (
              <span className="ml-1 bg-white text-indigo-900 rounded-full text-[10px] w-4.5 h-4.5 flex items-center justify-center font-bold">
                {offlineTxnBuffer.length + offlineQueueBuffer.length}
              </span>
            )}
          </button>

          {/* Seed scenarios selector */}
          <button
            onClick={handleResetDemo}
            className="text-neutral-500 hover:text-red-400 transition-colors p-1.5 hover:bg-neutral-800 rounded-lg"
            title="Reset system database to clean demo default"
          >
            <Trash2 size={14} />
          </button>
        </div>

      </header>

      {/* QUICK CHANGER CONTROLLER RAIL & SIMULATION BENCHMARK */}
      <div className="bg-neutral-900 border-b border-neutral-800/80 px-6 py-3 flex flex-wrap items-center justify-between gap-4">
        
        {/* Industry Configurator selector */}
        <div className="flex flex-wrap items-center gap-2 overflow-x-auto pb-1 md:pb-0 scrollbar-none max-w-full">
          <span className="text-[10px] uppercase font-mono font-bold text-neutral-500 tracking-wider shrink-0">Configure Firmware Profile:</span>
          
          {/* Quick Tabs for main 6 */}
          <div className="flex gap-1 shrink-0">
            {(['RESTAURANT', 'HOSPITAL', 'SCHOOL', 'GOVERNMENT', 'RETAIL', 'TRANSPORT'] as IndustryType[]).map((ind) => (
              <button
                key={ind}
                onClick={() => handleIndustryChange(ind)}
                className={`flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1 rounded-lg border transition-all ${
                  currentIndustry === ind
                    ? 'bg-neutral-100 text-neutral-900 border-neutral-100 font-bold shadow-md shadow-white/5'
                    : 'bg-neutral-950 text-neutral-400 border-neutral-800 hover:text-neutral-200 hover:bg-neutral-900'
                }`}
              >
                {renderIndustryIcon(INDUSTRY_DATA[ind]?.icon || 'Smartphone', 11, currentIndustry === ind ? 'text-neutral-900' : 'text-indigo-400')}
                <span>{INDUSTRY_DATA[ind]?.label || ind}</span>
              </button>
            ))}
          </div>

          {/* All 23 Industries Dropdown */}
          <div className="flex items-center gap-1 bg-neutral-950 border border-neutral-800 rounded-lg p-0.5 shrink-0 ml-1">
            <select
              value={currentIndustry}
              onChange={(e) => handleIndustryChange(e.target.value as IndustryType)}
              className="bg-transparent text-neutral-300 font-semibold text-[11px] px-2 py-0.5 focus:outline-none border-none cursor-pointer"
            >
              {Object.values(INDUSTRY_DATA).map((config) => (
                <option key={config.id} value={config.id} className="bg-neutral-950 text-neutral-100 font-semibold">
                  {config.label} Profile
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Dynamic Investor Demo Shortcuts */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
          <span className="text-[10px] uppercase font-mono font-bold text-neutral-500 tracking-wider">Demo Presets:</span>
          {(INDUSTRY_DATA[currentIndustry]?.scenarios || []).map((scenario) => (
            <button
              key={scenario.id}
              onClick={() => handleTriggerScenario(scenario)}
              className="text-[10px] bg-neutral-950 text-neutral-350 hover:text-indigo-400 hover:border-indigo-500 px-2.5 py-1 rounded border border-neutral-800 transition-all font-mono whitespace-nowrap"
              title={scenario.description}
            >
              {scenario.label}
            </button>
          ))}
        </div>
      </div>

      {/* CORE WORKSPACE GRID */}
      <main className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 p-6">

        {/* 👤 OSMOS™ UNIFIED IDENTITY, CONTEXT & TOOL ASSIGNMENT ENGINE */}
        <section className="col-span-1 lg:col-span-12 bg-neutral-900 border border-neutral-800 rounded-2xl p-5 shadow-2xl relative overflow-hidden flex flex-col gap-4">
          <div className="absolute inset-0 bg-[radial-gradient(#ffffff01_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />
          
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between border-b border-neutral-800 pb-3 gap-2">
            <div>
              <span className="text-[10px] uppercase font-mono tracking-widest font-extrabold text-indigo-400 flex items-center gap-1.5">
                <Sparkles size={12} className="text-indigo-400 animate-pulse" />
                <span>OSMOS™ Central Identity & Context Engine</span>
              </span>
              <h2 className="text-sm font-bold text-white tracking-tight">Multi-Tenant Client Classification & Role Permissions</h2>
            </div>
            <span className="text-[9px] font-mono bg-indigo-950 text-indigo-400 border border-indigo-900 px-2.5 py-1 rounded-lg">
              ACTIVE PROFILE: {currentIndustry} ({INDUSTRY_DATA[currentIndustry]?.label})
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* 1. Client Identity Classification */}
            <div className="space-y-3">
              <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-wider font-bold block flex items-center gap-1.5">
                <Users size={12} className="text-neutral-500" />
                <span>1. Client Identity & Category</span>
              </span>
              
              <div className="grid grid-cols-2 gap-1 bg-neutral-950 p-1 rounded-lg border border-neutral-850">
                <button
                  onClick={() => {
                    setClientCategory('INDIVIDUAL');
                    handleUserTypeChange('STUDENT', 'INDIVIDUAL');
                  }}
                  className={`text-[10px] py-1.5 rounded-md font-semibold transition-all ${clientCategory === 'INDIVIDUAL' ? 'bg-indigo-600 text-white shadow-sm' : 'text-neutral-400 hover:text-white'}`}
                >
                  Individual User
                </button>
                <button
                  onClick={() => {
                    setClientCategory('BUSINESS');
                    handleUserTypeChange('SME', 'BUSINESS');
                  }}
                  className={`text-[10px] py-1.5 rounded-md font-semibold transition-all ${clientCategory === 'BUSINESS' ? 'bg-indigo-600 text-white shadow-sm' : 'text-neutral-400 hover:text-white'}`}
                >
                  Business Client
                </button>
              </div>

              <div className="space-y-1.5">
                <span className="text-[9px] font-mono text-neutral-500 block uppercase">Select Identity Profile:</span>
                <div className="max-h-[145px] overflow-y-auto pr-1 space-y-1 scrollbar-thin scrollbar-thumb-neutral-850">
                  <div className="grid grid-cols-3 gap-1">
                    {(clientCategory === 'INDIVIDUAL' 
                      ? [
                          'STUDENT', 'PATIENT', 'CUSTOMER', 'SHOPPER', 'PASSENGER', 
                          'CLAIMANT', 'SUBSCRIBER', 'UTILITY_CONSUMER', 'FREELANCER', 'VISITOR', 
                          'DONOR', 'CONGREGANT', 'SPA_GUEST', 'DEVICE_OWNER', 'ENROLLEE', 
                          'GAMER', 'RESIDENT', 'ATHLETE', 'APPLICANT', 'SCHOLAR'
                        ]
                      : [
                          'SME', 'ENTERPRISE', 'SCHOOL', 'HOSPITAL', 'GOVERNMENT', 
                          'NGO', 'CORPORATION', 'PRODUCER', 'MERCHANT'
                        ]
                    ).map((profile) => (
                      <button
                        key={profile}
                        onClick={() => handleUserTypeChange(profile)}
                        className={`text-[9px] py-1.5 px-1 rounded transition-all font-mono border text-center truncate ${userType === profile ? 'bg-neutral-100 text-neutral-900 border-neutral-100 font-bold' : 'bg-neutral-950 text-neutral-400 border-neutral-850 hover:border-neutral-700 hover:text-neutral-200'}`}
                        title={profile}
                      >
                        {profile.replace('_', ' ')}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* 2. Role Inside Client */}
            <div className="space-y-3">
              <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-wider font-bold block flex items-center gap-1.5">
                <Sliders size={12} className="text-neutral-500" />
                <span>2. Active Role & RBAC</span>
              </span>

              <div className="grid grid-cols-2 gap-1 bg-neutral-950 p-1 rounded-lg border border-neutral-850">
                {(['ADMIN_OWNER', 'MANAGER_SUPERVISOR', 'STAFF_WORKER', 'END_USER_CUSTOMER'] as const).map((role) => {
                  const labelMap = {
                    ADMIN_OWNER: 'Admin/Owner',
                    MANAGER_SUPERVISOR: 'Manager',
                    STAFF_WORKER: 'Staff',
                    END_USER_CUSTOMER: 'End User'
                  };
                  return (
                    <button
                      key={role}
                      onClick={() => {
                        setUserRole(role);
                        addSystemLog('info', `RBAC: Switched active interface role permission context to [${role}].`);
                        triggerDemoAlert(`Role updated to ${labelMap[role]}! Interface adjusted.`);
                      }}
                      className={`text-[10px] py-1.5 rounded-md font-semibold transition-all ${userRole === role ? 'bg-indigo-600 text-white shadow-sm' : 'text-neutral-400 hover:text-white'}`}
                    >
                      {labelMap[role]}
                    </button>
                  );
                })}
              </div>

              <div className="text-[10px] bg-neutral-950/40 p-2.5 rounded border border-neutral-950 text-neutral-400 leading-relaxed font-sans">
                {userRole === 'ADMIN_OWNER' && '🔓 FULL ROOT CONTROLS: Complete access to view all dashboards, custom field configurators, automation triggers, offline synchronization commands, and telemetry logs.'}
                {userRole === 'MANAGER_SUPERVISOR' && '🔑 MANAGER ACCESS: Edit background automation trigger logic, monitor transaction histories, review predictive analytics. Core forms and databases are locked.'}
                {userRole === 'STAFF_WORKER' && '📋 STAFF INTERFACE: Focused queue servicing panel, transactional records check, and event logging. Controls and analytics are hidden to streamline focus.'}
                {userRole === 'END_USER_CUSTOMER' && '📺 PUBLIC MONITOR: Launches a live waiting lounge queue monitor display featuring automated ticket flash alerts, announcements ticker, and class checkins.'}
              </div>
            </div>

            {/* 3. Universal Tool Assignment Matrix */}
            <div className="space-y-2.5">
              <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-wider font-bold block flex items-center gap-1.5">
                <Zap size={12} className="text-neutral-500" />
                <span>3. Smart Tool Assignment Matrix</span>
              </span>

              {/* Micro grid of 10 tools */}
              <div className="grid grid-cols-2 gap-1.5 max-h-[125px] overflow-y-auto pr-1">
                {[
                  { n: 1, name: 'Identity & Access' },
                  { n: 2, name: 'Queue & Appt' },
                  { n: 3, name: 'Forms & Data Ingest' },
                  { n: 4, name: 'Task & Workflow' },
                  { n: 5, name: 'POS & Transaction' },
                  { n: 6, name: 'Communication Hub' },
                  { n: 7, name: 'File & Content Vault' },
                  { n: 8, name: 'Analytics & BI' },
                  { n: 9, name: 'Automation Engine' },
                  { n: 10, name: 'Offline-First Buffer' }
                ].map((t) => {
                  const isActive = getToolStatus(t.n, userType, currentIndustry, userRole) === 'ACTIVE';
                  return (
                    <div key={t.n} className={`flex items-center justify-between p-1.5 rounded border text-[9.5px] font-sans ${isActive ? 'bg-emerald-950/10 border-emerald-900/30 text-emerald-300' : 'bg-neutral-950/40 border-neutral-950 text-neutral-500'}`}>
                      <span className="truncate">{t.n}. {t.name}</span>
                      <span className="flex items-center gap-1 font-mono text-[8px] font-bold shrink-0">
                        <span className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-emerald-400' : 'bg-neutral-700'}`} />
                        <span>{isActive ? 'ACTIVE' : 'STANDBY'}</span>
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* LEFT COLUMN: PHYSICAL ACCESS LAYER - SMART KIOSK & CAPTIVE PORTAL SIMULATOR (40% SPACE ON DESKTOP) */}
        <section className="lg:col-span-5 bg-neutral-950 border border-neutral-900 rounded-2xl overflow-hidden shadow-2xl flex flex-col relative" id="captive-portal-device-frame">
          
          {/* Universal Physical Access Layer Switcher */}
          <div className="bg-neutral-900 border-b border-neutral-850 p-2.5">
            <span className="text-[9px] font-mono font-bold tracking-widest text-indigo-400 block mb-1.5 px-1 uppercase">
              Physical Interaction Interface Mode:
            </span>
            <div className="grid grid-cols-4 gap-1 text-[9px] font-mono">
              <button
                onClick={() => {
                  setKioskAccessMethod('TOUCHSCREEN_KIOSK');
                  addSystemLog('info', 'Switched physical layer simulation to: Fixed Touchscreen Kiosk Terminal');
                }}
                className={`py-1.5 px-1 rounded text-center transition-colors font-bold ${
                  kioskAccessMethod === 'TOUCHSCREEN_KIOSK'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-neutral-900 text-neutral-400 hover:bg-neutral-800'
                }`}
              >
                🖥️ Kiosk
              </button>
              <button
                onClick={() => {
                  setKioskAccessMethod('QR_CODE_MOBILE');
                  addSystemLog('info', 'Switched physical layer simulation to: Scan QR Code Mobile Access');
                }}
                className={`py-1.5 px-1 rounded text-center transition-colors font-bold ${
                  kioskAccessMethod === 'QR_CODE_MOBILE'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-neutral-900 text-neutral-400 hover:bg-neutral-800'
                }`}
              >
                🤳 QR Mobile
              </button>
              <button
                onClick={() => {
                  setKioskAccessMethod('TABLET_STATION');
                  addSystemLog('info', 'Switched physical layer simulation to: Mounted Tablet Counter Station');
                }}
                className={`py-1.5 px-1 rounded text-center transition-colors font-bold ${
                  kioskAccessMethod === 'TABLET_STATION'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-neutral-900 text-neutral-400 hover:bg-neutral-800'
                }`}
              >
                平板 Tablet
              </button>
              <button
                onClick={() => {
                  setKioskAccessMethod('CUSTOMER_DEVICE');
                  addSystemLog('info', 'Switched physical layer simulation to: Existing Customer Device Wifi Portal');
                }}
                className={`py-1.5 px-1 rounded text-center transition-colors font-bold ${
                  kioskAccessMethod === 'CUSTOMER_DEVICE'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-neutral-900 text-neutral-400 hover:bg-neutral-800'
                }`}
              >
                🌐 Client App
              </button>
            </div>
          </div>

          {/* Virtual Phone Mockup Top Bar */}
          <div className="bg-neutral-900/60 border-b border-neutral-900 px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2 text-neutral-400">
              <Smartphone size={14} className="text-neutral-500" />
              <span className="text-[10px] font-mono tracking-wider font-semibold text-neutral-300 uppercase">
                {kioskAccessMethod === 'TOUCHSCREEN_KIOSK' && '🖥️ FIXED ON-SITE KIOSK'}
                {kioskAccessMethod === 'QR_CODE_MOBILE' && '🤳 CUSTOMER PHONE WEB-APP'}
                {kioskAccessMethod === 'TABLET_STATION' && '📟 COUNTER TABLET DISPLAY'}
                {kioskAccessMethod === 'CUSTOMER_DEVICE' && '🌐 CLIENT LOCAL WORKSPACE'}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 bg-indigo-950 text-indigo-400 px-2 py-0.5 rounded text-[10px] font-mono border border-indigo-900">
                <QrCode size={10} />
                <span>
                  {kioskAccessMethod === 'QR_CODE_MOBILE' ? 'Scan On-Site QR Code' : 'IP: 192.168.4.1'}
                </span>
              </div>
              <div className="w-2.5 h-2.5 rounded-full bg-indigo-500 animate-pulse" title="Captive portal broadcast beacons transmitting" />
            </div>
          </div>

          {/* Portal Simulated Connection Welcome Strip */}
          <div className="bg-indigo-950/20 border-b border-indigo-900/30 px-5 py-3 text-xs text-neutral-300 flex items-center justify-between relative">
            <div className="absolute inset-0 bg-[radial-gradient(#ffffff01_1px,transparent_1px)] [background-size:12px_12px] pointer-events-none" />
            <div className="flex items-center gap-2.5">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              <div>
                <span className="font-semibold block text-neutral-200">
                  {kioskAccessMethod === 'TOUCHSCREEN_KIOSK' && 'Local Kiosk Terminal Ingress'}
                  {kioskAccessMethod === 'QR_CODE_MOBILE' && 'Local Wi-Fi Captive Redirect (No Install Required)'}
                  {kioskAccessMethod === 'TABLET_STATION' && 'On-Counter Shared Service Point'}
                  {kioskAccessMethod === 'CUSTOMER_DEVICE' && 'SaaS Local Native Intranet'}
                </span>
                <span className="text-[9px] text-indigo-400">
                  {kioskAccessMethod === 'QR_CODE_MOBILE' ? 'Captive page served instantly over local router' : 'Secured via local low-latency LAN cluster'}
                </span>
              </div>
            </div>
          </div>

          {/* Active Portal Views Content */}
          <div className="flex-1 p-5 overflow-y-auto">
            
            {/* HOME HUB */}
            {portalView === 'HOME' && (
              <div className="space-y-5 animate-fade-in">
                <div className="text-center py-4">
                  <div className="inline-flex p-3 rounded-full bg-neutral-900 border border-neutral-800 mb-2">
                    {renderIndustryIcon(INDUSTRY_DATA[currentIndustry]?.icon || 'Smartphone', 28, 'text-indigo-400')}
                  </div>
                  <h3 className="text-sm font-bold text-white uppercase tracking-tight">
                    {INDUSTRY_DATA[currentIndustry]?.label} CLIENT ACCESS PORTAL
                  </h3>
                  <p className="text-xs text-neutral-400 mt-1 max-w-sm mx-auto">
                    {INDUSTRY_DATA[currentIndustry]?.welcomeText || 'Welcome. OSMOS is operating local smart services without manual paperwork. Choose an automated workflow below.'}
                  </p>
                </div>

                {/* Simulated Portal Access Triggers */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3" id="portal-triggers-grid">
                  
                  {/* Join Queue Trigger */}
                  <button
                    onClick={() => setPortalView('QUEUE')}
                    className="p-3.5 rounded-xl bg-neutral-900 hover:bg-neutral-850 border border-neutral-800 hover:border-neutral-700 transition-all text-left flex items-start gap-3 group relative overflow-hidden"
                  >
                    <div className="p-2 rounded-lg bg-indigo-600/10 text-indigo-400 group-hover:bg-indigo-600/20 shrink-0">
                      <Clock size={16} />
                    </div>
                    <div>
                      <span className="text-xs font-semibold text-white block">Smart Queue Slot</span>
                      <p className="text-[10px] text-neutral-400 mt-0.5 leading-normal">Skip the physical waiting line. Issue a virtual tracking ticket.</p>
                    </div>
                  </button>

                  {/* Digital Forms Trigger */}
                  <button
                    onClick={() => setPortalView('FORM')}
                    className="p-3.5 rounded-xl bg-neutral-900 hover:bg-neutral-850 border border-neutral-800 hover:border-neutral-700 transition-all text-left flex items-start gap-3 group relative overflow-hidden"
                  >
                    <div className="p-2 rounded-lg bg-emerald-600/10 text-emerald-400 group-hover:bg-emerald-600/20 shrink-0">
                      <FileText size={16} />
                    </div>
                    <div>
                      <span className="text-xs font-semibold text-white block">Digital Forms Hub</span>
                      <p className="text-[10px] text-neutral-400 mt-0.5 leading-normal">File records or certifications directly. No manual desk encoding.</p>
                    </div>
                  </button>

                  {/* Floorplan Map Trigger */}
                  <button
                    onClick={() => { setPortalView('MAP'); addSystemLog('info', 'Client requested interactive floorplan navigation.'); }}
                    className="p-3.5 rounded-xl bg-neutral-900 hover:bg-neutral-850 border border-indigo-900/60 hover:border-indigo-500 transition-all text-left flex items-start gap-3 group sm:col-span-2 relative overflow-hidden"
                  >
                    <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-600/5 rounded-full blur-2xl group-hover:bg-indigo-500/10 transition-colors" />
                    <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400 group-hover:bg-indigo-500/20 shrink-0">
                      <Map size={16} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-white block">Live Indoor Floorplan</span>
                        <span className="text-[9px] uppercase font-mono px-1.5 py-0.5 rounded bg-indigo-950 text-indigo-400 border border-indigo-900/50 font-semibold">Active IPS</span>
                      </div>
                      <p className="text-[10px] text-neutral-400 mt-0.5 leading-normal">Locate yourself on-site. Dynamic pathfinding with real-time wait times for service counters.</p>
                    </div>
                  </button>

                  {/* Interactive POS Catalog Trigger - Available for ALL industries with catalog products/services */}
                  {INDUSTRY_DATA[currentIndustry]?.catalog && INDUSTRY_DATA[currentIndustry].catalog.length > 0 && (
                    <button
                      onClick={() => setPortalView('MENU')}
                      className="p-3.5 rounded-xl bg-neutral-900 hover:bg-neutral-850 border border-amber-800/40 hover:border-amber-600 transition-all text-left flex items-start gap-3 group sm:col-span-2"
                    >
                      <div className="p-2 rounded-lg bg-amber-600/10 text-amber-400 shrink-0">
                        {renderIndustryIcon(INDUSTRY_DATA[currentIndustry]?.icon || 'ShoppingBag', 16, 'text-amber-400')}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-semibold text-white block">
                            {currentIndustry === 'RESTAURANT' ? 'Browse Dining Menu & Order' : 'POS Interactive Catalog & Bookings'}
                          </span>
                          <span className="text-[9px] uppercase font-mono px-1.5 rounded bg-amber-950 text-amber-400 border border-amber-800">
                            Local POS
                          </span>
                        </div>
                        <p className="text-[10px] text-neutral-400 mt-0.5 leading-normal">
                          Browse physical/digital catalog items, check stock levels, and authorize secure offline-buffered purchases.
                        </p>
                      </div>
                    </button>
                  )}

                  {/* School-specific LMS Classroom Attendance */}
                  {currentIndustry === 'SCHOOL' && (
                    <button
                      onClick={() => setPortalView('ATTENDANCE')}
                      className="p-3.5 rounded-xl bg-neutral-900 hover:bg-neutral-850 border border-indigo-800/40 hover:border-indigo-600 transition-all text-left flex items-start gap-3 group sm:col-span-2"
                    >
                      <div className="p-2 rounded-lg bg-indigo-600/10 text-indigo-400 shrink-0">
                        <GraduationCap size={16} />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-semibold text-white block">LMS Attendance Check-in</span>
                          <span className="text-[9px] uppercase font-mono px-1.5 rounded bg-indigo-950 text-indigo-400 border border-indigo-800 font-bold">QR SCAN</span>
                        </div>
                        <p className="text-[10px] text-neutral-400 mt-0.5 leading-normal">Simulate classroom scanner registration to auto-log student presence.</p>
                      </div>
                    </button>
                  )}

                </div>

                {/* Smart Simulation Details */}
                <div className="bg-neutral-900/40 border border-neutral-900 rounded-xl p-4 space-y-2">
                  <div className="flex items-center gap-1.5 text-neutral-400 text-[10px] font-mono font-bold tracking-wider uppercase">
                    <Info size={12} className="text-indigo-400" />
                    <span>How OSMOS Captive Portal Works</span>
                  </div>
                  <p className="text-[11px] text-neutral-400 leading-relaxed">
                    By intercepting WiFi DNS handshakes, OSMOS launches this interface automatically the second users connect to the localized LAN Router on site. No mobile application store downloads or mobile data connectivity needed.
                  </p>
                </div>
              </div>
            )}

            {/* QUEUE PORTAL VIEW */}
            {portalView === 'QUEUE' && (
              <div className="space-y-4 animate-fade-in">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <Clock size={16} className="text-indigo-400" />
                    <span>Join Simulated Service Queue</span>
                  </h3>
                  <button onClick={() => setPortalView('HOME')} className="text-neutral-500 hover:text-white text-xs">
                    &larr; Back Hub
                  </button>
                </div>

                <div className="space-y-3.5 bg-neutral-900 p-4 rounded-xl border border-neutral-850">
                  <div>
                    <label className="text-[11px] text-neutral-400 uppercase tracking-wider block mb-1">Your Full Name</label>
                    <input
                      type="text"
                      value={clientName}
                      onChange={(e) => setClientName(e.target.value)}
                      placeholder="e.g. Althea Ramos"
                      className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-2 text-xs focus:outline-none focus:border-indigo-500 text-white"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] text-neutral-400 uppercase tracking-wider block mb-1">Select Desired Service Desk</label>
                    <input
                      type="text"
                      value={clientServiceType}
                      onChange={(e) => setClientServiceType(e.target.value)}
                      placeholder={
                        currentIndustry === 'HOSPITAL' 
                          ? 'e.g. Pediatrics or Cardiology Consultation'
                          : currentIndustry === 'GOVERNMENT'
                          ? 'e.g. Barangay Clearance or Police Record'
                          : 'e.g. Customer Support Counter'
                      }
                      className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-2 text-xs focus:outline-none focus:border-indigo-500 text-white"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] text-neutral-400 uppercase tracking-wider block mb-1">Queue Priority</label>
                      <select
                        value={clientPriority}
                        onChange={(e: any) => setClientPriority(e.target.value)}
                        className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-2 text-xs focus:outline-none focus:border-indigo-500 text-white"
                      >
                        <option value="LOW">Low priority</option>
                        <option value="MEDIUM">Medium priority</option>
                        <option value="HIGH">High priority</option>
                        <option value="EMERGENCY">Emergency (ER / Trauma)</option>
                      </select>
                    </div>

                    <div className="flex items-end">
                      <button
                        onClick={() => handleJoinQueue()}
                        className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs py-2 px-3 rounded-lg transition-all"
                      >
                        Issue Virtual Ticket
                      </button>
                    </div>
                  </div>
                </div>

                {/* Queue buffer indicator */}
                {(offlineQueueBuffer.length > 0) && (
                  <div className="p-3 bg-amber-950/30 border border-amber-800/40 rounded-xl space-y-2">
                    <span className="text-[10px] text-amber-400 font-mono font-bold block">
                      ⚠️ LOCAL OFFLINE QUEUE DETECTED ({offlineQueueBuffer.length})
                    </span>
                    <div className="space-y-1">
                      {offlineQueueBuffer.map((ofq) => (
                        <div key={ofq.id} className="text-[11px] flex justify-between bg-neutral-950 p-2 rounded border border-neutral-900">
                          <span className="font-mono text-indigo-400 font-bold">{ofq.number}</span>
                          <span className="text-neutral-300">{ofq.name}</span>
                          <span className="text-amber-500 font-mono text-[9px]">SQLite Buffered</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* DIGITAL FORMS VIEW */}
            {portalView === 'FORM' && (
              <div className="space-y-4 animate-fade-in">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <FileText size={16} className="text-emerald-400" />
                    <span>Digital Dynamic Submission Form</span>
                  </h3>
                  <button onClick={() => setPortalView('HOME')} className="text-neutral-500 hover:text-white text-xs font-mono">
                    &larr; Back Hub
                  </button>
                </div>

                <form onSubmit={handleFormSubmit} className="space-y-3.5 bg-neutral-900 p-4 rounded-xl border border-neutral-850">
                  <p className="text-[11px] text-neutral-400 leading-normal">
                    This is a dynamically generated digital input layout. Admin staff can add, adjust, and deploy customized data inputs instantly using the dashboard builder.
                  </p>

                  {/* SMART AUTO-FILL MAGIC WAND */}
                  <div className="flex justify-between items-center bg-indigo-950/20 border border-indigo-900/30 p-2.5 rounded-lg">
                    <div className="flex items-center gap-1.5 text-[10px] text-indigo-300 font-mono">
                      <Sparkles size={11} className="animate-pulse" />
                      <span>Form Auto-Complete Active</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        const prefilled: Record<string, string> = {};
                        customFields.forEach(f => {
                          const label = f.label.toLowerCase();
                          if (label.includes('name')) {
                            prefilled[f.label] = 'David Santos';
                          } else if (label.includes('id') || label.includes('number') || label.includes('code')) {
                            prefilled[f.label] = currentIndustry === 'SCHOOL' ? 'STUD-2026-1049' : 'ID-4924-X';
                          } else if (label.includes('reason') || label.includes('purpose') || label.includes('detail') || label.includes('symptom')) {
                            if (currentIndustry === 'HOSPITAL') {
                              prefilled[f.label] = 'Mild headache and sore throat for 2 days.';
                            } else if (currentIndustry === 'GOVERNMENT') {
                              prefilled[f.label] = 'Job Application requirements.';
                            } else {
                              prefilled[f.label] = 'Standard operational request.';
                            }
                          } else if (f.type === 'select' && f.options && f.options.length > 0) {
                            prefilled[f.label] = f.options[0];
                          } else {
                            prefilled[f.label] = 'Satisfactory';
                          }
                        });
                        setClientFormAnswers(prefilled);
                        addSystemLog('success', `Captive Portal: Autofilled form with active industry profile [${currentIndustry}] presets.`);
                        triggerDemoAlert('Smart Auto-Fill completed all dynamic form fields successfully!');
                      }}
                      className="text-[10px] bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-1 px-2.5 rounded-md transition-all flex items-center gap-1 shrink-0 cursor-pointer"
                    >
                      <span>🪄 Auto-Fill Form</span>
                    </button>
                  </div>

                  {customFields.map((field) => (
                    <div key={field.id} className="space-y-1">
                      <label className="text-[11px] text-neutral-400 uppercase tracking-wider block">
                        {field.label} {field.required && <span className="text-red-400">*</span>}
                      </label>
                      {field.type === 'select' ? (
                        <select
                          required={field.required}
                          value={clientFormAnswers[field.label] || ''}
                          onChange={(e) => setClientFormAnswers({ ...clientFormAnswers, [field.label]: e.target.value })}
                          className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                        >
                          <option value="">Select option...</option>
                          {field.options?.map((opt: string) => (
                            <option key={opt} value={opt}>{opt}</option>
                          ))}
                        </select>
                      ) : field.type === 'textarea' ? (
                        <textarea
                          required={field.required}
                          placeholder={field.placeholder || ''}
                          value={clientFormAnswers[field.label] || ''}
                          onChange={(e) => setClientFormAnswers({ ...clientFormAnswers, [field.label]: e.target.value })}
                          className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-2 text-xs text-white focus:outline-none focus:border-indigo-500 h-16"
                        />
                      ) : (
                        <input
                          type={field.type}
                          required={field.required}
                          placeholder={field.placeholder || ''}
                          value={clientFormAnswers[field.label] || ''}
                          onChange={(e) => setClientFormAnswers({ ...clientFormAnswers, [field.label]: e.target.value })}
                          className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                        />
                      )}

                      {/* CONTEXT-AWARE VALIDATION FEEDBACK */}
                      {clientFormAnswers[field.label] && (
                        <div className="flex items-center gap-1 text-[9px] font-mono mt-0.5 text-emerald-400">
                          <span>✓ Verified format</span>
                          <span className="text-neutral-500">|</span>
                          <span className="text-neutral-400">Context check passed</span>
                        </div>
                      )}
                    </div>
                  ))}

                  {/* PROGRESSIVE DISCLOSURE COLLAPSIBLE BLOCK */}
                  {Object.keys(clientFormAnswers).length > 0 && (
                    <div className="bg-neutral-950 p-2.5 rounded-lg border border-neutral-850 space-y-1.5 animate-fade-in">
                      <div className="flex items-center gap-1 text-[9px] font-mono text-emerald-400 font-bold uppercase">
                        <ShieldCheck size={11} />
                        <span>Dynamic Progressive Validation</span>
                      </div>
                      <p className="text-[10px] text-neutral-400 leading-relaxed font-sans">
                        Checking edge-router parameters for <strong>{currentIndustry}</strong> profile...
                      </p>
                      
                      <div className="grid grid-cols-2 gap-2 text-[9px] font-mono">
                        <div className="bg-neutral-900 p-1.5 rounded border border-neutral-850">
                          <span className="text-neutral-500 block">SECURITY RECONCILIATION:</span>
                          <span className="text-emerald-400 font-bold">100% BYPASS</span>
                        </div>
                        <div className="bg-neutral-900 p-1.5 rounded border border-neutral-850">
                          <span className="text-neutral-500 block">UPLINK LATENCY FACTOR:</span>
                          <span className="text-indigo-400 font-bold">0.4s Offline Cached</span>
                        </div>
                      </div>

                      {Object.values(clientFormAnswers).some(val => String(val).length > 3) && (
                        <div className="text-[8.5px] text-neutral-500 leading-normal border-t border-neutral-900 pt-1.5 italic font-mono">
                          ℹ️ AI Tracker: Submission automatically marked for fast-track queue dispatch upon backend clearance approval.
                        </div>
                      )}
                    </div>
                  )}

                  <div className="pt-2">
                    <button
                      type="submit"
                      className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs py-2 px-3 rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-lg shadow-emerald-600/15"
                    >
                      <CheckCircle size={14} />
                      <span>Process Digital Registration</span>
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* UNIFIED INTERACTIVE CATALOG / POS / SERVICE BOOKING VIEW */}
            {portalView === 'MENU' && (
              <div className="space-y-4 animate-fade-in">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    {renderIndustryIcon(INDUSTRY_DATA[currentIndustry]?.icon || 'ShoppingBag', 16, 'text-amber-400')}
                    <span>{INDUSTRY_DATA[currentIndustry]?.label} POS & Services</span>
                  </h3>
                  <button onClick={() => setPortalView('HOME')} className="text-neutral-500 hover:text-white text-xs">
                    &larr; Back Hub
                  </button>
                </div>

                <div className="space-y-4">
                  {/* Catalog items list */}
                  <div className="grid grid-cols-1 gap-2">
                    {(!INDUSTRY_DATA[currentIndustry]?.catalog || INDUSTRY_DATA[currentIndustry].catalog.length === 0) ? (
                      <p className="text-[11px] text-neutral-500 italic text-center py-4 bg-neutral-900 border border-neutral-850 rounded-xl">
                        No product inventory or interactive services cataloged for this workspace profile.
                      </p>
                    ) : (
                      INDUSTRY_DATA[currentIndustry].catalog.map((item) => {
                        const qty = cart[item.id] || 0;
                        return (
                          <div key={item.id} className="bg-neutral-900 border border-neutral-850 p-3 rounded-xl flex items-center justify-between gap-3">
                            <div>
                              <span className="text-xs font-semibold text-white block">{item.name}</span>
                              <div className="flex items-center gap-2 mt-1">
                                <span className="text-[10px] font-mono text-indigo-400 font-bold">₱{item.price}</span>
                                <span className="text-[9px] text-neutral-500">{item.category} &bull; Stock: {item.stock}</span>
                              </div>
                            </div>
                            <div className="flex items-center gap-2 bg-neutral-950 border border-neutral-800 p-1 rounded-lg">
                              <button
                                onClick={() => {
                                  if (qty > 0) setCart({ ...cart, [item.id]: qty - 1 });
                                }}
                                className="w-5 h-5 text-neutral-400 hover:text-white font-bold"
                              >
                                -
                              </button>
                              <span className="text-xs font-mono font-bold text-indigo-400 min-w-4 text-center">{qty}</span>
                              <button
                                onClick={() => setCart({ ...cart, [item.id]: qty + 1 })}
                                className="w-5 h-5 text-neutral-400 hover:text-white font-bold"
                              >
                                +
                              </button>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>

                  {/* Order summary panel */}
                  {getCartTotal() > 0 && (
                    <div className="bg-neutral-900 border border-indigo-900/60 p-4 rounded-xl space-y-3">
                      <div className="flex justify-between text-xs font-mono">
                        <span className="text-neutral-400">Total Transaction Value:</span>
                        <span className="font-bold text-indigo-400">₱{getCartTotal()}</span>
                      </div>
                      <div>
                        <label className="text-[10px] text-neutral-400 block mb-1 font-mono uppercase">Buyer / Customer Name</label>
                        <input
                          type="text"
                          value={clientName}
                          onChange={(e) => setClientName(e.target.value)}
                          placeholder="e.g. Walk-in Guest"
                          className="w-full bg-neutral-950 border border-neutral-800 rounded p-1.5 text-xs focus:outline-none text-white font-mono"
                        />
                      </div>
                      <button
                        onClick={() => {
                          const activeCatalog = INDUSTRY_DATA[currentIndustry]?.catalog || [];
                          const detailsStr = Object.entries(cart)
                            .filter(([_, qty]) => Number(qty) > 0)
                            .map(([id, qty]) => `${qty}x ${activeCatalog.find(p => p.id === id)?.name}`)
                            .join(', ');
                          handlePlaceOrder(
                            `${INDUSTRY_DATA[currentIndustry]?.label} POS Checkout`,
                            getCartTotal(),
                            detailsStr
                          );
                        }}
                        className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs py-2 rounded-lg transition-all"
                      >
                        Finalize & Issue POS Ticket
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* SCHOOL ATTENDANCE Scan QR simulation view */}
            {portalView === 'ATTENDANCE' && (
              <div className="space-y-4 animate-fade-in">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <GraduationCap size={16} className="text-indigo-400" />
                    <span>LMS Offline Attendance QR Check-in</span>
                  </h3>
                  <button onClick={() => setPortalView('HOME')} className="text-neutral-500 hover:text-white text-xs">
                    &larr; Back Hub
                  </button>
                </div>

                <div className="space-y-3.5 bg-neutral-900 p-4 rounded-xl border border-neutral-850">
                  <div className="text-center py-2">
                    <div className="inline-flex p-3 rounded bg-neutral-950 border border-indigo-500/20 mb-2 relative group cursor-pointer" onClick={() => {
                      setStudentIdInput(`STUD-2026-${Math.floor(1000 + Math.random() * 9000)}`);
                    }}>
                      <QrCode size={110} className="text-neutral-300 group-hover:text-indigo-400 transition-colors" />
                      <div className="absolute inset-0 bg-indigo-600/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <span className="text-[10px] text-indigo-400 font-mono font-bold bg-neutral-950 px-2 py-1 rounded border border-indigo-900 shadow">GENERATE NEW QR</span>
                      </div>
                    </div>
                    <p className="text-[10px] text-neutral-500">
                      Tap QR box to mock different student proximity badge scans
                    </p>
                  </div>

                  <div>
                    <label className="text-[11px] text-neutral-400 uppercase tracking-wider block mb-1">Student Badge ID</label>
                    <input
                      type="text"
                      value={studentIdInput}
                      onChange={(e) => setStudentIdInput(e.target.value)}
                      placeholder="e.g. STUD-2026-0041"
                      className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-2 text-xs text-white font-mono"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] text-neutral-400 uppercase tracking-wider block mb-1">Student Full Name</label>
                    <input
                      type="text"
                      value={studentNameInput}
                      onChange={(e) => setStudentNameInput(e.target.value)}
                      placeholder="e.g. David Santos"
                      className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-2 text-xs text-white"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] text-neutral-400 uppercase tracking-wider block mb-1">Grade and Classroom Assignment</label>
                    <select
                      value={studentGradeInput}
                      onChange={(e) => setStudentGradeInput(e.target.value)}
                      className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-2 text-xs text-white"
                    >
                      <option value="Grade 12 - Einstein">Grade 12 - Einstein</option>
                      <option value="Grade 11 - Newton">Grade 11 - Newton</option>
                      <option value="Grade 10 - Tesla">Grade 10 - Tesla</option>
                    </select>
                  </div>

                  <button
                    onClick={handleAttendanceCheckin}
                    className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs py-2 px-3 rounded-lg transition-all"
                  >
                    Simulate Device Proximity Scan Checkin
                  </button>
                </div>
              </div>
            )}

            {/* INTERACTIVE FLOORPLAN PORTAL VIEW */}
            {portalView === 'MAP' && (
              <div className="space-y-4 animate-fade-in text-white">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <Map size={16} className="text-indigo-400" />
                    <span>On-Site Indoor Navigator</span>
                  </h3>
                  <button onClick={() => setPortalView('HOME')} className="text-neutral-500 hover:text-white text-xs">
                    &larr; Back Hub
                  </button>
                </div>

                <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-3.5 space-y-3">
                  <div className="flex items-start gap-2 bg-indigo-950/20 border border-indigo-900/40 p-2.5 rounded-lg text-[11px] leading-relaxed text-neutral-300">
                    <Info size={14} className="text-indigo-400 shrink-0 mt-0.5" />
                    <p>
                      <strong className="text-white">Active Indoor IPS:</strong> Tap anywhere on the floorplan to move your physical location. Select a service desk below to view route details.
                    </p>
                  </div>

                  {/* FLOORPLAN MAP CANVAS */}
                  <div 
                    onClick={(e) => {
                      const rect = e.currentTarget.getBoundingClientRect();
                      const clickX = Math.round(((e.clientX - rect.left) / rect.width) * 100);
                      const clickY = Math.round(((e.clientY - rect.top) / rect.height) * 100);
                      setUserLocation({ x: clickX, y: clickY });
                      addSystemLog('info', `Simulated user tapped map to relocate to coordinates [${clickX}%, ${clickY}%]`);
                    }}
                    className="aspect-[4/3] w-full bg-neutral-950 border border-neutral-850 rounded-xl relative overflow-hidden cursor-crosshair select-none shadow-inner"
                  >
                    {/* SVG Floorplan grid backing */}
                    <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f1f2e_1px,transparent_1px),linear-gradient(to_bottom,#1f1f2e_1px,transparent_1px)] bg-[size:16px_16px] opacity-20" />
                    
                    {/* Style block for dashed line crawling dots animation */}
                    <style dangerouslySetInnerHTML={{__html: `
                      @keyframes dash {
                        to {
                          stroke-dashoffset: -20;
                        }
                      }
                      .animate-dash-line {
                        stroke-dasharray: 6, 4;
                        animation: dash 1.2s linear infinite;
                      }
                    `}} />

                    {/* SVG overlay containing routes and counters */}
                    <svg className="absolute inset-0 w-full h-full pointer-events-none">
                      {/* Blueprint Wall outlines (Simulated architectural layout based on industry) */}
                      {currentIndustry === 'HOSPITAL' && (
                        <>
                          <rect x="5%" y="5%" width="40%" height="45%" fill="none" stroke="#262626" strokeWidth="2" strokeDasharray="3,3" />
                          <rect x="55%" y="5%" width="40%" height="45%" fill="none" stroke="#262626" strokeWidth="2" strokeDasharray="3,3" />
                          <rect x="5%" y="60%" width="40%" height="35%" fill="none" stroke="#262626" strokeWidth="2" strokeDasharray="3,3" />
                          <rect x="55%" y="60%" width="40%" height="35%" fill="none" stroke="#262626" strokeWidth="2" strokeDasharray="3,3" />
                          <text x="25%" y="28%" fill="#525252" fontSize="9" textAnchor="middle" fontFamily="monospace">PED CLINIC</text>
                          <text x="75%" y="28%" fill="#525252" fontSize="9" textAnchor="middle" fontFamily="monospace">CARDIOLOGY</text>
                          <text x="25%" y="78%" fill="#525252" fontSize="9" textAnchor="middle" fontFamily="monospace">KIOSK BAY</text>
                          <text x="75%" y="78%" fill="#525252" fontSize="9" textAnchor="middle" fontFamily="monospace">PHARMACY</text>
                          <text x="50%" y="15%" fill="#3f3f46" fontSize="10" textAnchor="middle" fontFamily="monospace" fontWeight="bold">EMERGENCY ER ZONE</text>
                        </>
                      )}
                      
                      {currentIndustry === 'RESTAURANT' && (
                        <>
                          <rect x="10%" y="10%" width="35%" height="35%" fill="none" stroke="#262626" strokeWidth="2" strokeDasharray="3,3" />
                          <circle cx="27%" cy="27%" r="15" fill="none" stroke="#262626" strokeWidth="1" strokeDasharray="2,2" />
                          <rect x="55%" y="10%" width="35%" height="35%" fill="none" stroke="#262626" strokeWidth="2" strokeDasharray="3,3" />
                          <rect x="10%" y="55%" width="80%" height="35%" fill="none" stroke="#262626" strokeWidth="2" strokeDasharray="3,3" />
                          <text x="27%" y="30%" fill="#525252" fontSize="9" textAnchor="middle" fontFamily="monospace">TABLE HALL A</text>
                          <text x="72%" y="28%" fill="#525252" fontSize="9" textAnchor="middle" fontFamily="monospace">MEAL DISPATCH</text>
                          <text x="50%" y="75%" fill="#525252" fontSize="9" textAnchor="middle" fontFamily="monospace">DINING & BREW ISLAND</text>
                        </>
                      )}

                      {currentIndustry === 'SCHOOL' && (
                        <>
                          <rect x="5%" y="5%" width="42%" height="40%" fill="none" stroke="#262626" strokeWidth="2" strokeDasharray="3,3" />
                          <rect x="53%" y="5%" width="42%" height="40%" fill="none" stroke="#262626" strokeWidth="2" strokeDasharray="3,3" />
                          <rect x="5%" y="55%" width="90%" height="40%" fill="none" stroke="#262626" strokeWidth="2" strokeDasharray="3,3" />
                          <text x="26%" y="25%" fill="#525252" fontSize="9" textAnchor="middle" fontFamily="monospace">EINSTEIN HALL</text>
                          <text x="74%" y="25%" fill="#525252" fontSize="9" textAnchor="middle" fontFamily="monospace">TESLA LAB</text>
                          <text x="50%" y="78%" fill="#525252" fontSize="9" textAnchor="middle" fontFamily="monospace">MAIN LIBRARY HUB & GYM</text>
                        </>
                      )}

                      {currentIndustry === 'GOVERNMENT' && (
                        <>
                          <rect x="5%" y="10%" width="40%" height="35%" fill="none" stroke="#262626" strokeWidth="2" strokeDasharray="3,3" />
                          <rect x="55%" y="10%" width="40%" height="35%" fill="none" stroke="#262626" strokeWidth="2" strokeDasharray="3,3" />
                          <rect x="5%" y="55%" width="40%" height="35%" fill="none" stroke="#262626" strokeWidth="2" strokeDasharray="3,3" />
                          <rect x="55%" y="55%" width="40%" height="35%" fill="none" stroke="#262626" strokeWidth="2" strokeDasharray="3,3" />
                          <text x="25%" y="28%" fill="#525252" fontSize="9" textAnchor="middle" fontFamily="monospace">CLEARANCE ROOM</text>
                          <text x="75%" y="28%" fill="#525252" fontSize="9" textAnchor="middle" fontFamily="monospace">NBI RECORD CO.</text>
                          <text x="25%" y="75%" fill="#525252" fontSize="9" textAnchor="middle" fontFamily="monospace">INFO KIOSK</text>
                          <text x="75%" y="75%" fill="#525252" fontSize="9" textAnchor="middle" fontFamily="monospace">TAX ASSESSMENT</text>
                        </>
                      )}

                      {currentIndustry === 'RETAIL' && (
                        <>
                          <rect x="5%" y="5%" width="40%" height="45%" fill="none" stroke="#262626" strokeWidth="2" strokeDasharray="3,3" />
                          <rect x="55%" y="5%" width="40%" height="45%" fill="none" stroke="#262626" strokeWidth="2" strokeDasharray="3,3" />
                          <rect x="5%" y="60%" width="40%" height="35%" fill="none" stroke="#262626" strokeWidth="2" strokeDasharray="3,3" />
                          <rect x="55%" y="60%" width="40%" height="35%" fill="none" stroke="#262626" strokeWidth="2" strokeDasharray="3,3" />
                          <text x="25%" y="28%" fill="#525252" fontSize="9" textAnchor="middle" fontFamily="monospace">ELECTRONICS</text>
                          <text x="75%" y="28%" fill="#525252" fontSize="9" textAnchor="middle" fontFamily="monospace">APPAREL AISLES</text>
                          <text x="25%" y="78%" fill="#525252" fontSize="9" textAnchor="middle" fontFamily="monospace">RETURNS / HELP</text>
                          <text x="75%" y="78%" fill="#525252" fontSize="9" textAnchor="middle" fontFamily="monospace">CHECKOUT CO.</text>
                        </>
                      )}

                      {currentIndustry === 'TRANSPORT' && (
                        <>
                          <rect x="5%" y="5%" width="90%" height="25%" fill="none" stroke="#262626" strokeWidth="2" strokeDasharray="3,3" />
                          <rect x="5%" y="40%" width="40%" height="50%" fill="none" stroke="#262626" strokeWidth="2" strokeDasharray="3,3" />
                          <rect x="55%" y="40%" width="40%" height="50%" fill="none" stroke="#262626" strokeWidth="2" strokeDasharray="3,3" />
                          <text x="50%" y="20%" fill="#525252" fontSize="9" textAnchor="middle" fontFamily="monospace">SECURITY CHECK & PASS</text>
                          <text x="25%" y="65%" fill="#525252" fontSize="9" textAnchor="middle" fontFamily="monospace">BOARDING GATES A/B</text>
                          <text x="75%" y="65%" fill="#525252" fontSize="9" textAnchor="middle" fontFamily="monospace">BAGGAGE CAROUSEL</text>
                        </>
                      )}

                      {!['HOSPITAL', 'RESTAURANT', 'SCHOOL', 'GOVERNMENT', 'RETAIL', 'TRANSPORT'].includes(currentIndustry) && (
                        <>
                          <rect x="5%" y="5%" width="40%" height="45%" fill="none" stroke="#262626" strokeWidth="2" strokeDasharray="3,3" />
                          <rect x="55%" y="5%" width="40%" height="45%" fill="none" stroke="#262626" strokeWidth="2" strokeDasharray="3,3" />
                          <rect x="5%" y="60%" width="40%" height="35%" fill="none" stroke="#262626" strokeWidth="2" strokeDasharray="3,3" />
                          <rect x="55%" y="60%" width="40%" height="35%" fill="none" stroke="#262626" strokeWidth="2" strokeDasharray="3,3" />
                          <text x="25%" y="28%" fill="#525252" fontSize="8" textAnchor="middle" fontFamily="monospace">MAIN REGISTRATION FOYER</text>
                          <text x="75%" y="28%" fill="#525252" fontSize="8" textAnchor="middle" fontFamily="monospace">OPERATIONS DEP</text>
                          <text x="25%" y="78%" fill="#525252" fontSize="8" textAnchor="middle" fontFamily="monospace">RECEPTION & LOUNGE</text>
                          <text x="75%" y="78%" fill="#525252" fontSize="8" textAnchor="middle" fontFamily="monospace">FAST-TRACK COUNTERS</text>
                        </>
                      )}

                      {/* Render Routing Path line if a destination is selected */}
                      {(() => {
                        const target = getIndustryLocations(currentIndustry).find(loc => loc.id === selectedLocationId);
                        if (!target) return null;
                        return (
                          <>
                            {/* Glowing background line */}
                            <line 
                              x1={`${userLocation.x}%`} 
                              y1={`${userLocation.y}%`} 
                              x2={`${target.x}%`} 
                              y2={`${target.y}%`} 
                              stroke="#6366f1" 
                              strokeWidth="5" 
                              strokeLinecap="round"
                              opacity="0.15" 
                            />
                            {/* Crawling dashed line */}
                            <line 
                              x1={`${userLocation.x}%`} 
                              y1={`${userLocation.y}%`} 
                              x2={`${target.x}%`} 
                              y2={`${target.y}%`} 
                              stroke="#6366f1" 
                              strokeWidth="2.5" 
                              strokeLinecap="round"
                              className="animate-dash-line" 
                            />
                          </>
                        );
                      })()}
                    </svg>

                    {/* Render Service Counter Marker Nodes */}
                    {getIndustryLocations(currentIndustry).map((loc) => {
                      const isTarget = loc.id === selectedLocationId;
                      return (
                        <button
                          key={loc.id}
                          style={{ left: `${loc.x}%`, top: `${loc.y}%` }}
                          onClick={(e) => {
                            e.stopPropagation(); // Prevent updating user coordinates on marker click
                            setSelectedLocationId(loc.id);
                            addSystemLog('info', `Client clicked target node on map: ${loc.name}`);
                          }}
                          className="absolute -translate-x-1/2 -translate-y-1/2 group/marker z-10 p-1 focus:outline-none"
                          title={loc.name}
                        >
                          <div className={`relative flex items-center justify-center rounded-full transition-all ${
                            isTarget 
                              ? 'w-7.5 h-7.5 bg-indigo-500 text-white shadow-[0_0_12px_#6366f1] scale-110 border-2 border-white' 
                              : 'w-6 h-6 bg-neutral-900 border border-neutral-700 text-neutral-400 hover:text-white hover:border-indigo-500 hover:scale-105'
                          }`}>
                            <span className="text-[9px] font-mono font-bold">
                              {loc.type.charAt(0)}
                            </span>
                            
                            {/* Tooltip on hover */}
                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 hidden group-hover/marker:block bg-neutral-950 border border-neutral-800 rounded-md px-2 py-1 text-[9px] font-mono text-white whitespace-nowrap shadow-lg">
                              <span className="font-bold">{loc.name}</span>
                              <span className="block text-neutral-400 text-[8px]">{loc.description}</span>
                            </div>

                            {/* Ping ring for targets */}
                            {isTarget && (
                              <div className="absolute inset-0 rounded-full border border-indigo-400 animate-ping opacity-60" />
                            )}
                          </div>
                        </button>
                      );
                    })}

                    {/* "YOU ARE HERE" Pulsating User Pin */}
                    <div 
                      style={{ left: `${userLocation.x}%`, top: `${userLocation.y}%` }}
                      className="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-none z-20"
                    >
                      <div className="relative flex items-center justify-center">
                        <div className="absolute w-7 h-7 bg-emerald-500/20 rounded-full animate-ping" />
                        <div className="w-4.5 h-4.5 bg-emerald-500 rounded-full border-2 border-white flex items-center justify-center shadow-[0_0_8px_#10b981]">
                          <div className="w-1.5 h-1.5 bg-white rounded-full" />
                        </div>
                        <div className="absolute top-5 bg-emerald-900/90 border border-emerald-500/30 text-[8px] font-sans text-emerald-300 px-1 py-0.5 rounded shadow-md font-bold whitespace-nowrap">
                          YOU ARE HERE
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* NAVIGATION ANALYTICS CARD */}
                  {(() => {
                    // Automatically choose first location if none is selected
                    const locations = getIndustryLocations(currentIndustry);
                    const target = locations.find(loc => loc.id === selectedLocationId) || locations[0];
                    if (!target) return null;

                    const dx = userLocation.x - target.x;
                    const dy = userLocation.y - target.y;
                    const distanceMeters = Math.round(Math.sqrt(dx * dx + dy * dy) * 0.45);
                    const etaSeconds = Math.round(distanceMeters / 1.1); // 1.1 m/s walking speed
                    const etaMin = Math.floor(etaSeconds / 60);
                    const etaSec = etaSeconds % 60;
                    
                    // Live simulation of counter's queue status
                    const queueCount = queueList.filter(
                      q => q.status === 'WAITING' && 
                      (q.serviceType.toLowerCase().includes(target.name.toLowerCase()) || 
                       q.serviceType.toLowerCase().includes(target.type.toLowerCase()))
                    ).length;

                    const calculatedWaitTime = queueCount * 4 + 3; // 4 mins per person, base 3 min

                    return (
                      <div className="bg-neutral-950 border border-neutral-850 rounded-xl p-3 space-y-3">
                        <div className="flex items-center justify-between border-b border-neutral-900 pb-2">
                          <div>
                            <span className="text-[10px] text-indigo-400 font-mono block tracking-wider uppercase font-bold">ROUTE TARGET DESK</span>
                            <span className="text-xs font-bold text-white font-sans">{target.name}</span>
                          </div>
                          <span className="text-[10px] px-2 py-0.5 rounded bg-neutral-900 border border-neutral-800 text-neutral-400 uppercase font-semibold font-mono">
                            {target.type}
                          </span>
                        </div>

                        <div className="grid grid-cols-3 gap-2 text-center">
                          <div className="bg-neutral-900/60 p-2 rounded-lg border border-neutral-900">
                            <span className="text-[9px] text-neutral-500 block uppercase font-mono">Walking Dist.</span>
                            <span className="text-xs font-bold font-mono text-white">{distanceMeters} meters</span>
                          </div>
                          <div className="bg-neutral-900/60 p-2 rounded-lg border border-neutral-900">
                            <span className="text-[9px] text-neutral-500 block uppercase font-mono">Walking ETA</span>
                            <span className="text-xs font-bold font-mono text-indigo-400">
                              {etaMin > 0 ? `${etaMin}m ` : ''}{etaSec}s
                            </span>
                          </div>
                          <div className="bg-neutral-900/60 p-2 rounded-lg border border-neutral-900">
                            <span className="text-[9px] text-neutral-500 block uppercase font-mono">Queue Delay</span>
                            <span className={`text-xs font-bold font-mono ${queueCount > 1 ? 'text-amber-400 animate-pulse' : 'text-emerald-400'}`}>
                              ~{calculatedWaitTime} mins
                            </span>
                          </div>
                        </div>

                        <div className="text-[10px] text-neutral-400 leading-normal bg-neutral-900/30 p-2 rounded border border-neutral-900 italic">
                          "{target.description}"
                        </div>

                        <div className="flex gap-2">
                          <button
                            onClick={() => {
                              setSelectedLocationId(target.id);
                              setClientServiceType(target.name);
                              setPortalView('QUEUE');
                              triggerDemoAlert(`Prefilled service desk location: ${target.name}. Issue queue ticket now!`);
                            }}
                            className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs py-2 px-3 rounded-lg transition-all text-center"
                          >
                            Queue Up at This Desk
                          </button>
                          
                          {currentIndustry === 'SCHOOL' && (
                            <button
                              onClick={() => {
                                setStudentGradeInput('Grade 12 - Einstein');
                                setPortalView('ATTENDANCE');
                              }}
                              className="bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 border border-emerald-800 hover:border-emerald-700 font-bold text-xs py-2 px-3 rounded-lg transition-all"
                            >
                              Badge In
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })()}
                </div>
              </div>
            )}

          </div>

          {/* Virtual Phone Bottom Navigation Bar */}
          <div className="bg-neutral-900 border-t border-neutral-900 p-2.5 flex justify-around">
            <button
              onClick={() => { setPortalView('HOME'); addSystemLog('info', 'Client pressed Captive Portal Home menu.'); }}
              className={`flex flex-col items-center gap-0.5 text-[10px] font-medium transition-all ${portalView === 'HOME' ? 'text-indigo-400 font-semibold' : 'text-neutral-500 hover:text-neutral-300'}`}
            >
              <LayoutDashboard size={14} />
              <span>Services</span>
            </button>
            <button
              onClick={() => { setPortalView('QUEUE'); }}
              className={`flex flex-col items-center gap-0.5 text-[10px] font-medium transition-all ${portalView === 'QUEUE' ? 'text-indigo-400 font-semibold' : 'text-neutral-500 hover:text-neutral-300'}`}
            >
              <Clock size={14} />
              <span>Queue Up</span>
            </button>
            <button
              onClick={() => { setPortalView('FORM'); }}
              className={`flex flex-col items-center gap-0.5 text-[10px] font-medium transition-all ${portalView === 'FORM' ? 'text-indigo-400 font-semibold' : 'text-neutral-500 hover:text-neutral-300'}`}
            >
              <FileText size={14} />
              <span>Paperless Forms</span>
            </button>
            <button
              onClick={() => { setPortalView('MAP'); addSystemLog('info', 'Client pressed Captive Portal Indoor Map tab.'); }}
              className={`flex flex-col items-center gap-0.5 text-[10px] font-medium transition-all ${portalView === 'MAP' ? 'text-indigo-400 font-semibold' : 'text-neutral-500 hover:text-neutral-300'}`}
            >
              <Map size={14} />
              <span>Indoor Map</span>
            </button>
          </div>

        </section>

        {/* RIGHT COLUMN: ENTERPRISE CONTROL & BACKEND TELEMETRY DECK (70% SPACE ON DESKTOP) */}
        <section className="lg:col-span-7 space-y-6 flex flex-col">
          <RoleDashboards
            userRole={userRole}
            currentIndustry={currentIndustry}
            queueList={queueList}
            transactionList={transactionList}
            attendanceList={attendanceList}
            logs={logs}
            offlineTxnBuffer={offlineTxnBuffer}
            offlineQueueBuffer={offlineQueueBuffer}
            customFields={customFields}
            newFieldName={newFieldName}
            setNewFieldName={setNewFieldName}
            newFieldType={newFieldType}
            setNewFieldType={setNewFieldType}
            newFieldOptions={newFieldOptions}
            setNewFieldOptions={setNewFieldOptions}
            handleAddField={handleAddField}
            handleRemoveField={handleRemoveField}
            workflowRules={workflowRules}
            setWorkflowRules={setWorkflowRules}
            isOnline={isOnline}
            setIsOnline={setIsOnline}
            syncing={syncing}
            handleForceSync={handleForceSync}
            handleResetDemo={handleResetDemo}
            handleUpdateQueueStatus={handleUpdateQueueStatus}
            addSystemLog={addSystemLog}
            triggerDemoAlert={triggerDemoAlert}
            broadcastMsg={broadcastMsg}
            selectedLocationId={selectedLocationId}
            setSelectedLocationId={setSelectedLocationId}
            getCartTotal={getCartTotal}
            taskList={taskList}
            toggleTaskStatus={toggleTaskStatus}
          />

          {/* INVESTOR BLUEPRINT VALUE PROPOSITION METER */}
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5 relative overflow-hidden shadow-xl" id="investor-blueprint-widget">
            <div className="absolute inset-0 bg-[radial-gradient(#ffffff02_1px,transparent_1px)] [background-size:14px_14px] pointer-events-none" />
            <span className="text-[10px] uppercase font-mono font-bold tracking-widest text-indigo-400 block mb-1">
              INVESTOR VALUE METRICS
            </span>
            <h3 className="text-base font-bold text-white tracking-tight">
              Enterprise Multi-Tenant SaaS Integration Strategy
            </h3>
            <p className="text-xs text-neutral-450 mt-1 leading-relaxed">
              Every on-site deployed OSMOS instance operates completely autonomously inside its own LAN captive-portal mesh. If internet connectivity falls, local operations process immediately with instant offline queue issue, orders placement, forms caching, and student badge check-ins. When link uplinks are re-established, high-speed PostgreSQL & Redis batch syncing triggers, feeding beautiful central remote visual control dashboards automatically.
            </p>
          </div>
        </section>

      </main>

      {/* FOOTER */}
      <footer className="border-t border-neutral-900 bg-neutral-950 px-6 py-4 flex flex-col sm:flex-row items-center justify-between text-[11px] text-neutral-500 gap-2">
        <span>OSMOS™ Distributed Service Operating System. Configured for local Micro-SaaS.</span>
        <span className="font-mono">Uplink Cluster Server: Asia-East (Dev Sandbox)</span>
      </footer>

    </div>
  );
}
