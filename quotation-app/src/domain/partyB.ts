import type { Party, QuotationData } from '../types';

export const createEmptyPartyB = (): Party => ({
  name: '',
  representative: '',
  address: '',
  taxId: '',
  phone: '',
  fax: '',
  contactPerson: '',
  mobile: '',
});

export const normalizePartyB = (input: unknown): Party => {
  const source = input && typeof input === 'object' ? input as Partial<Party> : {};
  const empty = createEmptyPartyB();

  return {
    name: String(source.name ?? empty.name),
    representative: String(source.representative ?? empty.representative),
    address: String(source.address ?? empty.address),
    taxId: String(source.taxId ?? empty.taxId),
    phone: String(source.phone ?? empty.phone),
    fax: String(source.fax ?? empty.fax),
    contactPerson: String(source.contactPerson ?? empty.contactPerson),
    mobile: String(source.mobile ?? empty.mobile),
  };
};

export const formatPartyBForPreview = (input: Party | null | undefined): string[] => {
  const partyB = normalizePartyB(input);

  return [
    `乙方：${partyB.name}`,
    `法代：${partyB.representative}`,
    `地址：${partyB.address}`,
    `統一編號：${partyB.taxId}`,
    `電話：${partyB.phone}\u3000傳真：${partyB.fax}`,
    `聯絡人：${partyB.contactPerson}\u3000手機：${partyB.mobile}`,
  ];
};

export const getPartyBPreviewLines = (input: Party | null | undefined): string[] => formatPartyBForPreview(input);

export const upsertPartyBRecord = (records: Party[], partyB: Party): Party[] => {
  if (!partyB.name.trim()) return records;
  return [partyB, ...records.filter((record) => record.name !== partyB.name)];
};

export const normalizeQuotationData = (input: unknown): QuotationData => {
  const source = input && typeof input === 'object' ? input as Partial<QuotationData> : {};
  return { ...source, partyB: normalizePartyB(source.partyB) } as QuotationData;
};
