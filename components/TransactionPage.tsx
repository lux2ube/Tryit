import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ChevronLeft, CheckCircle, AlertCircle, MessageCircle, ShieldCheck, FileText, User, CreditCard } from 'lucide-react';
import { TransactionType, TransactionFormValues } from '../types';
import { YemenFlag } from './YemenFlag';
import { generateTransactionId } from '../utils/idGenerator';
import { brokers } from '../data/brokers';

// TODO: Replace these with your actual Telegram Bot Token and Chat ID
const TELEGRAM_BOT_TOKEN = ''; 
const TELEGRAM_CHAT_ID = '';

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
    if (!formData.amount) newErrors.amount = "Required";
    if (!formData.tradingAccount) newErrors.tradingAccount = "Required";
    if (!formData.fullName) newErrors.fullName = "Required";
    if (!formData.phoneNumber || formData.phoneNumber.length < 7) newErrors.phoneNumber = "Invalid";
    if (!formData.acceptedTerms) newErrors.acceptedTerms = "Required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const sendTelegramNotification = async (id: string) => {
    if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) return;

    const message = `
🆕 *New Request Submitted*
-----------------------------
🆔 *ID:* \`${id}\`
📌 *Type:* ${type.toUpperCase()}
🏢 *Broker:* ${broker.name}
💰 *Amount:* $${formData.amount}
👤 *Name:* ${formData.fullName}
📱 *Phone:* +967 ${formData.phoneNumber}
💼 *Account:* \`${formData.tradingAccount}\`
📝 *Notes:* ${formData.notes || 'None'}
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
        <div className="mx-auto w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center text-blue-600 mb-6">
          <AlertCircle size={40} strokeWidth={1.5} />
        </div>
        <h3 className="text-xl font-bold text-slate-900 mb-3">Redirecting</h3>
        <p className="text-slate-500 text-sm mb-8">
            You will be redirected to the {broker.name} registration page.
        </p>
        <div className="space-y-3">
          <button
            onClick={() => {
              navigate(`/${broker.id}`);
              alert(`Redirecting to ${broker.name}...`);
            }}
            className="w-full py-3.5 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition-colors"
          >
            Continue
          </button>
          <button
            onClick={() => navigate(`/${broker.id}`)}
            className="w-full py-3.5 text-slate-500 font-medium hover:bg-slate-50 rounded-xl transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );

  const renderSuccess = () => {
    const whatsappText = encodeURIComponent(
        `Hello, I would like to accelerate my request.\n\n` +
        `🆔 Transaction ID: ${transactionId}\n` +
        `📌 Type: ${type.toUpperCase()}\n` +
        `💰 Amount: ${formData.amount} USD\n` +
        `🏢 Broker: ${broker.name}\n` +
        `💼 Account: ${formData.tradingAccount}\n\n` +
        `Please process this request.`
    );
    const whatsappUrl = `https://wa.me/967733353380?text=${whatsappText}`;

    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-slate-50">
            <div className="w-full max-w-sm bg-white p-8 rounded-3xl shadow-sm text-center animate-in zoom-in-95 duration-300">
                <div className="mx-auto w-20 h-20 bg-green-50 rounded-full flex items-center justify-center text-green-600 mb-6">
                    <CheckCircle size={40} strokeWidth={1.5} />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Request Submitted</h3>
                <p className="text-slate-500 text-sm mb-6">Your request is being processed.</p>
                
                <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 mb-8">
                    <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold mb-1">Transaction ID</p>
                    <p className="font-mono text-xl font-bold text-slate-800 select-all">{transactionId}</p>
                </div>

                <div className="space-y-3">
                    <a 
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center w-full py-3.5 bg-[#25D366] text-white font-bold rounded-xl hover:bg-[#20bd5a] transition-colors shadow-lg shadow-green-100"
                    >
                    <MessageCircle className="mr-2" size={20} />
                    Accelerate via WhatsApp
                    </a>
                    
                    <button
                    onClick={() => navigate(`/${broker.id}`)}
                    className="w-full py-3.5 bg-white border border-slate-200 text-slate-700 font-medium rounded-xl hover:bg-slate-50 transition-colors"
                    >
                    Back to Broker
                    </button>
                </div>
            </div>
        </div>
    );
  };

  const renderProcessing = () => (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
      <div className="w-16 h-16 border-4 border-slate-200 border-t-blue-600 rounded-full animate-spin mb-4"></div>
      <p className="text-slate-500 font-medium">Processing...</p>
    </div>
  );

  // --- Main Form Render ---

  if (isRegister) return renderRegister();
  if (step === 'success') return renderSuccess();
  if (step === 'processing') return renderProcessing();

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans pb-24">
      
      {/* Header */}
      <div className="bg-white px-6 py-4 sticky top-0 z-10 flex items-center justify-between shadow-sm/50">
        <button 
            onClick={() => navigate(`/${broker.id}`)}
            className="p-2 -ml-2 text-slate-400 hover:text-slate-900 rounded-full transition-colors"
        >
            <ChevronLeft size={24} />
        </button>
        <div className="text-center">
            <h1 className="text-base font-bold text-slate-900 capitalize">
                {type === 'deposit' ? 'Deposit Funds' : 'Withdraw Funds'}
            </h1>
            <span className="text-xs text-slate-400 px-2 py-0.5 bg-slate-50 rounded-full">{broker.name}</span>
        </div>
        <div className="w-8 h-8 rounded-full overflow-hidden border border-slate-100">
             <img src={broker.logoUrl} alt={broker.name} className="w-full h-full object-cover" />
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 py-6 space-y-4">
        
        {/* Card 1: Amount */}
        <div className="bg-white rounded-3xl p-8 text-center shadow-sm border border-slate-100/50">
            <label className="block text-sm font-semibold text-blue-600 mb-4">
                Requested Amount
            </label>
            <div className="relative inline-block w-full max-w-[200px]">
                 <input
                    type="number"
                    placeholder="0"
                    className="w-full text-center text-5xl font-bold text-slate-900 placeholder:text-slate-200 outline-none bg-transparent"
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                />
                <span className="absolute top-1/2 -translate-y-1/2 -right-4 text-2xl text-slate-300 font-medium">$</span>
            </div>
            {errors.amount && <p className="text-red-500 text-xs mt-2">Please enter amount</p>}
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Card 2: Account Data */}
            <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-100/50">
                <div className="flex items-center gap-2 mb-4">
                    <CreditCard size={18} className="text-slate-400" />
                    <h2 className="text-sm font-bold text-slate-900">Account Data</h2>
                </div>
                
                <div className="space-y-1">
                    <label className="text-xs text-slate-400 ml-1">Trading Account Number</label>
                    <input
                        type="text"
                        placeholder="e.g. 882133"
                        className="w-full px-4 py-3 bg-slate-50 rounded-xl text-slate-900 outline-none focus:ring-2 focus:ring-blue-100 transition-all font-medium text-lg placeholder:font-normal placeholder:text-slate-300"
                        value={formData.tradingAccount}
                        onChange={(e) => setFormData({ ...formData, tradingAccount: e.target.value })}
                    />
                    <p className="text-[10px] text-slate-400 px-1 mt-1">Make sure to enter the MT4/MT5 account number.</p>
                    {errors.tradingAccount && <p className="text-red-500 text-xs px-1">Required</p>}
                </div>
            </div>

            {/* Card 3: Personal Data */}
            <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-100/50">
                <div className="flex items-center gap-2 mb-4">
                    <User size={18} className="text-slate-400" />
                    <h2 className="text-sm font-bold text-slate-900">Personal Data</h2>
                </div>
                
                <div className="space-y-4">
                    <div className="space-y-1">
                        <label className="text-xs text-slate-400 ml-1">Full Name</label>
                        <input
                            type="text"
                            placeholder="Your Full Name"
                            className="w-full px-4 py-3 bg-slate-50 rounded-xl text-slate-900 outline-none focus:ring-2 focus:ring-blue-100 transition-all text-right placeholder:text-left dir-rtl font-medium"
                            value={formData.fullName}
                            onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                        />
                         {errors.fullName && <p className="text-red-500 text-xs px-1">Required</p>}
                    </div>

                    <div className="space-y-1">
                        <label className="text-xs text-slate-400 ml-1">Phone Number (WhatsApp)</label>
                        <div className="flex items-center bg-slate-50 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-blue-100 transition-all">
                             <div className="flex items-center gap-2 px-4 py-3 bg-slate-100 text-slate-600 border-r border-slate-200">
                                <YemenFlag className="w-5 h-3.5" />
                                <span className="font-bold text-sm tracking-wide">+967</span>
                            </div>
                            <input
                                type="tel"
                                placeholder="77x xxx xxx"
                                className="flex-1 px-4 py-3 bg-transparent outline-none text-slate-900 font-medium placeholder:text-slate-300 text-lg tracking-wide"
                                value={formData.phoneNumber}
                                onChange={(e) => {
                                    const val = e.target.value.replace(/\D/g, '');
                                    setFormData({ ...formData, phoneNumber: val })
                                }}
                            />
                        </div>
                        {errors.phoneNumber && <p className="text-red-500 text-xs px-1">Invalid number</p>}
                    </div>
                </div>
            </div>

            {/* Card 4: Notes */}
            <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-100/50">
                <div className="flex items-center gap-2 mb-4">
                    <FileText size={18} className="text-slate-400" />
                    <h2 className="text-sm font-bold text-slate-900">Additional Notes <span className="font-normal text-slate-400">(Optional)</span></h2>
                </div>
                <textarea
                    rows={3}
                    placeholder="Any special instructions..."
                    className="w-full px-4 py-3 bg-slate-50 rounded-xl text-slate-900 outline-none focus:ring-2 focus:ring-blue-100 transition-all resize-none placeholder:text-slate-300"
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                />
            </div>

            {/* Terms and Submit */}
            <div className="pt-2 pb-6">
                <div className="flex items-center justify-center gap-3 mb-6 bg-white p-4 rounded-2xl border border-slate-100">
                    <input
                        id="terms"
                        type="checkbox"
                        className="w-5 h-5 text-blue-600 border-slate-300 rounded focus:ring-blue-500 cursor-pointer"
                        checked={formData.acceptedTerms}
                        onChange={(e) => setFormData({ ...formData, acceptedTerms: e.target.checked })}
                    />
                    <label htmlFor="terms" className="text-xs text-slate-500 cursor-pointer select-none">
                         I agree to the <span className="text-blue-600 font-semibold">Terms & Conditions</span>
                    </label>
                </div>

                <button
                    type="submit"
                    className="w-full py-4 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold text-lg rounded-2xl shadow-lg shadow-blue-200 transition-all transform active:scale-[0.98]"
                >
                    Confirm {type === 'deposit' ? 'Deposit' : 'Withdrawal'}
                </button>

                 <div className="mt-6 flex items-center justify-center gap-2 text-slate-300 text-[10px] font-medium uppercase tracking-widest">
                    <ShieldCheck size={12} />
                    <span>Encrypted & Secure</span>
                </div>
            </div>

        </form>
      </div>
    </div>
  );
};