import React, { useState, useMemo } from 'react';
import {
  AwardCard,
  DataRangeFilter,
  AddRecipientModal,
  TeamSearchModal,
  AddAwardModal,
} from './components';
import { Award } from './components/types';

// 模拟奖项数据
const mockAwards: Award[] = [
  {
    id: '2',
    title: '2025年明日之星',
    issuingDepartment: '华为公司',
    awardType: 'individual',
    recipients: [
      { name: '张三', employeeId: '00501234', department: '质量与流程IT部/质量部/测试组' },
      { name: '李四', employeeId: '00505678', department: '智能汽车解决方案部/智能驾驶组' },
    ],
  },
  {
    id: '3',
    title: '2025年OCC委员会2025年4月激励奖项',
    issuingDepartment: '质量与流程IT质量与运营部',
    awardType: 'team',
    recipients: [],
    teams: [
      {
        id: 'team-1',
        name: '新员工OCC实践培训优秀团队',
        leaderName: '赵六',
        leaderId: '00501111',
        memberCount: 10,
        members: [
          { name: '李山花', employeeId: '00494097', department: 'IT平台服务部/平台开发部', role: '组长' },
          { name: '张三', employeeId: '00501234', department: '质量与流程IT部/质量部/测试组' },
          { name: '李四', employeeId: '00505678', department: '智能汽车解决方案部/智能驾驶组' },
          { name: '王五', employeeId: '00507890', department: '云与计算业务部/云计算组' },
          { name: '赵六', employeeId: '00501111', department: 'IT平台服务部/平台运维部' },
          { name: '钱七', employeeId: '00502222', department: '质量与流程IT部/质量部/测试组' },
          { name: '孙八', employeeId: '00503333', department: '智能汽车解决方案部/智能驾驶组' },
          { name: '周九', employeeId: '00504444', department: '云与计算业务部/云计算组' },
          { name: '吴十', employeeId: '00505555', department: 'IT平台服务部/平台开发部' },
          { name: '郑十一', employeeId: '00506666', department: '质量与流程IT部/质量部/测试组' },
        ],
      },
      {
        id: 'team-2',
        name: 'CIO值班优秀团队',
        leaderName: '钱七',
        leaderId: '00502222',
        memberCount: 8,
        members: [
          { name: '王五', employeeId: '00507890', department: '云与计算业务部/云计算组', role: '值班长' },
          { name: '赵六', employeeId: '00501111', department: 'IT平台服务部/平台运维部' },
          { name: '钱七', employeeId: '00502222', department: '质量与流程IT部/质量部/测试组' },
          { name: '孙八', employeeId: '00503333', department: '智能汽车解决方案部/智能驾驶组' },
          { name: '周九', employeeId: '00504444', department: '云与计算业务部/云计算组' },
          { name: '吴十', employeeId: '00505555', department: 'IT平台服务部/平台开发部' },
          { name: '郑十一', employeeId: '00506666', department: '质量与流程IT部/质量部/测试组' },
          { name: '王十二', employeeId: '00507777', department: '智能汽车解决方案部/智能驾驶组' },
        ],
      },
      {
        id: 'team-3',
        name: 'OCC委员会和OCC运营大会组织优秀团队',
        leaderName: '孙八',
        leaderId: '00503333',
        memberCount: 12,
        members: [
          { name: '李山花', employeeId: '00494097', department: 'IT平台服务部/平台开发部' },
          { name: '张三', employeeId: '00501234', department: '质量与流程IT部/质量部/测试组' },
          { name: '李四', employeeId: '00505678', department: '智能汽车解决方案部/智能驾驶组' },
          { name: '王五', employeeId: '00507890', department: '云与计算业务部/云计算组' },
          { name: '赵六', employeeId: '00501111', department: 'IT平台服务部/平台运维部' },
          { name: '钱七', employeeId: '00502222', department: '质量与流程IT部/质量部/测试组' },
          { name: '孙八', employeeId: '00503333', department: '智能汽车解决方案部/智能驾驶组' },
          { name: '周九', employeeId: '00504444', department: '云与计算业务部/云计算组' },
          { name: '吴十', employeeId: '00505555', department: 'IT平台服务部/平台开发部' },
          { name: '郑十一', employeeId: '00506666', department: '质量与流程IT部/质量部/测试组' },
          { name: '王十二', employeeId: '00507777', department: '智能汽车解决方案部/智能驾驶组' },
          { name: '冯十三', employeeId: '00508888', department: '云与计算业务部/云计算组' },
        ],
      },
      {
        id: 'team-4',
        name: 'OCC模式复制构建及推广优秀团队',
        leaderName: '周九',
        leaderId: '00504444',
        memberCount: 6,
        members: [
          { name: '李山花', employeeId: '00494097', department: 'IT平台服务部/平台开发部' },
          { name: '张三', employeeId: '00501234', department: '质量与流程IT部/质量部/测试组' },
          { name: '李四', employeeId: '00505678', department: '智能汽车解决方案部/智能驾驶组' },
          { name: '王五', employeeId: '00507890', department: '云与计算业务部/云计算组' },
          { name: '赵六', employeeId: '00501111', department: 'IT平台服务部/平台运维部' },
          { name: '钱七', employeeId: '00502222', department: '质量与流程IT部/质量部/测试组' },
        ],
      },
    ],
  },
  {
    id: '4',
    title: '2025年Q1优秀团队奖',
    issuingDepartment: 'IT平台服务部',
    awardType: 'team',
    recipients: [],
    teams: [
      {
        id: 'team-5',
        name: '平台架构优化团队',
        leaderName: '李山花',
        leaderId: '00494097',
        memberCount: 15,
        members: [
          { name: '李山花', employeeId: '00494097', department: 'IT平台服务部/平台开发部', role: '架构师' },
          { name: '张三', employeeId: '00501234', department: '质量与流程IT部/质量部/测试组' },
          { name: '李四', employeeId: '00505678', department: '智能汽车解决方案部/智能驾驶组' },
          { name: '王五', employeeId: '00507890', department: '云与计算业务部/云计算组' },
          { name: '赵六', employeeId: '00501111', department: 'IT平台服务部/平台运维部' },
          { name: '钱七', employeeId: '00502222', department: '质量与流程IT部/质量部/测试组' },
          { name: '孙八', employeeId: '00503333', department: '智能汽车解决方案部/智能驾驶组' },
          { name: '周九', employeeId: '00504444', department: '云与计算业务部/云计算组' },
          { name: '吴十', employeeId: '00505555', department: 'IT平台服务部/平台开发部' },
          { name: '郑十一', employeeId: '00506666', department: '质量与流程IT部/质量部/测试组' },
          { name: '王十二', employeeId: '00507777', department: '智能汽车解决方案部/智能驾驶组' },
          { name: '冯十三', employeeId: '00508888', department: '云与计算业务部/云计算组' },
          { name: '陈十四', employeeId: '00509999', department: 'IT平台服务部/平台开发部' },
          { name: '褚十五', employeeId: '00510000', department: '质量与流程IT部/质量部/测试组' },
          { name: '卫十六', employeeId: '00511111', department: '智能汽车解决方案部/智能驾驶组' },
        ],
      },
      {
        id: 'team-6',
        name: 'DevOps转型推进团队',
        leaderName: '赵六',
        leaderId: '00501111',
        memberCount: 20,
        members: [
          { name: '李山花', employeeId: '00494097', department: 'IT平台服务部/平台开发部' },
          { name: '张三', employeeId: '00501234', department: '质量与流程IT部/质量部/测试组' },
          { name: '李四', employeeId: '00505678', department: '智能汽车解决方案部/智能驾驶组' },
          { name: '王五', employeeId: '00507890', department: '云与计算业务部/云计算组' },
          { name: '赵六', employeeId: '00501111', department: 'IT平台服务部/平台运维部', role: '负责人' },
          { name: '钱七', employeeId: '00502222', department: '质量与流程IT部/质量部/测试组' },
          { name: '孙八', employeeId: '00503333', department: '智能汽车解决方案部/智能驾驶组' },
          { name: '周九', employeeId: '00504444', department: '云与计算业务部/云计算组' },
          { name: '吴十', employeeId: '00505555', department: 'IT平台服务部/平台开发部' },
          { name: '郑十一', employeeId: '00506666', department: '质量与流程IT部/质量部/测试组' },
          { name: '王十二', employeeId: '00507777', department: '智能汽车解决方案部/智能驾驶组' },
          { name: '冯十三', employeeId: '00508888', department: '云与计算业务部/云计算组' },
          { name: '陈十四', employeeId: '00509999', department: 'IT平台服务部/平台开发部' },
          { name: '褚十五', employeeId: '00510000', department: '质量与流程IT部/质量部/测试组' },
          { name: '卫十六', employeeId: '00511111', department: '智能汽车解决方案部/智能驾驶组' },
          { name: '蒋十七', employeeId: '00512222', department: '云与计算业务部/云计算组' },
          { name: '沈十八', employeeId: '00513333', department: 'IT平台服务部/平台开发部' },
          { name: '韩十九', employeeId: '00514444', department: '质量与流程IT部/质量部/测试组' },
          { name: '杨二十', employeeId: '00515555', department: '智能汽车解决方案部/智能驾驶组' },
          { name: '朱二一', employeeId: '00516666', department: '云与计算业务部/云计算组' },
        ],
      },
    ],
  },
  {
    id: '5',
    title: '2025年流程IT持续改进团队及时激励奖',
    issuingDepartment: '质量与流程IT部',
    awardType: 'team',
    recipients: [],
    teams: [
      {
        id: 'team-7',
        name: '流程自动化改造团队',
        leaderName: '钱七',
        leaderId: '00502222',
        memberCount: 16,
        members: [
          { name: '李山花', employeeId: '00494097', department: 'IT平台服务部/平台开发部' },
          { name: '张三', employeeId: '00501234', department: '质量与流程IT部/质量部/测试组' },
          { name: '李四', employeeId: '00505678', department: '智能汽车解决方案部/智能驾驶组' },
          { name: '王五', employeeId: '00507890', department: '云与计算业务部/云计算组' },
          { name: '赵六', employeeId: '00501111', department: 'IT平台服务部/平台运维部' },
          { name: '钱七', employeeId: '00502222', department: '质量与流程IT部/质量部/测试组', role: '负责人' },
          { name: '孙八', employeeId: '00503333', department: '智能汽车解决方案部/智能驾驶组' },
          { name: '周九', employeeId: '00504444', department: '云与计算业务部/云计算组' },
          { name: '吴十', employeeId: '00505555', department: 'IT平台服务部/平台开发部' },
          { name: '郑十一', employeeId: '00506666', department: '质量与流程IT部/质量部/测试组' },
          { name: '王十二', employeeId: '00507777', department: '智能汽车解决方案部/智能驾驶组' },
          { name: '冯十三', employeeId: '00508888', department: '云与计算业务部/云计算组' },
          { name: '陈十四', employeeId: '00509999', department: 'IT平台服务部/平台开发部' },
          { name: '褚十五', employeeId: '00510000', department: '质量与流程IT部/质量部/测试组' },
          { name: '卫十六', employeeId: '00511111', department: '智能汽车解决方案部/智能驾驶组' },
          { name: '蒋十七', employeeId: '00512222', department: '云与计算业务部/云计算组' },
        ],
      },
    ],
  },
];

