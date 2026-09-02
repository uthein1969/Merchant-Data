import React, { useState, useRef } from 'react';
import { 
  X, 
  Upload, 
  FileSpreadsheet, 
  CheckCircle2, 
  AlertCircle, 
  FileUp, 
  Layers,
  ArrowRight
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { parseExcelFile, ParseResult } from '../utils/excelParser';
import { MerchantRecord } from '../types';

interface ImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImportSuccess: (records: MerchantRecord[], fileName: string, mode: 'replace' | 'append') => void;
}

export const ImportModal: React.FC<ImportModalProps> = ({
  isOpen,
  onClose,
  onImportSuccess,
}) => {
  const [dragOver, setDragOver] = useState(false);
  const [fileBuffer, setFileBuffer] = useState<ArrayBuffer | null>(null);
  const [fileName, setFileName] = useState<string>('');
  const [parseResult, setParseResult] = useState<ParseResult | null>(null);
  const [selectedSheet, setSelectedSheet] = useState<string>('');
  const [importMode, setImportMode] = useState<'replace' | 'append'>('replace');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const processFile = async (file: File) => {
    setIsLoading(true);
    setErrorMsg(null);
    try {
      const buffer = await file.arrayBuffer();
      setFileBuffer(buffer);
      setFileName(file.name);

      const parsed = parseExcelFile(buffer);
      setParseResult(parsed);
      setSelectedSheet(parsed.activeSheet);
    } catch (err: any) {
      console.error('Error parsing excel:', err);
      setErrorMsg(err.message || 'Failed to read Excel file. Please ensure it is a valid .xlsx or .xls spreadsheet.');
      setParseResult(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSheetChange = (sheetName: string) => {
    if (!fileBuffer) return;
    try {
      const parsed = parseExcelFile(fileBuffer, sheetName);
      setParseResult(parsed);
      setSelectedSheet(sheetName);
    } catch (err: any) {
      setErrorMsg('Failed to read worksheet: ' + err.message);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      processFile(file);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFile(e.target.files[0]);
    }
  };

  const handleConfirmImport = () => {
    if (!parseResult || parseResult.records.length === 0) {
      setErrorMsg('No valid merchant records found in the selected sheet.');
      return;
    }

    onImportSuccess(parseResult.records, fileName || 'Imported Excel', importMode);
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.7 }
    });
    handleReset();
    onClose();
  };

  const handleReset = () => {
    setFileBuffer(null);
    setFileName('');
    setParseResult(null);
    setErrorMsg(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div 
        className="bg-white rounded-lg shadow-2xl border border-slate-200 w-full max-w-xl overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="bg-slate-900 text-white px-5 py-3.5 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded bg-indigo-600 flex items-center justify-center text-white">
              <Upload className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-100">
                Import Merchant Excel File
              </h2>
              <p className="text-[11px] text-slate-400">
                Supports .xlsx, .xls, .csv files (any filename)
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto space-y-4 text-xs font-sans">
          {!parseResult ? (
            /* Upload Dropzone */
            <div>
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setDragOver(true);
                }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all flex flex-col items-center justify-center ${
                  dragOver
                    ? 'border-indigo-600 bg-indigo-50/50'
                    : 'border-slate-300 hover:border-indigo-400 hover:bg-slate-50'
                }`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".xlsx, .xls, .csv"
                  onChange={handleFileSelect}
                  className="hidden"
                />

                <div className="w-12 h-12 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center mb-3">
                  <FileUp className="w-6 h-6" />
                </div>

                <p className="text-sm font-semibold text-slate-800">
                  Click to browse or drag & drop Excel file
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  .xlsx, .xls, or .csv spreadsheets
                </p>
                <p className="text-[11px] text-indigo-600 mt-2 bg-indigo-50 px-2.5 py-1 rounded">
                  Matches columns: Merchant Registration Name, Legal Person, NRC Number, Township
                </p>
              </div>

              {isLoading && (
                <div className="mt-3 text-center text-slate-500 animate-pulse">
                  Parsing Excel data and mapping columns...
                </div>
              )}

              {errorMsg && (
                <div className="mt-3 p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded text-xs flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{errorMsg}</span>
                </div>
              )}
            </div>
          ) : (
            /* Parsed File Preview & Options */
            <div className="space-y-4">
              {/* File details card */}
              <div className="bg-slate-50 border border-slate-200 rounded p-3 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <FileSpreadsheet className="w-6 h-6 text-emerald-600" />
                  <div>
                    <span className="font-semibold text-slate-800 block text-xs truncate max-w-xs">
                      {fileName}
                    </span>
                    <span className="text-[11px] text-slate-500 font-mono">
                      {parseResult.records.length} valid merchant rows detected
                    </span>
                  </div>
                </div>
                <button
                  onClick={handleReset}
                  className="text-xs text-indigo-600 hover:text-indigo-800 font-medium cursor-pointer"
                >
                  Choose another file
                </button>
              </div>

              {/* Sheet Selector (if multiple) */}
              {parseResult.sheetNames.length > 1 && (
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-slate-500 tracking-wider flex items-center gap-1">
                    <Layers className="w-3 h-3" />
                    Select Worksheet
                  </label>
                  <select
                    value={selectedSheet}
                    onChange={(e) => handleSheetChange(e.target.value)}
                    className="w-full border border-slate-300 rounded px-2.5 py-1.5 text-xs bg-white focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                  >
                    {parseResult.sheetNames.map((sheet) => (
                      <option key={sheet} value={sheet}>
                        {sheet}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Import Mode Selection */}
              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">
                  Import Mode
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setImportMode('replace')}
                    className={`p-2.5 rounded border text-left cursor-pointer transition-colors ${
                      importMode === 'replace'
                        ? 'border-indigo-600 bg-indigo-50/50 text-indigo-900 font-medium'
                        : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <span className="font-semibold block text-xs">Replace Current Data</span>
                    <span className="text-[10px] text-slate-500">Overwrites existing table records</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setImportMode('append')}
                    className={`p-2.5 rounded border text-left cursor-pointer transition-colors ${
                      importMode === 'append'
                        ? 'border-indigo-600 bg-indigo-50/50 text-indigo-900 font-medium'
                        : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <span className="font-semibold block text-xs">Append / Merge</span>
                    <span className="text-[10px] text-slate-500">Add to existing table records</span>
                  </button>
                </div>
              </div>

              {/* Sample Data Preview Table */}
              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">
                  Preview (First 3 Rows)
                </label>
                <div className="border border-slate-200 rounded overflow-x-auto">
                  <table className="w-full text-left border-collapse text-[11px]">
                    <thead className="bg-slate-100 border-b border-slate-200 text-slate-600 font-bold">
                      <tr>
                        <th className="p-1.5">Registration Name</th>
                        <th className="p-1.5">Legal Person</th>
                        <th className="p-1.5">NRC Number</th>
                        <th className="p-1.5">Township</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-700">
                      {parseResult.records.slice(0, 3).map((r, i) => (
                        <tr key={i} className="hover:bg-slate-50">
                          <td className="p-1.5 font-medium">{r.merchantRegistrationName || r.merchantName}</td>
                          <td className="p-1.5">{r.legalPersonName}</td>
                          <td className="p-1.5 font-mono text-indigo-700 font-bold">{r.idLast6 || '-'}</td>
                          <td className="p-1.5">{r.township}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {errorMsg && (
                <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded text-xs flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{errorMsg}</span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="bg-slate-50 px-5 py-3 border-t border-slate-200 flex justify-between items-center text-xs">
          <button
            onClick={onClose}
            className="px-3.5 py-1.5 border border-slate-300 rounded text-slate-600 hover:bg-slate-100 font-medium transition-colors cursor-pointer"
          >
            Cancel
          </button>

          {parseResult && (
            <button
              onClick={handleConfirmImport}
              className="px-4 py-1.5 bg-indigo-700 hover:bg-indigo-600 text-white rounded font-medium transition-colors shadow-sm flex items-center gap-1.5 cursor-pointer"
            >
              <span>Load {parseResult.records.length} Records</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
