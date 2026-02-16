import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';

interface Option {
  value: string;
  label: string;
  logo?: string;
}

interface SelectDropdownProps {
  options: Option[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  error?: boolean;
  disabled?: boolean;
  className?: string;
  showLogos?: boolean;
}

const SelectDropdown: React.FC<SelectDropdownProps> = ({
  options,
  value,
  onChange,
  placeholder = 'Select an option',
  error = false,
  disabled = false,
  className = '',
  showLogos = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find(opt => opt.value === value);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleSelect = (optionValue: string) => {
    onChange(optionValue);
    setIsOpen(false);
  };

  return (
    <div ref={dropdownRef} className={`relative ${className}`}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className={`w-full flex items-center justify-between px-4 py-3 bg-white border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1b981b] transition-all ${
          error 
            ? 'border-red-300 bg-red-50' 
            : isOpen 
            ? 'border-[#1b981b]' 
            : 'border-gray-200 hover:border-gray-300'
        } ${disabled ? 'opacity-50 cursor-not-allowed bg-gray-50' : 'cursor-pointer'}`}
      >
        <div className="flex items-center space-x-3 flex-1">
          {showLogos && selectedOption?.logo && (
            <img 
              src={selectedOption.logo} 
              alt={selectedOption.label}
              className="w-6 h-6 rounded object-contain"
            />
          )}
          <span className={`font-medium text-sm ${selectedOption ? 'text-gray-900' : 'text-gray-500'}`}>
            {selectedOption ? selectedOption.label : placeholder}
          </span>
        </div>
        <ChevronDown 
          className={`w-5 h-5 text-gray-500 transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`} 
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && !disabled && (
        <div className="absolute top-full mt-2 w-full bg-white border-2 border-gray-200 rounded-xl shadow-xl z-50 max-h-64 overflow-y-auto">
          {options.length === 0 ? (
            <div className="px-4 py-3 text-sm text-gray-500 text-center">
              No options available
            </div>
          ) : (
            options.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => handleSelect(option.value)}
                className={`w-full px-4 py-3 text-left transition-colors flex items-center justify-between ${
                  value === option.value
                    ? 'bg-[#1b981b] text-white hover:bg-[#158515]'
                    : 'text-gray-900 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center space-x-3 flex-1">
                  {showLogos && option.logo && (
                    <img 
                      src={option.logo} 
                      alt={option.label}
                      className="w-6 h-6 rounded object-contain"
                    />
                  )}
                  <span className="font-medium text-sm">{option.label}</span>
                </div>
                {value === option.value && (
                  <Check className="w-5 h-5" />
                )}
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default SelectDropdown;
