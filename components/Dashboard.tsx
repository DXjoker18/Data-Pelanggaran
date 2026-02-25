
import React, { useMemo, useState, useEffect } from 'react';
import { ViolationRecord, UserRole } from '../types';
import { UNIT_LOGO, PANGKAT_LIST } from '../constants';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend, CartesianGrid, LabelList } from 'recharts';

interface DashboardProps {
  data: ViolationRecord[];
  role: UserRole;
  units: string[];
}

const DEFAULT_TITLE = "Brigade Infanteri 4 / Dewa Ratna";
const DEFAULT_DESC = "Sistem Informasi Manajemen Hukum (SIMAK) dirancang untuk pemantauan real-time, pendataan akurat, dan analisis tren pelanggaran guna mendukung pembinaan personel yang unggul dan disiplin.";

const Dashboard: React.FC<DashboardProps> = ({ data, role, units }) => {
  const [heroTitle, setHeroTitle] = useState(DEFAULT_TITLE);
  const [heroDesc, setHeroDesc] = useState(DEFAULT_DESC);
  const [isEditingHero, setIsEditingHero] = useState(false);
  
  const [tempTitle, setTempTitle] = useState("");
  const [tempDesc, setTempDesc] = useState("");

  useEffect(() => {
    const savedTitle = localStorage.getItem('hero_title');
    const savedDesc = localStorage.getItem('hero_desc');
    if (savedTitle) setHeroTitle(savedTitle);
    if (savedDesc) setHeroDesc(savedDesc);
  }, []);

  const openEditModal = () => {
    setTempTitle(heroTitle);
    setTempDesc(heroDesc);
    setIsEditingHero(true);
  };

  const handleSaveHero = () => {
    setHeroTitle(tempTitle);
    setHeroDesc(tempDesc);
    localStorage.setItem('hero_title', tempTitle);
    localStorage.setItem('hero_desc', tempDesc);
    setIsEditingHero(false);
  };

  const handleResetDefault = () => {
    setTempTitle(DEFAULT_TITLE);
    setTempDesc(DEFAULT_DESC);
  };

  const stats = useMemo(() => {
    const total = data.length;
    const proses = data.filter(d => d.status === 'Proses Hukum').length;
    const selesai = data.filter(d => d.status === 'Selesai').length;
    
    const unitStats = units.map(s => ({
      name: s,
      shortName: s.replace('Yonif TP ', 'YTP ').replace('Yonif ', 'Y').replace('Denma Brigif 4/DR', 'Denma'),
      total: data.filter(d => d.satuan === s).length,
    }));

    const rankStats = PANGKAT_LIST.map(p => ({
      pangkat: p,
      count: data.filter(d => d.pangkat === p).length
    })).filter(r => r.count > 0);

    return { total, proses, selesai, unitStats, rankStats };
  }, [data, units]);

  const getAccentColor = () => getComputedStyle(document.documentElement).getPropertyValue('--accent-color').trim();
  const CHART_COLORS = ['#3b82f6', '#ef4444', '#f59e0b', '#8b5cf6', '#ec4899', '#06b6d4', '#10b981'];

  return (
    <div className="space-y-6">
      {/* Hero Section with Prominent Edit Button */}
      <div className="army-gradient p-8 rounded-[2.5rem] shadow-2xl relative overflow-hidden text-white flex flex-col md:flex-row items-center gap-6 group">
        {role === 'admin' && (
          <button 
            type="button"
            onClick={openEditModal}
            className="absolute top-4 right-4 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-xl flex items-center gap-2 backdrop-blur-md border border-white/20 transition-all z-20 group-hover:scale-105 active:scale-95 shadow-lg"
            title="Edit Tulisan Dashboard"
          >
            <i className="fas fa-edit text-[10px]"></i>
            <span className="text-[9px] font-black uppercase tracking-widest">Edit Konten</span>
          </button>
        )}
        
        <div className="flex-shrink-0 w-24 h-24 flex items-center justify-center bg-white/10 rounded-3xl backdrop-blur-md p-4 border border-white/20 shadow-xl">
          <img src={UNIT_LOGO} alt="Logo" className="w-full h-full object-contain" />
        </div>
        <div className="flex-1 relative z-10 text-center md:text-left">
          <h3 className="font-extrabold text-xl md:text-2xl uppercase tracking-tighter text-white mb-2 drop-shadow-md">
            {heroTitle}
          </h3>
          <div className="h-1.5 w-24 bg-white/20 mb-4 mx-auto md:mx-0 rounded-full"></div>
          <p className="text-xs md:text-sm leading-relaxed font-semibold text-white/90 max-w-2xl text-shadow-sm">
            {heroDesc}
          </p>
        </div>
        <i className="fas fa-shield-halved absolute -right-6 -bottom-6 text-9xl text-white opacity-5"></i>
      </div>

      {/* Edit Content Modal */}
      {isEditingHero && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-[1000] flex items-center justify-center p-6">
          <div className="bg-white w-full max-w-md rounded-[2.5rem] overflow-hidden shadow-2xl animate-pop">
            <div className="army-gradient p-6 text-white text-center">
              <h3 className="font-black text-sm uppercase tracking-widest">Manajemen Teks Beranda</h3>
              <p className="text-[8px] opacity-70 font-bold uppercase mt-1">Ubah Judul dan Deskripsi Utama</p>
            </div>
            <div className="p-8 space-y-5">
              <div className="space-y-1">
                <label className="text-[9px] font-black text-gray-400 uppercase ml-2">Judul Utama / Nama Satuan</label>
                <input 
                  type="text"
                  value={tempTitle}
                  onChange={(e) => setTempTitle(e.target.value)}
                  placeholder="Masukkan judul..."
                  className="w-full bg-slate-50 p-4 rounded-2xl text-xs font-bold border-2 border-transparent focus:border-accent outline-none transition-all"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[9px] font-black text-gray-400 uppercase ml-2">Deskripsi Sistem / Slogan</label>
                <textarea 
                  rows={4}
                  value={tempDesc}
                  onChange={(e) => setTempDesc(e.target.value)}
                  placeholder="Masukkan deskripsi..."
                  className="w-full bg-slate-50 p-4 rounded-2xl text-xs font-bold border-2 border-transparent focus:border-accent outline-none transition-all resize-none"
                />
              </div>
              <button 
                type="button" 
                onClick={handleResetDefault}
                className="text-[9px] font-black text-accent-dark uppercase hover:underline ml-2"
              >
                <i className="fas fa-undo mr-1"></i> Reset ke Default
              </button>
            </div>
            <div className="p-4 bg-gray-50 border-t flex flex-col gap-2">
              <button 
                type="button" 
                onClick={handleSaveHero} 
                className="w-full army-gradient py-4 rounded-xl text-white font-black text-[10px] uppercase tracking-widest shadow-lg active:scale-95 transition-all"
              >
                Simpan Perubahan
              </button>
              <button 
                type="button" 
                onClick={() => setIsEditingHero(false)} 
                className="w-full bg-white py-4 rounded-xl text-gray-400 font-black text-[10px] uppercase border border-gray-200"
              >
                Batalkan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard label="Total Pelanggaran" value={stats.total} icon="fas fa-users" color="border-slate-800" subLabel="Seluruh Satuan" />
        <div className="md:col-span-2 grid grid-cols-2 gap-4">
          <StatCard label="Proses Hukum" value={stats.proses} icon="fas fa-spinner fa-spin" color="border-orange-500" subLabel="On-Going" />
          <StatCard label="Selesai" value={stats.selesai} icon="fas fa-check-double" color="border-accent" subLabel="Tuntas" />
        </div>
      </div>

      {/* Unit Breakdown */}
      <div className="bg-white p-6 rounded-[2.5rem] shadow-sm border border-gray-100 overflow-x-auto">
        <h3 className="font-black text-gray-800 text-[11px] uppercase tracking-widest mb-4 flex items-center gap-2">
          <span className="w-2 h-4 bg-accent rounded-full"></span>
          Rincian Per Satuan
        </h3>
        <div className="flex gap-3 min-w-max pb-2">
          {stats.unitStats.map((unit, index) => (
            <div key={unit.name} className="bg-slate-50 p-4 rounded-2xl border border-slate-100 min-w-[120px]">
              <div className="flex flex-col items-center text-center">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white mb-2 shadow-sm" style={{ backgroundColor: CHART_COLORS[index % CHART_COLORS.length] }}>
                  <i className="fas fa-building text-[10px]"></i>
                </div>
                <p className="text-[9px] font-black text-gray-400 uppercase mb-1">{unit.shortName}</p>
                <p className="text-xl font-black text-gray-800">{unit.total}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-[2.5rem] shadow-sm border border-gray-100">
          <h3 className="font-black text-gray-800 text-[11px] uppercase tracking-widest mb-6 flex items-center gap-2">
            <span className="w-2 h-4 bg-accent rounded-full"></span>
            Grafik Perbandingan Satuan
          </h3>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.unitStats} margin={{ top: 20, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="shortName" fontSize={10} tick={{ fill: '#1a2418', fontWeight: 'bold' }} axisLine={false} tickLine={false} interval={0} />
                <YAxis fontSize={10} tick={{ fill: '#64748b' }} axisLine={false} tickLine={false} />
                <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 25px rgba(0,0,0,0.1)', fontSize: '11px', fontWeight: 'bold' }} />
                <Bar dataKey="total" radius={[6, 6, 0, 0]} barSize={35}>
                  <LabelList dataKey="total" position="top" style={{ fill: '#1a2418', fontSize: '10px', fontWeight: 'bold' }} />
                  {stats.unitStats.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-[2.5rem] shadow-sm border border-gray-100">
          <h3 className="font-black text-gray-800 text-[11px] uppercase tracking-widest mb-6 flex items-center gap-2">
            <span className="w-2 h-4 bg-accent rounded-full"></span>
            Distribusi Pangkat
          </h3>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.rankStats} layout="vertical" margin={{ left: 20, right: 30 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                <XAxis type="number" hide />
                <YAxis dataKey="pangkat" type="category" fontSize={10} tick={{ fill: '#1a2418', fontWeight: 'bold' }} axisLine={false} tickLine={false} width={60} />
                <Tooltip contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 25px rgba(0,0,0,0.1)', fontSize: '11px', fontWeight: 'bold' }} />
                <Bar dataKey="count" fill={getAccentColor() || '#22c55e'} radius={[0, 6, 6, 0]} barSize={20}>
                   <LabelList dataKey="count" position="right" style={{ fill: getAccentColor() || '#22c55e', fontSize: '10px', fontWeight: 'bold' }} />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard: React.FC<{ label: string; value: number; icon: string; color: string; subLabel: string }> = ({ label, value, icon, color, subLabel }) => (
  <div className={`bg-white p-6 rounded-[2.5rem] border-l-8 ${color === 'border-accent' ? 'border-accent' : color} relative overflow-hidden shadow-sm`}>
    <div className="relative z-10">
      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{label}</p>
      <div className="flex items-baseline gap-2">
        <p className="text-5xl font-black text-gray-900 drop-shadow-sm">{value}</p>
        <span className="text-[9px] font-bold text-gray-400 uppercase">{subLabel}</span>
      </div>
    </div>
    <i className={`${icon} absolute -right-6 -bottom-6 text-8xl text-gray-100 opacity-20`}></i>
  </div>
);

export default Dashboard;
