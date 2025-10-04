// Hook for managing admin mode state
import { useState, useEffect } from 'react';
import { isAdmin, toggleAdminMode } from '@/lib/adminStorage';

export const useAdminMode = () => {
  const [adminMode, setAdminMode] = useState(isAdmin());

  useEffect(() => {
    // Listen for keyboard shortcut: Ctrl+Alt+A (Windows/Linux) or Cmd+Option+A (Mac)
    const handleKeyPress = (e: KeyboardEvent) => {
      const isMac = e.metaKey && e.altKey && e.key === 'a';
      const isWindows = e.ctrlKey && e.altKey && e.key === 'a';
      
      if (isMac || isWindows) {
        e.preventDefault();
        const newStatus = toggleAdminMode();
        setAdminMode(newStatus);
        
        // Show notification
        const message = newStatus ? 'Modo Admin Ativado' : 'Modo Admin Desativado';
        console.log(message);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  const setAdmin = (status: boolean) => {
    toggleAdminMode();
    setAdminMode(status);
  };

  return {
    isAdmin: adminMode,
    setAdmin,
    toggle: () => {
      const newStatus = toggleAdminMode();
      setAdminMode(newStatus);
      return newStatus;
    },
  };
};
