"use client";

import React, { useEffect, useState, useRef } from 'react';
import { createPortal } from 'react-dom';

export type ToastType = {
  id: string;
  message: string;
  title?: string;
  duration?: number;
  type?: 'success' | 'error' | 'default';
};

interface ToastProps {
  toast: ToastType;
  onRemove: (id: string) => void;
}

function Toast({ toast, onRemove }: ToastProps) {
  const [isHovered, setIsHovered] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Clear any existing timer
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }

    // Don't start timer if hovered
    if (isHovered) {
      return;
    }

    // Start timer
    const duration = toast.duration || 5000;
    timerRef.current = setTimeout(() => {
      onRemove(toast.id);
    }, duration);

    // Cleanup
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [isHovered, toast.id, toast.duration, onRemove]);

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
    <div 
      className={`${getToastStyles()} rounded-lg p-4 mb-3 min-w-[300px] max-w-[400px] transform transition-all duration-300 ease-in-out animate-[slideInRight_0.3s_ease-out] cursor-pointer`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => {
        if (timerRef.current) {
          clearTimeout(timerRef.current);
        }
        onRemove(toast.id);
      }}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          if (timerRef.current) clearTimeout(timerRef.current);
          onRemove(toast.id);
        }
      }}
    >
      {toast.title && (
        <div className={`font-bold ${getTextColor()} text-sm mb-1 select-none`}>
          {toast.title}
        </div>
      )}
      <div className={`${getMessageColor()} text-sm select-none`}>
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

  // Avoid hydration mismatch by not rendering portal during SSR
  if (!mounted || typeof document === 'undefined') {
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
