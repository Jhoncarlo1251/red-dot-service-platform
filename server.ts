import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini API client safely (with telemetry header)
const apiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;

if (apiKey && apiKey !== 'MY_GEMINI_API_KEY') {
  try {
    ai = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
    console.log('Gemini API client initialized successfully.');
  } catch (err) {
    console.error('Failed to initialize Gemini API client:', err);
  }
} else {
  console.log('Gemini API Key missing or default. Running with fallback rule-based NLP parser.');
}

// Global In-Memory Database (Acts as the local server's SQLite/Redis representation)
let queueList = [
  { id: 'q-1', number: 'R-012', name: 'Althea Ramos', serviceType: 'Dine-In Menu', priority: 'MEDIUM', status: 'WAITING', timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString(), waitTimeMinutes: 12 },
  { id: 'q-2', number: 'H-104', name: 'David Santos', serviceType: 'Doctor Check-up', priority: 'HIGH', status: 'SERVING', timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(), waitTimeMinutes: 5 },
  { id: 'q-3', number: 'G-241', name: 'Maria Cruz', serviceType: 'Barangay Clearance', priority: 'LOW', status: 'WAITING', timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString(), waitTimeMinutes: 20 },
];

let transactionList = [
  { id: 't-1', clientName: 'Althea Ramos', service: 'Restaurant Ordering', details: '1x Pork Sisig, 1x Iced Tea', amount: 320, status: 'COMPLETED', timestamp: new Date(Date.now() - 10 * 60 * 1000).toISOString(), reference: 'TXN-REST-9824', isLocalOnly: false, industry: 'RESTAURANT' },
  { id: 't-2', clientName: 'Juan Dela Cruz', service: 'Barangay Clearance Request', details: 'Document Purpose: Employment', amount: 150, status: 'PROCESSING', timestamp: new Date(Date.now() - 3 * 60 * 1000).toISOString(), reference: 'TXN-GOV-3810', isLocalOnly: false, industry: 'GOVERNMENT' },
  { id: 't-3', clientName: 'Sienna Smith', service: 'Retail Checkout', details: '2x High-top Sneakers', amount: 3800, status: 'PENDING', timestamp: new Date(Date.now() - 1 * 60 * 1000).toISOString(), reference: 'TXN-RTL-5021', isLocalOnly: true, industry: 'RETAIL' },
];

let attendanceList = [
  { id: 'a-1', studentId: 'STUD-2026-0041', name: 'Jhon Carlo', gradeSection: 'Grade 12 - Einstein', timestamp: new Date(Date.now() - 40 * 60 * 1000).toISOString(), status: 'PRESENT' },
  { id: 'a-2', studentId: 'STUD-2026-1294', name: 'Beatriz Tan', gradeSection: 'Grade 11 - Newton', timestamp: new Date(Date.now() - 10 * 60 * 1000).toISOString(), status: 'LATE' },
];

let systemLogs = [
  { id: 'log-1', timestamp: new Date(Date.now() - 25 * 60 * 1000).toISOString(), level: 'success', source: 'LOCAL_SERVER', message: 'Captive Portal system server booted successfully on port 3000.' },
  { id: 'log-2', timestamp: new Date(Date.now() - 24 * 60 * 1000).toISOString(), level: 'info', source: 'LOCAL_SERVER', message: 'Local Offline SQLite adapter initialized: /data/offline.db' },
  { id: 'log-3', timestamp: new Date(Date.now() - 12 * 60 * 1000).toISOString(), level: 'success', source: 'CLOUD_SYNC', message: 'Synchronized batch of 4 pending transactions to Cloud Tenant storage.' }
];

// --- REST API MIDDLEWARES AND ROUTES ---

// 1. Get Live State
app.get('/api/state', (req, res) => {
  res.json({
    queueList,
    transactionList,
    attendanceList,
    systemLogs: systemLogs.slice(-40) // send last 40 logs
  });
});

// 2. Add Log Entry
app.post('/api/logs', (req, res) => {
  const { level, source, message } = req.body;
  const newLog = {
    id: `log-${Date.now()}`,
    timestamp: new Date().toISOString(),
    level: level || 'info',
    source: source || 'LOCAL_SERVER',
    message
  };
  systemLogs.push(newLog);
  res.status(201).json(newLog);
});

