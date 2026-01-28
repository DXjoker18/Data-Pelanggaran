
export type UserRole = 'admin' | 'viewer';

export interface ViolationRecord {
  id: string;
  satuan: string;
  perkara: string;
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
