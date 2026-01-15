
import React from 'react';
import { Search, Bell, User as UserIcon, LayoutGrid, ShieldCheck } from 'lucide-react';
import { UserProfile } from '../types';

interface HeaderProps {
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  welcomeText: string;
  user: UserProfile | null;
  onOpenProfile: () => void;
}

const Header: React.FC<HeaderProps> = ({ searchQuery, setSearchQuery, welcomeText, user, onOpenProfile }) => {
  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 shrink-0 z-10 shadow-sm">
      <div className="flex-1 flex items-center max-w-2xl">
        <div className="relative w-full max-w-md">
          <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-gray-400 pointer-events-none">
            <Search size={18} />
          </span>
          <input
            type="text"
            className="block w-full py-2.5 pl-11 pr-4 text-sm border border-gray-100 rounded-2xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-emerald-100 focus:bg-white focus:border-emerald-300 transition-all placeholder:text-gray-400 font-medium"
            placeholder="Search survival data..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="hidden xl:flex ml-8 items-center text-xs font-bold text-gray-400 uppercase tracking-widest whitespace-nowrap">
          <ShieldCheck size={14} className="mr-2 text-emerald-500" />
          {welcomeText}
        </div>
      </div>

      <div className="flex items-center space-x-5">
        <button className="p-2.5 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl relative transition-all">
          <Bell size={20} />
          <span className="absolute top-2.5 right-2.5 w-2.5 h-2.5 bg-[#059669] rounded-full border-2 border-white"></span>
        </button>
        
        <div className="h-8 w-px bg-gray-100 mx-1"></div>

        <button 
          onClick={onOpenProfile}
          className="flex items-center space-x-3 p-1.5 pl-3 hover:bg-gray-50 rounded-2xl transition-all border border-transparent hover:border-gray-100 group"
        >
          <div className="text-right hidden sm:block">
            <div className="text-sm font-bold text-gray-800 leading-tight group-hover:text-emerald-700 transition-colors">
              {user?.name || 'Explorer'}
            </div>
            <div className="text-[10px] text-emerald-600 font-bold uppercase tracking-wider">
              {user?.tier || 'Survivor'} STATUS
            </div>
          </div>
          <div className="w-9 h-9 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600 border border-emerald-100 overflow-hidden shadow-inner">
            {user?.avatar ? (
              <img src={user.avatar} alt="Avatar" className="w-full h-full object-cover" />
            ) : (
              <UserIcon size={20} />
            )}
          </div>
        </button>
      </div>
    </header>
  );
};

export default Header;
