import React, { useState, useEffect, useMemo } from 'react';
import { Pagination } from './Pagination';
import type { Team } from './types';

export interface TeamSearchModalProps {
  visible: boolean;
  awardTitle?: string;
  existingTeams?: Team[];
  onCancel: () => void;
  onConfirm: (selectedTeams: Team[]) => void;
  viewOnly?: boolean;
  currentDepartment?: string;
}

export const TeamSearchModal: React.FC<TeamSearchModalProps> = ({
  visible,
  awardTitle = '',
  existingTeams = [],
  onCancel,
  onConfirm,
  viewOnly = false,
  currentDepartment = '',
}) => {
  const [searchText, setSearchText] = useState('');
  const [selectedTeams, setSelectedTeams] = useState<Set<string>>(new Set());
  const [expandedTeams, setExpandedTeams] = useState<Set<string>>(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [hoveredRowId, setHoveredRowId] = useState<string | null>(null);
  const [hoveredTeamId, setHoveredTeamId] = useState<string | null>(null);
  const [searchBtnHovered, setSearchBtnHovered] = useState(false);
  const [resetBtnHovered, setResetBtnHovered] = useState(false);
  const [cancelBtnHovered, setCancelBtnHovered] = useState(false);
  const [confirmBtnHovered, setConfirmBtnHovered] = useState(false);
  const [inputFocused, setInputFocused] = useState(false);

  const departmentTeams = useMemo(() => {
    if (!currentDepartment) return existingTeams;
    return existingTeams.filter(team => {
      return team.members?.some(member => {
        const memberDept = member.department.split('/')[0];
        return memberDept === currentDepartment;
      });
    });
  }, [existingTeams, currentDepartment]);

  useEffect(() => {
    if (visible) {
      const selectedFromState = existingTeams.filter(t => t.isSelected).map(t => t.id);
      if (selectedFromState.length > 0) {
        setSelectedTeams(new Set(selectedFromState));
      } else {
        const initialSelected = new Set(departmentTeams.map(t => t.id));
        setSelectedTeams(initialSelected);
      }
      setSearchText('');
      setExpandedTeams(new Set());
      setCurrentPage(1);
    }
  }, [visible, existingTeams, departmentTeams]);

  const filteredTeams = useMemo(() => {
    if (!searchText.trim()) return existingTeams;
    const query = searchText.trim().toLowerCase();
    return existingTeams.filter(team => {
      const matchName = team.name.toLowerCase().includes(query);
      const matchEmployeeId = team.members?.some(member =>
        member.employeeId.toLowerCase().includes(query)
      );
      return matchName || matchEmployeeId;
    });
  }, [existingTeams, searchText]);

  const paginatedTeams = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return filteredTeams.slice(startIndex, startIndex + pageSize);
  }, [filteredTeams, currentPage, pageSize]);

  // 获取已选团队列表
  const selectedTeamsList = useMemo(() => {
    return existingTeams.filter(team => selectedTeams.has(team.id));
  }, [existingTeams, selectedTeams]);

  const handleReset = () => {
    setSearchText('');
    setCurrentPage(1);
  };

  const toggleTeamSelection = (teamId: string) => {
    if (viewOnly) return;
    const newSelected = new Set(selectedTeams);
    if (newSelected.has(teamId)) {
      newSelected.delete(teamId);
    } else {
      newSelected.add(teamId);
    }
    setSelectedTeams(newSelected);
  };

  // 从已选列表中移除
  const removeFromSelected = (teamId: string) => {
    if (viewOnly) return;
    const newSelected = new Set(selectedTeams);
    newSelected.delete(teamId);
    setSelectedTeams(newSelected);
  };

  const toggleTeamExpand = (teamId: string) => {
    const newExpanded = new Set(expandedTeams);
    if (newExpanded.has(teamId)) {
      newExpanded.delete(teamId);
    } else {
      newExpanded.add(teamId);
    }
    setExpandedTeams(newExpanded);
  };

  const handleConfirm = () => {
    const updatedTeams = existingTeams.map(team => ({
      ...team,
      isSelected: selectedTeams.has(team.id),
    }));
    onConfirm(updatedTeams);
  };

  const isAllSelected = filteredTeams.length > 0 &&
    filteredTeams.every(team => selectedTeams.has(team.id));
  const isIndeterminate = filteredTeams.some(team => selectedTeams.has(team.id)) &&
    !filteredTeams.every(team => selectedTeams.has(team.id));

  const toggleAll = () => {
    if (viewOnly) return;
    if (isAllSelected) {
      const newSelected = new Set(selectedTeams);
      filteredTeams.forEach(team => newSelected.delete(team.id));
      setSelectedTeams(newSelected);
    } else {
      const newSelected = new Set(selectedTeams);
      filteredTeams.forEach(team => newSelected.add(team.id));
      setSelectedTeams(newSelected);
    }
  };

  const getRowBgColor = (teamId: string, isSelected: boolean) => {
    if (isSelected) return '#e6f7ff';
    if (hoveredRowId === teamId) return '#fafafa';
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
          width: '1100px',
          maxHeight: '80vh',
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
            编辑获奖团队{awardTitle ? ` - ${awardTitle}` : ''}
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
          {/* 左侧 - 已选获奖团队 */}
          {!viewOnly && (
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
                  已选获奖团队
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
                  {selectedTeams.size}个
                </span>
              </div>

              {/* 已选列表 */}
              <div style={{ flex: 1, overflow: 'auto', padding: '8px' }}>
                {selectedTeams.size === 0 ? (
                  <div
                    style={{
                      padding: '40px 16px',
                      textAlign: 'center',
                      color: '#999',
                      fontSize: '14px',
                    }}
                  >
                    暂无已选团队
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {selectedTeamsList.map((team) => (
                      <div
                        key={team.id}
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
                          boxShadow: hoveredTeamId === team.id
                            ? '0 2px 8px rgba(0,0,0,0.1)'
                            : 'none',
                        }}
                        onMouseEnter={() => setHoveredTeamId(team.id)}
                        onMouseLeave={() => setHoveredTeamId(null)}
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
                            title={team.name}
                          >
                            {team.name}
                          </div>
                          <div
                            style={{
                              fontSize: '12px',
                              color: '#666',
                            }}
                          >
                            {team.memberCount}人
                          </div>
                        </div>
                        {hoveredTeamId === team.id && (
                          <button
                            onClick={() => removeFromSelected(team.id)}
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
          )}

          {/* 右侧 - 搜索和表格 */}
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
              <input
                type="text"
                placeholder="请输入工号或团队名"
                value={searchText}
                onChange={(e) => {
                  setSearchText(e.target.value);
                  setCurrentPage(1);
                }}
                onFocus={() => setInputFocused(true)}
                onBlur={() => setInputFocused(false)}
                style={{
                  padding: '6px 12px',
                  border: `1px solid ${inputFocused ? '#1890ff' : '#d9d9d9'}`,
                  borderRadius: '4px',
                  fontSize: '14px',
                  width: '200px',
                  outline: 'none',
                  transition: 'border-color 0.2s, box-shadow 0.2s',
                  boxShadow: inputFocused ? '0 0 0 2px rgba(24, 144, 255, 0.2)' : 'none',
                }}
              />
              <button
                onClick={() => setCurrentPage(1)}
                disabled={!searchText.trim()}
                onMouseEnter={() => setSearchBtnHovered(true)}
                onMouseLeave={() => setSearchBtnHovered(false)}
                style={{
                  padding: '6px 20px',
                  backgroundColor: !searchText.trim() ? '#d9d9d9' : (searchBtnHovered ? '#40a9ff' : '#1890ff'),
                  color: '#fff',
                  border: 'none',
                  borderRadius: '4px',
                  fontSize: '14px',
                  cursor: !searchText.trim() ? 'not-allowed' : 'pointer',
                  transition: 'background-color 0.2s',
                }}
              >
                查询
              </button>
              <button
                onClick={handleReset}
                onMouseEnter={() => setResetBtnHovered(true)}
                onMouseLeave={() => setResetBtnHovered(false)}
                style={{
                  padding: '6px 20px',
                  backgroundColor: '#fff',
                  color: '#595959',
                  border: `1px solid ${resetBtnHovered ? '#40a9ff' : '#d9d9d9'}`,
                  borderRadius: '4px',
                  fontSize: '14px',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
              >
                重置
              </button>
            </div>

            {/* 表格区域 */}
            <div style={{ flex: 1, overflow: 'auto', overscrollBehavior: 'contain' }}>
              {filteredTeams.length === 0 ? (
                <div style={{
                  padding: '48px 0',
                  textAlign: 'center',
                  color: '#bfbfbf',
                  fontSize: '14px',
                }}>
                  暂无团队数据
                </div>
              ) : (
                <table style={{ width: '100%', borderCollapse: 'collapse', tableLayout: 'fixed' }}>
                  <thead>
                    <tr style={{ backgroundColor: '#fafafa' }}>
                      {!viewOnly && (
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
                              cursor: 'pointer',
                              transition: 'all 0.2s',
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
                      )}
                      <th style={{ ...thStyle, textAlign: 'center', width: '60px' }}>序号</th>
                      <th style={{ ...thStyle }}>奖项名称</th>
                      <th style={{ ...thStyle, width: '80px' }}>奖项类别</th>
                      <th style={{ ...thStyle, width: '90px' }}>获奖人数</th>
                      <th style={{ ...thStyle, width: '200px' }}>颁发/设立部门</th>
                      <th style={{ ...thStyle, textAlign: 'center', width: '100px' }}>操作</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedTeams.map((team, index) => {
                      const isSelected = selectedTeams.has(team.id);
                      const isExpanded = expandedTeams.has(team.id);
                      const seq = (currentPage - 1) * pageSize + index + 1;
                      const isExpandedLast = isExpanded && index === paginatedTeams.length - 1;

                      const rows = [
                        <tr
                          key={team.id}
                          style={{
                            backgroundColor: hoveredRowId === team.id ? '#fafafa' : 'transparent',
                            cursor: viewOnly ? 'default' : 'pointer',
                            transition: 'background-color 0.2s',
                          }}
                          onMouseEnter={() => setHoveredRowId(team.id)}
                          onMouseLeave={() => setHoveredRowId(null)}
                        >
                          {!viewOnly && (
                            <td style={{ ...tdStyle(false), textAlign: 'center' }}>
                              <div
                                onClick={() => toggleTeamSelection(team.id)}
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
                          )}
                          <td style={{ ...tdStyle(false), textAlign: 'center', color: '#8c8c8c' }}>
                            {seq}
                          </td>
                          <td style={{ ...tdStyle(false), color: '#262626', fontWeight: 500 }}>
                            {team.name}
                          </td>
                          <td style={{ ...tdStyle(false), color: '#595959' }}>
                            团队奖
                          </td>
                          <td style={{ ...tdStyle(false), color: '#595959' }}>
                            {team.memberCount}
                          </td>
                          <td style={{ ...tdStyle(false), color: '#595959', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {awardTitle ? awardTitle.split('2025年')[1]?.split('奖')[0] + '奖' : 'IT平台服务部/平台开发部'}
                          </td>
                          <td style={{ ...tdStyle(false), textAlign: 'center' }}>
                            <button
                              onClick={() => toggleTeamExpand(team.id)}
                              style={{
                                background: 'none',
                                border: 'none',
                                color: '#1890ff',
                                cursor: 'pointer',
                                fontSize: '14px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '4px',
                                margin: '0 auto',
                                padding: '2px 4px',
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
                          </td>
                        </tr>,
                      ];

                      if (isExpanded && team.members) {
                        rows.push(
                          <tr key={`${team.id}-members`}>
                            <td
                              colSpan={viewOnly ? 6 : 7}
                              style={{
                                padding: 0,
                                borderBottom: isExpandedLast ? 'none' : '1px solid #f0f0f0',
                              }}
                            >
                              <div
                                style={{
                                  padding: '16px 24px',
                                  backgroundColor: '#fafafa',
                                }}
                              >
                                <div style={{ fontSize: '14px', fontWeight: 500, color: '#333', marginBottom: '12px' }}>
                                  获奖人员 ({team.members.length}人):
                                </div>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
                                  {team.members.map((member, idx) => (
                                    <div
                                      key={idx}
                                      style={{
                                        padding: '12px 16px',
                                        backgroundColor: '#fff',
                                        border: '1px solid #e8e8e8',
                                        borderRadius: '6px',
                                        minWidth: '160px',
                                        maxWidth: '200px',
                                      }}
                                    >
                                      <div style={{ fontSize: '14px', fontWeight: 500, color: '#333', marginBottom: '4px' }}>
                                        {member.name}
                                      </div>
                                      <div style={{ fontSize: '12px', color: '#595959', marginBottom: '2px', fontFamily: 'monospace', letterSpacing: '0.5px' }}>
                                        {member.employeeId}
                                      </div>
                                      <div
                                        style={{
                                          fontSize: '11px',
                                          color: '#8c8c8c',
                                          overflow: 'hidden',
                                          textOverflow: 'ellipsis',
                                          whiteSpace: 'nowrap',
                                        }}
                                        title={member.department}
                                      >
                                        {member.department}
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
            <div style={{
              padding: '0 24px',
              borderTop: '1px solid #f0f0f0',
              flexShrink: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
              {!viewOnly ? (
                <div style={{ fontSize: '14px', color: '#595959' }}>
                  已勾选 <span style={{ color: '#1890ff', fontWeight: 500 }}>{selectedTeams.size}</span> 条
                </div>
              ) : (
                <div />
              )}
              <Pagination
                current={currentPage}
                pageSize={pageSize}
                total={filteredTeams.length}
                onChange={setCurrentPage}
                onPageSizeChange={(size) => { setPageSize(size); setCurrentPage(1); }}
                showTotal
                showPageSize
              />
            </div>
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
            取消
          </button>
          <button
            onClick={handleConfirm}
            onMouseEnter={() => setConfirmBtnHovered(true)}
            onMouseLeave={() => setConfirmBtnHovered(false)}
            style={{
              padding: '8px 24px',
              backgroundColor: confirmBtnHovered ? '#40a9ff' : '#1890ff',
              color: '#fff',
              border: 'none',
              borderRadius: '4px',
              fontSize: '14px',
              cursor: 'pointer',
              transition: 'background-color 0.2s',
            }}
          >
            保存
          </button>
        </div>
      </div>
    </div>
  );
};

export default TeamSearchModal;
