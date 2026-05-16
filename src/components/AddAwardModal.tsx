import React, { useState, useEffect, useMemo } from 'react';
import { DeptCascader } from './DeptCascader';
import { Pagination } from './Pagination';
import { AwardRecipientsModal } from './AwardRecipientsModal';
import { Award } from './types';
import awardsData from '../mock/data/awards.json';

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
  issueDate?: string;
  isSelected?: boolean;
}

export interface AddAwardModalProps {
  visible: boolean;
  onCancel: () => void;
  onConfirm: (selectedAwards: Award[]) => void;
  existingAwards?: Award[];
  externalDeptPath?: string[];
}

// 将 awards.json 转换为 AwardItem 格式
const MOCK_AWARDS: AwardItem[] = (awardsData as Award[]).map(award => {
  // 对于团队奖，从teams.members中提取所有获奖人
  const allRecipients = award.awardType === 'team' && award.teams
    ? award.teams.flatMap(team => team.members || [])
    : award.recipients;

  return {
    id: award.id,
    name: award.title,
    category: award.awardType === 'team' ? '团队奖' : '个人奖',
    recipientCount: award.awardType === 'individual'
      ? award.recipients.length
      : (award.teams?.reduce((sum, t) => sum + (t.memberCount || 0), 0) || 0),
    issuingDepartment: award.issuingDepartment,
    issuingDepartmentPath: award.issuingDepartment.split('/'),
    recipients: allRecipients.map(r => ({
      name: r.name,
      employeeId: r.employeeId,
      department: r.department,
    })),
    issueDate: award.issueDate,
  };
});

const formatIssueDate = (dateStr?: string): string => {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  return `${date.getFullYear()}年${date.getMonth() + 1}月`;
};

const YEAR_OPTIONS = [
  { value: '2025', label: '2025年' },
  { value: '2024', label: '2024年' },
  { value: '2023', label: '2023年' },
];

