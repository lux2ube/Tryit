import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { UserPlus, ArrowDownCircle, ArrowUpCircle, ShieldCheck, Globe, Trophy, Zap, Smartphone, CheckCircle, Wallet, Gift, CreditCard, Info, Lightbulb, Layers } from 'lucide-react';
import { Broker } from '../types';

interface BrokerPageProps {
  broker: Broker;
}

export const BrokerPage: React.FC<BrokerPageProps> = ({ broker }) => {
  const [activeTab, setActiveTab] = useState<'payment' | 'details'>('payment');

  // Prevent back navigation to the main list (Competitors)
  useEffect(() => {
    // Push a new state to the history stack to trap the user
    window.history.pushState(null, '', window.location.href);

    const handlePopState = () => {
        // When the user presses back, push the state again to keep them on the current page
        window.history.pushState(null, '', window.location.href);
    };

    window.addEventListener('popstate', handlePopState);

    return () => {
        window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-6">
      
      {/* Header - No Back Button allowed */}
      <div className="px-5 pt-6 pb-2">
         <h1 className="text-xl font-bold text-slate-900 text-center">ملف الوسيط</h1>
      </div>

      <div className="max-w-md mx-auto px-4">
        
        {/* Compact Hero Card */}
        <div className="bg-white p-4 rounded-3xl shadow-sm border border-slate-100 mb-4 flex items-center gap-4">
            <div className={`w-24 h-16 shrink-0 rounded-2xl p-2 flex items-center justify-center border border-slate-100 shadow-sm overflow-hidden ${broker.id === 'valetax' ? 'bg-black' : 'bg-white'}`}>
              <img 
                src={broker.logoUrl} 
                alt={broker.name} 
                className="w-full h-full object-contain"
              />
           </div>
           <div>
               <h2 className="text-xl font-bold text-slate-900 leading-tight mb-1">{broker.name}</h2>
               <div className="flex flex-wrap gap-2">
                  <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-100 flex items-center gap-1">
                    <Globe size={10} /> عالمي
                  </span>
                  <span className="text-[10px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-100 flex items-center gap-1">
                    <ShieldCheck size={10} /> FSCA
                  </span>
               </div>
           </div>
        </div>

        {/* Primary Actions - Grid to save space */}
        <div className="grid grid-cols-2 gap-3 mb-5">
          {/* Deposit - Prominent */}
          <Link
             to={`/${broker.id}/deposit`}
             className="col-span-1 flex flex-col items-center justify-center py-3 px-2 bg-[#EA9708] text-white rounded-2xl shadow-sm shadow-orange-100 active:scale-95 transition-all"
          >
             <ArrowDownCircle size={20} className="mb-1" />
             <span className="font-bold text-sm">إيداع</span>
          </Link>

           {/* Withdraw */}
           <Link
             to={`/${broker.id}/withdraw`}
             className="col-span-1 flex flex-col items-center justify-center py-3 px-2 bg-white border border-slate-200 text-slate-700 rounded-2xl active:scale-95 transition-all"
          >
             <ArrowUpCircle size={20} className="mb-1" />
             <span className="font-bold text-sm">سحب</span>
          </Link>

          {/* Open Account - Full width below */}
          <Link
             to={`/${broker.id}/register`}
             className="col-span-2 flex items-center justify-center gap-2 py-3 bg-[#1E293B] text-white rounded-2xl shadow-sm active:scale-95 transition-all"
          >
             <UserPlus size={18} />
             <span className="font-bold text-sm">فتح حساب حقيقي</span>
          </Link>
        </div>

        {/* Tabs - Compact */}
        <div className="bg-white rounded-xl p-1 border border-slate-200 shadow-sm mb-4 flex">
            <button
                onClick={() => setActiveTab('payment')}
                className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-lg text-xs font-bold transition-all ${
                    activeTab === 'payment' 
                    ? 'bg-slate-100 text-slate-900 shadow-sm' 
                    : 'text-slate-400 hover:bg-slate-50'
                }`}
            >
                <CreditCard size={14} />
                طرق الدفع
            </button>
            <button
                onClick={() => setActiveTab('details')}
                className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-lg text-xs font-bold transition-all ${
                    activeTab === 'details' 
                    ? 'bg-slate-100 text-slate-900 shadow-sm' 
                    : 'text-slate-400 hover:bg-slate-50'
                }`}
            >
                <Info size={14} />
                تفاصيل
            </button>
        </div>

        {/* Tab Content */}
        <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
            
            {/* Payment Tab */}
            {activeTab === 'payment' && (
                <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-100">
                    {/* Badges */}
                    <div className="flex gap-2 mb-4 overflow-x-auto pb-1 no-scrollbar">
                        <span className="shrink-0 px-2.5 py-1 bg-[#FEF3C7] text-[#D97706] text-[10px] font-bold rounded-lg border border-[#FDE68A]">
                            {broker.id === 'valetax' ? 'أقل إيداع 10$' : 'أقل إيداع 1$'}
                        </span>
                        <span className="shrink-0 px-2.5 py-1 bg-[#D1FAE5] text-[#059669] text-[10px] font-bold rounded-lg border border-[#A7F3D0]">
                            %0 عمولة
                        </span>
                    </div>

                    {/* Regions Grid */}
                    <div className="space-y-4">
                        {/* North */}
                        <div>
                            <div className="flex items-center gap-2 mb-2">
                                <div className="w-1.5 h-1.5 rounded-full bg-[#10B981]"></div>
                                <span className="text-xs font-bold text-slate-500">شمال اليمن</span>
                            </div>
                            <div className="space-y-2">
                                <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                                    <span className="text-xs font-semibold text-slate-700">بنك الكريمي، شبكات التحويل</span>
                                    <CheckCircle size={14} className="text-green-500" />
                                </div>
                                <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                                    <span className="text-xs font-semibold text-slate-700">المحافظ (جيب، جوالي، كاش)</span>
                                    <CheckCircle size={14} className="text-green-500" />
                                </div>
                            </div>
                        </div>

                        {/* South */}
                        <div>
                            <div className="flex items-center gap-2 mb-2">
                                <div className="w-1.5 h-1.5 rounded-full bg-[#3B82F6]"></div>
                                <span className="text-xs font-bold text-slate-500">جنوب اليمن</span>
                            </div>
                            <div className="space-y-2">
                                <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                                    <span className="text-xs font-semibold text-slate-700">الكريمي، الشبكة الموحدة</span>
                                    <CheckCircle size={14} className="text-blue-500" />
                                </div>
                                <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                                    <span className="text-xs font-semibold text-slate-700">قطيبي، بن دول، بنك عدن</span>
                                    <CheckCircle size={14} className="text-blue-500" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Details Tab - Conditional Rendering */}
            {activeTab === 'details' && (
               broker.id === 'valetax' ? (
                   // --- Valetax Specific Details ---
                   <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-100">
                        <div className="flex items-center gap-2 mb-4">
                            <Lightbulb size={20} className="text-teal-600" />
                            <h2 className="text-lg font-bold text-slate-900">لمحة عن وسيط {broker.name}</h2>
                        </div>
                        
                        <p className="text-slate-600 text-sm leading-relaxed mb-6">
                            رائدة تداول الـ ECN، تقدم Valetax تجربة تداول شفافة تماماً مع سيولة عميقة وتنفيذ فوري للصفقات، مما يجعلها الخيار الأول للمحترفين.
                        </p>

                        <div className="space-y-4">
                                {/* Feature 1 */}
                            <div className="flex gap-3">
                                <div className="w-10 h-10 shrink-0 rounded-xl bg-teal-50 flex items-center justify-center text-teal-600">
                                    <Zap size={20} />
                                </div>
                                <div>
                                    <h4 className="font-bold text-slate-900 text-sm mb-0.5">تنفيذ ECN حقيقي</h4>
                                    <p className="text-xs text-slate-500 leading-snug">وصول مباشر للسوق بدون غرفة مقاصة (NDD).</p>
                                </div>
                            </div>

                            {/* Feature 2 */}
                            <div className="flex gap-3">
                                <div className="w-10 h-10 shrink-0 rounded-xl bg-cyan-50 flex items-center justify-center text-cyan-600">
                                    <Layers size={20} />
                                </div>
                                <div>
                                    <h4 className="font-bold text-slate-900 text-sm mb-0.5">سبريد ضيق جداً</h4>
                                    <p className="text-xs text-slate-500 leading-snug">أسعار خام تبدأ من 0.0 نقطة على اليورو/دولار.</p>
                                </div>
                            </div>

                                {/* Feature 3 */}
                                <div className="flex gap-3">
                                <div className="w-10 h-10 shrink-0 rounded-xl bg-teal-50 flex items-center justify-center text-teal-600">
                                    <Globe size={20} />
                                </div>
                                <div>
                                    <h4 className="font-bold text-slate-900 text-sm mb-0.5">تداول بلا حدود</h4>
                                    <p className="text-xs text-slate-500 leading-snug">جميع استراتيجيات التداول مسموحة (سكالبينج، هيدج).</p>
                                </div>
                            </div>

                            {/* Feature 4 */}
                            <div className="flex gap-3">
                                <div className="w-10 h-10 shrink-0 rounded-xl bg-sky-50 flex items-center justify-center text-sky-600">
                                    <Smartphone size={20} />
                                </div>
                                <div>
                                    <h4 className="font-bold text-slate-900 text-sm mb-0.5">تكنولوجيا متطورة</h4>
                                    <p className="text-xs text-slate-500 leading-snug">خوادم Equinix فائقة السرعة في لندن ونيويورك.</p>
                                </div>
                            </div>

                            {/* Feature 5 */}
                            <div className="flex gap-3">
                                <div className="w-10 h-10 shrink-0 rounded-xl bg-teal-50 flex items-center justify-center text-teal-600">
                                    <CheckCircle size={20} />
                                </div>
                                <div>
                                    <h4 className="font-bold text-slate-900 text-sm mb-0.5">شفافية مطلقة</h4>
                                    <p className="text-xs text-slate-500 leading-snug">سجل صفقات متاح وتاريخ تداول موثوق.</p>
                                </div>
                            </div>
                        </div>

                        {/* Account Types */}
                        <div className="mt-6 pt-4 border-t border-slate-50">
                                <div className="flex items-center gap-2 mb-3 text-slate-900">
                                <Layers size={16} className="text-slate-400" />
                                <h3 className="font-bold text-sm">حسابات التداول</h3>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                <span className="px-3 py-1.5 bg-slate-50 text-slate-700 text-xs font-bold rounded-xl border border-slate-200">
                                    Valetax Standard
                                </span>
                                <span className="px-3 py-1.5 bg-slate-50 text-slate-700 text-xs font-bold rounded-xl border border-slate-200">
                                    Valetax ECN
                                </span>
                                </div>
                        </div>
                    </div>
               ) : (
                   // --- Headway (Default) Details ---
                    <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-100">
                        <div className="flex items-center gap-2 mb-4">
                            <Lightbulb size={20} className="text-[#F59E0B]" />
                            <h2 className="text-lg font-bold text-slate-900">لمحة عن وسيط {broker.name}</h2>
                        </div>
                        
                        <p className="text-slate-600 text-sm leading-relaxed mb-6">
                            وسيط فوركس متنامٍ وسريع الحركة، يركز على توفير إمكانية وصول عالية للمتداولين في الأسواق النامية (آسيا وأفريقيا)، مدعوماً بجوائز عالمية حديثة.
                        </p>

                        <div className="space-y-4">
                            {/* Feature 1 */}
                            <div className="flex gap-3">
                                <div className="w-10 h-10 shrink-0 rounded-xl bg-[#DCFCE7] flex items-center justify-center text-[#16A34A]">
                                    <Wallet size={20} />
                                </div>
                                <div>
                                    <h4 className="font-bold text-slate-900 text-sm mb-0.5">سهولة البدء</h4>
                                    <p className="text-xs text-slate-500 leading-snug">إيداع يبدأ من 1$ فقط، مناسب للجميع.</p>
                                </div>
                            </div>

                            {/* Feature 2 */}
                            <div className="flex gap-3">
                                <div className="w-10 h-10 shrink-0 rounded-xl bg-[#FEF3C7] flex items-center justify-center text-[#D97706]">
                                    <Trophy size={20} />
                                </div>
                                <div>
                                    <h4 className="font-bold text-slate-900 text-sm mb-0.5">جوائز عالمية</h4>
                                    <p className="text-xs text-slate-500 leading-snug">أفضل وسيط في أفريقيا والشرق الأوسط 2025.</p>
                                </div>
                            </div>

                            {/* Feature 3 */}
                            <div className="flex gap-3">
                                <div className="w-10 h-10 shrink-0 rounded-xl bg-[#FCE7F3] flex items-center justify-center text-[#DB2777]">
                                    <Gift size={20} />
                                </div>
                                <div>
                                    <h4 className="font-bold text-slate-900 text-sm mb-0.5">بونصات وحوافز</h4>
                                    <p className="text-xs text-slate-500 leading-snug">111$ بونص ترحيبي، و75% على الإيداع.</p>
                                </div>
                            </div>

                            {/* Feature 4 */}
                            <div className="flex gap-3">
                                <div className="w-10 h-10 shrink-0 rounded-xl bg-[#DBEAFE] flex items-center justify-center text-[#2563EB]">
                                    <Zap size={20} />
                                </div>
                                <div>
                                    <h4 className="font-bold text-slate-900 text-sm mb-0.5">جودة التنفيذ</h4>
                                    <p className="text-xs text-slate-500 leading-snug">سبريد 0.0 نقطة، وحسابات ECN/STP.</p>
                                </div>
                            </div>

                            {/* Feature 5 */}
                            <div className="flex gap-3">
                                <div className="w-10 h-10 shrink-0 rounded-xl bg-[#F3E8FF] flex items-center justify-center text-[#7C3AED]">
                                    <Smartphone size={20} />
                                </div>
                                <div>
                                    <h4 className="font-bold text-slate-900 text-sm mb-0.5">منصات متكاملة</h4>
                                    <p className="text-xs text-slate-500 leading-snug">MT4/MT5، تطبيق خاص، و33 عملة رقمية.</p>
                                </div>
                            </div>

                            {/* Feature 6 */}
                            <div className="flex gap-3">
                                <div className="w-10 h-10 shrink-0 rounded-xl bg-[#DCFCE7] flex items-center justify-center text-[#059669]">
                                    <ShieldCheck size={20} />
                                </div>
                                <div>
                                    <h4 className="font-bold text-slate-900 text-sm mb-0.5">أمان ودعم</h4>
                                    <p className="text-xs text-slate-500 leading-snug">ترخيص FSCA، دعم 24/7، سحب فوري.</p>
                                </div>
                            </div>
                        </div>

                        {/* Account Types */}
                        <div className="mt-6 pt-4 border-t border-slate-50">
                            <div className="flex items-center gap-2 mb-3 text-slate-900">
                                <Layers size={16} className="text-slate-400" />
                                <h3 className="font-bold text-sm">أنواع الحسابات</h3>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                <span className="px-3 py-1.5 bg-slate-50 text-slate-700 text-xs font-bold rounded-xl border border-slate-200">
                                    حساب السنت
                                </span>
                                <span className="px-3 py-1.5 bg-slate-50 text-slate-700 text-xs font-bold rounded-xl border border-slate-200">
                                    حساب الستاندرد
                                </span>
                                <span className="px-3 py-1.5 bg-slate-50 text-slate-700 text-xs font-bold rounded-xl border border-slate-200">
                                    حساب Pro
                                </span>
                            </div>
                        </div>
                    </div>
               )
            )}
        </div>
      </div>
    </div>
  );
};