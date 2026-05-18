import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Pagination } from './Pagination';
import { DeptCascader } from './DeptCascader';
import type { Team, Recipient } from './types';

export interface AwardDetailDrawerProps {
  visible: boolean;
  onClose: () => void;
  mode: 'award' | 'team';
  awardTitle?: string;
  teams?: Team[];
  team?: Team;
  showSearch?: boolean;
  showPagination?: boolean;
  onMemberDelete?: (teamId: string, employeeId: string) => void;
}

export const AwardDetailDrawer: React.FC<AwardDetailDrawerProps> = ({
  visible,
  onClose,
  mode,
  awardTitle,
  teams = [],
  team,
  showSearch = false,
  showPagination = false,
  onMemberDelete,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDeptPath, setSelectedDeptPath] = useState<string[]>([]);
  const [expandedTeamIds, setExpandedTeamIds] = useState<Set<string>>(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchFocused, setSearchFocused] = useState(false);

  // 使用 ref 存储上一次的 visible 值，只在 visible 从 false 变为 true 时重置状态
  const prevVisibleRef = useRef(visible);

  useEffect(() => {
    // 只在 Drawer 打开时（visible 从 false 变为 true）重置状态
    if (visible && !prevVisibleRef.current) {
      setSearchQuery('');
      setSelectedDeptPath([]);
      setCurrentPage(1);
      if (teams.length === 1) {
        setExpandedTeamIds(new Set([teams[0].id]));
      } else if (team) {
        setExpandedTeamIds(new Set([team.id]));
      } else {
        setExpandedTeamIds(new Set());
      }
    }
    prevVisibleRef.current = visible;
  }, [visible, teams, team]);

  // 禁止底层页面滚动
  useEffect(() => {
    if (visible) {
      const originalOverflow = document.body.style.overflow;
      const originalPaddingRight = document.body.style.paddingRight;
      const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;

      document.body.style.overflow = 'hidden';
      if (scrollbarWidth > 0) {
        document.body.style.paddingRight = `${scrollbarWidth}px`;
      }

      return () => {
        document.body.style.overflow = originalOverflow;
        document.body.style.paddingRight = originalPaddingRight;
      };
    }
  }, [visible]);

  const isAwardMode = mode === 'award';

  const filteredTeams = useMemo(() => {
    if (isAwardMode) {
      return teams.filter(t => {
        if (searchQuery.trim()) {
          const query = searchQuery.trim().toLowerCase();
          if (!t.name.toLowerCase().includes(query)) return false;
        }
        if (selectedDeptPath.length > 0) {
          const selectedDept = selectedDeptPath[0];
          const hasMemberInDept = t.members?.some(m =>
            m.department.split('/')[0] === selectedDept
          );
          if (!hasMemberInDept) return false;
        }
        return true;
      });
    } else {
      if (!team) return [];
      const filteredMembers = team.members?.filter(m => {
        if (m.isSelected === false) return false;
        if (searchQuery.trim()) {
          const query = searchQuery.trim().toLowerCase();
          if (!m.name.toLowerCase().includes(query) && !m.employeeId.toLowerCase().includes(query)) return false;
        }
        if (selectedDeptPath.length > 0) {
          const selectedDept = selectedDeptPath[0];
          if (m.department.split('/')[0] !== selectedDept) return false;
        }
        return true;
      }) || [];
      return [{
        ...team,
        members: filteredMembers,
        memberCount: filteredMembers.length,
      }];
    }
  }, [teams, team, searchQuery, selectedDeptPath, isAwardMode]);

  const paginatedTeams = useMemo(() => {
    if (!showPagination) return filteredTeams;
    const start = (currentPage - 1) * pageSize;
    return filteredTeams.slice(start, start + pageSize);
  }, [filteredTeams, currentPage, pageSize, showPagination]);

  const toggleTeamExpand = (teamId: string) => {
    setExpandedTeamIds(prev => {
      const newSet = new Set(prev);
      if (newSet.has(teamId)) {
        newSet.delete(teamId);
      } else {
        newSet.add(teamId);
      }
      return newSet;
    });
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && visible) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [visible, onClose]);

  if (!visible) return null;

  const displayTeams = isAwardMode ? paginatedTeams : filteredTeams;
  const totalMemberCount = isAwardMode
    ? filteredTeams.reduce((sum, t) => sum + (t.members?.filter(m => m.isSelected !== false).length || 0), 0)
    : (team?.members?.filter(m => m.isSelected !== false).length || 0);

  const searchPlaceholder = isAwardMode ? '搜索团队名称…' : '搜索姓名/工号…';

  return (
    <>
      <div
        onClick={(e) => {
          e.stopPropagation();
          onClose();
        }}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.45)',
          zIndex: 1050,
          animation: 'fadeIn 0.3s ease',
        }}
        aria-hidden="true"
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="drawer-title"
        onClick={(e) => e.stopPropagation()}
        style={{
          position: 'fixed',
          top: 0,
          right: 0,
          bottom: 0,
          width: '600px',
          maxWidth: '100%',
          backgroundColor: '#fff',
          zIndex: 1051,
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '-4px 0 16px rgba(0, 0, 0, 0.15)',
          animation: 'slideIn 0.3s ease',
          overscrollBehavior: 'contain',
        }}
      >
        <style>{`
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          @keyframes slideIn {
            from { transform: translateX(100%); }
            to { transform: translateX(0); }
          }
          @media (prefers-reduced-motion: reduce) {
            @keyframes fadeIn, @keyframes slideIn {
              from, to { animation: none; }
            }
          }
        `}</style>

        <div
          style={{
            padding: '16px 24px',
            borderBottom: '1px solid #f0f0f0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div>
            <h3
              id="drawer-title"
              style={{
                margin: 0,
                fontSize: '16px',
                fontWeight: 600,
                color: '#1a1a2e',
              }}
            >
              {awardTitle}
            </h3>
            <div style={{ fontSize: '13px', color: '#666', marginTop: '4px' }}>
              {isAwardMode
                ? `共 ${filteredTeams.length} 个团队`
                : `共 ${totalMemberCount} 人`
              }
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="关闭详情"
            style={{
              width: '32px',
              height: '32px',
              border: 'none',
              backgroundColor: 'transparent',
              cursor: 'pointer',
              borderRadius: '4px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'background-color 0.2s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#f5f5f5';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#999" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {showSearch && (
          <div
            style={{
              padding: '16px 24px',
              borderBottom: '1px solid #f0f0f0',
              backgroundColor: '#fafafa',
              display: 'flex',
              gap: '12px',
            }}
          >
            <input
              type="search"
              inputMode="search"
              autoComplete="off"
              placeholder={searchPlaceholder}
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
              style={{
                flex: 1,
                padding: '8px 12px',
                border: `1px solid ${searchFocused ? '#1890ff' : '#d9d9d9'}`,
                borderRadius: '6px',
                fontSize: '14px',
                outline: 'none',
                transition: 'border-color 0.2s, box-shadow 0.2s',
                boxShadow: searchFocused ? '0 0 0 2px rgba(24, 144, 255, 0.2)' : 'none',
              }}
            />
            <DeptCascader
              value={selectedDeptPath}
              onChange={(value) => {
                setSelectedDeptPath(value);
                setCurrentPage(1);
              }}
              placeholder="全部部门"
            />
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedDeptPath([]);
                setCurrentPage(1);
              }}
              style={{
                padding: '8px 16px',
                backgroundColor: '#fff',
                color: '#595959',
                border: '1px solid #d9d9d9',
                borderRadius: '6px',
                fontSize: '14px',
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#40a9ff';
                e.currentTarget.style.color = '#40a9ff';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = '#d9d9d9';
                e.currentTarget.style.color = '#595959';
              }}
            >
              重置
            </button>
          </div>
        )}

        <div
          style={{
            flex: 1,
            overflow: 'auto',
            padding: '16px 24px',
          }}
        >
          {displayTeams.length === 0 ? (
            <div
              style={{
                textAlign: 'center',
                padding: '48px 0',
                color: '#999',
              }}
            >
              <svg
                width="48"
                height="48"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#d9d9d9"
                strokeWidth="1.5"
                style={{ marginBottom: '16px' }}
              >
                <rect x="3" y="3" width="18" height="18" rx="2" />
                <line x1="9" y1="9" x2="15" y2="9" />
                <line x1="9" y1="13" x2="15" y2="13" />
                <line x1="9" y1="17" x2="11" y2="17" />
              </svg>
              <div>{searchQuery || selectedDeptPath.length > 0 ? '未找到匹配结果' : '暂无数据'}</div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {displayTeams.map((t) => (
                <TeamItem
                  key={t.id}
                  team={t}
                  isExpanded={expandedTeamIds.has(t.id)}
                  onToggle={() => toggleTeamExpand(t.id)}
                  onMemberDelete={onMemberDelete}
                />
              ))}
            </div>
          )}
        </div>

        {isAwardMode && showPagination && filteredTeams.length > 0 && (
          <div
            style={{
              padding: '16px 24px',
              borderTop: '1px solid #f0f0f0',
              display: 'flex',
              justifyContent: 'flex-end',
            }}
          >
            <Pagination
              current={currentPage}
              pageSize={pageSize}
              total={filteredTeams.length}
              onChange={setCurrentPage}
              onPageSizeChange={(size) => {
                setPageSize(size);
                setCurrentPage(1);
              }}
              showTotal
              showPageSize
            />
          </div>
        )}
      </div>
    </>
  );
};

