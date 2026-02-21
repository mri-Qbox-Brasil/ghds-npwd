import React from 'react';
import { ShieldCheck, Lock, Info, Landmark, HelpCircle, ChevronRight, User } from 'lucide-react';

const BankProfile: React.FC = () => {
    const sections = [
        {
            title: "Segurança e Privacidade",
            items: [
                { icon: ShieldCheck, label: "Proteção de Dados", color: "text-emerald-500", bg: "bg-emerald-500/10" },
                { icon: Lock, label: "Criptografia de Ponta a Ponta", color: "text-blue-500", bg: "bg-blue-500/10" }
            ]
        },
        {
            title: "Informações Legais",
            items: [
                { icon: Landmark, label: "Termos de Uso", color: "text-neutral-500", bg: "bg-neutral-500/10" },
                { icon: Info, label: "Política de Cookies", color: "text-neutral-500", bg: "bg-neutral-500/10" }
            ]
        },
        {
            title: "Suporte",
            items: [
                { icon: HelpCircle, label: "Central de Ajuda", color: "text-indigo-500", bg: "bg-indigo-500/10" }
            ]
        }
    ];

    return (
        <div className="flex flex-col gap-8 pb-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header / User Profile Preview */}
            <header className="flex flex-col items-center gap-4 py-6">
                <div className="relative">
                    <div className="h-24 w-24 rounded-[32px] bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-500 shadow-xl shadow-emerald-500/10">
                        <User size={48} strokeWidth={1.5} />
                    </div>
                    <div className="absolute -bottom-2 -right-2 h-8 w-8 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-800 flex items-center justify-center shadow-lg">
                        <ShieldCheck size={18} className="text-emerald-500" strokeWidth={2.5} />
                    </div>
                </div>

                <div className="flex flex-col items-center gap-1">
                    <h2 className="text-xl font-black text-neutral-900 dark:text-white uppercase tracking-tighter italic leading-none">Minha Conta</h2>
                    <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Verificado pelo Maze Bank</p>
                </div>
            </header>

            {/* Sections */}
            <div className="space-y-8">
                {sections.map((section, idx) => (
                    <div key={idx} className="space-y-3">
                        <h3 className="px-5 text-[11px] font-black uppercase tracking-[0.2em] text-neutral-400 italic">
                            {section.title}
                        </h3>

                        <div className="mx-4 bg-white dark:bg-neutral-900/50 rounded-[28px] border border-neutral-50 dark:border-neutral-800/50 shadow-sm overflow-hidden">
                            {section.items.map((item, itemIdx) => (
                                <button
                                    key={itemIdx}
                                    className="w-full flex items-center justify-between p-4 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-all border-b border-neutral-50 last:border-none dark:border-neutral-800/30 group active:scale-[0.98]"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className={`p-2.5 rounded-2xl ${item.bg} ${item.color} group-hover:scale-110 transition-transform`}>
                                            <item.icon size={20} strokeWidth={2.5} />
                                        </div>
                                        <span className="text-sm font-bold text-neutral-700 dark:text-neutral-200">
                                            {item.label}
                                        </span>
                                    </div>
                                    <ChevronRight size={18} className="text-neutral-300 dark:text-neutral-700 group-hover:text-emerald-500 transition-colors" strokeWidth={3} />
                                </button>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            {/* Footer Note */}
            <footer className="px-8 text-center">
                <p className="text-[9px] font-medium text-neutral-400 leading-relaxed max-w-[200px] mx-auto opacity-50">
                    O Maze Bank utiliza tecnologias de criptografia de nível militar para proteger suas transações.
                </p>
            </footer>
        </div>
    );
};

export default BankProfile;