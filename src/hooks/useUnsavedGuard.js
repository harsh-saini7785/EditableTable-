import { useEffect } from 'react';

// Warn the user before leaving the page if there are unsaved edits.
export function useUnsavedGuard(hasUnsaved) {
  useEffect(() => {
    if (!hasUnsaved) return undefined;
    const handler = (e) => {
      e.preventDefault();
      e.returnValue = '';
      return '';
    };
    window.addEventListener('beforeunload', handler);
    return () => window.removeEventListener('beforeunload', handler);
  }, [hasUnsaved]);
}
