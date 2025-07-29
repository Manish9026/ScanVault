import React from 'react';
import { Toaster } from 'react-hot-toast';
import { Layout } from './components/Layout';
import { Dashboard } from './components/Dashboard';

function App() {
  return (
    <>
      <Layout>
        <Dashboard />
      </Layout>
      
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: 'white',
            color: '#1f2937',
            border: '1px solid #e5e7eb',
            borderRadius: '8px',
            fontSize: '14px',
            fontWeight: '500'
          },
          success: {
            iconTheme: {
              primary: '#22c55e',
              secondary: 'white'
            }
          },
          error: {
            iconTheme: {
              primary: '#ef4444',
              secondary: 'white'
            }
          }
        }}
      />
    </>
  );
}

export default App;