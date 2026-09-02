import React, { useRef } from 'react';
import { 
  FileSpreadsheet, 
  Upload, 
  Download, 
  RotateCcw, 
  FileCheck2, 
  Layers,
  ChevronDown
} from 'lucide-react';
import { exportMerchantsToExcel, exportMerchantsToCSV } from '../utils/excelParser';
import { MerchantRecord } from '../types';

interface HeaderProps {
  totalCount: number;
  filteredCount: number;
  sourceName: string;
  onOpenImport: () => void;
  onResetToSample: () => void;
  filteredData: MerchantRecord[];
  allData: MerchantRecord[];
}

export const Header: React.FC<HeaderProps> = ({
  totalCount,
  filteredCount,
  sourceName,
  onOpenImport,
  onResetToSample,
  filteredData,
  allData,
}) => {
  const [showExportMenu, setShowExportMenu] = React.useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowExportMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleExportExcel = (filteredOnly: boolean) => {
    const dataToExport = filteredOnly ? filteredData : allData;
    const suffix = filteredOnly ? `filtered_${dataToExport.length}` : 'all';
    exportMerchantsToExcel(dataToExport, `Merchant_List_${suffix}.xlsx`);
    setShowExportMenu(false);
  };

  const handleExportCSV = (filteredOnly: boolean) => {
    const dataToExport = filteredOnly ? filteredData : allData;
    const suffix = filteredOnly ? `filtered_${dataToExport.length}` : 'all';
    exportMerchantsToCSV(dataToExport, `Merchant_List_${suffix}.csv`);
    setShowExportMenu(false);
  };

  return (
    <header className="bg-slate-900 text-white px-5 py-3 flex flex-wrap justify-between items-center shrink-0 shadow-md border-b border-slate-800 gap-3">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-lg bg-indigo-600/90 flex items-center justify-center text-white shadow-inner ring-1 ring-white/20">
          <FileSpreadsheet className="w-5 h-5" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-base font-bold tracking-tight text-slate-100 font-sans">
              Merchant Data Explorer
            </h1>
            <span className="bg-indigo-950 text-indigo-300 border border-indigo-700/50 text-[10px] font-semibold px-2 py-0.5 rounded-full uppercase tracking-wider">
              High Density
            </span>
          </div>
          <p className="text-xs text-slate-400 flex items-center gap-2">
            <span>Registration & ID Verification System</span>
            <span className="text-slate-600">•</span>
            <span className="text-slate-300 font-mono text-[11px]">
              {filteredCount} of {totalCount} records
            </span>
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button
          id="btn-load-sample"
          onClick={onResetToSample}
          title="Reset back to initial demo dataset from Merchant List.png"
          className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 px-3 py-1.5 rounded text-xs font-medium border border-slate-700 transition-colors shadow-sm cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
          <span>Sample Data</span>
        </button>

        <button
          id="btn-import-excel"
          onClick={onOpenImport}
          className="flex items-center gap-1.5 bg-indigo-700 hover:bg-indigo-600 text-white px-3 py-1.5 rounded text-xs font-medium border border-indigo-500 transition-colors shadow-sm cursor-pointer"
        >
          <Upload className="w-3.5 h-3.5" />
          <span>Import Excel</span>
        </button>

        <div className="relative" ref={menuRef}>
          <button
            id="btn-export-dropdown"
            onClick={() => setShowExportMenu(!showExportMenu)}
            className="flex items-center gap-1.5 bg-emerald-700 hover:bg-emerald-600 text-white px-3 py-1.5 rounded text-xs font-medium border border-emerald-500 transition-colors shadow-sm cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export</span>
            <ChevronDown className="w-3 h-3 ml-0.5 opacity-80" />
          </button>

          {showExportMenu && (
            <div className="absolute right-0 mt-1.5 w-56 bg-white text-slate-800 rounded shadow-xl border border-slate-200 py-1.5 z-50 text-xs font-sans">
              <div className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100">
                Export Filtered ({filteredCount} items)
              </div>
              <button
                onClick={() => handleExportExcel(true)}
                className="w-full text-left px-3 py-1.5 hover:bg-slate-100 flex items-center justify-between cursor-pointer"
              >
                <span>Excel (.xlsx)</span>
                <span className="text-[10px] text-emerald-600 font-mono font-medium">Filtered</span>
              </button>
              <button
                onClick={() => handleExportCSV(true)}
                className="w-full text-left px-3 py-1.5 hover:bg-slate-100 flex items-center justify-between cursor-pointer"
              >
                <span>CSV (.csv)</span>
                <span className="text-[10px] text-emerald-600 font-mono font-medium">Filtered</span>
              </button>

              <div className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400 border-t border-b border-slate-100 mt-1">
                Export All ({totalCount} items)
              </div>
              <button
                onClick={() => handleExportExcel(false)}
                className="w-full text-left px-3 py-1.5 hover:bg-slate-100 flex items-center justify-between cursor-pointer"
              >
                <span>Excel (.xlsx) - Full</span>
                <span className="text-[10px] text-slate-500 font-mono">All {totalCount}</span>
              </button>
              <button
                onClick={() => handleExportCSV(false)}
                className="w-full text-left px-3 py-1.5 hover:bg-slate-100 flex items-center justify-between cursor-pointer"
              >
                <span>CSV (.csv) - Full</span>
                <span className="text-[10px] text-slate-500 font-mono">All {totalCount}</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
