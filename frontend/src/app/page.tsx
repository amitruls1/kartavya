'use client';
import { useState, useEffect } from 'react';

export default function EpicWorkspace() {
  const [logs, setLogs] = useState<string[]>([]);
  
  // Mock WebSocket integration
  useEffect(() => {
    const interval = setInterval(() => {
      setLogs((prev) => [...prev, `[ws] Heartbeat from Daemon...`]);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex h-screen w-screen bg-neutral-900 text-white font-mono">
      {/* Left Pane (Macro) */}
      <div className="w-1/3 border-r border-neutral-700 p-6 flex flex-col gap-6">
        <h1 className="text-2xl font-bold tracking-tighter">Kartavya SCM</h1>
        
        <div className="bg-neutral-800 p-4 rounded-lg border border-neutral-700 shadow-sm">
          <h2 className="text-lg text-emerald-400 font-semibold mb-2">[EPIC] Implement JWT Auth via Redis</h2>
          <p className="text-sm text-neutral-400">STATUS: EXECUTING</p>
        </div>

        <div className="bg-neutral-800 p-4 rounded-lg border border-neutral-700 shadow-sm flex-1">
          <h3 className="text-md font-semibold text-neutral-200 mb-2">DAG Dependency Graph</h3>
          <ul className="text-sm space-y-2 text-neutral-300">
            <li className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
              [TASK-101] Init Redis (DONE)
            </li>
            <li className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div>
              [TASK-102] Token Rotation (ACTIVE)
            </li>
            <li className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-neutral-500"></div>
              [TASK-103] Frontend Integration (PENDING)
            </li>
          </ul>
        </div>
      </div>

      {/* Right Pane (Micro) */}
      <div className="w-2/3 p-6 flex flex-col gap-4 bg-neutral-950">
        
        {/* Task Card */}
        <div className="border border-blue-500/50 bg-blue-900/10 p-4 rounded-lg">
          <div className="flex justify-between items-center mb-4 border-b border-blue-500/20 pb-2">
             <h3 className="font-bold text-blue-400">[TASK-102] Implement JWT Token Rotation</h3>
             <span className="bg-blue-500/20 text-blue-300 text-xs px-2 py-1 rounded">ACTIVE</span>
          </div>
          <div className="text-sm text-neutral-300 mb-4">
            <p className="text-neutral-500 mb-1">ASSIGNED TO: Engineer Agent (Claude CLI)</p>
            <p>Modifies `/api/auth` to enforce token rotation. Leverages the Redis cache initialized in TASK-101.</p>
          </div>
          
          <div className="text-sm">
             <h4 className="text-neutral-400 font-bold mb-1">CRITICAL SPECS:</h4>
             <ul className="space-y-1">
                <li className="text-emerald-400">[✓] spec_auth_rotation_fail_on_expired_refresh</li>
                <li className="text-amber-400">[!] spec_auth_rotation_blacklist_old_token (Running)</li>
             </ul>
          </div>
        </div>

        {/* Live Terminal Output */}
        <div className="flex-1 bg-black rounded-lg border border-neutral-800 p-4 overflow-y-auto mt-4 font-mono text-xs">
          <div className="text-emerald-500 mb-2">Connected to Docker Sandbox tty...</div>
          {logs.map((log, i) => (
            <div key={i} className="text-neutral-300">{log}</div>
          ))}
          <div className="text-blue-400 mt-2">{'>'} Pushing commit 2d4a1... running test suite.</div>
        </div>
        
      </div>
    </div>
  );
}
