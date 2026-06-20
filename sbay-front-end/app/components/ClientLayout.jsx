'use client';

import { ToastProvider } from '@/app/components/Toast';

export default function ClientLayout({ children }) {
  return <ToastProvider>{children}</ToastProvider>;
}
