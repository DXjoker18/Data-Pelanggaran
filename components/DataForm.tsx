
import React, { useState, useEffect } from 'react';
import { ViolationRecord } from '../types';
import { PERKARA_LIST, PANGKAT_LIST, TINDAKAN_LIST } from '../constants';

interface DataFormProps {
  record: ViolationRecord | null;
  units: string[];
  allRecords: ViolationRecord[];
  onAddUnit: (newUnit: string) => void;
  onEditUnit: (oldName: string, newName: string) => void;
  onDeleteUnit: (unitName: string) => void;
  onSave: (record: ViolationRecord) => void;
  onCancel: () => void;
}

const DataForm: React.FC<DataFormProps> = ({ 
  record, 
  units, 
  allRecords,
  onAddUnit, 
  onEditUnit, 
  onDeleteUnit, 
  onSave, 
  onCancel 
}) => {
  const [formData, setFormData] = useState<Partial<ViolationRecord>>({
    id: '',
    nama: '',
    pangkat: PANGKAT_LIST[0],
    nrp: '',
    satuan: units[0] || '',
    jabatan: '',
    perkara: PERKARA_LIST[0],
    pasal: '',
    tanggal: new Date().toISOString().split('T')[0],
    status: 'Proses Hukum',
    ketTindakan: TINDAKAN_LIST[0],
    kronologis: ''
  });

  const [isManagingUnits, setIsManagingUnits] = useState(false);
  const [newUnitName, setNewUnitName] = useState('');
  const [editingUnitIndex, setEditingUnitIndex] = useState<number | null>(null);
  const [editUnitValue, setEditUnitValue] = useState('');
  const [nrpError, setNrpError] = useState(false);

  useEffect(() => {
    if (record) {
      setFormData(record);
    }
  }, [record]);

  useEffect(() => {
    if (!formData.satuan && units.length > 0) {
      setFormData(prev => ({ ...prev, satuan: units[0] }));
    }
  }, [units, formData.satuan]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Final check for NRP
    if (!/^\d+$/.test(formData.nrp || '')) {
      setNrpError(true);
      return;
    }

    const id = formData.id || Date.now().toString();
    const finalData = { ...formData };
    if (finalData.status === 'Selesai') {
      delete finalData.ketTindakan;
    }
    onSave({ ...finalData, id } as ViolationRecord);
  };

  const handleCreateUnit = () => {
    if (newUnitName.trim()) {
      onAddUnit(newUnitName.trim());
      setFormData(prev => ({ ...prev, satuan: newUnitName.trim() }));
      setNewUnitName('');
    }
  };

  const startEditUnit = (index: number, name: string) => {
    setEditingUnitIndex(index);
    setEditUnitValue(name);
  };

  const saveEditUnit = (oldName: string) => {
    if (editUnitValue.trim() && editUnitValue !== oldName) {
      onEditUnit(oldName, editUnitValue.trim());
    }
    setEditingUnitIndex(null);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;

    // Real-time NRP validation: only allow numbers
    if (name === 'nrp') {
      if (value !== '' && !/^\d*$/.test(value)) {
        setNrpError(true);
        // Terus tampilkan error sejenak tapi jangan update state jika bukan angka
        setTimeout(() => setNrpError(false), 2000);
        return; 
      }
      setNrpError(false);
    }

    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="max-w-2xl mx-auto pb-8">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-[3rem] shadow-xl border border-gray-100 space-y-6">
        <div className="text-center mb-8">
          <h2 className="text-xl font-black text-gray-900 uppercase tracking-tighter">
            {record ? 'Edit Data' : 'Input Data'}
          </h2>
          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-[0.2em] mt-1">Lengkapi form di bawah</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1 relative">
            <label className="text-[10px] font-black text-gray-400 ml-3 uppercase">Asal Satuan</label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <select 
                  name="satuan"
                  value={formData.satuan}
                  onChange={handleChange}
                  className="w-full bg-slate-50 p-4 rounded-2xl text-xs font-bold border-none outline-none focus:ring-2 focus:ring-accent appearance-none pr-10"
                >
                  {units.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                  <i className="fas fa-chevron-down text-[10px]"></i>
                </div>
              </div>
              <button 
                type="button"
                onClick={() => setIsManagingUnits(true)}
                className="w-12 h-12 bg-slate-800 text-white rounded-2xl flex items-center justify-center shadow-md active:scale-90 transition-all"
              >
                <i className="fas fa-cog text-xs"></i>
              </button>
            </div>
          </div>

          <FormSelect label="Jenis Perkara" name="perkara" value={formData.perkara} options={PERKARA_LIST} onChange={handleChange} />
        </div>

        <div className="space-y-1">
          <FormInput 
            label="Pasal / Dasar Hukum yang Dilanggar" 
            name="pasal" 
            placeholder="Contoh: Pasal 87 KUHPM, Pasal 45 UU ITE, dsb..." 
            value={formData.pasal} 
            onChange={handleChange} 
            required 
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormInput label="Nama Lengkap" name="nama" placeholder="Nama..." value={formData.nama} onChange={handleChange} required />
          <FormSelect label="Pangkat" name="pangkat" value={formData.pangkat} options={PANGKAT_LIST} onChange={handleChange} />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="relative">
            <FormInput 
              label="NRP" 
              name="nrp" 
              placeholder="Hanya angka..." 
              value={formData.nrp} 
              onChange={handleChange} 
              required 
              className={nrpError ? 'ring-2 ring-red-500' : ''}
            />
            {nrpError && (
              <span className="absolute -bottom-4 left-3 text-[8px] font-bold text-red-500 uppercase tracking-tighter animate-pulse">
                Input harus berupa angka!
              </span>
            )}
          </div>
          <FormInput label="Jabatan" name="jabatan" placeholder="Jabatan..." value={formData.jabatan} onChange={handleChange} required />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormInput label="Tanggal Kejadian" name="tanggal" type="date" value={formData.tanggal} onChange={handleChange} required />
          <FormSelect label="Status" name="status" value={formData.status} options={['Proses Hukum', 'Selesai']} onChange={handleChange} />
        </div>

        {formData.status === 'Proses Hukum' && (
          <div className="animate-fadeIn">
            <FormSelect label="Tindakan" name="ketTindakan" value={formData.ketTindakan || TINDAKAN_LIST[0]} options={TINDAKAN_LIST} onChange={handleChange} />
          </div>
        )}

        <div className="space-y-1">
          <label className="text-[10px] font-black text-gray-400 ml-3 uppercase">Kronologis Singkat</label>
          <textarea 
            name="kronologis"
            value={formData.kronologis}
            onChange={handleChange}
            rows={4}
            required
            placeholder="Jelaskan secara singkat kejadian perkara..."
            className="w-full bg-slate-50 p-4 rounded-2xl text-xs font-bold border-none outline-none focus:ring-2 focus:ring-accent transition-all"
          ></textarea>
        </div>

        <div className="flex gap-4 pt-4">
          <button type="button" onClick={onCancel} className="flex-1 font-black text-gray-400 text-xs uppercase">Batal</button>
          <button type="submit" className="flex-[2] army-gradient py-4 rounded-2xl text-white font-black text-xs uppercase shadow-lg active:scale-95 transition-all">Simpan Data</button>
        </div>
      </form>

      {/* Management Modal */}
      {isManagingUnits && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-[1000] flex items-center justify-center p-6">
          <div className="bg-white w-full max-w-md rounded-[2.5rem] overflow-hidden shadow-2xl animate-pop flex flex-col max-h-[85vh]">
            <div className="army-gradient p-6 text-white text-center">
              <h3 className="font-black text-xs uppercase tracking-widest">Kelola Satuan</h3>
            </div>
            <div className="p-6 overflow-y-auto space-y-4">
              <div className="flex gap-2 bg-slate-50 p-3 rounded-2xl">
                <input 
                  type="text"
                  value={newUnitName}
                  onChange={(e) => setNewUnitName(e.target.value)}
                  className="flex-1 bg-white p-3 rounded-xl text-xs font-bold outline-none"
                  placeholder="Satuan Baru..."
                />
                <button onClick={handleCreateUnit} className="w-12 h-12 army-gradient text-white rounded-xl flex items-center justify-center"><i className="fas fa-plus"></i></button>
              </div>
              <div className="space-y-2">
                {units.map((unit, index) => {
                  const isInUse = allRecords.some(r => r.satuan === unit);
                  return (
                    <div key={index} className="flex items-center gap-2 bg-white p-3 rounded-xl border group">
                      {editingUnitIndex === index ? (
                        <div className="flex-1 flex gap-2">
                          <input autoFocus type="text" value={editUnitValue} onChange={(e) => setEditUnitValue(e.target.value)} className="flex-1 bg-slate-50 p-2 rounded-lg text-xs font-bold border-2 border-accent outline-none" />
                          <button onClick={() => saveEditUnit(unit)} className="text-accent px-2"><i className="fas fa-check"></i></button>
                        </div>
                      ) : (
                        <>
                          <span className="flex-1 text-xs font-bold text-gray-700">{unit}</span>
                          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button onClick={() => startEditUnit(index, unit)} className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center"><i className="fas fa-pencil-alt text-[10px]"></i></button>
                            <button 
                              onClick={() => !isInUse && onDeleteUnit(unit)} 
                              disabled={isInUse}
                              title={isInUse ? "Satuan masih digunakan dalam database" : "Hapus Satuan"}
                              className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${
                                isInUse 
                                ? 'bg-gray-100 text-gray-300 cursor-not-allowed' 
                                : 'bg-red-50 text-red-600 hover:bg-red-100'
                              }`}
                            >
                              <i className="fas fa-trash-alt text-[10px]"></i>
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="p-4 bg-gray-50 border-t">
              <button onClick={() => setIsManagingUnits(false)} className="w-full bg-white py-4 rounded-xl text-gray-400 font-black text-[10px] uppercase border">Selesai</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

interface FormInputProps {
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
  value?: string;
  required?: boolean;
  className?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const FormInput: React.FC<FormInputProps> = ({ label, name, type = 'text', placeholder, value, required, className = '', onChange }) => (
  <div className="space-y-1">
    <label className="text-[10px] font-black text-gray-400 ml-3 uppercase">{label}</label>
    <input 
      type={type} 
      name={name}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      required={required}
      className={`w-full bg-slate-50 p-4 rounded-2xl text-xs font-bold border-none outline-none focus:ring-2 focus:ring-accent transition-all placeholder:text-gray-300 ${className}`}
    />
  </div>
);

interface FormSelectProps {
  label: string;
  name: string;
  value?: string;
  options: string[];
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

const FormSelect: React.FC<FormSelectProps> = ({ label, name, value, options, onChange }) => (
  <div className="space-y-1">
    <label className="text-[10px] font-black text-gray-400 ml-3 uppercase">{label}</label>
    <div className="relative">
      <select 
        name={name}
        value={value}
        onChange={onChange}
        className="w-full bg-slate-50 p-4 rounded-2xl text-xs font-bold border-none outline-none focus:ring-2 focus:ring-accent appearance-none pr-10"
      >
        {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
      </select>
      <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
        <i className="fas fa-chevron-down text-[10px]"></i>
      </div>
    </div>
  </div>
);

export default DataForm;
