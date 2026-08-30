import type { BookletJob, BookletPart, Party, QuotationData, QuotationItem } from '../types';
import { createEmptyPartyB } from './partyB';

export interface ValidationError {
  path: string;
  message: string;
}

export type ValidationResult<T> =
  | { success: true; data: T }
  | { success: false; errors: ValidationError[] };

export const MAX_JSON_BYTES = 1024 * 1024;
const MAX_ARRAY_LENGTHS = { items: 100, bookletJobs: 50, parts: 50 } as const;
const MAX_TEXT_LENGTH = 500;
const MAX_LONG_TEXT_LENGTH = 5000;

export const formatValidationErrors = (errors: ValidationError[]): string => (
  errors.map(({ path, message }) => `${path}：${message}`).join('\n')
);

const isRecord = (input: unknown): input is Record<string, unknown> => (
  typeof input === 'object' && input !== null && !Array.isArray(input)
);

const addError = (errors: ValidationError[], path: string, message: string) => {
  errors.push({ path, message });
};

const readText = (
  source: Record<string, unknown>,
  key: string,
  path: string,
  errors: ValidationError[],
  maxLength = MAX_TEXT_LENGTH,
): string => {
  if (!Object.prototype.hasOwnProperty.call(source, key)) return '';

  const value = source[key];
  if (typeof value !== 'string') {
    addError(errors, path, '必須是文字');
    return '';
  }
  if (value.length > maxLength) {
    addError(errors, path, `文字不可超過 ${maxLength} 字`);
    return value.slice(0, maxLength);
  }
  return value;
};

const readEnum = <T extends string>(
  source: Record<string, unknown>,
  key: string,
  path: string,
  allowed: readonly T[],
  fallback: T,
  errors: ValidationError[],
  label = '值',
): T => {
  if (!Object.prototype.hasOwnProperty.call(source, key)) return fallback;

  const value = source[key];
  if (typeof value !== 'string' || !allowed.includes(value as T)) {
    addError(errors, path, `${label}必須是 ${allowed.join('、')} 之一`);
    return fallback;
  }
  return value as T;
};

const readNonNegativeNumberString = (
  source: Record<string, unknown>,
  key: string,
  path: string,
  errors: ValidationError[],
): string => {
  const value = readText(source, key, path, errors);
  if (!value.trim()) return value;

  const numberValue = Number(value);
  if (!Number.isFinite(numberValue) || numberValue < 0) {
    addError(errors, path, '必須是有限且非負的數字');
  }
  return value;
};

const readArray = (
  source: Record<string, unknown>,
  key: string,
  path: string,
  maxLength: number,
  errors: ValidationError[],
): unknown[] => {
  if (!Object.prototype.hasOwnProperty.call(source, key)) return [];

  const value = source[key];
  if (!Array.isArray(value)) {
    addError(errors, path, '必須是陣列');
    return [];
  }
  if (value.length > maxLength) {
    addError(errors, path, `數量不可超過 ${maxLength} 筆`);
  }
  return value.slice(0, maxLength);
};

const parsePartyB = (input: unknown, path: string, errors: ValidationError[]): Party => {
  if (input === undefined) return createEmptyPartyB();
  if (!isRecord(input)) {
    addError(errors, path, '必須是物件');
    return createEmptyPartyB();
  }

  return {
    name: readText(input, 'name', `${path}.name`, errors),
    representative: readText(input, 'representative', `${path}.representative`, errors),
    address: readText(input, 'address', `${path}.address`, errors),
    taxId: readText(input, 'taxId', `${path}.taxId`, errors),
    phone: readText(input, 'phone', `${path}.phone`, errors),
    fax: readText(input, 'fax', `${path}.fax`, errors),
    contactPerson: readText(input, 'contactPerson', `${path}.contactPerson`, errors),
    mobile: readText(input, 'mobile', `${path}.mobile`, errors),
  };
};

const parseQuotationItem = (input: unknown, path: string, errors: ValidationError[]): QuotationItem => {
  if (!isRecord(input)) {
    addError(errors, path, '必須是物件');
    return {
      id: '', jobName: '', sheetSize: '', printColor: '', reverseColor: '', specialColor: '',
      paperName: '', processingDetails: '', quantity: '', unit: '', unitPrice: '',
      taxType: 'exclude', manualAmount: '',
    };
  }

  return {
    id: readText(input, 'id', `${path}.id`, errors),
    jobName: readText(input, 'jobName', `${path}.jobName`, errors),
    sheetSize: readText(input, 'sheetSize', `${path}.sheetSize`, errors),
    printColor: readText(input, 'printColor', `${path}.printColor`, errors),
    reverseColor: readText(input, 'reverseColor', `${path}.reverseColor`, errors),
    specialColor: readText(input, 'specialColor', `${path}.specialColor`, errors),
    paperName: readText(input, 'paperName', `${path}.paperName`, errors),
    processingDetails: readText(input, 'processingDetails', `${path}.processingDetails`, errors, MAX_LONG_TEXT_LENGTH),
    quantity: readNonNegativeNumberString(input, 'quantity', `${path}.quantity`, errors),
    unit: readText(input, 'unit', `${path}.unit`, errors),
    unitPrice: readNonNegativeNumberString(input, 'unitPrice', `${path}.unitPrice`, errors),
    taxType: readEnum(input, 'taxType', `${path}.taxType`, ['exclude', 'include'] as const, 'exclude', errors),
    manualAmount: readNonNegativeNumberString(input, 'manualAmount', `${path}.manualAmount`, errors),
  };
};

