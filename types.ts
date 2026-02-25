
export type UserRole = 'admin' | 'viewer';

export type AppTheme = 'jungle' | 'midnight' | 'maroon' | 'stealth';

export interface AppNotification {
  id: string;
  message: string;
  timestamp: number;
  isRead: boolean;
  type: 'success' | 'info' | 'warning';
}

export interface ViolationRecord {
  id: string;
  satuan: string;
  perkara: string;
  pasal: string; // Detail pasal yang dilanggar
  nama: string;
  pangkat: string;
  nrp: string;
  jabatan: string;
  tanggal: string;
  status: 'Selesai' | 'Proses Hukum';
  ketTindakan?: string; // Detail tindakan saat proses hukum
  kronologis: string;
}

export enum ViewType {
  DASHBOARD = 'beranda',
  DATABASE = 'daftar',
  INPUT = 'input',
  AI_HELPER = 'ai'
}
