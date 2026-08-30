import React from 'react';
import type { CompanyConfig } from '../config/companies';
import type { Party } from '../types';
import { CompanyFooter } from './CompanyFooter';
import { getPartyBPreviewLines } from '../domain/partyB';

interface Props { company: CompanyConfig; companyId: string; salesName: string; salesMobile: string; partyB: Party; }

const noticeItems = [
  '?勗???? _______ 憭抬??砍?孵蝬眼???寧偷蝡??臬?',
  '?亙?摰Ｘ?湔??? or 撅?券?鋆賭?',
  '?砍隞嗡?蝬脩?嚗????靽???隞亙?',
  '鞎游?詨?閮ˊ雿??啣????',
  '?砍隞嗡?銝?砍?瑟靘ˊ雿?',
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
