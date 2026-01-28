
import React, { useMemo } from 'react';
import { ViolationRecord } from '../types';
import { SATUAN_LIST, UNIT_LOGO } from '../constants';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';

interface DashboardProps {
  data: ViolationRecord[];
}

const Dashboard: React.FC<DashboardProps> = ({ data }) => {
  const stats = useMemo(() => {
    const proses = data.filter(d => d.status === 'Proses Hukum').length;
    const selesai = data.filter(d => d.status === 'Selesai').length;
    
    const unitStats = SATUAN_LIST.map(s => ({
      name: s.split(' ')[0] + ' ' + (s.split(' ')[1] || ''),
      total: data.filter(d => d.satuan === s).length
    }));

    const caseTypes = Array.from(new Set(data.map(d => d.perkara)));
    const caseStats = caseTypes.map(c => ({
      name: c,
      value: data.filter(d => d.perkara === c).length
    }));

    return { proses, selesai, unitStats, caseStats };
  }, [data]);

  const COLORS = ['#16a34a', '#eab308', '#ef4444', '#3b82f6', '#8b5cf6', '#ec4899'];

  return (
    <div className="space-y-6">
      {/* Unit Hero */}
      <div className="army-gradient p-6 rounded-[2.5rem] shadow-2xl relative overflow-hidden text-white flex items-center gap-6">
        <div className="flex-shrink-0 w-20 h-20 md:w-24 md:h-24 flex items-center justify-center bg-white/10 rounded-2xl backdrop-blur-sm p-3 border border-white/20">
          <img src={UNIT_LOGO} alt="Logo" className="w-full h-full object-contain" />
        </div>
        <div className="flex-1 relative z-10">
          <h3 className="font-black text-xs uppercase tracking-[0.2em] text-green-400 mb-1">Brigade Infanteri 4/Dewa Ratna</h3>
          <p className="text-[10px] leading-relaxed font-medium text-gray-100 opacity-90 text-justify">
            Sistem Informasi Manajemen Hukum (SIMAK) untuk memantau, mendata, dan menganalisis tren pelanggaran hukum guna pembinaan personel yang lebih efektif.
          </p>
        </div>
        <i className="fas fa-shield-halved absolute -right-6 -bottom-6 text-9xl text-white opacity-5"></i>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 gap-4">
        <StatCard 
          label="Dalam Proses" 
          value={stats.proses} 
          icon="fas fa-spinner fa-spin" 
          color="border-orange-500" 
        />
        <StatCard 
          label="Penyelesaian" 
          value={stats.selesai} 
          icon="fas fa-check-double" 
          color="border-green-600" 
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-[2.5rem] shadow-sm border border-gray-100">
          <h3 className="font-black text-gray-800 text-[10px] uppercase tracking-widest mb-6">Tren Kasus Per Satuan</h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.unitStats}>
                <XAxis dataKey="name" fontSize={10} tick={{ fill: '#64748b' }} axisLine={false} tickLine={false} />
                <YAxis fontSize={10} tick={{ fill: '#64748b' }} axisLine={false} tickLine={false} />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', fontSize: '10px' }}
                />
                <Bar dataKey="total" fill="#16a34a" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-[2.5rem] shadow-sm border border-gray-100">
          <h3 className="font-black text-gray-800 text-[10px] uppercase tracking-widest mb-6">Distribusi Kategori Perkara</h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={stats.caseStats}
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {stats.caseStats.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', fontSize: '10px' }}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '10px', paddingTop: '20px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard: React.FC<{ label: string; value: number; icon: string; color: string }> = ({ label, value, icon, color }) => (
  <div className={`bg-white p-6 rounded-[2rem] border-b-4 ${color} relative overflow-hidden shadow-sm`}>
    <div className="relative z-10">
      <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">{label}</p>
      <p className="text-4xl font-black text-gray-900">{value}</p>
    </div>
    <i className={`${icon} absolute -right-4 -bottom-4 text-6xl text-gray-50 opacity-10`}></i>
  </div>
);

export default Dashboard;
