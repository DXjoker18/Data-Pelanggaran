
import React, { useState } from 'react';
import { UserRole } from '../types';
import { UNIT_LOGO } from '../constants';

interface LoginProps {
  onLogin: (role: UserRole, password?: string) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [password, setPassword] = useState('');
  const [showAdminLogin, setShowAdminLogin] = useState(false);

  return (
    <div className="fixed inset-0 z-[2000] army-gradient flex items-center justify-center p-6 overflow-y-auto">
      <div className="bg-white w-full max-w-sm rounded-[3rem] p-10 shadow-2xl text-center animate-fadeIn border border-white/20">
        <div className="flex flex-col items-center mb-8">
          <div className="w-24 h-24 mb-6 flex items-center justify-center p-2 bg-slate-50 rounded-3xl shadow-inner border border-slate-100">
            <img src={UNIT_LOGO} alt="Logo" className="w-full h-full object-contain" />
          </div>
          <h2 className="text-2xl font-black text-gray-900 mb-1 uppercase tracking-tighter">Sistem Hukum</h2>
          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-[0.4em]">Brigif 4/Dewa Ratna</p>
        </div>
        
        <div className="space-y-4">
          {!showAdminLogin ? (
            <>
              <button 
                onClick={() => onLogin('viewer')}
                className="w-full py-5 bg-slate-50 text-gray-600 rounded-[2rem] font-black text-[10px] uppercase tracking-widest hover:bg-slate-100 active:scale-95 transition-all shadow-sm"
              >
                Masuk Sebagai Pengunjung
              </button>
              <div className="flex items-center gap-4 py-2">
                <div className="flex-1 h-[1px] bg-gray-100"></div>
                <span className="text-[9px] font-bold text-gray-300 uppercase">Akses Terbatas</span>
                <div className="flex-1 h-[1px] bg-gray-100"></div>
              </div>
              <button 
                onClick={() => setShowAdminLogin(true)}
                className="w-full py-5 army-gradient text-white rounded-[2rem] font-black text-[10px] uppercase tracking-widest shadow-xl hover:opacity-90 active:scale-95 transition-all"
              >
                Login Administrator
              </button>
            </>
          ) : (
            <div className="space-y-4 animate-fadeIn">
              <input 
                type="password" 
                placeholder="PASSWORD ADMIN"
                className="w-full p-5 bg-slate-50 border-2 border-transparent rounded-[2rem] outline-none focus:border-green-500 text-center font-black text-sm transition-all"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoFocus
              />
              <div className="flex gap-2">
                <button 
                  onClick={() => setShowAdminLogin(false)}
                  className="flex-1 py-4 bg-gray-100 text-gray-400 rounded-2xl font-black text-[10px] uppercase"
                >
                  Batal
                </button>
                <button 
                  onClick={() => onLogin('admin', password)}
                  className="flex-[2] py-4 army-gradient text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-lg"
                >
                  Verifikasi
                </button>
              </div>
            </div>
          )}
        </div>
        
        <p className="mt-10 text-[8px] text-gray-300 font-bold uppercase tracking-widest">
          Kodam IV/Diponegoro &copy; 2024
        </p>
      </div>
    </div>
  );
};

export default Login;
