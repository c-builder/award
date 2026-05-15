import React, { useState, useEffect, useMemo } from 'react';
import { Pagination } from './Pagination';
import { Team, TeamMember } from './types';
import employeesData from '../mock/data/employees.json';

export interface TeamMembersModalProps {
  visible: boolean;
  team: Team;
  onClose: () => void;
  onConfirm: (updatedTeam: Team) => void;
}

const DEFAULT_PAGE_SIZE = 10;

const mockAllEmployees: TeamMember[] = employeesData as TeamMember[];

export const TeamMembersModal: React.FC<TeamMembersModalProps> = ({
  visible,
  team,
  onClose,
  onConfirm,
}) => {
  const [selectedMemberIds, setSelectedMemberIds] = useState<Set<string>>(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);
  const [searchText, setSearchText] = useState('');
  const [searchResult, setSearchResult] = useState<TeamMember | null>(null);
  const [searchError, setSearchError] = useState('');
  const [hoveredRowId, setHoveredRowId] = useState<string | null>(null);
  const [searchBtnHovered, setSearchBtnHovered] = useState(false);
  const [addBtnHovered, setAddBtnHovered] = useState(false);
  const [cancelBtnHovered, setCancelBtnHovered] = useState(false);
  const [confirmBtnHovered, setConfirmBtnHovered] = useState(false);
  const [inputFocused, setInputFocused] = useState(false);

  useEffect(() => {
    if (visible) {
      const members = team.members || [];
      const hasAnySelected = members.some(m => m.isSelected !== undefined);
      const selectedIds = hasAnySelected
        ? new Set(members.filter(m => m.isSelected).map(m => m.employeeId))
        : new Set(members.map(m => m.employeeId));
      setSelectedMemberIds(selectedIds);
      setCurrentPage(1);
      setPageSize(DEFAULT_PAGE_SIZE);
      setSearchText('');
      setSearchResult(null);
      setSearchError('');
    }
  }, [visible, team.members]);

  const members = team.members || [];

  const isAllSelected = members.length > 0 && members.every(m => selectedMemberIds.has(m.employeeId));
  const isIndeterminate = members.length > 0 && selectedMemberIds.size > 0 && selectedMemberIds.size < members.length;

  const toggleMember = (employeeId: string) => {
    setSelectedMemberIds(prev => {
      const next = new Set(prev);
      if (next.has(employeeId)) {
        next.delete(employeeId);
      } else {
        next.add(employeeId);
      }
      return next;
    });
  };

  const toggleAll = () => {
    if (isAllSelected) {
      setSelectedMemberIds(new Set());
    } else {
      setSelectedMemberIds(new Set(members.map(m => m.employeeId)));
    }
  };

  const handleSearch = () => {
    if (!searchText.trim()) {
      setSearchError('请输入工号');
      setSearchResult(null);
      return;
    }

    const found = mockAllEmployees.find(e => e.employeeId === searchText.trim());
    if (!found) {
      setSearchError('未找到该员工');
      setSearchResult(null);
      return;
    }

    if (members.some(m => m.employeeId === found.employeeId)) {
      setSearchError('已存在');
      setSearchResult(null);
      return;
    }

    setSearchError('');
    setSearchResult(found);
  };

  const handleAddMember = () => {
    if (!searchResult) return;
    members.push({
      ...searchResult,
      isSelected: true,
    });
    setSelectedMemberIds(prev => {
      const next = new Set(prev);
      next.add(searchResult.employeeId);
      return next;
    });
    setSearchText('');
    setSearchResult(null);
    setSearchError('');
  };

  const paginatedMembers = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return members.slice(start, start + pageSize);
  }, [members, currentPage, pageSize]);

  const handleConfirm = () => {
    const selectedCount = selectedMemberIds.size;
    const updatedTeam: Team = {
      ...team,
      memberCount: selectedCount,
      members: members.map(m => ({
        ...m,
        isSelected: selectedMemberIds.has(m.employeeId),
      })),
    };
    onConfirm(updatedTeam);
    onClose();
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
            {team.name} - 成员列表
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

        <div
          style={{
            padding: '12px 24px',
            borderBottom: '1px solid #f0f0f0',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            backgroundColor: '#fafafa',
          }}
        >
          <input
            type="text"
            placeholder="输入工号添加跨部门成员"
            value={searchText}
            onChange={(e) => {
              setSearchText(e.target.value);
              setSearchError('');
              setSearchResult(null);
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSearch();
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
            onClick={handleSearch}
            onMouseEnter={() => setSearchBtnHovered(true)}
            onMouseLeave={() => setSearchBtnHovered(false)}
            style={{
              padding: '6px 16px',
              backgroundColor: searchBtnHovered ? '#40a9ff' : '#1890ff',
              color: '#fff',
              border: 'none',
              borderRadius: '4px',
              fontSize: '13px',
              cursor: 'pointer',
              transition: 'background-color 0.2s',
            }}
          >
            查询
          </button>
          {searchError && (
            <span style={{ fontSize: '13px', color: '#ff4d4f' }}>{searchError}</span>
          )}
          {searchResult && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '13px', color: '#333' }}>
                {searchResult.name} ({searchResult.employeeId}) - {searchResult.department}
              </span>
              <button
                onClick={handleAddMember}
                onMouseEnter={() => setAddBtnHovered(true)}
                onMouseLeave={() => setAddBtnHovered(false)}
                style={{
                  padding: '4px 12px',
                  backgroundColor: addBtnHovered ? '#73d13d' : '#52c41a',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '4px',
                  fontSize: '12px',
                  cursor: 'pointer',
                  transition: 'background-color 0.2s',
                }}
              >
                添加
              </button>
            </div>
          )}
        </div>

        <div style={{ flex: 1, overflow: 'auto', overscrollBehavior: 'contain', padding: '0 20px', backgroundColor: '#fafafa' }}>
          {members.length === 0 ? (
            <div style={{
              padding: '48px 0',
              textAlign: 'center',
              color: '#bfbfbf',
              fontSize: '14px',
            }}>
              暂无成员数据
            </div>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse', tableLayout: 'fixed' }}>
              <thead>
                <tr style={{ backgroundColor: '#fafafa' }}>
                  <th style={{ ...thStyle, textAlign: 'center', width: '60px' }}>
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
                  <th style={{ ...thStyle, textAlign: 'center', width: '70px' }}>序号</th>
                  <th style={{ ...thStyle, width: '100px' }}>姓名</th>
                  <th style={{ ...thStyle, width: '120px' }}>工号</th>
                  <th style={{ ...thStyle }}>部门</th>
                  <th style={{ ...thStyle, width: '90px' }}>角色</th>
                </tr>
              </thead>
              <tbody>
                {paginatedMembers.map((member, index) => {
                  const checked = selectedMemberIds.has(member.employeeId);
                  const seq = (currentPage - 1) * pageSize + index + 1;
                  const isLast = index === paginatedMembers.length - 1;
                  return (
                    <tr
                      key={member.employeeId}
                      style={{
                        backgroundColor: hoveredRowId === member.employeeId ? '#fafafa' : 'transparent',
                        cursor: 'pointer',
                        transition: 'background-color 0.2s',
                      }}
                      onClick={() => toggleMember(member.employeeId)}
                      onMouseEnter={() => setHoveredRowId(member.employeeId)}
                      onMouseLeave={() => setHoveredRowId(null)}
                    >
                      <td style={{ ...tdStyle(isLast), textAlign: 'center' }}>
                        <div
                          style={{
                            width: '18px',
                            height: '18px',
                            border: `2px solid ${checked ? '#1890ff' : '#d9d9d9'}`,
                            borderRadius: '3px',
                            backgroundColor: checked ? '#1890ff' : '#fff',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            margin: '0 auto',
                            transition: 'all 0.2s',
                          }}
                        >
                          {checked && (
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                              <polyline points="20 6 9 17 4 12" />
                            </svg>
                          )}
                        </div>
                      </td>
                      <td style={{ ...tdStyle(isLast), textAlign: 'center', color: '#8c8c8c' }}>
                        {seq}
                      </td>
                      <td style={{ ...tdStyle(isLast), color: '#262626', fontWeight: 500 }}>
                        {member.name}
                      </td>
                      <td style={{ ...tdStyle(isLast), color: '#595959', fontFamily: 'monospace', letterSpacing: '0.5px' }}>
                        {member.employeeId}
                      </td>
                      <td style={{ ...tdStyle(isLast), color: '#595959' }}>
                        {member.department}
                      </td>
                      <td style={{ ...tdStyle(isLast), color: '#8c8c8c' }}>
                        {member.role || '-'}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>

        <div style={{
          padding: '0 24px',
          borderTop: '1px solid #f0f0f0',
          flexShrink: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          <div style={{ fontSize: '14px', color: '#595959' }}>
            已选 <span style={{ color: '#1890ff', fontWeight: 500 }}>{selectedMemberIds.size}</span> 人
          </div>
          <Pagination
            current={currentPage}
            pageSize={pageSize}
            total={members.length}
            onChange={setCurrentPage}
            onPageSizeChange={(size) => { setPageSize(size); setCurrentPage(1); }}
            showTotal
            showPageSize
          />
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
            onClick={onClose}
            onMouseEnter={() => setCancelBtnHovered(true)}
            onMouseLeave={() => setCancelBtnHovered(false)}
            style={{
              padding: '8px 24px',
              backgroundColor: cancelBtnHovered ? '#fff' : '#fff',
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
            确定
          </button>
        </div>
      </div>
    </div>
  );
};

export default TeamMembersModal;
