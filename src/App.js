import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'; // Import Route and Routes

import LoginPage from './login';
import SalesPage from './salespage';
import FinancePage from './financepage';
import DispatchPage from './dispatch';
import OrdersPage from './orderspage';
import MobileDispatchPage from './mobiledispatch';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/sales" element={<SalesPage />} />
        <Route path="/finance" element={<FinancePage />} />
        <Route path="/dispatch" element={<DispatchPage/>} />
        <Route path="/admin" element={<OrdersPage/>} />
        <Route path="/mobiledispatch" element={<MobileDispatchPage/>} />
      </Routes>
    </Router>
  );
}

export default App;
