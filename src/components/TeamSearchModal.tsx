import React, { useState, useEffect, useMemo } from 'react';
import { Pagination } from './Pagination';
import type { Team } from './types';

/**
 * 员工信息
 */
export interface Employee {
  name: string;
  employeeId: string;
  department: string;
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
  existingTeams?: Team[];
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
  '00507777': { name: '王十二', employeeId: '00507777', department: '智能汽车解决方案部/智能驾驶组' },
  '00508888': { name: '冯十三', employeeId: '00508888', department: '云与计算业务部/云计算组' },
  '00509999': { name: '陈十四', employeeId: '00509999', department: 'IT平台服务部/平台开发部' },
  '00510000': { name: '褚十五', employeeId: '00510000', department: '质量与流程IT部/质量部/测试组' },
  '00511111': { name: '卫十六', employeeId: '00511111', department: '智能汽车解决方案部/智能座舱组' },
  '00512222': { name: '蒋十七', employeeId: '00512222', department: '云与计算业务部/大数据组' },
  '00513333': { name: '沈十八', employeeId: '00513333', department: 'IT平台服务部/平台运维部' },
  '00514444': { name: '韩十九', employeeId: '00514444', department: '质量与流程IT部/流程部/优化组' },
  '00515555': { name: '杨二十', employeeId: '00515555', department: '智能汽车解决方案部/智能驾驶组' },
  '00516666': { name: '朱二一', employeeId: '00516666', department: '云与计算业务部/云计算组' },
};

