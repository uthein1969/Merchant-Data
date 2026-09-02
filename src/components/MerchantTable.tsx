import React, { useState } from 'react';
import { MerchantRecord, SortField, SortOrder } from '../types';
import { 
  ArrowUpDown, 
  ArrowUp, 
  ArrowDown, 
  Copy, 
  Check, 
  ExternalLink,
  Eye,
  MapPin,
  PhoneCall,
  FileBadge
} from 'lucide-react';
import { convertMyanmarDigitsToEnglish } from '../utils/idUtils';

interface MerchantTableProps {
  records: MerchantRecord[];
  allRecordsCount: number;
  sourceName: string;
  searchQueries: {
    regName: string;
    legalPerson: string;
    idLast6: string;
    globalSearch: string;
  };
  sortField: SortField;
  sortOrder: SortOrder;
  onSort: (field: SortField) => void;
  onSelectRecord: (record: MerchantRecord) => void;
  currentPage: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
}

// Helper to highlight matching text
const HighlightText: React.FC<{ text: string; highlight: string; className?: string }> = ({ 
  text, 
  highlight,
  className = ''
}) => {
  if (!text) return <span>-</span>;
  if (!highlight || !highlight.trim()) return <span className={className}>{text}</span>;

  const escaped = highlight.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const regex = new RegExp(`(${escaped})`, 'gi');
  const parts = text.split(regex);

  return (
    <span className={className}>
      {parts.map((part, i) => 
        regex.test(part) ? (
          <mark key={i} className="bg-amber-200 text-amber-950 font-semibold px-0.5 rounded-xs">
            {part}
          </mark>
        ) : (
          part
        )
      )}
    </span>
  );
};

