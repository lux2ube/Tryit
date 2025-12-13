import React from 'react';
import { HashRouter as Router, Routes, Route, Link, useParams } from 'react-router-dom';
import { BrokerPage } from './components/BrokerPage';
import { TransactionPage } from './components/TransactionPage';
import { brokers } from './data/brokers';
import { ArrowRight, ShieldCheck } from 'lucide-react';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6">
      <div className="max-w-md w-full">
        
        <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-white shadow-sm mb-4 text-slate-900">
               <ShieldCheck size={24} />
            </div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight mb-2">Select Broker</h1>
            <p className="text-slate-500 text-sm">Choose a partner to proceed</p>
        </div>
        
        <div className="space-y-4">
            {Object.values(brokers).map((broker) => (
                <Link 
                    key={broker.id} 
                    to={`/${broker.id}`}
                    className="flex items-center p-4 bg-white hover:bg-white border border-slate-200 hover:border-slate-300 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 group"
                >
                    <img 
                        src={broker.logoUrl} 
                        alt={broker.name} 
                        className="w-12 h-12 rounded-lg object-cover bg-slate-100"
                    />
                    <div className="ml-4 flex-1">
                        <h2 className="text-base font-bold text-slate-900">{broker.name}</h2>
                        <p className="text-xs text-slate-500">{broker.description}</p>
                    </div>
                    <div className="w-8 h-8 rounded-full bg-slate-50 group-hover:bg-slate-900 flex items-center justify-center transition-colors">
                        <ArrowRight size={14} className="text-slate-400 group-hover:text-white" />
                    </div>
                </Link>
            ))}
        </div>
      </div>
    </div>
  );
};

// Wrapper to inject broker data based on URL param
const BrokerPageWrapper = () => {
    const { brokerId } = useParams<{ brokerId: string }>();
    const broker = brokerId ? brokers[brokerId] : null;

    if (!broker) {
        return <div className="p-10 text-center">Broker not found</div>;
    }

    return <BrokerPage broker={broker} />;
};

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/:brokerId" element={<BrokerPageWrapper />} />
        <Route path="/:brokerId/:action" element={<TransactionPage />} />
      </Routes>
    </Router>
  );
};

export default App;