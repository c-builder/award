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

  // 根据当前部门过滤团队（用于确定默认选中哪些团队）
  const departmentTeams = useMemo(() => {
    if (!currentDepartment) return existingTeams;
    return existingTeams.filter(team => {
      // 检查团队成员是否有当前部门的
      return team.members?.some(member => {
        const memberDept = member.department.split('/')[0];
        return memberDept === currentDepartment;
      });
    });
  }, [existingTeams, currentDepartment]);

  // 初始化选中状态 - 优先使用 existingTeams 中的 isSelected 标记
  useEffect(() => {
    if (visible) {
      // 优先使用团队自身的 isSelected 标记（回显已选中的团队）
      const selectedFromState = existingTeams.filter(t => t.isSelected).map(t => t.id);
      if (selectedFromState.length > 0) {
        setSelectedTeams(new Set(selectedFromState));
      } else {
        // 如果没有 isSelected 标记，默认选中当前部门的所有团队
        const initialSelected = new Set(departmentTeams.map(t => t.id));
        setSelectedTeams(initialSelected);
      }
      setSearchText('');
      setExpandedTeams(new Set());
      setCurrentPage(1);
    }
  }, [visible, existingTeams, departmentTeams]);

  // 根据搜索条件过滤团队 - 支持按团队名或成员工号搜索
  const filteredTeams = useMemo(() => {
    if (!searchText.trim()) return existingTeams;
    const query = searchText.trim().toLowerCase();
    return existingTeams.filter(team => {
      // 匹配团队名称
      const matchName = team.name.toLowerCase().includes(query);
      // 匹配团队成员工号
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
    // 更新团队的 isSelected 状态
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
      // 取消全选
      const newSelected = new Set(selectedTeams);
      filteredTeams.forEach(team => newSelected.delete(team.id));
      setSelectedTeams(newSelected);
    } else {
      // 全选
      const newSelected = new Set(selectedTeams);
      filteredTeams.forEach(team => newSelected.add(team.id));
      setSelectedTeams(newSelected);
    }
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
        zIndex: 1000,
      }}
      onClick={onCancel}
    >
      <div
        style={{
          backgroundColor: '#fff',
          borderRadius: '8px',
          width: '900px',
          maxHeight: '80vh',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
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
          <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 500, color: '#333' }}>
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
              padding: '4px',
              lineHeight: 1,
            }}
          >
            ×
          </button>
        </div>

        {/* 搜索栏 */}
        <div
          style={{
            padding: '16px 24px',
            borderBottom: '1px solid #f0f0f0',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
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
            style={{
              padding: '8px 12px',
              border: '1px solid #d9d9d9',
              borderRadius: '4px',
              fontSize: '14px',
              width: '200px',
              outline: 'none',
            }}
          />
          <button
            onClick={() => {
              // 搜索是实时响应的，点击查询按钮只是重置到第一页
              setCurrentPage(1);
            }}
            disabled={!searchText.trim()}
            style={{
              padding: '8px 20px',
              backgroundColor: !searchText.trim() ? '#d9d9d9' : '#1890ff',
              color: '#fff',
              border: 'none',
              borderRadius: '4px',
              fontSize: '14px',
              cursor: !searchText.trim() ? 'not-allowed' : 'pointer',
            }}
          >
            查询
          </button>
          <button
            onClick={handleReset}
            style={{
              padding: '8px 20px',
              backgroundColor: '#fff',
              color: '#666',
              border: '1px solid #d9d9d9',
              borderRadius: '4px',
              fontSize: '14px',
              cursor: 'pointer',
            }}
          >
            重置
          </button>
        </div>

        {/* 表格区域 */}
        <div style={{ flex: 1, overflow: 'auto', padding: '0' }}>
          {filteredTeams.length > 0 ? (
            <>
              {/* 表头 */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: viewOnly 
                    ? '80px 1fr 80px 120px 2fr 100px' 
                    : '50px 50px 80px 1fr 80px 120px 2fr 100px',
                  padding: '12px 24px',
                  backgroundColor: '#fafafa',
                  borderBottom: '1px solid #e8e8e8',
                  fontSize: '14px',
                  fontWeight: 500,
                  color: '#666',
                }}
              >
                {!viewOnly && (
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
                      cursor: 'pointer',
                    }}
                  >
                    {isAllSelected && (
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    )}
                    {isIndeterminate && (
                      <div style={{ width: '10px', height: '2px', backgroundColor: '#fff' }} />
                    )}
                  </div>
                )}
                <div style={{ textAlign: 'center' }}>序号</div>
                <div>奖项名称</div>
                <div>奖项类别</div>
                <div>获奖人数</div>
                <div>颁发/设立部门</div>
                <div style={{ textAlign: 'center' }}>操作</div>
              </div>

              {/* 表格内容 */}
              {paginatedTeams.map((team, index) => {
                const isSelected = selectedTeams.has(team.id);
                const isExpanded = expandedTeams.has(team.id);
                const seq = (currentPage - 1) * pageSize + index + 1;

                return (
                  <React.Fragment key={team.id}>
                    <div
                      style={{
                        display: 'grid',
                        gridTemplateColumns: viewOnly 
                          ? '80px 1fr 80px 120px 2fr 100px' 
                          : '50px 50px 80px 1fr 80px 120px 2fr 100px',
                        padding: '12px 24px',
                        borderBottom: '1px solid #f0f0f0',
                        fontSize: '14px',
                        color: '#333',
                        backgroundColor: viewOnly ? '#fff' : (isSelected ? '#e6f7ff' : '#fff'),
                        alignItems: 'center',
                      }}
                    >
                      {/* 多选框 */}
                      {!viewOnly && (
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
                            cursor: 'pointer',
                          }}
                        >
                          {isSelected && (
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3">
                              <polyline points="20 6 9 17 4 12" />
                            </svg>
                          )}
                        </div>
                      )}

                      {/* 序号 */}
                      <div style={{ textAlign: 'center', color: '#666' }}>{seq}</div>

                      {/* 奖项名称 */}
                      <div>
                        {team.name}
                      </div>

                      {/* 奖项类别 */}
                      <div style={{ color: '#666' }}>团队奖</div>

                      {/* 获奖人数 */}
                      <div style={{ color: '#666' }}>{team.memberCount}</div>

                      {/* 颁发部门 */}
                      <div style={{ color: '#666', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {awardTitle ? awardTitle.split('2025年')[1]?.split('奖')[0] + '奖' : 'IT平台服务部/平台开发部'}
                      </div>

                      {/* 操作 */}
                      <div style={{ textAlign: 'center' }}>
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
                    </div>

                    {/* 展开区域 - 团队成员 */}
                    {isExpanded && team.members && (
                      <div
                        style={{
                          padding: '16px 24px 16px 24px',
                          backgroundColor: '#fafafa',
                          borderBottom: '1px solid #f0f0f0',
                        }}
                      >
                        <div style={{ fontSize: '14px', fontWeight: 500, color: '#333', marginBottom: '12px' }}>
                          获奖人员 ({team.members.length}人):
                        </div>
                        <div
                          style={{
                            display: 'flex',
                            flexWrap: 'wrap',
                            gap: '12px',
                          }}
                        >
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
                              <div style={{ fontSize: '12px', color: '#666', marginBottom: '2px' }}>
                                {member.employeeId}
                              </div>
                              <div
                                style={{
                                  fontSize: '11px',
                                  color: '#999',
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
                    )}
                  </React.Fragment>
                );
              })}

              {/* 分页 - 固定在底部 */}
              {filteredTeams.length > 0 && (
                <div style={{ 
                  padding: '12px 24px', 
                  borderTop: '1px solid #f0f0f0',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}>
                  {/* 左侧显示已勾选数量 */}
                  {!viewOnly && (
                    <div style={{ fontSize: '14px', color: '#666' }}>
                      已勾选 <span style={{ color: '#1890ff', fontWeight: 500 }}>{selectedTeams.size}</span> 条
                    </div>
                  )}
                  {viewOnly && <div></div>}
                  {/* 右侧分页 */}
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
              )}
            </>
          ) : (
            <div style={{ padding: '48px 24px', textAlign: 'center', color: '#999', fontSize: '14px' }}>
              暂无团队数据
            </div>
          )}
        </div>

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
            onClick={onCancel}
            style={{
              padding: '8px 24px',
              backgroundColor: '#fff',
              color: '#666',
              border: '1px solid #d9d9d9',
              borderRadius: '4px',
              fontSize: '14px',
              cursor: 'pointer',
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
            }}
          >
            保存
          </button>
        </div>
      </div>
    </div>
  );
};
