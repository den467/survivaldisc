
export enum FileType {
  FOLDER = 'FOLDER',
  IMAGE = 'IMAGE',
  VIDEO = 'VIDEO',
  DOCUMENT = 'DOCUMENT',
  OTHER = 'OTHER'
}

export interface FileItem {
  id: string;
  name: string;
  type: FileType;
  size: number;
  lastModified: string;
  parentId: string | null;
  thumbnail?: string;
  aiDescription?: string;
}

export enum NavigationSection {
  CLOUD_DRIVE = 'cloud-drive',
  RECENT = 'recent',
  SHARED = 'shared',
  RUBBISH_BIN = 'rubbish-bin',
  CONTACTS = 'contacts',
  PROFILE = 'profile',
  SETTINGS = 'settings',
  ADMIN = 'admin'
}

export interface UserProfile {
  name: string;
  email: string;
  tier: 'Survivor' | 'Guardian' | 'Immortal';
  avatar: string;
  joinDate: string;
  role?: 'admin' | 'user';
}
