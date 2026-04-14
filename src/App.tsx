import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './Layout/Dashboardlayout'; 
import Dashboard from './pages/Dashboard'; 


const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/vendor" element={<Layout />}>
          <Route path="dashboard" element={<Dashboard />} />
        </Route>
        
        <Route path="*" element={<Navigate to="/vendor/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;