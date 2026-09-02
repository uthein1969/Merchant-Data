/**
 * Utility functions for Myanmar NRC and ID number processing
 */

// Convert Myanmar digits (၀-၉) to standard ASCII digits (0-9)
export function convertMyanmarDigitsToEnglish(input: string): string {
  if (!input) return '';
  const myanmarDigits = ['၀', '၁', '၂', '၃', '၄', '၅', '၆', '၇', '၈', '၉'];
  let result = input;
  myanmarDigits.forEach((digit, index) => {
    result = result.split(digit).join(index.toString());
  });
  return result;
}

// Convert English digits (0-9) to Myanmar digits (၀-၉)
export function convertEnglishDigitsToMyanmar(input: string): string {
  if (!input) return '';
  const myanmarDigits = ['၀', '၁', '၂', '၃', '၄', '၅', '၆', '၇', '၈', '၉'];
  let result = input;
  for (let i = 0; i <= 9; i++) {
    result = result.split(i.toString()).join(myanmarDigits[i]);
  }
  return result;
}

/**
 * Extracts the last 6 digits from an ID Number (NRC / Passport / Registration ID)
 * e.g., "12/THAKATA(C)102834" => "102834"
 * e.g., "1/မကန(နိုင်)083178" => "083178"
 */
export function extractLast6Digits(idNumber: string): string {
  if (!idNumber) return '';
  // Convert any Myanmar numbers to English numbers first
  const normalized = convertMyanmarDigitsToEnglish(idNumber.toString().trim());
  
  // Extract all contiguous digit sequences or all digits at the end
  const digitsOnly = normalized.replace(/\D/g, '');
  if (digitsOnly.length >= 6) {
    return digitsOnly.slice(-6);
  }
  return digitsOnly;
}

/**
 * Checks if a target ID number matches a search query for last 6 digits or partial NRC
 */
export function matchIdNumber(idNumber: string, query: string): boolean {
  if (!query || !query.trim()) return true;
  if (!idNumber) return false;

  const cleanQuery = convertMyanmarDigitsToEnglish(query.trim().toLowerCase());
  const cleanId = convertMyanmarDigitsToEnglish(idNumber.trim().toLowerCase());
  
  // Exact or partial full NRC match
  if (cleanId.includes(cleanQuery)) {
    return true;
  }

  // Digits-only match (specifically last 6 digits or suffix search)
  const idDigits = cleanId.replace(/\D/g, '');
  const queryDigits = cleanQuery.replace(/\D/g, '');

  if (queryDigits && idDigits) {
    if (idDigits.endsWith(queryDigits) || idDigits.includes(queryDigits)) {
      return true;
    }
  }

  return false;
}
