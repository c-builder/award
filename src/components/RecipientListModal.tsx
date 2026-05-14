import React, { useState, useMemo } from 'react';
import { Pagination } from './Pagination';
import { Recipient } from './types';

export interface RecipientListModalProps {
  visible: boolean;
  awardName: string;
  recipients: Recipient[];
  issuingDepartment: string;
  currentDepartment?: string;
  onClose: () => void;
}

/**
 * 获奖人列表弹窗组件
 * 用于展示大量获奖人员数据
 * 支持表格展示、分页、搜索、部门筛选
 */
export const RecipientListModal: React.FC<RecipientListModalProps> = ({
  visible,
  awardName,
  recipients,
  issuingDepartment,
  currentDepartment = '',
  onClose,
}) => {
  // 分页状态
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // 搜索关键词
  const [searchKeyword, setSearchKeyword] = useState('');

  const filteredRecipients = useMemo(() => {
    return recipients.filter((recipient) => {
      const searchMatch =
        !searchKeyword ||
        recipient.name.includes(searchKeyword) ||
        recipient.employeeId.includes(searchKeyword);
      return searchMatch;
    });
  }, [recipients, searchKeyword]);

  // 分页后的列表
  const paginatedRecipients = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return filteredRecipients.slice(startIndex, startIndex + pageSize);
  }, [filteredRecipients, currentPage]);

  // 判断是否为跨部门人员：获奖人的一级部门 ≠ 当前选择的部门
  const isCrossDepartment = (department: string) => {
    const recipientMainDept = department.split('/')[0];
    if (currentDepartment) {
      return recipientMainDept !== currentDepartment;
    }
    const issuingMainDept = issuingDepartment.split('/')[0];
    return recipientMainDept !== issuingMainDept;
  };

  // 重置筛选条件
  const handleReset = () => {
    setSearchKeyword('');
    setCurrentPage(1);
    setPageSize(10);
  };

  const handleClose = () => {
    setSearchKeyword('');
    setCurrentPage(1);
    setPageSize(10);
    onClose();
  };



  if (!visible) return null;

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
        zIndex: 2000,
        overflow: 'hidden',
        overscrollBehavior: 'contain',
      }}
      onClick={handleClose}
    >
      <div
        style={{
          backgroundColor: '#fff',
          borderRadius: '12px',
          width: '800px',
          maxHeight: '85vh',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* 弹窗头部 */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '20px 24px',
            borderBottom: '1px solid #f0f0f0',
            background: 'linear-gradient(135deg, #e6f7ff 0%, #f0f9ff 100%)',
            borderRadius: '12px 12px 0 0',
          }}
        >
          <div>
            <h3
              style={{
                margin: 0,
                fontSize: '18px',
                fontWeight: 600,
                color: '#1890ff',
              }}
            >
              🏆 {awardName}
            </h3>
            <p style={{ margin: '6px 0 0 0', fontSize: '14px', color: '#666' }}>
              共 {recipients.length} 位获奖人
              {filteredRecipients.length !== recipients.length &&
                ` (筛选后 ${filteredRecipients.length} 人)`}
            </p>
          </div>
          <button
            onClick={handleClose}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '24px',
              color: '#999',
              cursor: 'pointer',
              padding: '0',
              width: '36px',
              height: '36px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: '50%',
              transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#f5f5f5';
              e.currentTarget.style.color = '#666';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.color = '#999';
            }}
          >
            ×
          </button>
        </div>

        {/* 筛选栏 */}
        <div
          style={{
            padding: '16px 24px',
            borderBottom: '1px solid #f0f0f0',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            flexWrap: 'wrap',
            backgroundColor: '#fafafa',
          }}
        >
          {/* 搜索框 */}
          <input
            type="text"
            placeholder="搜索姓名或工号..."
            value={searchKeyword}
            onChange={(e) => {
              setSearchKeyword(e.target.value);
              setCurrentPage(1);
            }}
            style={{
              padding: '8px 12px',
              border: '1px solid #d9d9d9',
              borderRadius: '6px',
              fontSize: '14px',
              width: '200px',
              outline: 'none',
              transition: 'all 0.3s',
            }}
            onFocus={(e) => {
              e.target.style.borderColor = '#1890ff';
              e.target.style.boxShadow = '0 0 0 3px rgba(24, 144, 255, 0.1)';
            }}
            onBlur={(e) => {
              e.target.style.borderColor = '#d9d9d9';
              e.target.style.boxShadow = 'none';
            }}
          />

          {/* 重置按钮 */}
          {searchKeyword && (
            <button
              onClick={handleReset}
              style={{
                padding: '8px 16px',
                backgroundColor: '#fff',
                color: '#666',
                border: '1px solid #d9d9d9',
                borderRadius: '6px',
                fontSize: '14px',
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#1890ff';
                e.currentTarget.style.color = '#1890ff';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = '#d9d9d9';
                e.currentTarget.style.color = '#666';
              }}
            >
              重置
            </button>
          )}
        </div>

        {/* 表格区域 */}
        <div
          style={{
            flex: 1,
            overflow: 'auto',
            padding: '0',
            display: 'flex',
            flexDirection: 'column',
            overscrollBehavior: 'contain',
          }}
        >
          {/* 表格头部 */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '60px 80px 1.5fr 1fr 2fr 80px',
              padding: '12px 24px',
              backgroundColor: '#fafafa',
              borderBottom: '1px solid #e8e8e8',
              fontSize: '14px',
              fontWeight: 500,
              color: '#666',
              flexShrink: 0,
            }}
          >
            <div></div>
            <div style={{ textAlign: 'center' }}>序号</div>
            <div>姓名</div>
            <div>工号</div>
            <div>部门</div>
            <div style={{ textAlign: 'center' }}>标识</div>
          </div>

          {/* 表格内容 */}
          <div style={{ flex: 1, overflow: 'auto' }}>
            {paginatedRecipients.length > 0 ? (
              paginatedRecipients.map((recipient, index) => {
                const crossDept = isCrossDepartment(recipient.department);
                const seq = (currentPage - 1) * pageSize + index + 1;

                return (
                  <div
                    key={`${recipient.employeeId}-${index}`}
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '60px 50px 1.5fr 1fr 2fr 80px',
                      padding: '12px 24px',
                      borderBottom: '1px solid #f0f0f0',
                      fontSize: '14px',
                      color: '#333',
                      backgroundColor: index % 2 === 0 ? '#fff' : '#fafafa',
                      alignItems: 'center',
                      transition: 'background-color 0.2s',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#f0f9ff';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = index % 2 === 0 ? '#fff' : '#fafafa';
                    }}
                  >
                    {/* 空列占位 */}
                    <div></div>

                    {/* 序号 */}
                    <div style={{ textAlign: 'center', color: '#666' }}>
                      {seq}
                    </div>

                    {/* 姓名 */}
                    <div
                      style={{
                        fontWeight: 500,
                        color: crossDept ? '#1890ff' : '#333',
                      }}
                    >
                      {recipient.name}
                    </div>

                    {/* 工号 */}
                    <div
                      style={{
                        fontFamily: 'monospace',
                        color: '#666',
                        fontSize: '13px',
                      }}
                    >
                      {recipient.employeeId}
                    </div>

                    {/* 部门 */}
                    <div
                      style={{
                        color: crossDept ? '#1890ff' : '#666',
                        fontSize: '13px',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}
                      title={recipient.department}
                    >
                      {recipient.department}
                    </div>

                    {/* 跨部门标识 */}
                    <div style={{ textAlign: 'center' }}>
                      {crossDept && (
                        <span
                          style={{
                            display: 'inline-block',
                            padding: '2px 8px',
                            backgroundColor: '#1890ff',
                            color: '#fff',
                            fontSize: '11px',
                            fontWeight: 500,
                            borderRadius: '4px',
                          }}
                        >
                          跨
                        </span>
                      )}
                    </div>
                  </div>
                );
              })
            ) : (
              <div
                style={{
                  padding: '48px 24px',
                  textAlign: 'center',
                  color: '#999',
                  fontSize: '14px',
                }}
              >
                <div style={{ fontSize: '48px', marginBottom: '12px' }}>🔍</div>
                <div>未找到匹配的获奖人</div>
              </div>
            )}
          </div>

          {/* 分页器 */}
          {filteredRecipients.length > 0 && (
            <div
              style={{
                padding: '12px 24px',
                borderTop: '1px solid #f0f0f0',
                backgroundColor: '#fff',
                flexShrink: 0,
              }}
            >
              <Pagination
                  current={currentPage}
                  pageSize={pageSize}
                  total={filteredRecipients.length}
                  onChange={setCurrentPage}
                  onPageSizeChange={(size) => { setPageSize(size); setCurrentPage(1); }}
                  showTotal
                  showPageSize
                />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RecipientListModal;
