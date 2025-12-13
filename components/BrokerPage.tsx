import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, UserPlus, ArrowDownCircle, ArrowUpCircle, ShieldCheck, Globe, Trophy, Zap, Smartphone, Landmark, CheckCircle } from 'lucide-react';
import { Broker } from '../types';

interface BrokerPageProps {
  broker: Broker;
}

export const BrokerPage: React.FC<BrokerPageProps> = ({ broker }) => {
  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-10">
      
      {/* Navigation */}
      <div className="px-6 py-6 flex items-center justify-between">
         <Link 
            to="/" 
            className="p-2 -ml-2 text-slate-400 hover:text-slate-900 bg-white rounded-full shadow-sm"
         >
            <ChevronLeft size={20} />
         </Link>
         <div className="text-sm font-bold text-slate-900 tracking-wide">BROKER PROFILE</div>
         <div className="w-9 h-9 opacity-0"></div>
      </div>

      <div className="max-w-xl mx-auto px-6">
        
        {/* Hero Section */}
        <div className="flex flex-col items-center text-center mb-8">
           <div className="w-24 h-24 mb-4 rounded-2xl shadow-sm bg-white p-2">
              <img 
                src={broker.logoUrl} 
                alt={broker.name} 
                className="w-full h-full object-contain rounded-xl"
              />
           </div>
           <h1 className="text-2xl font-bold text-slate-900 mb-2">{broker.name}</h1>
           <p className="text-slate-500 text-sm max-w-xs mx-auto leading-relaxed mb-4">{broker.description}</p>
           
           {/* Trust Badges */}
           <div className="flex gap-2 justify-center">
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-[10px] font-bold uppercase tracking-wider border border-blue-100">
                <Globe size={10} /> Global Broker
              </span>
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-amber-50 text-amber-600 text-[10px] font-bold uppercase tracking-wider border border-amber-100">
                <ShieldCheck size={10} /> FSCA Regulated
              </span>
           </div>
        </div>

        {/* Primary Actions - Matching Screenshot Order & Colors */}
        <div className="space-y-3 mb-10">
          
          {/* Deposit - Orange/Amber */}
          <Link
             to={`/${broker.id}/deposit`}
             className="flex items-center justify-center w-full py-4 bg-[#F59E0B] hover:bg-[#D97706] text-white rounded-2xl shadow-lg shadow-orange-100 transition-all transform active:scale-[0.98]"
          >
             <div className="flex items-center gap-2 font-bold text-lg">
                <ArrowDownCircle size={22} className="text-white/90" />
                <span>Deposit Funds</span>
             </div>
          </Link>

           {/* Withdraw - White */}
           <Link
             to={`/${broker.id}/withdraw`}
             className="flex items-center justify-center w-full py-4 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 rounded-2xl shadow-sm transition-all transform active:scale-[0.98]"
          >
             <div className="flex items-center gap-2 font-bold text-lg">
                <ArrowUpCircle size={22} />
                <span>Withdraw Funds</span>
             </div>
          </Link>

          {/* Open Account - Dark Blue */}
          <Link
             to={`/${broker.id}/register`}
             className="flex items-center justify-center w-full py-4 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl shadow-lg shadow-slate-200 transition-all transform active:scale-[0.98]"
          >
             <div className="flex items-center gap-2 font-bold text-lg">
                <UserPlus size={22} className="text-white/90" />
                <span>Open Real Account</span>
             </div>
          </Link>

        </div>

        {/* Feature Sections - Mocking the content from screenshots */}
        
        {/* Payment Methods */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 mb-6">
            <div className="flex items-center gap-2 mb-4 border-b border-slate-50 pb-3">
                <Landmark size={18} className="text-green-600" />
                <h3 className="font-bold text-slate-900 text-sm">Deposit & Withdraw Methods</h3>
            </div>
            <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                    <span className="text-sm font-medium text-slate-700">Local Bank Transfer</span>
                    <span className="px-2 py-0.5 bg-green-100 text-green-700 text-[10px] font-bold rounded">0% Fee</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                    <span className="text-sm font-medium text-slate-700">Digital Wallets (Kurimi, etc)</span>
                    <span className="px-2 py-0.5 bg-green-100 text-green-700 text-[10px] font-bold rounded">Instant</span>
                </div>
                 <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                    <span className="text-sm font-medium text-slate-700">Exchange Shops</span>
                    <CheckCircle size={14} className="text-green-500" />
                </div>
            </div>
        </div>

        {/* Broker Features */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
             <div className="flex items-center gap-2 mb-4 border-b border-slate-50 pb-3">
                <Zap size={18} className="text-amber-500" />
                <h3 className="font-bold text-slate-900 text-sm">Why {broker.name}?</h3>
            </div>
            <div className="grid grid-cols-1 gap-4">
                <div className="flex items-start gap-3">
                    <div className="p-2 bg-slate-50 rounded-lg text-slate-600"><Smartphone size={18} /></div>
                    <div>
                        <h4 className="text-sm font-bold text-slate-900">Easy Start</h4>
                        <p className="text-xs text-slate-500">Start trading with just $1 deposit.</p>
                    </div>
                </div>
                <div className="flex items-start gap-3">
                    <div className="p-2 bg-slate-50 rounded-lg text-slate-600"><Trophy size={18} /></div>
                    <div>
                        <h4 className="text-sm font-bold text-slate-900">Global Awards</h4>
                        <p className="text-xs text-slate-500">Best Broker in Africa & Middle East.</p>
                    </div>
                </div>
            </div>
        </div>
        
        <div className="mt-8 text-center pb-4">
            <p className="text-[10px] text-slate-300 font-medium">Terms apply. Trading involves risk.</p>
        </div>

      </div>
    </div>
  );
};