export const AddAwardModal: React.FC<AddAwardModalProps> = ({
  visible,
  onCancel,
  onConfirm,
  existingAwards = [],
  externalDeptPath = [],
}) => {
  const [selectedYear, setSelectedYear] = useState<string>('2025');
  const [selectedDeptPath, setSelectedDeptPath] = useState<string[]>([]);
  const [searchKeyword, setSearchKeyword] = useState<string>('');
  const [selectedAwardIds, setSelectedAwardIds] = useState<Set<string>>(new Set());
  const [expandedAwardIds, setExpandedAwardIds] = useState<Set<string>>(new Set());
  const [hoveredRowId, setHoveredRowId] = useState<string | null>(null);
  const [hoveredAwardId, setHoveredAwardId] = useState<string | null>(null);
  const [inputFocused, setInputFocused] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [selectedAwardForDetail, setSelectedAwardForDetail] = useState<AwardItem | null>(null);

  useEffect(() => {
    if (visible) {
      setSelectedDeptPath(externalDeptPath);
      setSearchKeyword('');
      setExpandedAwardIds(new Set());
      setCurrentPage(1);
    }
  }, [visible, externalDeptPath]);

  useEffect(() => {
    if (!visible) {
      setSelectedDeptPath([]);
      setSearchKeyword('');
      setSelectedAwardIds(new Set());
      setExpandedAwardIds(new Set());
      setCurrentPage(1);
    }
  }, [visible]);

  // 左侧：当前已选中的奖项（根据selectedAwardIds实时更新）
  const loadedAwards = useMemo(() => {
    return MOCK_AWARDS.filter(award => selectedAwardIds.has(award.id));
  }, [selectedAwardIds]);

  // 右侧：当前部门所有奖项（根据年份和获奖人部门筛选）
  const departmentAwards = useMemo(() => {
    return MOCK_AWARDS.filter((award) => {
      // 年份筛选
      if (!award.issueDate?.startsWith(selectedYear)) return false;
      // 部门筛选 - 基于获奖人/团队成员的部门
      if (selectedDeptPath.length > 0) {
        const selectedDept = selectedDeptPath[0];
        // 检查是否有获奖人来自该部门
        const hasRecipientFromDept = award.recipients?.some(r =>
          r.department.split('/')[0] === selectedDept
        );
        if (!hasRecipientFromDept) return false;
      }
      return true;
    });
  }, [selectedDeptPath, selectedYear]);

  // 右侧：搜索过滤后的奖项
  const filteredAwards = useMemo(() => {
    return departmentAwards.filter((award) => {
      if (searchKeyword && !award.name.toLowerCase().includes(searchKeyword.toLowerCase())) {
        return false;
      }
      return true;
    });
  }, [departmentAwards, searchKeyword]);

  // 初始化选中状态：已加载的奖项设为选中
  useEffect(() => {
    if (visible) {
      const initialSelected = new Set<string>();
      // 已存在的奖项设为选中
      existingAwards.forEach(existingAward => {
        const mockAward = MOCK_AWARDS.find(mock => mock.name === existingAward.title);
        if (mockAward) {
          initialSelected.add(mockAward.id);
        }
      });
      setSelectedAwardIds(initialSelected);
    }
  }, [visible, existingAwards]);

  const selectableSelectedCount = useMemo(() => {
    return filteredAwards.filter(award => selectedAwardIds.has(award.id)).length;
  }, [filteredAwards, selectedAwardIds]);

  const isAllSelected = filteredAwards.length > 0 && selectableSelectedCount === filteredAwards.length;
  const isIndeterminate = selectableSelectedCount > 0 && selectableSelectedCount < filteredAwards.length;

  const toggleAll = () => {
    if (isAllSelected) {
      setSelectedAwardIds(prev => {
        const next = new Set(prev);
        filteredAwards.forEach(a => next.delete(a.id));
        return next;
      });
    } else {
      setSelectedAwardIds(prev => {
        const next = new Set(prev);
        filteredAwards.forEach(a => next.add(a.id));
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

  const toggleAwardSelection = (awardId: string) => {
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

  const handleReset = () => {
    setSelectedDeptPath([]);
    setSearchKeyword('');
  };

  const handleConfirm = () => {
    // 获取完整的原始奖项数据（包含 teams 和 recipients）
    const selectedList = (awardsData as Award[]).filter((award) =>
      selectedAwardIds.has(award.id)
    );
    onConfirm(selectedList);
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
          {/* 左侧 - 近3个月奖项（系统推荐） */}
          <div
            style={{
              width: '320px',
              borderRight: '1px solid #f0f0f0',
              display: 'flex',
              flexDirection: 'column',
              backgroundColor: '#fafafa',
            }}
          >
            <div
              style={{
                padding: '12px 16px',
                borderBottom: '1px solid #f0f0f0',
                backgroundColor: '#f5f5f5',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '14px', fontWeight: 500, color: '#333' }}>
                  已选奖项
                </span>
                <span
                  style={{
                    padding: '2px 8px',
                    backgroundColor: '#1890ff',
                    color: '#fff',
                    borderRadius: '10px',
                    fontSize: '12px',
                  }}
                >
                  {loadedAwards.length}个
                </span>
              </div>
            </div>

            <div style={{ flex: 1, overflow: 'auto', padding: '8px' }}>
              {loadedAwards.length === 0 ? (
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
                  {loadedAwards.map((award: AwardItem) => (
                    <div
                      key={award.id}
                      style={{
                        padding: '12px',
                        backgroundColor: '#fff',
                        borderRadius: '6px',
                        border: '1px solid #e8e8e8',
                        transition: 'all 0.2s',
                        boxShadow: hoveredAwardId === award.id
                          ? '0 2px 8px rgba(0,0,0,0.1)'
                          : 'none',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                      }}
                      onMouseEnter={() => setHoveredAwardId(award.id)}
                      onMouseLeave={() => setHoveredAwardId(null)}
                    >
                      {/* 左侧内容 */}
                      <div style={{ flex: 1, minWidth: 0 }}>
                        {/* 奖项名称 */}
                        <div
                          style={{
                            fontSize: '14px',
                            fontWeight: 500,
                            color: '#333',
                            marginBottom: '8px',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                          }}
                          title={award.name}
                        >
                          {award.name}
                        </div>
                        {/* 信息行：类别 + 人数 + 查看详情 */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                          {/* 奖项类别标签 */}
                          <span
                            style={{
                              padding: '2px 8px',
                              backgroundColor: award.category === '团队奖' ? '#e6f7ff' : '#f0fdf4',
                              color: award.category === '团队奖' ? '#1890ff' : '#16a34a',
                              borderRadius: '4px',
                              fontSize: '11px',
                              fontWeight: 500,
                            }}
                          >
                            {award.category}
                          </span>
                          {/* 获奖人数 */}
                          <span style={{ fontSize: '12px', color: '#666', display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#999" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                              <circle cx="9" cy="7" r="4"></circle>
                              <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                              <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                            </svg>
                            {award.recipientCount}人
                          </span>
                          {/* 查看详情 */}
                          <button
                            onClick={() => {
                              setSelectedAwardForDetail(award);
                              setDetailModalVisible(true);
                            }}
                            style={{
                              background: 'none',
                              border: 'none',
                              color: '#1890ff',
                              fontSize: '12px',
                              cursor: 'pointer',
                              padding: '0',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '2px',
                            }}
                          >
                            <span>查看详情</span>
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <polyline points="9 18 15 12 9 6" />
                            </svg>
                          </button>
                        </div>
                      </div>
                      {/* 右侧删除按钮 */}
                      <button
                        onClick={() => toggleAwardSelection(award.id)}
                        style={{
                          padding: '4px 8px',
                          backgroundColor: hoveredAwardId === award.id ? '#ff4d4f' : 'transparent',
                          color: hoveredAwardId === award.id ? '#fff' : 'transparent',
                          border: 'none',
                          borderRadius: '4px',
                          fontSize: '12px',
                          cursor: hoveredAwardId === award.id ? 'pointer' : 'default',
                          flexShrink: 0,
                          opacity: hoveredAwardId === award.id ? 1 : 0,
                          transition: 'all 0.2s',
                          alignSelf: 'center',
                        }}
                      >
                        删除
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* 右侧 - 当前部门所有奖项 */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            {/* 搜索栏 */}
            <div
              style={{
                padding: '12px 24px',
                borderBottom: '1px solid #f0f0f0',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                backgroundColor: '#fafafa',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '14px', color: '#333', whiteSpace: 'nowrap' }}>年份:</span>
                <select
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(e.target.value)}
                  style={{
                    padding: '6px 12px',
                    border: '1px solid #d9d9d9',
                    borderRadius: '4px',
                    fontSize: '14px',
                    backgroundColor: '#fff',
                    cursor: 'pointer',
                    outline: 'none',
                    minWidth: '90px',
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
                  onFocus={() => setInputFocused(true)}
                  onBlur={() => setInputFocused(false)}
                  style={{
                    padding: '6px 12px',
                    border: `1px solid ${inputFocused ? '#1890ff' : '#d9d9d9'}`,
                    borderRadius: '4px',
                    fontSize: '14px',
                    flex: 1,
                    maxWidth: '160px',
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
                            cursor: filteredAwards.length > 0 ? 'pointer' : 'default',
                            transition: 'all 0.2s',
                            opacity: filteredAwards.length === 0 ? 0.5 : 1,
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
                            </div>
                            <div style={{ fontSize: '12px', color: '#8c8c8c', marginTop: '2px' }}>
                              {formatIssueDate(award.issueDate)}
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
                                          display: 'flex',
                                          alignItems: 'center',
                                          gap: '8px',
                                        }}
                                        title={`${recipient.name} ${recipient.employeeId}`}
                                      >
                                        <span>{recipient.name}</span>
                                        <span
                                          style={{
                                            fontSize: '12px',
                                            color: '#666',
                                            fontFamily: 'monospace',
                                            fontWeight: 400,
                                          }}
                                        >
                                          {recipient.employeeId}
                                        </span>
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

      {/* 获奖人详情弹框 */}
      <AwardRecipientsModal
        visible={detailModalVisible}
        awardName={selectedAwardForDetail?.name || ''}
        recipients={selectedAwardForDetail?.recipients || []}
        onClose={() => {
          setDetailModalVisible(false);
          setSelectedAwardForDetail(null);
        }}
      />

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
