import React from 'react';
import AdminLogin from './AdminLogin';
import { AdminUser } from '../types';

interface LoginPageProps {
  onLoginSuccess: (user: AdminUser) => void;
  onNavigateHome: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess, onNavigateHome }) => {
  return <AdminLogin onLoginSuccess={onLoginSuccess} onNavigateHome={onNavigateHome} />;
};

export default LoginPage;
