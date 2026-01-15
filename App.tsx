
import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import FileExplorer from './components/FileExplorer';
import Profile from './components/Profile';
import Settings from './components/Settings';
import Auth from './components/Auth';
import AdminPanel from './components/AdminPanel';
import { FileItem, FileType, NavigationSection, UserProfile } from './types';
import { generateWelcomeMessage } from './services/geminiService';
import { db } from './services/db';

const INITIAL_FILES: FileItem[] = [
  { id: '1', name: 'Identity Documents', type: FileType.FOLDER, size: 0, lastModified: '2023-10-24 10:20', parentId: null },
  { id: '2', name: 'Archive Media', type: FileType.FOLDER, size: 0, lastModified: '2023-11-12 15:45', parentId: null },
  { id: '3', name: 'Survival_Manual.pdf', type: FileType.DOCUMENT, size: 2400000, lastModified: '2023-12-01 09:12', parentId: '1' },
];

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [files, setFiles] = useState<FileItem[]>([]);
  const [currentFolderId, setCurrentFolderId] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState<NavigationSection>(NavigationSection.CLOUD_DRIVE);
  const [searchQuery, setSearchQuery] = useState('');
  const [welcomeText, setWelcomeText] = useState('Secure cloud platform');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  useEffect(() => {
    const session = db.getSession();
    if (session) {
      setUser(session);
      setIsLoggedIn(true);
      const savedFiles = db.getFiles(session.email);
      setFiles(savedFiles || INITIAL_FILES);
    }
  }, []);

  useEffect(() => {
    if (user && files.length > 0) {
      db.saveFiles(user.email, files);
    }
  }, [files, user]);

  useEffect(() => {
    const fetchWelcome = async () => {
      const msg = await generateWelcomeMessage();
      setWelcomeText(msg || 'Welcome to MEGA Cloud.');
    };
    if (isLoggedIn) fetchWelcome();
  }, [isLoggedIn]);

  const handleLogin = (u: UserProfile) => {
    setUser(u);
    setIsLoggedIn(true);
    const savedFiles = db.getFiles(u.email);
    setFiles(savedFiles || INITIAL_FILES);
  };

  const handleLogout = () => {
    db.logout();
    setIsLoggedIn(false);
    setUser(null);
    setFiles([]);
    setActiveSection(NavigationSection.CLOUD_DRIVE);
  };

  const handleUpload = (newFiles: FileList | null) => {
    if (!newFiles) return;
    const newItems: FileItem[] = Array.from(newFiles).map(file => ({
      id: Math.random().toString(36).substr(2, 9),
      name: file.name,
      type: file.type.includes('image') ? FileType.IMAGE : 
            file.type.includes('video') ? FileType.VIDEO : 
            file.type.includes('pdf') || file.type.includes('text') ? FileType.DOCUMENT : FileType.OTHER,
      size: file.size,
      lastModified: new Date().toISOString().split('T')[0] + ' ' + new Date().toLocaleTimeString().slice(0, 5),
      parentId: currentFolderId,
    }));
    setFiles(prev => [...prev, ...newItems]);
  };

  const createFolder = () => {
    const folderName = prompt('Enter folder name:');
    if (!folderName) return;
    const newFolder: FileItem = {
      id: Math.random().toString(36).substr(2, 9),
      name: folderName,
      type: FileType.FOLDER,
      size: 0,
      lastModified: new Date().toISOString().split('T')[0] + ' ' + new Date().toLocaleTimeString().slice(0, 5),
      parentId: currentFolderId,
    };
    setFiles(prev => [...prev, newFolder]);
  };

  const deleteItem = (id: string) => {
    setFiles(prev => prev.filter(f => f.id !== id));
  };

  if (!isLoggedIn) {
    return <Auth onLogin={handleLogin} />;
  }

  const renderContent = () => {
    switch(activeSection) {
      case NavigationSection.PROFILE:
        return <Profile user={user!} />;
      case NavigationSection.SETTINGS:
        return <Settings />;
      case NavigationSection.ADMIN:
        return user?.role === 'admin' ? <AdminPanel /> : <Profile user={user!} />;
      default:
        return (
          <FileExplorer 
            files={files}
            currentFolderId={currentFolderId}
            onNavigate={(id) => setCurrentFolderId(id)}
            onUpload={handleUpload}
            onCreateFolder={createFolder}
            onDelete={deleteItem}
            searchQuery={searchQuery}
            section={activeSection}
          />
        );
    }
  };

  return (
    <div className="flex h-screen w-full bg-[#f3f4f6] text-[#1f2937]">
      <Sidebar 
        activeSection={activeSection} 
        setActiveSection={setActiveSection} 
        isOpen={isSidebarOpen}
        onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
        onLogout={handleLogout}
        user={user}
      />
      
      <div className="flex-1 flex flex-col min-w-0">
        <Header 
          searchQuery={searchQuery} 
          setSearchQuery={setSearchQuery} 
          welcomeText={welcomeText}
          user={user}
          onOpenProfile={() => setActiveSection(NavigationSection.PROFILE)}
        />
        
        <main className="flex-1 overflow-hidden relative">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default App;
