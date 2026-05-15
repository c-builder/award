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
  const [existingAwardAlert, setExistingAwardAlert] = useState<string | null>(null);
  const [hoveredRowId, setHoveredRowId] = useState<string | null>(null);
  const [inputFocused, setInputFocused] = useState(false);

  useEffect(() => {
    if (visible) {
      setSelectedDeptPath(externalDeptPath);
      const customAwardIds = new Set<string>();
      existingAwards.forEach(existingAward => {
        if (!existingAward.isDefault) {
          const mockAward = MOCK_AWARDS.find(mock => mock.name === existingAward.title);
          if (mockAward) {
            customAwardIds.add(mockAward.id);
          }
        }
      });
      setSelectedAwardIds(customAwardIds);
    }
  }, [visible, existingAwards, externalDeptPath]);

  useEffect(() => {
    if (!visible) {
      setYear('2025');
      setSelectedDeptPath([]);
      setSearchKeyword('');
      setSelectedAwardIds(new Set());
      setExpandedAwardIds(new Set());
      setExistingAwardAlert(null);
      setCurrentPage(1);
    }
  }, [visible]);

  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;

  const existingDefaultAwardNames = useMemo(() => {
    return new Set(existingAwards.filter(award => award.isDefault).map(award => award.title));
  }, [existingAwards]);

  const existingCustomAwardNames = useMemo(() => {
    return new Set(existingAwards.filter(award => !award.isDefault).map(award => award.title));
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

  const selectableAwards = useMemo(() => {
    return filteredAwards.filter(award => !existingDefaultAwardNames.has(award.name));
  }, [filteredAwards, existingDefaultAwardNames]);

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

  const paginatedAwards = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return filteredAwards.slice(startIndex, startIndex + pageSize);
  }, [filteredAwards, currentPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedDeptPath, searchKeyword]);

  const selectedAwards = useMemo(() => {
    return MOCK_AWARDS.filter((award) => selectedAwardIds.has(award.id));
  }, [selectedAwardIds]);

  const toggleAwardSelection = (awardId: string) => {
    const award = MOCK_AWARDS.find(a => a.id === awardId);
    if (!award) return;

    if (existingDefaultAwardNames.has(award.name)) {
      setExistingAwardAlert(`"${award.name}" 已存在于当前展播中`);
      setTimeout(() => setExistingAwardAlert(null), 3000);
      return;
    }

    const newSelected = new Set(selectedAwardIds);
    if (newSelected.has(awardId)) {
      newSelected.delete(awardId);
    } else {
      newSelected.add(awardId);
    }
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

  const removeSelectedAward = (awardId: string) => {
    const newSelected = new Set(selectedAwardIds);
    newSelected.delete(awardId);
    setSelectedAwardIds(newSelected);
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

  const getRowBgColor = (awardId: string, isChecked: boolean) => {
    if (isChecked) return '#e6f7ff';
    if (hoveredRowId === awardId) return '#fafafa';
    return 'transparent';
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
          width: '900px',
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

        {existingAwardAlert && (
          <div
            style={{
              padding: '12px 24px',
              backgroundColor: '#fff2f0',
              borderBottom: '1px solid #ffccc7',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ff4d4f" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            <span style={{ fontSize: '14px', color: '#ff4d4f' }}>
              {existingAwardAlert}
            </span>
          </div>
        )}

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
                  const isDefaultExisting = existingDefaultAwardNames.has(award.name);
                  const isCustomExisting = existingCustomAwardNames.has(award.name);
                  const isChecked = isDefaultExisting ? true : isSelected;
                  const isLast = index === paginatedAwards.length - 1 && !isExpanded;

                  const rows = [
                    <tr
                      key={award.id}
                      style={{
                        backgroundColor: getRowBgColor(award.id, isChecked),
                        transition: 'background-color 0.2s',
                        borderLeft: isChecked ? '3px solid #1890ff' : '3px solid transparent',
                      }}
                      onMouseEnter={() => setHoveredRowId(award.id)}
                      onMouseLeave={() => setHoveredRowId(null)}
                    >
                      <td style={{ ...tdStyle(false), textAlign: 'center' }}>
                        <div
                          onClick={() => !isDefaultExisting && toggleAwardSelection(award.id)}
                          style={{
                            width: '18px',
                            height: '18px',
                            border: `2px solid ${isChecked ? '#1890ff' : '#d9d9d9'}`,
                            borderRadius: '3px',
                            backgroundColor: isChecked ? '#1890ff' : '#fff',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            margin: '0 auto',
                            cursor: isDefaultExisting ? 'not-allowed' : 'pointer',
                            transition: 'all 0.2s',
                            opacity: isDefaultExisting ? 0.5 : 1,
                          }}
                        >
                          {isChecked && (
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                              <polyline points="20 6 9 17 4 12" />
                            </svg>
                          )}
                        </div>
                      </td>
                      <td style={{
                        ...tdStyle(false),
                        color: isDefaultExisting ? '#8c8c8c' : '#262626',
                        fontWeight: isDefaultExisting ? 400 : 500,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}
                        title={award.name}
                      >
                        {award.name}
                      </td>
                      <td style={{ ...tdStyle(false), color: isDefaultExisting ? '#8c8c8c' : '#595959' }}>
                        {award.category}
                      </td>
                      <td style={{ ...tdStyle(false), color: isDefaultExisting ? '#8c8c8c' : '#595959' }}>
                        {award.recipientCount}
                      </td>
                      <td style={{
                        ...tdStyle(false),
                        color: isDefaultExisting ? '#8c8c8c' : '#595959',
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

                          {(isCustomExisting || isSelected) && !isDefaultExisting && (
                            <span
                              onClick={() => toggleAwardSelection(award.id)}
                              style={{
                                color: '#ff4d4f',
                                cursor: 'pointer',
                                fontSize: '14px',
                                padding: '2px 4px',
                                borderRadius: '4px',
                                transition: 'all 0.2s',
                              }}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.color = '#ff7875';
                                e.currentTarget.style.backgroundColor = '#fff1f0';
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.color = '#ff4d4f';
                                e.currentTarget.style.backgroundColor = 'transparent';
                              }}
                            >
                              移除
                            </span>
                          )}
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

        {filteredAwards.length > 0 && (
          <div style={{
            padding: '0 24px',
            borderTop: '1px solid #f0f0f0',
            flexShrink: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
            <div style={{ fontSize: '14px', color: '#595959' }}>
              已选 <span style={{ color: '#1890ff', fontWeight: 500 }}>{selectedAwardIds.size}</span> 个奖项
            </div>
            <Pagination
              current={currentPage}
              pageSize={pageSize}
              total={filteredAwards.length}
              onChange={setCurrentPage}
            />
          </div>
        )}

        {selectedAwards.length > 0 && (
          <div
            style={{
              padding: '12px 24px',
              borderTop: '1px solid #f0f0f0',
              backgroundColor: '#fafafa',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '12px',
              flexWrap: 'wrap',
            }}
          >
            <span style={{ fontSize: '14px', color: '#595959', whiteSpace: 'nowrap', paddingTop: '4px' }}>
              已添加:
            </span>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', flex: 1 }}>
              {selectedAwards.map((award) => (
                <div
                  key={award.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    padding: '4px 12px',
                    backgroundColor: '#fff',
                    border: '1px solid #d9d9d9',
                    borderRadius: '4px',
                    fontSize: '13px',
                    color: '#333',
                  }}
                >
                  <span
                    style={{
                      maxWidth: '150px',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                    title={award.name}
                  >
                    {award.name}
                  </span>
                  <button
                    onClick={() => removeSelectedAward(award.id)}
                    style={{
                      background: 'none',
                      border: 'none',
                      padding: 0,
                      marginLeft: '4px',
                      cursor: 'pointer',
                      color: '#999',
                      fontSize: '14px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: '16px',
                      height: '16px',
                      borderRadius: '4px',
                      transition: 'all 0.2s',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = '#ff4d4f';
                      e.currentTarget.style.backgroundColor = '#fff1f0';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = '#999';
                      e.currentTarget.style.backgroundColor = 'transparent';
                    }}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

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
