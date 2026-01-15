
import React from 'react';
import { UserProfile } from '../types';
import { Shield, Mail, Calendar, HardDrive, Award, ChevronRight } from 'lucide-react';

const Profile: React.FC<{ user: UserProfile }> = ({ user }) => {
  return (
    <div className="h-full overflow-y-auto bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Profile Card */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="h-32 bg-gradient-to-r from-emerald-600 to-emerald-800"></div>
          <div className="px-8 pb-8">
            <div className="relative flex justify-between items-end -mt-12 mb-6">
              <div className="relative">
                <img 
                  src={user.avatar} 
                  alt="Profile" 
                  className="w-32 h-32 rounded-3xl border-4 border-white shadow-xl bg-gray-100"
                />
                <div className="absolute bottom-1 right-1 bg-green-500 w-6 h-6 rounded-full border-4 border-white"></div>
              </div>
              <button className="px-6 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-bold text-gray-700 hover:bg-gray-50 shadow-sm transition-all">
                Update Identity
              </button>
            </div>
            
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{user.name}</h1>
              <p className="text-gray-500 font-medium flex items-center mt-1">
                <Mail size={16} className="mr-2" /> {user.email}
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center space-x-4">
            <div className="p-3 bg-emerald-50 rounded-xl text-emerald-600">
              <Award size={24} />
            </div>
            <div>
              <div className="text-xs text-gray-400 font-bold uppercase tracking-wider">Survivor Tier</div>
              <div className="text-lg font-bold text-gray-800">{user.tier}</div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center space-x-4">
            <div className="p-3 bg-blue-50 rounded-xl text-blue-600">
              <Calendar size={24} />
            </div>
            <div>
              <div className="text-xs text-gray-400 font-bold uppercase tracking-wider">Vault Age</div>
              <div className="text-lg font-bold text-gray-800">Since {user.joinDate}</div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center space-x-4">
            <div className="p-3 bg-amber-50 rounded-xl text-amber-600">
              <HardDrive size={24} />
            </div>
            <div>
              <div className="text-xs text-gray-400 font-bold uppercase tracking-wider">Storage Load</div>
              <div className="text-lg font-bold text-gray-800">16.8 GB Used</div>
            </div>
          </div>
        </div>

        {/* Security Checklist */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
            <Shield size={20} className="mr-2 text-emerald-600" /> Preservation Integrity
          </h2>
          <div className="space-y-4">
            {[
              { label: 'Master Recovery Key Backed Up', status: true },
              { label: 'Two-Factor Authentication Active', status: false },
              { label: 'Zero-Knowledge Encryption Verified', status: true },
              { label: 'Trusted Devices (2)', status: true },
            ].map((item, idx) => (
              <div key={idx} className="flex items-center justify-between p-4 rounded-xl bg-gray-50 border border-gray-100 group cursor-pointer hover:border-emerald-200 transition-all">
                <span className="text-sm font-semibold text-gray-700">{item.label}</span>
                <div className="flex items-center">
                  <span className={`text-xs font-bold mr-3 ${item.status ? 'text-emerald-600' : 'text-amber-500'}`}>
                    {item.status ? 'OPTIMAL' : 'REQUIRED'}
                  </span>
                  <ChevronRight size={16} className="text-gray-300 group-hover:text-emerald-500" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