interface TeamItemProps {
  team: Team;
  isExpanded: boolean;
  onToggle: () => void;
  onMemberDelete?: (teamId: string, employeeId: string) => void;
}

const TeamItem: React.FC<TeamItemProps> = ({ team, isExpanded, onToggle, onMemberDelete }) => {
  const selectedMembers = team.members?.filter(m => m.isSelected !== false) || [];

  return (
    <div
      style={{
        border: '1px solid #e8e8e8',
        borderRadius: '8px',
        overflow: 'hidden',
        transition: 'border-color 0.2s',
      }}
    >
      <button
        onClick={(e) => {
          e.stopPropagation();
          onToggle();
        }}
        style={{
          width: '100%',
          padding: '12px 16px',
          backgroundColor: '#fafafa',
          border: 'none',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          textAlign: 'left',
          transition: 'background-color 0.2s',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = '#f0f0f0';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = '#fafafa';
        }}
      >
        <div>
          <div style={{ fontSize: '14px', fontWeight: 500, color: '#333' }}>
            {team.name}
          </div>
          <div style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>
            成员: {selectedMembers.length}人
          </div>
        </div>
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#999"
          strokeWidth="2"
          style={{
            transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform 0.2s',
          }}
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {isExpanded && (
        <div
          style={{
            padding: '12px 16px',
            backgroundColor: '#fff',
            borderTop: '1px solid #e8e8e8',
          }}
        >
          {selectedMembers.length === 0 ? (
            <div style={{ fontSize: '13px', color: '#999', textAlign: 'center', padding: '16px' }}>
              暂无成员
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {selectedMembers.map((member, index) => (
                <MemberItem
                  key={member.employeeId}
                  member={member}
                  index={index + 1}
                  onDelete={onMemberDelete ? (employeeId) => onMemberDelete(team.id, employeeId) : undefined}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

interface MemberItemProps {
  member: Recipient;
  index: number;
  onDelete?: (employeeId: string) => void;
}

const MemberItem: React.FC<MemberItemProps> = ({ member, index, onDelete }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: '12px',
        padding: '10px 12px',
        backgroundColor: '#f5f5f5',
        borderRadius: '6px',
        position: 'relative',
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <span
        style={{
          width: '20px',
          height: '20px',
          borderRadius: '50%',
          backgroundColor: '#e6f7ff',
          color: '#1890ff',
          fontSize: '11px',
          fontWeight: 500,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          marginTop: '2px',
        }}
      >
        {index}
      </span>
      <div style={{ flex: 1, minWidth: 0 }}>
        {/* 第一行：姓名 + 工号 */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '14px', fontWeight: 500, color: '#333' }}>
            {member.name}
          </span>
          <span style={{ fontSize: '12px', color: '#666' }}>
            {member.employeeId}
          </span>
        </div>
        {/* 第二行：部门 */}
        <div
          style={{
            fontSize: '12px',
            color: '#999',
            marginTop: '4px',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
          title={member.department}
        >
          {member.department}
        </div>
      </div>
      {/* 删除按钮 */}
      {onDelete && isHovered && (
        <button
          onClick={() => onDelete(member.employeeId)}
          style={{
            padding: '4px 8px',
            backgroundColor: '#ff4d4f',
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
            fontSize: '12px',
            cursor: 'pointer',
            flexShrink: 0,
            marginLeft: '8px',
          }}
        >
          删除
        </button>
      )}
    </div>
  );
};

export default AwardDetailDrawer;
