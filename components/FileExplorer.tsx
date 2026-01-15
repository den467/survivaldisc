
import React, { useState, useRef } from 'react';
import { 
  Plus, 
  Upload, 
  FolderPlus, 
  ChevronRight, 
  Grid, 
  List as ListIcon,
  Download,
  Share2,
  Info,
  Trash,
  Cloud,
  ShieldAlert
} from 'lucide-react';
import { FileItem, FileType, NavigationSection } from '../types';
import { analyzeFile } from '../services/geminiService';
import ShareModal from './ShareModal';

interface FileExplorerProps {
  files: FileItem[];
  currentFolderId: string | null;
  onNavigate: (id: string | null) => void;
  onUpload: (files: FileList | null) => void;
  onCreateFolder: () => void;
  onDelete: (id: string) => void;
  searchQuery: string;
  section: NavigationSection;
}

const FileExplorer: React.FC<FileExplorerProps> = ({ 
  files, 
  currentFolderId, 
  onNavigate, 
  onUpload, 
  onCreateFolder,
  onDelete,
  searchQuery,
  section
}) => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [isAiLoading, setIsAiLoading] = useState<string | null>(null);
  const [aiInsight, setAiInsight] = useState<{id: string, text: string} | null>(null);
  const [sharingFile, setSharingFile] = useState<FileItem | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const filteredFiles = files.filter(file => {
    const matchesSearch = file.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFolder = file.parentId === currentFolderId;
    if (section === NavigationSection.CLOUD_DRIVE) return matchesFolder && matchesSearch;
    if (section === NavigationSection.RECENT) return file.type !== FileType.FOLDER && matchesSearch;
    return matchesSearch;
  });

  const breadcrumbs = [];
  let tempId = currentFolderId;
  while (tempId) {
    const folder = files.find(f => f.id === tempId);
    if (folder) {
      breadcrumbs.unshift(folder);
      tempId = folder.parentId;
    } else {
      tempId = null;
    }
  }

  const handleAiDeepDive = async (file: FileItem) => {
    setIsAiLoading(file.id);
    const result = await analyzeFile(file.name, file.type);
    setAiInsight({ id: file.id, text: result || 'No analysis available.' });
    setIsAiLoading(null);
  };

  const getFileIcon = (type: FileType) => {
    switch (type) {
      case FileType.FOLDER:
        return <div className="text-emerald-600"><svg viewBox="0 0 24 24" width="64" height="64" fill="currentColor"><path d="M10 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2h-8l-2-2z" /></svg></div>;
      case FileType.IMAGE:
        return <div className="text-blue-500"><svg viewBox="0 0 24 24" width="64" height="64" fill="currentColor"><path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z" /></svg></div>;
      case FileType.DOCUMENT:
        return <div className="text-emerald-800"><svg viewBox="0 0 24 24" width="64" height="64" fill="currentColor"><path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zM6 20V4h7v5h5v11H6z" /></svg></div>;
      default:
        return <div className="text-gray-400"><svg viewBox="0 0 24 24" width="64" height="64" fill="currentColor"><path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z" /></svg></div>;
    }
  };

  return (
    <div className="h-full flex flex-col bg-gray-50/50">
      <div className="bg-white px-6 py-4 border-b border-gray-100 flex items-center justify-between shadow-sm">
        <div className="flex items-center space-x-2">
          <button 
            onClick={() => onNavigate(null)}
            className="text-gray-500 hover:text-emerald-700 font-bold text-xs uppercase tracking-widest transition-colors"
          >
            Vault
          </button>
          {breadcrumbs.map((crumb) => (
            <React.Fragment key={crumb.id}>
              <ChevronRight size={14} className="text-gray-300" />
              <button 
                onClick={() => onNavigate(crumb.id)}
                className="text-gray-700 hover:text-emerald-700 font-bold text-xs uppercase tracking-widest transition-colors"
              >
                {crumb.name}
              </button>
            </React.Fragment>
          ))}
        </div>

        <div className="flex items-center space-x-3">
          <div className="flex bg-gray-100 p-1 rounded-xl">
            <button 
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-white text-emerald-600 shadow-sm' : 'text-gray-400'}`}
            >
              <Grid size={18} />
            </button>
            <button 
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded-lg transition-all ${viewMode === 'list' ? 'bg-white text-emerald-600 shadow-sm' : 'text-gray-400'}`}
            >
              <ListIcon size={18} />
            </button>
          </div>
          <div className="w-px h-8 bg-gray-200 mx-1"></div>
          <button 
            onClick={() => fileInputRef.current?.click()}
            className="bg-[#059669] text-white px-5 py-2.5 rounded-xl text-sm font-bold flex items-center space-x-2 hover:bg-[#047857] shadow-lg shadow-emerald-100 transition-all active:scale-[0.98]"
          >
            <Upload size={16} />
            <span>Upload to Vault</span>
          </button>
          <button 
            onClick={onCreateFolder}
            className="bg-white text-emerald-700 border border-emerald-100 px-5 py-2.5 rounded-xl text-sm font-bold flex items-center space-x-2 hover:bg-emerald-50 transition-all shadow-sm"
          >
            <FolderPlus size={16} />
          </button>
          <input type="file" className="hidden" ref={fileInputRef} multiple onChange={(e) => onUpload(e.target.files)} />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-8">
        {filteredFiles.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-gray-400">
            <div className="w-40 h-40 bg-white rounded-full shadow-xl shadow-emerald-50 flex items-center justify-center mb-6">
              <Cloud size={64} className="text-emerald-100" />
            </div>
            <p className="text-xl font-bold text-gray-800">Your Secure Vault is Empty</p>
            <p className="text-sm text-gray-400 mt-2 max-w-xs text-center">Data dropped here will be immediately encrypted and distributed across our secure nodes.</p>
          </div>
        ) : (
          viewMode === 'grid' ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-8 gap-8">
              {filteredFiles.map((file) => (
                <div 
                  key={file.id}
                  onClick={() => file.type === FileType.FOLDER ? onNavigate(file.id) : null}
                  className={`group relative flex flex-col items-center p-5 rounded-3xl border-2 transition-all cursor-pointer ${
                    selectedItems.includes(file.id) ? 'border-emerald-500 bg-emerald-50 shadow-inner' : 'border-transparent hover:bg-white hover:shadow-2xl hover:shadow-emerald-900/5'
                  }`}
                >
                  <div className="mb-4 transform transition-all group-hover:scale-110 group-hover:-translate-y-1">
                    {getFileIcon(file.type)}
                  </div>
                  
                  <div className="text-center w-full">
                    <div className="text-sm font-bold text-gray-800 truncate px-2" title={file.name}>
                      {file.name}
                    </div>
                    <div className="text-[10px] text-gray-400 mt-1 uppercase font-bold tracking-widest">
                      {file.type === FileType.FOLDER ? 'Directory' : `${(file.size / (1024 * 1024)).toFixed(2)} MB`}
                    </div>
                  </div>

                  <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-all flex flex-col space-y-2 translate-x-2 group-hover:translate-x-0">
                    <button 
                      onClick={(e) => { e.stopPropagation(); setSharingFile(file); }}
                      className="p-2 bg-white shadow-lg rounded-xl text-emerald-600 hover:bg-emerald-50 transition-colors border border-emerald-50"
                    >
                      <Share2 size={16} />
                    </button>
                    <button 
                      onClick={(e) => { e.stopPropagation(); handleAiDeepDive(file); }}
                      className="p-2 bg-white shadow-lg rounded-xl text-blue-600 hover:bg-blue-50 transition-colors border border-blue-50"
                    >
                      <Info size={16} />
                    </button>
                    <button 
                      onClick={(e) => { e.stopPropagation(); onDelete(file.id); }}
                      className="p-2 bg-white shadow-lg rounded-xl text-red-500 hover:bg-red-50 transition-colors border border-red-50"
                    >
                      <Trash size={16} />
                    </button>
                  </div>

                  {aiInsight?.id === file.id && (
                    <div className="absolute z-30 top-full mt-4 left-0 right-0 p-5 bg-white border border-gray-100 shadow-2xl rounded-2xl text-xs text-gray-600 leading-relaxed animate-in slide-in-from-top-4">
                      <div className="font-bold text-emerald-600 mb-2 flex items-center uppercase tracking-widest">
                        <ShieldAlert size={14} className="mr-2" /> AI Deep Scan
                      </div>
                      {aiInsight.text}
                      <button onClick={(e) => { e.stopPropagation(); setAiInsight(null); }} className="absolute top-3 right-3 text-gray-300 hover:text-gray-500">×</button>
                    </div>
                  )}
                  {isAiLoading === file.id && (
                    <div className="absolute inset-0 flex items-center justify-center bg-white/40 backdrop-blur-[1px] rounded-3xl">
                      <div className="w-6 h-6 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-3xl shadow-xl shadow-emerald-900/5 border border-gray-100 overflow-hidden">
              <table className="w-full text-left">
                <thead className="bg-gray-50 text-[10px] text-gray-400 uppercase font-bold border-b border-gray-100">
                  <tr>
                    <th className="px-8 py-5">Name</th>
                    <th className="px-8 py-5">Preserved Size</th>
                    <th className="px-8 py-5">Last Integrity Check</th>
                    <th className="px-8 py-5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filteredFiles.map((file) => (
                    <tr key={file.id} onClick={() => file.type === FileType.FOLDER ? onNavigate(file.id) : null} className="hover:bg-emerald-50/30 cursor-pointer transition-colors group">
                      <td className="px-8 py-4">
                        <div className="flex items-center space-x-4">
                          <div className="scale-[0.4] w-12 h-12 flex items-center justify-center bg-gray-50 rounded-lg shrink-0">
                            {getFileIcon(file.type)}
                          </div>
                          <span className="text-sm font-bold text-gray-700">{file.name}</span>
                        </div>
                      </td>
                      <td className="px-8 py-4 text-xs font-semibold text-gray-400">
                        {file.type === FileType.FOLDER ? 'DIRECTORY' : `${(file.size / (1024 * 1024)).toFixed(1)} MB`}
                      </td>
                      <td className="px-8 py-4 text-xs font-semibold text-gray-400">
                        {file.lastModified}
                      </td>
                      <td className="px-8 py-4 text-right">
                        <div className="flex items-center justify-end space-x-3 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button onClick={(e) => { e.stopPropagation(); setSharingFile(file); }} className="p-2 text-emerald-600 hover:bg-emerald-100 rounded-lg transition-colors">
                            <Share2 size={16} />
                          </button>
                          <button className="p-2 text-gray-400 hover:text-emerald-600 rounded-lg transition-colors">
                            <Download size={16} />
                          </button>
                          <button onClick={(e) => { e.stopPropagation(); onDelete(file.id); }} className="p-2 text-red-400 hover:text-red-600 rounded-lg transition-colors">
                            <Trash size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )
        )}
      </div>

      {sharingFile && (
        <ShareModal file={sharingFile} onClose={() => setSharingFile(null)} />
      )}

      <div className="bg-white px-8 py-3 border-t border-gray-100 text-[10px] text-gray-400 flex items-center justify-between font-bold uppercase tracking-widest">
        <div className="flex space-x-6">
          <span>{filteredFiles.length} Records</span>
          <span>{selectedItems.length} Identified</span>
        </div>
        <div className="flex items-center space-x-6">
          <div className="flex items-center text-emerald-600">
            <div className="w-2 h-2 bg-emerald-600 rounded-full animate-pulse mr-2"></div>
            AES-256 ACTIVE
          </div>
          <span>Survivor Protocol v4.2.1</span>
        </div>
      </div>
    </div>
  );
};

export default FileExplorer;
