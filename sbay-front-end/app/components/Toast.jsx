'use client';

import { useState, useCallback, useRef, createContext, useContext } from 'react';

const ToastContext = createContext(null);

const icons = {
  success: 'fa-check-circle',
  error: 'fa-circle-exclamation',
  info: 'fa-circle-info',
  warning: 'fa-triangle-exclamation',
};

const colors = {
  success: 'var(--accent3)',
  error: '#ef4444',
  info: 'var(--accent)',
  warning: '#f59e0b',
};

export function ToastProvider({ children }) {
  const [msg, setMsg] = useState('');
  const [type, setType] = useState('success');
  const [show, setShow] = useState(false);
  const timer = useRef(null);
  const [exiting, setExiting] = useState(false);

  const showToast = useCallback((message, toastType) => {
    const t = toastType || (typeof message === 'string' && message.startsWith('❌') ? 'error' : message.startsWith('⚠') ? 'warning' : message.startsWith('ℹ') ? 'info' : 'success');
    const cleaned = typeof message === 'string' ? message.replace(/^(\p{Emoji}+\uFE0F?\s*)/u, '').trim() : message;
    setMsg(cleaned || message);
    setType(t);
    setExiting(false);
    setShow(true);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      setExiting(true);
      setTimeout(() => setShow(false), 200);
    }, 2600);
  }, []);

  return (
    <ToastContext.Provider value={showToast}>
      {children}
      {show && (
        <div
          className={`fixed bottom-6 right-6 z-[9999] bg-[var(--card2)] border border-[var(--border)] rounded-xl px-5 py-3.5 flex items-center gap-3 text-sm font-medium text-[var(--text)] shadow-[0_12px_40px_rgba(0,0,0,.5)] transition-all duration-[300ms] ease-[cubic-bezier(.34,1.56,.64,1)] ${exiting ? 'translate-x-[120%] opacity-0' : 'translate-x-0 opacity-100'}`}
        >
          <i className={`fa-solid ${icons[type] || icons.success} text-lg`} style={{ color: colors[type] || colors.success }} />
          <span>{msg}</span>
        </div>
      )}
    </ToastContext.Provider>
  );
}

export function useToast() {
  return useContext(ToastContext);
}
