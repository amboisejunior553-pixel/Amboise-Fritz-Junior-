/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  PieChart, 
  Pie, 
  Cell,
  AreaChart,
  Area
} from 'recharts';
import { 
  Rocket, 
  Palette, 
  Megaphone, 
  Video, 
  CheckCircle, 
  ArrowRight, 
  Upload, 
  CreditCard, 
  Smartphone, 
  Globe, 
  Menu, 
  X, 
  LayoutDashboard, 
  LogOut,
  Star,
  ShieldCheck,
  Clock,
  ChevronRight,
  Plus,
  Users,
  MessageSquare,
  FileText,
  TrendingUp,
  DollarSign,
  Activity,
  Filter,
  Download,
  AlertCircle,
  MoreVertical,
  Send
} from 'lucide-react';
import { SERVICES, UPSELLS, TRANSLATIONS } from './constants';
import { Language, Service, ServicePackage, OrderOption, User, Order, Message } from './types';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

// --- Components ---

const Navbar = ({ user, setUser, lang, setLang, setStep }: { user: User | null, setUser: any, lang: Language, setLang: any, setStep: (s: any) => void }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-black/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => setStep('home')}>
            <div className="w-10 h-10 bg-black rounded-lg flex items-center justify-center text-white font-bold text-xl">N</div>
            <span className="font-bold text-xl tracking-tighter">NEXTLEVEL</span>
          </div>

          <div className="hidden md:flex items-center gap-6">
            <button onClick={() => setStep('home')} className="text-sm font-medium hover:text-black/60 transition-colors">Accueil</button>
            {user && (
              <>
                <button onClick={() => setStep('dashboard')} className="text-sm font-medium hover:text-black/60 transition-colors">Mes Commandes</button>
                {(user.role === 'admin' || user.role === 'employee') && (
                  <button onClick={() => setStep('workspace')} className="text-sm font-medium hover:text-black/60 transition-colors">Workspace</button>
                )}
                {user.role === 'admin' && (
                  <button onClick={() => setStep('admin')} className="text-sm font-medium text-emerald-600 hover:text-emerald-700 transition-colors flex items-center gap-1">
                    <LayoutDashboard size={16} /> Admin
                  </button>
                )}
              </>
            )}
            
            <div className="h-4 w-px bg-black/10 mx-2" />
            
            <select 
              value={lang} 
              onChange={(e) => setLang(e.target.value as Language)}
              className="bg-transparent text-sm font-medium outline-none cursor-pointer"
            >
              <option value="fr">FR</option>
              <option value="en">EN</option>
              <option value="ht">HT</option>
            </select>
            
            {user ? (
              <div className="flex items-center gap-4">
                <div className="flex flex-col items-end">
                  <span className="text-xs font-bold text-black">{user.name}</span>
                  <span className="text-[10px] text-black/40 uppercase tracking-widest">{user.role}</span>
                </div>
                <button 
                  onClick={() => setUser(null)}
                  className="p-2 hover:bg-red-50 text-red-500 rounded-full transition-colors"
                >
                  <LogOut size={18} />
                </button>
              </div>
            ) : (
              <button 
                onClick={() => {
                  // Mock login for demo
                  setUser({ id: 1, name: 'Admin User', email: 'admin@nextlevel.ht', role: 'admin', status: 'active' });
                }}
                className="bg-black text-white px-6 py-2 rounded-full text-sm font-medium hover:bg-black/80 transition-all"
              >
                Login
              </button>
            )}
          </div>

          <div className="md:hidden">
            <button onClick={() => setIsOpen(!isOpen)} className="p-2">
              {isOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

const Hero = ({ onStart, lang }: { onStart: () => void, lang: Language }) => {
  const t = TRANSLATIONS[lang];
  return (
    <section className="pt-32 pb-20 px-4 overflow-hidden">
      <div className="max-w-5xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <span className="inline-block py-1 px-3 rounded-full bg-emerald-100 text-emerald-700 text-xs font-bold tracking-wider uppercase mb-6">
            Digital Agency 🇭🇹 + 🌍
          </span>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-8 leading-[1.1]">
            {t.hero_title}
          </h1>
          <p className="text-xl text-black/60 mb-12 max-w-2xl mx-auto leading-relaxed">
            {t.hero_subtitle}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={onStart}
              className="bg-black text-white px-10 py-5 rounded-2xl text-lg font-bold hover:scale-105 transition-all flex items-center justify-center gap-2 shadow-xl shadow-black/20"
            >
              {t.cta_order} <ArrowRight size={20} />
            </button>
            <button className="bg-white border border-black/10 text-black px-10 py-5 rounded-2xl text-lg font-bold hover:bg-black/5 transition-all">
              Voir Portfolio
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

const ServiceCard = ({ service, onSelect }: { service: Service, onSelect: (s: Service) => void, key?: string }) => (
  <motion.div 
    whileHover={{ y: -5 }}
    className="bg-white p-8 rounded-3xl border border-black/5 shadow-sm hover:shadow-xl transition-all cursor-pointer group"
    onClick={() => onSelect(service)}
  >
    <div className="w-14 h-14 bg-black/5 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-black group-hover:text-white transition-colors">
      {service.id === 'logo' && <Palette size={28} />}
      {service.id === 'flyers' && <Megaphone size={28} />}
      {service.id === 'branding' && <Rocket size={28} />}
      {service.id === 'video' && <Video size={28} />}
    </div>
    <h3 className="text-2xl font-bold mb-2">{service.title}</h3>
    <p className="text-black/50 mb-6">{service.description}</p>
    <div className="flex items-center text-black font-bold group-hover:gap-2 transition-all">
      Voir les packs <ChevronRight size={20} />
    </div>
  </motion.div>
);

const PackageCard = ({ pkg, onSelect, selected }: { pkg: ServicePackage, onSelect: (p: ServicePackage) => void, selected: boolean, key?: string }) => (
  <div 
    className={`p-8 rounded-3xl border-2 transition-all cursor-pointer ${selected ? 'border-black bg-black text-white' : 'border-black/5 bg-white hover:border-black/20'}`}
    onClick={() => onSelect(pkg)}
  >
    <h4 className="text-xl font-bold mb-2">{pkg.name}</h4>
    <div className="flex items-baseline gap-2 mb-6">
      <span className="text-3xl font-bold">${pkg.priceUSD}</span>
      <span className={`text-sm ${selected ? 'text-white/60' : 'text-black/40'}`}>/ {pkg.priceHTG} HTG</span>
    </div>
    <ul className="space-y-3">
      {pkg.features.map((f, i) => (
        <li key={i} className="flex items-center gap-2 text-sm">
          <CheckCircle size={16} className={selected ? 'text-emerald-400' : 'text-emerald-500'} />
          {f}
        </li>
      ))}
    </ul>
  </div>
);

// --- Main App ---

export default function App() {
  const [lang, setLang] = useState<Language>('fr');
  const [user, setUser] = useState<User | null>(null);
  const [step, setStep] = useState<'home' | 'service' | 'package' | 'options' | 'brief' | 'payment' | 'confirmation' | 'dashboard' | 'workspace' | 'admin'>('home');
  
  // Admin & Workspace State
  const [adminStats, setAdminStats] = useState<any>(null);
  const [allOrders, setAllOrders] = useState<Order[]>([]);
  const [employees, setEmployees] = useState<User[]>([]);
  const [auditLogs, setAuditLogs] = useState<any[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');

  // Selection State (Funnel)
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [selectedPackage, setSelectedPackage] = useState<ServicePackage | null>(null);
  const [selectedOptions, setSelectedOptions] = useState<OrderOption[]>([]);
  const [brief, setBrief] = useState({ 
    companyName: '', 
    slogan: '', 
    colors: '', 
    style: 'moderne', 
    description: '',
    references: [] as string[] 
  });
  const [paymentMethod, setPaymentMethod] = useState<'moncash' | 'natcash' | 'stripe' | null>(null);
  const [paymentId, setPaymentId] = useState('');
  const [paymentProof, setPaymentProof] = useState<string | null>(null);

  const t = TRANSLATIONS[lang];

  useEffect(() => {
    if (step === 'admin' || step === 'workspace') {
      fetch('/api/admin/stats/advanced').then(res => res.json()).then(setAdminStats);
      fetch('/api/orders').then(res => res.json()).then(setAllOrders);
      fetch('/api/workspace/employees').then(res => res.json()).then(setEmployees);
      if (step === 'admin') {
        fetch('/api/admin/audit-logs').then(res => res.json()).then(setAuditLogs);
      }
    }
  }, [step]);

  useEffect(() => {
    if (selectedOrder) {
      fetch(`/api/orders/${selectedOrder.id}/messages`).then(res => res.json()).then(setMessages);
    }
  }, [selectedOrder]);

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedOrder || !user) return;
    const res = await fetch(`/api/orders/${selectedOrder.id}/messages`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sender_id: user.id, content: newMessage })
    });
    if (res.ok) {
      setNewMessage('');
      fetch(`/api/orders/${selectedOrder.id}/messages`).then(res => res.json()).then(setMessages);
    }
  };

  const updateOrderStatus = async (orderId: number, status: string) => {
    await fetch(`/api/orders/${orderId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    });
    fetch('/api/orders').then(res => res.json()).then(setAllOrders);
  };

  const assignOrder = async (orderId: number, employeeId: number) => {
    await fetch(`/api/orders/${orderId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ assigned_to: employeeId, status: 'production' })
    });
    fetch('/api/orders').then(res => res.json()).then(setAllOrders);
  };

  const handleOptionToggle = (opt: OrderOption) => {
    if (selectedOptions.find(o => o.id === opt.id)) {
      setSelectedOptions(selectedOptions.filter(o => o.id !== opt.id));
    } else {
      setSelectedOptions([...selectedOptions, opt]);
    }
  };

  const totalPriceUSD = (selectedPackage?.priceUSD || 0) + selectedOptions.reduce((acc, opt) => acc + opt.priceUSD, 0);
  const totalPriceHTG = (selectedPackage?.priceHTG || 0) + selectedOptions.reduce((acc, opt) => acc + opt.priceHTG, 0);

  const submitOrder = async () => {
    if (!user) {
      alert("Veuillez vous connecter pour passer une commande.");
      return;
    }

    const orderData = {
      user_id: user.id,
      service_id: selectedService?.id,
      package_name: selectedPackage?.name,
      price_usd: totalPriceUSD,
      price_htg: totalPriceHTG,
      options: JSON.stringify(selectedOptions),
      brief: JSON.stringify(brief),
      payment_method: paymentMethod,
      payment_id: paymentId,
      payment_proof: paymentProof,
      status: 'pending_validation',
      priority: selectedOptions.some(opt => opt.id === 'urgent') ? 'urgent' : 'normal'
    };

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData)
      });
      if (res.ok) {
        setStep('confirmation');
      } else {
        alert("Erreur lors de la soumission de la commande.");
      }
    } catch (error) {
      console.error(error);
      alert("Une erreur est survenue.");
    }
  };

  const [userOrders, setUserOrders] = useState<Order[]>([]);
  useEffect(() => {
    if (step === 'dashboard' && user) {
      fetch(`/api/orders/user/${user.id}`).then(res => res.json()).then(setUserOrders);
    }
  }, [step, user]);

  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [authForm, setAuthForm] = useState({ email: '', password: '', name: '' });

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    const endpoint = authMode === 'login' ? '/api/auth/login' : '/api/auth/register';
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(authForm)
    });
    if (res.ok) {
      const userData = await res.json();
      setUser(userData);
      setStep('home');
    } else {
      alert("Erreur d'authentification");
    }
  };

  return (
    <div className="min-h-screen bg-[#F9F9F9] text-black font-sans">
      <Navbar user={user} setUser={setUser} lang={lang} setLang={setLang} setStep={setStep} />

      <main>
        <AnimatePresence mode="wait">
          {step === 'home' && (
            <motion.div key="home" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <Hero onStart={() => setStep('service')} lang={lang} />
              
              {/* Features Section */}
              <section className="py-20 px-4 bg-white">
                <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
                      <ShieldCheck size={32} />
                    </div>
                    <h3 className="text-xl font-bold mb-4">Qualité Premium</h3>
                    <p className="text-black/50">Des designs conçus par des experts pour maximiser votre impact visuel.</p>
                  </div>
                  <div className="text-center">
                    <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
                      <Clock size={32} />
                    </div>
                    <h3 className="text-xl font-bold mb-4">Livraison Rapide</h3>
                    <p className="text-black/50">Respect des délais pour que votre business ne s'arrête jamais.</p>
                  </div>
                  <div className="text-center">
                    <div className="w-16 h-16 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
                      <Smartphone size={32} />
                    </div>
                    <h3 className="text-xl font-bold mb-4">Support Local & Int.</h3>
                    <p className="text-black/50">Paiement MonCash/NatCash ou Carte Bancaire selon votre besoin.</p>
                  </div>
                </div>
              </section>

              {/* Testimonials */}
              <section className="py-20 px-4">
                <div className="max-w-7xl mx-auto">
                  <h2 className="text-4xl font-bold text-center mb-16">Ce que nos clients disent</h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {[1, 2, 3].map(i => (
                      <div key={i} className="bg-white p-8 rounded-3xl border border-black/5 shadow-sm">
                        <div className="flex gap-1 mb-4 text-yellow-400">
                          {[1, 2, 3, 4, 5].map(s => <Star key={s} size={16} fill="currentColor" />)}
                        </div>
                        <p className="italic text-black/70 mb-6">"NextLevel a transformé mon entreprise. Le logo est incroyable et les ventes ont augmenté immédiatement."</p>
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-black/10 rounded-full overflow-hidden">
                            <img src={`https://picsum.photos/seed/${i}/100/100`} alt="client" referrerPolicy="no-referrer" />
                          </div>
                          <div>
                            <p className="font-bold">Jean Pierre</p>
                            <p className="text-xs text-black/40">CEO, TechHaiti 🇭🇹</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            </motion.div>
          )}

          {step === 'service' && (
            <motion.div key="service" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="pt-32 pb-20 px-4">
              <div className="max-w-7xl mx-auto">
                <button onClick={() => setStep('home')} className="mb-8 flex items-center gap-2 text-black/50 hover:text-black transition-colors">
                  <ArrowRight className="rotate-180" size={16} /> Retour
                </button>
                <h2 className="text-4xl font-bold mb-4">{t.step_1}</h2>
                <p className="text-black/50 mb-12">Sélectionnez le type de service dont vous avez besoin.</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {SERVICES.map(s => (
                    <ServiceCard key={s.id} service={s} onSelect={(s) => { setSelectedService(s); setStep('package'); }} />
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {step === 'package' && selectedService && (
            <motion.div key="package" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="pt-32 pb-20 px-4">
              <div className="max-w-7xl mx-auto">
                <button onClick={() => setStep('service')} className="mb-8 flex items-center gap-2 text-black/50 hover:text-black transition-colors">
                  <ArrowRight className="rotate-180" size={16} /> Retour
                </button>
                <h2 className="text-4xl font-bold mb-4">Choisissez votre pack {selectedService.title}</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
                  {selectedService.packages.map(p => (
                    <PackageCard 
                      key={p.id} 
                      pkg={p} 
                      selected={selectedPackage?.id === p.id} 
                      onSelect={(p) => { setSelectedPackage(p); setStep('options'); }} 
                    />
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {step === 'options' && (
            <motion.div key="options" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="pt-32 pb-20 px-4">
              <div className="max-w-3xl mx-auto">
                <button onClick={() => setStep('package')} className="mb-8 flex items-center gap-2 text-black/50 hover:text-black transition-colors">
                  <ArrowRight className="rotate-180" size={16} /> Retour
                </button>
                <h2 className="text-4xl font-bold mb-4">{t.step_2}</h2>
                <p className="text-black/50 mb-12">Boostez votre commande avec ces options supplémentaires.</p>
                
                <div className="space-y-4">
                  {UPSELLS.map(opt => (
                    <div 
                      key={opt.id}
                      onClick={() => handleOptionToggle(opt)}
                      className={`p-6 rounded-2xl border-2 flex justify-between items-center cursor-pointer transition-all ${selectedOptions.find(o => o.id === opt.id) ? 'border-black bg-black/5' : 'border-black/5 bg-white hover:border-black/20'}`}
                    >
                      <div className="flex items-center gap-4">
                        <div className={`w-6 h-6 rounded-md border-2 flex items-center justify-center ${selectedOptions.find(o => o.id === opt.id) ? 'bg-black border-black text-white' : 'border-black/20'}`}>
                          {selectedOptions.find(o => o.id === opt.id) && <CheckCircle size={14} />}
                        </div>
                        <span className="font-bold">{opt.name}</span>
                      </div>
                      <div className="text-right">
                        <p className="font-bold">+${opt.priceUSD}</p>
                        <p className="text-xs text-black/40">+{opt.priceHTG} HTG</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-12 p-8 bg-black text-white rounded-3xl flex justify-between items-center">
                  <div>
                    <p className="text-white/60 text-sm">Total actuel</p>
                    <p className="text-3xl font-bold">${totalPriceUSD} <span className="text-lg font-normal text-white/40">/ {totalPriceHTG} HTG</span></p>
                  </div>
                  <button 
                    onClick={() => setStep('brief')}
                    className="bg-white text-black px-8 py-4 rounded-2xl font-bold hover:scale-105 transition-all"
                  >
                    Continuer
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {step === 'brief' && (
            <motion.div key="brief" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="pt-32 pb-20 px-4">
              <div className="max-w-3xl mx-auto">
                <button onClick={() => setStep('options')} className="mb-8 flex items-center gap-2 text-black/50 hover:text-black transition-colors">
                  <ArrowRight className="rotate-180" size={16} /> Retour
                </button>
                <h2 className="text-4xl font-bold mb-4">{t.step_3}</h2>
                <p className="text-black/50 mb-12">Dites-nous en plus sur votre projet pour un résultat parfait.</p>
                
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs font-bold mb-2 uppercase tracking-widest">Nom de l'entreprise *</label>
                      <input 
                        type="text" 
                        className="w-full p-4 rounded-2xl border border-black/10 focus:border-black outline-none transition-all"
                        placeholder="Ex: NextLevel Agency"
                        value={brief.companyName}
                        onChange={(e) => setBrief({...brief, companyName: e.target.value})}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold mb-2 uppercase tracking-widest">Slogan (Optionnel)</label>
                      <input 
                        type="text" 
                        className="w-full p-4 rounded-2xl border border-black/10 focus:border-black outline-none transition-all"
                        placeholder="Votre phrase d'accroche"
                        value={brief.slogan}
                        onChange={(e) => setBrief({...brief, slogan: e.target.value})}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs font-bold mb-2 uppercase tracking-widest">Couleurs souhaitées</label>
                      <input 
                        type="text" 
                        className="w-full p-4 rounded-2xl border border-black/10 focus:border-black outline-none transition-all"
                        placeholder="Ex: Bleu Royal, Or, Blanc"
                        value={brief.colors}
                        onChange={(e) => setBrief({...brief, colors: e.target.value})}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold mb-2 uppercase tracking-widest">Style visuel</label>
                      <select 
                        className="w-full p-4 rounded-2xl border border-black/10 focus:border-black outline-none transition-all bg-white"
                        value={brief.style}
                        onChange={(e) => setBrief({...brief, style: e.target.value})}
                      >
                        <option value="minimaliste">Minimaliste</option>
                        <option value="luxe">Luxe / Premium</option>
                        <option value="moderne">Moderne</option>
                        <option value="mascotte">Mascotte / Illustré</option>
                        <option value="vintage">Vintage / Rétro</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold mb-2 uppercase tracking-widest">Description du projet *</label>
                    <textarea 
                      className="w-full p-4 rounded-2xl border border-black/10 focus:border-black outline-none transition-all h-32"
                      placeholder="Décrivez votre vision, vos objectifs..."
                      value={brief.description}
                      onChange={(e) => setBrief({...brief, description: e.target.value})}
                    />
                  </div>

                  <div className="p-8 border-2 border-dashed border-black/10 rounded-3xl text-center hover:border-black/30 transition-all cursor-pointer relative">
                    <input 
                      type="file" 
                      multiple
                      className="absolute inset-0 opacity-0 cursor-pointer"
                      onChange={(e) => {
                        // In a real app, handle file upload. For now, just mock.
                        alert("Fichiers sélectionnés ! (Simulation)");
                      }}
                    />
                    <Upload className="mx-auto mb-4 text-black/40" size={40} />
                    <p className="font-bold">Uploader des fichiers de référence</p>
                    <p className="text-sm text-black/40">Images, logos exemples, croquis (PNG, JPG, PDF)</p>
                  </div>
                  
                  <button 
                    onClick={() => {
                      if (!user) setStep('auth');
                      else setStep('payment');
                    }}
                    disabled={!brief.companyName || !brief.description}
                    className="w-full bg-black text-white py-5 rounded-2xl font-bold text-lg hover:bg-black/80 transition-all disabled:opacity-50"
                  >
                    Envoyer la demande
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {step === 'auth' && (
            <motion.div key="auth" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="pt-32 pb-20 px-4">
              <div className="max-w-md mx-auto bg-white p-12 rounded-[3rem] border border-black/5 shadow-2xl">
                <h2 className="text-3xl font-bold mb-2 text-center">{authMode === 'login' ? 'Connexion' : 'Inscription'}</h2>
                <p className="text-black/40 text-center mb-8">Veuillez vous identifier pour continuer.</p>
                
                <form onSubmit={handleAuth} className="space-y-4">
                  {authMode === 'register' && (
                    <div>
                      <label className="block text-xs font-bold mb-2 uppercase tracking-widest">Nom Complet</label>
                      <input 
                        type="text" 
                        required
                        className="w-full p-4 bg-black/5 rounded-2xl outline-none text-sm"
                        placeholder="Jean Dupont"
                        value={authForm.name}
                        onChange={(e) => setAuthForm({...authForm, name: e.target.value})}
                      />
                    </div>
                  )}
                  <div>
                    <label className="block text-xs font-bold mb-2 uppercase tracking-widest">Email</label>
                    <input 
                      type="email" 
                      required
                      className="w-full p-4 bg-black/5 rounded-2xl outline-none text-sm"
                      placeholder="email@exemple.com"
                      value={authForm.email}
                      onChange={(e) => setAuthForm({...authForm, email: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold mb-2 uppercase tracking-widest">Mot de passe</label>
                    <input 
                      type="password" 
                      required
                      className="w-full p-4 bg-black/5 rounded-2xl outline-none text-sm"
                      placeholder="••••••••"
                      value={authForm.password}
                      onChange={(e) => setAuthForm({...authForm, password: e.target.value})}
                    />
                  </div>
                  <button type="submit" className="w-full py-4 bg-black text-white rounded-2xl font-bold hover:bg-black/80 transition-all">
                    {authMode === 'login' ? 'Se connecter' : "S'inscrire"}
                  </button>
                </form>
                
                <div className="mt-8 text-center">
                  <button 
                    onClick={() => setAuthMode(authMode === 'login' ? 'register' : 'login')}
                    className="text-sm font-bold text-black/40 hover:text-black transition-all"
                  >
                    {authMode === 'login' ? "Pas encore de compte ? S'inscrire" : "Déjà un compte ? Se connecter"}
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {step === 'payment' && (
            <motion.div key="payment" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="pt-32 pb-20 px-4">
              <div className="max-w-4xl mx-auto">
                <button onClick={() => setStep('brief')} className="mb-8 flex items-center gap-2 text-black/50 hover:text-black transition-colors">
                  <ArrowRight className="rotate-180" size={16} /> Retour
                </button>
                <h2 className="text-4xl font-bold mb-4">{t.step_4}</h2>
                <p className="text-black/50 mb-12">Choisissez votre mode de paiement sécurisé.</p>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                  <div className="lg:col-span-2 space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {[
                        { id: 'moncash', name: 'MonCash', icon: <Smartphone />, color: 'bg-yellow-400', details: '+509 3662 5690 (AMBOISE FRITZ)' },
                        { id: 'natcash', name: 'NatCash', icon: <Smartphone />, color: 'bg-red-500', details: '+509 3588 0510 (Amboise Fritz Junior)' },
                        { id: 'stripe', name: 'Carte / Stripe', icon: <CreditCard />, color: 'bg-indigo-600', details: 'Paiement International' }
                      ].map(method => (
                        <button 
                          key={method.id}
                          onClick={() => setPaymentMethod(method.id as any)}
                          className={`p-6 rounded-3xl border-2 transition-all text-left relative overflow-hidden group ${
                            paymentMethod === method.id ? 'border-black bg-black text-white' : 'border-black/5 hover:border-black/20'
                          }`}
                        >
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 ${
                            paymentMethod === method.id ? 'bg-white/20' : method.color + ' text-white'
                          }`}>
                            {method.icon}
                          </div>
                          <p className="font-bold">{method.name}</p>
                          <p className={`text-[10px] mt-1 ${paymentMethod === method.id ? 'text-white/60' : 'text-black/40'}`}>
                            {method.details}
                          </p>
                        </button>
                      ))}
                    </div>

                    {paymentMethod && paymentMethod !== 'stripe' && (
                      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-black/5 p-8 rounded-3xl space-y-6">
                        <div className="flex items-start gap-4">
                          <div className="w-8 h-8 bg-black text-white rounded-full flex items-center justify-center flex-shrink-0 font-bold text-sm">1</div>
                          <div>
                            <p className="font-bold mb-1">Effectuez le transfert</p>
                            <p className="text-sm text-black/60">Envoyez le montant total sur le numéro {paymentMethod === 'moncash' ? '3662 5690' : '3588 0510'}.</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-4">
                          <div className="w-8 h-8 bg-black text-white rounded-full flex items-center justify-center flex-shrink-0 font-bold text-sm">2</div>
                          <div className="flex-1">
                            <p className="font-bold mb-1">ID de Transaction</p>
                            <input 
                              type="text" 
                              className="w-full p-4 rounded-xl border border-black/10 focus:border-black outline-none transition-all bg-white"
                              placeholder="Entrez l'ID reçu par SMS"
                              value={paymentId}
                              onChange={(e) => setPaymentId(e.target.value)}
                            />
                          </div>
                        </div>
                        <div className="flex items-start gap-4">
                          <div className="w-8 h-8 bg-black text-white rounded-full flex items-center justify-center flex-shrink-0 font-bold text-sm">3</div>
                          <div className="flex-1">
                            <p className="font-bold mb-3">Preuve de paiement</p>
                            <div className="relative">
                              <input 
                                type="file" 
                                className="absolute inset-0 opacity-0 cursor-pointer"
                                onChange={(e) => {
                                  const file = e.target.files?.[0];
                                  if (file) {
                                    const reader = new FileReader();
                                    reader.onloadend = () => setPaymentProof(reader.result as string);
                                    reader.readAsDataURL(file);
                                  }
                                }}
                              />
                              <div className="p-6 border-2 border-dashed border-black/10 rounded-xl text-center hover:bg-white transition-all">
                                <Upload className="mx-auto mb-2 text-black/40" size={20} />
                                <p className="text-xs font-bold">{paymentProof ? 'Image sélectionnée ✅' : 'Uploader screenshot transfert'}</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {paymentMethod === 'stripe' && (
                      <div className="bg-indigo-50 p-12 rounded-3xl text-center border border-indigo-100">
                        <CreditCard className="mx-auto mb-4 text-indigo-600" size={48} />
                        <h3 className="text-xl font-bold mb-2">Paiement par Carte</h3>
                        <p className="text-indigo-600/60 mb-8">Vous allez être redirigé vers notre interface de paiement sécurisée Stripe.</p>
                        <button className="bg-indigo-600 text-white px-8 py-4 rounded-2xl font-bold hover:bg-indigo-700 transition-all">
                          Payer avec Stripe
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="space-y-6">
                    <div className="bg-white p-8 rounded-3xl border border-black/5 shadow-xl">
                      <h3 className="font-bold text-xl mb-6">Résumé</h3>
                      <div className="space-y-4 mb-8">
                        <div className="flex justify-between text-sm">
                          <span className="text-black/40">{selectedPackage?.name}</span>
                          <span className="font-bold">${selectedPackage?.priceUSD}</span>
                        </div>
                        {selectedOptions.map(opt => (
                          <div key={opt.id} className="flex justify-between text-sm">
                            <span className="text-black/40">{opt.name}</span>
                            <span className="font-bold">+${opt.priceUSD}</span>
                          </div>
                        ))}
                        <div className="pt-4 border-t border-black/5 flex justify-between items-end">
                          <span className="font-bold">Total</span>
                          <div className="text-right">
                            <p className="text-2xl font-black">${totalPriceUSD}</p>
                            <p className="text-xs text-black/40">{totalPriceHTG} HTG</p>
                          </div>
                        </div>
                      </div>
                      <button 
                        onClick={submitOrder}
                        disabled={!paymentMethod || (paymentMethod !== 'stripe' && (!paymentId || !paymentProof))}
                        className="w-full bg-black text-white py-5 rounded-2xl font-bold hover:bg-black/80 transition-all disabled:opacity-50"
                      >
                        Confirmer l’envoi
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {step === 'confirmation' && (
            <motion.div key="confirmation" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="pt-32 pb-20 px-4 text-center">
              <div className="max-w-xl mx-auto bg-white p-12 rounded-[3rem] border border-black/5 shadow-2xl">
                <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-8">
                  <CheckCircle size={48} />
                </div>
                <h2 className="text-4xl font-bold mb-4">Commande Reçue !</h2>
                <p className="text-black/50 mb-12">Votre commande est en cours de traitement. Notre équipe va vérifier votre paiement et commencer le travail immédiatement.</p>
                <div className="space-y-4">
                  <button 
                    onClick={() => setStep('dashboard')}
                    className="w-full bg-black text-white py-4 rounded-2xl font-bold hover:bg-black/80 transition-all"
                  >
                    Suivre ma commande
                  </button>
                  <button 
                    onClick={() => setStep('home')}
                    className="w-full bg-black/5 text-black py-4 rounded-2xl font-bold hover:bg-black/10 transition-all"
                  >
                    Retour à l'accueil
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {step === 'dashboard' && (
            <motion.div key="dashboard" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="pt-32 pb-20 px-4">
              <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-12">
                  <div>
                    <h2 className="text-4xl font-bold">Mes Commandes</h2>
                    <p className="text-black/40">Suivez l'avancement de vos projets en temps réel.</p>
                  </div>
                  <button onClick={() => setStep('service')} className="bg-black text-white px-8 py-3 rounded-full font-bold flex items-center gap-2">
                    <Plus size={20} /> Nouveau Projet
                  </button>
                </div>

                <div className="grid grid-cols-1 gap-6">
                  {userOrders.length === 0 ? (
                    <div className="bg-white p-20 rounded-[2.5rem] border border-black/5 text-center">
                      <div className="w-16 h-16 bg-black/5 rounded-full flex items-center justify-center mx-auto mb-6">
                        <FileText className="text-black/20" size={32} />
                      </div>
                      <h3 className="text-xl font-bold mb-2">Aucune commande trouvée</h3>
                      <p className="text-black/40 mb-8">Vous n'avez pas encore passé de commande.</p>
                      <button onClick={() => setStep('service')} className="bg-black text-white px-8 py-3 rounded-full font-bold">
                        Commencer un projet
                      </button>
                    </div>
                  ) : (
                    userOrders.map(order => (
                      <div key={order.id} className="bg-white p-8 rounded-[2.5rem] border border-black/5 shadow-sm flex flex-col gap-8">
                        <div className="flex flex-col md:flex-row justify-between items-center gap-8">
                          <div className="flex items-center gap-6 flex-1">
                            <div className="w-16 h-16 bg-black rounded-2xl flex items-center justify-center text-white">
                              {order.service_id === 'logo' ? <Palette size={32} /> : 
                               order.service_id === 'flyer' ? <Rocket size={32} /> : 
                               order.service_id === 'branding' ? <ShieldCheck size={32} /> : <Video size={32} />}
                            </div>
                            <div>
                              <h3 className="text-xl font-bold">{order.package_name}</h3>
                              <p className="text-sm text-black/40">Commandé le {new Date(order.created_at).toLocaleDateString()}</p>
                            </div>
                          </div>

                          <div className="flex flex-wrap gap-8 items-center">
                            <div className="text-center">
                              <p className="text-[10px] font-bold uppercase tracking-widest text-black/40 mb-1">Statut</p>
                              <span className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider ${
                                order.status === 'completed' ? 'bg-emerald-100 text-emerald-600' : 
                                order.status === 'production' ? 'bg-blue-100 text-blue-600' : 
                                order.status === 'paid' ? 'bg-emerald-50 text-emerald-500' : 'bg-yellow-100 text-yellow-600'
                              }`}>
                                {order.status === 'pending_validation' ? '🟡 En attente' : 
                                 order.status === 'paid' ? '🟢 Payé' : 
                                 order.status === 'production' ? '🔵 En production' : '✅ Terminé'}
                              </span>
                            </div>
                            <div className="text-center">
                              <p className="text-[10px] font-bold uppercase tracking-widest text-black/40 mb-1">Prix</p>
                              <p className="font-bold">${order.price_usd} / {order.price_htg} HTG</p>
                            </div>
                            <button 
                              onClick={() => {
                                setSelectedOrder(order);
                                setStep('workspace');
                              }}
                              className="bg-black text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 hover:bg-black/80 transition-all"
                            >
                              <MessageSquare size={18} /> Discuter
                            </button>
                          </div>
                        </div>

                        {order.status === 'completed' && order.delivery_files && (
                          <div className="p-6 bg-emerald-50 rounded-3xl border border-emerald-100">
                            <h4 className="text-sm font-bold text-emerald-700 mb-4 flex items-center gap-2">
                              <Download size={18} /> Vos fichiers finaux sont disponibles !
                            </h4>
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                              {JSON.parse(order.delivery_files).map((file: any, idx: number) => (
                                <a 
                                  key={idx} 
                                  href={file.url} 
                                  download 
                                  className="flex items-center justify-between p-4 bg-white rounded-2xl border border-emerald-200 hover:border-emerald-400 transition-all shadow-sm"
                                >
                                  <span className="text-xs font-bold truncate pr-2">{file.name}</span>
                                  <Download size={16} className="text-emerald-600" />
                                </a>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {step === 'workspace' && (
            <motion.div key="workspace" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="pt-24 pb-20 px-4">
              <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-12">
                  <div>
                    <h2 className="text-4xl font-bold">Workspace</h2>
                    <p className="text-black/40">Gérez vos projets et collaborez avec l'équipe.</p>
                  </div>
                  <div className="flex gap-4">
                    <button className="p-3 bg-white border border-black/5 rounded-xl hover:bg-black/5 transition-all">
                      <Filter size={20} />
                    </button>
                    <button className="p-3 bg-white border border-black/5 rounded-xl hover:bg-black/5 transition-all">
                      <Download size={20} />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                  {/* Sidebar: Employees */}
                  <div className="lg:col-span-1 space-y-6">
                    <div className="bg-white p-6 rounded-3xl border border-black/5 shadow-sm">
                      <h3 className="font-bold mb-6 flex items-center gap-2"><Users size={18} /> Équipe</h3>
                      <div className="space-y-4">
                        {employees.map(emp => (
                          <div key={emp.id} className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-black/5 rounded-full flex items-center justify-center font-bold text-xs">
                                {emp.name.split(' ').map(n => n[0]).join('')}
                              </div>
                              <div>
                                <p className="text-sm font-bold">{emp.name}</p>
                                <p className="text-[10px] text-black/40 uppercase tracking-widest">{emp.role}</p>
                              </div>
                            </div>
                            <div className={`w-2 h-2 rounded-full ${emp.status === 'active' ? 'bg-emerald-500' : 'bg-gray-300'}`} />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Main: Orders List */}
                  <div className="lg:col-span-3 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {allOrders.map(order => (
                        <div 
                          key={order.id} 
                          onClick={() => setSelectedOrder(order)}
                          className={`bg-white p-6 rounded-3xl border transition-all cursor-pointer hover:shadow-lg ${selectedOrder?.id === order.id ? 'border-black ring-1 ring-black' : 'border-black/5'}`}
                        >
                          <div className="flex justify-between items-start mb-4">
                            <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                              order.priority === 'urgent' ? 'bg-red-100 text-red-600' : 'bg-black/5 text-black/60'
                            }`}>
                              {order.priority}
                            </span>
                            <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                              order.status === 'completed' ? 'bg-emerald-100 text-emerald-600' : 
                              order.status === 'production' ? 'bg-blue-100 text-blue-600' : 
                              order.status === 'paid' ? 'bg-emerald-50 text-emerald-500' : 'bg-yellow-100 text-yellow-600'
                            }`}>
                              {order.status === 'pending_validation' ? 'En attente' : 
                               order.status === 'paid' ? 'Payé' : 
                               order.status === 'production' ? 'En production' : 'Terminé'}
                            </span>
                          </div>
                          <h4 className="font-bold text-lg mb-1">{order.package_name}</h4>
                          <p className="text-xs text-black/40 mb-4">Client: {order.client_name}</p>
                          
                          <div className="flex justify-between items-center pt-4 border-t border-black/5">
                            <div className="flex items-center gap-2">
                              <div className="w-6 h-6 bg-black/5 rounded-full flex items-center justify-center text-[10px] font-bold">
                                {order.employee_name ? order.employee_name[0] : '?'}
                              </div>
                              <span className="text-[10px] text-black/60">{order.employee_name || 'Non assigné'}</span>
                            </div>
                            <p className="font-bold text-sm">${order.price_usd}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Order Detail Modal / Overlay */}
                {selectedOrder && (
                  <motion.div 
                    initial={{ opacity: 0 }} 
                    animate={{ opacity: 1 }} 
                    className="fixed inset-0 z-[100] bg-black/40 backdrop-blur-sm flex items-center justify-center p-4"
                  >
                    <motion.div 
                      initial={{ scale: 0.9, y: 20 }} 
                      animate={{ scale: 1, y: 0 }} 
                      className="bg-white w-full max-w-5xl h-[80vh] rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col md:flex-row"
                    >
                      {/* Left: Info */}
                      <div className="flex-1 p-8 overflow-y-auto border-r border-black/5">
                        <div className="flex justify-between items-start mb-8">
                          <div>
                            <h3 className="text-2xl font-bold mb-2">{selectedOrder.package_name}</h3>
                            <p className="text-sm text-black/40">ID: #NL-{selectedOrder.id.toString().padStart(4, '0')}</p>
                          </div>
                          <button onClick={() => setSelectedOrder(null)} className="p-2 hover:bg-black/5 rounded-full">
                            <X size={24} />
                          </button>
                        </div>

                        <div className="space-y-8">
                          <section>
                            <h4 className="text-xs font-bold uppercase tracking-widest text-black/40 mb-4">Brief Client</h4>
                            <div className="bg-black/5 p-6 rounded-2xl">
                              <p className="text-sm leading-relaxed">{JSON.parse(selectedOrder.brief).instructions}</p>
                            </div>
                          </section>

                          <section>
                            <h4 className="text-xs font-bold uppercase tracking-widest text-black/40 mb-4">Gestion</h4>
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <label className="block text-[10px] font-bold mb-2 uppercase">Assigner à</label>
                                <select 
                                  className="w-full p-3 bg-black/5 rounded-xl text-sm outline-none"
                                  value={selectedOrder.assigned_to || ''}
                                  onChange={(e) => assignOrder(selectedOrder.id, parseInt(e.target.value))}
                                >
                                  <option value="">Choisir...</option>
                                  {employees.map(emp => <option key={emp.id} value={emp.id}>{emp.name}</option>)}
                                </select>
                              </div>
                              <div>
                                <label className="block text-[10px] font-bold mb-2 uppercase">Statut</label>
                                <select 
                                  className="w-full p-3 bg-black/5 rounded-xl text-sm outline-none"
                                  value={selectedOrder.status}
                                  onChange={(e) => updateOrderStatus(selectedOrder.id, e.target.value)}
                                >
                                  <option value="pending_validation">En attente validation</option>
                                  <option value="paid">Paiement confirmé</option>
                                  <option value="production">En production</option>
                                  <option value="completed">Terminé</option>
                                </select>
                              </div>
                            </div>
                          </section>

                          <section>
                            <h4 className="text-xs font-bold uppercase tracking-widest text-black/40 mb-4">Paiement</h4>
                            <div className="bg-black/5 p-6 rounded-2xl flex justify-between items-center">
                              <div>
                                <p className="text-sm font-bold">{selectedOrder.payment_method?.toUpperCase()} - {selectedOrder.payment_id}</p>
                                <p className="text-[10px] text-black/40">Statut: {selectedOrder.payment_status}</p>
                                {selectedOrder.payment_proof && (
                                  <a href={selectedOrder.payment_proof} target="_blank" rel="noreferrer" className="text-[10px] text-blue-500 underline mt-1 block">
                                    Voir la preuve de paiement
                                  </a>
                                )}
                              </div>
                              {user.role === 'admin' && selectedOrder.payment_status === 'pending' && (
                                <div className="flex gap-2">
                                  <button 
                                    onClick={async () => {
                                      await fetch(`/api/orders/${selectedOrder.id}`, {
                                        method: 'PATCH',
                                        headers: { 'Content-Type': 'application/json' },
                                        body: JSON.stringify({ payment_status: 'confirmed', status: 'paid' })
                                      });
                                      setSelectedOrder({...selectedOrder, payment_status: 'confirmed', status: 'paid'});
                                      fetch('/api/orders').then(res => res.json()).then(setAllOrders);
                                    }}
                                    className="px-4 py-2 bg-emerald-500 text-white rounded-xl text-xs font-bold"
                                  >
                                    Valider
                                  </button>
                                  <button 
                                    onClick={async () => {
                                      await fetch(`/api/orders/${selectedOrder.id}`, {
                                        method: 'PATCH',
                                        headers: { 'Content-Type': 'application/json' },
                                        body: JSON.stringify({ payment_status: 'refused' })
                                      });
                                      setSelectedOrder({...selectedOrder, payment_status: 'refused'});
                                      fetch('/api/orders').then(res => res.json()).then(setAllOrders);
                                    }}
                                    className="px-4 py-2 bg-red-500 text-white rounded-xl text-xs font-bold"
                                  >
                                    Refuser
                                  </button>
                                </div>
                              )}
                            </div>
                          </section>

                          <section>
                            <h4 className="text-xs font-bold uppercase tracking-widest text-black/40 mb-4">Fichiers finaux</h4>
                            <div className="space-y-4">
                              {selectedOrder.delivery_files && JSON.parse(selectedOrder.delivery_files).map((file: any, idx: number) => (
                                <div key={idx} className="flex justify-between items-center p-4 bg-emerald-50 rounded-xl border border-emerald-100">
                                  <div className="flex items-center gap-3">
                                    <FileText className="text-emerald-600" size={18} />
                                    <span className="text-xs font-bold">{file.name}</span>
                                  </div>
                                  <a href={file.url} download className="p-2 hover:bg-emerald-100 rounded-lg text-emerald-600">
                                    <Download size={16} />
                                  </a>
                                </div>
                              ))}
                              
                              {(user.role === 'admin' || user.role === 'employee') && (
                                <div className="p-8 border-2 border-dashed border-black/10 rounded-2xl text-center cursor-pointer hover:bg-black/5 transition-all relative">
                                  <input 
                                    type="file" 
                                    className="absolute inset-0 opacity-0 cursor-pointer"
                                    onChange={async (e) => {
                                      const file = e.target.files?.[0];
                                      if (!file) return;
                                      // Mock upload: in real app, upload to S3/Cloudinary
                                      const mockFile = { name: file.name, url: '#' };
                                      const currentFiles = selectedOrder.delivery_files ? JSON.parse(selectedOrder.delivery_files) : [];
                                      const newFiles = [...currentFiles, mockFile];
                                      
                                      await fetch(`/api/orders/${selectedOrder.id}`, {
                                        method: 'PATCH',
                                        headers: { 'Content-Type': 'application/json' },
                                        body: JSON.stringify({ delivery_files: newFiles, status: 'completed' })
                                      });
                                      setSelectedOrder({...selectedOrder, delivery_files: JSON.stringify(newFiles), status: 'completed'});
                                      fetch('/api/orders').then(res => res.json()).then(setAllOrders);
                                      alert("Fichier livré avec succès !");
                                    }}
                                  />
                                  <Upload className="mx-auto mb-2 text-black/40" size={24} />
                                  <p className="text-xs font-bold">Uploader le livrable final</p>
                                  <p className="text-[10px] text-black/40">PNG, JPG, PDF, AI, PSD, MP4</p>
                                </div>
                              )}
                            </div>
                          </section>
                        </div>
                      </div>

                      {/* Right: Chat */}
                      <div className="w-full md:w-80 bg-black/5 flex flex-col">
                        <div className="p-6 border-b border-black/5 bg-white">
                          <h4 className="font-bold flex items-center gap-2"><MessageSquare size={18} /> Chat Interne</h4>
                        </div>
                        <div className="flex-1 p-6 overflow-y-auto space-y-4">
                          {messages.map(msg => (
                            <div key={msg.id} className={`flex flex-col ${msg.sender_id === user?.id ? 'items-end' : 'items-start'}`}>
                              <span className="text-[8px] font-bold uppercase tracking-widest text-black/40 mb-1">{msg.sender_name}</span>
                              <div className={`p-3 rounded-2xl text-xs max-w-[90%] ${msg.sender_id === user?.id ? 'bg-black text-white rounded-tr-none' : 'bg-white text-black rounded-tl-none'}`}>
                                {msg.content}
                              </div>
                            </div>
                          ))}
                        </div>
                        <div className="p-4 bg-white">
                          <div className="flex gap-2">
                            <input 
                              type="text" 
                              className="flex-1 p-3 bg-black/5 rounded-xl text-xs outline-none"
                              placeholder="Message..."
                              value={newMessage}
                              onChange={(e) => setNewMessage(e.target.value)}
                              onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                            />
                            <button 
                              onClick={sendMessage}
                              className="p-3 bg-black text-white rounded-xl hover:bg-black/80 transition-all"
                            >
                              <Send size={16} />
                            </button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  </motion.div>
                )}
              </div>
            </motion.div>
          )}

          {step === 'admin' && (
            <motion.div key="admin" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="pt-24 pb-20 px-4">
              <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-12">
                  <div>
                    <h2 className="text-4xl font-bold">Admin Dashboard</h2>
                    <p className="text-black/40">Suivi des revenus et KPIs en temps réel.</p>
                  </div>
                  <div className="flex gap-4">
                    <button className="bg-black text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2">
                      <Download size={20} /> Export Report
                    </button>
                  </div>
                </div>
                
                {adminStats && (
                  <>
                    {/* Summary Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
                      <div className="bg-white p-8 rounded-3xl border border-black/5 shadow-sm">
                        <div className="flex justify-between items-start mb-4">
                          <div className="p-3 bg-emerald-100 text-emerald-600 rounded-2xl"><DollarSign size={24} /></div>
                          <span className="text-emerald-500 text-xs font-bold flex items-center gap-1"><TrendingUp size={12} /> +12%</span>
                        </div>
                        <p className="text-black/40 text-xs font-bold uppercase tracking-widest mb-1">Revenue Total</p>
                        <p className="text-3xl font-bold">${adminStats.summary.totalRevenue.usd || 0}</p>
                        <p className="text-[10px] text-black/40 mt-1">{adminStats.summary.totalRevenue.htg || 0} HTG</p>
                      </div>
                      <div className="bg-white p-8 rounded-3xl border border-black/5 shadow-sm">
                        <div className="flex justify-between items-start mb-4">
                          <div className="p-3 bg-blue-100 text-blue-600 rounded-2xl"><FileText size={24} /></div>
                        </div>
                        <p className="text-black/40 text-xs font-bold uppercase tracking-widest mb-1">Commandes</p>
                        <p className="text-3xl font-bold">{adminStats.summary.totalOrders.count}</p>
                        <p className="text-[10px] text-black/40 mt-1">Derniers 30 jours</p>
                      </div>
                      <div className="bg-white p-8 rounded-3xl border border-black/5 shadow-sm">
                        <div className="flex justify-between items-start mb-4">
                          <div className="p-3 bg-purple-100 text-purple-600 rounded-2xl"><Users size={24} /></div>
                        </div>
                        <p className="text-black/40 text-xs font-bold uppercase tracking-widest mb-1">Nouveaux Clients</p>
                        <p className="text-3xl font-bold">{adminStats.summary.newClients.count}</p>
                        <p className="text-[10px] text-black/40 mt-1">Acquisition active</p>
                      </div>
                      <div className="bg-white p-8 rounded-3xl border border-black/5 shadow-sm">
                        <div className="flex justify-between items-start mb-4">
                          <div className="p-3 bg-orange-100 text-orange-600 rounded-2xl"><Activity size={24} /></div>
                        </div>
                        <p className="text-black/40 text-xs font-bold uppercase tracking-widest mb-1">Taux Conversion</p>
                        <p className="text-3xl font-bold">4.2%</p>
                        <p className="text-[10px] text-black/40 mt-1">Visites vs Commandes</p>
                      </div>
                    </div>

                    {/* Charts Row */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
                      <div className="lg:col-span-2 bg-white p-8 rounded-[2.5rem] border border-black/5 shadow-sm">
                        <h3 className="font-bold mb-8 flex items-center gap-2">Revenue (30 jours)</h3>
                        <div className="h-80 w-full">
                          <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={adminStats.revenueOverTime}>
                              <defs>
                                <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.1}/>
                                  <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                                </linearGradient>
                              </defs>
                              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                              <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#999'}} />
                              <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#999'}} />
                              <Tooltip contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.1)'}} />
                              <Area type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorRev)" />
                            </AreaChart>
                          </ResponsiveContainer>
                        </div>
                      </div>
                      <div className="bg-white p-8 rounded-[2.5rem] border border-black/5 shadow-sm">
                        <h3 className="font-bold mb-8 flex items-center gap-2">Revenue par Service</h3>
                        <div className="h-80 w-full">
                          <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                              <Pie
                                data={adminStats.ordersByService}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={80}
                                paddingAngle={5}
                                dataKey="revenue"
                                nameKey="service_id"
                              >
                                {adminStats.ordersByService.map((entry: any, index: number) => (
                                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                              </Pie>
                              <Tooltip />
                            </PieChart>
                          </ResponsiveContainer>
                        </div>
                        <div className="mt-4 space-y-2">
                          {adminStats.ordersByService.map((s: any, i: number) => (
                            <div key={s.service_id} className="flex justify-between items-center text-xs">
                              <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full" style={{backgroundColor: COLORS[i % COLORS.length]}} />
                                <span className="capitalize">{s.service_id}</span>
                              </div>
                              <span className="font-bold">${s.revenue}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Audit Logs */}
                    <div className="bg-white rounded-[2.5rem] border border-black/5 shadow-sm overflow-hidden">
                      <div className="p-8 border-b border-black/5 flex justify-between items-center">
                        <h3 className="font-bold">Journal d'activité (Audit Logs)</h3>
                        <button className="text-xs font-bold text-black/40 hover:text-black transition-all">Voir tout</button>
                      </div>
                      <div className="overflow-x-auto">
                        <table className="w-full text-left">
                          <thead className="bg-black/5 text-[10px] font-bold uppercase tracking-widest">
                            <tr>
                              <th className="px-8 py-4">Utilisateur</th>
                              <th className="px-8 py-4">Action</th>
                              <th className="px-8 py-4">Détails</th>
                              <th className="px-8 py-4">Date</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-black/5">
                            {auditLogs.map(log => (
                              <tr key={log.id} className="text-xs hover:bg-black/5 transition-colors">
                                <td className="px-8 py-4 font-bold">{log.user_name}</td>
                                <td className="px-8 py-4">
                                  <span className="px-2 py-1 bg-black text-white rounded text-[8px] font-bold uppercase">{log.action}</span>
                                </td>
                                <td className="px-8 py-4 text-black/60">{log.details}</td>
                                <td className="px-8 py-4 text-black/40">{new Date(log.created_at).toLocaleString()}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <footer className="bg-white border-t border-black/5 py-20 px-4">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-10 h-10 bg-black rounded-lg flex items-center justify-center text-white font-bold text-xl">N</div>
              <span className="font-bold text-xl tracking-tighter">NEXTLEVEL</span>
            </div>
            <p className="text-black/50 max-w-sm leading-relaxed">
              Transformez votre business en marque puissante avec des designs professionnels qui attirent clients et ventes.
            </p>
          </div>
          <div>
            <h4 className="font-bold mb-6">Services</h4>
            <ul className="space-y-4 text-black/50 text-sm">
              <li>Logo Design</li>
              <li>Flyers & Visuels</li>
              <li>Branding Complet</li>
              <li>Montage Vidéo</li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-6">Contact</h4>
            <ul className="space-y-4 text-black/50 text-sm">
              <li>support@nextlevel.ht</li>
              <li>+509 3662 5690</li>
              <li>Pétion-Ville, Haïti</li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-20 pt-8 border-t border-black/5 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-black/40">
          <p>© 2026 NEXTLEVEL DIGITAL AGENCY. Tous droits réservés.</p>
          <div className="flex gap-8">
            <span>Privacy Policy</span>
            <span>Terms of Service</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
