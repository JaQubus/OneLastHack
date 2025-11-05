"use client";

<<<<<<< HEAD
import React, { useEffect, useRef, useState } from 'react';
=======
import React, { useEffect, useState } from 'react';
>>>>>>> bd0f805 (Refactor date handling in GameTimeProvider and MapPage for consistency, enhance ProgressBar display precision)
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

  const getToastStyles = () => {
    switch (toast.type) {
      case 'success':
        return 'bg-green-900/95 backdrop-blur-md border-2 border-green-700/50 shadow-2xl';
      case 'error':
        return 'bg-red-900/95 backdrop-blur-md border-2 border-red-700/50 shadow-2xl';
      default:
        return 'bg-amber-900/95 backdrop-blur-md border-2 border-amber-800/50 shadow-2xl';
    }
  };

  const getTextColor = () => {
    switch (toast.type) {
      case 'success':
        return 'text-green-50';
      case 'error':
        return 'text-red-50';
      default:
        return 'text-amber-50';
    }
  };

  const getMessageColor = () => {
    switch (toast.type) {
      case 'success':
        return 'text-green-200';
      case 'error':
        return 'text-red-200';
      default:
        return 'text-amber-200';
    }
  };

  return (
<<<<<<< HEAD
    <div
      className={`${getToastStyles()} rounded-lg p-4 mb-3 min-w-[300px] max-w-[400px] transform transition-all duration-300 ease-in-out animate-[slideInRight_0.3s_ease-out] cursor-pointer`}
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
        <div className={`font-bold ${getTextColor()} text-sm mb-1 select-none`}>
          {toast.title}
        </div>
      )}
      <div className={`${getMessageColor()} text-sm select-none`}>
=======
    <div className="bg-amber-900/95 backdrop-blur-md border-2 border-amber-800/50 shadow-2xl rounded-lg p-4 mb-3 min-w-[300px] max-w-[400px] transform transition-all duration-300 ease-in-out animate-[slideInRight_0.3s_ease-out]">
      {toast.title && (
        <div className="font-bold text-amber-50 text-sm mb-1">
          {toast.title}
        </div>
      )}
      <div className="text-amber-200 text-sm">
>>>>>>> bd0f805 (Refactor date handling in GameTimeProvider and MapPage for consistency, enhance ProgressBar display precision)
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

<<<<<<< HEAD
  // Avoid hydration mismatch by not rendering portal during SSR
  if (!mounted || typeof document === 'undefined') {
=======
  if (!mounted) {
>>>>>>> bd0f805 (Refactor date handling in GameTimeProvider and MapPage for consistency, enhance ProgressBar display precision)
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
