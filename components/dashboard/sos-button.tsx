"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Heart, Car, Flame, ShieldAlert, HelpCircle, Wind, X,
    Baby, Zap, Building2, Scale, PawPrint,
    Waves, Utensils, Users, CheckCircle2,
    Phone, Copy, Check, Brain, FileText
} from "lucide-react";
import api from "../../lib/api";
import { useAuth } from "../../context/AuthContext";
import { getSocket } from "../../lib/socket";

const DETAIL_TYPES = ['Medical', 'Car Problem', 'General Help', 'Mental Health Crisis', 'Legal Emergency'];

const SOS_TYPES = [
    { id: 'Medical', label: 'Medical', icon: Heart, color: 'bg-[#FF3B30]/15 border-[#FF3B30]/40 text-[#FF3B30]' },
    { id: 'Mental Health Crisis', label: 'Mental Health', icon: Users, color: 'bg-violet-500/15 border-violet-500/40 text-violet-400' },
    { id: 'Fire', label: 'Fire', icon: Flame, color: 'bg-orange-500/15 border-orange-500/40 text-orange-400' },
    { id: 'Flood / Water', label: 'Flood/Water', icon: Waves, color: 'bg-blue-500/15 border-blue-500/40 text-blue-400' },
    { id: 'Car Problem', label: 'Car Problem', icon: Car, color: 'bg-amber-500/15 border-amber-500/40 text-amber-400' },
    { id: 'Gas Leak', label: 'Gas Leak', icon: Wind, color: 'bg-yellow-500/15 border-yellow-400/40 text-yellow-400' },
    { id: 'Electrical', label: 'Electrical', icon: Zap, color: 'bg-yellow-400/15 border-yellow-400/40 text-yellow-300' },
    { id: 'Structural Collapse', label: 'Collapse', icon: Building2, color: 'bg-stone-500/15 border-stone-500/40 text-stone-400' },
    { id: 'Child in Danger', label: 'Child Danger', icon: Baby, color: 'bg-pink-500/15 border-pink-500/40 text-pink-400' },
    { id: 'Pet Rescue', label: 'Pet Rescue', icon: PawPrint, color: 'bg-lime-500/15 border-lime-500/40 text-lime-400' },
    { id: 'Food / Shelter', label: 'Food/Shelter', icon: Utensils, color: 'bg-green-500/15 border-green-500/40 text-green-400' },
    { id: 'Threat to Safety', label: 'Threat', icon: ShieldAlert, color: 'bg-purple-500/15 border-purple-500/40 text-purple-400' },
    { id: 'Legal Emergency', label: 'Legal Aid', icon: Scale, color: 'bg-indigo-500/15 border-indigo-500/40 text-indigo-400' },
    { id: 'Elderly Care', label: 'Elderly', icon: Heart, color: 'bg-rose-500/15 border-rose-500/40 text-rose-400' },
    { id: 'General Help', label: 'General Help', icon: HelpCircle, color: 'bg-gray-500/15 border-gray-500/40 text-gray-400' },
];

