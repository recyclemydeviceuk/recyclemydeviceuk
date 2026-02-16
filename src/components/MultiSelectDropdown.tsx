import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check, X } from 'lucide-react';

interface Option {
  value: string;
  label: string;
}

interface MultiSelectDropdownProps {
  options: Option[];
  value: string[];
  onChange: (values: string[]) => void;
  placeholder?: string;
  error?: boolean;
  disabled?: boolean;
  className?: string;
  label?: string;
}

const MultiSelectDropdown: React.FC<MultiSelectDropdownProps> = ({
  options,
  value,
  onChange,
  placeholder = 'Select options',
  error = false,
  disabled = false,
  className = '',
  label,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

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

  const handleToggleOption = (optionValue: string) => {
    if (value.includes(optionValue)) {
      // Remove from selection
      onChange(value.filter(v => v !== optionValue));
    } else {
      // Add to selection
      onChange([...value, optionValue]);
    }
  };

  const handleRemoveTag = (optionValue: string, e: React.MouseEvent) => {
    e.stopPropagation();
    onChange(value.filter(v => v !== optionValue));
  };

  const selectedOptions = options.filter(opt => value.includes(opt.value));

  return (
    <div ref={dropdownRef} className={`relative ${className}`}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className={`w-full min-h-[48px] flex items-center justify-between px-4 py-2.5 bg-white border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1b981b] transition-all ${
          error 
            ? 'border-red-300 bg-red-50' 
            : isOpen 
            ? 'border-[#1b981b]' 
            : 'border-gray-200 hover:border-gray-300'
        } ${disabled ? 'opacity-50 cursor-not-allowed bg-gray-50' : 'cursor-pointer'}`}
      >
        <div className="flex-1 flex flex-wrap gap-2 items-center">
          {selectedOptions.length === 0 ? (
            <span className="text-sm text-gray-500">{placeholder}</span>
          ) : (
            selectedOptions.map((option) => (
              <span
                key={option.value}
                className="inline-flex items-center px-3 py-1 bg-[#1b981b] text-white rounded-lg text-sm font-medium"
              >
                {option.label}
                <button
                  type="button"
                  onClick={(e) => handleRemoveTag(option.value, e)}
                  className="ml-2 hover:text-red-200 transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </span>
            ))
          )}
        </div>
        <ChevronDown 
          className={`w-5 h-5 text-gray-500 transition-transform duration-200 ml-2 flex-shrink-0 ${
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
            <>
              {/* Select/Deselect All */}
              <div className="sticky top-0 bg-gray-50 border-b-2 border-gray-200">
                <button
                  type="button"
                  onClick={() => {
                    if (value.length === options.length) {
                      onChange([]);
                    } else {
                      onChange(options.map(opt => opt.value));
                    }
                  }}
                  className="w-full px-4 py-2.5 text-left text-sm font-semibold text-gray-700 hover:bg-gray-100 transition-colors"
                >
                  {value.length === options.length ? 'Deselect All' : 'Select All'}
                </button>
              </div>

              {/* Options */}
              {options.map((option) => {
                const isSelected = value.includes(option.value);
                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => handleToggleOption(option.value)}
                    className={`w-full px-4 py-3 text-left transition-colors flex items-center justify-between ${
                      isSelected
                        ? 'bg-[#1b981b]/10 text-[#1b981b] hover:bg-[#1b981b]/20'
                        : 'text-gray-900 hover:bg-gray-50'
                    }`}
                  >
                    <span className="font-medium text-sm">{option.label}</span>
                    <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${
                      isSelected 
                        ? 'bg-[#1b981b] border-[#1b981b]' 
                        : 'border-gray-300'
                    }`}>
                      {isSelected && <Check className="w-3.5 h-3.5 text-white" />}
                    </div>
                  </button>
                );
              })}
            </>
          )}
        </div>
      )}

      {/* Selection Count */}
      {selectedOptions.length > 0 && !isOpen && (
        <div className="absolute -top-2 right-12 bg-[#1b981b] text-white text-xs font-bold px-2 py-0.5 rounded-full">
          {selectedOptions.length}
        </div>
      )}
    </div>
  );
};

export default MultiSelectDropdown;
