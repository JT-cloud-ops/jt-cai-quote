import type { Customer, Party, QuotationData } from '../types';

export interface SavedQuotation {
  id: string;
  timestamp: string;
  title: string;
  data: QuotationData;
}

const HISTORY_KEY = 'quotationHistory';
const CUSTOMER_KEY = 'customerDatabase';
const PARTY_B_KEY = 'partyBDatabase';
const LAST_COMPANY_KEY = 'lastCompanyId';
const LAST_SALES_NAME_KEY = 'lastSalesName';
const LAST_SALES_MOBILE_KEY = 'lastSalesMobile';
const MAX_HISTORY = 20;
const QUOTATION_KEYS = [HISTORY_KEY, CUSTOMER_KEY, PARTY_B_KEY, LAST_COMPANY_KEY, LAST_SALES_NAME_KEY, LAST_SALES_MOBILE_KEY];

const getStorage = (): Storage | null => {
  try {
    return typeof localStorage === 'undefined' ? null : localStorage;
  } catch {
    return null;
  }
};

const isRecord = (value: unknown): value is Record<string, unknown> => value !== null && typeof value === 'object';

const readCollection = <T>(key: string): T[] => {
  const storage = getStorage();
  if (!storage) return [];
  try {
    const parsed: unknown = JSON.parse(storage.getItem(key) ?? 'null');
    return Array.isArray(parsed) ? parsed.filter(isRecord) as T[] : [];
  } catch {
    return [];
  }
};

const writeJson = (key: string, value: unknown): void => {
  try {
    getStorage()?.setItem(key, JSON.stringify(value));
  } catch {
    // 儲存空間不足或瀏覽器限制時，維持表單可用。
  }
};

const readPreference = (key: string, fallback: string): string => {
  try {
    return getStorage()?.getItem(key) || fallback;
  } catch {
    return fallback;
  }
};

const writePreference = (key: string, value: string): void => {
  try {
    getStorage()?.setItem(key, value);
  } catch {
    // 儲存空間不足或瀏覽器限制時，維持表單可用。
  }
};

export const getQuotationHistory = (): SavedQuotation[] => readCollection<SavedQuotation>(HISTORY_KEY);
export const saveQuotationHistory = (history: SavedQuotation[]): void => writeJson(HISTORY_KEY, history.slice(0, MAX_HISTORY));

export const loadCustomers = (): Customer[] => readCollection<Customer>(CUSTOMER_KEY);
export const saveCustomers = (customers: Customer[]): void => writeJson(CUSTOMER_KEY, customers);

export const loadPartyBRecords = (): Party[] => readCollection<Party>(PARTY_B_KEY);
export const savePartyBRecords = (records: Party[]): void => writeJson(PARTY_B_KEY, records);

export const getLastCompanyId = (): string => readPreference(LAST_COMPANY_KEY, 'jie-cai');
export const setLastCompanyId = (value: string): void => writePreference(LAST_COMPANY_KEY, value);
export const getLastSalesName = (): string => readPreference(LAST_SALES_NAME_KEY, '');
export const setLastSalesName = (value: string): void => writePreference(LAST_SALES_NAME_KEY, value);
export const getLastSalesMobile = (): string => readPreference(LAST_SALES_MOBILE_KEY, '');
export const setLastSalesMobile = (value: string): void => writePreference(LAST_SALES_MOBILE_KEY, value);

export const clearLocalData = (): void => {
  const storage = getStorage();
  if (!storage) return;
  QUOTATION_KEYS.forEach((key) => {
    try {
      storage.removeItem(key);
    } catch {
      // 單一 key 清除失敗時，繼續嘗試其他資料。
    }
  });
};
