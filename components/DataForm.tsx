
import React, { useState, useEffect } from 'react';
import { ViolationRecord } from '../types';
import { SATUAN_LIST, PERKARA_LIST, PANGKAT_LIST, TINDAKAN_LIST } from '../constants';

interface DataFormProps {
  record: ViolationRecord | null;
  onSave: (record: ViolationRecord) => void;
  onCancel: () => void;
}

const DataForm: React.FC<DataFormProps> = ({ record, onSave, onCancel }) => {
  const [formData, setFormData] = useState<Partial<ViolationRecord>>({
    id: '',
    nama: '',
    pangkat: PANGKAT_LIST[0],
    nrp: '',
    satuan: SATUAN_LIST[0],
    jabatan: '',
    perkara: PERKARA_LIST[0],
    tanggal: new Date().toISOString().split('T')[0],
    status: 'Proses Hukum',
    ketTindakan: TINDAKAN_LIST[0],
    kronologis: ''
  });

  useEffect(() => {
    if (record) {
      setFormData(record);
    }
  }, [record]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const id = formData.id || Date.now().toString();
    // Jika status Selesai, hapus ketTindakan agar data bersih
    const finalData = { ...formData };
    if (finalData.status === 'Selesai') {
      delete finalData.ketTindakan;
    }
    onSave({ ...finalData, id } as ViolationRecord);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="max-w-2xl mx-auto pb-8">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-[3rem] shadow-xl border border-gray-100 space-y-6">
        <div className="text-center mb-8">
          <h2 className="text-xl font-black text-gray-900 uppercase tracking-tighter">
            {record ? 'Edit Data Perkara' : 'Input Data Perkara'}
          </h2>
          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-[0.2em] mt-1">Lengkapi seluruh kolom isian di bawah ini</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormSelect 
            label="Asal Satuan" 
            name="satuan" 
            value={formData.satuan} 
            options={SATUAN_LIST} 
            onChange={handleChange} 
          />
          <FormSelect 
            label="Jenis Perkara" 
            name="perkara" 
            value={formData.perkara} 
            options={PERKARA_LIST} 
            onChange={handleChange} 
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormInput 
            label="Nama Lengkap" 
            name="nama" 
            placeholder="Masukkan Nama Lengkap" 
            value={formData.nama} 
            onChange={handleChange} 
            required 
          />
          <FormSelect 
            label="Pangkat" 
            name="pangkat" 
            value={formData.pangkat} 
            options={PANGKAT_LIST} 
            onChange={handleChange} 
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <FormInput 
            label="NRP" 
            name="nrp" 
            placeholder="Contoh: 31102..." 
            value={formData.nrp} 
            onChange={handleChange} 
            required 
          />
          <FormInput 
            label="Jabatan" 
            name="jabatan" 
            placeholder="Contoh: Danru" 
            value={formData.jabatan} 
            onChange={handleChange} 
            required 
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormInput 
            label="Tanggal Kejadian" 
            name="tanggal" 
            type="date" 
            value={formData.tanggal} 
            onChange={handleChange} 
            required 
          />
          <FormSelect 
            label="Status Saat Ini" 
            name="status" 
            value={formData.status} 
            options={['Proses Hukum', 'Selesai']} 
            onChange={handleChange} 
          />
        </div>

        {formData.status === 'Proses Hukum' && (
          <div className="animate-fadeIn">
            <FormSelect 
              label="Ket Tindakan Saat Ini" 
              name="ketTindakan" 
              value={formData.ketTindakan || TINDAKAN_LIST[0]} 
              options={TINDAKAN_LIST} 
              onChange={handleChange} 
            />
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
            className="w-full bg-slate-50 p-4 rounded-2xl text-xs font-bold border-none outline-none focus:ring-2 focus:ring-green-500 transition-all placeholder:text-gray-300"
            placeholder="Tuliskan detail kejadian, saksi, dan langkah-langkah yang sudah diambil..."
          ></textarea>
        </div>

        <div className="flex gap-4 pt-4">
          <button 
            type="button" 
            onClick={onCancel} 
            className="flex-1 font-black text-gray-400 text-xs uppercase tracking-widest hover:text-red-500 transition-colors"
          >
            Batal
          </button>
          <button 
            type="submit" 
            className="flex-[2] army-gradient py-4 rounded-2xl text-white font-black text-xs uppercase tracking-[0.2em] shadow-lg active:scale-95 transition-all"
          >
            Simpan Data
          </button>
        </div>
      </form>
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
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const FormInput: React.FC<FormInputProps> = ({ label, name, type = 'text', placeholder, value, required, onChange }) => (
  <div className="space-y-1">
    <label className="text-[10px] font-black text-gray-400 ml-3 uppercase">{label}</label>
    <input 
      type={type} 
      name={name}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      required={required}
      className="w-full bg-slate-50 p-4 rounded-2xl text-xs font-bold border-none outline-none focus:ring-2 focus:ring-green-500 transition-all placeholder:text-gray-300"
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
        className="w-full bg-slate-50 p-4 rounded-2xl text-xs font-bold border-none outline-none focus:ring-2 focus:ring-green-500 transition-all appearance-none pr-10"
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
