import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import ErrorBoundary from './components/ErrorBoundary';
import App from './App.jsx';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <ErrorBoundary>
            <BrowserRouter>
                <AuthProvider>
                    <ThemeProvider>
                        <Toaster
                            position="top-right"
                            toastOptions={{
                                duration: 3500,
                                style: {
                                    background: '#1a2540',
                                    color: '#f0ede6',
                                    border: '1px solid rgba(255,255,255,0.08)',
                                    borderRadius: '10px',
                                    fontFamily: "'DM Sans', sans-serif",
                                    fontSize: '0.88rem',
                                    fontWeight: 500,
                                    padding: '12px 18px',
                                    boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
                                },
                                success: {
                                    iconTheme: {
                                        primary: '#f7b801',
                                        secondary: '#3d348b',
                                    },
                                    style: {
                                        background: '#1a2540',
                                        color: '#f0ede6',
                                        border: '1px solid rgba(247,184,1,0.25)',
                                    },
                                },
                                error: {
                                    iconTheme: {
                                        primary: '#ff6b6b',
                                        secondary: '#3d348b',
                                    },
                                    style: {
                                        background: '#1a2540',
                                        color: '#f0ede6',
                                        border: '1px solid rgba(255,107,107,0.25)',
                                    },
                                },
                                loading: {
                                    iconTheme: {
                                        primary: '#f7b801',
                                        secondary: 'rgba(247,184,1,0.2)',
                                    },
                                },
                            }}
                        />
                        <App />
                    </ThemeProvider>
                </AuthProvider>
            </BrowserRouter>
        </ErrorBoundary>
    </React.StrictMode>,
);

