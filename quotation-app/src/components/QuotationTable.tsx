import React from 'react';

interface Props {
  children: React.ReactNode;
}

/** 報價預覽的明細表格容器，集中表格語意與樣式邊界。 */
export const QuotationTable: React.FC<Props> = ({ children }) => (
  <table className="quotation-table-main">{children}</table>
);

export default QuotationTable;
