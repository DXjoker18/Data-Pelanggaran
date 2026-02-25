
import React, { useState } from 'react';
import { ViolationRecord, UserRole } from '../types';
import { UNIT_LOGO } from '../constants';

interface DatabaseProps {
  data: ViolationRecord[];
  role: UserRole;
  onEdit: (record: ViolationRecord) => void;
  onDelete: (id: string) => void;
}

const Database: React.FC<DatabaseProps> = ({ data, role, onEdit, onDelete }) => {
  const [search, setSearch] = useState('');
  const [selectedRecord, setSelectedRecord] = useState<ViolationRecord | null>(null);
  const [recordToDelete, setRecordToDelete] = useState<ViolationRecord | null>(null);

  const filtered = data.filter(d => 
    d.nama.toLowerCase().includes(search.toLowerCase()) ||
    d.nrp.includes(search) ||
    d.satuan.toLowerCase().includes(search.toLowerCase()) ||
    d.perkara.toLowerCase().includes(search.toLowerCase()) ||
    (d.pasal && d.pasal.toLowerCase().includes(search.toLowerCase())) ||
    (d.ketTindakan && d.ketTindakan.toLowerCase().includes(search.toLowerCase()))
  );

  const downloadSinglePDF = (record: ViolationRecord) => {
    const element = document.createElement('div');
    element.innerHTML = `
      <div style="padding: 40px; font-family: 'Arial', sans-serif;">
        <div style="text-align: center; border-bottom: 2px solid #2d3a2a; padding-bottom: 20px; margin-bottom: 30px;">
          <img src="${UNIT_LOGO}" style="width: 80px; height: 80px; margin-bottom: 10px;" />
          <h1 style="margin: 0; font-size: 20px; text-transform: uppercase; color: #1a2418;">Kartu Data Pelanggaran Hukum</h1>
          <p style="margin: 5px 0 0 0; font-size: 12px; font-weight: bold; color: #666;">BRIGADE INFANTERI 4/DEWA RATNA</p>
        </div>
        
        <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
          <tr style="border-bottom: 1px solid #eee;">
            <td style="padding: 10px 0; font-weight: bold; width: 150px;">Nama Lengkap</td>
            <td style="padding: 10px 0;">: ${record.nama}</td>
          </tr>
          <tr style="border-bottom: 1px solid #eee;">
            <td style="padding: 10px 0; font-weight: bold;">Pangkat / NRP</td>
            <td style="padding: 10px 0;">: ${record.pangkat} / ${record.nrp}</td>
          </tr>
          <tr style="border-bottom: 1px solid #eee;">
            <td style="padding: 10px 0; font-weight: bold;">Jabatan / Satuan</td>
            <td style="padding: 10px 0;">: ${record.jabatan} / ${record.satuan}</td>
          </tr>
          <tr style="border-bottom: 1px solid #eee;">
            <td style="padding: 10px 0; font-weight: bold;">Jenis Perkara</td>
            <td style="padding: 10px 0;">: ${record.perkara}</td>
          </tr>
          <tr style="border-bottom: 1px solid #eee;">
            <td style="padding: 10px 0; font-weight: bold;">Pasal / Dasar Hukum</td>
            <td style="padding: 10px 0;">: ${record.pasal || '-'}</td>
          </tr>
          <tr style="border-bottom: 1px solid #eee;">
            <td style="padding: 10px 0; font-weight: bold;">Tanggal Kejadian</td>
            <td style="padding: 10px 0;">: ${record.tanggal}</td>
          </tr>
          <tr style="border-bottom: 1px solid #eee;">
            <td style="padding: 10px 0; font-weight: bold;">Status Hukum</td>
            <td style="padding: 10px 0;">: ${record.status} ${record.ketTindakan ? `(${record.ketTindakan})` : ''}</td>
          </tr>
        </table>

        <div style="margin-top: 30px;">
          <h3 style="font-size: 14px; text-transform: uppercase; border-bottom: 1px solid #2d3a2a; display: inline-block; padding-bottom: 2px;">Kronologis Singkat:</h3>
          <p style="font-size: 12px; line-height: 1.6; text-align: justify; color: #333; margin-top: 10px; background: #f9f9f9; padding: 15px; border-radius: 8px;">
            ${record.kronologis}
          </p>
        </div>

        <div style="margin-top: 50px; text-align: right;">
          <p style="font-size: 12px;">Dikeluarkan secara sistem pada: ${new Date().toLocaleDateString('id-ID')}</p>
        </div>
      </div>
    `;

    const opt = {
      margin: 10,
      filename: `Data_Hukum_${record.nama.replace(/\s+/g, '_')}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };
    
    // @ts-ignore
    window.html2pdf().set(opt).from(element).save();
  };

  const downloadAllPDF = () => {
    const element = document.createElement('div');
    element.innerHTML = `
      <div style="padding: 30px; font-family: 'Arial', sans-serif;">
        <div style="text-align: center; margin-bottom: 20px;">
          <h1 style="font-size: 18px; text-transform: uppercase; margin: 0;">Rekapitulasi Pelanggaran Hukum</h1>
          <p style="font-size: 12px; font-weight: bold; margin: 5px 0;">BRIGADE INFANTERI 4/DEWA RATNA</p>
        </div>
        <table style="width: 100%; border-collapse: collapse; font-size: 10px;">
          <thead>
            <tr style="background: #2d3a2a; color: white;">
              <th style="border: 1px solid #ddd; padding: 8px;">No</th>
              <th style="border: 1px solid #ddd; padding: 8px;">Nama / Pkt / NRP</th>
              <th style="border: 1px solid #ddd; padding: 8px;">Satuan</th>
              <th style="border: 1px solid #ddd; padding: 8px;">Perkara (Pasal)</th>
              <th style="border: 1px solid #ddd; padding: 8px;">Status</th>
              <th style="border: 1px solid #ddd; padding: 8px;">Tanggal</th>
            </tr>
          </thead>
          <tbody>
            ${data.map((item, index) => `
              <tr>
                <td style="border: 1px solid #ddd; padding: 8px; text-align: center;">${index + 1}</td>
                <td style="border: 1px solid #ddd; padding: 8px;">${item.nama}<br><span style="color: #666;">${item.pangkat} / ${item.nrp}</span></td>
                <td style="border: 1px solid #ddd; padding: 8px;">${item.satuan}</td>
                <td style="border: 1px solid #ddd; padding: 8px;">${item.perkara}<br><span style="font-style: italic; color: #777;">${item.pasal || '-'}</span></td>
                <td style="border: 1px solid #ddd; padding: 8px;">${item.status}</td>
                <td style="border: 1px solid #ddd; padding: 8px; text-align: center;">${item.tanggal}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
        <div style="margin-top: 20px; text-align: right; font-size: 9px;">
          Dicetak pada: ${new Date().toLocaleString('id-ID')}
        </div>
      </div>
    `;

    const opt = {
      margin: 10,
      filename: `Rekap_Pelanggaran_Brigif4DR_${new Date().toISOString().split('T')[0]}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'landscape' }
    };
    
    // @ts-ignore
    window.html2pdf().set(opt).from(element).save();
  };

  const confirmDelete = () => {
    if (recordToDelete) {
      onDelete(recordToDelete.id);
      setRecordToDelete(null);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 px-2">
        <div>
          <h2 className="text-xs font-black text-gray-400 uppercase tracking-[0.2em]">Database Personel</h2>
          <p className="text-[10px] font-bold text-accent uppercase">{filtered.length} DATA DITEMUKAN</p>
        </div>
        <div className="flex gap-2">
          <button 
            type="button"
            onClick={downloadAllPDF}
            className="army-gradient text-white text-[9px] px-4 py-2.5 rounded-xl font-black uppercase tracking-widest shadow-md transition-all active:scale-95 flex items-center gap-2"
          >
            <i className="fas fa-file-export"></i> Rekap PDF
          </button>
          <div className="relative flex-1 max-w-xs">
            <i className="fas fa-search absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"></i>
            <input 
              type="text" 
              placeholder="Cari Nama, NRP, atau Pasal..."
              className="w-full pl-10 pr-4 py-2.5 bg-white rounded-xl shadow-sm border border-gray-100 outline-none focus:ring-2 focus:ring-accent text-[11px] font-bold transition-all"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pb-10">
        {filtered.map((item) => (
          <div key={item.id} className="bg-white rounded-3xl p-5 shadow-sm border border-gray-50 hover:shadow-md transition-all group relative overflow-hidden">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center p-1 border border-slate-100">
                  <img src={UNIT_LOGO} alt="Unit" className="w-full h-full object-contain opacity-40" />
                </div>
                <div>
                  <h4 className="text-[11px] font-black text-gray-800 uppercase leading-none">{item.nama}</h4>
                  <p className="text-[9px] font-bold text-gray-400 mt-1 uppercase tracking-wider">{item.pangkat} / {item.nrp}</p>
                </div>
              </div>
              <div className={`px-2 py-1 rounded-lg text-[8px] font-black uppercase ${item.status === 'Selesai' ? 'bg-green-50 text-green-600' : 'bg-orange-50 text-orange-600'}`}>
                {item.status}
              </div>
            </div>

            <div className="space-y-2 mb-4">
              <div className="flex justify-between items-center text-[9px] font-bold uppercase">
                <span className="text-gray-400">Satuan</span>
                <span className="text-gray-700">{item.satuan}</span>
              </div>
              <div className="flex flex-col text-[9px] font-bold uppercase">
                <span className="text-gray-400 mb-1">Perkara & Pasal</span>
                <span className="text-accent">{item.perkara}</span>
                <span className="text-gray-500 italic mt-0.5 normal-case font-semibold">{item.pasal || 'Pasal belum diisi'}</span>
              </div>
            </div>

            <div className="flex gap-2 pt-2 border-t border-gray-50">
              <button onClick={() => setSelectedRecord(item)} className="flex-1 py-2 rounded-xl bg-slate-50 text-[8px] font-black uppercase tracking-widest text-gray-500 hover:bg-slate-100 transition-all">Detail</button>
              {role === 'admin' && (
                <>
                  <button onClick={() => onEdit(item)} className="w-10 h-10 flex items-center justify-center rounded-xl bg-blue-50 text-blue-500 hover:bg-blue-100 transition-all"><i className="fas fa-edit text-[10px]"></i></button>
                  <button onClick={() => setRecordToDelete(item)} className="w-10 h-10 flex items-center justify-center rounded-xl bg-red-50 text-red-500 hover:bg-red-100 transition-all"><i className="fas fa-trash text-[10px]"></i></button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Detail Modal */}
      {selectedRecord && (
        <div className="fixed inset-0 z-[2000] bg-black/80 backdrop-blur-md flex items-center justify-center p-6 overflow-y-auto">
          <div className="bg-white w-full max-w-lg rounded-[2.5rem] overflow-hidden shadow-2xl animate-pop relative">
            <button onClick={() => setSelectedRecord(null)} className="absolute top-6 right-6 w-10 h-10 rounded-full bg-black/5 hover:bg-black/10 flex items-center justify-center text-gray-500 transition-all"><i className="fas fa-times"></i></button>
            <div className="army-gradient p-8 text-white">
              <h3 className="text-lg font-black uppercase tracking-tighter mb-1">{selectedRecord.nama}</h3>
              <p className="text-[10px] font-bold uppercase tracking-widest opacity-80">{selectedRecord.pangkat} / {selectedRecord.nrp}</p>
            </div>
            <div className="p-8 space-y-6 max-h-[60vh] overflow-y-auto">
              <div className="grid grid-cols-2 gap-6">
                <DetailItem label="Satuan" value={selectedRecord.satuan} />
                <DetailItem label="Jabatan" value={selectedRecord.jabatan} />
                <DetailItem label="Jenis Perkara" value={selectedRecord.perkara} />
                <DetailItem label="Pasal / Dasar Hukum" value={selectedRecord.pasal || '-'} />
                <DetailItem label="Tanggal" value={selectedRecord.tanggal} />
                <DetailItem label="Status" value={`${selectedRecord.status} ${selectedRecord.ketTindakan ? `(${selectedRecord.ketTindakan})` : ''}`} />
              </div>
              <div className="space-y-2">
                <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Kronologis Singkat</label>
                <div className="bg-slate-50 p-5 rounded-2xl text-[11px] leading-relaxed text-gray-700 font-medium whitespace-pre-wrap">
                  {selectedRecord.kronologis}
                </div>
              </div>
            </div>
            <div className="p-4 bg-gray-50 border-t flex gap-2">
              <button onClick={() => downloadSinglePDF(selectedRecord)} className="flex-1 army-gradient py-4 rounded-xl text-white font-black text-[10px] uppercase tracking-widest shadow-lg">Cetak PDF</button>
              <button onClick={() => setSelectedRecord(null)} className="flex-1 bg-white py-4 rounded-xl text-gray-400 font-black text-[10px] uppercase border border-gray-200">Tutup</button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {recordToDelete && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-[1000] flex items-center justify-center p-6">
          <div className="bg-white w-full max-w-sm rounded-[2.5rem] overflow-hidden shadow-2xl animate-pop">
            <div className="p-8 text-center">
              <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">
                <i className="fas fa-exclamation-triangle"></i>
              </div>
              <h3 className="font-black text-gray-900 uppercase text-xs mb-2">Konfirmasi Hapus</h3>
              <p className="text-[10px] text-gray-500 font-bold leading-relaxed">
                Apakah Anda yakin ingin menghapus data hukum atas nama <span className="text-red-500">{recordToDelete.nama}</span>? Tindakan ini tidak dapat dibatalkan.
              </p>
            </div>
            <div className="p-4 bg-gray-50 flex gap-2">
              <button onClick={() => setRecordToDelete(null)} className="flex-1 py-4 rounded-xl bg-white text-gray-400 font-black text-[10px] uppercase border">Batal</button>
              <button onClick={confirmDelete} className="flex-1 py-4 rounded-xl bg-red-500 text-white font-black text-[10px] uppercase shadow-lg shadow-red-500/20">Ya, Hapus</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const DetailItem: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <div className="space-y-1">
    <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest">{label}</p>
    <p className="text-xs font-black text-gray-800 uppercase">{value}</p>
  </div>
);

export default Database;
