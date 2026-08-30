import React from 'react';
import type { Customer, QuotationData } from '../types';

interface Props {
  data: QuotationData;
  customers: Customer[];
  listRef: React.RefObject<HTMLDivElement | null>;
  showList: boolean;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onFocus: () => void;
  onSelect: (customer: Customer) => void;
}

const CustomerFields: React.FC<Props> = ({ data, customers, listRef, showList, onChange, onFocus, onSelect }) => {
  const matches = customers.filter((customer) => customer.name.toLowerCase().includes(data.customerName.toLowerCase()));
  return <>
    <div className="form-group" style={{ position: 'relative' }}>
      <label>客戶名稱</label>
      <input type="text" name="customerName" value={data.customerName} onChange={onChange} onFocus={onFocus} autoComplete="off" />
      {showList && matches.length > 0 && <div className="customer-dropdown" ref={listRef}>
        {matches.map((customer, index) => <div key={index} className="customer-option" onClick={() => onSelect(customer)}><div className="c-name">{customer.name}</div><div className="c-info">{customer.contactPerson} | {customer.phone}</div></div>)}
      </div>}
    </div>
    <div className="form-row"><div className="form-group"><label>聯絡人</label><input type="text" name="contactPerson" value={data.contactPerson} onChange={onChange} /></div><div className="form-group"><label>電話</label><input type="text" name="phone" value={data.phone} onChange={onChange} /></div></div>
    <div className="form-row"><div className="form-group"><label>行動電話</label><input type="text" name="mobile" value={data.mobile} onChange={onChange} /></div><div className="form-group"><label>傳真</label><input type="text" name="fax" value={data.fax} onChange={onChange} /></div></div>
  </>;
};
export default CustomerFields;
