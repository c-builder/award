import React from 'react';
import { Recipient } from './types';

export interface RecipientCardProps {
  recipient: Recipient;
  issuingDepartment: string;
  currentDepartment?: string;
  isSelected?: boolean;
  onSelect?: () => void;
}

/**
 * 获奖人卡片组件
 * 显示获奖人姓名、工号、部门信息
 * 支持点击选中/取消选中
 * 样式与团队奖卡片保持一致
 * 一行最多显示6个卡片
 */
export const RecipientCard: React.FC<RecipientCardProps> = ({
  recipient,
  issuingDepartment,
  currentDepartment = '',
  isSelected = false,
  onSelect,
}) => {
  // 判断是否为跨部门人员：获奖人的一级部门 ≠ 当前选择的部门
  // 如果没有指定当前部门，则与颁发部门的一级部门比较
  const isCrossDepartment = currentDepartment
    ? recipient.department.split('/')[0] !== currentDepartment
    : recipient.department.split('/')[0] !== issuingDepartment.split('/')[0];

  return (
    <div
      className={`recipient-card ${isCrossDepartment ? 'cross-department' : ''} ${isSelected ? 'selected' : ''}`}
      style={{
        position: 'relative',
        padding: '12px 16px',
        backgroundColor: isSelected ? '#e6f7ff' : '#f8fafc',
        border: isSelected ? '1px solid #1890ff' : '1px solid #e2e8f0',
        borderRadius: '6px',
        width: 'calc((100% - 48px) / 5)',
        minWidth: 'calc((100% - 48px) / 5)',
        maxWidth: 'calc((100% - 48px) / 5)',
        boxSizing: 'border-box',
        cursor: onSelect ? 'pointer' : 'default',
        transition: 'all 0.2s',
      }}
      onClick={onSelect}
    >
      {/* 选中标记 - 左上角 */}
      {isSelected && (
        <span
          style={{
            position: 'absolute',
            top: '-4px',
            left: '-4px',
            width: '16px',
            height: '16px',
            borderRadius: '50%',
            backgroundColor: '#1890ff',
            color: '#fff',
            fontSize: '10px',
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 5,
            boxShadow: '0 1px 3px rgba(24, 144, 255, 0.3)',
          }}
        >
          ✓
        </span>
      )}

      {/* 跨部门标记 - 右下角 */}
      {isCrossDepartment && (
        <span
          style={{
            position: 'absolute',
            bottom: '-4px',
            right: '-4px',
            padding: '1px 4px',
            backgroundColor: '#1890ff',
            color: '#fff',
            fontSize: '9px',
            fontWeight: 600,
            borderRadius: '3px',
            zIndex: 5,
            boxShadow: '0 1px 3px rgba(24, 144, 255, 0.3)',
          }}
        >
          跨
        </span>
      )}

      {/* 姓名和工号同一行 */}
      <div
        className="recipient-header"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          marginBottom: '4px',
        }}
      >
        <span
          className="recipient-name"
          style={{
            fontSize: '14px',
            fontWeight: 500,
            color: isSelected ? '#1890ff' : '#1a1a2e',
          }}
        >
          {recipient.name}
        </span>
        <span
          style={{
            fontSize: '12px',
            color: '#6b7280',
            fontFamily: 'monospace',
          }}
        >
          {recipient.employeeId}
        </span>
      </div>

      {/* 部门 - 超长使用省略号 */}
      <div
        className="recipient-department"
        style={{
          fontSize: '12px',
          color: isSelected ? '#1890ff' : '#6b7280',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
          maxWidth: '100%',
          display: 'block',
        }}
        title={recipient.department}
      >
        {recipient.department}
      </div>
    </div>
  );
};

export default RecipientCard;
