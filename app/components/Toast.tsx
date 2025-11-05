"use client";

import React, { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

export type ToastType = {
  id: string;
  message: string;
  title?: string;
  duration?: number;
  type?: 'success' | 'error' | 'info';
};

interface ToastProps {
  toast: ToastType;
  onRemove: (id: string) => void;
}

function Toast({ toast, onRemove }: ToastProps) {
  // Keep latest onRemove in a ref so parent re-renders (changing the
  // onRemove function identity) don't reset the timeout.
  const onRemoveRef = useRef(onRemove);
  // hold timer id so we can clear it on manual dismiss
  const timerRef = useRef<number | null>(null);
  useEffect(() => {
    onRemoveRef.current = onRemove;
  }, [onRemove]);

  useEffect(() => {
    timerRef.current = window.setTimeout(() => {
      // read latest callback from ref
      onRemoveRef.current(toast.id);
    }, toast.duration || 5000);

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
    // only restart timer when toast id or duration changes
  }, [toast.id, toast.duration]);

  return (
    <div
      className="bg-amber-900/95 backdrop-blur-md border-2 border-amber-800/50 shadow-2xl rounded-lg p-4 mb-3 min-w-[300px] max-w-[400px] transform transition-all duration-300 ease-in-out animate-[slideInRight_0.3s_ease-out] cursor-pointer"
      onClick={() => {
        // clear timer and call latest onRemove
        if (timerRef.current) {
          clearTimeout(timerRef.current);
        }
        onRemoveRef.current(toast.id);
      }}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          if (timerRef.current) clearTimeout(timerRef.current);
          onRemoveRef.current(toast.id);
        }
      }}
    >
      {toast.title && (
        <div className="font-bold text-amber-50 text-sm mb-1 select-none">
          {toast.title}
        </div>
      )}
      <div className="text-amber-200 text-sm select-none">
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
  // Avoid referencing `document` during SSR — return null until `document`
  // is available. This file is a client component ("use client") but the
  // module can still be imported during server build steps, so guard here.
  if (typeof document === 'undefined') return null;

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
