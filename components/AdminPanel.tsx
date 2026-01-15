
import React, { useState, useEffect } from 'react';
import { db } from '../services/db';
import { UserProfile } from '../types';
import { 
  Users, 
  Database, 
  Activity, 
  ShieldAlert, 
  Server, 
  Terminal,
  Search,
  MoreVertical,
  Cpu,
  Lock
} from 'lucide-react';

const AdminPanel: React.FC = () => {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [stats, setStats] = useState(db.getGlobalStats());
  const [logs, setLogs] = useState<string[]>([]);

  useEffect(() => {
    setUsers(db.getAllUsers());
    
    // Имитация логов
    const initialLogs = [
      `[${new Date().toLocaleTimeString()}] System: Encrypted data bridge established.`,
      `[${new Date().toLocaleTimeString()}] SQL: Queried all users from secure vault.`,
      `[${new Date().toLocaleTimeString()}] Node-7: Integrity check completed 100%.`,
    ];
    setLogs(initialLogs);

    const interval = setInterval(() => {
      const newLog = `[${new Date().toLocaleTimeString()}] Incoming: Secure transfer handshake from Node-${Math.floor(Math.random()*15)}`;
      setLogs(prev => [newLog, ...prev].slice(0, 8));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="h-full overflow-y-auto bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex justify-between items-end">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Admin Control Center</h1>
            <p className="text-gray-500 mt-1">Global System Management & Encrypted Analytics</p>
          </div>
          <div className="flex space-x-3">
            <div className="px-4 py-2 bg-emerald-100 text-emerald-700 rounded-xl text-xs font-black uppercase tracking-widest flex items-center">
              <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse mr-2"></span>
              Mainframe Online
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-red-50 text-mega-red rounded-xl"><Users size={24} /></div>
              <span className="text-xs font-bold text-green-500">+12%</span>
            </div>
            <div className="text-2xl font-black text-gray-900">{stats.userCount}</div>
            <div className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-1">Registered Survivors</div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-blue-50 text-blue-600 rounded-xl"><Database size={24} /></div>
            </div>
            <div className="text-2xl font-black text-gray-900">{(stats.totalBytes / (1024 * 1024 * 1024)).toFixed(2)} GB</div>
            <div className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-1">Total Vault Storage</div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-amber-50 text-amber-600 rounded-xl"><Server size={24} /></div>
            </div>
            <div className="text-2xl font-black text-gray-900">{stats.activeNodes}</div>
            <div className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-1">Encrypted Nodes</div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-purple-50 text-purple-600 rounded-xl"><Activity size={24} /></div>
            </div>
            <div className="text-2xl font-black text-emerald-600">{stats.serverStatus}</div>
            <div className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-1">Network Health</div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* User Table */}
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="px-6 py-5 border-b border-gray-50 flex justify-between items-center">
                <h3 className="font-bold text-gray-800 flex items-center">
                  <Lock size={18} className="mr-2 text-mega-red" /> Survivor Directory
                </h3>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300" size={14} />
                  <input type="text" placeholder="Search ID..." className="pl-9 pr-4 py-1.5 bg-gray-50 border-none rounded-lg text-xs outline-none focus:ring-1 focus:ring-mega-red" />
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-gray-50 text-[10px] text-gray-400 uppercase font-bold tracking-widest">
                    <tr>
                      <th className="px-6 py-4">User Identity</th>
                      <th className="px-6 py-4">Access Level</th>
                      <th className="px-6 py-4">Joined</th>
                      <th className="px-6 py-4 text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {users.map((user, idx) => (
                      <tr key={idx} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-3">
                            <img src={user.avatar} className="w-8 h-8 rounded-lg bg-gray-100" alt="" />
                            <div>
                              <div className="text-sm font-bold text-gray-800">{user.name}</div>
                              <div className="text-[10px] text-gray-400">{user.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-1 rounded-md text-[10px] font-black uppercase tracking-tighter ${user.role === 'admin' ? 'bg-red-100 text-mega-red' : 'bg-gray-100 text-gray-500'}`}>
                            {user.role}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-xs font-bold text-gray-500">{user.joinDate}</td>
                        <td className="px-6 py-4 text-right">
                          <button className="text-gray-300 hover:text-gray-600"><MoreVertical size={16} /></button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Side Info */}
          <div className="space-y-6">
            <div className="bg-[#1a1a1b] text-white rounded-3xl p-6 shadow-xl border border-gray-800">
              <h3 className="text-xs font-black uppercase tracking-widest text-gray-500 mb-6 flex items-center">
                <Terminal size={14} className="mr-2 text-mega-red" /> System Logs
              </h3>
              <div className="space-y-3 font-mono text-[10px]">
                {logs.map((log, i) => (
                  <div key={i} className={`pb-2 border-b border-gray-800 ${i === 0 ? 'text-emerald-400' : 'text-gray-400'}`}>
                    {log}
                  </div>
                ))}
              </div>
              <button className="w-full mt-6 py-2 bg-gray-800 hover:bg-gray-700 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-colors">
                Export Audit Logs
              </button>
            </div>

            <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
              <h3 className="text-xs font-black uppercase tracking-widest text-gray-400 mb-6 flex items-center">
                <Cpu size={14} className="mr-2 text-blue-600" /> Infrastructure
              </h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-[10px] font-bold mb-1">
                    <span>CPU LOAD</span>
                    <span className="text-mega-red">42%</span>
                  </div>
                  <div className="w-full bg-gray-100 h-1 rounded-full overflow-hidden">
                    <div className="bg-mega-red h-full w-[42%]"></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-[10px] font-bold mb-1">
                    <span>MEMORY</span>
                    <span className="text-blue-500">1.2 TB / 16 TB</span>
                  </div>
                  <div className="w-full bg-gray-100 h-1 rounded-full overflow-hidden">
                    <div className="bg-blue-500 h-full w-[15%]"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
