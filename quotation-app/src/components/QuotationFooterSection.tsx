import React from 'react';
import type { CompanyConfig } from '../config/companies';
import type { Party } from '../types';
import { CompanyFooter } from './CompanyFooter';
import { getPartyBPreviewLines } from '../domain/partyB';

interface Props { company: CompanyConfig; companyId: string; salesName: string; salesMobile: string; partyB: Party; }

const noticeItems = [
  '請確認報價內容、數量與交期後再回覆確認。',
  '報價金額依本報價單所列規格與數量計算，規格變更需重新估價。',
  '正式製作前請確認檔案、文字、尺寸與顏色；確認後如有修改可能產生費用。',
  '交貨日期自確認稿件與檔案完整收到後起算，實際日期依雙方確認為準。',
  '本報價有效期限為三十日，逾期或原物料價格變動時將重新確認。',
];

export const QuotationFooterSection: React.FC<Props> = ({ company, companyId, salesName, salesMobile, partyB }) => <div className="quotation-footer-section">
  <div className="notice"><p>注意事項：</p><ol className="custom-notice-list">{noticeItems.map((item) => <li key={item}>{item}</li>)}</ol></div>
  <div className="contract-section"><p className="contract-title">合約雙方資訊</p><div className="contract-grid">
    <CompanyFooter company={company} companyId={companyId} salesName={salesName} salesMobile={salesMobile} />
    <div className="contract-party">{getPartyBPreviewLines(partyB).map((line) => <p key={line}>{line}</p>)}</div>
  </div></div>
  <div className="doc-footer"><span>JT-QRP-S01-01A1</span><span>版本：1.0</span></div>
</div>;

export default QuotationFooterSection;
