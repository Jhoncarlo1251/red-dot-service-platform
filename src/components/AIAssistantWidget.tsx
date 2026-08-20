import React, { useState } from 'react';
import { Send, Sparkles, Terminal, ArrowRight } from 'lucide-react';

interface AIAssistantWidgetProps {
  currentIndustry: string;
  onActionTriggered: (action: string, target: string, data: any, message: string) => void;
  addSystemLog: (level: 'info' | 'warn' | 'error' | 'success', message: string) => void;
}

export default function AIAssistantWidget({
  currentIndustry,
  onActionTriggered,
  addSystemLog
}: AIAssistantWidgetProps) {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [aiResponse, setAiResponse] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setLoading(true);
    setError(null);
    setAiResponse(null);

    try {
      addSystemLog('info', `AI Assistant evaluating query: "${prompt}"`);
      const response = await fetch('/api/gemini/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, industry: currentIndustry }),
      });

      if (!response.ok) {
        throw new Error('Server returned error');
      }

      const data = await response.json();
      setAiResponse(data);
      
      // Perform action triggers
      onActionTriggered(data.action, data.target, data.data || {}, data.message);
      
      addSystemLog(
        data.isFallback ? 'warn' : 'success',
        `AI Parsed Action [${data.action}] target=[${data.target}] (Source: ${data.isFallback ? 'Fallback Matcher' : 'Gemini 3.5-Flash'})`
      );
    } catch (err: any) {
      console.error(err);
      setError('Failed to query the smart workflow engine.');
      addSystemLog('error', 'AI Smart Assistant processing failed.');
    } finally {
      setLoading(false);
    }
  };

  const samplePrompts: Record<string, string[]> = {
    RESTAURANT: [
      'Order pagkain: Sisig with extra rice and an iced tea',
      'Pila sa table 4 check-in',
      'Register new walk-in dining group of 3'
    ],
    HOSPITAL: [
      'Register doctor checkup for Althea Ramos',
      'Pila sa Emergency ward queue ticket',
      'Open the medical clearance forms'
    ],
    SCHOOL: [
      'Scan my student QR card STUD-2026-8801',
      'Submit new late record student David Cruz Grade 11',
      'Open class assignment LMS page'
    ],
    GOVERNMENT: [
      'Request copy of Barangay Clearance for job employment',
      'Get a priority queue number for senior citizen desk',
      'Open citizen database forms'
    ],
    RETAIL: [
      'Order high-top sneakers item 5021 for ₱3800',
      'Check stock availability of retail shoes',
      'Go to digital POS menu'
    ],
    TRANSPORT: [
      'Book a ride checkin for seat 14A',
      'Check queue for the incoming shuttle bus',
      'Simulate GCash payment transaction ₱250'
    ]
  };

  return (
    <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-5 shadow-2xl overflow-hidden relative" id="ai-assistant-panel">
      {/* Absolute Grid overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(#ffffff03_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />
      
      <div className="relative flex items-center justify-between mb-3 border-b border-neutral-800 pb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 animate-pulse">
            <Sparkles size={16} />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-neutral-200">OSMOS Central Smart AI Assistant</h3>
            <p className="text-[11px] text-indigo-400 font-mono">MODEL: gemini-3.5-flash</p>
          </div>
        </div>
        <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-neutral-800 border border-neutral-700">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-[10px] text-neutral-400 font-mono uppercase tracking-wider">Active</span>
        </div>
      </div>

      <p className="text-xs text-neutral-400 mb-4 leading-relaxed relative">
        Simulate an investor natural-language query. Type anything or click a preset below to see how the system parses intent, triggers immediate UI navigation, and queues background digital transactions.
      </p>

      <form onSubmit={handleSubmit} className="relative mb-4">
        <input
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder={`e.g. "Order a plate of sisig..." or "Register attendance..."`}
          className="w-full bg-neutral-950 border border-neutral-800 rounded-lg pl-3 pr-10 py-2 text-xs text-neutral-200 placeholder-neutral-600 focus:outline-none focus:border-indigo-500 font-sans"
          disabled={loading}
        />
        <button
          type="submit"
          className="absolute right-1.5 top-1.5 h-7 w-7 rounded-md bg-indigo-600 hover:bg-indigo-500 text-white flex items-center justify-center transition-colors disabled:opacity-50"
          disabled={loading}
        >
          {loading ? (
            <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <Send size={12} />
          )}
        </button>
      </form>

      {/* Preset Suggestions */}
      <div className="mb-4">
        <span className="text-[10px] text-neutral-500 uppercase tracking-widest font-semibold block mb-1.5 font-mono">
          Interactive Presets ({currentIndustry})
        </span>
        <div className="flex flex-wrap gap-1.5">
          {samplePrompts[currentIndustry]?.map((preset, idx) => (
            <button
              key={idx}
              onClick={() => {
                setPrompt(preset);
                addSystemLog('info', `Selected preset: "${preset}"`);
              }}
              className="text-[11px] bg-neutral-950/80 hover:bg-neutral-800 text-neutral-300 px-2.5 py-1 rounded-md border border-neutral-800 hover:border-neutral-700 transition-all text-left flex items-center gap-1"
            >
              <ArrowRight size={8} className="text-indigo-400 shrink-0" />
              <span>{preset}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Code Inspector Output */}
      {aiResponse && (
        <div className="bg-neutral-950 border border-neutral-800 rounded-lg p-3 font-mono text-[10px] text-neutral-300 relative animate-fade-in">
          <div className="flex items-center justify-between mb-2 text-neutral-500 pb-1 border-b border-neutral-900">
            <div className="flex items-center gap-1">
              <Terminal size={10} />
              <span>ENGINE INTERPRETER OUTPUT</span>
            </div>
            <span className={`text-[9px] px-1 rounded ${aiResponse.isFallback ? 'bg-amber-950 text-amber-400 border border-amber-800' : 'bg-emerald-950 text-emerald-400 border border-emerald-800'}`}>
              {aiResponse.isFallback ? 'Fallback Matcher' : 'Google GenAI SDK'}
            </span>
          </div>
          
          <p className="text-indigo-400 font-sans mb-2 font-medium">
            &ldquo;{aiResponse.message}&rdquo;
          </p>

          <pre className="text-neutral-400 overflow-x-auto max-h-40 whitespace-pre-wrap leading-tight">
            {JSON.stringify(
              {
                action: aiResponse.action,
                target: aiResponse.target,
                parameters: aiResponse.data,
                clientTrigger: `CAPTIVE_PORTAL_ROUTE_PUSH(${aiResponse.target})`
              },
              null,
              2
            )}
          </pre>
        </div>
      )}

      {error && (
        <div className="p-2.5 rounded-lg bg-red-950/50 border border-red-900/60 text-red-400 text-xs font-mono">
          {error}
        </div>
      )}
    </div>
  );
}
