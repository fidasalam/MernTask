import { useEffect } from 'react';

function useUnsavedChangesWarning(message, isDirty) {
  useEffect(() => {
    const handleBeforeUnload = (event) => {
      if (isDirty) {
        console.log('Unsaved changes detected:', message); // Log the message to the console
        event.preventDefault();
        event.returnValue = message; // Required for modern browsers
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [isDirty, message]);
}

export default useUnsavedChangesWarning;