export default function SOSButton() {
    const { user } = useAuth();
    const [isOpen, setIsOpen] = useState(false);
    const [step, setStep] = useState<'initial' | 'details' | 'guidance'>('initial');
    const [selectedType, setSelectedType] = useState('');
    const [details, setDetails] = useState('');
    const [carMake, setCarMake] = useState('');
    const [carModel, setCarModel] = useState('');
    const [carPlate, setCarPlate] = useState('');
    const [loading, setLoading] = useState(false);
    const [aiLoading, setAiLoading] = useState(true);
    const [guidance, setGuidance] = useState<string[]>([]);
    const [callScript, setCallScript] = useState('');
    const [copied, setCopied] = useState(false);
    const [activeTab, setActiveTab] = useState<'guidance' | 'script'>('guidance');
    const [activeSOSId, setActiveSOSId] = useState<string | null>(null);
    const [resolving, setResolving] = useState(false);

    // Initial check for active SOS
    useEffect(() => {
        const checkActive = async () => {
            try {
                const { data } = await api.get('/sos/me/active');
                if (data && data.id) {
                    setActiveSOSId(data.id);
                    setStep('guidance');
                    // Ensure the modal isn't stuck loading since there's no backend AI event anymore
                    setGuidance(data.first_response_guidance ?
                        data.first_response_guidance.split('\n').filter((l: string) => l.trim().length > 0)
                        : HARDCODED_GUIDANCE[data.type] || GENERIC_GUIDANCE);

                    if (data.call_script) setCallScript(data.call_script);
                    else setCallScript(generateCallScript(data.type, data.modal_data));

                    setSelectedType(data.type);
                    setAiLoading(false);
                }
            } catch (err) {
                console.error("Failed to check active SOS:", err);
            }
        };
        checkActive();
    }, []);

    // Listen for responder joining to auto-close the modal and show the chat
    useEffect(() => {
        if (!activeSOSId) return;
        let currentSocket: any = null;

        const onResponderJoined = (data: any) => {
            // Check if this relates to the active SOS (mutual payload has generic _id or sosId)
            const idToCheck = data?.sosId || data?._id || data?.sos?.id;
            if (idToCheck && idToCheck !== activeSOSId) return;

            // Auto-close modal — the DashboardPage handles rendering the mutual chat view
            setIsOpen(false);
        };

        const checkSocket = setInterval(() => {
            const sock = getSocket();
            if (sock && !currentSocket) {
                currentSocket = sock;
                currentSocket.on('response:mutual_open', onResponderJoined);
                currentSocket.on('sos:responder_joined', onResponderJoined);
                clearInterval(checkSocket);
            }
        }, 500);

        return () => {
            clearInterval(checkSocket);
            if (currentSocket) {
                currentSocket.off('response:mutual_open', onResponderJoined);
                currentSocket.off('sos:responder_joined', onResponderJoined);
            }
        };
    }, [activeSOSId]);

    const resetAll = () => {
        setStep('initial'); setSelectedType(''); setDetails('');
        setCarMake(''); setCarModel(''); setCarPlate('');
        setGuidance([]); setCallScript(''); setAiLoading(true); setActiveTab('guidance');
        setActiveSOSId(null);
    };
    const handleOpen = () => {
        if (activeSOSId) {
            setStep('guidance');
            setIsOpen(true);
        } else {
            resetAll();
            setIsOpen(true);
        }
    };
    const handleClose = () => { setIsOpen(false); if (!activeSOSId) resetAll(); };

    // ─── HARDCODED GUIDANCE ENGINE ────────────────────────────
    const HARDCODED_GUIDANCE: Record<string, string[]> = {
        'Medical': [
            '1. Stay calm and keep the person still.',
            '2. Apply firm pressure to any bleeding wounds.',
            '3. If unconscious and not breathing, begin CPR.',
            '4. Do not move them if spinal injury is suspected.',
            '5. Keep them warm and reassure them until help arrives.'
        ],
        'Car Problem': [
            '1. Move vehicle to the left shoulder immediately.',
            '2. Turn on hazard warning lights.',
            '3. Place a warning triangle 50m behind if safe.',
            '4. Stay inside the vehicle if on a busy highway.',
            '5. Do not stand between your vehicle and moving traffic.'
        ],
        'Fire': [
            '1. Evacuate immediately — do not stop for belongings.',
            '2. Stay low to the ground where air is cleaner.',
            '3. Close doors behind you to slow fire spread.',
            '4. Do not use elevators — use stairs only.',
            '5. Once outside, move far away and do not re-enter.'
        ],
        'Gas Leak': [
            '1. Do NOT switch on or off any lights/switches.',
            '2. Do NOT use your phone inside — move outside.',
            '3. Open all windows and doors immediately.',
            '4. Turn off the gas cylinder valve if reachable.',
            '5. Evacuate everyone from the building.'
        ]
    };
    const GENERIC_GUIDANCE = [
        '1. Stay calm and assess your immediate surroundings.',
        '2. Move to a safe, sheltered location if possible.',
        '3. Notify a trusted contact of your exact location.',
        '4. Community responders are being notified right now.',
        '5. Keep your phone charged and stay where you are.'
    ];

    const generateCallScript = (type: string, data: any) => {
        const name = user?.name || 'a NearHelp user';
        return `I am reporting a ${type.toLowerCase()} emergency. My name is ${name}. I have triggered a community SOS alert and need immediate professional assistance at my location. Please send help.`;
    };
    // ─────────────────────────────────────────────────────────

    const submitSOS = async (type: string, modalData: any = {}) => {
        setLoading(true);

        // Get real GPS before submitting
        let lat = user?.lat;
        let lng = user?.lng;

        if (!lat || !lng) {
            await new Promise((resolve) => {
                navigator.geolocation.getCurrentPosition(
                    (pos) => {
                        lat = pos.coords.latitude;
                        lng = pos.coords.longitude;
                        resolve(null);
                    },
                    () => resolve(null), // silent fail, use stored
                    { enableHighAccuracy: true, timeout: 5000 }
                );
            });
        }

        // Instantly set the hardcoded local AI response so there's zero delay
        setGuidance(HARDCODED_GUIDANCE[type] || GENERIC_GUIDANCE);
        setCallScript(generateCallScript(type, modalData));
        setAiLoading(false); // Never show loading spinner

        try {
            // always send real GPS in request body
            const { data } = await api.post('/sos/create', { type, modalData, lat, lng });
            setActiveSOSId(data.id || data._id || 'temp-id');
            setStep('guidance');
        } catch (err: any) {
            alert(err.response?.data?.message || 'Failed to trigger SOS.');
            handleClose();
        } finally {
            setLoading(false);
        }
    };

    const resolveSOS = async () => {
        if (!activeSOSId) return;
        setResolving(true);
        try {
            await api.post(`/sos/${activeSOSId}/resolve`);
            resetAll();
            setIsOpen(false);
            // Flash success message or trigger a re-fetch of stats if needed
            alert('SOS Resolved. We hope you are safe!');
        } catch (err: any) {
            alert(err.response?.data?.message || 'Failed to resolve SOS.');
        } finally {
            setResolving(false);
        }
    };

    const handleTypeSelect = (type: string) => {
        setSelectedType(type);
        if (DETAIL_TYPES.includes(type)) setStep('details');
        else submitSOS(type);
    };

    const handleDetailsSubmit = () => {
        let modalData: any = { description: details };
        if (selectedType === 'Medical') modalData = { description: details, bloodGroup: user?.bloodGroup };
        else if (selectedType === 'Car Problem') modalData = { make: carMake, model: carModel, plate: carPlate, description: details };
        submitSOS(selectedType, modalData);
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(callScript);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <>
            {/* Floating SOS Button */}
            <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[200]">
                <span className={`absolute inline-flex h-full w-full rounded-full opacity-30 animate-ping ${activeSOSId ? 'bg-amber-500' : 'bg-[#FF3B30]'}`} />
                <motion.button
                    whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}
                    onClick={handleOpen}
                    className={`relative flex h-20 w-20 flex-col items-center justify-center rounded-full border-4 border-white text-lg font-black text-white shadow-2xl transition-colors ${activeSOSId ? 'bg-amber-500' : 'bg-[#FF3B30]'}`}
                >
                    {activeSOSId ? (
                        <>
                            <span className="text-[10px] leading-none mb-0.5 opacity-80 uppercase tracking-tighter">Active</span>
                            <span className="text-sm">Resume</span>
                        </>
                    ) : 'SOS'}
                </motion.button>
            </div>

            <AnimatePresence>
                {isOpen && (
                    <div className="fixed inset-0 z-[300] flex items-end sm:items-center justify-center bg-black/60 p-4">
                        <motion.div
                            initial={{ opacity: 0, y: 40 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 40 }}
                            className="relative w-full max-w-lg overflow-hidden rounded-3xl bg-[#161618] border border-[#2a2a2e] p-7 shadow-2xl"
                        >
                            <button onClick={handleClose} className="absolute right-5 top-5 rounded-full bg-[#1E1E22] p-2 text-[#A0A0A8] hover:text-white transition-colors">
                                <X className="h-4 w-4" />
                            </button>

                            {/* STEP 1 — TYPE GRID */}
                            {step === 'initial' && (
                                <div>
                                    <h2 className="text-xl font-bold text-white mb-1">What's your emergency?</h2>
                                    <p className="text-xs text-[#A0A0A8] mb-5">Skill-matched responders nearby are prioritised automatically.</p>
                                    <div className="grid grid-cols-3 gap-2.5 max-h-[60vh] overflow-y-auto pr-0.5">
                                        {SOS_TYPES.map(({ id, label, icon: Icon, color }) => (
                                            <motion.button
                                                key={id}
                                                whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
                                                onClick={() => handleTypeSelect(id)}
                                                className={`flex flex-col items-center justify-center gap-2 rounded-2xl p-4 border transition-all ${color}`}
                                            >
                                                <Icon className="h-6 w-6" />
                                                <span className="text-xs font-bold text-white text-center leading-tight">{label}</span>
                                            </motion.button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* STEP 2 — DETAILS */}
                            {step === 'details' && (
                                <div>
                                    <h2 className="text-xl font-bold text-white mb-1">{selectedType}</h2>
                                    <p className="text-xs text-[#A0A0A8] mb-5">Add details so responders can prepare.</p>
                                    <div className="space-y-3">
                                        {selectedType === 'Medical' && (
                                            <div>
                                                <label className="text-xs text-[#A0A0A8]">Blood Group (auto-filled)</label>
                                                <input disabled value={user?.bloodGroup || 'Unknown'} className="w-full bg-[#0a0a0a] border border-[#2a2a2e] rounded-xl px-4 py-3 mt-1 text-white/60 text-sm" />
                                            </div>
                                        )}
                                        {selectedType === 'Car Problem' && (
                                            <>
                                                <input placeholder="Car Make" value={carMake} onChange={e => setCarMake(e.target.value)} className="w-full bg-[#0a0a0a] border border-[#2a2a2e] rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#FF3B30]/50" />
                                                <input placeholder="Car Model" value={carModel} onChange={e => setCarModel(e.target.value)} className="w-full bg-[#0a0a0a] border border-[#2a2a2e] rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#FF3B30]/50" />
                                                <input placeholder="License Plate" value={carPlate} onChange={e => setCarPlate(e.target.value)} className="w-full bg-[#0a0a0a] border border-[#2a2a2e] rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#FF3B30]/50" />
                                            </>
                                        )}
                                        <textarea
                                            value={details}
                                            onChange={e => setDetails(e.target.value)}
                                            className="w-full bg-[#0a0a0a] border border-[#2a2a2e] rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#FF3B30]/50 min-h-[80px]"
                                            placeholder="Any additional details..."
                                        />
                                        <button onClick={handleDetailsSubmit} disabled={loading} className="w-full bg-[#FF3B30] hover:bg-[#CC2A20] disabled:opacity-50 text-white font-bold rounded-2xl py-4 transition-colors">
                                            {loading ? 'Broadcasting...' : 'Broadcast SOS Now'}
                                        </button>
                                        <button onClick={() => setStep('initial')} className="w-full text-[#A0A0A8] text-sm py-2 hover:text-white transition-colors">Back</button>
                                    </div>
                                </div>
                            )}

                            {/* STEP 3 — AI GUIDANCE + CALL SCRIPT */}
                            {step === 'guidance' && (
                                <div>
                                    {/* Header */}
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="h-10 w-10 bg-[#34C759]/15 flex items-center justify-center rounded-full shrink-0">
                                            <CheckCircle2 className="h-5 w-5 text-[#34C759]" />
                                        </div>
                                        <div>
                                            <h2 className="text-base font-bold text-[#34C759]">SOS Active — Responders Notified</h2>
                                            <p className="text-xs text-[#A0A0A8]">Skill-matched users nearby have been alerted.</p>
                                        </div>
                                    </div>

                                    {/* Tabs */}
                                    <div className="flex gap-1 bg-[#0a0a0a] rounded-xl p-1 mb-4">
                                        <button
                                            onClick={() => setActiveTab('guidance')}
                                            className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-semibold transition-all ${activeTab === 'guidance' ? 'bg-[#1E1E22] text-white' : 'text-[#A0A0A8] hover:text-white'}`}
                                        >
                                            <Brain className="h-3.5 w-3.5" />
                                            First Response
                                        </button>
                                        <button
                                            onClick={() => setActiveTab('script')}
                                            className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-semibold transition-all ${activeTab === 'script' ? 'bg-[#1E1E22] text-white' : 'text-[#A0A0A8] hover:text-white'}`}
                                        >
                                            <Phone className="h-3.5 w-3.5" />
                                            Call 112 Script
                                        </button>
                                    </div>

                                    {/* Tab: Guidance */}
                                    {activeTab === 'guidance' && (
                                        <div className="bg-[#0a0a0a] rounded-2xl border border-[#2a2a2e] p-4 min-h-[140px]">
                                            {aiLoading ? (
                                                <div className="flex flex-col gap-2 animate-pulse">
                                                    <p className="text-xs text-[#A0A0A8] mb-2">AI is generating guidance...</p>
                                                    {[1, 2, 3, 4, 5].map(i => (
                                                        <div key={i} className="h-3 bg-[#1E1E22] rounded" style={{ width: `${75 + i * 5}%` }} />
                                                    ))}
                                                </div>
                                            ) : (
                                                <div className="space-y-2.5">
                                                    {guidance.map((line, i) => (
                                                        <div key={i} className="flex gap-2.5">
                                                            <span className="text-[#FF3B30] font-black text-sm shrink-0 w-4">{i + 1}.</span>
                                                            <p className="text-sm text-white/85 leading-snug">{line.replace(/^[0-9.•\-]+\s*/, '')}</p>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    {/* Tab: Call Script */}
                                    {activeTab === 'script' && (
                                        <div className="space-y-3">
                                            <p className="text-xs text-[#A0A0A8]">Read this aloud when you call emergency services. Fill in <span className="text-white font-semibold">[CAPS]</span> parts.</p>
                                            <div className="bg-[#0a0a0a] rounded-2xl border border-[#2a2a2e] p-4 min-h-[120px]">
                                                {aiLoading ? (
                                                    <div className="animate-pulse space-y-2">
                                                        {[1, 2, 3].map(i => <div key={i} className="h-3 bg-[#1E1E22] rounded" style={{ width: `${60 + i * 15}%` }} />)}
                                                    </div>
                                                ) : (
                                                    <p className="text-sm text-white leading-relaxed italic">{callScript}</p>
                                                )}
                                            </div>
                                            <button
                                                onClick={handleCopy}
                                                disabled={aiLoading}
                                                className="w-full flex items-center justify-center gap-2 bg-[#1E1E22] border border-[#2a2a2e] hover:bg-[#2a2a2e] disabled:opacity-40 text-white rounded-xl py-3 text-sm font-semibold transition-colors"
                                            >
                                                {copied ? <><Check className="h-4 w-4 text-[#34C759]" /> Copied!</> : <><Copy className="h-4 w-4" /> Copy Script</>}
                                            </button>
                                            <div className="flex gap-2">
                                                <a href="tel:112" className="flex-1 flex items-center justify-center gap-2 bg-[#FF3B30] hover:bg-[#CC2A20] text-white rounded-xl py-2.5 text-sm font-bold transition-colors">
                                                    <Phone className="h-4 w-4" /> Call 112
                                                </a>
                                                <a href="tel:100" className="flex-1 flex items-center justify-center gap-2 bg-[#1E1E22] border border-[#2a2a2e] hover:bg-[#2a2a2e] text-white rounded-xl py-2.5 text-sm font-semibold transition-colors">
                                                    <Phone className="h-4 w-4" /> Call 100
                                                </a>
                                            </div>
                                        </div>
                                    )}

                                    <div className="flex flex-col gap-2 mt-4">
                                        <button onClick={resolveSOS} disabled={resolving} className="w-full bg-[#34C759] hover:bg-[#2ead4e] text-white rounded-2xl py-3 font-bold transition-colors text-sm shadow-lg flex items-center justify-center gap-2">
                                            {resolving ? 'Closing SOS...' : <><CheckCircle2 className="h-4 w-4" /> Resolve & Close SOS</>}
                                        </button>
                                        <button onClick={handleClose} className="w-full bg-white/5 hover:bg-white/10 text-white/50 rounded-2xl py-2 font-semibold transition-colors text-xs">
                                            Keep SOS Active & Close Panel
                                        </button>
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </>
    );
}
