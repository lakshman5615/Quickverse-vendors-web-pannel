import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Authentication from './pages/Authentication';
import Layout from './Layout/Dashboardlayout'; 
import Dashboard from './pages/Dashboard';
import ProtectedRoute from './components/common/ProtectedRoute';

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
         <Route path="/" element={<Authentication />} />

         <Route element={<ProtectedRoute />}>
        <Route path="/vendor" element={<Layout />}>
          <Route path="dashboard" element={<Dashboard />} />
        </Route>
        </Route>
        
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;