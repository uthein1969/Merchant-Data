import React, { useState } from 'react';
import { MerchantRecord } from '../types';
import { 
  X, 
  Building2, 
  User, 
  CreditCard, 
  Phone, 
  MapPin, 
  Calendar, 
  ShieldCheck, 
  Copy, 
  Check, 
  Printer,
  FileSpreadsheet
} from 'lucide-react';

interface MerchantDetailModalProps {
  merchant: MerchantRecord | null;
  onClose: () => void;
}

export const MerchantDetailModal: React.FC<MerchantDetailModalProps> = ({
  merchant,
  onClose,
}) => {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  if (!merchant) return null;

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 1500);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div 
        className="bg-white rounded-lg shadow-2xl border border-slate-200 w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="bg-slate-900 text-white px-5 py-3.5 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded bg-indigo-600 flex items-center justify-center text-white">
              <Building2 className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-100">
                {merchant.merchantRegistrationName || merchant.merchantName}
              </h2>
              <p className="text-[11px] text-slate-400 font-mono">
                Merchant ID: {merchant.merchantNumber || 'N/A'} • #{merchant.srNo}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              title="Print Merchant Profile"
              className="p-1.5 rounded text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <Printer className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto space-y-4 text-xs font-sans">
          {/* Status Banner */}
          <div className="flex items-center justify-between bg-slate-50 p-3 rounded border border-slate-200">
            <div className="flex items-center gap-2">
              <span className="text-[10px] uppercase font-bold text-slate-500">Review Status:</span>
              {merchant.reviewStatus === 'Approved' ? (
                <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px] uppercase">
                  Approved
                </span>
              ) : merchant.reviewStatus === 'Pending' ? (
                <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 font-bold text-[10px] uppercase">
                  Pending
                </span>
              ) : (
                <span className="px-2 py-0.5 rounded-full bg-slate-200 text-slate-700 font-bold text-[10px] uppercase">
                  {merchant.reviewStatus}
                </span>
              )}
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[10px] uppercase font-bold text-slate-500">Account:</span>
              <span className="px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 font-medium text-[10px] border border-indigo-200">
                {merchant.status || 'Enabled'}
              </span>
            </div>
          </div>

          {/* Section 1: Merchant & Registration */}
          <div>
            <h3 className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2 flex items-center gap-1.5 border-b border-slate-100 pb-1">
              <Building2 className="w-3.5 h-3.5 text-indigo-600" />
              Business & Registration Information
            </h3>
            <div className="grid grid-cols-2 gap-3 bg-slate-50/60 p-3 rounded border border-slate-100">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Registration Name</span>
                <span className="font-semibold text-slate-800 text-sm">
                  {merchant.merchantRegistrationName || '-'}
                </span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Merchant Name</span>
                <span className="text-slate-700">{merchant.merchantName || '-'}</span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Business License No.</span>
                <div className="flex items-center gap-1 mt-0.5">
                  <span className="font-mono text-slate-800">{merchant.businessLicenseNumber || '-'}</span>
                  {merchant.businessLicenseNumber && (
                    <button
                      onClick={() => handleCopy(merchant.businessLicenseNumber, 'license')}
                      className="text-slate-400 hover:text-slate-600"
                    >
                      {copiedKey === 'license' ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                    </button>
                  )}
                </div>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Business Type</span>
                <span className="text-slate-700">{merchant.businessType || 'Small business'}</span>
              </div>
            </div>
          </div>

          {/* Section 2: Legal Representative & ID */}
          <div>
            <h3 className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2 flex items-center gap-1.5 border-b border-slate-100 pb-1">
              <User className="w-3.5 h-3.5 text-indigo-600" />
              Legal Representative & ID Verification
            </h3>
            <div className="grid grid-cols-2 gap-3 bg-slate-50/60 p-3 rounded border border-slate-100">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Legal Person Name</span>
                <span className="font-semibold text-slate-800 text-sm">
                  {merchant.legalPersonName || '-'}
                </span>
              </div>

              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">NRC Number</span>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="font-mono font-medium text-slate-800">{merchant.idNumber || '-'}</span>
                  {merchant.idNumber && (
                    <button
                      onClick={() => handleCopy(merchant.idNumber, 'idNumber')}
                      className="text-slate-400 hover:text-slate-600"
                      title="Copy Full NRC"
                    >
                      {copiedKey === 'idNumber' ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                    </button>
                  )}
                </div>
              </div>

              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">NRC Last 6 Digits</span>
                <span className="font-mono font-bold text-indigo-700 text-sm bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200 inline-block mt-0.5">
                  {merchant.idLast6 || '-'}
                </span>
              </div>

              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Father's Name</span>
                <span className="text-slate-700">{merchant.fatherName || '-'}</span>
              </div>

              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Date of Birth</span>
                <span className="font-mono text-slate-700">{merchant.dateOfBirth || '-'}</span>
              </div>

              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Liquidity Request</span>
                <span className="text-slate-700">{merchant.liquidityRequest || '-'}</span>
              </div>
            </div>
          </div>

          {/* Section 3: Contact & Address */}
          <div>
            <h3 className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2 flex items-center gap-1.5 border-b border-slate-100 pb-1">
              <MapPin className="w-3.5 h-3.5 text-indigo-600" />
              Contact & Location
            </h3>
            <div className="grid grid-cols-2 gap-3 bg-slate-50/60 p-3 rounded border border-slate-100">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Phone Number</span>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="font-mono font-semibold text-slate-800">{merchant.phone || '-'}</span>
                  {merchant.phone && (
                    <button
                      onClick={() => handleCopy(merchant.phone, 'phone')}
                      className="text-slate-400 hover:text-slate-600"
                    >
                      {copiedKey === 'phone' ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                    </button>
                  )}
                </div>
              </div>

              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Township</span>
                <span className="font-medium text-slate-800">{merchant.township || '-'}</span>
              </div>

              <div className="col-span-2">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Full Address</span>
                <span className="text-slate-700">{merchant.address || '-'}</span>
              </div>

              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">City / Region</span>
                <span className="text-slate-700">{merchant.city || 'Yangon Region'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="bg-slate-50 px-5 py-3 border-t border-slate-200 flex justify-between items-center text-xs">
          <span className="text-slate-400 italic">Merchant Record Details</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded font-medium transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