// 3. Queue System Routes
app.post('/api/queue/join', (req, res) => {
  const { name, serviceType, priority, industry } = req.body;
  const prefix = industry ? industry.substring(0, 1) : 'Q';
  const count = queueList.length + 1;
  const queueNum = `${prefix}-${count.toString().padStart(3, '0')}`;

  const newItem = {
    id: `q-${Date.now()}`,
    number: queueNum,
    name: name || 'Anonymous Client',
    serviceType: serviceType || 'General Service',
    priority: priority || 'MEDIUM',
    status: 'WAITING',
    timestamp: new Date().toISOString(),
    waitTimeMinutes: Math.floor(Math.random() * 15) + 5
  };

  queueList.push(newItem);
  systemLogs.push({
    id: `log-${Date.now()}`,
    timestamp: new Date().toISOString(),
    level: 'info',
    source: 'CLIENT_PORTAL',
    message: `Queue Ticket ${queueNum} issued for ${newItem.name} (${newItem.serviceType}).`
  });

  res.status(201).json(newItem);
});

app.post('/api/queue/update', (req, res) => {
  const { id, status } = req.body;
  const item = queueList.find(q => q.id === id);
  if (item) {
    item.status = status;
    systemLogs.push({
      id: `log-${Date.now()}`,
      timestamp: new Date().toISOString(),
      level: 'info',
      source: 'LOCAL_SERVER',
      message: `Queue Ticket ${item.number} marked as ${status}.`
    });
    return res.json(item);
  }
  res.status(404).json({ error: 'Queue item not found' });
});

// 4. Digital Transactions Router
app.post('/api/transaction/create', (req, res) => {
  const { clientName, service, details, amount, isLocalOnly, industry } = req.body;
  const refNum = `TXN-${industry ? industry.substring(0, 3) : 'GEN'}-${Math.floor(1000 + Math.random() * 9000)}`;

  const newTxn = {
    id: `t-${Date.now()}`,
    clientName: clientName || 'Walk-In Customer',
    service: service || 'Manual Request',
    details: details || 'No additional details provided.',
    amount: parseFloat(amount) || 0,
    status: isLocalOnly ? 'PENDING' : 'COMPLETED',
    timestamp: new Date().toISOString(),
    reference: refNum,
    isLocalOnly: !!isLocalOnly,
    industry: industry || 'RETAIL'
  };

  transactionList.push(newTxn);
  systemLogs.push({
    id: `log-${Date.now()}`,
    timestamp: new Date().toISOString(),
    level: 'success',
    source: isLocalOnly ? 'CLIENT_PORTAL' : 'LOCAL_SERVER',
    message: `${isLocalOnly ? '[Offline Cached]' : '[Direct Online]'} Form transaction ${refNum} processed: ${newTxn.clientName} - ₱${newTxn.amount}`
  });

  res.status(201).json(newTxn);
});

// 5. School Attendance Route
app.post('/api/attendance/checkin', (req, res) => {
  const { studentId, name, gradeSection } = req.body;
  const checkinTime = new Date();
  const cutoffTime = new Date();
  cutoffTime.setHours(8, 0, 0, 0); // 8:00 AM standard school start

  const isLate = checkinTime.getTime() > cutoffTime.getTime();

  const newRecord = {
    id: `a-${Date.now()}`,
    studentId: studentId || 'STUD-MOCK',
    name: name || 'Student Name',
    gradeSection: gradeSection || 'Unassigned',
    timestamp: checkinTime.toISOString(),
    status: isLate ? 'LATE' : 'PRESENT'
  };

  attendanceList.push(newRecord);
  systemLogs.push({
    id: `log-${Date.now()}`,
    timestamp: new Date().toISOString(),
    level: isLate ? 'warn' : 'success',
    source: 'CLIENT_PORTAL',
    message: `QR Attendance Check-in: ${newRecord.name} (${newRecord.gradeSection}) registered as ${newRecord.status}.`
  });

  res.status(201).json(newRecord);
});

