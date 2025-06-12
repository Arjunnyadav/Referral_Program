import React from 'react';
import { AuthProvider, useAuth } from './hooks/useAuth';
import { AuthForm } from './components/AuthForm';
import { Dashboard } from './components/Dashboard';

const AppContent: React.FC = () => {
  const { currentUser, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 flex items-center justify-center">
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
          <div className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white text-center">Loading...</p>
        </div>
      </div>
    );
  }

  return currentUser ? <Dashboard /> : <AuthForm />;
};

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;