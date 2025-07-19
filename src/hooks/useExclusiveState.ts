import { useState, useCallback } from 'react';

/**
 * Custom hook for managing mutually exclusive open/close states
 * When one item is opened, all others are automatically closed
 */
export function useExclusiveState<T extends string | number>(initialOpenId?: T) {
  const [openId, setOpenId] = useState<T | null>(initialOpenId || null);

  const toggle = useCallback((id: T) => {
    setOpenId(current => current === id ? null : id);
  }, []);

  const open = useCallback((id: T) => {
    setOpenId(id);
  }, []);

  const close = useCallback((id?: T) => {
    if (id && openId !== id) return; // Only close if it's the currently open item
    setOpenId(null);
  }, [openId]);

  const isOpen = useCallback((id: T) => openId === id, [openId]);

  return {
    openId,
    toggle,
    open,
    close,
    isOpen,
  };
}

/**
 * Hook specifically for dropdown menus
 */
export function useExclusiveDropdowns() {
  return useExclusiveState<string>();
}

/**
 * Hook specifically for accordion/collapsible sections
 */
export function useExclusiveAccordion() {
  return useExclusiveState<string>();
}

/**
 * Hook for managing modal states (only one modal open at a time)
 */
export function useExclusiveModals() {
  return useExclusiveState<string>();
}