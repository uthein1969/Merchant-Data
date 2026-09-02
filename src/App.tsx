/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useCallback } from 'react';
import { MerchantRecord, FilterState, SortField, SortOrder } from './types';
import { initialMerchantData } from './data/sampleMerchants';
import { Header } from './components/Header';
import { FilterBar } from './components/FilterBar';
import { MerchantTable } from './components/MerchantTable';
import { MerchantDetailModal } from './components/MerchantDetailModal';
import { ImportModal } from './components/ImportModal';
import { convertMyanmarDigitsToEnglish, matchIdNumber } from './utils/idUtils';

export default function App() {
  const [merchants, setMerchants] = useState<MerchantRecord[]>(initialMerchantData);
  const [sourceName, setSourceName] = useState<string>('Merchant List.png');
  const [selectedMerchant, setSelectedMerchant] = useState<MerchantRecord | null>(null);
  const [isImportModalOpen, setIsImportModalOpen] = useState<boolean>(false);

  // Filter state
  const [filters, setFilters] = useState<FilterState>({
    registrationName: '',
    legalPerson: '',
    idLast6: '',
    township: '',
    globalSearch: '',
    status: '',
    reviewStatus: '',
    phone: '',
  });

  // Sorting state
  const [sortField, setSortField] = useState<SortField>('srNo');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');

  // Pagination state
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(20);

  // Reset page to 1 whenever filters change
  const handleSetFilters: React.Dispatch<React.SetStateAction<FilterState>> = useCallback(
    (action) => {
      setCurrentPage(1);
      setFilters(action);
    },
    []
  );

  // Compute unique Townships with count
  const uniqueTownships = useMemo(() => {
    const counts: Record<string, number> = {};
    merchants.forEach((m) => {
      const tw = (m.township || '').trim();
      if (tw) {
        counts[tw] = (counts[tw] || 0) + 1;
      }
    });
    return Object.entries(counts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [merchants]);

  // Filtered dataset
  const filteredMerchants = useMemo(() => {
    return merchants.filter((item) => {
      // 1. Merchant Registration Name search
      if (filters.registrationName.trim()) {
        const regQuery = filters.registrationName.toLowerCase().trim();
        const regName = (item.merchantRegistrationName || '').toLowerCase();
        const merchantName = (item.merchantName || '').toLowerCase();
        if (!regName.includes(regQuery) && !merchantName.includes(regQuery)) {
          return false;
        }
      }

      // 2. Name of the Legal Person search
      if (filters.legalPerson.trim()) {
        const legalQuery = filters.legalPerson.toLowerCase().trim();
        const legalName = (item.legalPersonName || '').toLowerCase();
        if (!legalName.includes(legalQuery)) {
          return false;
        }
      }

      // 3. ID Number (Last 6 Digits / NRC) search
      if (filters.idLast6.trim()) {
        const match = matchIdNumber(item.idNumber, filters.idLast6);
        if (!match) {
          return false;
        }
      }

      // 4. Township filter
      if (filters.township.trim()) {
        const twQuery = filters.township.toLowerCase().trim();
        const tw = (item.township || '').toLowerCase().trim();
        if (tw !== twQuery && !tw.includes(twQuery)) {
          return false;
        }
      }

      // 5. Phone search
      if (filters.phone.trim()) {
        const phoneQuery = convertMyanmarDigitsToEnglish(filters.phone.trim());
        const phone = convertMyanmarDigitsToEnglish(item.phone || '');
        if (!phone.includes(phoneQuery)) {
          return false;
        }
      }

      // 6. Account Status filter
      if (filters.status.trim()) {
        if (item.status !== filters.status) {
          return false;
        }
      }

      // 7. Review Status filter
      if (filters.reviewStatus.trim()) {
        if (item.reviewStatus !== filters.reviewStatus) {
          return false;
        }
      }

      // 8. Global Search across all fields
      if (filters.globalSearch.trim()) {
        const gQuery = convertMyanmarDigitsToEnglish(filters.globalSearch.toLowerCase().trim());
        const allText = [
          item.merchantNumber,
          item.merchantName,
          item.merchantRegistrationName,
          item.legalPersonName,
          item.idNumber,
          item.idLast6,
          item.businessLicenseNumber,
          item.fatherName,
          item.phone,
          item.township,
          item.address,
          item.city,
          item.businessType,
          item.status,
          item.reviewStatus,
        ]
          .filter(Boolean)
          .map((t) => convertMyanmarDigitsToEnglish(String(t).toLowerCase()))
          .join(' ');

        if (!allText.includes(gQuery)) {
          return false;
        }
      }

      return true;
    });
  }, [merchants, filters]);

  // Sorted dataset
  const sortedMerchants = useMemo(() => {
    return [...filteredMerchants].sort((a, b) => {
      let aVal: any = a[sortField];
      let bVal: any = b[sortField];

      if (sortField === 'srNo') {
        const numA = Number(aVal) || 0;
        const numB = Number(bVal) || 0;
        return sortOrder === 'asc' ? numA - numB : numB - numA;
      }

      aVal = String(aVal || '').toLowerCase();
      bVal = String(bVal || '').toLowerCase();

      if (aVal < bVal) return sortOrder === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });
  }, [filteredMerchants, sortField, sortOrder]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const handleResetFilters = () => {
    setCurrentPage(1);
    setFilters({
      registrationName: '',
      legalPerson: '',
      idLast6: '',
      township: '',
      globalSearch: '',
      status: '',
      reviewStatus: '',
      phone: '',
    });
  };

  const handleResetToSample = () => {
    setMerchants(initialMerchantData);
    setSourceName('Merchant List.png');
    handleResetFilters();
  };

  const handleImportSuccess = (
    newRecords: MerchantRecord[],
    fileName: string,
    mode: 'replace' | 'append'
  ) => {
    if (mode === 'replace') {
      setMerchants(newRecords);
      setSourceName(fileName);
    } else {
      setMerchants((prev) => [...prev, ...newRecords]);
      setSourceName(`${sourceName} + ${fileName}`);
    }
    handleResetFilters();
  };

  return (
    <div className="flex flex-col min-h-screen w-full bg-slate-100 font-sans text-slate-900 overflow-y-auto md:h-screen md:overflow-hidden">
      {/* High Density Header */}
      <Header
        totalCount={merchants.length}
        filteredCount={sortedMerchants.length}
        sourceName={sourceName}
        onOpenImport={() => setIsImportModalOpen(true)}
        onResetToSample={handleResetToSample}
        filteredData={sortedMerchants}
        allData={merchants}
      />

      {/* High Density Filter Bar with 4 core search columns */}
      <FilterBar
        filters={filters}
        setFilters={handleSetFilters}
        townships={uniqueTownships}
        totalFiltered={sortedMerchants.length}
        totalRecords={merchants.length}
        onResetFilters={handleResetFilters}
      />

      {/* Main High Density Table Area */}
      <main className="flex-1 flex flex-col min-h-[500px] overflow-x-auto bg-slate-100">
        <MerchantTable
          records={sortedMerchants}
          allRecordsCount={merchants.length}
          sourceName={sourceName}
          searchQueries={{
            regName: filters.registrationName,
            legalPerson: filters.legalPerson,
            idLast6: filters.idLast6,
            globalSearch: filters.globalSearch,
          }}
          sortField={sortField}
          sortOrder={sortOrder}
          onSort={handleSort}
          onSelectRecord={(record) => setSelectedMerchant(record)}
          currentPage={currentPage}
          pageSize={pageSize}
          onPageChange={setCurrentPage}
          onPageSizeChange={(newSize) => {
            setPageSize(newSize);
            setCurrentPage(1);
          }}
        />
      </main>

      {/* Merchant Detail Modal */}
      <MerchantDetailModal
        merchant={selectedMerchant}
        onClose={() => setSelectedMerchant(null)}
      />

      {/* Excel Import Modal */}
      <ImportModal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        onImportSuccess={handleImportSuccess}
      />
    </div>
  );
}