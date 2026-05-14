import React, { useState, useEffect, useMemo } from 'react';
import { Pagination } from './Pagination';
import { Team, TeamMember } from './types';

export interface TeamMembersModalProps {
  visible: boolean;
  team: Team;
  onClose: () => void;
  onConfirm: (updatedTeam: Team) => void;
}

const DEFAULT_PAGE_SIZE = 10;

const mockAllEmployees: TeamMember[] = [
  { name: '李水花', employeeId: '00494097', department: 'IT平台服务部/平台开发部' },
  { name: '张三', employeeId: '00501234', department: '质量与流程IT部/质量部/测试组' },
  { name: '李四', employeeId: '00505678', department: '智能汽车解决方案部/智能驾驶组' },
  { name: '王五', employeeId: '00507890', department: '华为公司' },
  { name: '赵六', employeeId: '00501111', department: 'IT平台服务部/平台运维部' },
  { name: '钱七', employeeId: '00502222', department: '质量与流程IT部/流程部/优化组' },
  { name: '孙八', employeeId: '00503333', department: '智能汽车解决方案部/智能座舱组' },
  { name: '周九', employeeId: '00504444', department: '云与计算业务部/大数据组' },
  { name: '吴十', employeeId: '00505555', department: 'IT平台服务部/平台开发部' },
  { name: '郑十一', employeeId: '00506666', department: '质量与流程IT部/IT部/开发组' },
  { name: '王十二', employeeId: '00507777', department: '智能汽车解决方案部/智能驾驶组' },
  { name: '冯十三', employeeId: '00508888', department: '云与计算业务部/云计算组' },
  { name: '陈十四', employeeId: '00509999', department: 'IT平台服务部/平台开发部' },
  { name: '褚十五', employeeId: '00510000', department: '质量与流程IT部/质量部/测试组' },
  { name: '卫十六', employeeId: '00511111', department: '智能汽车解决方案部/智能座舱组' },
  { name: '蒋十七', employeeId: '00512222', department: '云与计算业务部/大数据组' },
  { name: '沈十八', employeeId: '00513333', department: 'IT平台服务部/平台运维部' },
  { name: '韩十九', employeeId: '00514444', department: '质量与流程IT部/流程部/优化组' },
  { name: '杨二十', employeeId: '00515555', department: '智能汽车解决方案部/智能驾驶组' },
  { name: '朱二一', employeeId: '00516666', department: '云与计算业务部/云计算组' },
  { name: '袁六三', employeeId: '00558888', department: 'IT平台服务部/平台开发部' },
  { name: '柳六四', employeeId: '00559999', department: '质量与流程IT部/IT部/开发组' },
  { name: '酆六五', employeeId: '00560000', department: '智能汽车解决方案部/智能座舱组' },
  { name: '鲍六六', employeeId: '00561111', department: '云与计算业务部/大数据组' },
  { name: '史六七', employeeId: '00562222', department: 'IT平台服务部/技术支持部' },
  { name: '唐六八', employeeId: '00563333', department: '质量与流程IT部/质量部/测试组' },
  { name: '费六九', employeeId: '00564444', department: '智能汽车解决方案部/智能驾驶组' },
  { name: '廉七十', employeeId: '00565555', department: '云与计算业务部/云计算组' },
  { name: '岑七一', employeeId: '00566666', department: 'IT平台服务部/平台运维部' },
  { name: '薛七二', employeeId: '00567777', department: '质量与流程IT部/流程部/优化组' },
];

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
          width: '700px',
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
              padding: '4px',
              lineHeight: 1,
            }}
          >
            ×
          </button>
        </div>

        {/* 添加成员搜索栏 */}
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
            style={{
              padding: '6px 12px',
              border: '1px solid #d9d9d9',
              borderRadius: '4px',
              fontSize: '14px',
              width: '200px',
              outline: 'none',
            }}
          />
          <button
            onClick={handleSearch}
            style={{
              padding: '6px 16px',
              backgroundColor: '#1890ff',
              color: '#fff',
              border: 'none',
              borderRadius: '4px',
              fontSize: '13px',
              cursor: 'pointer',
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
                style={{
                  padding: '4px 12px',
                  backgroundColor: '#52c41a',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '4px',
                  fontSize: '12px',
                  cursor: 'pointer',
                }}
              >
                添加
              </button>
            </div>
          )}
        </div>

        {/* 表格 */}
        <div style={{ flex: 1, overflow: 'auto', overscrollBehavior: 'contain' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: '#fafafa' }}>
                <th style={{ padding: '12px 16px', textAlign: 'center', fontWeight: 500, color: '#333', borderBottom: '1px solid #f0f0f0', width: '60px' }}>
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
                      <svg
                        width="12"
                        height="12"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="#fff"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    ) : isIndeterminate ? (
                      <div
                        style={{
                          width: '10px',
                          height: '2px',
                          backgroundColor: '#fff',
                          borderRadius: '1px',
                        }}
                      />
                    ) : null}
                  </div>
                </th>
                <th style={{ padding: '12px 16px', textAlign: 'center', fontWeight: 500, color: '#333', borderBottom: '1px solid #f0f0f0', width: '80px' }}>序号</th>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 500, color: '#333', borderBottom: '1px solid #f0f0f0' }}>姓名</th>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 500, color: '#333', borderBottom: '1px solid #f0f0f0' }}>工号</th>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 500, color: '#333', borderBottom: '1px solid #f0f0f0' }}>部门</th>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 500, color: '#333', borderBottom: '1px solid #f0f0f0' }}>角色</th>
              </tr>
            </thead>
            <tbody>
              {paginatedMembers.map((member, index) => {
                const checked = selectedMemberIds.has(member.employeeId);
                const seq = (currentPage - 1) * pageSize + index + 1;
                return (
                  <tr
                    key={member.employeeId}
                    style={{
                      backgroundColor: checked ? '#e6f7ff' : 'transparent',
                      cursor: 'pointer',
                    }}
                    onClick={() => toggleMember(member.employeeId)}
                  >
                    <td style={{ padding: '12px 16px', borderBottom: '1px solid #f0f0f0', textAlign: 'center' }}>
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
                          <svg
                            width="12"
                            height="12"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="#fff"
                            strokeWidth="3"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                        )}
                      </div>
                    </td>
                    <td style={{ padding: '12px 16px', borderBottom: '1px solid #f0f0f0', textAlign: 'center', color: '#666' }}>
                      {seq}
                    </td>
                    <td style={{ padding: '12px 16px', borderBottom: '1px solid #f0f0f0', color: '#333' }}>
                      {member.name}
                    </td>
                    <td style={{ padding: '12px 16px', borderBottom: '1px solid #f0f0f0', color: '#666', fontFamily: 'monospace' }}>
                      {member.employeeId}
                    </td>
                    <td style={{ padding: '12px 16px', borderBottom: '1px solid #f0f0f0', color: '#666' }}>
                      {member.department}
                    </td>
                    <td style={{ padding: '12px 16px', borderBottom: '1px solid #f0f0f0', color: '#666' }}>
                      {member.role || '-'}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* 分页器 */}
        <div style={{ padding: '0 24px', borderTop: '1px solid #f0f0f0', flexShrink: 0 }}>
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
            onClick={onClose}
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
            确定
          </button>
        </div>
      </div>
    </div>
  );
};

export default TeamMembersModal;
