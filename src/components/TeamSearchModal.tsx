import React, { useState, useEffect } from 'react';

/**
 * 团队信息
 */
export interface Team {
  id: string;
  name: string;
  leaderName: string;
  leaderId: string;
  memberCount: number;
  members?: TeamMember[];
}

/**
 * 员工信息
 */
export interface Employee {
  name: string;
  employeeId: string;
  department: string;
}

/**
 * 团队成员信息
 */
export interface TeamMember {
  name: string;
  employeeId: string;
  department: string;
  role: string;
}

/**
 * 查询结果
 */
export interface QueryResult {
  employee: Employee;
  teams: Team[];
}

export interface TeamSearchModalProps {
  visible: boolean;
  onCancel: () => void;
  onConfirm: (selectedTeams: Team[]) => void;
}

// 模拟员工数据
const mockEmployeeData: Record<string, Employee> = {
  '00494097': { name: '李山花', employeeId: '00494097', department: 'IT平台服务部/平台开发部' },
  '00501234': { name: '张三', employeeId: '00501234', department: '质量与流程IT部/质量部/测试组' },
  '00505678': { name: '李四', employeeId: '00505678', department: '智能汽车解决方案部/智能驾驶组' },
  '00507890': { name: '王五', employeeId: '00507890', department: '云与计算业务部/云计算组' },
  '00501111': { name: '赵六', employeeId: '00501111', department: 'IT平台服务部/平台运维部' },
  '00502222': { name: '钱七', employeeId: '00502222', department: '质量与流程IT部/流程部/优化组' },
  '00503333': { name: '孙八', employeeId: '00503333', department: '智能汽车解决方案部/智能座舱组' },
  '00504444': { name: '周九', employeeId: '00504444', department: '云与计算业务部/大数据组' },
  '00505555': { name: '吴十', employeeId: '00505555', department: 'IT平台服务部/技术支持部' },
  '00506666': { name: '郑十一', employeeId: '00506666', department: '质量与流程IT部/IT部/开发组' },
};

// 生成模拟团队成员
const generateMockMembers = (count: number, prefix: string): TeamMember[] => {
  const departments = [
    'IT平台服务部/平台开发部',
    'IT平台服务部/平台运维部',
    '质量与流程IT部/质量部/测试组',
    '质量与流程IT部/流程部/优化组',
    '智能汽车解决方案部/智能驾驶组',
    '智能汽车解决方案部/智能座舱组',
    '云与计算业务部/云计算组',
    '云与计算业务部/大数据组',
    'IT平台服务部/技术支持部',
    '质量与流程IT部/IT部/开发组',
  ];
  const roles = ['开发工程师', '测试工程师', '运维工程师', '产品经理', '项目经理', '架构师', '技术专家', 'UI设计师'];

  return Array.from({ length: count }, (_, i) => ({
    name: `${prefix}成员${i + 1}`,
    employeeId: `005${String(Math.floor(Math.random() * 90000) + 10000)}`,
    department: departments[Math.floor(Math.random() * departments.length)],
    role: roles[Math.floor(Math.random() * roles.length)],
  }));
};