export const MerchantTable: React.FC<MerchantTableProps> = ({
  records,
  allRecordsCount,
  sourceName,
  searchQueries,
  sortField,
  sortOrder,
  onSort,
  onSelectRecord,
  currentPage,
  pageSize,
  onPageChange,
  onPageSizeChange,
}) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = (text: string, id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  const totalPages = Math.ceil(records.length / pageSize) || 1;
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedRecords = pageSize === -1 ? records : records.slice(startIndex, startIndex + pageSize);

  const renderSortIcon = (field: SortField) => {
    if (sortField !== field) {
      return <ArrowUpDown className="w-3 h-3 opacity-40 ml-1 inline group-hover:opacity-100" />;
    }
    return sortOrder === 'asc' ? (
      <ArrowUp className="w-3 h-3 text-indigo-600 ml-1 inline" />
    ) : (
      <ArrowDown className="w-3 h-3 text-indigo-600 ml-1 inline" />
    );
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-slate-50">
      <div className="bg-white border border-slate-200 rounded shadow-xs flex-1 flex flex-col overflow-hidden m-3">
        {/* Table Container with Sticky Header */}
        <div className="flex-1 overflow-auto">
          <table className="w-full text-left border-collapse table-auto min-w-[1000px]">
            <thead className="sticky top-0 bg-slate-100/95 backdrop-blur-xs z-10 border-b border-slate-200 shadow-2xs">
              <tr>
                <th 
                  onClick={() => onSort('srNo')}
                  className="px-3 py-2.5 text-[11px] font-bold text-slate-600 uppercase tracking-wider w-12 text-center cursor-pointer hover:bg-slate-200/60 transition-colors"
                >
                  <span>#</span>
                  {renderSortIcon('srNo')}
                </th>

                <th 
                  onClick={() => onSort('merchantRegistrationName')}
                  className="px-3.5 py-2.5 text-[11px] font-bold text-slate-600 uppercase tracking-wider cursor-pointer hover:bg-slate-200/60 transition-colors w-[22%]"
                >
                  <span className="flex items-center">
                    Merchant Registration Name
                    {renderSortIcon('merchantRegistrationName')}
                  </span>
                </th>

                <th 
                  onClick={() => onSort('legalPersonName')}
                  className="px-3.5 py-2.5 text-[11px] font-bold text-slate-600 uppercase tracking-wider cursor-pointer hover:bg-slate-200/60 transition-colors w-[18%]"
                >
                  <span className="flex items-center">
                    Legal Person
                    {renderSortIcon('legalPersonName')}
                  </span>
                </th>

                <th 
                  onClick={() => onSort('idNumber')}
                  className="px-3 py-2.5 text-[11px] font-bold text-slate-600 uppercase tracking-wider cursor-pointer hover:bg-slate-200/60 transition-colors text-center w-[18%]"
                >
                  <span className="flex items-center justify-center">
                    NRC Number
                    {renderSortIcon('idNumber')}
                  </span>
                </th>

                <th 
                  onClick={() => onSort('phone')}
                  className="px-3 py-2.5 text-[11px] font-bold text-slate-600 uppercase tracking-wider cursor-pointer hover:bg-slate-200/60 transition-colors w-[12%]"
                >
                  <span className="flex items-center">
                    Phone
                    {renderSortIcon('phone')}
                  </span>
                </th>

                <th 
                  onClick={() => onSort('township')}
                  className="px-3 py-2.5 text-[11px] font-bold text-slate-600 uppercase tracking-wider cursor-pointer hover:bg-slate-200/60 transition-colors w-[15%]"
                >
                  <span className="flex items-center">
                    Township
                    {renderSortIcon('township')}
                  </span>
                </th>

                <th 
                  onClick={() => onSort('reviewStatus')}
                  className="px-3 py-2.5 text-[11px] font-bold text-slate-600 uppercase tracking-wider cursor-pointer hover:bg-slate-200/60 transition-colors text-center w-[10%]"
                >
                  <span className="flex items-center justify-center">
                    Status
                    {renderSortIcon('reviewStatus')}
                  </span>
                </th>

                <th className="px-3 py-2.5 text-[11px] font-bold text-slate-600 uppercase tracking-wider text-right w-14">
                  Action
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100 font-sans text-xs">
              {paginatedRecords.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-12 text-center text-slate-500">
                    <div className="max-w-sm mx-auto flex flex-col items-center">
                      <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mb-2">
                        <FileBadge className="w-6 h-6" />
                      </div>
                      <p className="font-semibold text-slate-700 text-sm">No matching merchants found</p>
                      <p className="text-xs text-slate-500 mt-1">
                        Try adjusting your search criteria or clear filters to view all records.
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                paginatedRecords.map((item, idx) => {
                  const actualIndex = pageSize === -1 ? idx + 1 : startIndex + idx + 1;
                  const isApproved = item.reviewStatus === 'Approved' || item.status === 'Enabled';
                  const isPending = item.reviewStatus === 'Pending';
                  const isRejected = item.reviewStatus === 'Rejected' || item.status === 'Disabled';

                  // Split ID to highlight the last 6 digits specifically
                  const fullId = item.idNumber || '';
                  const last6 = item.idLast6;
                  let idPrefix = fullId;
                  let idSuffix = '';

                  if (last6 && fullId.includes(last6)) {
                    const splitIdx = fullId.lastIndexOf(last6);
                    idPrefix = fullId.substring(0, splitIdx);
                    idSuffix = fullId.substring(splitIdx);
                  }

                  const isIdMatched = searchQueries.idLast6 && (
                    item.idLast6.includes(convertMyanmarDigitsToEnglish(searchQueries.idLast6)) ||
                    fullId.toLowerCase().includes(convertMyanmarDigitsToEnglish(searchQueries.idLast6).toLowerCase())
                  );

                  return (
                    <tr
                      key={item.id || idx}
                      onClick={() => onSelectRecord(item)}
                      className="hover:bg-indigo-50/40 transition-colors cursor-pointer group"
                    >
                      {/* # / Sr No */}
                      <td className="px-3 py-2 text-slate-400 text-center font-mono text-[11px]">
                        {item.srNo || actualIndex}
                      </td>

                      {/* Merchant Registration Name */}
                      <td className="px-3.5 py-2">
                        <div className="font-medium text-slate-900 line-clamp-1">
                          <HighlightText 
                            text={item.merchantRegistrationName || item.merchantName} 
                            highlight={searchQueries.regName || searchQueries.globalSearch} 
                          />
                        </div>
                        {item.merchantNumber && (
                          <div className="text-[10px] text-slate-500 font-mono">
                            {item.merchantNumber}
                          </div>
                        )}
                      </td>

                      {/* Legal Person */}
                      <td className="px-3.5 py-2 text-slate-700">
                        <div className="font-medium text-slate-800 line-clamp-1">
                          <HighlightText 
                            text={item.legalPersonName} 
                            highlight={searchQueries.legalPerson || searchQueries.globalSearch} 
                          />
                        </div>
                        {item.fatherName && (
                          <div className="text-[10px] text-slate-400 truncate">
                            Father: {item.fatherName}
                          </div>
                        )}
                      </td>

                      {/* ID Number (Highlighted Last 6) */}
                      <td className="px-3 py-2 text-center">
                        {fullId ? (
                          <div 
                            className={`inline-flex items-center gap-1 font-mono text-[11px] px-2 py-0.5 rounded border transition-colors ${
                              isIdMatched
                                ? 'bg-indigo-100 border-indigo-300 text-indigo-900 font-bold'
                                : 'bg-slate-100/80 border-slate-200 text-slate-700 group-hover:bg-white'
                            }`}
                          >
                            <span className="text-slate-500 font-normal">{idPrefix}</span>
                            <span className="font-bold text-indigo-700 tracking-wider">
                              {idSuffix || last6}
                            </span>
                            <button
                              onClick={(e) => handleCopy(fullId, `id-${item.id}`, e)}
                              title="Copy ID Number"
                              className="text-slate-400 hover:text-slate-700 ml-0.5"
                            >
                              {copiedId === `id-${item.id}` ? (
                                <Check className="w-3 h-3 text-emerald-600" />
                              ) : (
                                <Copy className="w-3 h-3 opacity-60 hover:opacity-100" />
                              )}
                            </button>
                          </div>
                        ) : (
                          <span className="text-slate-400">-</span>
                        )}
                      </td>

                      {/* Phone */}
                      <td className="px-3 py-2 text-slate-700 font-mono text-[11px]">
                        {item.phone ? (
                          <div className="flex items-center gap-1">
                            <span>{item.phone}</span>
                            <button
                              onClick={(e) => handleCopy(item.phone, `phone-${item.id}`, e)}
                              title="Copy Phone"
                              className="text-slate-400 hover:text-slate-700"
                            >
                              {copiedId === `phone-${item.id}` ? (
                                <Check className="w-2.5 h-2.5 text-emerald-600" />
                              ) : (
                                <Copy className="w-2.5 h-2.5 opacity-0 group-hover:opacity-60" />
                              )}
                            </button>
                          </div>
                        ) : (
                          <span className="text-slate-400">-</span>
                        )}
                      </td>

                      {/* Township */}
                      <td className="px-3 py-2 text-slate-700">
                        <div className="flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                          <span className="truncate">{item.township || '-'}</span>
                        </div>
                      </td>

                      {/* Status */}
                      <td className="px-3 py-2 text-center">
                        {item.reviewStatus === 'Approved' ? (
                          <span className="inline-block px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 text-[10px] font-bold uppercase tracking-wider">
                            Approved
                          </span>
                        ) : item.reviewStatus === 'Pending' ? (
                          <span className="inline-block px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 text-[10px] font-bold uppercase tracking-wider">
                            Pending
                          </span>
                        ) : (
                          <span className="inline-block px-2 py-0.5 rounded-full bg-slate-200 text-slate-700 text-[10px] font-bold uppercase tracking-wider">
                            {item.reviewStatus || item.status || 'Active'}
                          </span>
                        )}
                      </td>

                      {/* Action */}
                      <td className="px-3 py-2 text-right">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onSelectRecord(item);
                          }}
                          title="View Full Details"
                          className="p-1 rounded text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* High Density Table Footer & Pagination */}
        <div className="mt-auto border-t border-slate-200 bg-slate-50 px-4 py-2.5 flex flex-wrap items-center justify-between gap-2 shrink-0 text-xs">
          <div className="flex items-center gap-3 text-slate-500">
            <span className="text-xs italic">
              Showing <strong className="text-slate-800 font-semibold font-mono">{paginatedRecords.length}</strong> of{' '}
              <strong className="text-slate-800 font-semibold font-mono">{records.length}</strong> filtered{' '}
              (Total: <strong className="text-slate-800 font-semibold font-mono">{allRecordsCount}</strong>) | Source: {sourceName}
            </span>

            {/* Page Size Selector */}
            <div className="flex items-center gap-1 text-[11px] text-slate-600 border-l border-slate-300 pl-3">
              <span>Per page:</span>
              <select
                value={pageSize}
                onChange={(e) => onPageSizeChange(Number(e.target.value))}
                className="border border-slate-300 rounded px-1.5 py-0.5 bg-white text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              >
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
                <option value={-1}>All</option>
              </select>
            </div>
          </div>

          {/* Pagination buttons */}
          {pageSize !== -1 && totalPages > 1 && (
            <div className="flex items-center gap-1">
              <button
                disabled={currentPage <= 1}
                onClick={() => onPageChange(currentPage - 1)}
                className="px-2.5 py-1 border border-slate-300 rounded bg-white text-slate-600 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed text-xs transition-colors cursor-pointer"
              >
                Previous
              </button>

              {/* Dynamic Page Buttons */}
              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter((p) => p === 1 || p === totalPages || Math.abs(p - currentPage) <= 1)
                .map((p, idx, arr) => {
                  const prev = arr[idx - 1];
                  const showEllipsis = prev && p - prev > 1;
                  return (
                    <React.Fragment key={p}>
                      {showEllipsis && <span className="px-1 text-slate-400">...</span>}
                      <button
                        onClick={() => onPageChange(p)}
                        className={`px-2.5 py-1 border rounded text-xs transition-colors cursor-pointer ${
                          currentPage === p
                            ? 'border-indigo-600 bg-indigo-50 text-indigo-700 font-bold shadow-2xs'
                            : 'border-slate-300 bg-white text-slate-600 hover:bg-slate-100'
                        }`}
                      >
                        {p}
                      </button>
                    </React.Fragment>
                  );
                })}

              <button
                disabled={currentPage >= totalPages}
                onClick={() => onPageChange(currentPage + 1)}
                className="px-2.5 py-1 border border-slate-300 rounded bg-white text-slate-600 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed text-xs transition-colors cursor-pointer"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
