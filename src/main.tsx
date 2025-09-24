
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './index.css';
import App from './App.tsx';
import Login from './login.tsx';
import Calender from './Calender.tsx';
import LoginSuccess from './logincom.tsx';
import DeleteAccount from './DeleteAccount.tsx';

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<App />} />
                <Route path="/login" element={<Login />} />
                <Route path="/calender" element={<Calender />} />
                <Route path="/logincom" element={<LoginSuccess />} />
                <Route path="/delete-account" element={<DeleteAccount />} />
            </Routes>
        </BrowserRouter>
    </StrictMode>,
);
