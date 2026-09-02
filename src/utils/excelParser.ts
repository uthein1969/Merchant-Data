import * as XLSX from 'xlsx';
import { MerchantRecord } from '../types';
import { extractLast6Digits } from './idUtils';

interface ColumnMapping {
  key: keyof Omit<MerchantRecord, 'id' | 'raw' | 'idLast6'>;
  patterns: RegExp[];
  label: string;
}

const COLUMN_RULES: ColumnMapping[] = [
  {
    key: 'srNo',
    patterns: [/^sr\.?\s*no\.?$/i, /^no\.?$/i, /^#$/, /^စဉ်$/i],
    label: 'Sr No.',
  },
  {
    key: 'merchantNumber',
    patterns: [/merchant\s*number/i, /merchant\s*no/i, /merchant\s*id/i, /m_number/i],
    label: 'Merchant Number',
  },
  {
    key: 'merchantName',
    patterns: [/^merchant\s*name$/i, /^shop\s*name$/i, /^store\s*name$/i, /^ဆိုင်အမည်$/i],
    label: 'Merchant Name',
  },
  {
    key: 'phone',
    patterns: [/phone/i, /mobile/i, /contact/i, /tel/i, /ဖုန်း/i],
    label: 'Phone',
  },
  {
    key: 'businessType',
    patterns: [/business\s*type/i, /biz\s*type/i, /လုပ်ငန်းအမျိုးအစား/i],
    label: 'Business Type',
  },
  {
    key: 'merchantRegistrationName',
    patterns: [/merchant\s*registration\s*name/i, /registration\s*name/i, /reg\s*name/i, /မှတ်ပုံတင်အမည်/i],
    label: 'Merchant Registration Name',
  },
  {
    key: 'businessLicenseNumber',
    patterns: [/business\s*license\s*number/i, /license\s*number/i, /license\s*no/i, /လိုင်စင်နံပါတ်/i],
    label: 'Business License Number',
  },
  {
    key: 'legalPersonName',
    patterns: [/name\s*of\s*the\s*legal\s*person/i, /legal\s*person/i, /legal\s*name/i, /owner\s*name/i, /တာဝန်ခံ/i],
    label: 'Name of the Legal Person',
  },
  {
    key: 'idNumber',
    patterns: [/id\s*number/i, /^nrc(\s*number)?$/i, /^id\s*no\.?$/i, /^nrc$/i, /မှတ်ပုံတင်အမှတ်/i],
    label: 'ID Number',
  },
  {
    key: 'fatherName',
    patterns: [/father\s*name/i, /father/i, /အဘအမည်/i, /အဖအမည်/i],
    label: 'Father Name',
  },
  {
    key: 'dateOfBirth',
    patterns: [/date\s*of\s*birth/i, /^dob$/i, /birth\s*date/i, /မွေးသက္ကရာဇ်/i],
    label: 'Date Of Birth',
  },
  {
    key: 'liquidityRequest',
    patterns: [/liquidity\s*request/i, /liquidity/i],
    label: 'Liquidity Request',
  },
  {
    key: 'address',
    patterns: [/address/i, /street/i, /လိပ်စာ/i],
    label: 'Address',
  },
  {
    key: 'township',
    patterns: [/township/i, /tws/i, /မြို့နယ်/i],
    label: 'Township',
  },
  {
    key: 'city',
    patterns: [/city/i, /region/i, /state/i, /division/i, /တိုင်းဒေသကြီး/i],
    label: 'City / Region',
  },
  {
    key: 'status',
    patterns: [/^status$/i, /account\s*status/i, /အခြေအနေ/i],
    label: 'Status',
  },
  {
    key: 'reviewStatus',
    patterns: [/review\s*status/i, /verification\s*status/i, /approval\s*status/i],
    label: 'Review Status',
  },
];

export interface ParseResult {
  sheetNames: string[];
  activeSheet: string;
  records: MerchantRecord[];
  totalRows: number;
  columnsDetected: string[];
}

export function parseExcelFile(fileData: ArrayBuffer | Uint8Array, sheetNameOverride?: string): ParseResult {
  const workbook = XLSX.read(fileData, { type: 'array' });
  const sheetNames = workbook.SheetNames;
  if (!sheetNames || sheetNames.length === 0) {
    throw new Error('The uploaded Excel file contains no readable worksheets.');
  }

  const activeSheet = sheetNameOverride && sheetNames.includes(sheetNameOverride)
    ? sheetNameOverride
    : sheetNames[0];

  const worksheet = workbook.Sheets[activeSheet];
  const jsonData: any[][] = XLSX.utils.sheet_to_json(worksheet, { header: 1, defval: '' });

  if (jsonData.length < 2) {
    return {
      sheetNames,
      activeSheet,
      records: [],
      totalRows: 0,
      columnsDetected: [],
    };
  }

  // Find header row (usually first non-empty row)
  let headerRowIndex = 0;
  for (let i = 0; i < Math.min(jsonData.length, 5); i++) {
    const row = jsonData[i];
    if (row && row.some(cell => String(cell).toLowerCase().includes('merchant') || String(cell).toLowerCase().includes('name') || String(cell).toLowerCase().includes('id'))) {
      headerRowIndex = i;
      break;
    }
  }

  const headerRow = jsonData[headerRowIndex].map(h => String(h || '').trim());
  const columnIndices: Partial<Record<keyof Omit<MerchantRecord, 'id' | 'raw' | 'idLast6'>, number>> = {};

  headerRow.forEach((headerText, colIndex) => {
    if (!headerText) return;
    for (const rule of COLUMN_RULES) {
      if (columnIndices[rule.key] === undefined) {
        for (const pattern of rule.patterns) {
          if (pattern.test(headerText)) {
            columnIndices[rule.key] = colIndex;
            break;
          }
        }
      }
    }
  });

  const records: MerchantRecord[] = [];

  for (let r = headerRowIndex + 1; r < jsonData.length; r++) {
    const row = jsonData[r];
    if (!row || row.every(cell => !cell || String(cell).trim() === '')) {
      continue; // Skip empty rows
    }

    const getVal = (key: keyof Omit<MerchantRecord, 'id' | 'raw' | 'idLast6'>): string => {
      const idx = columnIndices[key];
      if (idx !== undefined && row[idx] !== undefined) {
        return String(row[idx]).trim();
      }
      return '';
    };

    const idNumber = getVal('idNumber');
    const idLast6 = extractLast6Digits(idNumber);
    const regName = getVal('merchantRegistrationName') || getVal('merchantName');
    const legalPerson = getVal('legalPersonName');
    const township = getVal('township');
    const merchantNo = getVal('merchantNumber');

    // Build row record
    const record: MerchantRecord = {
      id: `row-${r}-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      srNo: getVal('srNo') || records.length + 1,
      merchantNumber: merchantNo,
      merchantName: getVal('merchantName') || regName,
      phone: getVal('phone'),
      businessType: getVal('businessType') || 'Small business',
      merchantRegistrationName: regName,
      businessLicenseNumber: getVal('businessLicenseNumber'),
      legalPersonName: legalPerson,
      idNumber: idNumber,
      idLast6: idLast6,
      fatherName: getVal('fatherName'),
      dateOfBirth: getVal('dateOfBirth'),
      liquidityRequest: getVal('liquidityRequest') || '-',
      address: getVal('address'),
      township: township,
      city: getVal('city') || 'Yangon Region',
      status: (getVal('status') as any) || 'Enabled',
      reviewStatus: (getVal('reviewStatus') as any) || 'Approved',
      raw: row,
    };

    records.push(record);
  }

  return {
    sheetNames,
    activeSheet,
    records,
    totalRows: records.length,
    columnsDetected: headerRow.filter(Boolean),
  };
}

export function exportMerchantsToExcel(records: MerchantRecord[], fileName: string = 'Merchant_List_Export.xlsx') {
  const data = records.map((r, idx) => ({
    'Sr No.': r.srNo || idx + 1,
    'Merchant Number': r.merchantNumber,
    'Merchant Name': r.merchantName,
    'Phone': r.phone,
    'Business type': r.businessType,
    'Merchant Registration Name': r.merchantRegistrationName,
    'Business License Number': r.businessLicenseNumber,
    'Name of the Legal Person': r.legalPersonName,
    'ID Number': r.idNumber,
    'ID (Last 6)': r.idLast6,
    'Father Name': r.fatherName,
    'Date Of Birth': r.dateOfBirth,
    'Liquidity Request': r.liquidityRequest,
    'Address': r.address,
    'Township': r.township,
    'City': r.city,
    'Status': r.status,
    'Review Status': r.reviewStatus,
  }));

  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Merchant Management Report');
  XLSX.writeFile(workbook, fileName);
}

export function exportMerchantsToCSV(records: MerchantRecord[], fileName: string = 'Merchant_List_Export.csv') {
  const data = records.map((r, idx) => ({
    'Sr No.': r.srNo || idx + 1,
    'Merchant Number': r.merchantNumber,
    'Merchant Name': r.merchantName,
    'Phone': r.phone,
    'Business type': r.businessType,
    'Merchant Registration Name': r.merchantRegistrationName,
    'Business License Number': r.businessLicenseNumber,
    'Name of the Legal Person': r.legalPersonName,
    'ID Number': r.idNumber,
    'Father Name': r.fatherName,
    'Date Of Birth': r.dateOfBirth,
    'Liquidity Request': r.liquidityRequest,
    'Address': r.address,
    'Township': r.township,
    'City': r.city,
    'Status': r.status,
    'Review Status': r.reviewStatus,
  }));

  const worksheet = XLSX.utils.json_to_sheet(data);
  const csv = XLSX.utils.sheet_to_csv(worksheet);
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', fileName);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