// 6. Bulk Synchronization Route (Online Reconnection simulation)
app.post('/api/sync', (req, res) => {
  const { transactions, queueItems, attendanceRecords } = req.body;
  let syncedTxn = 0;
  let syncedQueue = 0;
  let syncedAttendance = 0;

  if (Array.isArray(transactions)) {
    transactions.forEach(t => {
      // Avoid duplicate keys
      if (!transactionList.some(exist => exist.id === t.id)) {
        transactionList.push({ ...t, isLocalOnly: false, status: 'COMPLETED' });
        syncedTxn++;
      }
    });
  }

  if (Array.isArray(queueItems)) {
    queueItems.forEach(q => {
      if (!queueList.some(exist => exist.id === q.id)) {
        queueList.push(q);
        syncedQueue++;
      }
    });
  }

  if (Array.isArray(attendanceRecords)) {
    attendanceRecords.forEach(a => {
      if (!attendanceList.some(exist => exist.id === a.id)) {
        attendanceList.push(a);
        syncedAttendance++;
      }
    });
  }

  systemLogs.push({
    id: `log-${Date.now()}`,
    timestamp: new Date().toISOString(),
    level: 'success',
    source: 'CLOUD_SYNC',
    message: `Captive Portal restored cloud connection. Synced: ${syncedTxn} TXN, ${syncedQueue} Queue, ${syncedAttendance} Attendance entries.`
  });

  res.json({
    status: 'success',
    synced: { transactions: syncedTxn, queueItems: syncedQueue, attendanceRecords: syncedAttendance },
    queueList,
    transactionList,
    attendanceList
  });
});

// 7. Reset System (to aid investor demo refreshes)
app.post('/api/reset', (req, res) => {
  queueList = [
    { id: 'q-1', number: 'R-012', name: 'Althea Ramos', serviceType: 'Dine-In Menu', priority: 'MEDIUM', status: 'WAITING', timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString(), waitTimeMinutes: 12 },
    { id: 'q-2', number: 'H-104', name: 'David Santos', serviceType: 'Doctor Check-up', priority: 'HIGH', status: 'SERVING', timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(), waitTimeMinutes: 5 },
  ];
  transactionList = [
    { id: 't-1', clientName: 'Althea Ramos', service: 'Restaurant Ordering', details: '1x Pork Sisig, 1x Iced Tea', amount: 320, status: 'COMPLETED', timestamp: new Date(Date.now() - 10 * 60 * 1000).toISOString(), reference: 'TXN-REST-9824', isLocalOnly: false, industry: 'RESTAURANT' },
  ];
  attendanceList = [
    { id: 'a-1', studentId: 'STUD-2026-0041', name: 'Jhon Carlo', gradeSection: 'Grade 12 - Einstein', timestamp: new Date(Date.now() - 40 * 60 * 1000).toISOString(), status: 'PRESENT' },
  ];
  systemLogs = [
    { id: 'log-reset', timestamp: new Date().toISOString(), level: 'info', source: 'LOCAL_SERVER', message: 'SaaS Platform simulated database resetted to base demo entries.' }
  ];
  res.json({ success: true });
});

