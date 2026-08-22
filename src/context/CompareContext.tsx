"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export const MAX_COMPARE = 3;

interface CompareContextValue {
  selectedIds: string[];
  isSelected: (id: string) => boolean;
  isFull: boolean;
  toggle: (id: string) => void;
  remove: (id: string) => void;
  clear: () => void;
  isModalOpen: boolean;
  openModal: () => void;
  closeModal: () => void;
}

const CompareContext = createContext<CompareContextValue | null>(null);

export function CompareProvider({ children }: { children: ReactNode }) {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const toggle = useCallback((id: string) => {
    setSelectedIds((prev) => {
      if (prev.includes(id)) return prev.filter((existing) => existing !== id);
      if (prev.length >= MAX_COMPARE) return prev;
      return [...prev, id];
    });
  }, []);

  const remove = useCallback((id: string) => {
    setSelectedIds((prev) => prev.filter((existing) => existing !== id));
  }, []);

  const clear = useCallback(() => {
    setSelectedIds([]);
    setIsModalOpen(false);
  }, []);

  const openModal = useCallback(() => setIsModalOpen(true), []);
  const closeModal = useCallback(() => setIsModalOpen(false), []);

  const value = useMemo<CompareContextValue>(() => {
    const idsSet = new Set(selectedIds);
    return {
      selectedIds,
      isSelected: (id) => idsSet.has(id),
      isFull: selectedIds.length >= MAX_COMPARE,
      toggle,
      remove,
      clear,
      isModalOpen,
      openModal,
      closeModal,
    };
  }, [selectedIds, isModalOpen, toggle, remove, clear, openModal, closeModal]);

  return (
    <CompareContext.Provider value={value}>{children}</CompareContext.Provider>
  );
}

export function useCompare() {
  const ctx = useContext(CompareContext);
  if (!ctx) {
    throw new Error("useCompare must be used within a CompareProvider");
  }
  return ctx;
}
