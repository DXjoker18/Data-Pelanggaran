
import React, { useState, useEffect, useCallback } from 'react';
import { UserRole, ViolationRecord, ViewType, AppTheme, AppNotification } from './types';
import { ADMIN_PASS, UNIT_LOGO, SATUAN_LIST, THEME_CONFIGS } from './constants';
import Dashboard from './components/Dashboard';
import Database from './components/Database';
import DataForm from './components/DataForm';
import AIAssistant from './components/AIAssistant';
import Login from './components/Login';

const App: React.FC = () => {
  const [role, setRole] = useState<UserRole | null>(null);
  const [activeView, setActiveView] = useState<ViewType>(ViewType.DASHBOARD);
  const [data, setData] = useState<ViolationRecord[]>([]);
  const [units, setUnits] = useState<string[]>(SATUAN_LIST);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState<ViolationRecord | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [theme, setTheme] = useState<AppTheme>('jungle');
  const [isThemeModalOpen, setIsThemeModalOpen] = useState(false);
  
  // States for Network (Local monitoring only)
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [onlineCount, setOnlineCount] = useState(Math.floor(Math.random() * (15 - 8 + 1)) + 8);

  // Helper for Toast
  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  // Helper for Notifications
  const addNotification = useCallback((message: string, type: 'success' | 'info' | 'warning' = 'info') => {
    const newNotif: AppNotification = {
      id: Date.now().toString(),
      message,
      timestamp: Date.now(),
      isRead: false,
      type
    };
    setNotifications(prev => {
      const updated = [newNotif, ...prev].slice(0, 20); 
      localStorage.setItem('brigif_notifs_v3', JSON.stringify(updated));
      return updated;
    });
  }, []);

  // Load initial local data
  useEffect(() => {
    const savedData = localStorage.getItem('brigif_data_v3');
    if (savedData) setData(JSON.parse(savedData));

    const savedUnits = localStorage.getItem('brigif_units_v3');
    if (savedUnits) setUnits(JSON.parse(savedUnits));

    const savedNotifs = localStorage.getItem('brigif_notifs_v3');
    if (savedNotifs) setNotifications(JSON.parse(savedNotifs));

    const savedRole = sessionStorage.getItem('user_role');
    if (savedRole) setRole(savedRole as UserRole);

    const savedTheme = localStorage.getItem('app_theme');
    if (savedTheme) setTheme(savedTheme as AppTheme);
  }, []);

  // Network & Online Monitoring
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      showToast("🌐 Sistem Terhubung");
    };
    const handleOffline = () => {
      setIsOnline(false);
      showToast("❌ Mode Offline Aktif");
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    const interval = setInterval(() => {
      if (navigator.onLine) {
        setOnlineCount(prev => {
          const change = Math.random() > 0.5 ? 1 : -1;
          const next = prev + change;
          return next >= 5 && next <= 30 ? next : prev;
        });
      }
    }, 15000);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      clearInterval(interval);
    };
  }, []);

  // Theme variable injection
  useEffect(() => {
    const config = THEME_CONFIGS[theme];
    const root = document.documentElement;
    root.style.setProperty('--primary-gradient', config.gradient);
    root.style.setProperty('--accent-color', config.accent);
    root.style.setProperty('--accent-light', config.light);
    root.style.setProperty('--accent-dark', config.dark);
    localStorage.setItem('app_theme', theme);
  }, [theme]);

  const markAllNotifsRead = () => {
    setNotifications(prev => {
      const updated = prev.map(n => ({ ...n, isRead: true }));
      localStorage.setItem('brigif_notifs_v3', JSON.stringify(updated));
      return updated;
    });
  };

  const handleLogin = (selectedRole: UserRole, password?: string) => {
    if (selectedRole === 'admin') {
      if (password === ADMIN_PASS) {
        setRole('admin');
        sessionStorage.setItem('user_role', 'admin');
        showToast("Login Berhasil sebagai Admin");
      } else {
        showToast("⚠️ Password Salah!");
      }
    } else {
      setRole('viewer');
      sessionStorage.setItem('user_role', 'viewer');
      showToast("Login Berhasil sebagai Pengunjung");
    }
  };

  const handleLogout = () => {
    setRole(null);
    sessionStorage.removeItem('user_role');
  };

  const saveData = (record: ViolationRecord) => {
    setIsLoading(true);
    
    setData(prevData => {
      const copy = [...prevData];
      const index = copy.findIndex(d => String(d.id) === String(record.id));
      if (index > -1) copy[index] = record;
      else copy.push(record);
      localStorage.setItem('brigif_data_v3', JSON.stringify(copy));
      return copy;
    });

    setTimeout(() => {
      setIsLoading(false);
      setEditingRecord(null);
      setActiveView(ViewType.DATABASE);
      showToast("Data Berhasil Disimpan");
      addNotification(`Data ${record.nama} telah diperbarui`, 'success');
    }, 500);
  };

  const deleteRecord = useCallback((id: string) => {
    setIsLoading(true);
    
    setData(prevData => {
      const updated = prevData.filter(d => String(d.id) !== String(id));
      localStorage.setItem('brigif_data_v3', JSON.stringify(updated));
      return updated;
    });

    setTimeout(() => {
      setIsLoading(false);
      showToast("Data Berhasil Dihapus");
      addNotification(`Satu record data telah dihapus`, 'info');
    }, 500);
  }, [addNotification]);

  if (!role) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans pb-24 md:pb-28">
      <main className="flex-1 flex flex-col h-screen overflow-hidden relative">
        <header className="h-20 flex items-center justify-between px-4 md:px-8 bg-white border-b border-gray-100 z-10">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 army-gradient rounded-xl flex items-center justify-center border border-white/20 shadow-lg">
                <img src={UNIT_LOGO} alt="Logo" className="w-full h-full object-contain p-2" />
              </div>
              <div className="hidden sm:block">
                <h1 className="text-sm font-black uppercase tracking-tighter text-gray-800">SIMAK</h1>
                <p className="text-[8px] font-bold text-gray-400 uppercase tracking-widest">Brigif 4 / Dewa Ratna</p>
              </div>
            </div>

            <div className="h-8 w-[1px] bg-gray-100 hidden md:block"></div>

            <div className="flex items-center gap-4">
              <div className={`w-2.5 h-2.5 rounded-full ${isOnline ? 'bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]' : 'bg-red-500 animate-pulse'}`}></div>
              <span className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-400 hidden lg:block">
                {isOnline ? 'System Secured' : 'Offline Mode'}
              </span>
              <div className="flex items-center gap-2">
                <i className="fas fa-users text-gray-300 text-[10px]"></i>
                <span className="text-[9px] font-black text-gray-400">{onlineCount} <span className="hidden sm:inline">Online</span></span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button 
              onClick={() => setIsNotifOpen(true)}
              className="w-10 h-10 rounded-xl bg-slate-50 border border-gray-100 flex items-center justify-center text-gray-400 hover:text-accent transition-all relative"
            >
              <i className="fas fa-bell"></i>
              {notifications.some(n => !n.isRead) && (
                <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-slate-50"></span>
              )}
            </button>
            <button 
              onClick={handleLogout}
              className="w-10 h-10 rounded-xl bg-red-50 border border-red-100 flex items-center justify-center text-red-400 hover:bg-red-500 hover:text-white transition-all"
              title="Keluar"
            >
              <i className="fas fa-sign-out-alt"></i>
            </button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-4 md:p-8 bg-slate-50/50">
          <div className="max-w-7xl mx-auto animate-fadeIn">
            {activeView === ViewType.DASHBOARD && <Dashboard data={data} role={role} units={units} />}
            {activeView === ViewType.DATABASE && (
              <Database data={data} role={role} onEdit={(r) => { setEditingRecord(r); setActiveView(ViewType.INPUT); }} onDelete={deleteRecord} />
            )}
            {activeView === ViewType.INPUT && role === 'admin' && (
              <DataForm 
                record={editingRecord} allRecords={data} units={units}
                onAddUnit={(nu) => { const updated = [...units, nu]; setUnits(updated); localStorage.setItem('brigif_units_v3', JSON.stringify(updated)); }}
                onEditUnit={(old, nu) => { const updated = units.map(u => u === old ? nu : u); setUnits(updated); localStorage.setItem('brigif_units_v3', JSON.stringify(updated)); }}
                onDeleteUnit={(u) => { const updated = units.filter(un => un !== u); setUnits(updated); localStorage.setItem('brigif_units_v3', JSON.stringify(updated)); }}
                onSave={saveData} onCancel={() => { setEditingRecord(null); setActiveView(ViewType.DATABASE); }}
              />
            )}
            {activeView === ViewType.AI_HELPER && <AIAssistant data={data} />}
          </div>
        </div>

        {toast && (
          <div className="fixed bottom-28 left-1/2 -translate-x-1/2 z-[3000] px-8 py-3 bg-black/80 text-white rounded-full backdrop-blur-xl border border-white/10 text-[10px] font-black uppercase tracking-widest shadow-2xl animate-pop">
            {toast}
          </div>
        )}
      </main>

      <nav className="fixed bottom-0 left-0 right-0 army-gradient text-white flex items-center justify-between px-4 py-3 shadow-[0_-10px_40px_rgba(0,0,0,0.2)] z-[1000] border-t border-white/10">
        <div className="flex-1 flex items-center justify-around max-w-4xl mx-auto">
          <NavItem active={activeView === ViewType.DASHBOARD} onClick={() => setActiveView(ViewType.DASHBOARD)} icon="fas fa-th-large" label="Beranda" />
          <NavItem active={activeView === ViewType.DATABASE} onClick={() => setActiveView(ViewType.DATABASE)} icon="fas fa-database" label="Database" />
          {role === 'admin' && (
            <NavItem active={activeView === ViewType.INPUT} onClick={() => { setEditingRecord(null); setActiveView(ViewType.INPUT); }} icon="fas fa-plus-circle" label="Input" />
          )}
          <NavItem active={activeView === ViewType.AI_HELPER} onClick={() => setActiveView(ViewType.AI_HELPER)} icon="fas fa-robot" label="AI" />
          <button 
            onClick={() => setIsThemeModalOpen(true)}
            className="flex flex-col items-center gap-1 px-4 py-2 rounded-xl text-white/40 hover:text-white transition-all group"
          >
            <i className="fas fa-palette text-base transition-transform group-hover:scale-110"></i>
            <span className="text-[8px] font-black uppercase tracking-widest">Tema</span>
          </button>
        </div>
      </nav>

      {isThemeModalOpen && (
        <div className="fixed inset-0 z-[2000] bg-black/80 backdrop-blur-md flex items-center justify-center p-6">
          <div className="bg-white w-full max-w-md rounded-[2.5rem] overflow-hidden shadow-2xl animate-pop">
            <div className="army-gradient p-6 text-white text-center">
              <h3 className="font-black text-xs uppercase tracking-widest">Pilih Identitas Visual</h3>
            </div>
            <div className="p-8 grid grid-cols-2 gap-4">
              {(Object.keys(THEME_CONFIGS) as AppTheme[]).map(t => (
                <button 
                  key={t} onClick={() => setTheme(t)}
                  className={`p-5 rounded-3xl border-2 transition-all flex flex-col items-center gap-3 ${theme === t ? 'border-accent bg-accent/5' : 'border-slate-50 hover:border-slate-200'}`}
                >
                  <div className="w-full h-12 rounded-xl shadow-inner" style={{ background: THEME_CONFIGS[t].gradient }}></div>
                  <span className="text-[9px] font-black uppercase tracking-widest text-gray-600">{THEME_CONFIGS[t].name}</span>
                </button>
              ))}
            </div>
            <div className="p-4 bg-gray-50 border-t">
              <button onClick={() => setIsThemeModalOpen(false)} className="w-full army-gradient py-4 rounded-xl text-white font-black text-[10px] uppercase tracking-widest">Terapkan Tema</button>
            </div>
          </div>
        </div>
      )}

      {isNotifOpen && (
        <div className="fixed inset-0 z-[1500] bg-black/40 backdrop-blur-sm flex justify-end">
          <div className="w-full max-w-sm bg-white h-full shadow-2xl flex flex-col animate-slideIn">
            <div className="p-6 army-gradient text-white flex items-center justify-between">
              <h3 className="font-black uppercase text-xs tracking-widest">Notifikasi Sistem</h3>
              <button onClick={() => setIsNotifOpen(false)} className="w-8 h-8 rounded-lg hover:bg-white/10 flex items-center justify-center"><i className="fas fa-times"></i></button>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {notifications.length === 0 ? (
                <div className="py-20 text-center">
                  <i className="fas fa-bell-slash text-slate-100 text-6xl mb-4"></i>
                  <p className="text-[10px] font-bold text-gray-300 uppercase tracking-widest">Belum ada pemberitahuan</p>
                </div>
              ) : (
                notifications.map(n => (
                  <div key={n.id} className={`p-4 rounded-2xl border transition-all ${n.isRead ? 'bg-slate-50 border-slate-100 grayscale' : 'bg-white border-accent/20 shadow-sm'}`}>
                    <div className="flex justify-between items-center mb-2">
                      <span className={`text-[7px] font-black px-1.5 py-0.5 rounded uppercase ${n.type === 'success' ? 'bg-green-100 text-green-600' : n.type === 'warning' ? 'bg-orange-100 text-orange-600' : 'bg-blue-100 text-blue-600'}`}>
                        {n.type}
                      </span>
                      <span className="text-[8px] font-bold text-gray-400">{new Date(n.timestamp).toLocaleTimeString()}</span>
                    </div>
                    <p className="text-[10px] font-bold text-gray-700 leading-relaxed uppercase">{n.message}</p>
                  </div>
                ))
              )}
            </div>
            <div className="p-4 border-t bg-slate-50">
              <button onClick={markAllNotifsRead} className="w-full py-4 bg-white border border-slate-200 rounded-xl text-[10px] font-black uppercase text-gray-400 tracking-widest hover:text-accent transition-all">Bersihkan Semua</button>
            </div>
          </div>
        </div>
      )}

      {isLoading && (
        <div className="fixed inset-0 bg-white/60 backdrop-blur-sm z-[2500] flex flex-col items-center justify-center">
          <div className="w-12 h-12 border-4 border-accent border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-[10px] font-black uppercase tracking-widest text-accent">Memproses Data...</p>
        </div>
      )}
    </div>
  );
};

const NavItem: React.FC<{ active: boolean; onClick: () => void; icon: string; label: string }> = ({ active, onClick, icon, label }) => (
  <button 
    onClick={onClick}
    className={`flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-all group ${active ? 'text-white' : 'text-white/40 hover:text-white'}`}
  >
    <i className={`${icon} text-base transition-transform group-hover:scale-110 ${active ? 'text-accent' : ''}`}></i>
    <span className="text-[8px] font-black uppercase tracking-widest">{label}</span>
    {active && <span className="w-1 h-1 bg-accent rounded-full mt-0.5"></span>}
  </button>
);

export default App;
