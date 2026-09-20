import { useEffect } from 'react';

/**
 * SiteProtection Component
 * Blocks right-click context menu, developer tool keyboard shortcuts,
 * and completely disables Drag & Drop site-wide for all elements/text/images.
 */
const SiteProtection = () => {
  useEffect(() => {
    // 1. Block Context Menu (Right Click)
    const handleContextMenu = (e) => {
      e.preventDefault();
      return false;
    };

    // 2. Block Inspect & Developer Tools Keyboard Shortcuts
    const handleKeyDown = (e) => {
      // F12 key
      if (e.keyCode === 123 || e.key === 'F12') {
        e.preventDefault();
        e.stopPropagation();
        return false;
      }

      const isCmdOrCtrl = e.ctrlKey || e.metaKey;

      if (isCmdOrCtrl) {
        const key = (e.key || '').toLowerCase();

        // Ctrl + Shift + I (Inspect)
        // Ctrl + Shift + J (Console)
        // Ctrl + Shift + C (Inspect Element)
        // Ctrl + U (View Source)
        // Ctrl + S (Save Webpage)
        if (
          (e.shiftKey && (key === 'i' || key === 'j' || key === 'c')) ||
          key === 'u' ||
          key === 's'
        ) {
          e.preventDefault();
          e.stopPropagation();
          return false;
        }
      }
    };

    // 3. Block Dragging Completely (All Elements, Text, Links, Media)
    const handleDragStart = (e) => {
      // Allow file inputs to receive native file drag if targeted
      if (e.target && e.target.tagName === 'INPUT' && e.target.type === 'file') {
        return true;
      }
      e.preventDefault();
      return false;
    };

    // 4. Block Drop Event Globally (except file inputs)
    const handleDrop = (e) => {
      if (e.target && e.target.tagName === 'INPUT' && e.target.type === 'file') {
        return true;
      }
      e.preventDefault();
      return false;
    };

    const handleDragOver = (e) => {
      if (e.target && e.target.tagName === 'INPUT' && e.target.type === 'file') {
        return true;
      }
      e.preventDefault();
      return false;
    };

    window.addEventListener('contextmenu', handleContextMenu);
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('dragstart', handleDragStart);
    window.addEventListener('dragover', handleDragOver);
    window.addEventListener('drop', handleDrop);

    return () => {
      window.removeEventListener('contextmenu', handleContextMenu);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('dragstart', handleDragStart);
      window.removeEventListener('dragover', handleDragOver);
      window.removeEventListener('drop', handleDrop);
    };
  }, []);

  return null;
};

export default SiteProtection;
