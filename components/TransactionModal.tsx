import React, { useState, useEffect } from 'react';
import { X, CheckCircle, Loader2, AlertCircle, MessageCircle } from 'lucide-react';
import { TransactionType, TransactionFormValues, Broker } from '../types';
import { YemenFlag } from './YemenFlag';
import { generateTransactionId } from '../utils/idGenerator';

// Configured via environment variables
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN; 
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

interface TransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: TransactionType;
  broker: Broker;
}

export const TransactionModal: React.FC<TransactionModalProps> = ({ isOpen, onClose, type, broker }) => {
  const [step, setStep] = useState<'form' | 'processing' | 'success'>('form');
  const [transactionId, setTransactionId] = useState<string>('');
  const [errors, setErrors] = useState<Partial<Record<keyof TransactionFormValues, string>>>({});
  
  const [formData, setFormData] = useState<TransactionFormValues>({
    amount: '',
    tradingAccount: '',
    fullName: '',
    phoneNumber: '',
    acceptedTerms: false
  });

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      setStep('form');
      setFormData({
        amount: '',
        tradingAccount: '',
        fullName: '',
        phoneNumber: '',
        acceptedTerms: false
      });
      setErrors({});
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof TransactionFormValues, string>> = {};
    if (!formData.amount) newErrors.amount = "Amount is required";
    if (!formData.tradingAccount) newErrors.tradingAccount = "Trading account is required";
    if (!formData.fullName) newErrors.fullName = "Full name is required";
    if (!formData.phoneNumber || formData.phoneNumber.length < 7) newErrors.phoneNumber = "Valid phone number is required";
    if (!formData.acceptedTerms) newErrors.acceptedTerms = "Accepting terms is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const saveToWhatsAppMemory = (id: string) => {
    try {
      const memory = JSON.parse(localStorage.getItem('whatsapp_conversations') || '[]');
      memory.push({
        id,
        transactionId: id,
        type,
        broker: broker.name,
        amount: formData.amount,
        fullName: formData.fullName,
        phoneNumber: formData.phoneNumber,
        tradingAccount: formData.tradingAccount,
        timestamp: new Date().toISOString(),
        status: 'pending'
      });
      localStorage.setItem('whatsapp_conversations', JSON.stringify(memory));
    } catch (error) {
      console.error('Error saving WhatsApp memory:', error);
    }
  };

  const sendTelegramNotification = async (id: string) => {
    if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
      // Notification skipped silently if config missing
      return;
    }

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
    
    // Simulate API call processing
    setTimeout(async () => {
      const newId = generateTransactionId(broker.name.substring(0, 3).toUpperCase());
      setTransactionId(newId);
      
      // Save to WhatsApp conversation memory
      saveToWhatsAppMemory(newId);
      
      // Send notification to Telegram
      await sendTelegramNotification(newId);

      setStep('success');
    }, 1500);
  };

  const isRegister = type === 'register';

  // Render content based on step
  const renderContent = () => {
    if (isRegister) {
      return (
        <div className="space-y-8 text-center py-4">
          <div className="mx-auto w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center text-blue-600">
            <AlertCircle size={36} strokeWidth={1.5} />
          </div>
          <div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">Redirecting to Broker</h3>
            <p className="text-slate-500 text-sm leading-relaxed max-w-xs mx-auto">
                We are taking you to the official {broker.name} sign-up page.
            </p>
          </div>
          <div className="flex flex-col gap-3">
            <button
              onClick={() => {
                onClose();
                alert(`Redirecting to ${broker.name} registration...`);
              }}
              className="w-full py-3.5 bg-slate-900 text-white font-semibold rounded-xl hover:bg-slate-800 transition-colors shadow-lg shadow-slate-200"
            >
              Continue to Register
            </button>
             <button
              onClick={onClose}
              className="w-full py-3.5 text-slate-500 font-medium hover:text-slate-800 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      );
    }

    if (step === 'success') {
      const whatsappText = encodeURIComponent(
        `السلام عليكم، أود تسريع طلبي.\n\n` +
        `🆔 رقم المعاملة: ${transactionId}\n` +
        `📌 نوع الطلب: ${type === 'deposit' ? 'إيداع' : type === 'withdraw' ? 'سحب' : 'تسجيل'}\n` +
        `💰 المبلغ: ${formData.amount} دولار\n` +
        `🏢 الوسيط: ${broker.name}\n` +
        `👤 الاسم: ${formData.fullName}\n` +
        `📱 رقم الهاتف: +967${formData.phoneNumber}\n` +
        `💼 رقم الحساب: ${formData.tradingAccount}\n\n` +
        `يرجى معالجة هذا الطلب بأسرع وقت ممكن. شكراً`
      );
      
      const whatsappUrl = `https://wa.me/967733353380?text=${whatsappText}`;

      return (
        <div className="space-y-8 text-center py-4">
          <div className="mx-auto w-20 h-20 bg-green-50 rounded-full flex items-center justify-center text-green-600 animate-in zoom-in duration-300">
            <CheckCircle size={36} strokeWidth={1.5} />
          </div>
          <div>
            <h3 className="text-xl font-bold text-slate-900">Request Submitted</h3>
            <div className="mt-4 p-4 bg-slate-50 border border-slate-100 rounded-xl">
                 <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold mb-1">Transaction ID</p>
                 <p className="font-mono text-xl font-bold text-slate-800 select-all">{transactionId}</p>
            </div>
          </div>
          
          <div className="space-y-3">
            <a 
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center w-full py-3.5 bg-[#25D366] text-white font-bold rounded-xl hover:bg-[#20bd5a] transition-all shadow-lg shadow-green-100 hover:shadow-green-200"
              onClick={() => {
                // Auto-direct to WhatsApp with all details pre-filled
              }}
            >
              <MessageCircle className="mr-2" size={20} />
              تسريع عبر واتس أب
            </a>
            
            <button
              onClick={onClose}
              className="w-full py-3.5 bg-white border border-slate-200 text-slate-700 font-medium rounded-xl hover:bg-slate-50 transition-colors"
            >
              إغلاق
            </button>
          </div>
        </div>
      );
    }

    if (step === 'processing') {
      return (
        <div className="flex flex-col items-center justify-center py-20 space-y-6">
          <div className="relative">
              <div className="w-16 h-16 border-4 border-slate-100 border-t-slate-900 rounded-full animate-spin"></div>
          </div>
          <p className="text-slate-500 font-medium animate-pulse">Processing secure request...</p>
        </div>
      );
    }

    return (
      <form onSubmit={handleSubmit} className="space-y-6 pt-2">
        <div className="space-y-4">
          {/* Amount */}
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Amount (USD)</label>
            <input
              type="number"
              placeholder="0.00"
              className={`w-full px-4 py-3 bg-slate-50 border rounded-xl focus:ring-2 focus:ring-slate-900 focus:border-transparent outline-none transition-all placeholder:text-slate-300 text-slate-900 font-medium ${errors.amount ? 'border-red-500 bg-red-50/50' : 'border-slate-200'}`}
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
            />
          </div>

          {/* Trading Account */}
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">رقم حساب لبتداول</label>
            <input
              type="text"
              placeholder="e.g. 2938472"
              className={`w-full px-4 py-3 bg-slate-50 border rounded-xl focus:ring-2 focus:ring-slate-900 focus:border-transparent outline-none transition-all placeholder:text-slate-300 text-slate-900 font-medium ${errors.tradingAccount ? 'border-red-500 bg-red-50/50' : 'border-slate-200'}`}
              value={formData.tradingAccount}
              onChange={(e) => setFormData({ ...formData, tradingAccount: e.target.value })}
            />
          </div>

          {/* Full Name */}
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Full Name</label>
            <input
              type="text"
              placeholder="Your Name"
              className={`w-full px-4 py-3 bg-slate-50 border rounded-xl focus:ring-2 focus:ring-slate-900 focus:border-transparent outline-none transition-all placeholder:text-slate-300 text-slate-900 font-medium ${errors.fullName ? 'border-red-500 bg-red-50/50' : 'border-slate-200'}`}
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
            />
          </div>

          {/* Phone Number */}
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Phone Number</label>
            <div className={`flex items-center bg-slate-50 border rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-slate-900 focus-within:border-transparent transition-all ${errors.phoneNumber ? 'border-red-500' : 'border-slate-200'}`}>
              <div className="flex items-center gap-2 px-4 py-3 border-r border-slate-200 bg-slate-100/50 text-slate-600">
                <YemenFlag className="w-5 h-3.5 shadow-sm" />
                <span className="font-medium text-sm">+967</span>
              </div>
              <input
                type="tel"
                placeholder="770 000 000"
                className="flex-1 px-4 py-3 bg-transparent outline-none w-full text-slate-900 font-medium placeholder:text-slate-300"
                value={formData.phoneNumber}
                onChange={(e) => {
                    const val = e.target.value.replace(/\D/g, '');
                    setFormData({ ...formData, phoneNumber: val })
                }}
              />
            </div>
          </div>
        </div>

        {/* Terms */}
        <div className="flex items-start gap-3">
          <div className="flex items-center h-5">
            <input
              id="terms"
              type="checkbox"
              className="w-4 h-4 text-slate-900 border-slate-300 rounded focus:ring-slate-900 cursor-pointer"
              checked={formData.acceptedTerms}
              onChange={(e) => setFormData({ ...formData, acceptedTerms: e.target.checked })}
            />
          </div>
          <label htmlFor="terms" className="text-xs text-slate-500 cursor-pointer select-none">
            I confirm the information is accurate and accept the <span className="text-slate-900 font-medium underline">Terms & Conditions</span>.
          </label>
        </div>
        
        {/* Validation Errors Global Message (Optional, mainly if missed inline) */}
        {Object.keys(errors).length > 0 && (
            <p className="text-xs text-red-500 font-medium text-center">Please fill in all required fields.</p>
        )}

        <div className="pt-2">
          <button
            type="submit"
            className={`w-full py-4 text-white font-bold rounded-xl shadow-lg transform transition-all hover:-translate-y-0.5 active:translate-y-0 active:shadow-md ${
                type === 'deposit' ? 'bg-slate-900 hover:bg-slate-800' :
                'bg-slate-900 hover:bg-slate-800'
            }`}
          >
            Confirm {type === 'deposit' ? 'Deposit' : 'Withdrawal'}
          </button>
        </div>
      </form>
    );
  };