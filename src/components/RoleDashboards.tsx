import React, { useState } from 'react';
import { 
  Clock, 
  Database, 
  Coins, 
  RefreshCw, 
  Info, 
  Zap, 
  Sparkles, 
  X, 
  Wifi, 
  WifiOff, 
  Users, 
  Sliders, 
  Settings 
} from 'lucide-react';

interface RoleDashboardsProps {
  userRole: 'END_USER_CUSTOMER' | 'STAFF_WORKER' | 'MANAGER_SUPERVISOR' | 'ADMIN_OWNER';
  currentIndustry: string;
  queueList: any[];
  transactionList: any[];
  attendanceList: any[];
  logs: any[];
  offlineTxnBuffer: any[];
  offlineQueueBuffer: any[];
  customFields: any[];
  newFieldName: string;
  setNewFieldName: (val: string) => void;
  newFieldType: 'text' | 'number' | 'select' | 'textarea';
  setNewFieldType: (val: 'text' | 'number' | 'select' | 'textarea') => void;
  newFieldOptions: string;
  setNewFieldOptions: (val: string) => void;
  handleAddField: () => void;
  handleRemoveField: (id: string) => void;
  workflowRules: any[];
  setWorkflowRules: React.Dispatch<React.SetStateAction<any[]>>;
  isOnline: boolean;
  setIsOnline: (val: boolean) => void;
  syncing: boolean;
  handleForceSync: () => void;
  handleResetDemo: () => void;
  handleUpdateQueueStatus: (id: string, status: string) => void;
  addSystemLog: (level: 'info' | 'warn' | 'error' | 'success', message: string) => void;
  triggerDemoAlert: (msg: string) => void;
  broadcastMsg: string;
  selectedLocationId: string;
  setSelectedLocationId: (id: string) => void;
  getCartTotal: () => number;
  taskList: any[];
  toggleTaskStatus: (id: string) => void;
}

