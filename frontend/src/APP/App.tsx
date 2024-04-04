import React from 'react';
import { Routes, Route } from 'react-router-dom';
import './index.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.min.js';
import MainMenu, { MainMenuItem } from '../Components/MainMenu/MainMenu';
import HomePage from '../Components/HomePage/HomePage';
import LoginPage from '../Components/Login/LoginPage';
import AddNewTrip from '../Components/Admin/Trips/AddNewTrip';


const userMenuItems = [
  new MainMenuItem("Naslovna", "/"),
  new MainMenuItem("Contact", "/contact/"),
  new MainMenuItem("Prijava", "/login/"),
  new MainMenuItem("Registracija", "/register/"),
]

const adminMenuItems = [
  new MainMenuItem("Admin Dashboard", "/admin/dashboard"),
  new MainMenuItem("Settings", "/admin/settings"),
  new MainMenuItem("Novo putovanje", "/trip/new"),
];

const App: React.FC = () => {

  return (
    <React.StrictMode>
      <MainMenu userItems={userMenuItems} adminItems={adminMenuItems}/>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/trip/new" element={<AddNewTrip />} />
      </Routes>
    </React.StrictMode>
  );
};

export default App;
