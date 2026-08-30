import { useEffect, useState } from 'react';
import type { Customer, Party } from '../types';
import { getQuotationHistory, loadCustomers, loadPartyBRecords, type SavedQuotation } from '../storage/localStorageRepository';
import { normalizePartyB } from '../domain/partyB';

export const useQuotationStorage = () => {
  const [history, setHistory] = useState<SavedQuotation[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [partyBRecords, setPartyBRecords] = useState<Party[]>([]);

  useEffect(() => {
    setHistory(getQuotationHistory());
    setCustomers(loadCustomers());
    setPartyBRecords(loadPartyBRecords().map(normalizePartyB));
  }, []);

  return { history, setHistory, customers, setCustomers, partyBRecords, setPartyBRecords };
};
