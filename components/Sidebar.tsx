
import React from 'react';
import { 
  Cloud, 
  Clock, 
  Share2, 
  Trash2, 
  Users, 
  Settings, 
  User as UserIcon,
  ChevronLeft, 
  ChevronRight,
  LogOut,
  ShieldAlert,
  ShieldCheck
} from 'lucide-react';
import { NavigationSection, UserProfile } from '../types';

interface SidebarProps {
  activeSection: NavigationSection;
  setActiveSection: (section: NavigationSection) => void;
  isOpen: boolean;
  onToggle: () => void;
  onLogout: () => void;
  user: UserProfile | null;
}

const Sidebar: React.FC<SidebarProps> = ({ activeSection, setActiveSection, isOpen, onToggle, onLogout, user }) => {
  const menuItems = [
    { id: NavigationSection.CLOUD_DRIVE, icon: Cloud, label: 'Secure Vault' },
    { id: NavigationSection.RECENT, icon: Clock, label: 'Recent Access' },
    { id: NavigationSection.SHARED, icon: Share2, label: 'Distributed Links' },
    { id: NavigationSection.RUBBISH_BIN, icon: Trash2, label: 'Recycle Buffer' },
    { id: NavigationSection.CONTACTS, icon: Users, label: 'Trust Network' },
  ];

  return (
    <aside className={`bg-white border-r border-gray-200 transition-all duration-300 flex flex-col ${isOpen ? 'w-64' : 'w-20'}`}>
      <div className="h-16 flex items-center px-5 border-b border-gray-100 shrink-0">
        <div className="bg-mega-red text-white font-bold rounded-lg flex items-center justify-center min-w-[36px] h-9 shadow-sm">
          M
        </div>
        {isOpen && <span className="ml-3 font-bold text-lg tracking-tight text-[#1a1a1a]">MEGA Cloud</span>}
      </div>

      <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto overflow-x-hidden">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveSection(item.id)}
            className={`w-full flex items-center px-3 py-3 rounded-xl transition-all text-sm font-semibold ${
              activeSection === item.id 
                ? 'bg-red-50 text-mega-red shadow-sm ring-1 ring-red-100' 
                : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'
            }`}
          >
            <item.icon size={20} className={activeSection === item.id ? 'text-mega-red' : 'text-gray-400'} />
            {isOpen && <span className="ml-4 truncate">{item.label}</span>}
          </button>
        ))}

        {user?.role === 'admin' && (
          <>
            <div className="h-px bg-gray-100 my-4 mx-3"></div>
            <button
              onClick={() => setActiveSection(NavigationSection.ADMIN)}
              className={`w-full flex items-center px-3 py-3 rounded-xl transition-all text-sm font-bold ${
                activeSection === NavigationSection.ADMIN 
                  ? 'bg-gray-900 text-white shadow-xl' 
                  : 'text-gray-400 hover:bg-gray-100'
              }`}
            >
              <ShieldCheck size={20} className={activeSection === NavigationSection.ADMIN ? 'text-mega-red' : 'text-gray-400'} />
              {isOpen && <span className="ml-4 truncate">Admin Center</span>}
            </button>
          </>
        )}
      </nav>

      <div className="px-3 py-4 border-t border-gray-100 space-y-1">
        <button 
          onClick={() => setActiveSection(NavigationSection.PROFILE)}
          className={`w-full flex items-center px-3 py-3 rounded-xl transition-all text-sm font-semibold ${
            activeSection === NavigationSection.PROFILE ? 'bg-red-50 text-mega-red' : 'text-gray-500 hover:bg-gray-50'
          }`}
        >
          <UserIcon size={20} className={activeSection === NavigationSection.PROFILE ? 'text-mega-red' : 'text-gray-400'} />
          {isOpen && <span className="ml-4 truncate">Account Info</span>}
        </button>
        <button 
          onClick={() => setActiveSection(NavigationSection.SETTINGS)}
          className={`w-full flex items-center px-3 py-3 rounded-xl transition-all text-sm font-semibold ${
            activeSection === NavigationSection.SETTINGS ? 'bg-red-50 text-mega-red' : 'text-gray-500 hover:bg-gray-50'
          }`}
        >
          <Settings size={20} className={activeSection === NavigationSection.SETTINGS ? 'text-mega-red' : 'text-gray-400'} />
          {isOpen && <span className="ml-4 truncate">Settings</span>}
        </button>
        <button 
          onClick={onLogout}
          className="w-full flex items-center px-3 py-3 rounded-xl text-red-500 hover:bg-red-50 transition-all text-sm font-semibold"
        >
          <LogOut size={20} />
          {isOpen && <span className="ml-4 truncate">Exit Cloud</span>}
        </button>
      </div>

      {isOpen && (
        <div className="px-6 py-6">
          <div className="text-[10px] text-gray-400 mb-3 uppercase tracking-widest font-bold flex items-center">
            <ShieldAlert size={12} className="mr-1.5" /> Integrity
          </div>
          <div className="w-full bg-gray-100 rounded-full h-1.5 mb-2 overflow-hidden">
            <div className="bg-mega-red h-1.5 rounded-full w-1/3 transition-all"></div>
          </div>
          <div className="text-[10px] text-gray-500 font-bold">16.8 GB of 50 GB Used</div>
        </div>
      )}

      <button 
        onClick={onToggle}
        className="h-12 border-t border-gray-100 flex items-center justify-center text-gray-300 hover:text-mega-red transition-colors"
      >
        {isOpen ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
      </button>
    </aside>
  );
};

export default Sidebar;