// 8. AI Gemini Agent Smart Natural Language Parsing End-point
app.post('/api/gemini/chat', async (req, res) => {
  const { prompt, industry } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: 'No prompt text provided' });
  }

  // --- RULE-BASED FALLBACK PARSER (Runs if Gemini API key is missing or failed) ---
  const runFallbackParser = (text: string) => {
    const cleanText = text.toLowerCase();
    
    // Default system response message
    let parsedMessage = `I've analyzed your request: "${text}". How can I assist you with ${industry || 'this system'} today?`;
    let parsedAction = 'NAVIGATE';
    let parsedTarget = 'menu';
    let parsedData: any = {};

    if (cleanText.includes('order') || cleanText.includes('food') || cleanText.includes('menu') || cleanText.includes('kakain') || cleanText.includes('pagkain')) {
      parsedAction = 'ORDER';
      parsedTarget = 'menu';
      parsedMessage = "Certainly! I've launched the digital QR Ordering Menu for you. Select your items to place an order.";
      parsedData = { item: 'Default Meal', category: 'Main Dish' };
    } else if (cleanText.includes('register') || cleanText.includes('form') || cleanText.includes('fill') || cleanText.includes('sign') || cleanText.includes('clearance')) {
      parsedAction = 'NAVIGATE';
      parsedTarget = 'forms';
      parsedMessage = "Opened the Digital Form Portal. Please complete the fields to process your request without manual paper forms.";
    } else if (cleanText.includes('queue') || cleanText.includes('ticket') || cleanText.includes('pila') || cleanText.includes('doctor') || cleanText.includes('number')) {
      parsedAction = 'QUEUE';
      parsedTarget = 'queue';
      parsedMessage = "Generating your digital ticket slot. Joining the automated queue stream...";
    } else if (cleanText.includes('attendance') || cleanText.includes('present') || cleanText.includes('checkin') || cleanText.includes('scan') || cleanText.includes('student')) {
      parsedAction = 'REGISTER_ATTENDANCE';
      parsedTarget = 'attendance';
      parsedMessage = "Ready to register attendance. Scanning digital class entry card.";
    } else if (cleanText.includes('sync') || cleanText.includes('reconnect') || cleanText.includes('online')) {
      parsedAction = 'SYNC';
      parsedTarget = 'dashboard';
      parsedMessage = "Triggering manual SQLite synchronization buffer to remote Cloud Postgres Tenant.";
    }

    return {
      action: parsedAction,
      target: parsedTarget,
      message: parsedMessage,
      data: parsedData,
      isFallback: true
    };
  };

  // Run Real server-side Gemini if client available
  if (ai) {
    try {
      const systemPrompt = `
You are the central Smart Workflow Engine of 'OSMOS', an autonomous offline-first operating system designed to convert real-world manual physical processes into digital automated workflows.
The current active industry is: ${industry || 'RESTAURANT'}.

Your task is to analyze raw user natural language input and map it to a digital workflow action.
You MUST respond with a single, strictly formatted JSON object (no markdown, no wrap blocks) containing the following fields:
- "action": One of the following action types:
    - "NAVIGATE": Navigate client to a specific panel.
    - "ORDER": Customer desires to order items/food or purchase retail.
    - "QUEUE": Wants to join/tick a queue slot.
    - "REGISTER_ATTENDANCE": Scanning attendance, clocking in/out.
    - "FORM_SUBMISSION": Desires to request government clearances, document requests, or fill forms.
    - "SYNC": Manually synchronize offline server states to Cloud database.
- "target": The panel key name to switch the UI to. Supported targets: "menu", "queue", "forms", "attendance", "dashboard", "logs".
- "message": A friendly, high-quality, professional, response message describing the action taken (maximum 2 short sentences). Keep it humble, human, and direct.
- "data": An object containing any extracted parameters (like "name", "itemId", "studentId", "amount", "purpose") found in the prompt text.

Example response for 'order meal':
{
  "action": "ORDER",
  "target": "menu",
  "message": "Excellent choice! I've opened the automated digital restaurant menu for you to select your dishes.",
  "data": { "item": "meal" }
}

Raw user prompt: "${prompt}"
`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.5-flash',
        contents: systemPrompt,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              action: { type: Type.STRING },
              target: { type: Type.STRING },
              message: { type: Type.STRING },
              data: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  itemId: { type: Type.STRING },
                  studentId: { type: Type.STRING },
                  amount: { type: Type.NUMBER },
                  purpose: { type: Type.STRING }
                }
              }
            },
            required: ['action', 'target', 'message']
          }
        }
      });

      const responseText = response.text;
      if (responseText) {
        const parsedResponse = JSON.parse(responseText.trim());
        parsedResponse.isFallback = false;
        
        // Log to system logs
        systemLogs.push({
          id: `log-${Date.now()}`,
          timestamp: new Date().toISOString(),
          level: 'info',
          source: 'AI_ENGINE',
          message: `AI smart trigger parsed input "${prompt.substring(0, 30)}...": Action = ${parsedResponse.action}`
        });

        return res.json(parsedResponse);
      }
    } catch (apiError) {
      console.error('Gemini API call failed, running fallback parser:', apiError);
      const fallbackResult = runFallbackParser(prompt);
      return res.json(fallbackResult);
    }
  }

  // Key-less execution runs the fallback instantly
  const fallbackResult = runFallbackParser(prompt);
  res.json(fallbackResult);
});

// --- INTEGRATING VITE DEV MIDDLEWARE AND STATIC PRODUCTION BUILDS ---

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
    console.log('Vite middleware integrated for Development.');
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
    console.log('Serving production static build from: ', distPath);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Autonomous Operating System Server running on http://localhost:${PORT}`);
  });
}

startServer();
