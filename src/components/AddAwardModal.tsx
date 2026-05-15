import React, { useState, useEffect, useMemo } from 'react';
import { DeptCascader } from './DeptCascader';
import { Pagination } from './Pagination';
import { Award } from './types';
import addAwardItemsData from '../mock/data/addAwardItems.json';

export interface Recipient {
  name: string;
  employeeId: string;
  department: string;
}

export type AwardCategory = '个人奖' | '团队奖';

export interface AwardItem {
  id: string;
  name: string;
  category: AwardCategory;
  recipientCount: number;
  issuingDepartment: string;
  issuingDepartmentPath: string[];
  recipients?: Recipient[];
}

export interface AddAwardModalProps {
  visible: boolean;
  onCancel: () => void;
  onConfirm: (selectedAwards: AwardItem[]) => void;
  existingAwards?: Award[];
  externalDeptPath?: string[];
}

const YEAR_OPTIONS = [
  { value: '2025', label: '2025年' },
  { value: '2024', label: '2024年' },
  { value: '2023', label: '2023年' },
];

const MOCK_AWARDS = addAwardItemsData as AwardItem[];

export const AddAwardModal: React.FC<AddAwardModalProps> = ({
  visible,
  onCancel,
  onConfirm,
  existingAwards = [],
  externalDeptPath = [],
}) => {
  const [year, setYear] = useState<string>('2025');
  const [selectedDeptPath, setSelectedDeptPath] = useState<string[]>([]);
  const [searchKeyword, setSearchKeyword] = useState<string>('');
  const [selectedAwardIds, setSelectedAwardIds] = useState<Set<string>>(new Set());
  const [expandedAwardIds, setExpandedAwardIds] = useState<Set<string>>(new Set());
  const [hoveredRowId, setHoveredRowId] = useState<string | null>(null);
  const [hoveredAwardId, setHoveredAwardId] = useState<string | null>(null);
  const [inputFocused, setInputFocused] = useState(false);

  useEffect(() => {
    if (visible) {
      setSelectedDeptPath(externalDeptPath);
      // 初始化时，所有已存在的奖项（包括默认和自定义）都设为选中状态
      const allExistingAwardIds = new Set<string>();
      existingAwards.forEach(existingAward => {
        const mockAward = MOCK_AWARDS.find(mock => mock.name === existingAward.title);
        if (mockAward) {
          allExistingAwardIds.add(mockAward.id);
        }
      });
      setSelectedAwardIds(allExistingAwardIds);
    }
  }, [visible, existingAwards, externalDeptPath]);

  useEffect(() => {
    if (!visible) {
      setYear('2025');
      setSelectedDeptPath([]);
      setSearchKeyword('');
      setSelectedAwardIds(new Set());
      setExpandedAwardIds(new Set());
      setCurrentPage(1);
    }
  }, [visible]);

  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;

  const existingDefaultAwardNames = useMemo(() => {
    return new Set(existingAwards.filter(award => award.isDefault).map(award => award.title));
  }, [existingAwards]);

  const filteredAwards = useMemo(() => {
    return MOCK_AWARDS.filter((award) => {
      if (selectedDeptPath.length > 0) {
        const match = selectedDeptPath.every((dept, index) =>
          award.issuingDepartmentPath[index] === dept
        );
        if (!match) return false;
      }
      if (searchKeyword && !award.name.toLowerCase().includes(searchKeyword.toLowerCase())) {
        return false;
      }
      return true;
    });
  }, [selectedDeptPath, searchKeyword]);

  // 所有奖项都可以选择（包括默认奖项）
  const selectableAwards = filteredAwards;

  const selectableSelectedCount = useMemo(() => {
    return selectableAwards.filter(award => selectedAwardIds.has(award.id)).length;
  }, [selectableAwards, selectedAwardIds]);

  const isAllSelected = selectableAwards.length > 0 && selectableSelectedCount === selectableAwards.length;
  const isIndeterminate = selectableSelectedCount > 0 && selectableSelectedCount < selectableAwards.length;

  const toggleAll = () => {
    if (isAllSelected) {
      setSelectedAwardIds(prev => {
        const next = new Set(prev);
        selectableAwards.forEach(a => next.delete(a.id));
        return next;
      });
    } else {
      setSelectedAwardIds(prev => {
        const next = new Set(prev);
        selectableAwards.forEach(a => next.add(a.id));
        return next;
      });
    }
  };

  // 判断奖项是否为系统推荐（默认奖项）
  const isSystemRecommended = (awardName: string) => {
    return existingDefaultAwardNames.has(awardName);
  };

  const paginatedAwards = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return filteredAwards.slice(startIndex, startIndex + pageSize);
  }, [filteredAwards, currentPage]);

  // 获取已选奖项列表
  const selectedAwardsList = useMemo(() => {
    return MOCK_AWARDS.filter((award) => selectedAwardIds.has(award.id));
  }, [selectedAwardIds]);

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedDeptPath, searchKeyword]);

  const toggleAwardSelection = (awardId: string) => {
    const award = MOCK_AWARDS.find(a => a.id === awardId);
    if (!award) return;

    // 允许所有奖项自由选择和取消，包括默认奖项
    const newSelected = new Set(selectedAwardIds);
    if (newSelected.has(awardId)) {
      newSelected.delete(awardId);
    } else {
      newSelected.add(awardId);
    }
    setSelectedAwardIds(newSelected);
  };

  // 从已选列表中移除
  const removeFromSelected = (awardId: string) => {
    const newSelected = new Set(selectedAwardIds);
    newSelected.delete(awardId);
    setSelectedAwardIds(newSelected);
  };

  const toggleAwardExpand = (awardId: string) => {
    const newExpanded = new Set(expandedAwardIds);
    if (newExpanded.has(awardId)) {
      newExpanded.delete(awardId);
    } else {
      newExpanded.add(awardId);
    }
    setExpandedAwardIds(newExpanded);
  };

  const handleReset = () => {
    setYear('2025');
    setSelectedDeptPath([]);
    setSearchKeyword('');
  };

  const handleConfirm = () => {
    const selectedList = MOCK_AWARDS.filter((award) => selectedAwardIds.has(award.id));
    onConfirm(selectedList);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
    }
  };

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
        zIndex: 1000,
        overflow: 'hidden',
        overscrollBehavior: 'contain',
      }}
      onClick={onCancel}
    >
      <div
        style={{
          backgroundColor: '#fff',
          borderRadius: '8px',
          width: '1100px',
          maxHeight: '85vh',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 6px 16px rgba(0, 0, 0, 0.12), 0 3px 6px -4px rgba(0, 0, 0, 0.08), 0 9px 28px 8px rgba(0, 0, 0, 0.05)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
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
            添加展播奖项
          </h3>
          <button
            onClick={onCancel}
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

        {/* 主内容区域 - 左右布局 */}
        <div style={{ flex: 1, overflow: 'hidden', display: 'flex', overscrollBehavior: 'contain' }}>
          {/* 左侧 - 已选奖项 */}
          <div
            style={{
              width: '280px',
              borderRight: '1px solid #f0f0f0',
              display: 'flex',
              flexDirection: 'column',
              backgroundColor: '#fafafa',
            }}
          >
            {/* 左侧标题 */}
            <div
              style={{
                padding: '12px 16px',
                borderBottom: '1px solid #f0f0f0',
                backgroundColor: '#f5f5f5',
              }}
            >
              <span style={{ fontSize: '14px', fontWeight: 500, color: '#333' }}>
                已选奖项
              </span>
              <span
                style={{
                  marginLeft: '8px',
                  padding: '2px 8px',
                  backgroundColor: '#1890ff',
                  color: '#fff',
                  borderRadius: '10px',
                  fontSize: '12px',
                }}
              >
                {selectedAwardIds.size}个
              </span>
            </div>

            {/* 已选列表 */}
            <div style={{ flex: 1, overflow: 'auto', padding: '8px' }}>
              {selectedAwardIds.size === 0 ? (
                <div
                  style={{
                    padding: '40px 16px',
                    textAlign: 'center',
                    color: '#999',
                    fontSize: '14px',
                  }}
                >
                  暂无已选奖项
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {selectedAwardsList.map((award) => (
                    <div
                      key={award.id}
                      style={{
                        padding: '12px',
                        backgroundColor: '#fff',
                        borderRadius: '6px',
                        border: '1px solid #e8e8e8',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        cursor: 'default',
                        transition: 'all 0.2s',
                        boxShadow: hoveredAwardId === award.id
                          ? '0 2px 8px rgba(0,0,0,0.1)'
                          : 'none',
                      }}
                      onMouseEnter={() => setHoveredAwardId(award.id)}
                      onMouseLeave={() => setHoveredAwardId(null)}
                    >
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div
                          style={{
                            fontSize: '14px',
                            fontWeight: 500,
                            color: '#333',
                            marginBottom: '4px',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                          }}
                          title={award.name}
                        >
                          {award.name}
                        </div>
                        <div
                          style={{
                            fontSize: '12px',
                            color: '#666',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                          }}
                        >
                          <span>{award.category} · {award.recipientCount}人</span>
                          {isSystemRecommended(award.name) ? (
                            <span
                              style={{
                                padding: '1px 4px',
                                backgroundColor: '#52c41a',
                                color: '#fff',
                                borderRadius: '3px',
                                fontSize: '10px',
                              }}
                            >
                              系统
                            </span>
                          ) : (
                            <span
                              style={{
                                padding: '1px 4px',
                                backgroundColor: '#1890ff',
                                color: '#fff',
                                borderRadius: '3px',
                                fontSize: '10px',
                              }}
                            >
                              用户
                            </span>
                          )}
                        </div>
                      </div>
                      {hoveredAwardId === award.id && (
                        <button
                          onClick={() => removeFromSelected(award.id)}
                          style={{
                            padding: '4px 8px',
                            backgroundColor: '#ff4d4f',
                            color: '#fff',
                            border: 'none',
                            borderRadius: '4px',
                            fontSize: '12px',
                            cursor: 'pointer',
                            marginLeft: '8px',
                            flexShrink: 0,
                          }}
                        >
                          删除
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* 右侧 - 搜索和表格 */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            {/* 搜索栏 */}
            <div
              style={{
                padding: '12px 24px',
                borderBottom: '1px solid #f0f0f0',
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
                backgroundColor: '#fafafa',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '14px', color: '#333', whiteSpace: 'nowrap' }}>年份:</span>
                <select
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  style={{
                    padding: '6px 12px',
                    border: '1px solid #d9d9d9',
                    borderRadius: '4px',
                    fontSize: '14px',
                    backgroundColor: '#fff',
                    cursor: 'pointer',
                    outline: 'none',
                    minWidth: '100px',
                  }}
                >
                  {YEAR_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '14px', color: '#333', whiteSpace: 'nowrap' }}>部门:</span>
                <DeptCascader
                  value={selectedDeptPath}
                  onChange={(value) => setSelectedDeptPath(value)}
                  placeholder="全部部门"
                />
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1 }}>
                <input
                  type="text"
                  placeholder="请输入奖项名称"
                  value={searchKeyword}
                  onChange={(e) => setSearchKeyword(e.target.value)}
                  onKeyDown={handleKeyDown}
                  onFocus={() => setInputFocused(true)}
                  onBlur={() => setInputFocused(false)}
                  style={{
                    padding: '6px 12px',
                    border: `1px solid ${inputFocused ? '#1890ff' : '#d9d9d9'}`,
                    borderRadius: '4px',
                    fontSize: '14px',
                    flex: 1,
                    maxWidth: '200px',
                    outline: 'none',
                    transition: 'border-color 0.2s, box-shadow 0.2s',
                    boxShadow: inputFocused ? '0 0 0 2px rgba(24, 144, 255, 0.2)' : 'none',
                  }}
                />
              </div>

              <button
                onClick={() => {}}
                style={{
                  padding: '6px 20px',
                  backgroundColor: '#1890ff',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '4px',
                  fontSize: '14px',
                  cursor: 'pointer',
                  transition: 'background-color 0.2s',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#40a9ff';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#1890ff';
                }}
              >
                查询
              </button>

              <button
                onClick={handleReset}
                style={{
                  padding: '6px 20px',
                  backgroundColor: '#fff',
                  color: '#595959',
                  border: '1px solid #d9d9d9',
                  borderRadius: '4px',
                  fontSize: '14px',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = '#40a9ff';
                  e.currentTarget.style.color = '#1890ff';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = '#d9d9d9';
                  e.currentTarget.style.color = '#595959';
                }}
              >
                重置
              </button>
            </div>

            {/* 表格区域 */}
            <div style={{ flex: 1, overflow: 'auto', overscrollBehavior: 'contain' }}>
              {filteredAwards.length === 0 ? (
                <div style={{
                  padding: '48px 0',
                  textAlign: 'center',
                  color: '#bfbfbf',
                  fontSize: '14px',
                }}>
                  暂无符合条件的奖项
                </div>
              ) : (
                <table style={{ width: '100%', borderCollapse: 'collapse', tableLayout: 'fixed' }}>
                  <thead>
                    <tr style={{ backgroundColor: '#fafafa' }}>
                      <th style={{ ...thStyle, textAlign: 'center', width: '50px' }}>
                        <div
                          onClick={toggleAll}
                          style={{
                            width: '18px',
                            height: '18px',
                            border: `2px solid ${isAllSelected || isIndeterminate ? '#1890ff' : '#d9d9d9'}`,
                            borderRadius: '3px',
                            backgroundColor: isAllSelected || isIndeterminate ? '#1890ff' : '#fff',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            margin: '0 auto',
                            cursor: selectableAwards.length > 0 ? 'pointer' : 'default',
                            transition: 'all 0.2s',
                            opacity: selectableAwards.length === 0 ? 0.5 : 1,
                          }}
                        >
                          {isAllSelected ? (
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                              <polyline points="20 6 9 17 4 12" />
                            </svg>
                          ) : isIndeterminate ? (
                            <div style={{ width: '10px', height: '2px', backgroundColor: '#fff', borderRadius: '1px' }} />
                          ) : null}
                        </div>
                      </th>
                      <th style={{ ...thStyle }}>奖项名称</th>
                      <th style={{ ...thStyle, width: '80px' }}>奖项类别</th>
                      <th style={{ ...thStyle, width: '90px' }}>获奖人数</th>
                      <th style={{ ...thStyle, width: '200px' }}>颁发/设立部门</th>
                      <th style={{ ...thStyle, textAlign: 'center', width: '100px' }}>操作</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedAwards.map((award, index) => {
                      const isSelected = selectedAwardIds.has(award.id);
                      const isExpanded = expandedAwardIds.has(award.id);
                      const recipients = award.recipients || [];
                      const isSystemRec = isSystemRecommended(award.name);
                      const isLast = index === paginatedAwards.length - 1 && !isExpanded;

                      const rows = [
                        <tr
                          key={award.id}
                          style={{
                            backgroundColor: hoveredRowId === award.id ? '#fafafa' : 'transparent',
                            transition: 'background-color 0.2s',
                          }}
                          onMouseEnter={() => setHoveredRowId(award.id)}
                          onMouseLeave={() => setHoveredRowId(null)}
                        >
                          <td style={{ ...tdStyle(false), textAlign: 'center' }}>
                            <div
                              onClick={() => toggleAwardSelection(award.id)}
                              style={{
                                width: '18px',
                                height: '18px',
                                border: `2px solid ${isSelected ? '#1890ff' : '#d9d9d9'}`,
                                borderRadius: '3px',
                                backgroundColor: isSelected ? '#1890ff' : '#fff',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                margin: '0 auto',
                                cursor: 'pointer',
                                transition: 'all 0.2s',
                              }}
                            >
                              {isSelected && (
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                  <polyline points="20 6 9 17 4 12" />
                                </svg>
                              )}
                            </div>
                          </td>
                          <td style={{
                            ...tdStyle(false),
                            color: '#262626',
                            fontWeight: 500,
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                          }}
                            title={award.name}
                          >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <span>{award.name}</span>
                              {isSystemRec && (
                                <span
                                  style={{
                                    padding: '2px 6px',
                                    backgroundColor: '#52c41a',
                                    color: '#fff',
                                    borderRadius: '4px',
                                    fontSize: '11px',
                                    fontWeight: 400,
                                    flexShrink: 0,
                                  }}
                                >
                                  系统推荐
                                </span>
                              )}
                            </div>
                          </td>
                          <td style={{ ...tdStyle(false), color: '#595959' }}>
                            {award.category}
                          </td>
                          <td style={{ ...tdStyle(false), color: '#595959' }}>
                            {award.recipientCount}
                          </td>
                          <td style={{
                            ...tdStyle(false),
                            color: '#595959',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                          }}
                            title={award.issuingDepartment}
                          >
                            {award.issuingDepartment}
                          </td>
                          <td style={{ ...tdStyle(false), textAlign: 'center' }}>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px' }}>
                              <button
                                onClick={() => toggleAwardExpand(award.id)}
                                style={{
                                  background: 'none',
                                  border: 'none',
                                  color: '#1890ff',
                                  cursor: 'pointer',
                                  fontSize: '14px',
                                  padding: '2px 4px',
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '4px',
                                  borderRadius: '4px',
                                  transition: 'all 0.2s',
                                }}
                                onMouseEnter={(e) => {
                                  e.currentTarget.style.backgroundColor = '#e6f7ff';
                                }}
                                onMouseLeave={(e) => {
                                  e.currentTarget.style.backgroundColor = 'transparent';
                                }}
                              >
                                <span>{isExpanded ? '收起' : '查看'}</span>
                                <svg
                                  width="12"
                                  height="12"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  style={{
                                    transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
                                    transition: 'transform 0.2s',
                                  }}
                                >
                                  <polyline points="6 9 12 15 18 9" />
                                </svg>
                              </button>
                            </div>
                          </td>
                        </tr>,
                      ];

                      if (isExpanded) {
                        rows.push(
                          <tr key={`${award.id}-recipients`}>
                            <td
                              colSpan={6}
                              style={{
                                padding: 0,
                                borderBottom: isLast ? 'none' : '1px solid #f0f0f0',
                              }}
                            >
                              <div
                                style={{
                                  padding: '16px 24px 16px 74px',
                                  backgroundColor: '#fafafa',
                                  animation: 'slideDown 0.2s ease-out',
                                }}
                              >
                                <div style={{ fontSize: '14px', fontWeight: 500, color: '#333', marginBottom: '12px' }}>
                                  获奖人员 ({recipients.length}人):
                                </div>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
                                  {recipients.map((recipient, idx) => (
                                    <div
                                      key={`${recipient.employeeId}-${idx}`}
                                      style={{
                                        padding: '10px 14px',
                                        backgroundColor: '#fff',
                                        border: '1px solid #e8e8e8',
                                        borderRadius: '6px',
                                        minWidth: '140px',
                                        maxWidth: '180px',
                                        transition: 'all 0.2s',
                                      }}
                                      onMouseEnter={(e) => {
                                        e.currentTarget.style.borderColor = '#1890ff';
                                        e.currentTarget.style.boxShadow = '0 2px 8px rgba(24, 144, 255, 0.15)';
                                      }}
                                      onMouseLeave={(e) => {
                                        e.currentTarget.style.borderColor = '#e8e8e8';
                                        e.currentTarget.style.boxShadow = 'none';
                                      }}
                                    >
                                      <div
                                        style={{
                                          fontSize: '14px',
                                          fontWeight: 500,
                                          color: '#333',
                                          marginBottom: '4px',
                                          overflow: 'hidden',
                                          textOverflow: 'ellipsis',
                                          whiteSpace: 'nowrap',
                                        }}
                                        title={recipient.name}
                                      >
                                        {recipient.name}
                                      </div>
                                      <div style={{ fontSize: '12px', color: '#595959', marginBottom: '2px', fontFamily: 'monospace', letterSpacing: '0.5px' }}>
                                        {recipient.employeeId}
                                      </div>
                                      <div
                                        style={{
                                          fontSize: '11px',
                                          color: '#8c8c8c',
                                          overflow: 'hidden',
                                          textOverflow: 'ellipsis',
                                          whiteSpace: 'nowrap',
                                        }}
                                        title={recipient.department}
                                      >
                                        {recipient.department}
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </td>
                          </tr>
                        );
                      }

                      return rows;
                    })}
                  </tbody>
                </table>
              )}
            </div>

            {/* 分页器 */}
            {filteredAwards.length > 0 && (
              <div style={{
                padding: '0 24px',
                borderTop: '1px solid #f0f0f0',
                flexShrink: 0,
              }}>
                <Pagination
                  current={currentPage}
                  pageSize={pageSize}
                  total={filteredAwards.length}
                  onChange={setCurrentPage}
                />
              </div>
            )}
          </div>
        </div>

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
            onClick={onCancel}
            style={{
              padding: '8px 24px',
              backgroundColor: '#fff',
              color: '#595959',
              border: '1px solid #d9d9d9',
              borderRadius: '4px',
              fontSize: '14px',
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = '#40a9ff';
              e.currentTarget.style.color = '#1890ff';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = '#d9d9d9';
              e.currentTarget.style.color = '#595959';
            }}
          >
            取消
          </button>
          <button
            onClick={handleConfirm}
            style={{
              padding: '8px 24px',
              backgroundColor: '#1890ff',
              color: '#fff',
              border: 'none',
              borderRadius: '4px',
              fontSize: '14px',
              cursor: 'pointer',
              transition: 'background-color 0.2s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#40a9ff';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#1890ff';
            }}
          >
            确认
          </button>
        </div>
      </div>

      <style>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default AddAwardModal;
