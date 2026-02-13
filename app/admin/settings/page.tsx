'use client';

import { useState } from 'react';
import { Save, UserCog, AlertTriangle, XCircle, X, ShieldCheck, User, Lock } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { signOut } from 'next-auth/react';

// --- TOAST TYPES ---
type ToastType = 'success' | 'error' | 'warning';
interface ToastState {
  show: boolean;
  message: string;
  type: ToastType;
}

export default function AdminSettings() {
  const [formData, setFormData] = useState({ newUsername: '', newPassword: '' });
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<ToastState>({ show: false, message: '', type: 'success' });
  
  const showToast = (message: string, type: ToastType) => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast((prev) => ({ ...prev, show: false }));
    }, 4000);
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation: Ensure at least one field is filled
    if (!formData.newUsername && !formData.newPassword) {
        showToast("Enter a value to update.", "warning");
        return;
    }

    if(!confirm("SECURITY WARNING: Changing credentials will terminate your current session. Continue?")) return;

    setLoading(true);
    
    try {
        const res = await fetch('/api/admin/settings', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData),
        });

        if (res.ok) {
            showToast("Protocol updated. Re-authentication required.", "success");
            setTimeout(() => {
                signOut({ callbackUrl: '/admin/login' });
            }, 2000);
        } else {
            showToast("Update rejected by server.", "error");
            setLoading(false);
        }
    } catch (error) {
        showToast("Connection failed.", "error");
        setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white pt-24 px-6 font-sans flex justify-center relative overflow-hidden">
      <div className="w-full max-w-lg relative z-10">
        
        <div className="mb-8 border-b border-white/10 pb-4">
            <h1 className="text-2xl font-bold flex items-center gap-2">
                <UserCog className="text-cyan-500" /> Admin Settings
            </h1>
            <p className="text-gray-500 text-sm mt-1 font-mono">Update root access credentials.</p>
        </div>

        <form onSubmit={handleUpdate} className="bg-[#0a0a0a] p-8 rounded-xl border border-white/10 space-y-6 shadow-2xl">
            
            <div className="p-4 bg-yellow-900/10 border border-yellow-500/20 rounded flex gap-3 items-start">
                <AlertTriangle className="text-yellow-500 shrink-0" size={18} />
                <div className="space-y-1">
                    <p className="text-xs text-yellow-500 font-bold font-mono">SECURITY WARNING</p>
                    <p className="text-xs text-yellow-500/80 font-mono leading-relaxed">
                        Leave fields blank to keep current values. Updating either field will invalidate your session.
                    </p>
                </div>
            </div>

            {/* Username Field */}
            <div className="space-y-2">
                <label className="text-xs font-mono text-cyan-500 flex items-center gap-2">
                    <User size={12} /> NEW_USERNAME (OPTIONAL)
                </label>
                <input 
                    type="text" 
                    autoComplete="off"
                    placeholder="Leave blank to keep current..."
                    className="w-full bg-black border border-white/10 p-3 rounded text-white focus:border-cyan-500 outline-none transition-colors placeholder:text-gray-700"
                    onChange={(e) => setFormData({...formData, newUsername: e.target.value})}
                />
            </div>

            {/* Password Field */}
            <div className="space-y-2">
                <label className="text-xs font-mono text-cyan-500 flex items-center gap-2">
                    <Lock size={12} /> NEW_PASSPHRASE (OPTIONAL)
                </label>
                <input 
                    type="password" 
                    autoComplete="new-password"
                    minLength={4}
                    placeholder="Leave blank to keep current..."
                    className="w-full bg-black border border-white/10 p-3 rounded text-white focus:border-cyan-500 outline-none transition-colors placeholder:text-gray-700"
                    onChange={(e) => setFormData({...formData, newPassword: e.target.value})}
                />
            </div>

            <button 
                disabled={loading}
                className="w-full bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3 rounded flex items-center justify-center gap-2 transition-all shadow-lg shadow-cyan-900/20"
            >
                {loading ? (
                    <span className="animate-pulse font-mono">ENCRYPTING...</span>
                ) : (
                    <><Save size={18} /> Update Credentials</>
                )}
            </button>
        </form>

      </div>

      {/* --- CUSTOM TOAST NOTIFICATION --- */}
      <div className={`fixed bottom-6 right-6 z-50 transform transition-all duration-500 ease-in-out ${toast.show ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'}`}>
         <div className={`flex items-center gap-3 px-6 py-4 rounded-lg border shadow-2xl backdrop-blur-md min-w-[320px] ${
            toast.type === 'success' ? 'bg-black/90 border-green-500/50 text-green-400' : 
            toast.type === 'warning' ? 'bg-black/90 border-yellow-500/50 text-yellow-400' :
            'bg-black/90 border-red-500/50 text-red-400'
         }`}>
            {toast.type === 'success' ? <ShieldCheck size={24} /> : toast.type === 'warning' ? <AlertTriangle size={24} /> : <XCircle size={24} />}
            <div className="flex flex-col">
                <span className="text-sm font-bold uppercase tracking-wider">
                    {toast.type === 'success' ? 'System Success' : toast.type === 'warning' ? 'Input Required' : 'Access Denied'}
                </span>
                <span className="text-xs text-gray-400 font-mono mt-1">{toast.message}</span>
            </div>
            <button type="button" onClick={() => setToast({...toast, show: false})} className="ml-auto hover:text-white transition-colors">
                <X size={14} />
            </button>
         </div>
      </div>

    </div>
  );
}