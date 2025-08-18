import React from 'react';
import { Category } from '../types';

interface FilterButtonsProps {
  currentFilter: Category | 'ALL';
  onFilterChange: (filter: Category | 'ALL') => void;
}

const FilterButton: React.FC<{
    label: string;
    filter: Category | 'ALL';
    currentFilter: Category | 'ALL';
    onFilterChange: (filter: Category | 'ALL') => void;
}> = ({ label, filter, currentFilter, onFilterChange}) => {
    const isActive = filter === currentFilter;
    const baseClasses = "px-4 py-1.5 text-sm font-semibold rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[--primary-color] focus:ring-offset-[--background-dark]";
    const activeClasses = "bg-[--primary-color] text-black shadow-[0_0_10px_var(--primary-color)]";
    const inactiveClasses = "bg-gray-800/50 text-gray-300 hover:bg-gray-700/50 hover:text-white";

    return (
        <button
          onClick={() => onFilterChange(filter)}
          className={`${baseClasses} ${isActive ? activeClasses : inactiveClasses}`}
        >
          {label}
        </button>
    );
}

const FilterButtons: React.FC<FilterButtonsProps> = ({ currentFilter, onFilterChange }) => {
  const filters: { label: string; filter: Category | 'ALL' }[] = [
    { label: 'All Records', filter: 'ALL' },
    { label: 'User Data', filter: Category.USER },
    { label: 'AI Data', filter: Category.AI },
    { label: 'System Data', filter: Category.SYSTEM },
  ];

  return (
    <div className="flex flex-wrap justify-center gap-3">
      {filters.map(({label, filter}) => (
        <FilterButton 
            key={filter}
            label={label}
            filter={filter}
            currentFilter={currentFilter}
            onFilterChange={onFilterChange}
        />
      ))}
    </div>
  );
};

export default FilterButtons;