export function RoleDashboards({
  userRole,
  currentIndustry,
  queueList,
  transactionList,
  attendanceList,
  logs,
  offlineTxnBuffer,
  offlineQueueBuffer,
  customFields,
  newFieldName,
  setNewFieldName,
  newFieldType,
  setNewFieldType,
  newFieldOptions,
  setNewFieldOptions,
  handleAddField,
  handleRemoveField,
  workflowRules,
  setWorkflowRules,
  isOnline,
  setIsOnline,
  syncing,
  handleForceSync,
  handleResetDemo,
  handleUpdateQueueStatus,
  addSystemLog,
  triggerDemoAlert,
  broadcastMsg,
  selectedLocationId,
  setSelectedLocationId,
  getCartTotal,
  taskList,
  toggleTaskStatus,
}: RoleDashboardsProps) {
  // Sub-tabs local state
  const [customerSubTab, setCustomerSubTab] = useState<'STATUS' | 'SERVICES' | 'ORDERS' | 'REQUESTS'>('STATUS');
  const [staffSubTab, setStaffSubTab] = useState<'QUEUE' | 'TASKS' | 'TRANSACTIONS' | 'NOTIFICATIONS'>('QUEUE');
  const [managerSubTab, setManagerSubTab] = useState<'ANALYTICS' | 'REPORTS' | 'PERFORMANCE'>('ANALYTICS');
  const [ownerSubTab, setOwnerSubTab] = useState<'INSIGHTS' | 'USERS' | 'SETTINGS'>('INSIGHTS');

  return (
    <div className="space-y-6 flex flex-col w-full" id="role-dashboards-module">
      
      {/* USER ROLE HEADER CARD */}
      <div className="bg-neutral-900/60 border border-neutral-850 p-5 rounded-2xl relative overflow-hidden backdrop-blur-md" id="role-header-banner">
        <div className="absolute inset-0 bg-[radial-gradient(#ffffff01_1px,transparent_1px)] [background-size:12px_12px] pointer-events-none" />
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-[9px] font-mono uppercase font-bold tracking-widest text-indigo-400">ROLE-SPECIFIC DESKTOP CONSOLE</span>
              <span className="h-3 w-[1px] bg-neutral-800" />
              <span className="text-[9.5px] font-mono uppercase font-bold text-emerald-400 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                System Active
              </span>
            </div>
            <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
              {userRole === 'END_USER_CUSTOMER' && <>🛋️ Customer Waiting Lounge & Portal</>}
              {userRole === 'STAFF_WORKER' && <>📟 Staff & Operator Service Desk</>}
              {userRole === 'MANAGER_SUPERVISOR' && <>📊 Operational Optimization Console</>}
              {userRole === 'ADMIN_OWNER' && <>👑 Enterprise Root Control Deck</>}
            </h2>
            <p className="text-xs text-neutral-400 max-w-2xl leading-relaxed">
              {userRole === 'END_USER_CUSTOMER' && 'Track live queue tickets in real-time, browse localized services catalog, view transaction slips, and complete paperless registrations.'}
              {userRole === 'STAFF_WORKER' && 'Active terminal operator panel to dispatch tickets, checklist physical shift tasks, and track completed cashless checkouts.'}
              {userRole === 'MANAGER_SUPERVISOR' && 'Tactical oversight of on-site latency metrics, process flow diagrams, and self-optimizing system automation triggers.'}
              {userRole === 'ADMIN_OWNER' && 'Full administrator configuration of connected hardware nodes, multi-tenant SaaS integration, and system cache states.'}
            </p>
          </div>

          <span className={`text-[10px] font-mono px-3 py-1 rounded-full border uppercase tracking-wider font-extrabold select-none self-start sm:self-center ${
            userRole === 'ADMIN_OWNER' ? 'bg-red-950/40 text-red-400 border-red-900/50' :
            userRole === 'MANAGER_SUPERVISOR' ? 'bg-amber-950/40 text-amber-400 border-amber-900/50' :
            userRole === 'STAFF_WORKER' ? 'bg-indigo-950/40 text-indigo-400 border-indigo-900/50' :
            'bg-emerald-950/40 text-emerald-400 border-emerald-900/50'
          }`} id="role-badge-display">
            {userRole === 'ADMIN_OWNER' && 'Root Administrator'}
            {userRole === 'MANAGER_SUPERVISOR' && 'Supervisor'}
            {userRole === 'STAFF_WORKER' && 'Terminal Operator'}
            {userRole === 'END_USER_CUSTOMER' && 'Guest Visitor'}
          </span>
        </div>

        {/* QUICK DASHBOARD SUB-TAB SELECTOR GRID */}
        <div className="grid grid-cols-2 sm:grid-flow-col auto-cols-max gap-2 mt-4 pt-4 border-t border-neutral-850/60 overflow-x-auto" id="dashboard-tab-triggers">
          {userRole === 'END_USER_CUSTOMER' && (
            <>
              <button
                onClick={() => setCustomerSubTab('STATUS')}
                className={`text-[11px] font-medium px-3.5 py-1.5 rounded-lg transition-all ${customerSubTab === 'STATUS' ? 'bg-indigo-600 text-white font-semibold' : 'bg-neutral-950 text-neutral-400 hover:text-neutral-200 border border-neutral-850'}`}
              >
                🖥️ Live Status Scoreboard
              </button>
              <button
                onClick={() => setCustomerSubTab('SERVICES')}
                className={`text-[11px] font-medium px-3.5 py-1.5 rounded-lg transition-all ${customerSubTab === 'SERVICES' ? 'bg-indigo-600 text-white font-semibold' : 'bg-neutral-950 text-neutral-400 hover:text-neutral-200 border border-neutral-850'}`}
              >
                🛠️ On-Site Services Map
              </button>
              <button
                onClick={() => setCustomerSubTab('ORDERS')}
                className={`text-[11px] font-medium px-3.5 py-1.5 rounded-lg transition-all ${customerSubTab === 'ORDERS' ? 'bg-indigo-600 text-white font-semibold' : 'bg-neutral-950 text-neutral-400 hover:text-neutral-200 border border-neutral-850'}`}
              >
                🛒 My Orders & Bills
              </button>
              <button
                onClick={() => setCustomerSubTab('REQUESTS')}
                className={`text-[11px] font-medium px-3.5 py-1.5 rounded-lg transition-all ${customerSubTab === 'REQUESTS' ? 'bg-indigo-600 text-white font-semibold' : 'bg-neutral-950 text-neutral-400 hover:text-neutral-200 border border-neutral-850'}`}
              >
                📋 Submitted Requests
              </button>
            </>
          )}

          {userRole === 'STAFF_WORKER' && (
            <>
              <button
                onClick={() => setStaffSubTab('QUEUE')}
                className={`text-[11px] font-medium px-3.5 py-1.5 rounded-lg transition-all ${staffSubTab === 'QUEUE' ? 'bg-indigo-600 text-white font-semibold' : 'bg-neutral-950 text-neutral-400 hover:text-neutral-200 border border-neutral-850'}`}
              >
                📟 Queue Desk Dispatch
              </button>
              <button
                onClick={() => setStaffSubTab('TASKS')}
                className={`text-[11px] font-medium px-3.5 py-1.5 rounded-lg transition-all ${staffSubTab === 'TASKS' ? 'bg-indigo-600 text-white font-semibold' : 'bg-neutral-950 text-neutral-400 hover:text-neutral-200 border border-neutral-850'}`}
              >
                📝 Shift Operational Tasks
              </button>
              <button
                onClick={() => setStaffSubTab('TRANSACTIONS')}
                className={`text-[11px] font-medium px-3.5 py-1.5 rounded-lg transition-all ${staffSubTab === 'TRANSACTIONS' ? 'bg-indigo-600 text-white font-semibold' : 'bg-neutral-950 text-neutral-400 hover:text-neutral-200 border border-neutral-850'}`}
              >
                💳 Cashier Checkout Logs
              </button>
              <button
                onClick={() => setStaffSubTab('NOTIFICATIONS')}
                className={`text-[11px] font-medium px-3.5 py-1.5 rounded-lg transition-all ${staffSubTab === 'NOTIFICATIONS' ? 'bg-indigo-600 text-white font-semibold' : 'bg-neutral-950 text-neutral-400 hover:text-neutral-200 border border-neutral-850'}`}
              >
                🔔 Urgent Desk Alarms
              </button>
            </>
          )}

          {userRole === 'MANAGER_SUPERVISOR' && (
            <>
              <button
                onClick={() => setManagerSubTab('ANALYTICS')}
                className={`text-[11px] font-medium px-3.5 py-1.5 rounded-lg transition-all ${managerSubTab === 'ANALYTICS' ? 'bg-indigo-600 text-white font-semibold' : 'bg-neutral-950 text-neutral-400 hover:text-neutral-200 border border-neutral-850'}`}
              >
                📈 Latency Bottlenecks Analyzer
              </button>
              <button
                onClick={() => setManagerSubTab('REPORTS')}
                className={`text-[11px] font-medium px-3.5 py-1.5 rounded-lg transition-all ${managerSubTab === 'REPORTS' ? 'bg-indigo-600 text-white font-semibold' : 'bg-neutral-950 text-neutral-400 hover:text-neutral-200 border border-neutral-850'}`}
              >
                🪄 AI Behavioral Reports
              </button>
              <button
                onClick={() => setManagerSubTab('PERFORMANCE')}
                className={`text-[11px] font-medium px-3.5 py-1.5 rounded-lg transition-all ${managerSubTab === 'PERFORMANCE' ? 'bg-indigo-600 text-white font-semibold' : 'bg-neutral-950 text-neutral-400 hover:text-neutral-200 border border-neutral-850'}`}
              >
                ⚙️ Deployed Microservices
              </button>
            </>
          )}

          {userRole === 'ADMIN_OWNER' && (
            <>
              <button
                onClick={() => setOwnerSubTab('INSIGHTS')}
                className={`text-[11px] font-medium px-3.5 py-1.5 rounded-lg transition-all ${ownerSubTab === 'INSIGHTS' ? 'bg-indigo-600 text-white font-semibold' : 'bg-neutral-950 text-neutral-400 hover:text-neutral-200 border border-neutral-850'}`}
              >
                🌐 Global SaaS Insights
              </button>
              <button
                onClick={() => setOwnerSubTab('USERS')}
                className={`text-[11px] font-medium px-3.5 py-1.5 rounded-lg transition-all ${ownerSubTab === 'USERS' ? 'bg-indigo-600 text-white font-semibold' : 'bg-neutral-950 text-neutral-400 hover:text-neutral-200 border border-neutral-850'}`}
              >
                👥 Connected Hardware Nodes
              </button>
              <button
                onClick={() => setOwnerSubTab('SETTINGS')}
                className={`text-[11px] font-medium px-3.5 py-1.5 rounded-lg transition-all ${ownerSubTab === 'SETTINGS' ? 'bg-indigo-600 text-white font-semibold' : 'bg-neutral-950 text-neutral-400 hover:text-neutral-200 border border-neutral-850'}`}
              >
                🔧 Edge Forms Configuration
              </button>
            </>
          )}
        </div>
      </div>

      {/* DYNAMIC DASHBOARD CONTENT AREAS */}
      <div className="space-y-6" id="dashboard-content-panels">
        
        {/* 1. CUSTOMER DASHBOARD CONTAINER */}
        {userRole === 'END_USER_CUSTOMER' && (
          <div className="space-y-6 animate-fade-in" id="customer-dashboard-view">
            
            {/* SUBTAB: STATUS */}
            {customerSubTab === 'STATUS' && (
              <div className="space-y-6 animate-fade-in" id="customer-status-tab">
                {/* Live Broadcast Ticker */}
                <div className="bg-neutral-950 border border-neutral-850 p-3 rounded-xl flex items-center justify-between overflow-hidden relative shadow-lg">
                  <div className="absolute inset-0 bg-[radial-gradient(#ffffff01_1px,transparent_1px)] [background-size:12px_12px] pointer-events-none" />
                  <div className="flex items-center gap-2 shrink-0 z-10 bg-neutral-950 pr-4">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping shrink-0" />
                    <span className="text-[10px] font-mono text-emerald-400 font-extrabold uppercase tracking-widest flex items-center gap-1">
                      <Info size={12} />
                      <span>LIVE BROADCAST:</span>
                    </span>
                  </div>
                  <div className="flex-1 overflow-hidden z-10">
                    <marquee scrollamount="4.5" className="text-amber-400 font-mono text-xs font-semibold select-none">
                      🔔 {broadcastMsg} &bull; Please check the status scoreboard below &bull; OSMOS Local Node Operating Perfectly Offline.
                    </marquee>
                  </div>
                </div>

                {/* Now Serving Spotlight */}
                {(() => {
                  const servingTicket = queueList.find(q => q.status === 'SERVING');
                  return (
                    <div className="bg-gradient-to-br from-indigo-950/20 to-neutral-950 border border-indigo-900/40 p-6 rounded-2xl relative overflow-hidden shadow-xl text-center flex flex-col items-center justify-center min-h-[220px]">
                      <div className="absolute top-3 left-3 flex items-center gap-1.5 text-[9px] font-mono text-indigo-400 font-extrabold tracking-widest bg-indigo-950/40 px-2 py-0.5 border border-indigo-900 rounded">
                        <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-ping" />
                        <span>NOW SERVING SCOREBOARD</span>
                      </div>

                      {servingTicket ? (
                        <div className="space-y-3 animate-pulse">
                          <span className="text-[10px] font-mono text-emerald-400 font-bold uppercase tracking-widest block bg-emerald-950/30 px-3 py-1 rounded-full border border-emerald-900/40 max-w-max mx-auto">
                            COUNTER CALL ACTIVE
                          </span>
                          <h3 className="text-7xl font-mono font-extrabold text-white tracking-tight">
                            {servingTicket.number}
                          </h3>
                          <div className="space-y-1">
                            <p className="text-sm font-semibold text-neutral-200 uppercase tracking-wide">
                              {servingTicket.clientName}
                            </p>
                            <span className="text-xs text-neutral-450 block font-mono">
                              {servingTicket.serviceType} &bull; Counter Slot B
                            </span>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <div className="w-12 h-12 rounded-full bg-neutral-900 border border-neutral-800 flex items-center justify-center text-neutral-500 mx-auto">
                            <Clock size={20} />
                          </div>
                          <span className="text-xs font-mono text-neutral-400 uppercase font-bold tracking-wider block">ALL COUNTERS IDLE</span>
                          <p className="text-[11px] text-neutral-500 max-w-xs leading-normal">
                            Standard ticket latency averages 4 minutes. Walk up or trigger a scenario checklist on the left profile card.
                          </p>
                        </div>
                      )}
                    </div>
                  );
                })()}

                {/* Waiting list split */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Left: Queue ticket stream */}
                  <div className="bg-neutral-950 border border-neutral-850 p-4 rounded-xl space-y-3">
                    <span className="text-[10px] font-mono font-bold text-neutral-455 uppercase block">WAITING TICKET STREAM</span>
                    <div className="space-y-2 max-h-48 overflow-y-auto">
                      {queueList.filter(q => q.status === 'WAITING').map((q) => (
                        <div key={q.id} className="bg-neutral-900/50 p-2.5 rounded border border-neutral-850 flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-mono font-bold text-indigo-400">{q.number}</span>
                            <span className="text-xs font-medium text-neutral-300">{q.clientName}</span>
                          </div>
                          <span className="text-[10px] font-mono text-neutral-500 uppercase">{q.serviceType}</span>
                        </div>
                      ))}
                      {queueList.filter(q => q.status === 'WAITING').length === 0 && (
                        <p className="text-[11px] text-neutral-500 italic text-center py-4 font-mono">Lounge Waiting Queue Empty</p>
                      )}
                    </div>
                  </div>

                  {/* Right: Proximity checkin simulator */}
                  <div className="bg-neutral-950 border border-neutral-850 p-4 rounded-xl space-y-3 flex flex-col justify-between">
                    <div>
                      <span className="text-[10px] font-mono font-bold text-neutral-455 uppercase block mb-1">PROXIMITY BADGE BEACON TAP</span>
                      <span className="text-xs font-semibold text-neutral-200 block">Simulate RFID/NFC Tag Check-In</span>
                      <p className="text-[10px] text-neutral-500 leading-relaxed mt-1">
                        Physical establishments can place tablets with RFID readers at access points. Scan card or tap to immediately log visitor attendance.
                      </p>
                    </div>

                    <button
                      onClick={() => {
                        const studentMock = {
                          studentId: 'STUDENT-' + Math.floor(Math.random() * 9000 + 1000),
                          name: 'Marcus Lopez',
                          gradeSection: 'Grade 12 - Newton'
                        };
                        addSystemLog('success', `Detected local NFC proximity badge: [${studentMock.name}] (${studentMock.studentId})`);
                        triggerDemoAlert('Proximity RFID scanned: ' + studentMock.name);
                      }}
                      className="w-full bg-neutral-900 hover:bg-neutral-850 border border-neutral-800 text-neutral-300 text-[11px] py-2 rounded-lg font-mono font-bold transition-all text-center flex items-center justify-center gap-1.5"
                    >
                      <Zap size={11} className="text-indigo-400" />
                      <span>Tap Proximity RFID Chip</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* SUBTAB: SERVICES */}
            {customerSubTab === 'SERVICES' && (
              <div className="space-y-6 animate-fade-in" id="customer-services-tab">
                {/* Catalog grid */}
                <div className="bg-neutral-950 border border-neutral-850 p-4 rounded-xl space-y-3">
                  <span className="text-[10px] font-mono font-bold text-neutral-455 uppercase block">Local Operations Services Directory</span>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="bg-neutral-900/60 border border-neutral-850 p-3 rounded-lg">
                      <span className="text-indigo-400 text-lg block mb-1">🖥️</span>
                      <span className="text-xs font-bold text-neutral-200 block">Smart Queue Desk</span>
                      <span className="text-[10px] text-neutral-450 block mt-0.5">Automated queue ticketing with smart desk load balance routing.</span>
                    </div>
                    <div className="bg-neutral-900/60 border border-neutral-850 p-3 rounded-lg">
                      <span className="text-indigo-400 text-lg block mb-1">📝</span>
                      <span className="text-xs font-bold text-neutral-200 block">Paperless Forms</span>
                      <span className="text-[10px] text-neutral-450 block mt-0.5">Digitize client entries instantly. Saved to offline SQLite.</span>
                    </div>
                    <div className="bg-neutral-900/60 border border-neutral-850 p-3 rounded-lg">
                      <span className="text-indigo-400 text-lg block mb-1">🗺️</span>
                      <span className="text-xs font-bold text-neutral-200 block">Indoor Navigation</span>
                      <span className="text-[10px] text-neutral-450 block mt-0.5">Real-time captive portal IPS floorplan tracking system.</span>
                    </div>
                  </div>
                </div>

                {/* Floorplan Map Container */}
                <div className="bg-neutral-950 border border-neutral-850 p-4 rounded-xl space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-mono font-bold text-neutral-455 uppercase block">LIVE INDOOR POSITIONING TRACKER</span>
                      <span className="text-xs font-semibold text-neutral-200 block">Establishment IPS Interactive Floorplan</span>
                    </div>
                    <span className="text-[9px] font-mono text-neutral-500">Scale: Local LAN Mesh</span>
                  </div>

                  {/* Map Area */}
                  <div className="relative border border-neutral-850 rounded-xl bg-neutral-900/40 p-4 min-h-[220px]">
                    <div className="absolute inset-0 bg-neutral-950/20" />
                    <div className="relative z-10 w-full h-full min-h-[180px] border border-dashed border-neutral-800 rounded-lg flex items-center justify-center p-3">
                      {/* Simulated beacons */}
                      <div className="absolute top-4 left-4 text-center">
                        <span className="block text-[8px] font-mono text-neutral-600 uppercase">Gateway Node 1</span>
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/20 border border-emerald-500 inline-block animate-ping" />
                      </div>
                      <div className="absolute bottom-4 right-4 text-center">
                        <span className="block text-[8px] font-mono text-neutral-600 uppercase">Uplink Router 3</span>
                        <span className="w-2.5 h-2.5 rounded-full bg-indigo-500/20 border border-indigo-500 inline-block animate-ping" />
                      </div>

                      {/* Central map icon indicators */}
                      <div className="grid grid-cols-2 gap-4 w-full max-w-sm text-center">
                        <button
                          onClick={() => { setSelectedLocationId('desk-a'); addSystemLog('info', 'Customer selected Floorplan Location: Desk A'); }}
                          className={`p-3 rounded border text-xs transition-all ${selectedLocationId === 'desk-a' ? 'bg-indigo-950 border-indigo-500 text-white font-bold' : 'bg-neutral-950/80 border-neutral-850 text-neutral-400'}`}
                        >
                          🖥️ Service Desk A
                        </button>
                        <button
                          onClick={() => { setSelectedLocationId('desk-b'); addSystemLog('info', 'Customer selected Floorplan Location: Desk B'); }}
                          className={`p-3 rounded border text-xs transition-all ${selectedLocationId === 'desk-b' ? 'bg-indigo-950 border-indigo-500 text-white font-bold' : 'bg-neutral-950/80 border-neutral-850 text-neutral-400'}`}
                        >
                          🏪 Cashier Terminal B
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* SUBTAB: ORDERS */}
            {customerSubTab === 'ORDERS' && (
              <div className="space-y-6 animate-fade-in" id="customer-orders-tab">
                {/* Ordered checkout table */}
                <div className="bg-neutral-950 border border-neutral-850 p-4 rounded-xl space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-mono font-bold text-neutral-455 uppercase block">Cashless Order Basket</span>
                      <span className="text-xs font-semibold text-neutral-200 block">Active Cart & Catalog Billing Receipts</span>
                    </div>
                    <span className="text-xs font-bold font-mono text-indigo-400">Total: ₱{getCartTotal()}</span>
                  </div>

                  {/* Cashier logs stream */}
                  <div className="overflow-x-auto rounded-xl border border-neutral-850">
                    <table className="w-full text-left font-mono text-[11px]">
                      <thead className="bg-neutral-950 text-neutral-400 uppercase text-[10px] border-b border-neutral-800">
                        <tr>
                          <th className="p-3">Reference</th>
                          <th className="p-3">Industry</th>
                          <th className="p-3">Task Details</th>
                          <th className="p-3">Amount</th>
                          <th className="p-3">Uplink Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-neutral-950 bg-neutral-900/40">
                        {offlineTxnBuffer.map((t) => (
                          <tr key={t.id} className="bg-amber-950/10 border-l-2 border-amber-500">
                            <td className="p-3 text-amber-400 font-bold">{t.reference}</td>
                            <td className="p-3 font-sans">{t.industry}</td>
                            <td className="p-3 font-sans text-neutral-400">{t.details}</td>
                            <td className="p-3 text-amber-400 font-bold">₱{t.amount}</td>
                            <td className="p-3">
                              <span className="text-[9px] bg-amber-950 text-amber-400 border border-amber-900 px-1.5 py-0.5 rounded font-bold uppercase">Buffered Offline</span>
                            </td>
                          </tr>
                        ))}

                        {transactionList.map((t) => (
                          <tr key={t.id}>
                            <td className="p-3 text-white font-bold">{t.reference}</td>
                            <td className="p-3 font-sans text-neutral-400">{t.industry}</td>
                            <td className="p-3 font-sans text-neutral-450">{t.details}</td>
                            <td className="p-3 text-indigo-400 font-bold">₱{t.amount}</td>
                            <td className="p-3">
                              <span className="text-[9px] bg-emerald-950 text-emerald-400 border border-emerald-900 px-1.5 py-0.5 rounded font-bold uppercase">Cloud Synced</span>
                            </td>
                          </tr>
                        ))}

                        {transactionList.length === 0 && offlineTxnBuffer.length === 0 && (
                          <tr>
                            <td colSpan={5} className="p-4 text-center text-neutral-500 italic font-sans">No digital orders placed yet. Place items using the Simulated Customer Portal.</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* SUBTAB: REQUESTS */}
            {customerSubTab === 'REQUESTS' && (
              <div className="space-y-6 animate-fade-in" id="customer-requests-tab">
                <div className="bg-neutral-950 border border-neutral-850 p-4 rounded-xl space-y-4">
                  <div>
                    <span className="text-[10px] font-mono font-bold text-neutral-455 uppercase block">Client Request Audit Log</span>
                    <span className="text-xs font-semibold text-neutral-200 block">Submitted Paperless Form History</span>
                  </div>

                  <div className="space-y-2.5">
                    <div className="bg-neutral-900 p-3 rounded border border-neutral-850 flex items-center justify-between">
                      <div className="space-y-0.5">
                        <span className="text-xs font-bold text-neutral-200 block">Barangay Clearance Request</span>
                        <span className="text-[9px] font-mono text-indigo-400 uppercase">Verification Level: Local Database Approved</span>
                      </div>
                      <span className="text-[9px] font-mono bg-emerald-950 text-emerald-400 border border-emerald-900 px-1.5 py-0.5 rounded font-bold">SUCCESS</span>
                    </div>
                    <div className="bg-neutral-900 p-3 rounded border border-neutral-850 flex items-center justify-between">
                      <div className="space-y-0.5">
                        <span className="text-xs font-bold text-neutral-200 block">Academic Enrollment Check-in</span>
                        <span className="text-[9px] font-mono text-amber-400 uppercase">Verification Level: Local Caching Pending Uplink</span>
                      </div>
                      <span className="text-[9px] font-mono bg-amber-950 text-amber-400 border border-amber-900 px-1.5 py-0.5 rounded font-bold">CACHED</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

          </div>
        )}

        {/* 2. STAFF DASHBOARD CONTAINER */}
        {userRole === 'STAFF_WORKER' && (
          <div className="space-y-6 animate-fade-in" id="staff-dashboard-view">
            
            {/* SUBTAB: QUEUE */}
            {staffSubTab === 'QUEUE' && (
              <div className="space-y-6 animate-fade-in" id="staff-queue-tab">
                {/* Live Ticket Stream Desk */}
                <div className="bg-neutral-950 border border-neutral-850 p-4 rounded-xl space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-mono font-bold text-neutral-455 uppercase block">Terminal Queue Stream</span>
                      <span className="text-xs font-semibold text-neutral-200 block">Operator Desk Queue Controller</span>
                    </div>
                    <span className="text-xs font-mono text-indigo-400 font-bold">{queueList.length} Active</span>
                  </div>

                  {/* Ticket controls */}
                  <div className="overflow-x-auto rounded-xl border border-neutral-850">
                    <table className="w-full text-left font-mono text-[11px]">
                      <thead className="bg-neutral-950 text-neutral-400 uppercase text-[10px] border-b border-neutral-800">
                        <tr>
                          <th className="p-3">Ticket</th>
                          <th className="p-3">Customer</th>
                          <th className="p-3">Service Desk</th>
                          <th className="p-3">Priority</th>
                          <th className="p-3">Status</th>
                          <th className="p-3 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-neutral-950 bg-neutral-900/40">
                        {queueList.map((q) => (
                          <tr key={q.id} className={q.status === 'SERVING' ? 'bg-indigo-950/25' : ''}>
                            <td className="p-3 font-bold text-white">{q.number}</td>
                            <td className="p-3 font-sans text-neutral-200">{q.clientName}</td>
                            <td className="p-3 font-sans text-neutral-400">{q.serviceType}</td>
                            <td className="p-3">
                              <span className={`text-[9px] px-1.5 py-0.5 rounded font-bold uppercase border ${
                                q.priority === 'EMERGENCY' ? 'bg-red-950 text-red-400 border-red-900' :
                                q.priority === 'HIGH' ? 'bg-amber-950 text-amber-400 border-amber-900' :
                                'bg-neutral-950 text-neutral-400 border-neutral-850'
                              }`}>
                                {q.priority}
                              </span>
                            </td>
                            <td className="p-3">
                              <span className={`text-[9.5px] font-bold uppercase ${q.status === 'SERVING' ? 'text-emerald-400 animate-pulse' : 'text-neutral-500'}`}>
                                {q.status}
                              </span>
                            </td>
                            <td className="p-3 text-right space-x-1.5">
                              {q.status === 'WAITING' && (
                                <button
                                  onClick={() => { handleUpdateQueueStatus(q.id, 'SERVING'); triggerDemoAlert(`Called Ticket ${q.number} to Desk A.`); }}
                                  className="bg-indigo-600 hover:bg-indigo-500 text-white text-[9px] font-bold px-2.5 py-1 rounded transition-all"
                                >
                                  Call Desk
                                </button>
                              )}
                              {q.status === 'SERVING' && (
                                <button
                                  onClick={() => { handleUpdateQueueStatus(q.id, 'COMPLETED'); triggerDemoAlert(`Finished Ticket ${q.number}.`); }}
                                  className="bg-emerald-600 hover:bg-emerald-500 text-white text-[9px] font-bold px-2.5 py-1 rounded transition-all"
                                >
                                  Mark Done
                                </button>
                              )}
                            </td>
                          </tr>
                        ))}

                        {queueList.length === 0 && (
                          <tr>
                            <td colSpan={6} className="p-4 text-center text-neutral-500 italic font-sans">No queue tickets in waiting queue pool. Spawn tickets using the portal.</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* SUBTAB: TASKS */}
            {staffSubTab === 'TASKS' && (
              <div className="space-y-6 animate-fade-in" id="staff-tasks-tab">
                <div className="bg-neutral-950 border border-neutral-850 p-4 rounded-xl space-y-3">
                  <div>
                    <span className="text-[10px] font-mono font-bold text-neutral-455 uppercase block">Active Shift Duties Checklist</span>
                    <span className="text-xs font-semibold text-neutral-200 block">Sector Operations Task Manager</span>
                  </div>

                  <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
                    {taskList.filter(t => t.industry === currentIndustry).map((t) => (
                      <div
                        key={t.id}
                        onClick={() => toggleTaskStatus(t.id)}
                        className={`p-3 rounded-lg border flex items-center justify-between cursor-pointer transition-all ${
                          t.status === 'COMPLETED'
                            ? 'bg-neutral-950/40 border-neutral-850 opacity-60 line-through text-neutral-500'
                            : 'bg-neutral-900 border-neutral-800 text-neutral-200 hover:border-neutral-700'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <span className={`w-4 h-4 rounded border flex items-center justify-center font-mono text-[9px] font-bold ${
                            t.status === 'COMPLETED' ? 'bg-emerald-950 text-emerald-400 border-emerald-900' : 'bg-neutral-950 border-neutral-800 text-neutral-600'
                          }`}>
                            {t.status === 'COMPLETED' ? '✓' : ''}
                          </span>
                          <span className="text-xs font-medium">{t.title}</span>
                        </div>
                        <span className="text-[9px] font-mono uppercase text-neutral-500">
                          {t.status === 'COMPLETED' ? 'Completed' : 'Pending'}
                        </span>
                      </div>
                    ))}

                    {taskList.filter(t => t.industry === currentIndustry).length === 0 && (
                      <p className="text-[11px] text-neutral-500 italic text-center py-6 font-mono">No tasks found for industry {currentIndustry}.</p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* SUBTAB: TRANSACTIONS */}
            {staffSubTab === 'TRANSACTIONS' && (
              <div className="space-y-6 animate-fade-in" id="staff-transactions-tab">
                <div className="bg-neutral-950 border border-neutral-850 p-4 rounded-xl space-y-4">
                  <div>
                    <span className="text-[10px] font-mono font-bold text-neutral-455 uppercase block">Local Cashier Sales Archive</span>
                    <span className="text-xs font-semibold text-neutral-200 block">Shift Payments Receipts Log</span>
                  </div>

                  <div className="overflow-x-auto rounded-xl border border-neutral-850">
                    <table className="w-full text-left font-mono text-[11px]">
                      <thead className="bg-neutral-950 text-neutral-400 uppercase text-[10px] border-b border-neutral-800">
                        <tr>
                          <th className="p-3">Reference</th>
                          <th className="p-3">Client</th>
                          <th className="p-3">Details</th>
                          <th className="p-3">Total Cost</th>
                          <th className="p-3">State</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-neutral-950 bg-neutral-900/40">
                        {offlineTxnBuffer.map((t) => (
                          <tr key={t.id} className="bg-amber-950/10 border-l-2 border-amber-500">
                            <td className="p-3 text-amber-400 font-bold">{t.reference}</td>
                            <td className="p-3 font-sans text-neutral-200">{t.clientName}</td>
                            <td className="p-3 font-sans text-neutral-400">{t.details}</td>
                            <td className="p-3 text-amber-400 font-bold">₱{t.amount}</td>
                            <td className="p-3">
                              <span className="text-[9px] bg-amber-950 text-amber-400 border border-amber-900 px-1.5 py-0.5 rounded font-bold uppercase">Buffered</span>
                            </td>
                          </tr>
                        ))}

                        {transactionList.map((t) => (
                          <tr key={t.id}>
                            <td className="p-3 text-white font-bold">{t.reference}</td>
                            <td className="p-3 font-sans text-neutral-200">{t.clientName}</td>
                            <td className="p-3 font-sans text-neutral-400">{t.details}</td>
                            <td className="p-3 text-indigo-400 font-bold">₱{t.amount}</td>
                            <td className="p-3">
                              <span className="text-[9px] bg-emerald-950 text-emerald-400 border border-emerald-900 px-1.5 py-0.5 rounded font-bold uppercase">Synced</span>
                            </td>
                          </tr>
                        ))}

                        {transactionList.length === 0 && offlineTxnBuffer.length === 0 && (
                          <tr>
                            <td colSpan={5} className="p-4 text-center text-neutral-500 italic font-sans">No completed cashless sales transactions during this shift.</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* SUBTAB: NOTIFICATIONS */}
            {staffSubTab === 'NOTIFICATIONS' && (
              <div className="space-y-6 animate-fade-in" id="staff-notifications-tab">
                <div className="bg-neutral-950 border border-neutral-850 p-4 rounded-xl space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-bold text-neutral-455 uppercase block">Urgent Shift Alerts</span>
                    <span className="text-[9px] font-mono text-emerald-400 animate-pulse">● Connected to Local Node</span>
                  </div>

                  <div className="space-y-2 max-h-[250px] overflow-y-auto pr-1">
                    <div className="bg-red-950/20 border border-red-900/50 p-3 rounded-lg flex items-start gap-2 text-xs">
                      <span className="text-red-400">⚠️</span>
                      <div>
                        <span className="font-bold text-neutral-200 block">Queue Desk Load Congestion</span>
                        <p className="text-neutral-400 text-[11px] leading-relaxed mt-0.5">Average checkout queue has exceeded 5 waiting tickets. Please reallocate Counter Desk C immediately.</p>
                      </div>
                    </div>

                    <div className="bg-indigo-950/20 border border-indigo-900/40 p-3 rounded-lg flex items-start gap-2 text-xs">
                      <span className="text-indigo-400">ℹ️</span>
                      <div>
                        <span className="font-bold text-neutral-200 block">System Offline State Active</span>
                        <p className="text-neutral-400 text-[11px] leading-relaxed mt-0.5">Edge server is maintaining all check-ins locally on internal SQLite cache pool. Sync cloud to flush.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

          </div>
        )}

        {/* 3. MANAGER DASHBOARD CONTAINER */}
        {userRole === 'MANAGER_SUPERVISOR' && (
          <div className="space-y-6 animate-fade-in" id="manager-dashboard-view">
            
            {/* SUBTAB: ANALYTICS */}
            {managerSubTab === 'ANALYTICS' && (
              <div className="space-y-6 animate-fade-in" id="manager-analytics-tab">
                {/* Live metrics widgets */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-3.5 shadow">
                    <div className="flex items-center justify-between text-neutral-400">
                      <span className="text-[10px] uppercase font-mono font-bold tracking-wider">Queue Load</span>
                      <Clock size={14} className="text-indigo-400" />
                    </div>
                    <div className="flex items-baseline gap-1.5 mt-1.5">
                      <span className="text-xl font-bold font-mono text-white">
                        {queueList.filter(q => q.status === 'WAITING' || q.status === 'SERVING').length + offlineQueueBuffer.length}
                      </span>
                      <span className="text-[10px] text-neutral-500 font-mono">active</span>
                    </div>
                  </div>

                  <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-3.5 shadow">
                    <div className="flex items-center justify-between text-neutral-400">
                      <span className="text-[10px] uppercase font-mono font-bold tracking-wider">Local Buffer</span>
                      <Database size={14} className="text-amber-400" />
                    </div>
                    <div className="flex items-baseline gap-1.5 mt-1.5">
                      <span className="text-xl font-bold font-mono text-white">
                        {offlineTxnBuffer.length + offlineQueueBuffer.length}
                      </span>
                      <span className="text-[10px] text-neutral-500 font-mono">records</span>
                    </div>
                  </div>

                  <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-3.5 shadow">
                    <div className="flex items-center justify-between text-neutral-400">
                      <span className="text-[10px] uppercase font-mono font-bold tracking-wider">Daily Sales</span>
                      <Coins size={14} className="text-emerald-400" />
                    </div>
                    <div className="flex items-baseline gap-1.5 mt-1.5">
                      <span className="text-xl font-bold font-mono text-emerald-400">
                        ₱{transactionList.reduce((sum, t) => sum + t.amount, 0) + offlineTxnBuffer.reduce((sum, t) => sum + t.amount, 0)}
                      </span>
                    </div>
                  </div>

                  <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-3.5 shadow">
                    <div className="flex items-center justify-between text-neutral-400">
                      <span className="text-[10px] uppercase font-mono font-bold tracking-wider">Uplink Beacons</span>
                      <div className={`w-2.5 h-2.5 rounded-full ${isOnline ? 'bg-emerald-500' : 'bg-amber-500'} animate-pulse`} />
                    </div>
                    <div className="flex items-baseline gap-1.5 mt-1.5">
                      <span className="text-base font-bold font-mono text-white">
                        {isOnline ? '98.9 ms' : 'LOCAL LAN'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Chart panel */}
                <div className="bg-neutral-950 border border-neutral-850 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-3 text-xs">
                    <span className="font-bold text-neutral-200">Historical & Predicted Peak Transaction Streams (Hourly Volume)</span>
                    <div className="flex items-center gap-3 text-[9px] font-mono text-neutral-400">
                      <span className="flex items-center gap-1"><span className="w-2 h-2 bg-indigo-500 rounded" /> Historical load</span>
                      <span className="flex items-center gap-1"><span className="w-2 h-2 bg-indigo-500 rounded border border-dashed border-white bg-indigo-950/20" /> Predicted load</span>
                    </div>
                  </div>

                  <div className="relative aspect-[21/9] min-h-[160px] w-full">
                    <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f1f2e_1px,transparent_1px),linear-gradient(to_bottom,#1f1f2e_1px,transparent_1px)] bg-[size:16.66%_25%] opacity-10" />
                    <svg viewBox="0 0 600 180" className="w-full h-full">
                      <defs>
                        <linearGradient id="glowGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#6366f1" stopOpacity="0.45" />
                          <stop offset="100%" stopColor="#6366f1" stopOpacity="0.0" />
                        </linearGradient>
                        <linearGradient id="strokeGrad" x1="0" y1="0" x2="1" y2="0">
                          <stop offset="0%" stopColor="#818cf8" />
                          <stop offset="50%" stopColor="#6366f1" />
                          <stop offset="100%" stopColor="#c084fc" />
                        </linearGradient>
                      </defs>
                      <path 
                        d="M 20 150 C 100 130, 150 40, 200 60 C 250 80, 300 120, 350 80 C 400 40, 480 30, 580 120 L 580 160 L 20 160 Z" 
                        fill="url(#glowGrad)" 
                      />
                      <line x1="20" y1="160" x2="580" y2="160" stroke="#2c2c3e" strokeWidth="1" />
                      <path 
                        d="M 20 150 C 100 130, 150 40, 200 60 C 250 80, 300 120, 350 80 C 400 40, 480 30, 580 120" 
                        fill="none" 
                        stroke="url(#strokeGrad)" 
                        strokeWidth="2.5" 
                        strokeLinecap="round"
                      />
                      <circle cx="200" cy="60" r="4" fill="#a78bfa" stroke="#1e1b4b" strokeWidth="1.5" />
                      <circle cx="350" cy="80" r="4" fill="#6366f1" stroke="#1e1b4b" strokeWidth="1.5" />
                      <circle cx="450" cy="35" r="5" fill="#f59e0b" stroke="#1e1b4b" strokeWidth="1.5" className="animate-pulse" />
                      <text x="180" y="45" fill="#a78bfa" fontSize="8" fontFamily="monospace" fontWeight="bold">9:00 AM checkins</text>
                      <text x="320" y="65" fill="#818cf8" fontSize="8" fontFamily="monospace">12:00 PM peak</text>
                      <text x="410" y="22" fill="#f59e0b" fontSize="8" fontFamily="monospace" fontWeight="bold">Forecasted Spike (1:30 PM)</text>
                      <text x="18" y="172" fill="#4b5563" fontSize="8" fontFamily="monospace">08:00</text>
                      <text x="110" y="172" fill="#4b5563" fontSize="8" fontFamily="monospace">10:00</text>
                      <text x="210" y="172" fill="#4b5563" fontSize="8" fontFamily="monospace">12:00</text>
                      <text x="310" y="172" fill="#4b5563" fontSize="8" fontFamily="monospace">14:00</text>
                      <text x="410" y="172" fill="#4b5563" fontSize="8" fontFamily="monospace">16:00</text>
                      <text x="510" y="172" fill="#4b5563" fontSize="8" fontFamily="monospace">18:00</text>
                    </svg>
                  </div>
                </div>
              </div>
            )}

            {/* SUBTAB: REPORTS */}
            {managerSubTab === 'REPORTS' && (
              <div className="space-y-6 animate-fade-in" id="manager-reports-tab">
                {/* Pattern Insights */}
                <div className="bg-neutral-950 border border-neutral-850 p-4 rounded-xl space-y-3">
                  <div className="flex items-center gap-1.5 text-[10px] font-mono text-indigo-400 font-bold uppercase tracking-wider">
                    <Sparkles size={12} />
                    <span>AI Pattern Diagnostics & Predictive Insight Engine</span>
                  </div>

                  {(() => {
                    const getDiagnosticsForIndustry = (ind: string) => {
                      switch (ind) {
                        case 'SCHOOL':
                          return {
                            learnedPeak: 'Peak Morning rush registered at 7:42 AM - 7:55 AM (average 142 badge scans/min).',
                            bottleneck: 'Student Registrar desk wait times predicted to rise by 12 mins due to repetitive enrollment form validation checks.',
                            reconciled: 'Auto-reconciled 42 card-badge logs during transient offline WAN link. No student records lost.',
                            actions: 'Proactively suggest activating the "Automated Registrar Load-Balancing Rule" on our Local Edge automation panel.'
                          };
                        case 'HOSPITAL':
                          return {
                            learnedPeak: 'Outpatient Triage volume spikes at 9:30 AM (average 18 ticket generations/min).',
                            bottleneck: 'Doctor review duration is currently our central process bottleneck, averaging 15.2 minutes per patient slot.',
                            reconciled: 'Synchronized 18 high-priority patient triage records directly to local SQLite RAM buffer without packet drops.',
                            actions: 'Load balancing recommended routing lower-risk consultations to outpatient desk B immediately.'
                          };
                        case 'RESTAURANT':
                          return {
                            learnedPeak: 'Kitchen queue loads spike heavily during lunch-rush (11:45 AM - 1:15 PM) with Sisig representing 74% of ordered dishes.',
                            bottleneck: 'Manual kitchen assembly is our current latency gap. Average cook time is 8.4 minutes.',
                            reconciled: 'Automatically cleared and reconciled 12 dine-in cashless orders from Local buffer to cloud Postgres upon WAN recovery.',
                            actions: 'Predicting Friday evening Sisig demand will rise by 38%. Pre-assembly prep recommended.'
                          };
                        case 'GOVERNMENT':
                          return {
                            learnedPeak: 'Clearance request volume peaks at 10:15 AM (average 28 document forms generated/hour).',
                            bottleneck: 'Manual Clerk signature verification takes 3m 20s, accounting for 82% of overall process latency.',
                            reconciled: 'Secured 24 local document approvals to RAM storage during local internet failure.',
                            actions: 'Bypass manual paper slips by pushing automatic background registry validations on our forms setup.'
                          };
                        case 'RETAIL':
                          return {
                            learnedPeak: 'E-commerce and physical checkout volume peaks on Friday afternoon at 4:30 PM (average checkout count: 82/hour).',
                            bottleneck: 'Card validation handshakes are delayed on bad uplinks. Queue times currently average 4.2m.',
                            reconciled: 'Reconciled 38 pending payment records with central ledger. Stock inventory counts fully updated.',
                            actions: 'Suggest keeping transaction caching active in offline buffer mode to bypass transport delays.'
                          };
                        case 'TRANSPORT':
                          return {
                            learnedPeak: 'Coach boarding scanner peaks at 15-minute intervals corresponding to incoming shuttle arrivals.',
                            bottleneck: 'Physical baggage check is our primary terminal constraint. Average delay: 6.0 minutes.',
                            reconciled: 'Synchronized 12 GCash mobile ticket purchases during server link disruptions without billing faults.',
                            actions: 'Proactive route ETA updates dispatched to passenger tickets to lower perceived waiting duration.'
                          };
                        default:
                          return {
                            learnedPeak: `Active peak hours for ${ind} learned after analyzing daily transaction intervals.`,
                            bottleneck: 'Process sequence latency is optimal. Autonomous decision throughput matches safety thresholds.',
                            reconciled: 'Edge router database replication is fully functional. SQLite integrity factors = 100% OK.',
                            actions: 'Universal operating system is maintaining ideal system flow rates. No actions needed.'
                          };
                      }
                    };

                    const report = getDiagnosticsForIndustry(currentIndustry);

                    return (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs mt-2">
                        <div className="space-y-1.5 bg-neutral-900/60 p-3 rounded-lg border border-neutral-850">
                          <span className="text-[10px] font-mono text-neutral-500 block uppercase font-bold">LEARNED BEHAVIORAL PATTERNS</span>
                          <p className="text-neutral-300 font-sans leading-relaxed">
                            {report.learnedPeak}
                          </p>
                          <p className="text-neutral-400 font-sans leading-relaxed">
                            {report.bottleneck}
                          </p>
                        </div>
                        
                        <div className="space-y-1.5 bg-neutral-900/60 p-3 rounded-lg border border-neutral-850">
                          <span className="text-[10px] font-mono text-neutral-500 block uppercase font-bold">SELF-OPTIMIZING ROUTER METRICS</span>
                          <p className="text-indigo-300 font-sans leading-relaxed font-medium">
                            &rarr; {report.actions}
                          </p>
                          <p className="text-neutral-450 font-sans leading-relaxed">
                            Reconciliation status: <strong className="text-emerald-400 font-mono">{report.reconciled}</strong>
                          </p>
                        </div>
                      </div>
                    );
                  })()}
                </div>
              </div>
            )}

            {/* SUBTAB: PERFORMANCE */}
            {managerSubTab === 'PERFORMANCE' && (
              <div className="space-y-6 animate-fade-in" id="manager-performance-tab">
                {/* Active microservice rules list & proposal */}
                {(() => {
                  const getProactiveRule = (ind: string) => {
                    const rules = {
                      SCHOOL: { trigger: 'On Queue Spike at Registrar Desk', condition: 'Waiting Tickets > 4', action: 'Auto-allocate Counter C to load-balance student checkins' },
                      HOSPITAL: { trigger: 'On Triage Patient Registered', condition: 'Symptom = Severe pain', action: 'Bypass checkin waiting queue, auto-bump to Priority: EMERGENCY' },
                      RESTAURANT: { trigger: 'On Dish Catalog Inventory Low', condition: 'Sisig plates count < 5', action: 'Trigger low-stock overlay on client smartphone and notify chef' },
                      GOVERNMENT: { trigger: 'On Barangay Clearance Approved', condition: 'Method = Direct Cashless POS', action: 'Instantly sign PDF certificate & print to counter desk thermal printer' },
                      RETAIL: { trigger: 'On Daily Transactions Threshold', condition: 'Completed Sales > 5000 PHP', action: 'Trigger automatic SQLite sync and clear local offline buffer storage' },
                      TRANSPORT: { trigger: 'On Shuttle Route Delayed', condition: 'Arrival ETA exceeds 10m', action: 'Auto-broadcast compensation voucher discount to waiting queue passenger tickets' }
                    };
                    return rules[ind as keyof typeof rules] || {
                      trigger: `On ${ind} Process Friction Detection`,
                      condition: 'Step latency > 5m',
                      action: 'Auto-generate edge log diagnostic and redirect waiting slots'
                    };
                  };

                  const proposal = getProactiveRule(currentIndustry);

                  return (
                    <div className="bg-indigo-950/20 border border-indigo-800/40 p-4 rounded-xl flex flex-col md:flex-row items-center justify-between gap-4">
                      <div className="space-y-1">
                        <span className="text-[9px] font-mono text-indigo-400 uppercase font-bold tracking-widest block flex items-center gap-1">
                          <Sparkles size={11} />
                          <span>Proactive AI Edge Automation Suggestion</span>
                        </span>
                        <span className="text-xs font-bold text-white block">Suggesting Rule: {proposal.trigger}</span>
                        <p className="text-[10px] text-neutral-450 leading-relaxed font-sans max-w-xl">
                          OSMOS detected wait-times can be optimized by 34% in <strong>{currentIndustry}</strong> by registering this background microservice.
                        </p>
                      </div>
                      <button
                        onClick={() => {
                          const newR = {
                            id: `ai-suggest-${Date.now()}`,
                            trigger: proposal.trigger,
                            condition: proposal.condition,
                            action: proposal.action,
                            isActive: true
                          };
                          setWorkflowRules(prev => [...prev, newR]);
                          addSystemLog('success', `AI Recommendation rule registered: "${proposal.trigger}"`);
                          triggerDemoAlert('Proactive AI Automation deployed successfully!');
                        }}
                        className="bg-indigo-600 hover:bg-indigo-500 text-white text-[11px] font-bold px-3 py-1.5 rounded-lg transition-all shrink-0 font-sans"
                      >
                        Accept & Deploy Automation
                      </button>
                    </div>
                  );
                })()}

                {/* Rules map */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {workflowRules.map((rule) => (
                    <div key={rule.id} className="bg-neutral-950 border border-neutral-850 p-4 rounded-xl flex flex-col justify-between relative group">
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-[10px] font-mono bg-indigo-950 text-indigo-400 border border-indigo-900 px-2 py-0.5 rounded font-bold uppercase tracking-wider">
                            IF TRIGGERED:
                          </span>
                          <button
                            onClick={() => {
                              setWorkflowRules(prev => prev.filter(r => r.id !== rule.id));
                              addSystemLog('warn', `Removed automation workflow rule: ${rule.trigger}`);
                            }}
                            className="text-neutral-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X size={12} />
                          </button>
                        </div>
                        
                        <h4 className="text-xs font-bold font-mono text-white tracking-wide uppercase">{rule.trigger}</h4>
                        <span className="text-[10px] text-neutral-500 block font-mono mt-0.5">Condition match: {rule.condition}</span>
                        
                        <div className="mt-3 pt-2.5 border-t border-neutral-900">
                          <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-wider font-bold block mb-0.5">THEN EXECUTE:</span>
                          <p className="text-[11px] text-neutral-300 font-sans font-medium">{rule.action}</p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between mt-4 pt-2 border-t border-neutral-900">
                        <span className="text-[9px] font-mono text-neutral-500">Uplink: local-lan-broker</span>
                        <button
                          onClick={() => {
                            setWorkflowRules(prev =>
                              prev.map(r => r.id === rule.id ? { ...r, isActive: !r.isActive } : r)
                            );
                          }}
                          className={`text-[9px] font-mono px-2 py-0.5 rounded ${rule.isActive ? 'bg-emerald-950 text-emerald-400' : 'bg-neutral-800 text-neutral-400'}`}
                        >
                          {rule.isActive ? 'Active Edge Rule' : 'Muted'}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>
        )}

        {/* 4. OWNER/ADMIN DASHBOARD CONTAINER */}
        {userRole === 'ADMIN_OWNER' && (
          <div className="space-y-6 animate-fade-in" id="owner-dashboard-view">
            
            {/* SUBTAB: INSIGHTS */}
            {ownerSubTab === 'INSIGHTS' && (
              <div className="space-y-6 animate-fade-in" id="owner-insights-tab">
                {/* Multi-Tenant SaaS cluster indicators */}
                <div className="bg-neutral-950 border border-neutral-850 p-4 rounded-xl space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-mono font-bold text-neutral-455 uppercase block">Global SaaS Telemetry Deck</span>
                      <span className="text-xs font-semibold text-neutral-200 block">Central Postgres & Redis Replication Cluster</span>
                    </div>
                    <span className="text-[9.5px] font-mono text-emerald-400 font-bold bg-emerald-950 px-2 py-0.5 border border-emerald-900 rounded">
                      HEALTH: 100% SECURE
                    </span>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <div className="bg-neutral-900/60 p-3 rounded border border-neutral-850 text-center">
                      <span className="text-[9px] font-mono text-neutral-500 block">Active Tenants</span>
                      <span className="text-lg font-bold font-mono text-white">4,812</span>
                    </div>
                    <div className="bg-neutral-900/60 p-3 rounded border border-neutral-850 text-center">
                      <span className="text-[9px] font-mono text-neutral-500 block">Edge Beacons</span>
                      <span className="text-lg font-bold font-mono text-indigo-400">12,491</span>
                    </div>
                    <div className="bg-neutral-900/60 p-3 rounded border border-neutral-850 text-center">
                      <span className="text-[9px] font-mono text-neutral-500 block">Total Revenue</span>
                      <span className="text-lg font-bold font-mono text-emerald-400">₱482K</span>
                    </div>
                    <div className="bg-neutral-900/60 p-3 rounded border border-neutral-850 text-center">
                      <span className="text-[9px] font-mono text-neutral-500 block">Uptime Factor</span>
                      <span className="text-lg font-bold font-mono text-white">99.99%</span>
                    </div>
                  </div>
                </div>

                {/* Edge node logs stream */}
                <div className="bg-neutral-950 border border-neutral-850 p-4 rounded-xl space-y-3">
                  <span className="text-[10px] font-mono font-bold text-neutral-455 uppercase block">Running System Logs Archive</span>
                  <div className="bg-neutral-900/80 border border-neutral-850 p-3 rounded-lg font-mono text-[11px] space-y-1.5 max-h-48 overflow-y-auto">
                    {logs.slice(0, 10).map((log) => (
                      <div key={log.id} className="text-neutral-400 text-xs">
                        <span className="text-neutral-600">[{new Date(log.timestamp).toLocaleTimeString()}]</span> <strong className="text-indigo-400">{log.source}:</strong> {log.message}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* SUBTAB: USERS */}
            {ownerSubTab === 'USERS' && (
              <div className="space-y-6 animate-fade-in" id="owner-users-tab">
                <div className="bg-neutral-950 border border-neutral-850 p-4 rounded-xl space-y-3">
                  <div>
                    <span className="text-[10px] font-mono font-bold text-neutral-455 uppercase block">Connected Hardware Stations</span>
                    <span className="text-xs font-semibold text-neutral-200 block">Localized IoT Device Grid</span>
                  </div>

                  <div className="space-y-2">
                    <div className="bg-neutral-900 p-3 rounded border border-neutral-850 flex items-center justify-between text-xs">
                      <div className="space-y-0.5">
                        <span className="font-bold text-neutral-200 block">Fixed Touchscreen Kiosk Terminal (Node-01)</span>
                        <span className="text-[9px] font-mono text-neutral-550">LAN IP: 192.168.4.11 &bull; Active WiFi Broadcast</span>
                      </div>
                      <span className="text-[9px] font-mono bg-emerald-950 text-emerald-400 border border-emerald-900 px-1.5 py-0.5 rounded font-bold">ONLINE</span>
                    </div>

                    <div className="bg-neutral-900 p-3 rounded border border-neutral-850 flex items-center justify-between text-xs">
                      <div className="space-y-0.5">
                        <span className="font-bold text-neutral-200 block">Tablet Counter Stand (Node-02)</span>
                        <span className="text-[9px] font-mono text-neutral-550">LAN IP: 192.168.4.12 &bull; Active Charger Connected</span>
                      </div>
                      <span className="text-[9px] font-mono bg-emerald-950 text-emerald-400 border border-emerald-900 px-1.5 py-0.5 rounded font-bold">ONLINE</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* SUBTAB: SETTINGS */}
            {ownerSubTab === 'SETTINGS' && (
              <div className="space-y-6 animate-fade-in" id="owner-settings-tab">
                {/* Captive form builder fields config */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  
                  <div className="bg-neutral-950 border border-neutral-850 p-4 rounded-xl space-y-3">
                    <span className="text-[10px] font-mono font-bold text-neutral-455 uppercase block">Add Custom Capture Input Field</span>
                    
                    <div className="space-y-2 text-xs">
                      <div>
                        <label className="text-[10px] text-neutral-500 font-mono block mb-1">Field Display Name</label>
                        <input
                          type="text"
                          value={newFieldName}
                          onChange={(e) => setNewFieldName(e.target.value)}
                          placeholder="e.g. SSS Identification Number"
                          className="w-full bg-neutral-900 border border-neutral-850 rounded p-1.5 text-xs text-white focus:outline-none focus:border-indigo-500"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="text-[10px] text-neutral-500 font-mono block mb-1">Input Component Style</label>
                          <select
                            value={newFieldType}
                            onChange={(e: any) => setNewFieldType(e.target.value)}
                            className="w-full bg-neutral-900 border border-neutral-850 rounded p-1.5 text-xs text-white"
                          >
                            <option value="text">Short Text</option>
                            <option value="number">Numeric value</option>
                            <option value="select">Dropdown Choice</option>
                            <option value="textarea">Paragraph area</option>
                          </select>
                        </div>

                        <div>
                          <label className="text-[10px] text-neutral-500 font-mono block mb-1">Security Constraints</label>
                          <div className="flex items-center h-8 text-[11px] text-neutral-300 font-mono">
                            <span className="text-indigo-400 font-bold mr-1">✓</span> Always Required
                          </div>
                        </div>
                      </div>

                      {newFieldType === 'select' && (
                        <div>
                          <label className="text-[10px] text-neutral-500 font-mono block mb-1">Dropdown Choices (comma-separated)</label>
                          <input
                            type="text"
                            value={newFieldOptions}
                            onChange={(e) => setNewFieldOptions(e.target.value)}
                            placeholder="e.g. Option A, Option B, Option C"
                            className="w-full bg-neutral-900 border border-neutral-850 rounded p-1.5 text-xs text-white focus:outline-none focus:border-indigo-500"
                          />
                        </div>
                      )}

                      <button
                        onClick={handleAddField}
                        className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs py-2 rounded-lg transition-all mt-1"
                      >
                        Deploy Field to On-Site Captive Terminals
                      </button>
                    </div>
                  </div>

                  {/* Active form structures */}
                  <div className="bg-neutral-950 border border-neutral-850 p-4 rounded-xl flex flex-col justify-between">
                    <div className="space-y-3">
                      <span className="text-[10px] font-mono font-bold text-neutral-455 uppercase block">Active Hotspot Form Layout</span>
                      <div className="space-y-1.5 max-h-48 overflow-y-auto">
                        {customFields.map((f) => (
                          <div key={f.id} className="bg-neutral-900 p-2.5 rounded border border-neutral-850 flex items-center justify-between">
                            <div>
                              <span className="text-xs font-semibold text-neutral-200 block">{f.label}</span>
                              <span className="text-[9px] font-mono text-neutral-500 block uppercase">{f.type} {f.options ? `(${f.options.length} options)` : ''}</span>
                            </div>
                            <button
                              onClick={() => handleRemoveField(f.id)}
                              className="text-neutral-500 hover:text-red-400 p-1"
                            >
                              <X size={14} />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="bg-neutral-900/40 p-2.5 rounded border border-neutral-800 text-[10px] text-neutral-400 leading-normal italic font-mono mt-3">
                      ℹ️ Forms progressive disclosure parameters are handled automatically based on on-site visitor session details. No manual encoding is ever forced.
                    </div>
                  </div>

                </div>

                {/* Reset button panel */}
                <div className="bg-neutral-950 border border-neutral-850 p-4 rounded-xl flex flex-col md:flex-row items-center justify-between gap-4">
                  <div className="space-y-1">
                    <span className="text-xs font-bold text-white block">Reset System Demo Database</span>
                    <p className="text-[10px] text-neutral-455 font-sans">
                      Wipe all localized queue items, order logs, RFID badges, and sync states, returning the sandbox parameters back to default profiles.
                    </p>
                  </div>
                  <button
                    onClick={handleResetDemo}
                    className="bg-red-950/40 hover:bg-red-900/40 text-red-400 border border-red-900/50 text-[11px] font-bold px-3 py-1.5 rounded-lg transition-all shrink-0 font-sans"
                  >
                    Reset Demo Database
                  </button>
                </div>
              </div>
            )}

          </div>
        )}

      </div>
    </div>
  );
}
