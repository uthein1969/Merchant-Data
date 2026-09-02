import React from 'react';
import { FilterState } from '../types';
import { Search, X, SlidersHorizontal, CheckCircle2, Clock, AlertCircle } from 'lucide-react';

interface FilterBarProps {
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  townships: { name: string; count: number }[];
  totalFiltered: number;
  totalRecords: number;
  onResetFilters: () => void;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  filters,
  setFilters,
  townships,
  totalFiltered,
  totalRecords,
  onResetFilters,
}) => {
  const [showAdvanced, setShowAdvanced] = React.useState(false);

  const hasActiveFilters = Boolean(
    filters.registrationName ||
    filters.legalPerson ||
    filters.idLast6 ||
    filters.township ||
    filters.globalSearch ||
    filters.status ||
    filters.reviewStatus ||
    filters.phone
  );

  const activeFilterCount = [
    filters.registrationName,
    filters.legalPerson,
    filters.idLast6,
    filters.township,
    filters.globalSearch,
    filters.status,
    filters.reviewStatus,
    filters.phone,
  ].filter(Boolean).length;

  const handleInputChange = (field: keyof FilterState, value: string) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
  };

  const handleClearField = (field: keyof FilterState) => {
    setFilters((prev) => ({ ...prev, [field]: '' }));
  };

  return (
    <div className="bg-white border-b border-slate-200 shrink-0 shadow-xs">
      {/* Primary 4 Required Search Columns */}
      <div className="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
        {/* 1. Merchant Registration Name */}
        <div className="space-y-1">
          <div className="flex justify-between items-center">
            <label 
              htmlFor="filter-reg-name" 
              className="text-[10px] uppercase font-bold text-slate-500 tracking-wider flex items-center gap-1"
            >
              <span>Merchant Registration Name</span>
            </label>
            {filters.registrationName && (
              <button 
                onClick={() => handleClearField('registrationName')}
                className="text-[10px] text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                Clear
              </button>
            )}
          </div>
          <div className="relative">
            <input
              id="filter-reg-name"
              type="text"
              placeholder="Search company or store name..."
              value={filters.registrationName}
              onChange={(e) => handleInputChange('registrationName', e.target.value)}
              className="w-full border border-slate-300 rounded px-2.5 py-1.5 text-sm text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 transition-shadow pr-7"
            />
            {filters.registrationName && (
              <button
                onClick={() => handleClearField('registrationName')}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* 2. Name of the Legal Person */}
        <div className="space-y-1">
          <div className="flex justify-between items-center">
            <label 
              htmlFor="filter-legal-person" 
              className="text-[10px] uppercase font-bold text-slate-500 tracking-wider flex items-center gap-1"
            >
              <span>Name of the Legal Person</span>
            </label>
            {filters.legalPerson && (
              <button 
                onClick={() => handleClearField('legalPerson')}
                className="text-[10px] text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                Clear
              </button>
            )}
          </div>
          <div className="relative">
            <input
              id="filter-legal-person"
              type="text"
              placeholder="e.g. U Aung Kyaw, Daw Thin..."
              value={filters.legalPerson}
              onChange={(e) => handleInputChange('legalPerson', e.target.value)}
              className="w-full border border-slate-300 rounded px-2.5 py-1.5 text-sm text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 transition-shadow pr-7"
            />
            {filters.legalPerson && (
              <button
                onClick={() => handleClearField('legalPerson')}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* 3. NRC Number (Full or Last 6 Digits) */}
        <div className="space-y-1">
          <div className="flex justify-between items-center">
            <label 
              htmlFor="filter-id-number" 
              className="text-[10px] uppercase font-bold text-slate-500 tracking-wider flex items-center gap-1"
            >
              <span>NRC Number</span>
              <span className="text-[9px] text-slate-400 font-normal normal-case">(or Last 6 Digits)</span>
            </label>
            {filters.idLast6 && (
              <button 
                onClick={() => handleClearField('idLast6')}
                className="text-[10px] text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                Clear
              </button>
            )}
          </div>
          <div className="relative">
            <input
              id="filter-id-number"
              type="text"
              placeholder="e.g. 102834, 083178 or full NRC"
              value={filters.idLast6}
              onChange={(e) => handleInputChange('idLast6', e.target.value)}
              className="w-full border border-slate-300 rounded px-2.5 py-1.5 text-sm font-mono text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 transition-shadow pr-7 tracking-wide"
            />
            {filters.idLast6 && (
              <button
                onClick={() => handleClearField('idLast6')}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* 4. Township */}
        <div className="space-y-1">
          <div className="flex justify-between items-center">
            <label 
              htmlFor="filter-township" 
              className="text-[10px] uppercase font-bold text-slate-500 tracking-wider flex items-center gap-1"
            >
              <span>Township</span>
            </label>
            {filters.township && (
              <button 
                onClick={() => handleClearField('township')}
                className="text-[10px] text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                Clear
              </button>
            )}
          </div>
          <select
            id="filter-township"
            value={filters.township}
            onChange={(e) => handleInputChange('township', e.target.value)}
            className="w-full border border-slate-300 rounded px-2 py-1.5 text-sm text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 bg-white transition-shadow cursor-pointer"
          >
            <option value="">All Townships ({townships.reduce((acc, t) => acc + t.count, 0)})</option>
            {townships.map((t) => (
              <option key={t.name} value={t.name}>
                {t.name} ({t.count})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Auxiliary Controls Bar */}
      <div className="px-4 py-2 bg-slate-50/75 border-t border-slate-200 flex flex-wrap items-center justify-between gap-2 text-xs">
        <div className="flex flex-wrap items-center gap-2">
          {/* Advanced toggle */}
          <button
            id="btn-toggle-advanced-filters"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className={`flex items-center gap-1 px-2.5 py-1 rounded text-xs font-medium border transition-colors cursor-pointer ${
              showAdvanced || filters.globalSearch || filters.status || filters.reviewStatus || filters.phone
                ? 'bg-indigo-50 text-indigo-700 border-indigo-200'
                : 'bg-white text-slate-600 border-slate-300 hover:bg-slate-50'
            }`}
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>More Filters</span>
            {(filters.globalSearch || filters.status || filters.reviewStatus || filters.phone) && (
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 ml-0.5"></span>
            )}
          </button>

          {/* Quick status filters */}
          <div className="flex items-center gap-1 border-l border-slate-300 pl-2">
            <span className="text-[10px] uppercase font-bold text-slate-400 mr-1">Status:</span>
            <button
              onClick={() => handleInputChange('reviewStatus', filters.reviewStatus === 'Approved' ? '' : 'Approved')}
              className={`px-2 py-0.5 rounded text-[11px] font-medium border transition-colors cursor-pointer flex items-center gap-1 ${
                filters.reviewStatus === 'Approved'
                  ? 'bg-emerald-100 text-emerald-800 border-emerald-300 font-semibold'
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100'
              }`}
            >
              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
              <span>Approved</span>
            </button>
            <button
              onClick={() => handleInputChange('reviewStatus', filters.reviewStatus === 'Pending' ? '' : 'Pending')}
              className={`px-2 py-0.5 rounded text-[11px] font-medium border transition-colors cursor-pointer flex items-center gap-1 ${
                filters.reviewStatus === 'Pending'
                  ? 'bg-amber-100 text-amber-800 border-amber-300 font-semibold'
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100'
              }`}
            >
              <Clock className="w-3 h-3 text-amber-600" />
              <span>Pending</span>
            </button>
          </div>

          {/* Clear all active filters */}
          {hasActiveFilters && (
            <button
              id="btn-clear-all-filters"
              onClick={onResetFilters}
              className="flex items-center gap-1 text-slate-500 hover:text-red-600 px-2 py-1 rounded hover:bg-red-50 text-xs transition-colors cursor-pointer ml-1"
            >
              <X className="w-3.5 h-3.5" />
              <span>Reset Filters ({activeFilterCount})</span>
            </button>
          )}
        </div>

        <div className="text-slate-500 text-[11px]">
          Matching: <span className="font-semibold text-slate-800 font-mono">{totalFiltered}</span> of{' '}
          <span className="font-mono">{totalRecords}</span> merchants
        </div>
      </div>

      {/* Advanced Filter Expansion */}
      {showAdvanced && (
        <div className="p-4 bg-slate-50 border-t border-slate-200 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          {/* Global Search */}
          <div className="space-y-1">
            <label className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">
              Global Search (All Columns)
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search any text, license, address..."
                value={filters.globalSearch}
                onChange={(e) => handleInputChange('globalSearch', e.target.value)}
                className="w-full border border-slate-300 rounded px-2.5 py-1.5 text-xs text-slate-800 bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
              {filters.globalSearch && (
                <button
                  onClick={() => handleClearField('globalSearch')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>
          </div>

          {/* Phone Search */}
          <div className="space-y-1">
            <label className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">
              Phone Number
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="e.g. 09783361839..."
                value={filters.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                className="w-full border border-slate-300 rounded px-2.5 py-1.5 text-xs text-slate-800 bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
              {filters.phone && (
                <button
                  onClick={() => handleClearField('phone')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>
          </div>

          {/* Status Filter */}
          <div className="space-y-1">
            <label className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">
              Account Status
            </label>
            <select
              value={filters.status}
              onChange={(e) => handleInputChange('status', e.target.value)}
              className="w-full border border-slate-300 rounded px-2 py-1.5 text-xs text-slate-800 bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
            >
              <option value="">All Statuses</option>
              <option value="Enabled">Enabled</option>
              <option value="Disabled">Disabled</option>
            </select>
          </div>

          {/* Review Status Filter */}
          <div className="space-y-1">
            <label className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">
              Review Status
            </label>
            <select
              value={filters.reviewStatus}
              onChange={(e) => handleInputChange('reviewStatus', e.target.value)}
              className="w-full border border-slate-300 rounded px-2 py-1.5 text-xs text-slate-800 bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
            >
              <option value="">All Review Statuses</option>
              <option value="Approved">Approved</option>
              <option value="Pending">Pending</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>
        </div>
      )}
    </div>
  );
};
