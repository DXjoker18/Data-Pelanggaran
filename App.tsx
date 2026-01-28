
import React, { useState, useEffect, useCallback } from 'react';
import { UserRole, ViolationRecord, ViewType } from './types';
import { ADMIN_PASS, UNIT_LOGO } from './constants';
import Dashboard from './components/Dashboard';
import Database from './components/Database';
import DataForm from './components/DataForm';
import AIAssistant from './components/AIAssistant';
import Login from './components/Login';

const App: React.FC = () => {
  const [role, setRole] = useState<UserRole | null>(null);
  const [activeView, setActiveView] = useState<ViewType>(ViewType.DASHBOARD);
  const [data, setData] = useState<ViolationRecord[]>([]);
  const [editingRecord, setEditingRecord] = useState<ViolationRecord | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  // Initialize data from localStorage
  useEffect(() => {
    const savedData = localStorage.getItem('brigif_data_v3');
    if (savedData) {
      setData(JSON.parse(savedData));
    }
    const savedRole = sessionStorage.getItem('user_role');
    if (savedRole) {
      setRole(savedRole as UserRole);
    }
  }, []);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const handleLogin = (selectedRole: UserRole, password?: string) => {
    if (selectedRole === 'admin') {
      if (password === ADMIN_PASS) {
        setRole('admin');
        sessionStorage.setItem('user_role', 'admin');
        showToast("Login Berhasil sebagai Admin");
      } else {
        alert("Password Salah!");
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
    setTimeout(() => {
      setData(prevData => {
        const updatedData = [...prevData];
        const index = updatedData.findIndex(d => String(d.id) === String(record.id));
        
        if (index > -1) {
          updatedData[index] = record;
          showToast("Data Berhasil Diperbarui");
        } else {
          updatedData.push(record);
          showToast("Data Berhasil Ditambahkan");
        }
        
        localStorage.setItem('brigif_data_v3', JSON.stringify(updatedData));
        return updatedData;
      });
      
      setIsLoading(false);
      setEditingRecord(null);
      setActiveView(ViewType.DATABASE);
    }, 500);
  };

  const deleteRecord = useCallback((id: string) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus data ini secara permanen?")) {
      setData(prevData => {
        const updatedData = prevData.filter(d => String(d.id) !== String(id));
        localStorage.setItem('brigif_data_v3', JSON.stringify(updatedData));
        return updatedData;
      });
      showToast("Data Berhasil Dihapus");
    }
  }, []);

  const handleEdit = (record: ViolationRecord) => {
    setEditingRecord(record);
    setActiveView(ViewType.INPUT);
  };

  if (!role) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-slate-50 pb-24">
      {/* Header */}
      <header className="army-gradient text-white p-4 shadow-xl sticky top-0 z-50">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center p-1 shadow-md">
              <img src={UNIT_LOGO} alt="Logo" className="w-full h-full object-contain" />
            </div>
            <div>
              <h1 className="text-sm font-black tracking-tight leading-none uppercase">Brigif 4/DR</h1>
              <p className="text-[8px] text-green-400 font-bold tracking-[0.2em] uppercase mt-0.5">
                Role: {role.toUpperCase()}
              </p>
            </div>
          </div>
          <button 
            type="button"
            onClick={handleLogout}
            className="bg-white/10 px-3 py-1.5 rounded-lg flex items-center gap-2 hover:bg-red-500/20 transition-all border border-white/10 active:scale-95"
          >
            <span className="text-[9px] font-bold uppercase tracking-widest">Logout</span>
            <i className="fas fa-power-off text-[10px]"></i>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto p-4 animate-fadeIn">
        {activeView === ViewType.DASHBOARD && <Dashboard data={data} />}
        {activeView === ViewType.DATABASE && (
          <Database 
            data={data} 
            role={role} 
            onEdit={handleEdit} 
            onDelete={deleteRecord}
          />
        )}
        {activeView === ViewType.INPUT && (
          <DataForm 
            record={editingRecord} 
            onSave={saveData} 
            onCancel={() => {
              setEditingRecord(null);
              setActiveView(ViewType.DATABASE);
            }} 
          />
        )}
        {activeView === ViewType.AI_HELPER && <AIAssistant data={data} />}
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-gray-100 px-4 py-3 flex justify-around items-center z-50 shadow-[0_-5px_15px_rgba(0,0,0,0.05)]">
        <NavButton 
          active={activeView === ViewType.DASHBOARD} 
          onClick={() => setActiveView(ViewType.DASHBOARD)} 
          icon="fas fa-house-chimney" 
          label="BERANDA" 
        />
        <NavButton 
          active={activeView === ViewType.DATABASE} 
          onClick={() => setActiveView(ViewType.DATABASE)} 
          icon="fas fa-database" 
          label="DATABASE" 
        />
        <button 
          type="button"
          onClick={() => {
            if (role === 'admin') {
              setEditingRecord(null);
              setActiveView(ViewType.INPUT);
            } else {
              showToast("Akses Terbatas: Hanya Admin");
            }
          }}
          className={`relative group ${role !== 'admin' ? 'opacity-40 grayscale cursor-not-allowed' : ''}`}
        >
          <div className="w-12 h-12 army-gradient rounded-full flex items-center justify-center text-white -mt-10 border-4 border-white shadow-lg active:scale-90 transition-transform">
            <i className="fas fa-plus"></i>
          </div>
          <span className={`text-[8px] font-bold mt-1 block text-center ${activeView === ViewType.INPUT ? 'text-green-600' : 'text-gray-400'}`}>INPUT</span>
        </button>
        <NavButton 
          active={activeView === ViewType.AI_HELPER} 
          onClick={() => setActiveView(ViewType.AI_HELPER)} 
          icon="fas fa-brain" 
          label="AI HUKUM" 
        />
      </nav>

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 px-6 py-2 bg-gray-900 text-white rounded-full text-[10px] font-bold z-[1000] animate-bounce uppercase shadow-2xl">
          {toast}
        </div>
      )}

      {/* Loading Overlay */}
      {isLoading && (
        <div className="fixed inset-0 bg-white/50 backdrop-blur-sm z-[2000] flex flex-col items-center justify-center">
          <div className="w-12 h-12 border-4 border-green-600 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-[10px] font-black uppercase tracking-widest text-gray-500">Memproses Data...</p>
        </div>
      )}
    </div>
  );
};

interface NavButtonProps {
  active: boolean;
  onClick: () => void;
  icon: string;
  label: string;
}

const NavButton: React.FC<NavButtonProps> = ({ active, onClick, icon, label }) => (
  <button type="button" onClick={onClick} className={`flex flex-col items-center gap-1 transition-all ${active ? 'text-green-600 scale-110' : 'text-gray-300 hover:text-gray-400'}`}>
    <i className={`${icon} text-lg`}></i>
    <span className="text-[8px] font-bold uppercase">{label}</span>
  </button>
);

export default App;
