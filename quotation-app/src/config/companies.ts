export interface CompanyConfig {
  id: string;
  name: string;
  fullName: string;
  address: string;
  phone: string;
  fax: string;
  taxId?: string;
  representative?: string;
  stampPosition?: {
    top: string;
    left: string;
  };
}

export const companies: Record<string, CompanyConfig> = {
  'jie-cai': {
    id: 'jie-cai',
    name: '捷采',
    fullName: '捷采印刷事業(股)公司',
    address: '台中工業區31路1之1號',
    phone: '04-23580040',
    fax: '04-23580042',
    taxId: '23518409',
    representative: '傅 延 本'
  },
  'cai-xin': {
    id: 'cai-xin',
    name: '彩鑫',
    fullName: '彩鑫印刷事業股份有限公司',
    address: '臺中市西屯區協和里工業區31路1之5號',
    phone: '04-23500296',
    fax: '04-23500288',
    taxId: '',
    representative: ''
  },
  'health': {
    id: 'health',
    name: '赫爾思',
    fullName: '赫爾思科技股份有限公司',
    address: '臺中市西屯區何成里大祥街12號3樓',
    phone: '04-37031355',
    fax: '',
    taxId: '',
    representative: ''
  },
  'li-xin': {
    id: 'li-xin',
    name: '栗鑫',
    fullName: '栗鑫實業股份有限公司二廠',
    address: '台中市西屯區工業31路1號',
    phone: '04-37031299',
    fax: '04-23599060',
    taxId: '',
    representative: ''
  }
};
