'use client';
import { useState, useEffect } from 'react';
import { io } from 'socket.io-client';

export default function EpicWorkspace() {
  const [logs, setLogs] = useState<string[]>([]);
  const [status, setStatus] = useState('OFFLINE');
  const [epics, setEpics] = useState<any[]>([]);
  const [activeEpic, setActiveEpic] = useState<any>(null);
  const [showModal, setShowModal] = useState(false);
  const [newEpic, setNewEpic] = useState({ title: '', requirements: '' });

  useEffect(() => {
    const socket = io('http://localhost:3001');

    socket.on('connect', () => setStatus('CONNECTED'));
    socket.on('output', (payload) => {
      setLogs((prev) => [...prev, `[${payload.type.toUpperCase()}] ${payload.data}`]);
    });
    socket.on('epic-created', (epic) => {
      setEpics(prev => [...prev, epic]);
    });

    fetch('http://localhost:3001/epics')
      .then(res => res.json())
      .then(data => {
        setEpics(data);
        if (data.length > 0) setActiveEpic(data[0]);
      });

    return () => { socket.disconnect(); };
  }, []);

  const createEpic = async () => {
    const res = await fetch('http://localhost:3001/epics', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newEpic)
    });
    const data = await res.json();
    setActiveEpic(data);
    setShowModal(false);
    setNewEpic({ title: '', requirements: '' });
  };

  return (
    <div className="flex h-screen w-screen bg-neutral-900 text-white font-mono overflow-hidden">
      {/* Sidebar */}
      <div className="w-1/4 border-r border-neutral-700 p-6 flex flex-col gap-6 bg-neutral-900 z-10">
        <div className="flex justify-between items-center">
          <h1 className="text-xl font-black tracking-tighter italic">KARTAVYA</h1>
          <button 
            onClick={() => setShowModal(true)}
            className="bg-emerald-600 hover:bg-emerald-500 text-xs font-bold px-3 py-1.5 rounded-full transition-all"
          >
            + NEW EPIC
          </button>
        </div>

        <div className="flex-1 overflow-y-auto space-y-3">
          {epics.map(epic => (
            <div 
              key={epic.id}
              onClick={() => setActiveEpic(epic)}
              className={`p-4 rounded-lg border cursor-pointer transition-all ${
                activeEpic?.id === epic.id 
                ? 'border-emerald-500 bg-emerald-500/5 shadow-[0_0_20px_rgba(16,185,129,0.1)]' 
                : 'border-neutral-800 bg-neutral-800/50 hover:border-neutral-700'
              }`}
            >
              <h2 className="text-sm font-bold truncate text-neutral-100">{epic.title}</h2>
              <p className="text-[10px] text-neutral-500 mt-1 uppercase tracking-widest">{epic.status}</p>
            </div>
          ))}
        </div>

        <div className="pt-4 border-t border-neutral-800 text-[10px] text-neutral-500 flex items-center gap-2 uppercase tracking-tighter">
          <div className={`w-1.5 h-1.5 rounded-full ${status === 'CONNECTED' ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-rose-500'}`}></div>
          DAEMON: {status}
        </div>
      </div>

      {/* Main Workspace */}
      <div className="flex-1 flex bg-neutral-950">
        {!activeEpic ? (
          <div className="flex-1 flex flex-col items-center justify-center text-neutral-600">
            <div className="text-4xl mb-4">⊙</div>
            <p className="text-xs uppercase tracking-widest">Select or create an epic to begin orchestration</p>
          </div>
        ) : (
          <>
            {/* Left Pane (Macro) */}
            <div className="w-1/3 border-r border-neutral-800 p-8 flex flex-col gap-8 bg-neutral-900/30">
              <div>
                <h3 className="text-[10px] text-emerald-500 font-black uppercase tracking-[0.2em] mb-3">Active Context</h3>
                <h2 className="text-xl font-bold leading-tight">{activeEpic.title}</h2>
              </div>

              <div className="flex-1">
                <h3 className="text-[10px] text-neutral-500 font-black uppercase tracking-[0.2em] mb-4">DAG Visualizer</h3>
                <div className="space-y-4">
                  {Object.entries(activeEpic.dependencyGraph || {}).map(([taskId, deps]: [any, any]) => (
                    <div key={taskId} className="relative pl-6 py-2 border-l border-neutral-800 group">
                      <div className="absolute left-[-5px] top-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-neutral-800 group-hover:bg-blue-500 transition-colors"></div>
                      <div className="text-[11px] font-bold text-neutral-400 group-hover:text-blue-400 transition-colors uppercase">{taskId}</div>
                      <div className="text-[9px] text-neutral-600 mt-0.5">DEPENDS ON: {deps.length > 0 ? deps.join(', ') : 'NONE'}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Pane (Micro) */}
            <div className="flex-1 p-8 flex flex-col gap-6">
              <div className="bg-blue-500/5 border border-blue-500/20 rounded-xl p-6 shadow-2xl backdrop-blur-sm">
                <div className="flex justify-between items-center mb-6">
                  <div className="px-3 py-1 bg-blue-500/10 text-blue-400 text-[10px] font-black rounded-full border border-blue-500/20 tracking-tighter uppercase">Active Sub-Task</div>
                  <div className="text-[10px] text-neutral-500 font-mono tracking-widest">EXECUTING_LOGIC</div>
                </div>
                <h3 className="text-lg font-bold mb-3">Processing Requirements...</h3>
                <p className="text-sm text-neutral-400 leading-relaxed italic line-clamp-2">"{activeEpic.requirements}"</p>
              </div>

              <div className="flex-1 flex flex-col bg-black rounded-xl border border-neutral-800 overflow-hidden shadow-2xl">
                <div className="px-4 py-2 bg-neutral-900/50 border-b border-neutral-800 flex justify-between items-center">
                  <span className="text-[9px] font-bold text-neutral-500 uppercase tracking-widest">Terminal Stream</span>
                  <div className="flex gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-neutral-800"></div>
                    <div className="w-2 h-2 rounded-full bg-neutral-800"></div>
                    <div className="w-2 h-2 rounded-full bg-neutral-800"></div>
                  </div>
                </div>
                <div className="flex-1 p-6 overflow-y-auto text-[11px] font-mono space-y-2">
                  <div className="text-emerald-500 opacity-50 mb-4 tracking-tighter">// CONNECTED TO DAEMON_CORE_01</div>
                  {logs.length === 0 && <div className="text-neutral-700">Waiting for agent output...</div>}
                  {logs.map((log, i) => (
                    <div key={i} className="flex gap-4 group">
                      <span className="text-neutral-700 select-none w-4">{i + 1}</span>
                      <span className="text-neutral-300 group-hover:text-white transition-colors">{log}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-6">
          <div className="bg-neutral-900 border border-neutral-800 w-full max-w-xl rounded-2xl p-8 shadow-2xl animate-in zoom-in-95 duration-200">
            <h2 className="text-2xl font-black tracking-tighter mb-2 italic">CREATE NEW EPIC</h2>
            <p className="text-xs text-neutral-500 mb-8 uppercase tracking-widest">Define your requirements and let the Principal Architect orchestrate.</p>
            
            <div className="space-y-6">
              <div>
                <label className="block text-[10px] font-black text-neutral-400 uppercase tracking-widest mb-2">Epic Title</label>
                <input 
                  type="text" 
                  value={newEpic.title}
                  onChange={e => setNewEpic({...newEpic, title: e.target.value})}
                  className="w-full bg-black border border-neutral-800 rounded-lg p-3 text-sm focus:border-emerald-500 outline-none transition-all placeholder:text-neutral-700"
                  placeholder="e.g. Implement JWT Authentication"
                />
              </div>
              <div>
                <label className="block text-[10px] font-black text-neutral-400 uppercase tracking-widest mb-2">Requirements Spec</label>
                <textarea 
                  value={newEpic.requirements}
                  onChange={e => setNewEpic({...newEpic, requirements: e.target.value})}
                  className="w-full bg-black border border-neutral-800 rounded-lg p-3 text-sm h-40 focus:border-emerald-500 outline-none transition-all placeholder:text-neutral-700 resize-none"
                  placeholder="Describe what the agents should build..."
                />
              </div>
              <div className="flex gap-4 pt-4">
                <button 
                  onClick={() => setShowModal(false)}
                  className="flex-1 py-3 text-xs font-bold text-neutral-400 hover:text-white transition-colors uppercase tracking-widest"
                >
                  Cancel
                </button>
                <button 
                  onClick={createEpic}
                  className="flex-1 bg-emerald-600 hover:bg-emerald-500 py-3 rounded-lg text-xs font-black transition-all shadow-lg shadow-emerald-900/20 uppercase tracking-widest"
                >
                  START ORCHESTRATION
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
