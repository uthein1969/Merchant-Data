export interface MerchantRecord {
  id: string;
  srNo: number | string;
  merchantNumber: string;
  merchantName: string;
  phone: string;
  businessType: string;
  merchantRegistrationName: string;
  businessLicenseNumber: string;
  legalPersonName: string;
  idNumber: string;
  idLast6: string;
  fatherName: string;
  dateOfBirth: string;
  liquidityRequest: string;
  address: string;
  township: string;
  city: string;
  status: 'Enabled' | 'Disabled' | string;
  reviewStatus: 'Approved' | 'Pending' | 'Rejected' | string;
  raw?: Record<string, any>;
}

export interface FilterState {
  registrationName: string;
  legalPerson: string;
  idLast6: string;
  township: string;
  globalSearch: string;
  status: string;
  reviewStatus: string;
  phone: string;
}

export type SortField = keyof MerchantRecord;
export type SortOrder = 'asc' | 'desc';
