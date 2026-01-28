
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

  const filtered = data.filter(d => 
    d.nama.toLowerCase().includes(search.toLowerCase()) ||
    d.nrp.includes(search) ||
    d.satuan.toLowerCase().includes(search.toLowerCase()) ||
    d.perkara.toLowerCase().includes(search.toLowerCase()) ||
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
              <th style="border: 1px solid #ddd; padding: 8px;">Perkara</th>
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
                <td style="border: 1px solid #ddd; padding: 8px;">${item.perkara}</td>
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

  return (
    <div className="space-y-4">
      {/* Search Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 px-2">
        <div>
          <h2 className="text-xs font-black text-gray-400 uppercase tracking-[0.2em]">Database Personel</h2>
          <p className="text-[10px] font-bold text-green-600 uppercase">{filtered.length} DATA DITEMUKAN</p>
        </div>
        <div className="flex gap-2">
          <button 
            type="button"
            onClick={downloadAllPDF}
            className="bg-blue-600 hover:bg-blue-700 text-white text-[9px] px-4 py-2.5 rounded-xl font-black uppercase tracking-widest shadow-md transition-all active:scale-95 flex items-center gap-2"
          >
            <i className="fas fa-file-export"></i> Rekap PDF
          </button>
          <div className="relative flex-1 max-w-xs">
            <i className="fas fa-search absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"></i>
            <input 
              type="text" 
              placeholder="Cari Data..."
              className="w-full pl-10 pr-4 py-2.5 bg-white rounded-xl shadow-sm border border-gray-100 outline-none focus:ring-2 focus:ring-green-500 text-[11px] font-bold transition-all"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Grid List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map(item => (
          <div key={item.id} className="bg-white p-5 rounded-[2rem] border border-gray-50 shadow-sm flex items-center justify-between group hover:shadow-md transition-all">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 army-gradient rounded-2xl flex items-center justify-center text-white font-bold uppercase text-[9px] shadow-inner">
                {item.pangkat.substring(0, 3)}
              </div>
              <div>
                <h4 className="text-xs font-black text-gray-800 uppercase leading-tight">{item.nama}</h4>
                <p className="text-[9px] font-bold text-gray-400 mt-0.5">{item.pangkat} / {item.nrp} - {item.satuan}</p>
                <div className="flex flex-wrap items-center gap-2 mt-2">
                  <span className={`text-[8px] px-2 py-0.5 rounded-full font-bold uppercase ${
                    item.status === 'Selesai' ? 'bg-green-100 text-green-600' : 'bg-orange-100 text-orange-600'
                  }`}>
                    {item.status}
                  </span>
                  {item.status === 'Proses Hukum' && item.ketTindakan && (
                    <span className="text-[8px] px-2 py-0.5 rounded-full bg-blue-100 text-blue-600 font-bold uppercase">
                      {item.ketTindakan}
                    </span>
                  )}
                  <span className="text-[8px] font-bold text-gray-300 uppercase">{item.perkara}</span>
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <button 
                type="button"
                onClick={() => setSelectedRecord(item)}
                className="w-8 h-8 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 hover:bg-slate-100 transition-colors"
                title="Lihat Detail"
              >
                <i className="fas fa-eye text-xs"></i>
              </button>
              {role === 'admin' && (
                <>
                  <button 
                    type="button"
                    onClick={() => onEdit(item)}
                    className="w-8 h-8 rounded-xl bg-blue-50 flex items-center justify-center text-blue-400 hover:bg-blue-100 transition-colors"
                    title="Edit Data"
                  >
                    <i className="fas fa-edit text-xs"></i>
                  </button>
                  {/* Tombol Delete hanya muncul jika status 'Selesai' */}
                  {item.status === 'Selesai' && (
                    <button 
                      type="button"
                      onClick={() => onDelete(item.id)}
                      className="w-8 h-8 rounded-xl bg-red-50 flex items-center justify-center text-red-400 hover:bg-red-100 transition-colors"
                      title="Hapus Data (Selesai)"
                    >
                      <i className="fas fa-trash text-xs"></i>
                    </button>
                  )}
                </>
              )}
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="py-20 text-center opacity-20">
          <i className="fas fa-folder-open text-5xl mb-4"></i>
          <p className="font-black uppercase tracking-[0.3em]">Tidak Ada Data</p>
        </div>
      )}

      {/* Detail Modal */}
      {selectedRecord && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-[100] flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-[2.5rem] overflow-hidden shadow-2xl animate-pop">
            <div className="army-gradient p-6 text-white text-center flex flex-col items-center">
              <img src={UNIT_LOGO} alt="Logo" className="w-12 h-12 object-contain mb-3 bg-white/20 p-1 rounded-lg" />
              <h2 className="font-black text-sm uppercase tracking-widest">Detail Perkara Personel</h2>
              <p className="text-[8px] text-green-400 font-bold tracking-[0.2em] mt-1 uppercase">Brigif 4/Dewa Ratna</p>
            </div>
            <div className="p-8 space-y-4 max-h-[60vh] overflow-y-auto">
              <DetailItem label="Nama Lengkap" value={selectedRecord.nama} />
              <div className="grid grid-cols-2 gap-4">
                <DetailItem label="Pangkat / NRP" value={`${selectedRecord.pangkat} / ${selectedRecord.nrp}`} />
                <DetailItem label="Jabatan" value={selectedRecord.jabatan} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <DetailItem label="Satuan" value={selectedRecord.satuan} />
                <DetailItem label="Jenis Perkara" value={selectedRecord.perkara} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <DetailItem label="Tanggal Kejadian" value={selectedRecord.tanggal} />
                <DetailItem label="Status Hukum" value={selectedRecord.status} highlight={selectedRecord.status === 'Selesai' ? 'text-green-600' : 'text-orange-500'} />
              </div>
              {selectedRecord.status === 'Proses Hukum' && selectedRecord.ketTindakan && (
                <div className="bg-blue-50 p-4 rounded-2xl border border-blue-100">
                  <DetailItem label="Ket Tindakan Saat Ini" value={selectedRecord.ketTindakan} highlight="text-blue-700" />
                </div>
              )}
              <div className="mt-4 pt-4 border-t border-gray-100">
                <label className="text-[9px] font-black text-gray-400 uppercase block mb-2">Kronologis Kejadian</label>
                <p className="text-[11px] text-gray-600 leading-relaxed text-justify bg-slate-50 p-4 rounded-2xl border border-slate-100 italic shadow-inner">
                  "{selectedRecord.kronologis}"
                </p>
              </div>
            </div>
            <div className="p-4 bg-gray-50 border-t flex justify-between gap-3">
              <button 
                type="button"
                onClick={() => downloadSinglePDF(selectedRecord)}
                className="bg-green-600 hover:bg-green-700 text-white text-[10px] px-6 py-3 rounded-xl font-black uppercase tracking-widest shadow-lg active:scale-95 transition-all flex items-center gap-2"
              >
                <i className="fas fa-file-pdf"></i> Download PDF
              </button>
              <button 
                type="button"
                onClick={() => setSelectedRecord(null)}
                className="bg-gray-200 text-gray-600 text-[10px] px-6 py-3 rounded-xl font-black uppercase tracking-widest active:scale-95 transition-all"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const DetailItem: React.FC<{ label: string; value: string; highlight?: string }> = ({ label, value, highlight }) => (
  <div>
    <label className="text-[8px] font-black text-gray-400 uppercase block mb-0.5">{label}</label>
    <p className={`text-[11px] font-bold text-gray-800 border-b border-gray-50 pb-1 ${highlight || ''}`}>{value}</p>
  </div>
);

export default Database;