// 生成模拟团队成员
const generateMockMembers = (count: number, prefix: string): import('./types').TeamMember[] => {
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
    { id: 'team-001', name: '新员工OCC实践培训优秀团队', memberCount: 10, members: generateMockMembers(10, 'OCC培训') },
    { id: 'team-002', name: 'CIO值班优秀团队', memberCount: 8, members: generateMockMembers(8, 'CIO值班') },
    { id: 'team-003', name: 'OCC委员会和OCC运营大会组织优秀团队', memberCount: 12, members: generateMockMembers(12, 'OCC运营') },
    { id: 'team-005', name: '平台架构优化团队', memberCount: 15, members: generateMockMembers(15, '架构优化') },
    { id: 'team-016', name: '平台开发核心团队', memberCount: 15, members: generateMockMembers(15, '平台开发') },
    { id: 'team-017', name: '微服务架构改造团队', memberCount: 18, members: generateMockMembers(18, '微服务') },
    { id: 'team-018', name: '云原生技术推进团队', memberCount: 20, members: generateMockMembers(20, '云原生') },
    { id: 'team-019', name: 'DevOps工具链建设团队', memberCount: 12, members: generateMockMembers(12, 'DevOps工具') },
    { id: 'team-020', name: 'AI平台研发团队', memberCount: 25, members: generateMockMembers(25, 'AI平台') },
    { id: 'team-021', name: '数据中台建设团队', memberCount: 22, members: generateMockMembers(22, '数据中台') },
    { id: 'team-022', name: '智能运维研发团队', memberCount: 16, members: generateMockMembers(16, '智能运维') },
    { id: 'team-023', name: '安全合规建设团队', memberCount: 14, members: generateMockMembers(14, '安全合规') },
    { id: 'team-024', name: '用户体验优化团队', memberCount: 19, members: generateMockMembers(19, '用户体验') },
  ],
  '00501234': [
    { id: 'team-004', name: '质量改进优秀团队', memberCount: 15, members: generateMockMembers(15, '质量改进') },
    { id: 'team-005', name: '流程优化项目组', memberCount: 6, members: generateMockMembers(6, '流程优化') },
    { id: 'team-025', name: '测试自动化团队', memberCount: 18, members: generateMockMembers(18, '测试自动化') },
    { id: 'team-026', name: '持续集成建设团队', memberCount: 12, members: generateMockMembers(12, '持续集成') },
    { id: 'team-027', name: '代码质量分析团队', memberCount: 10, members: generateMockMembers(10, '代码质量') },
    { id: 'team-028', name: '缺陷预防研究团队', memberCount: 14, members: generateMockMembers(14, '缺陷预防') },
    { id: 'team-029', name: '敏捷教练团队', memberCount: 8, members: generateMockMembers(8, '敏捷教练') },
    { id: 'team-030', name: '效能度量分析团队', memberCount: 11, members: generateMockMembers(11, '效能度量') },
  ],
  '00505678': [
    { id: 'team-006', name: '智能汽车研发一组', memberCount: 20, members: generateMockMembers(20, '智能汽车') },
    { id: 'team-031', name: '自动驾驶算法团队', memberCount: 25, members: generateMockMembers(25, '自动驾驶') },
    { id: 'team-032', name: '车联网平台团队', memberCount: 18, members: generateMockMembers(18, '车联网') },
    { id: 'team-033', name: '智能座舱软件团队', memberCount: 22, members: generateMockMembers(22, '座舱软件') },
    { id: 'team-034', name: '车载芯片适配团队', memberCount: 15, members: generateMockMembers(15, '芯片适配') },
    { id: 'team-035', name: '车路协同研发团队', memberCount: 20, members: generateMockMembers(20, '车路协同') },
  ],
  '00507890': [
    { id: 'team-007', name: '云计算架构团队', memberCount: 18, members: generateMockMembers(18, '云计算') },
    { id: 'team-008', name: '容器化改造小组', memberCount: 12, members: generateMockMembers(12, '容器化') },
    { id: 'team-036', name: 'Serverless研发团队', memberCount: 16, members: generateMockMembers(16, 'Serverless') },
    { id: 'team-037', name: '边缘计算平台团队', memberCount: 20, members: generateMockMembers(20, '边缘计算') },
    { id: 'team-038', name: '云存储研发团队', memberCount: 14, members: generateMockMembers(14, '云存储') },
    { id: 'team-039', name: '云网络研发团队', memberCount: 18, members: generateMockMembers(18, '云网络') },
    { id: 'team-040', name: '云安全研发团队', memberCount: 15, members: generateMockMembers(15, '云安全') },
  ],
  '00501111': [
    { id: 'team-009', name: '平台运维保障团队', memberCount: 25, members: generateMockMembers(25, '运维保障') },
    { id: 'team-010', name: 'DevOps转型推进团队', memberCount: 20, members: generateMockMembers(20, 'DevOps') },
    { id: 'team-041', name: 'SRE体系建设团队', memberCount: 18, members: generateMockMembers(18, 'SRE') },
    { id: 'team-042', name: '监控告警平台团队', memberCount: 14, members: generateMockMembers(14, '监控告警') },
    { id: 'team-043', name: '故障演练平台团队', memberCount: 12, members: generateMockMembers(12, '故障演练') },
    { id: 'team-044', name: '容量规划团队', memberCount: 10, members: generateMockMembers(10, '容量规划') },
  ],
  '00502222': [
    { id: 'team-011', name: '流程自动化改造团队', memberCount: 16, members: generateMockMembers(16, '自动化') },
    { id: 'team-045', name: 'RPA实施团队', memberCount: 12, members: generateMockMembers(12, 'RPA') },
    { id: 'team-046', name: '低代码平台团队', memberCount: 18, members: generateMockMembers(18, '低代码') },
    { id: 'team-047', name: '流程挖掘分析团队', memberCount: 10, members: generateMockMembers(10, '流程挖掘') },
    { id: 'team-048', name: 'BPM平台研发团队', memberCount: 15, members: generateMockMembers(15, 'BPM') },
  ],
  '00503333': [
    { id: 'team-012', name: '智能座舱交互设计团队', memberCount: 14, members: generateMockMembers(14, '交互设计') },
    { id: 'team-049', name: 'HMI开发团队', memberCount: 20, members: generateMockMembers(20, 'HMI') },
    { id: 'team-050', name: '语音交互研发团队', memberCount: 18, members: generateMockMembers(18, '语音交互') },
    { id: 'team-051', name: '手势识别研发团队', memberCount: 12, members: generateMockMembers(12, '手势识别') },
    { id: 'team-052', name: 'AR-HUD研发团队', memberCount: 16, members: generateMockMembers(16, 'AR-HUD') },
  ],
  '00504444': [
    { id: 'team-013', name: '大数据分析平台团队', memberCount: 22, members: generateMockMembers(22, '大数据') },
    { id: 'team-053', name: '实时计算平台团队', memberCount: 18, members: generateMockMembers(18, '实时计算') },
    { id: 'team-054', name: '数据治理平台团队', memberCount: 15, members: generateMockMembers(15, '数据治理') },
    { id: 'team-055', name: '机器学习平台团队', memberCount: 20, members: generateMockMembers(20, '机器学习') },
    { id: 'team-056', name: '数据可视化团队', memberCount: 12, members: generateMockMembers(12, '数据可视化') },
  ],
  '00505555': [
    { id: 'team-014', name: '技术支持响应团队', memberCount: 30, members: generateMockMembers(30, '技术支持') },
    { id: 'team-057', name: '客户服务优化团队', memberCount: 22, members: generateMockMembers(22, '客户服务') },
    { id: 'team-058', name: '知识库建设团队', memberCount: 14, members: generateMockMembers(14, '知识库') },
    { id: 'team-059', name: '智能客服研发团队', memberCount: 18, members: generateMockMembers(18, '智能客服') },
    { id: 'team-060', name: '工单系统研发团队', memberCount: 16, members: generateMockMembers(16, '工单系统') },
  ],
  '00506666': [
    { id: 'team-015', name: '内部工具开发团队', memberCount: 10, members: generateMockMembers(10, '工具开发') },
    { id: 'team-061', name: '开发者平台团队', memberCount: 20, members: generateMockMembers(20, '开发者平台') },
    { id: 'team-062', name: 'API网关研发团队', memberCount: 15, members: generateMockMembers(15, 'API网关') },
    { id: 'team-063', name: '文档自动化团队', memberCount: 12, members: generateMockMembers(12, '文档自动化') },
    { id: 'team-064', name: '代码审查工具团队', memberCount: 14, members: generateMockMembers(14, '代码审查') },
  ],
};

