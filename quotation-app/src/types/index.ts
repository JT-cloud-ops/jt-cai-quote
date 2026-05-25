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

// 冊子類型的子項目 (如封面、內頁)
export interface BookletPart {
  id: string;
  partName: string; // 封面、扉頁等
  sheetSize: string;
  printColor: string;
  paperName: string;
  processingDetails: string;
}

// 冊子類型的完整印件
export interface BookletJob {
  id: string;
  jobName: string; // 冊子總名稱
  jobSheetSize: string; // 冊子開數
  bindingMethod: string; // 裝訂方法
  quantity: string;
  unit: string;
  unitPrice: string;
  hqQuantity: string; // 總公司量 (百貨類使用)
  parts: BookletPart[];
}

export interface QuotationData {
  quotationType: 'single' | 'booklet' | 'dept';
  customerName: string;
  contactPerson: string;
  phone: string;
  mobile: string;
  fax: string;
  
  // 單張類使用
  items: QuotationItem[];
  
  // 冊子類使用
  bookletJobs: BookletJob[];
  
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
