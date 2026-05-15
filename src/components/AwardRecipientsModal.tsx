import React, { useState, useMemo } from 'react';
import { Pagination } from './Pagination';
import type { Recipient } from './types';

export interface AwardRecipientsModalProps {
  visible: boolean;
  awardName: string;
  recipients: Recipient[];
  onClose: () => void;
}

const DEFAULT_PAGE_SIZE = 10;

export const AwardRecipientsModal: React.FC<AwardRecipientsModalProps> = ({
  visible,
  awardName,
  recipients,
  onClose,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);
  const [hoveredRowId, setHoveredRowId] = useState<string | null>(null);
  const [cancelBtnHovered, setCancelBtnHovered] = useState(false);

  const paginatedRecipients = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return recipients.slice(start, start + pageSize);
  }, [recipients, currentPage, pageSize]);

  if (!visible) return null;

  const thStyle: React.CSSProperties = {
    padding: '14px 16px',
    textAlign: 'left',
    fontWeight: 600,
    color: '#333',
    borderBottom: '2px solid #e8e8e8',
    fontSize: '13px',
    whiteSpace: 'nowrap',
  };

  const tdStyle = (isLast: boolean): React.CSSProperties => ({
    padding: '13px 16px',
    borderBottom: isLast ? 'none' : '1px solid #f0f0f0',
    fontSize: '14px',
  });

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.45)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 2100,
        overflow: 'hidden',
        overscrollBehavior: 'contain',
      }}
      onClick={onClose}
    >
      <div
        style={{
          backgroundColor: '#fff',
          borderRadius: '8px',
          width: '800px',
          maxHeight: '80vh',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 6px 16px rgba(0, 0, 0, 0.12), 0 3px 6px -4px rgba(0, 0, 0, 0.08), 0 9px 28px 8px rgba(0, 0, 0, 0.05)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* 标题栏 */}
        <div
          style={{
            padding: '16px 24px',
            borderBottom: '1px solid #f0f0f0',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 600, color: '#333' }}>
            {awardName} - 获奖人列表
          </h3>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '18px',
              color: '#999',
              cursor: 'pointer',
              padding: '4px 8px',
              lineHeight: 1,
              borderRadius: '4px',
              transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = '#333';
              e.currentTarget.style.backgroundColor = '#f5f5f5';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = '#999';
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
          >
            ×
          </button>
        </div>

        {/* 表格区域 */}
        <div style={{ flex: 1, overflow: 'auto', overscrollBehavior: 'contain', padding: '0 20px', backgroundColor: '#fafafa' }}>
          {recipients.length === 0 ? (
            <div style={{
              padding: '48px 0',
              textAlign: 'center',
              color: '#bfbfbf',
              fontSize: '14px',
            }}>
              暂无获奖人数据
            </div>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse', tableLayout: 'fixed' }}>
              <thead>
                <tr style={{ backgroundColor: '#fafafa' }}>
                  <th style={{ ...thStyle, textAlign: 'center', width: '70px' }}>序号</th>
                  <th style={{ ...thStyle, width: '100px' }}>姓名</th>
                  <th style={{ ...thStyle, width: '120px' }}>工号</th>
                  <th style={{ ...thStyle }}>部门</th>
                </tr>
              </thead>
              <tbody>
                {paginatedRecipients.map((recipient, index) => {
                  const seq = (currentPage - 1) * pageSize + index + 1;
                  const isLast = index === paginatedRecipients.length - 1;
                  return (
                    <tr
                      key={recipient.employeeId}
                      style={{
                        backgroundColor: hoveredRowId === recipient.employeeId ? '#fafafa' : 'transparent',
                        transition: 'background-color 0.2s',
                      }}
                      onMouseEnter={() => setHoveredRowId(recipient.employeeId)}
                      onMouseLeave={() => setHoveredRowId(null)}
                    >
                      <td style={{ ...tdStyle(isLast), textAlign: 'center', color: '#8c8c8c' }}>
                        {seq}
                      </td>
                      <td style={{ ...tdStyle(isLast), color: '#262626', fontWeight: 500 }}>
                        {recipient.name}
                      </td>
                      <td style={{ ...tdStyle(isLast), color: '#595959', fontFamily: 'monospace', letterSpacing: '0.5px' }}>
                        {recipient.employeeId}
                      </td>
                      <td style={{ ...tdStyle(isLast), color: '#595959' }}>
                        {recipient.department}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>

        {/* 分页器 */}
        {recipients.length > 0 && (
          <div style={{
            padding: '0 24px',
            borderTop: '1px solid #f0f0f0',
            flexShrink: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
            <div style={{ fontSize: '14px', color: '#595959' }}>
              共 <span style={{ color: '#1890ff', fontWeight: 500 }}>{recipients.length}</span> 人
            </div>
            <Pagination
              current={currentPage}
              pageSize={pageSize}
              total={recipients.length}
              onChange={setCurrentPage}
              onPageSizeChange={(size) => { setPageSize(size); setCurrentPage(1); }}
              showTotal
              showPageSize
            />
          </div>
        )}

        {/* 底部按钮 */}
        <div
          style={{
            padding: '16px 24px',
            borderTop: '1px solid #f0f0f0',
            display: 'flex',
            justifyContent: 'flex-end',
            gap: '12px',
          }}
        >
          <button
            onClick={onClose}
            onMouseEnter={() => setCancelBtnHovered(true)}
            onMouseLeave={() => setCancelBtnHovered(false)}
            style={{
              padding: '8px 24px',
              backgroundColor: '#fff',
              color: '#595959',
              border: `1px solid ${cancelBtnHovered ? '#40a9ff' : '#d9d9d9'}`,
              borderRadius: '4px',
              fontSize: '14px',
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
          >
            关闭
          </button>
        </div>
      </div>
    </div>
  );
};

export default AwardRecipientsModal;
