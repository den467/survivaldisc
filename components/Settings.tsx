
import React from 'react';
import { 
  Bell, 
  Moon, 
  Lock, 
  Globe, 
  Monitor, 
  Zap, 
  ShieldCheck,
  ChevronRight 
} from 'lucide-react';

const Settings: React.FC = () => {
  const settingsSections = [
    {
      title: 'Vault Security',
      items: [
        { icon: Lock, label: 'Change Encryption Key', desc: 'Securely rotate your master access password' },
        { icon: ShieldCheck, label: 'Two-Step Verification', desc: 'Add an extra layer of survival protection' },
      ]
    },
    {
      title: 'Interface Preferences',
      items: [
        { icon: Moon, label: 'Low Visibility Mode', desc: 'Enable dark theme for eye protection', toggle: true },
        { icon: Monitor, label: 'Default Explorer View', desc: 'Choose between grid or list by default' },
      ]
    },
    {
      title: 'Network & System',
      items: [
        { icon: Globe, label: 'Data Node Location', desc: 'Select preferred geographic survival cluster' },
        { icon: Zap, label: 'Transfer Acceleration', desc: 'Enable multi-thread preservation streams', toggle: true },
      ]
    }
  ];

  return (
    <div className="h-full overflow-y-auto bg-gray-50 p-8">
      <div className="max-w-3xl mx-auto space-y-10">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">System Configuration</h1>
          <p className="text-gray-500 mt-1">Manage your secure preservation settings</p>
        </div>

        {settingsSections.map((section, sIdx) => (
          <div key={sIdx} className="space-y-4">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">
              {section.title}
            </h3>
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden divide-y divide-gray-50">
              {section.items.map((item, iIdx) => (
                <div key={iIdx} className="p-5 flex items-center justify-between hover:bg-gray-50 cursor-pointer transition-colors group">
                  <div className="flex items-center space-x-4">
                    <div className="p-2.5 bg-gray-50 rounded-xl text-gray-400 group-hover:bg-emerald-50 group-hover:text-emerald-600 transition-colors">
                      <item.icon size={20} />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-gray-800">{item.label}</div>
                      <div className="text-xs text-gray-400">{item.desc}</div>
                    </div>
                  </div>
                  {item.toggle ? (
                    <div className="w-12 h-6 bg-emerald-600 rounded-full relative shadow-inner ring-1 ring-emerald-700">
                      <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full"></div>
                    </div>
                  ) : (
                    <ChevronRight size={18} className="text-gray-300 group-hover:text-emerald-500 transition-colors" />
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}

        <div className="p-8 rounded-3xl bg-emerald-900 text-white relative overflow-hidden shadow-xl">
          <div className="relative z-10">
            <h3 className="text-xl font-bold mb-2">Upgrade to Immortal Tier</h3>
            <p className="text-emerald-200 text-sm mb-6 max-w-sm">
              Get unlimited storage, priority AI analysis, and multi-node redundancy for your digital legacy.
            </p>
            <button className="px-8 py-3 bg-white text-emerald-900 rounded-xl font-bold text-sm hover:scale-105 transition-transform shadow-lg">
              Explore Plans
            </button>
          </div>
          <div className="absolute -right-20 -bottom-20 w-64 h-64 bg-emerald-800/30 rounded-full"></div>
          <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-emerald-700/30 rounded-full"></div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
