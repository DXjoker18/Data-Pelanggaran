
import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI } from '@google/genai';
import { ViolationRecord } from '../types';

interface AIAssistantProps {
  data: ViolationRecord[];
}

const AIAssistant: React.FC<AIAssistantProps> = ({ data }) => {
  const [messages, setMessages] = useState<{ role: 'user' | 'ai'; text: string }[]>([
    { role: 'ai', text: 'Siap! Saya adalah AI Asisten Hukum Brigif 4/DR. Ada yang bisa saya bantu terkait analisis data pelanggaran atau konsultasi aturan militer?' }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!input.trim() || isTyping) return;

    const userMsg = input.trim();
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setInput('');
    setIsTyping(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      // Construct context from existing data
      const dataSummary = data.length > 0 
        ? `Berikut adalah ringkasan data pelanggaran saat ini: ${data.length} kasus total, dengan rincian perkara: ${Array.from(new Set(data.map(d => d.perkara))).join(', ')}.`
        : "Saat ini database masih kosong.";

      const prompt = `
        Anda adalah AI Asisten Hukum untuk Brigade Infanteri 4/Dewa Ratna (Brigif 4/DR) Kodam IV/Diponegoro.
        Tugas Anda:
        1. Menganalisis data pelanggaran hukum di satuan.
        2. Memberikan saran berdasarkan KUHP Militer (KUHPM) atau Peraturan Disiplin Militer (PDM).
        3. Menjawab pertanyaan seputar prosedur hukum di lingkungan TNI AD.
        
        Konteks Satuan: ${dataSummary}
        Pertanyaan User: ${userMsg}
        
        Berikan jawaban yang profesional, tegas (ala militer), namun tetap membantu dan edukatif. Jika berkaitan dengan hukuman, tekankan pada upaya pembinaan dan pencegahan.
      `;

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
      });

      const aiText = response.text || "Mohon maaf, terjadi gangguan pada sistem analisis AI saya.";
      setMessages(prev => [...prev, { role: 'ai', text: aiText }]);
    } catch (err) {
      console.error(err);
      setMessages(prev => [...prev, { role: 'ai', text: "Gagal menghubungkan ke server pusat AI. Pastikan koneksi internet stabil." }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto flex flex-col h-[75vh] bg-white rounded-[2.5rem] shadow-xl border border-gray-100 overflow-hidden">
      <div className="army-gradient p-5 flex items-center gap-3">
        <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center border border-white/20">
          <i className="fas fa-brain text-white"></i>
        </div>
        <div>
          <h2 className="text-white text-xs font-black uppercase tracking-widest">AI Asisten Hukum</h2>
          <p className="text-[8px] text-green-400 font-bold uppercase tracking-widest">Dewa Ratna Intelligence System</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] p-4 rounded-2xl text-[11px] leading-relaxed shadow-sm ${
              msg.role === 'user' 
                ? 'bg-green-600 text-white rounded-tr-none' 
                : 'bg-slate-50 text-gray-700 border border-slate-100 rounded-tl-none'
            }`}>
              {msg.text.split('\n').map((line, idx) => <p key={idx} className="mb-1">{line}</p>)}
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex gap-1">
              <span className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce"></span>
              <span className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce delay-100"></span>
              <span className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce delay-200"></span>
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      <div className="p-4 bg-slate-50 border-t border-gray-100">
        <div className="relative group">
          <input 
            type="text" 
            placeholder="Tanyakan sesuatu..."
            className="w-full pl-6 pr-14 py-4 bg-white rounded-2xl shadow-sm outline-none focus:ring-2 focus:ring-green-500 text-xs font-bold"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          />
          <button 
            onClick={handleSend}
            disabled={isTyping || !input.trim()}
            className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 army-gradient text-white rounded-xl flex items-center justify-center active:scale-90 transition-all disabled:opacity-50"
          >
            <i className="fas fa-paper-plane text-xs"></i>
          </button>
        </div>
        <p className="text-[8px] text-gray-400 text-center mt-3 font-medium">AI dapat membuat kesalahan. Harap verifikasi informasi penting ke Perwira Hukum.</p>
      </div>
    </div>
  );
};

export default AIAssistant;
