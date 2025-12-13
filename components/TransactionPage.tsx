import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ChevronRight, CheckCircle, AlertCircle, MessageCircle, ShieldCheck, User, CreditCard } from 'lucide-react';
import { TransactionType, TransactionFormValues } from '../types';
import { YemenFlag } from './YemenFlag';
import { generateTransactionId } from '../utils/idGenerator';
import { brokers } from '../data/brokers';

// Configured with provided credentials
const TELEGRAM_BOT_TOKEN = '7701190517:AAHR4nJDg1B6YpVzNdiprh7jQlmq6PTv84A'; 
const TELEGRAM_CHAT_ID = '-1003325351270';

export const TransactionPage: React.FC = () => {
  const navigate = useNavigate();
  const { brokerId, action } = useParams<{ brokerId: string; action: string }>();
  
  const broker = brokerId ? brokers[brokerId] : null;
  const type = action as TransactionType;

  const [step, setStep] = useState<'form' | 'processing' | 'success'>('form');
  const [transactionId, setTransactionId] = useState<string>('');
  const [errors, setErrors] = useState<Partial<Record<keyof TransactionFormValues, string>>>({});
  
  const [formData, setFormData] = useState<TransactionFormValues>({
    amount: '',
    tradingAccount: '',
    fullName: '',
    phoneNumber: '',
    notes: '',
    acceptedTerms: false
  });

  useEffect(() => {
    if (!broker || !['deposit', 'withdraw', 'register'].includes(type)) {
      navigate('/');
    }
  }, [broker, type, navigate]);

  if (!broker) return null;

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof TransactionFormValues, string>> = {};
    if (!formData.amount) newErrors.amount = "مطلوب";
    if (!formData.tradingAccount) newErrors.tradingAccount = "مطلوب";
    if (!formData.fullName) newErrors.fullName = "مطلوب";
    if (!formData.phoneNumber || formData.phoneNumber.length < 7) newErrors.phoneNumber = "رقم غير صحيح";
    if (!formData.acceptedTerms) newErrors.acceptedTerms = "مطلوب";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const sendTelegramNotification = async (id: string) => {
    if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) return;

    // Telegram message in Arabic/English mix for admin clarity
    const message = `
🆕 *طلب جديد*
-----------------------------
🆔 *رقم العملية:* \`${id}\`
📌 *النوع:* ${type === 'deposit' ? 'إيداع' : (type === 'withdraw' ? 'سحب' : 'تسجيل')}
🏢 *الوسيط:* ${broker.name}
💰 *المبلغ:* $${formData.amount}
👤 *الاسم:* ${formData.fullName}
📱 *الهاتف:* +967 ${formData.phoneNumber}
💼 *الحساب:* \`${formData.tradingAccount}\`
📝 *ملاحظات:* ${formData.notes || 'لا يوجد'}
-----------------------------
    `.trim();

    try {
      await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: TELEGRAM_CHAT_ID,
          text: message,
          parse_mode: 'Markdown',
        }),
      });
    } catch (error) {
      console.error('Telegram Error:', error);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setStep('processing');
    
    setTimeout(async () => {
      const newId = generateTransactionId(broker.name.substring(0, 3).toUpperCase());
      setTransactionId(newId);
      await sendTelegramNotification(newId);
      setStep('success');
    }, 1500);
  };

  const isRegister = type === 'register';

  // --- Render Steps ---

  const renderRegister = () => (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-slate-50">
      <div className="w-full max-w-sm bg-white p-8 rounded-3xl shadow-sm text-center">
        <div className="mx-auto w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center text-blue-600 mb-4">
          <AlertCircle size={32} strokeWidth={1.5} />
        </div>
        <h3 className="text-lg font-bold text-slate-900 mb-2">جاري التوجيه</h3>
        <p className="text-slate-500 text-xs mb-6">
            سيتم تحويلك إلى صفحة تسجيل {broker.name}.
        </p>
        <div className="space-y-2">
          <button
            onClick={() => {
              navigate(`/${broker.id}`);
              alert(`جاري التحويل إلى ${broker.name}...`);
            }}
            className="w-full py-3 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition-colors text-sm"
          >
            متابعة
          </button>
          <button
            onClick={() => navigate(`/${broker.id}`)}
            className="w-full py-3 text-slate-500 font-medium hover:bg-slate-50 rounded-xl transition-colors text-sm"
          >
            إلغاء
          </button>
        </div>
      </div>
    </div>
  );

  const renderSuccess = () => {
    const whatsappText = encodeURIComponent(
        `مرحباً، أريد تسريع طلبي.\n\n` +
        `🆔 رقم العملية: ${transactionId}\n` +
        `📌 النوع: ${type === 'deposit' ? 'إيداع' : 'سحب'}\n` +
        `💰 المبلغ: ${formData.amount} دولار\n` +
        `🏢 الوسيط: ${broker.name}\n` +
        `💼 الحساب: ${formData.tradingAccount}\n\n` +
        `يرجى معالجة الطلب.`
    );
    const whatsappUrl = `https://wa.me/967733353380?text=${whatsappText}`;

    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-slate-50">
            <div className="w-full max-w-sm bg-white p-6 rounded-3xl shadow-sm text-center animate-in zoom-in-95 duration-300">
                <div className="mx-auto w-16 h-16 bg-green-50 rounded-full flex items-center justify-center text-green-600 mb-4">
                    <CheckCircle size={32} strokeWidth={1.5} />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-1">تم تقديم الطلب</h3>
                <p className="text-slate-500 text-xs mb-4">طلبك قيد المعالجة حالياً.</p>
                
                <div className="bg-slate-50 border border-slate-100 rounded-xl p-3 mb-6">
                    <p className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold mb-1">رقم العملية</p>
                    <p className="font-mono text-lg font-bold text-slate-800 select-all">{transactionId}</p>
                </div>

                <div className="space-y-2">
                    <a 
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center w-full py-3 bg-[#25D366] text-white font-bold rounded-xl hover:bg-[#20bd5a] transition-colors shadow-lg shadow-green-100 text-sm"
                    >
                    <MessageCircle className="ml-2" size={18} />
                    تسريع الطلب عبر واتساب
                    </a>
                    
                    <button
                    onClick={() => navigate(`/${broker.id}`)}
                    className="w-full py-3 bg-white border border-slate-200 text-slate-700 font-medium rounded-xl hover:bg-slate-50 transition-colors text-sm"
                    >
                    العودة للوسيط
                    </button>
                </div>
            </div>
        </div>
    );
  };

  const renderProcessing = () => (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
      <div className="w-12 h-12 border-4 border-slate-200 border-t-blue-600 rounded-full animate-spin mb-3"></div>
      <p className="text-slate-500 font-medium text-sm">جاري المعالجة...</p>
    </div>
  );

  // --- Main Form Render ---

  if (isRegister) return renderRegister();
  if (step === 'success') return renderSuccess();
  if (step === 'processing') return renderProcessing();

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans pb-10">
      
      {/* Header Compact */}
      <div className="bg-white px-4 py-3 sticky top-0 z-10 flex items-center justify-between shadow-sm border-b border-slate-100">
        <button 
            onClick={() => navigate(`/${broker.id}`)}
            className="p-1.5 -mr-1 text-slate-400 hover:text-slate-900 rounded-full transition-colors"
        >
            <ChevronRight size={22} />
        </button>
        <span className="font-bold text-slate-900 text-sm">
             {type === 'deposit' ? 'إيداع' : 'سحب'} ({broker.name})
        </span>
        <div className="w-7 h-7 rounded-lg overflow-hidden border border-slate-100">
             <img src={broker.logoUrl} alt={broker.name} className="w-full h-full object-cover" />
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 py-4">
        
        <form onSubmit={handleSubmit} className="space-y-3">
            
            {/* Amount - Top Card */}
            <div className="bg-white rounded-2xl p-4 text-center shadow-sm border border-slate-200">
                <label className="block text-xs font-bold text-blue-600 mb-1">المبلغ ($)</label>
                <input
                    type="number"
                    placeholder="0"
                    className="w-full text-center text-3xl font-bold text-slate-900 placeholder:text-slate-200 outline-none bg-transparent"
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                />
                 {errors.amount && <p className="text-red-500 text-[10px] mt-1">مطلوب</p>}
            </div>

            {/* Combined Details Card */}
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200 space-y-3">
                
                {/* Account */}
                <div>
                    <label className="text-[10px] font-bold text-slate-400 mb-1 block">رقم الحساب</label>
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="مثال: 882133"
                            className="w-full pl-3 pr-3 py-2.5 bg-slate-50 rounded-xl text-slate-900 text-sm font-semibold outline-none focus:ring-1 focus:ring-blue-500 transition-all text-left"
                            dir="ltr"
                            value={formData.tradingAccount}
                            onChange={(e) => setFormData({ ...formData, tradingAccount: e.target.value })}
                        />
                        <CreditCard size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    </div>
                     {errors.tradingAccount && <p className="text-red-500 text-[10px] mt-0.5">مطلوب</p>}
                </div>

                 {/* Name */}
                <div>
                    <label className="text-[10px] font-bold text-slate-400 mb-1 block">الاسم الكامل</label>
                     <div className="relative">
                        <input
                            type="text"
                            placeholder="الاسم الرباعي"
                            className="w-full pl-3 pr-3 py-2.5 bg-slate-50 rounded-xl text-slate-900 text-sm font-semibold outline-none focus:ring-1 focus:ring-blue-500 transition-all"
                            value={formData.fullName}
                            onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                        />
                         <User size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    </div>
                     {errors.fullName && <p className="text-red-500 text-[10px] mt-0.5">مطلوب</p>}
                </div>

                {/* Phone */}
                <div>
                    <label className="text-[10px] font-bold text-slate-400 mb-1 block">رقم الهاتف (واتساب)</label>
                    <div className="flex items-center bg-slate-50 rounded-xl overflow-hidden focus-within:ring-1 focus-within:ring-blue-500" dir="ltr">
                            <div className="flex items-center gap-1.5 px-3 py-2.5 bg-slate-100 text-slate-600 border-r border-slate-200">
                            <YemenFlag className="w-4 h-3" />
                            <span className="font-bold text-xs tracking-wide">+967</span>
                        </div>
                        <input
                            type="tel"
                            placeholder="77x xxx xxx"
                            className="flex-1 px-3 py-2.5 bg-transparent outline-none text-slate-900 font-semibold placeholder:text-slate-300 text-sm tracking-wide"
                            value={formData.phoneNumber}
                            onChange={(e) => {
                                const val = e.target.value.replace(/\D/g, '');
                                setFormData({ ...formData, phoneNumber: val })
                            }}
                        />
                    </div>
                    {errors.phoneNumber && <p className="text-red-500 text-[10px] mt-0.5">غير صحيح</p>}
                </div>

                {/* Notes (Collapsed/Small) */}
                <div>
                    <label className="text-[10px] font-bold text-slate-400 mb-1 block">ملاحظات (اختياري)</label>
                    <textarea
                        rows={2}
                        className="w-full px-3 py-2 bg-slate-50 rounded-xl text-slate-900 text-xs outline-none focus:ring-1 focus:ring-blue-500 transition-all resize-none"
                        value={formData.notes}
                        onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    />
                </div>
            </div>

            {/* Submit */}
            <div className="pt-2">
                <label className="flex items-center gap-2 mb-4 cursor-pointer">
                    <input
                        type="checkbox"
                        className="w-4 h-4 text-blue-600 rounded border-slate-300"
                        checked={formData.acceptedTerms}
                        onChange={(e) => setFormData({ ...formData, acceptedTerms: e.target.checked })}
                    />
                    <span className="text-[10px] text-slate-500 font-medium">أوافق على الشروط والأحكام</span>
                </label>

                <button
                    type="submit"
                    className="w-full py-3.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm rounded-xl shadow-lg shadow-slate-200 transition-all active:scale-[0.98]"
                >
                    {type === 'deposit' ? 'تأكيد الطلب' : 'تأكيد الطلب'}
                </button>
            </div>
        </form>
      </div>
    </div>
  );
};