/**
 * 模拟工号查询API
 */
const queryEmployeeById = async (employeeId: string): Promise<QueryResult | null> => {
  await new Promise(resolve => setTimeout(resolve, 500));

  const employee = mockEmployeeData[employeeId];
  const teams = mockTeamsData[employeeId];

  if (!employee || !teams) {
    return null;
  }

  return { employee, teams };
};

/**
 * 根据团队名称搜索团队
 */
const queryTeamsByName = async (searchTerm: string): Promise<QueryResult | null> => {
  await new Promise(resolve => setTimeout(resolve, 500));

  const allTeams: Team[] = [];
  Object.values(mockTeamsData).forEach(teams => {
    allTeams.push(...teams);
  });

  const matchedTeams = allTeams.filter(team =>
    team.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (matchedTeams.length === 0) {
    return null;
  }

  return {
    employee: {
      name: '搜索结果',
      employeeId: 'SEARCH',
      department: '搜索模式',
    },
    teams: matchedTeams,
  };
};

export const TeamSearchModal: React.FC<TeamSearchModalProps> = ({
  visible,
  existingTeams = [],
  onCancel,
  onConfirm,
}) => {
  const [employeeId, setEmployeeId] = useState('');
  const [queryResult, setQueryResult] = useState<QueryResult | null>(null);
  const [selectedTeams, setSelectedTeams] = useState<Set<string>>(new Set());
  const [expandedTeams, setExpandedTeams] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  useEffect(() => {
    if (!visible) {
      setEmployeeId('');
      setQueryResult(null);
      setSelectedTeams(new Set());
      setExpandedTeams(new Set());
      setError('');
      setLoading(false);
      setCurrentPage(1);
    }
  }, [visible]);

  const isExistingTeam = (teamId: string) => {
    return existingTeams.some(t => t.id === teamId);
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [queryResult]);

  const handleQuery = async () => {
    if (!employeeId.trim()) {
      setError('请输入工号或团队名称');
      return;
    }

    setLoading(true);
    setError('');
    setQueryResult(null);
    setSelectedTeams(new Set());

    try {
      const searchTerm = employeeId.trim();
      const isEmployeeId = /^\d+$/.test(searchTerm);

      let result: QueryResult | null = null;
      if (isEmployeeId) {
        result = await queryEmployeeById(searchTerm);
        if (!result) {
          setError('未找到该工号对应的员工信息');
        }
      } else {
        result = await queryTeamsByName(searchTerm);
        if (!result) {
          setError('未找到匹配的团队奖');
        }
      }

      if (result) {
        setQueryResult(result);
      }
    } catch (err) {
      setError('查询失败，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  const toggleTeamSelection = (teamId: string) => {
    const newSelected = new Set(selectedTeams);
    if (newSelected.has(teamId)) {
      newSelected.delete(teamId);
    } else {
      newSelected.add(teamId);
    }
    setSelectedTeams(newSelected);
  };

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

  const handleConfirm = () => {
    if (!queryResult) return;
    const selectedList = queryResult.teams.filter(team => selectedTeams.has(team.id));
    onConfirm(selectedList);
  };

  const paginatedTeams = useMemo(() => {
    if (!queryResult) return [];
    const startIndex = (currentPage - 1) * pageSize;
    return queryResult.teams.slice(startIndex, startIndex + pageSize);
  }, [queryResult, currentPage]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleQuery();
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
          width: '600px',
          maxHeight: '80vh',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
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
          <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 500, color: '#333' }}>
            添加团队奖
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

        <div style={{ padding: '20px 24px', borderBottom: '1px solid #f0f0f0' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <input
              type="text"
              placeholder="请输入工号/团队名称"
              value={employeeId}
              onChange={(e) => setEmployeeId(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={loading}
              style={{
                flex: 1,
                padding: '8px 12px',
                border: '1px solid #d9d9d9',
                borderRadius: '4px',
                fontSize: '14px',
                outline: 'none',
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
              }}
            >
              {loading ? '查询中...' : '查询'}
            </button>
          </div>

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

        <div
          style={{
            flex: 1,
            overflow: 'auto',
            padding: '20px 24px',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {queryResult ? (
            <>
              {queryResult.employee.employeeId !== 'SEARCH' && (
                <div style={{ marginBottom: '20px', flexShrink: 0 }}>
                  <h4 style={{ margin: '0 0 12px 0', fontSize: '14px', fontWeight: 500, color: '#333' }}>
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
                    <span style={{ fontSize: '14px', color: '#333' }}>
                      员工: {queryResult.employee.name} ({queryResult.employee.employeeId}) - {queryResult.employee.department}
                    </span>
                  </div>
                </div>
              )}

              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
                <h4 style={{ margin: '0 0 12px 0', fontSize: '14px', fontWeight: 500, color: '#333', flexShrink: 0 }}>
                  {queryResult.employee.employeeId === 'SEARCH' ? '搜索结果:' : '所属团队奖:'}
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', flex: 1, overflow: 'auto', minHeight: 0 }}>
                  {paginatedTeams.map((team) => {
                    const isSelected = selectedTeams.has(team.id);
                    const isExpanded = expandedTeams.has(team.id);
                    const existing = isExistingTeam(team.id);
                    return (
                      <div
                        key={team.id}
                        style={{
                          backgroundColor: existing ? '#fff7e6' : (isSelected ? '#e6f7ff' : '#f5f5f5'),
                          border: `1px solid ${existing ? '#ffd591' : (isSelected ? '#1890ff' : '#d9d9d9')}`,
                          borderRadius: '6px',
                          overflow: 'hidden',
                          opacity: existing ? 0.8 : 1,
                        }}
                      >
                        <div
                          onClick={() => !existing && toggleTeamSelection(team.id)}
                          style={{
                            display: 'flex',
                            alignItems: 'flex-start',
                            gap: '12px',
                            padding: '16px',
                            cursor: existing ? 'not-allowed' : 'pointer',
                          }}
                        >
                          <div
                            style={{
                              width: '18px',
                              height: '18px',
                              borderRadius: '50%',
                              border: `2px solid ${existing ? '#d9d9d9' : (isSelected ? '#1890ff' : '#d9d9d9')}`,
                              backgroundColor: existing ? '#f5f5f5' : (isSelected ? '#1890ff' : '#fff'),
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              flexShrink: 0,
                              marginTop: '2px',
                            }}
                          >
                            {!existing && isSelected && <span style={{ color: '#fff', fontSize: '12px' }}>✓</span>}
                          </div>

                          <div style={{ flex: 1 }}>
                            <div style={{ fontSize: '14px', fontWeight: 500, color: '#333', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                              {team.name}
                              {existing && (
                                <span style={{ padding: '2px 6px', backgroundColor: '#fa8c16', color: '#fff', fontSize: '11px', borderRadius: '3px' }}>
                                  已存在
                                </span>
                              )}
                            </div>
                            <div style={{ fontSize: '13px', color: '#666' }}>
                              <div>团队成员: {team.memberCount}人</div>
                            </div>
                          </div>

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
                            }}
                          >
                            <span style={{ transform: isExpanded ? 'rotate(90deg)' : 'rotate(0deg)', transition: 'transform 0.3s' }}>›</span>
                          </div>
                        </div>

                        {isExpanded && team.members && team.members.length > 0 && (
                          <div style={{ padding: '0 16px 16px 16px', backgroundColor: isSelected ? '#e6f7ff' : '#f5f5f5' }}>
                            <div style={{ padding: '12px', backgroundColor: '#fff', borderRadius: '4px', border: `1px solid ${isSelected ? '#91d5ff' : '#e8e8e8'}` }}>
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
                                      <span style={{ width: '24px', height: '24px', borderRadius: '50%', backgroundColor: '#52c41a', color: '#fff', fontSize: '11px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        {member.name.charAt(0)}
                                      </span>
                                      <div>
                                        <div style={{ fontSize: '13px', color: '#333', fontWeight: 500 }}>{member.name}</div>
                                        <div style={{ fontSize: '11px', color: '#666' }}>{member.employeeId}</div>
                                      </div>
                                    </div>
                                    <div style={{ textAlign: 'right' }}>
                                      <div style={{ fontSize: '12px', color: '#666' }}>{member.role}</div>
                                      <div style={{ fontSize: '11px', color: '#999' }}>{member.department}</div>
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

                {queryResult.teams.length > 0 && (
                  <div style={{ padding: '12px 0 0 0', borderTop: '1px solid #f0f0f0', flexShrink: 0, marginTop: 'auto' }}>
                    <Pagination
                      current={currentPage}
                      pageSize={pageSize}
                      total={queryResult.teams.length}
                      onChange={setCurrentPage}
                    />
                  </div>
                )}
              </div>
            </>
          ) : (
            <div style={{ padding: '48px 24px', textAlign: 'center', color: '#999', fontSize: '14px' }}>
              请输入工号/团队名称进行查询
            </div>
          )}
        </div>

        <div style={{ padding: '16px 24px', borderTop: '1px solid #f0f0f0', display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
          <button
            onClick={onCancel}
            style={{ padding: '8px 24px', backgroundColor: '#fff', color: '#666', border: '1px solid #d9d9d9', borderRadius: '4px', fontSize: '14px', cursor: 'pointer' }}
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