// 模拟团队数据
const mockTeamsData: Record<string, Team[]> = {
  '00494097': [
    { id: 'team-001', name: '新员工OCC实践培训优秀团队', leaderName: '赵六', leaderId: '00501111', memberCount: 10, members: generateMockMembers(10, 'OCC培训') },
    { id: 'team-002', name: 'CIO值班优秀团队', leaderName: '钱七', leaderId: '00502222', memberCount: 8, members: generateMockMembers(8, 'CIO值班') },
    { id: 'team-003', name: 'OCC委员会和OCC运营大会组织优秀团队', leaderName: '孙八', leaderId: '00503333', memberCount: 12, members: generateMockMembers(12, 'OCC运营') },
  ],
  '00501234': [
    { id: 'team-004', name: '质量改进优秀团队', leaderName: '张三', leaderId: '00501234', memberCount: 15, members: generateMockMembers(15, '质量改进') },
    { id: 'team-005', name: '流程优化项目组', leaderName: '李四', leaderId: '00505678', memberCount: 6, members: generateMockMembers(6, '流程优化') },
  ],
  '00505678': [
    { id: 'team-006', name: '智能汽车研发一组', leaderName: '王五', leaderId: '00507890', memberCount: 20, members: generateMockMembers(20, '智能汽车') },
  ],
  '00507890': [
    { id: 'team-007', name: '云计算架构团队', leaderName: '王五', leaderId: '00507890', memberCount: 18, members: generateMockMembers(18, '云计算') },
    { id: 'team-008', name: '容器化改造小组', leaderName: '周九', leaderId: '00504444', memberCount: 12, members: generateMockMembers(12, '容器化') },
  ],
  '00501111': [
    { id: 'team-009', name: '平台运维保障团队', leaderName: '赵六', leaderId: '00501111', memberCount: 25, members: generateMockMembers(25, '运维保障') },
    { id: 'team-010', name: 'DevOps转型推进团队', leaderName: '吴十', leaderId: '00505555', memberCount: 20, members: generateMockMembers(20, 'DevOps') },
  ],
  '00502222': [
    { id: 'team-011', name: '流程自动化改造团队', leaderName: '钱七', leaderId: '00502222', memberCount: 16, members: generateMockMembers(16, '自动化') },
  ],
  '00503333': [
    { id: 'team-012', name: '智能座舱交互设计团队', leaderName: '孙八', leaderId: '00503333', memberCount: 14, members: generateMockMembers(14, '交互设计') },
  ],
  '00504444': [
    { id: 'team-013', name: '大数据分析平台团队', leaderName: '周九', leaderId: '00504444', memberCount: 22, members: generateMockMembers(22, '大数据') },
  ],
  '00505555': [
    { id: 'team-014', name: '技术支持响应团队', leaderName: '吴十', leaderId: '00505555', memberCount: 30, members: generateMockMembers(30, '技术支持') },
  ],
  '00506666': [
    { id: 'team-015', name: '内部工具开发团队', leaderName: '郑十一', leaderId: '00506666', memberCount: 10, members: generateMockMembers(10, '工具开发') },
  ],
};

/**
 * 模拟工号查询API
 */
const queryEmployeeById = async (employeeId: string): Promise<QueryResult | null> => {
  // 模拟API延迟
  await new Promise(resolve => setTimeout(resolve, 500));

  const employee = mockEmployeeData[employeeId];
  const teams = mockTeamsData[employeeId];

  if (!employee || !teams) {
    return null;
  }

  return { employee, teams };
};

/**
 * 团队奖工号查询弹窗组件
 * 支持通过工号查询员工及其所属团队，选择团队后确认添加
 */
