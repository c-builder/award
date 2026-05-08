import React, { useState, useMemo } from 'react';
import {
  DataRangeFilter,
  DataRangeOption,
  AwardCard,
  AddRecipientModal,
  TeamSearchModal,
  AddAwardModal,
  Award,
  Recipient,
  Team,
} from './components';

// 模拟奖项数据 - 包含个人奖和团队奖
const mockAwards: Award[] = [
  {
    id: '1',
    title: '2025年半年度优秀个人奖',
    issuingDepartment: 'IT平台服务部',
    awardType: 'individual',
    recipients: [
      { name: '李山花', employeeId: '00494097', department: 'IT平台服务部/平台开发部' },
      { name: '张三', employeeId: '00501234', department: '质量与流程IT部/质量部/测试组' },
      { name: '李四', employeeId: '00505678', department: '智能汽车解决方案部/智能驾驶组' },
      { name: '王五', employeeId: '00507890', department: '云与计算业务部/云计算组' },
      { name: '赵六', employeeId: '00501111', department: 'IT平台服务部/平台运维部' },
      { name: '钱七', employeeId: '00502222', department: '质量与流程IT部/流程部/优化组' },
    ],
  },
  {
    id: '2',
    title: '2025年明日之星',
    issuingDepartment: '华为公司',
    awardType: 'individual',
    recipients: [],
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
        ],
      },
      {
        id: 'team-3',
        name: 'OCC委员会和OCC运营大会组织优秀团队',
        leaderName: '孙八',
        leaderId: '00503333',
        memberCount: 12,
      },
      {
        id: 'team-4',
        name: 'OCC模式复制构建及推广优秀团队',
        leaderName: '周九',
        leaderId: '00504444',
        memberCount: 6,
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
      },
      {
        id: 'team-6',
        name: 'DevOps转型推进团队',
        leaderName: '赵六',
        leaderId: '00501111',
        memberCount: 20,
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
  const [dataRange, setDataRange] = useState<DataRangeOption>('all');
  const [awards, setAwards] = useState<Award[]>(mockAwards);
  
  // 弹窗状态
  const [addRecipientModalVisible, setAddRecipientModalVisible] = useState(false);
  const [teamSearchModalVisible, setTeamSearchModalVisible] = useState(false);
  const [addAwardModalVisible, setAddAwardModalVisible] = useState(false);
  const [currentAwardId, setCurrentAwardId] = useState<string>('');

  // 当前用户部门
  const currentUserDepartment = 'IT平台服务部';
  const currentUserDepartmentPath = ['IT平台服务部'];

  // 指定部门筛选
  const [specificDepartmentPath, setSpecificDepartmentPath] = useState<string[]>([]);

  // 根据数据范围筛选奖项
  const filteredAwards = useMemo(() => {
    if (dataRange === 'all') {
      return awards;
    }
    if (dataRange === 'my') {
      return awards.filter(
        (award) => award.issuingDepartment === currentUserDepartment
      );
    }
    if (dataRange === 'specific' && specificDepartmentPath.length > 0) {
      return awards.filter(
        (award) => {
          const awardDeptParts = award.issuingDepartment.split('/');
          return specificDepartmentPath.every((dept, index) => 
            awardDeptParts[index] === dept
          );
        }
      );
    }
    return awards;
  }, [awards, dataRange, specificDepartmentPath, currentUserDepartment]);

  // 处理数据范围变化
  const handleDataRangeChange = (range: DataRangeOption, _specificDept?: string, specificDeptPath?: string[]) => {
    setDataRange(range);
    if (range === 'specific' && specificDeptPath) {
      setSpecificDepartmentPath(specificDeptPath);
    }
  };

  // 处理添加获奖人
  const handleAddRecipient = (awardId: string) => {
    setCurrentAwardId(awardId);
    setAddRecipientModalVisible(true);
  };

  // 确认添加获奖人
  const handleConfirmAddRecipients = (selectedRecipients: Recipient[]) => {
    setAwards((prev) =>
      prev.map((award) =>
        award.id === currentAwardId
          ? { ...award, recipients: [...award.recipients, ...selectedRecipients] }
          : award
      )
    );
    setAddRecipientModalVisible(false);
  };

  // 处理移除获奖人
  const handleRemoveRecipient = (awardId: string, recipient: Recipient) => {
    setAwards((prev) =>
      prev.map((award) =>
        award.id === awardId
          ? {
              ...award,
              recipients: award.recipients.filter(
                (r) => r.employeeId !== recipient.employeeId
              ),
            }
          : award
      )
    );
  };

  // 处理团队查询
  const handleTeamSearch = (awardId: string) => {
    setCurrentAwardId(awardId);
    setTeamSearchModalVisible(true);
  };

  // 确认添加团队
  const handleConfirmAddTeams = (selectedTeams: Team[]) => {
    setAwards((prev) =>
      prev.map((award) =>
        award.id === currentAwardId
          ? { ...award, teams: [...(award.teams || []), ...selectedTeams] }
          : award
      )
    );
    setTeamSearchModalVisible(false);
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: '#f5f7fa',
        padding: '24px 40px',
      }}
    >
      {/* 页面标题 */}
      <h1
        style={{
          fontSize: '24px',
          fontWeight: 600,
          color: '#333',
          marginBottom: '24px',
        }}
      >
        部门荣誉展播
      </h1>

      {/* 步骤指示器 */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '16px',
          marginBottom: '32px',
        }}
      >
        {steps.map((step, index) => (
          <React.Fragment key={step.num}>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                padding: '12px 48px',
                backgroundColor: index === currentStep ? '#1e3a5f' : '#fff',
                borderRadius: '24px',
                cursor: index < currentStep ? 'pointer' : 'default',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
              }}
              onClick={() => index < currentStep && setCurrentStep(index)}
            >
              <span
                style={{
                  fontSize: '11px',
                  color: index === currentStep ? '#fff' : '#999',
                  marginBottom: '2px',
                }}
              >
                STEP{step.num}
              </span>
              <span
                style={{
                  fontSize: '14px',
                  fontWeight: 500,
                  color: index === currentStep ? '#fff' : index < currentStep ? '#333' : '#999',
                }}
              >
                {step.label}
              </span>
            </div>
            {index < steps.length - 1 && (
              <span style={{ fontSize: '20px', color: '#ccc' }}>→</span>
            )}
          </React.Fragment>
        ))}
      </div>

      {/* 操作栏 */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '24px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button
            onClick={() => setAddAwardModalVisible(true)}
            style={{
              padding: '8px 16px',
              backgroundColor: '#1890ff',
              color: '#fff',
              border: 'none',
              borderRadius: '4px',
              fontSize: '14px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
            }}
          >
            <span>+</span>
            <span>添加展播奖项</span>
          </button>

          {/* Tips 提示 */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 12px',
              backgroundColor: '#333',
              borderRadius: '4px',
              color: '#fff',
              fontSize: '13px',
              position: 'relative',
            }}
          >
            {/* 左侧小三角 */}
            <div
              style={{
                position: 'absolute',
                left: '-6px',
                top: '50%',
                transform: 'translateY(-50%)',
                width: 0,
                height: 0,
                borderTop: '6px solid transparent',
                borderBottom: '6px solid transparent',
                borderRight: '6px solid #333',
              }}
            />
            <span>已为您推荐近期获奖数据，点此添加更多奖项</span>
            <button
              onClick={() => {}}
              style={{
                background: 'none',
                border: 'none',
                color: '#fff',
                cursor: 'pointer',
                fontSize: '16px',
                padding: '0 0 0 4px',
                lineHeight: 1,
                opacity: 0.8,
              }}
              title="关闭"
            >
              ×
            </button>
          </div>
        </div>

        <DataRangeFilter 
          value={dataRange} 
          onChange={handleDataRangeChange}
          myDepartment={currentUserDepartment}
          myDepartmentPath={currentUserDepartmentPath}
        />
      </div>

      {/* 奖项卡片列表 */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {filteredAwards.map((award) => (
          <AwardCard
            key={award.id}
            award={award}
            onAddRecipient={award.awardType === 'individual' ? () => handleAddRecipient(award.id) : undefined}
            onRemoveRecipient={(recipient) =>
              handleRemoveRecipient(award.id, recipient)
            }
            onAddTeam={award.awardType === 'team' ? () => handleTeamSearch(award.id) : undefined}
            onRemoveTeam={(team) => {
              setAwards((prev) =>
                prev.map((a) =>
                  a.id === award.id
                    ? { ...a, teams: a.teams?.filter((t) => t.id !== team.id) || [] }
                    : a
                )
              );
            }}
          />
        ))}
      </div>

      {/* 下一步按钮 */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'flex-end',
          marginTop: '32px',
        }}
      >
        <button
          onClick={() => setCurrentStep((prev) => Math.min(prev + 1, 2))}
          style={{
            padding: '10px 24px',
            backgroundColor: '#fff',
            color: '#333',
            border: '1px solid #d9d9d9',
            borderRadius: '4px',
            fontSize: '14px',
            cursor: 'pointer',
          }}
        >
          下一步
        </button>
      </div>

      {/* 添加获奖人弹窗 */}
      <AddRecipientModal
        visible={addRecipientModalVisible}
        awardId={currentAwardId}
        currentDepartment={currentUserDepartment}
        onCancel={() => setAddRecipientModalVisible(false)}
        onConfirm={handleConfirmAddRecipients}
      />

      {/* 团队查询弹窗 */}
      <TeamSearchModal
        visible={teamSearchModalVisible}
        awardId={currentAwardId}
        onCancel={() => setTeamSearchModalVisible(false)}
        onConfirm={handleConfirmAddTeams}
      />

      {/* 添加奖项弹窗 */}
      <AddAwardModal
        visible={addAwardModalVisible}
        onCancel={() => setAddAwardModalVisible(false)}
        onConfirm={(selectedAwards) => {
          console.log('添加奖项:', selectedAwards);
          setAddAwardModalVisible(false);
        }}
      />
    </div>
  );
}

export default App;
