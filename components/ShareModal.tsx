
import React, { useState } from 'react';
import { Share2, Copy, ShieldCheck, X, Link as LinkIcon, Lock } from 'lucide-react';
import { FileItem } from '../types';

interface ShareModalProps {
  file: FileItem;
  onClose: () => void;
}

const ShareModal: React.FC<ShareModalProps> = ({ file, onClose }) => {
  const [copied, setCopied] = useState(false);
  const shareUrl = `https://survivaldisc.net/s/${file.id}_${Math.random().toString(36).substr(2, 6)}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-emerald-950/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-emerald-50 rounded-xl text-emerald-600">
              <Share2 size={20} />
            </div>
            <h3 className="font-bold text-gray-900">Distribute Link</h3>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 p-2 hover:bg-gray-100 rounded-xl transition-all">
            <X size={20} />
          </button>
        </div>

        <div className="p-8 space-y-8">
          <div className="flex items-center p-4 bg-gray-50 rounded-2xl border border-gray-100">
            <div className="flex-1">
              <div className="text-xs text-gray-400 font-bold uppercase tracking-widest mb-1">Encrypted Link</div>
              <div className="text-sm font-medium text-gray-700 truncate mr-4">{shareUrl}</div>
            </div>
            <button 
              onClick={handleCopy}
              className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-bold transition-all shadow-sm ${
                copied ? 'bg-emerald-600 text-white shadow-emerald-200' : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
              }`}
            >
              {copied ? <ShieldCheck size={16} /> : <Copy size={16} />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>
          </div>

          <div className="space-y-4">
            <div className="text-xs text-gray-400 font-bold uppercase tracking-widest ml-1">Distribution Rules</div>
            
            <div className="flex items-center justify-between p-4 rounded-2xl bg-gray-50 border border-gray-100">
              <div className="flex items-center space-x-3">
                <Lock size={18} className="text-emerald-600" />
                <span className="text-sm font-semibold text-gray-700">Require Decryption Key</span>
              </div>
              <div className="w-10 h-5 bg-emerald-600 rounded-full relative">
                <div className="absolute right-0.5 top-0.5 w-4 h-4 bg-white rounded-full"></div>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 rounded-2xl bg-gray-50 border border-gray-100">
              <div className="flex items-center space-x-3">
                <LinkIcon size={18} className="text-amber-500" />
                <span className="text-sm font-semibold text-gray-700">Auto-Expire in 24 Hours</span>
              </div>
              <div className="w-10 h-5 bg-gray-300 rounded-full relative">
                <div className="absolute left-0.5 top-0.5 w-4 h-4 bg-white rounded-full"></div>
              </div>
            </div>
          </div>

          <div className="p-4 bg-emerald-50 rounded-2xl flex space-x-4">
            <div className="shrink-0 text-emerald-600 mt-0.5">
              <ShieldCheck size={20} />
            </div>
            <p className="text-xs leading-relaxed text-emerald-800 font-medium">
              This link uses <span className="font-bold">AES-256</span> encryption. The key is only included in the link if you choose, and SurvivalDisc never sees your private data.
            </p>
          </div>
        </div>

        <div className="px-8 py-6 bg-gray-50 border-t border-gray-100 text-center">
          <button onClick={onClose} className="w-full py-3 bg-[#059669] hover:bg-[#047857] text-white rounded-xl font-bold shadow-lg shadow-emerald-100 transition-all active:scale-[0.98]">
            Finalize Link
          </button>
        </div>
      </div>
    </div>
  );
};

export default ShareModal;
