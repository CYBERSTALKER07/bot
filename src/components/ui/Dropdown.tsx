import React from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '../../lib/cva';
import { useExclusiveDropdowns } from '../../hooks/useExclusiveState';

interface DropdownItem {
  label: string;
  onClick: () => void;
  disabled?: boolean;
}

interface DropdownProps {
  id: string;
  trigger: React.ReactNode;
  items: DropdownItem[];
  className?: string;
  position?: 'bottom-left' | 'bottom-right' | 'top-left' | 'top-right';
}

interface DropdownGroupProps {
  children: React.ReactElement<DropdownProps>[];
}

// Context to share the exclusive state across multiple dropdowns
const DropdownContext = React.createContext<{
  isOpen: (id: string) => boolean;
  toggle: (id: string) => void;
  close: () => void;
} | null>(null);

export function DropdownGroup({ children }: DropdownGroupProps) {
  const { isOpen, toggle, close } = useExclusiveDropdowns();

  return (
    <DropdownContext.Provider value={{ isOpen, toggle, close }}>
      <div className="relative">
        {children}
      </div>
    </DropdownContext.Provider>
  );
}

export function Dropdown({ 
  id, 
  trigger, 
  items, 
  className = '', 
  position = 'bottom-left' 
}: DropdownProps) {
  const context = React.useContext(DropdownContext);
  
  if (!context) {
    throw new Error('Dropdown must be used within a DropdownGroup');
  }

  const { isOpen, toggle, close } = context;
  const dropdownOpen = isOpen(id);

  const positionClasses = {
    'bottom-left': 'top-full left-0 mt-1',
    'bottom-right': 'top-full right-0 mt-1',
    'top-left': 'bottom-full left-0 mb-1',
    'top-right': 'bottom-full right-0 mb-1',
  };

  // Close dropdown when clicking outside
  React.useEffect(() => {
    if (!dropdownOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (!target.closest(`[data-dropdown="${id}"]`)) {
        close();
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [dropdownOpen, close, id]);

  return (
    <div className={cn('relative inline-block', className)} data-dropdown={id}>
      <button
        onClick={() => toggle(id)}
        className={cn(
          'flex items-center gap-2 px-3 py-2 rounded-lg transition-colors',
          'hover:bg-gray-100 dark:hover:bg-gray-700',
          dropdownOpen && 'bg-gray-100 dark:bg-gray-700'
        )}
        aria-expanded={dropdownOpen}
        aria-haspopup="true"
      >
        {trigger}
        <ChevronDown 
          className={cn(
            'h-4 w-4 transition-transform duration-200',
            dropdownOpen && 'rotate-180'
          )} 
        />
      </button>

      {dropdownOpen && (
        <div
          className={cn(
            'absolute z-50 min-w-[160px] py-1 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700',
            positionClasses[position]
          )}
          role="menu"
        >
          {items.map((item, index) => (
            <button
              key={index}
              onClick={() => {
                if (!item.disabled) {
                  item.onClick();
                  close();
                }
              }}
              disabled={item.disabled}
              className={cn(
                'w-full px-3 py-2 text-left text-sm transition-colors',
                'hover:bg-gray-100 dark:hover:bg-gray-700',
                'disabled:opacity-50 disabled:cursor-not-allowed',
                'first:rounded-t-lg last:rounded-b-lg'
              )}
              role="menuitem"
            >
              {item.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// Example usage component
export function DropdownExample() {
  const handleAction = (action: string) => {
    console.log(`Action: ${action}`);
  };

  return (
    <DropdownGroup>
      <div className="flex gap-4 p-4">
        <Dropdown
          id="actions"
          trigger="Actions"
          items={[
            { label: 'Edit', onClick: () => handleAction('edit') },
            { label: 'Delete', onClick: () => handleAction('delete') },
            { label: 'Share', onClick: () => handleAction('share') },
          ]}
        />
        
        <Dropdown
          id="settings"
          trigger="Settings"
          items={[
            { label: 'Profile', onClick: () => handleAction('profile') },
            { label: 'Preferences', onClick: () => handleAction('preferences') },
            { label: 'Logout', onClick: () => handleAction('logout') },
          ]}
        />
        
        <Dropdown
          id="more"
          trigger="More Options"
          position="bottom-right"
          items={[
            { label: 'Export', onClick: () => handleAction('export') },
            { label: 'Import', onClick: () => handleAction('import') },
            { label: 'Help', onClick: () => handleAction('help') },
          ]}
        />
      </div>
    </DropdownGroup>
  );
}