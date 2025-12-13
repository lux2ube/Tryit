
export interface Broker {
  id: string;
  name: string;
  description: string;
  logoUrl: string;
  themeColor: string; // Tailwind class prefix or hex
}

export type TransactionType = 'deposit' | 'withdraw' | 'register';

export interface TransactionFormValues {
  amount: string;
  tradingAccount: string;
  fullName: string;
  phoneNumber: string;
  notes?: string;
  acceptedTerms: boolean;
}

export interface TransactionResult {
  id: string;
  timestamp: string;
  status: 'success' | 'pending';
}
