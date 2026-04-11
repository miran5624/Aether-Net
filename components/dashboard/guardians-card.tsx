"use client";

import { useState, useEffect } from "react";
import api from "../../lib/api";
import { useAuth } from "../../context/AuthContext";
import { UserPlus, Trash2, Shield, AlertTriangle } from "lucide-react";

export default function GuardiansCard() {
    const { user } = useAuth();
    const [guardians, setGuardians] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [guardianEmail, setGuardianEmail] = useState('');
    const [adding, setAdding] = useState(false);
    const [error, setError] = useState('');

    const fetchGuardians = async () => {
        try {
            const { data } = await api.get('/users/guardians');
            setGuardians(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error("Failed to fetch guardians:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchGuardians(); }, []);

    const addGuardian = async (e: React.FormEvent) => {
        e.preventDefault();
        setAdding(true);
        setError('');
        try {
            await api.post('/users/guardians', { email: guardianEmail });
            setGuardianEmail('');
            alert('Guardian request sent successfully!'); // Simple feedback
            fetchGuardians();
        } catch (err: any) {
            setError(err.response?.data?.message || "Failed to add guardian.");
        } finally {
            setAdding(false);
        }
    };

    const removeGuardian = async (guardianId: string) => {
        try {
            await api.delete(`/users/guardians/${guardianId}`);
            fetchGuardians();
        } catch (err) {
            alert("Failed to remove guardian.");
        }
    };

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <div>
                <h2 className="text-2xl font-bold text-[#161618]">Guardians</h2>
                <p className="text-sm text-gray-500 mt-1">Trusted people who are notified first during your SOS events.</p>
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex gap-3">
                <AlertTriangle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
                <p className="text-sm text-amber-700">Guardians receive priority alerts and can see your real-time location when you trigger an SOS. Add up to 5 trusted contacts.</p>
            </div>

            <form onSubmit={addGuardian} className="flex gap-3">
                <input
                    type="email"
                    value={guardianEmail}
                    onChange={e => setGuardianEmail(e.target.value)}
                    placeholder="Guardian's email address"
                    required
                    className="flex-1 bg-white border border-gray-200 rounded-xl px-4 py-3 text-[#161618] text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#FF3B30]/30"
                />
                <button
                    type="submit"
                    disabled={adding}
                    className="bg-[#161618] text-white px-5 py-3 rounded-xl font-semibold text-sm flex items-center gap-2 hover:bg-black disabled:opacity-50"
                >
                    <UserPlus className="h-4 w-4" />
                    {adding ? 'Adding...' : 'Add'}
                </button>
            </form>

            {error && <p className="text-red-500 text-sm">{error}</p>}

            {loading ? (
                <div className="space-y-3">{[1, 2].map(i => <div key={i} className="h-16 bg-gray-100 rounded-2xl animate-pulse" />)}</div>
            ) : guardians.length === 0 ? (
                <div className="bg-white border border-gray-200 rounded-2xl p-10 text-center text-gray-400">
                    <Shield className="h-8 w-8 mx-auto mb-3 text-gray-300" />
                    <p>No guardians added yet.</p>
                </div>
            ) : (
                <div className="space-y-3">
                    {guardians.map((g: any) => (
                        <div key={g.id || g._id} className="flex items-center justify-between bg-white border border-gray-200 rounded-2xl px-5 py-4">
                            <div className="flex items-center gap-3">
                                <div className="h-9 w-9 bg-[#161618] rounded-full flex items-center justify-center">
                                    <span className="text-white text-xs font-semibold">{g.name?.charAt(0)?.toUpperCase() || '?'}</span>
                                </div>
                                <div>
                                    <p className="text-sm font-semibold text-[#161618]">{g.name}</p>
                                    <p className="text-xs text-gray-400">{g.email}</p>
                                </div>
                            </div>
                            <button onClick={() => removeGuardian(g.id || g._id)} className="text-red-400 hover:text-red-600 p-2 rounded-lg hover:bg-red-50">
                                <Trash2 className="h-4 w-4" />
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
