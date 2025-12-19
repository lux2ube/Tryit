import React, { useEffect } from 'react';
import { HashRouter as Router, Routes, Route, useParams, useNavigate } from 'react-router-dom';
import { BrokerPage } from './components/BrokerPage';
import { TransactionPage } from './components/TransactionPage';
import { brokers } from './data/brokers';

const LandingPage = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    // Redirect to Headway on landing
    navigate('/headway');
  }, [navigate]);
  
  return null;
};

// Wrapper to inject broker data based on URL param
const BrokerPageWrapper = () => {
    const { brokerId } = useParams<{ brokerId: string }>();
    const broker = brokerId ? brokers[brokerId] : null;

    if (!broker) {
        return <div className="p-10 text-center">الوسيط غير موجود</div>;
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