export const TeamSearchModal: React.FC<TeamSearchModalProps> = ({
  visible,
  onCancel,
  onConfirm,
}) => {
  const [employeeId, setEmployeeId] = useState('');
  const [queryResult, setQueryResult] = useState<QueryResult | null>(null);
  const [selectedTeams, setSelectedTeams] = useState<Set<string>>(new Set());
  const [expandedTeams, setExpandedTeams] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // 弹窗关闭时重置状态
  useEffect(() => {
    if (!visible) {
      setEmployeeId('');
      setQueryResult(null);
      setSelectedTeams(new Set());
      setExpandedTeams(new Set());
      setError('');
      setLoading(false);
    }
  }, [visible]);

  // 执行查询
  const handleQuery = async () => {
    if (!employeeId.trim()) {
      setError('请输入工号');
      return;
    }

    setLoading(true);
    setError('');
    setQueryResult(null);
    setSelectedTeams(new Set());

    try {
      const result = await queryEmployeeById(employeeId.trim());
      if (result) {
        setQueryResult(result);
      } else {
        setError('未找到该工号对应的员工信息');
      }
    } catch (err) {
      setError('查询失败，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  // 切换团队选中状态
  const toggleTeamSelection = (teamId: string) => {
    const newSelected = new Set(selectedTeams);
    if (newSelected.has(teamId)) {
      newSelected.delete(teamId);
    } else {
      newSelected.add(teamId);
    }
    setSelectedTeams(newSelected);
  };

  // 切换团队展开状态
  const toggleTeamExpand = (e: React.MouseEvent, teamId: string) => {
    e.stopPropagation();
    const newExpanded = new Set(expandedTeams);
    if (newExpanded.has(teamId)) {
      newExpanded.delete(teamId);
    } else {
      newExpanded.add(teamId);
    }
    setExpandedTeams(newExpanded);
  };

  // 确认添加
  const handleConfirm = () => {
    if (!queryResult) return;

    const selectedList = queryResult.teams.filter(team => selectedTeams.has(team.id));
    onConfirm(selectedList);
  };

  // 处理输入框回车事件
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleQuery();
    }
  };

  if (!visible) return null;

  return (
    <div
      className="modal-overlay"
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
        className="modal-content"
        style={{
          backgroundColor: '#fff',
          borderRadius: '8px',
          width: '600px',
          maxHeight: '80vh',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* 弹窗标题 */}
        <div
          className="modal-header"
          style={{
            padding: '16px 24px',
            borderBottom: '1px solid #f0f0f0',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <h3
            style={{
              margin: 0,
              fontSize: '16px',
              fontWeight: 500,
              color: '#333',
            }}
          >
            通过工号查询团队
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

        {/* 查询区域 */}
        <div
          className="modal-query"
          style={{
            padding: '20px 24px',
            borderBottom: '1px solid #f0f0f0',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontSize: '14px', color: '#333', whiteSpace: 'nowrap' }}>
              请输入工号:
            </span>
            <input
              type="text"
              placeholder="请输入工号"
              value={employeeId}
              onChange={(e) => setEmployeeId(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={loading}
              style={{
                padding: '8px 12px',
                border: '1px solid #d9d9d9',
                borderRadius: '4px',
                fontSize: '14px',
                width: '200px',
                outline: 'none',
                transition: 'border-color 0.3s',
              }}
              onFocus={(e) => {
                e.target.style.borderColor = '#1890ff';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = '#d9d9d9';
              }}
            />
            <button
              onClick={handleQuery}
              disabled={loading || !employeeId.trim()}
              style={{
                padding: '8px 20px',
                backgroundColor: loading || !employeeId.trim() ? '#d9d9d9' : '#1890ff',
                color: '#fff',
                border: 'none',
                borderRadius: '4px',
                fontSize: '14px',
                cursor: loading || !employeeId.trim() ? 'not-allowed' : 'pointer',
                transition: 'background-color 0.3s',
              }}
            >
              {loading ? '查询中...' : '查询'}
            </button>
          </div>

          {/* 错误提示 */}
          {error && (
            <div
              style={{
                marginTop: '12px',
                padding: '8px 12px',
                backgroundColor: '#fff2f0',
                border: '1px solid #ffccc7',
                borderRadius: '4px',
                color: '#ff4d4f',
                fontSize: '14px',
              }}
            >
              {error}
            </div>
          )}
        </div>

        {/* 查询结果区域 */}
        <div
          className="modal-body"
          style={{
            flex: 1,
            overflow: 'auto',
            padding: '20px 24px',
          }}
        >
          {queryResult ? (
            <>
              {/* 员工信息 */}
              <div style={{ marginBottom: '20px' }}>
                <h4
                  style={{
                    margin: '0 0 12px 0',
                    fontSize: '14px',
                    fontWeight: 500,
                    color: '#333',
                  }}
                >
                  查询结果:
                </h4>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '12px 16px',
                    backgroundColor: '#f6ffed',
                    border: '1px solid #b7eb8f',
                    borderRadius: '4px',
                  }}
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    style={{ color: '#52c41a', flexShrink: 0 }}
                  >
                    <path
                      d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"
                      fill="currentColor"
                    />
                  </svg>
                  <span style={{ fontSize: '14px', color: '#333' }}>
                    员工: {queryResult.employee.name} ({queryResult.employee.employeeId}) - {queryResult.employee.department}
                  </span>
                </div>
              </div>

              {/* 所属团队列表 */}
              <div>
                <h4
                  style={{
                    margin: '0 0 12px 0',
                    fontSize: '14px',
                    fontWeight: 500,
                    color: '#333',
                  }}
                >
                  所属团队奖:
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {queryResult.teams.map((team) => {
                    const isSelected = selectedTeams.has(team.id);
                    const isExpanded = expandedTeams.has(team.id);
                    return (
                      <div
                        key={team.id}
                        style={{
                          backgroundColor: isSelected ? '#e6f7ff' : '#f5f5f5',
                          border: `1px solid ${isSelected ? '#1890ff' : '#d9d9d9'}`,
                          borderRadius: '6px',
                          transition: 'all 0.3s',
                          overflow: 'hidden',
                        }}
                      >
                        <div
                          onClick={() => toggleTeamSelection(team.id)}
                          style={{
                            display: 'flex',
                            alignItems: 'flex-start',
                            gap: '12px',
                            padding: '16px',
                            cursor: 'pointer',
                          }}
                        >
                          {/* 复选框 */}
                          <div
                            style={{
                              width: '18px',
                              height: '18px',
                              borderRadius: '50%',
                              border: `2px solid ${isSelected ? '#1890ff' : '#d9d9d9'}`,
                              backgroundColor: isSelected ? '#1890ff' : '#fff',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              flexShrink: 0,
                              marginTop: '2px',
                            }}
                          >
                            {isSelected && (
                              <svg
                                width="12"
                                height="12"
                                viewBox="0 0 24 24"
                                fill="none"
                              >
                                <path
                                  d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"
                                  fill="#fff"
                                />
                              </svg>
                            )}
                          </div>

                          {/* 团队信息 */}
                          <div style={{ flex: 1 }}>
                            <div
                              style={{
                                fontSize: '14px',
                                fontWeight: 500,
                                color: '#333',
                                marginBottom: '6px',
                              }}
                            >
                              {team.name}
                            </div>
                            <div
                              style={{
                                fontSize: '13px',
                                color: '#666',
                                lineHeight: '1.6',
                              }}
                            >
                              <div>团队负责人: {team.leaderName} ({team.leaderId})</div>
                              <div>团队成员: {team.memberCount}人</div>
                            </div>
                          </div>

                          {/* 箭头图标 - 点击展开/折叠 */}
                          <div
                            onClick={(e) => toggleTeamExpand(e, team.id)}
                            style={{
                              width: '28px',
                              height: '28px',
                              borderRadius: '4px',
                              border: `1px solid ${isSelected ? '#1890ff' : '#d9d9d9'}`,
                              backgroundColor: '#fff',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              flexShrink: 0,
                              marginTop: '2px',
                              cursor: 'pointer',
                              transition: 'all 0.3s',
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.borderColor = '#1890ff';
                              e.currentTarget.style.backgroundColor = '#e6f7ff';
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.borderColor = isSelected ? '#1890ff' : '#d9d9d9';
                              e.currentTarget.style.backgroundColor = '#fff';
                            }}
                          >
                            <svg
                              width="14"
                              height="14"
                              viewBox="0 0 24 24"
                              fill="none"
                              style={{
                                color: '#666',
                                transform: isExpanded ? 'rotate(90deg)' : 'rotate(0deg)',
                                transition: 'transform 0.3s',
                              }}
                            >
                              <path
                                d="M9 18l6-6-6-6"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                          </div>
                        </div>

                        {/* 展开的成员列表 */}
                        {isExpanded && team.members && team.members.length > 0 && (
                          <div
                            style={{
                              padding: '0 16px 16px 16px',
                              backgroundColor: isSelected ? '#e6f7ff' : '#f5f5f5',
                            }}
                          >
                            <div
                              style={{
                                padding: '12px',
                                backgroundColor: '#fff',
                                borderRadius: '4px',
                                border: `1px solid ${isSelected ? '#91d5ff' : '#e8e8e8'}`,
                              }}
                            >
                              <div
                                style={{
                                  fontSize: '13px',
                                  fontWeight: 500,
                                  color: '#333',
                                  marginBottom: '10px',
                                  paddingBottom: '8px',
                                  borderBottom: '1px solid #e8e8e8',
                                }}
                              >
                                团队成员 ({team.members.length}人)
                              </div>
                              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                {team.members.map((member, index) => (
                                  <div
                                    key={member.employeeId || index}
                                    style={{
                                      display: 'flex',
                                      alignItems: 'center',
                                      justifyContent: 'space-between',
                                      padding: '8px 12px',
                                      backgroundColor: '#f6ffed',
                                      borderRadius: '4px',
                                      border: '1px solid #b7eb8f',
                                    }}
                                  >
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                      <span
                                        style={{
                                          width: '24px',
                                          height: '24px',
                                          borderRadius: '50%',
                                          backgroundColor: '#52c41a',
                                          color: '#fff',
                                          fontSize: '11px',
                                          display: 'flex',
                                          alignItems: 'center',
                                          justifyContent: 'center',
                                          flexShrink: 0,
                                        }}
                                      >
                                        {member.name.charAt(0)}
                                      </span>
                                      <div>
                                        <div style={{ fontSize: '13px', color: '#333', fontWeight: 500 }}>
                                          {member.name}
                                        </div>
                                        <div style={{ fontSize: '11px', color: '#666' }}>
                                          {member.employeeId}
                                        </div>
                                      </div>
                                    </div>
                                    <div style={{ textAlign: 'right' }}>
                                      <div style={{ fontSize: '12px', color: '#666' }}>
                                        {member.role}
                                      </div>
                                      <div style={{ fontSize: '11px', color: '#999' }}>
                                        {member.department}
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </>
          ) : (
            <div
              style={{
                padding: '48px 24px',
                textAlign: 'center',
                color: '#999',
                fontSize: '14px',
              }}
            >
              请输入工号进行查询
            </div>
          )}
        </div>

        {/* 底部按钮 */}
        <div
          className="modal-footer"
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
              transition: 'all 0.3s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = '#1890ff';
              e.currentTarget.style.color = '#1890ff';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = '#d9d9d9';
              e.currentTarget.style.color = '#666';
            }}
          >
            取消
          </button>
          <button
            onClick={handleConfirm}
            disabled={selectedTeams.size === 0}
            style={{
              padding: '8px 24px',
              backgroundColor: selectedTeams.size === 0 ? '#d9d9d9' : '#1890ff',
              color: '#fff',
              border: 'none',
              borderRadius: '4px',
              fontSize: '14px',
              cursor: selectedTeams.size === 0 ? 'not-allowed' : 'pointer',
              transition: 'background-color 0.3s',
            }}
            onMouseEnter={(e) => {
              if (selectedTeams.size > 0) {
                e.currentTarget.style.backgroundColor = '#40a9ff';
              }
            }}
            onMouseLeave={(e) => {
              if (selectedTeams.size > 0) {
                e.currentTarget.style.backgroundColor = '#1890ff';
              }
            }}
          >
            确认添加
          </button>
        </div>
      </div>
    </div>
  );
};

export default TeamSearchModal;
