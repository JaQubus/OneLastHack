"use client";

import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

export type ToastType = {
  id: string;
  message: string;
  title?: string;
  duration?: number;
};

interface ToastProps {
  toast: ToastType;
  onRemove: (id: string) => void;
}

function Toast({ toast, onRemove }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onRemove(toast.id);
    }, toast.duration || 5000);

    return () => clearTimeout(timer);
  }, [toast.id, toast.duration, onRemove]);

  return (
    <div className="bg-amber-900/95 backdrop-blur-md border-2 border-amber-800/50 shadow-2xl rounded-lg p-4 mb-3 min-w-[300px] max-w-[400px] transform transition-all duration-300 ease-in-out animate-[slideInRight_0.3s_ease-out]">
      {toast.title && (
        <div className="font-bold text-amber-50 text-sm mb-1">
          {toast.title}
        </div>
      )}
      <div className="text-amber-200 text-sm">
        {toast.message}
      </div>
    </div>
  );
}

interface ToastContainerProps {
  toasts: ToastType[];
  onRemove: (id: string) => void;
}

export default function ToastContainer({ toasts, onRemove }: ToastContainerProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return createPortal(
    <div className="fixed top-32 right-6 z-50 pointer-events-none">
      <div className="pointer-events-auto">
        {toasts.map((toast) => (
          <Toast key={toast.id} toast={toast} onRemove={onRemove} />
        ))}
      </div>
    </div>,
    document.body
  );
}
