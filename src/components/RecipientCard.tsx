import React from 'react';
import { Recipient } from './types';

export interface RecipientCardProps {
  recipient: Recipient;
  issuingDepartment: string;
  onRemove?: () => void;
}

/**
 * 获奖人卡片组件
 * 显示获奖人姓名、工号、部门信息
 * 跨部门人员使用蓝色高亮样式（蓝色边框+蓝色部门文字）
 */
export const RecipientCard: React.FC<RecipientCardProps> = ({
  recipient,
  issuingDepartment,
  onRemove,
}) => {
  // 判断是否为跨部门人员
  const isCrossDepartment = recipient.department !== issuingDepartment;

  return (
    <div
      className={`recipient-card ${isCrossDepartment ? 'cross-department' : ''}`}
      style={{
        position: 'relative',
        padding: '8px 12px',
        backgroundColor: '#fff',
        border: `1px solid ${isCrossDepartment ? '#1890ff' : '#d9d9d9'}`,
        borderRadius: '4px',
        fontSize: '13px',
        transition: 'all 0.2s',
        minWidth: '80px',
      }}
    >
      {/* 删除按钮 */}
      {onRemove && (
        <button
          className="recipient-remove-btn"
          onClick={onRemove}
          style={{
            position: 'absolute',
            top: '-6px',
            right: '-6px',
            width: '16px',
            height: '16px',
            borderRadius: '50%',
            backgroundColor: '#ff4d4f',
            color: '#fff',
            border: 'none',
            cursor: 'pointer',
            fontSize: '10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            opacity: 0,
            transition: 'opacity 0.2s',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.opacity = '1';
          }}
        >
          ×
        </button>
      )}

      {/* 姓名 */}
      <div
        className="recipient-name"
        style={{
          fontWeight: 500,
          color: '#333',
          marginBottom: '2px',
        }}
      >
        {recipient.name}
      </div>

      {/* 工号 */}
      {recipient.employeeId && (
        <div
          className="recipient-employee-id"
          style={{
            fontSize: '11px',
            color: '#666',
            marginBottom: '2px',
          }}
        >
          {recipient.employeeId}
        </div>
      )}

      {/* 部门 - 跨部门人员使用蓝色高亮 */}
      <div
        className="recipient-department"
        style={{
          fontSize: '11px',
          color: isCrossDepartment ? '#1890ff' : '#999',
          fontWeight: isCrossDepartment ? 500 : 400,
        }}
      >
        {recipient.department}
      </div>
    </div>
  );
};

export default RecipientCard;
