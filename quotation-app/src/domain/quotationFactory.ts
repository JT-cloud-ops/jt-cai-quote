import type { BookletJob, BookletPart, QuotationData, QuotationItem } from '../types';
import { createEmptyPartyB } from './partyB';
import { getLastCompanyId, getLastSalesMobile, getLastSalesName } from '../storage/localStorageRepository';

type QuotationType = QuotationData['quotationType'];

const generateId = (): string => Math.random().toString(36).substring(2, 11) + Date.now().toString(36);

export const createEmptyItem = (): QuotationItem => ({
  id: generateId(),
  jobName: '',
  sheetSize: '',
  printColor: '',
  reverseColor: '',
  specialColor: '',
  paperName: '',
  processingDetails: '',
  quantity: '',
  unit: '份',
  unitPrice: '',
  taxType: 'exclude',
  manualAmount: '',
});

export const createEmptyBookletPart = (name: string): BookletPart => ({
  id: generateId(),
  partName: name,
  sheetSize: '',
  printColor: '',
  reverseColor: '',
  specialColor: '',
  paperName: '',
  processingDetails: '',
});

export const createEmptyBookletJob = (): BookletJob => ({
  id: generateId(),
  jobName: '',
  jobSheetSize: '',
  bindingMethod: '',
  quantity: '',
  unit: '本',
  unitPrice: '',
  hqQuantity: '',
  parts: [
    createEmptyBookletPart('封面'),
    createEmptyBookletPart('扉頁'),
    createEmptyBookletPart('內頁'),
  ],
});

export const createEmptyQuotation = (type: QuotationType = 'single'): QuotationData => ({
  companyId: getLastCompanyId(),
  quotationType: type,
  customerName: '',
  contactPerson: '',
  phone: '',
  mobile: '',
  fax: '',
  partyB: createEmptyPartyB(),
  items: type === 'single' ? [createEmptyItem()] : [],
  bookletJobs: type === 'booklet' || type === 'dept' ? [createEmptyBookletJob()] : [],
  remarks: '',
  orderYear: '',
  orderMonth: '',
  orderDay: '',
  paymentMethod: '',
  deliveryYear: '',
  deliveryMonth: '',
  deliveryDay: '',
  deliveryLocation: '',
  salesName: getLastSalesName(),
  salesMobile: getLastSalesMobile(),
});