const parseBookletPart = (input: unknown, path: string, errors: ValidationError[]): BookletPart => {
  if (!isRecord(input)) {
    addError(errors, path, '必須是物件');
    return {
      id: '', partName: '', sheetSize: '', printColor: '', reverseColor: '', specialColor: '',
      paperName: '', processingDetails: '',
    };
  }

  return {
    id: readText(input, 'id', `${path}.id`, errors),
    partName: readText(input, 'partName', `${path}.partName`, errors),
    sheetSize: readText(input, 'sheetSize', `${path}.sheetSize`, errors),
    printColor: readText(input, 'printColor', `${path}.printColor`, errors),
    reverseColor: readText(input, 'reverseColor', `${path}.reverseColor`, errors),
    specialColor: readText(input, 'specialColor', `${path}.specialColor`, errors),
    paperName: readText(input, 'paperName', `${path}.paperName`, errors),
    processingDetails: readText(input, 'processingDetails', `${path}.processingDetails`, errors, MAX_LONG_TEXT_LENGTH),
  };
};

const parseBookletJob = (input: unknown, path: string, errors: ValidationError[]): BookletJob => {
  if (!isRecord(input)) {
    addError(errors, path, '必須是物件');
    return {
      id: '', jobName: '', jobSheetSize: '', bindingMethod: '', quantity: '', unit: '',
      unitPrice: '', hqQuantity: '', parts: [],
    };
  }

  const rawParts = readArray(input, 'parts', `${path}.parts`, MAX_ARRAY_LENGTHS.parts, errors);
  return {
    id: readText(input, 'id', `${path}.id`, errors),
    jobName: readText(input, 'jobName', `${path}.jobName`, errors),
    jobSheetSize: readText(input, 'jobSheetSize', `${path}.jobSheetSize`, errors),
    bindingMethod: readText(input, 'bindingMethod', `${path}.bindingMethod`, errors),
    quantity: readNonNegativeNumberString(input, 'quantity', `${path}.quantity`, errors),
    unit: readText(input, 'unit', `${path}.unit`, errors),
    unitPrice: readNonNegativeNumberString(input, 'unitPrice', `${path}.unitPrice`, errors),
    hqQuantity: readNonNegativeNumberString(input, 'hqQuantity', `${path}.hqQuantity`, errors),
    parts: rawParts.map((part, index) => parseBookletPart(part, `${path}.parts[${index}]`, errors)),
  };
};

export const parseQuotationData = (input: unknown): ValidationResult<QuotationData> => {
  const errors: ValidationError[] = [];
  if (!isRecord(input)) return { success: false, errors: [{ path: '$', message: '報價資料必須是物件' }] };

  const quotationType = readEnum(input, 'quotationType', 'quotationType', ['single', 'booklet', 'dept'] as const, 'single', errors, '報價類型');
  const rawItems = readArray(input, 'items', 'items', MAX_ARRAY_LENGTHS.items, errors);
  const rawJobs = readArray(input, 'bookletJobs', 'bookletJobs', MAX_ARRAY_LENGTHS.bookletJobs, errors);

  const data: QuotationData = {
    companyId: readText(input, 'companyId', 'companyId', errors),
    quotationType,
    customerName: readText(input, 'customerName', 'customerName', errors),
    contactPerson: readText(input, 'contactPerson', 'contactPerson', errors),
    phone: readText(input, 'phone', 'phone', errors),
    mobile: readText(input, 'mobile', 'mobile', errors),
    fax: readText(input, 'fax', 'fax', errors),
    partyB: parsePartyB(input.partyB, 'partyB', errors),
    items: rawItems.map((item, index) => parseQuotationItem(item, `items[${index}]`, errors)),
    bookletJobs: rawJobs.map((job, index) => parseBookletJob(job, `bookletJobs[${index}]`, errors)),
    remarks: readText(input, 'remarks', 'remarks', errors, MAX_LONG_TEXT_LENGTH),
    orderYear: readText(input, 'orderYear', 'orderYear', errors),
    orderMonth: readText(input, 'orderMonth', 'orderMonth', errors),
    orderDay: readText(input, 'orderDay', 'orderDay', errors),
    paymentMethod: readText(input, 'paymentMethod', 'paymentMethod', errors),
    deliveryYear: readText(input, 'deliveryYear', 'deliveryYear', errors),
    deliveryMonth: readText(input, 'deliveryMonth', 'deliveryMonth', errors),
    deliveryDay: readText(input, 'deliveryDay', 'deliveryDay', errors),
    deliveryLocation: readText(input, 'deliveryLocation', 'deliveryLocation', errors),
    salesName: readText(input, 'salesName', 'salesName', errors),
    salesMobile: readText(input, 'salesMobile', 'salesMobile', errors),
  };

  return errors.length > 0 ? { success: false, errors } : { success: true, data };
};

export const parseQuotationJson = (text: string): ValidationResult<QuotationData> => {
  if (typeof text !== 'string') return { success: false, errors: [{ path: '$', message: '匯入內容必須是文字' }] };
  if (new TextEncoder().encode(text).byteLength > MAX_JSON_BYTES) {
    return { success: false, errors: [{ path: '$', message: 'JSON 檔案不可超過 1 MB' }] };
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(text) as unknown;
  } catch {
    return { success: false, errors: [{ path: '$', message: '檔案不是有效的 JSON' }] };
  }
  return parseQuotationData(parsed);
};
