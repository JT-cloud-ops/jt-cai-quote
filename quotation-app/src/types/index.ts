export interface Customer {
  name: string;
  contactPerson: string;
  phone: string;
  mobile: string;
  fax: string;
  deliveryLocation: string;
}

export interface QuotationItem {
  id: string;
  jobName: string;
  sheetSize: string;
  printColor: string;
  paperName: string;
  processingDetails: string;
  quantity: string;
  unit: string;
  unitPrice: string;
}

export interface QuotationData {
  customerName: string;
  contactPerson: string;
  phone: string;
  mobile: string;
  fax: string;
  items: QuotationItem[];
  remarks: string;
  orderYear: string;
  orderMonth: string;
  orderDay: string;
  paymentMethod: string;
  deliveryYear: string;
  deliveryMonth: string;
  deliveryDay: string;
  deliveryLocation: string;
  salesName: string;
  salesMobile: string;
}