// 步骤定义
const steps = [
  { num: 1, label: '选择展播数据' },
  { num: 2, label: '制作展播' },
  { num: 3, label: '生成展播' },
];

function App() {
  const [currentStep, setCurrentStep] = useState(0);
  const [awards, setAwards] = useState<Award[]>(mockAwards);

  // 弹窗状态
  const [addRecipientModalVisible, setAddRecipientModalVisible] = useState(false);
  const [teamSearchModalVisible, setTeamSearchModalVisible] = useState(false);
  const [addAwardModalVisible, setAddAwardModalVisible] = useState(false);
  const [currentAwardId, setCurrentAwardId] = useState<string>('');

  // 当前用户部门
  const currentUserDepartment = 'IT平台服务部';

  // 当前用户有权限查看的部门列表
  const accessibleDepartments = [
    '全部部门',
    'IT平台服务部',
    '质量与流程IT部',
    '智能汽车解决方案部',
    '云与计算业务部',
    '华为公司',
  ];

  // 当前选中的部门（默认全部部门）
  const [selectedDepartment, setSelectedDepartment] = useState<string>('全部部门');

  // 根据选中的部门筛选奖项
  const filteredAwards = useMemo(() => {
    if (selectedDepartment === '全部部门') {
      return awards;
    }
    return awards.filter((award) => award.issuingDepartment === selectedDepartment);
  }, [awards, selectedDepartment]);

  // 处理部门切换
  const handleDepartmentChange = (dept: string) => {
    setSelectedDepartment(dept);
  };

  // 处理添加获奖人
  const handleAddRecipient = (awardId: string) => {
    setCurrentAwardId(awardId);
    setAddRecipientModalVisible(true);
  };

  // 处理移除获奖人
  const handleRemoveRecipient = (awardId: string, recipientToRemove: any) => {
    setAwards((prev) =>
      prev.map((award) =>
        award.id === awardId
          ? {
              ...award,
              recipients: award.recipients.filter(
                (r) => r.employeeId !== recipientToRemove.employeeId
              ),
            }
          : award
      )
    );
  };

  // 处理添加团队
  const handleAddTeam = (awardId: string) => {
    setCurrentAwardId(awardId);
    setTeamSearchModalVisible(true);
  };

  // 处理移除团队
  const handleRemoveTeam = (awardId: string, teamToRemove: any) => {
    setAwards((prev) =>
      prev.map((award) =>
        award.id === awardId
          ? {
              ...award,
              teams: award.teams?.filter((t) => t.id !== teamToRemove.id) || [],
            }
          : award
      )
    );
  };

  // 处理更新团队（成员变更后同步）
  const handleUpdateTeam = (awardId: string, updatedTeam: any) => {
    setAwards((prev) =>
      prev.map((award) =>
        award.id === awardId
          ? {
              ...award,
              teams: award.teams?.map((t) =>
                t.id === updatedTeam.id ? updatedTeam : t
              ) || [],
            }
          : award
      )
    );
  };

  // 处理删除整个奖项
  const handleRemoveAward = (awardId: string) => {
    setAwards((prev) => prev.filter((award) => award.id !== awardId));
  };

  // 处理添加奖项
  const handleAddAward = (selectedAwards: any[]) => {
    setAwards((prev) => {
      // 1. 保留默认数据（deletable=false）
      const defaultAwards = prev.filter((award) => !award.deletable);

      // 2. 创建新选中的奖项
      const newAwards: Award[] = selectedAwards.map((item) => ({
        id: String(Date.now() + Math.random()),
        title: item.name,
        issuingDepartment: item.issuingDepartment,
        awardType: item.category === '团队奖' ? 'team' : 'individual',
        recipients: [],
        teams: item.category === '团队奖' ? [] : undefined,
        selected: false,
        deletable: true, // 通过弹框添加的奖项可删除
      }));

      // 3. 合并：默认数据 + 新选中的奖项
      return [...defaultAwards, ...newAwards];
    });
    setAddAwardModalVisible(false);
  };

  // 处理确认添加获奖人
  const handleConfirmAddRecipient = (recipients: any[]) => {
    setAwards((prev) =>
      prev.map((award) =>
        award.id === currentAwardId
          ? {
              ...award,
              recipients: [...award.recipients, ...recipients],
            }
          : award
      )
    );
    setAddRecipientModalVisible(false);
  };

  // 处理确认添加团队
  const handleConfirmAddTeam = (teams: any[]) => {
    setAwards((prev) =>
      prev.map((award) =>
        award.id === currentAwardId
          ? {
              ...award,
              teams: [...(award.teams || []), ...teams],
            }
          : award
      )
    );
    setTeamSearchModalVisible(false);
  };

  // 处理奖项选中/取消选中
  const handleToggleAwardSelection = (awardId: string) => {
    setAwards((prev) =>
      prev.map((award) =>
        award.id === awardId ? { ...award, selected: !award.selected } : award
      )
    );
  };

  // 获取已选中的奖项数量
  const selectedAwardsCount = useMemo(() => {
    return awards.filter((award) => award.selected).length;
  }, [awards]);

  return (
    <div
      className="app"
      style={{
        minHeight: '100vh',
        backgroundColor: '#f5f5f5',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
      }}
    >
      {/* 顶部导航 */}
      <header
        style={{
          backgroundColor: '#1a1a2e',
          padding: '16px 24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <h1
          style={{
            margin: 0,
            fontSize: '18px',
            fontWeight: 600,
            color: '#fff',
          }}
        >
          获奖海报生成系统
        </h1>
        <div style={{ fontSize: '14px', color: '#a0aec0' }}>
          当前用户: 李山花 (IT平台服务部)
        </div>
      </header>

      {/* 步骤条 */}
      <div
        style={{
          backgroundColor: '#fff',
          padding: '24px',
          borderBottom: '1px solid #e2e8f0',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            maxWidth: '600px',
            margin: '0 auto',
          }}
        >
          {steps.map((step, index) => (
            <React.Fragment key={step.num}>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '8px',
                }}
              >
                <div
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    backgroundColor:
                      index <= currentStep ? '#1890ff' : '#f1f5f9',
                    color: index <= currentStep ? '#fff' : '#94a3b8',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '14px',
                    fontWeight: 600,
                  }}
                >
                  {step.num}
                </div>
                <span
                  style={{
                    fontSize: '14px',
                    color: index <= currentStep ? '#1890ff' : '#94a3b8',
                    fontWeight: index === currentStep ? 500 : 400,
                  }}
                >
                  {step.label}
                </span>
              </div>
              {index < steps.length - 1 && (
                <div
                  style={{
                    width: '120px',
                    height: '2px',
                    backgroundColor:
                      index < currentStep ? '#1890ff' : '#f1f5f9',
                    margin: '0 16px',
                    marginBottom: '24px',
                  }}
                />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* 主内容区 */}
      <main style={{ padding: '24px 24px 80px 24px', maxWidth: '1200px', margin: '0 auto' }}>
        {currentStep === 0 && (
          <>
            {/* 数据范围筛选和操作按钮 */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '24px',
              }}
            >
              <DataRangeFilter
                value={selectedDepartment}
                onChange={handleDepartmentChange}
                accessibleDepartments={accessibleDepartments}
                currentUserDepartment={currentUserDepartment}
              />
              <button
                onClick={() => setAddAwardModalVisible(true)}
                style={{
                  padding: '8px 16px',
                  backgroundColor: '#1890ff',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                }}
              >
                <span>+</span>
                <span>添加展播奖项</span>
              </button>
            </div>

            {/* 提示文本 */}
            <div
              style={{
                marginBottom: '16px',
                padding: '12px 16px',
                backgroundColor: '#e6f7ff',
                border: '1px solid #91d5ff',
                borderRadius: '6px',
                fontSize: '14px',
                color: '#1890ff',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <span style={{ fontSize: '16px' }}>💡</span>
              <span>已为您筛选出近期获奖数据，请您从中挑选用于展播的奖项。</span>
            </div>

            {/* 奖项列表 - 空状态 */}
            {filteredAwards.length === 0 ? (
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '80px 24px',
                  backgroundColor: '#fff',
                  borderRadius: '8px',
                  boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
                }}
              >
                <div style={{ fontSize: '64px', marginBottom: '16px' }}>🏆</div>
                <h3 style={{ margin: '0 0 8px 0', color: '#1a1a2e', fontSize: '16px' }}>
                  暂无符合条件的奖项
                </h3>
                <p style={{ margin: 0, color: '#6b7280', fontSize: '14px' }}>
                  该部门下暂时没有获奖数据，您可以切换部门查看或添加新的奖项
                </p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {filteredAwards.map((award) => (
                  <AwardCard
                    key={award.id}
                    award={award}
                    selected={award.selected || false}
                    onToggleSelection={() => handleToggleAwardSelection(award.id)}
                    onAddRecipient={
                      award.awardType === 'individual'
                        ? () => handleAddRecipient(award.id)
                        : undefined
                    }
                    onRemoveRecipient={
                      award.awardType === 'individual'
                        ? (recipient) => handleRemoveRecipient(award.id, recipient)
                        : undefined
                    }
                    onAddTeam={
                      award.awardType === 'team'
                        ? () => handleAddTeam(award.id)
                        : undefined
                    }
                    onRemoveTeam={
                      award.awardType === 'team'
                        ? (team) => handleRemoveTeam(award.id, team)
                        : undefined
                    }
                    onUpdateTeam={
                      award.awardType === 'team'
                        ? (team) => handleUpdateTeam(award.id, team)
                        : undefined
                    }
                    onRemoveAward={() => handleRemoveAward(award.id)}
                  />
                ))}
              </div>
            )}
          </>
        )}

        {currentStep === 1 && (
          <div
            style={{
              backgroundColor: '#fff',
              borderRadius: '8px',
              padding: '48px',
              textAlign: 'center',
              color: '#6b7280',
            }}
          >
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>🎨</div>
            <h2 style={{ margin: '0 0 8px 0', color: '#1a1a2e' }}>制作展播</h2>
            <p>请先在第一步选择展播数据</p>
          </div>
        )}

        {currentStep === 2 && (
          <div
            style={{
              backgroundColor: '#fff',
              borderRadius: '8px',
              padding: '48px',
              textAlign: 'center',
              color: '#6b7280',
            }}
          >
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>📄</div>
            <h2 style={{ margin: '0 0 8px 0', color: '#1a1a2e' }}>生成展播</h2>
            <p>请先在第二步制作展播</p>
          </div>
        )}
      </main>

      {/* 底部操作栏 */}
      <div
        style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          backgroundColor: '#fff',
          borderTop: '1px solid #e2e8f0',
          padding: '16px 24px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '16px',
        }}
      >
        {currentStep === 0 && (
          <span style={{ fontSize: '14px', color: '#6b7280', marginRight: '16px' }}>
            已选 {selectedAwardsCount} 个奖项
          </span>
        )}
        {currentStep > 0 && (
          <button
            onClick={() => setCurrentStep(currentStep - 1)}
            style={{
              padding: '8px 24px',
              backgroundColor: '#fff',
              color: '#1a1a2e',
              border: '1px solid #e2e8f0',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '14px',
            }}
          >
            上一步
          </button>
        )}
        {currentStep < steps.length - 1 && (
          <button
            onClick={() => setCurrentStep(currentStep + 1)}
            disabled={currentStep === 0 && selectedAwardsCount === 0}
            style={{
              padding: '8px 24px',
              backgroundColor: currentStep === 0 && selectedAwardsCount === 0 ? '#e2e8f0' : '#1890ff',
              color: '#fff',
              border: 'none',
              borderRadius: '4px',
              cursor: currentStep === 0 && selectedAwardsCount === 0 ? 'not-allowed' : 'pointer',
              fontSize: '14px',
            }}
          >
            下一步
          </button>
        )}
        {currentStep === steps.length - 1 && (
          <button
            style={{
              padding: '8px 24px',
              backgroundColor: '#16a34a',
              color: '#fff',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '14px',
            }}
          >
            生成展播
          </button>
        )}
      </div>

      {/* 弹窗 */}
      <AddRecipientModal
        visible={addRecipientModalVisible}
        currentDepartment={currentUserDepartment}
        onCancel={() => setAddRecipientModalVisible(false)}
        onConfirm={handleConfirmAddRecipient}
      />

      <TeamSearchModal
        visible={teamSearchModalVisible}
        onCancel={() => setTeamSearchModalVisible(false)}
        onConfirm={handleConfirmAddTeam}
      />

      <AddAwardModal
        visible={addAwardModalVisible}
        onCancel={() => setAddAwardModalVisible(false)}
        onConfirm={handleAddAward}
        existingAwards={awards}
      />
    </div>
  );
}

export default App;
