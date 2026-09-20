import { useEffect } from 'react';

/**
 * SiteProtection Component
 * Blocks right-click context menu, developer tool keyboard shortcuts (F12, Ctrl+U, Ctrl+Shift+I, etc.),
 * and prevents dragging media assets to protect website content.
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
      // Allow F12 / Shortcuts inside input fields if needed, or enforce site-wide
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

    // 3. Block Dragging Images / Videos
    const handleDragStart = (e) => {
      if (e.target.tagName === 'IMG' || e.target.tagName === 'VIDEO') {
        e.preventDefault();
        return false;
      }
    };

    window.addEventListener('contextmenu', handleContextMenu);
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('dragstart', handleDragStart);

    return () => {
      window.removeEventListener('contextmenu', handleContextMenu);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('dragstart', handleDragStart);
    };
  }, []);

  return null;
};

export default SiteProtection;
