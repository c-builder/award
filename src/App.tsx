import React, { useState, useMemo } from 'react';
import {
  AwardCard,
  DataRangeFilter,
  AddRecipientModal,
  TeamSearchModal,
  AddAwardModal,
} from './components';
import { Award } from './components/types';
import mockAwardsData from './mock/data/awards.json';

const mockAwards: Award[] = mockAwardsData as Award[];

const steps = [
  { num: 1, label: '选择展播数据' },
  { num: 2, label: '制作展播' },
  { num: 3, label: '生成展播' },
];

function App() {
  const [currentStep, setCurrentStep] = useState(0);
  // 初始化时，为团队奖设置 allTeams（如果还没有的话）
  const initialAwards = useMemo(() => mockAwards.map(award => ({
    ...award,
    allTeams: award.awardType === 'team' ? (award.allTeams || award.teams || []) : undefined,
  })), []);
  const [awards, setAwards] = useState<Award[]>(initialAwards);

  const [addRecipientModalVisible, setAddRecipientModalVisible] = useState(false);
  const [teamSearchModalVisible, setTeamSearchModalVisible] = useState(false);
  const [teamSearchViewOnly, setTeamSearchViewOnly] = useState(false);
  const [addAwardModalVisible, setAddAwardModalVisible] = useState(false);
  const [currentAwardId, setCurrentAwardId] = useState<string>('');
  const [currentAllRecipients, setCurrentAllRecipients] = useState<any[]>([]);
  const [currentSelectedRecipients, setCurrentSelectedRecipients] = useState<any[]>([]);

  const currentUserDepartment = 'IT平台服务部';

  const accessibleDepartments = [
    '全部部门',
    'IT平台服务部',
    '质量与流程IT部',
    '智能汽车解决方案部',
    '云与计算业务部',
    '华为公司',
  ];

  const [selectedDepartment, setSelectedDepartment] = useState<string>(currentUserDepartment);

  const filteredAwards = useMemo(() => {
    // 分离默认奖项和自定义奖项
    const defaultAwards = awards.filter(award => award.isDefault);
    const customAwards = awards.filter(award => !award.isDefault);

    // 筛选默认奖项（根据部门筛选）
    const filteredDefaultAwards = selectedDepartment === '全部部门'
      ? defaultAwards
      : defaultAwards.filter(award => {
          if (award.awardType === 'individual') {
            return award.recipients.some(r => {
              const dept = r.department.split('/')[0];
              return dept === selectedDepartment;
            });
          } else {
            return award.teams?.some(t =>
              t.members?.some(m => {
                const dept = m.department.split('/')[0];
                return dept === selectedDepartment;
              })
            ) ?? false;
          }
        });

    // 自定义奖项作为共享数据，在所有部门都显示
    // 按新增顺序（即数组中的顺序）追加到默认奖项后面
    return [...filteredDefaultAwards, ...customAwards];
  }, [awards, selectedDepartment]);

  const handleDepartmentChange = (dept: string) => {
    setSelectedDepartment(dept);
  };

  const handleAddRecipient = (awardId: string, allRecipients: any[], selectedRecipients: any[]) => {
    setCurrentAwardId(awardId);
    setCurrentAllRecipients(allRecipients);
    setCurrentSelectedRecipients(selectedRecipients);
    setAddRecipientModalVisible(true);
  };

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



  const handleAddTeam = (awardId: string) => {
    setCurrentAwardId(awardId);
    setTeamSearchViewOnly(false);
    setTeamSearchModalVisible(true);
  };

  const handleViewAllTeams = (awardId: string) => {
    setCurrentAwardId(awardId);
    setTeamSearchViewOnly(true);
    setTeamSearchModalVisible(true);
  };

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

  const handleRemoveAward = (awardId: string) => {
    setAwards((prev) => prev.filter((award) => award.id !== awardId));
  };

  const handleAddAward = (selectedAwards: any[]) => {
    setAwards((prev) => {
      const defaultAwards = prev.filter((award) => award.isDefault);

      const newAwards: Award[] = selectedAwards.map((item) => ({
        id: String(Date.now() + Math.random()),
        title: item.name,
        issuingDepartment: item.issuingDepartment,
        awardType: item.category === '团队奖' ? 'team' : 'individual',
        recipients: [],
        teams: item.category === '团队奖' ? [] : undefined,
        selected: false,
        isDefault: false,
        pushDate: new Date().toISOString().split('T')[0],
      }));

      return [...defaultAwards, ...newAwards];
    });
    setAddAwardModalVisible(false);
  };

  const handleConfirmAddRecipient = (recipients: any[]) => {
    // recipients 是编辑后选中的获奖人
    // 需要保留完整的获奖人列表，但只标记选中的
    const selectedIds = new Set(recipients.map(r => r.employeeId));
    setAwards((prev) =>
      prev.map((award) =>
        award.id === currentAwardId
          ? {
              ...award,
              // 保留完整的获奖人列表，但更新 isSelected 标记
              recipients: award.recipients.map(r => ({
                ...r,
                isSelected: selectedIds.has(r.employeeId),
                isManuallyAdded: selectedIds.has(r.employeeId) ? true : r.isManuallyAdded,
              })),
            }
          : award
      )
    );
    setAddRecipientModalVisible(false);
  };

  const handleConfirmAddTeam = (teams: any[]) => {
    // teams 是编辑后所有团队的完整列表（包含 isSelected 标记）
    // 只保留选中的团队，未选中的删除
    const selectedTeams = teams.filter(t => t.isSelected);
    setAwards((prev) =>
      prev.map((award) =>
        award.id === currentAwardId
          ? {
              ...award,
              // 只保留选中的团队
              teams: selectedTeams.map(t => ({
                ...t,
                isManuallyAdded: true,
              })),
              // 更新 allTeams 的 isSelected 状态，保持完整列表和成员数据
              allTeams: (award.allTeams || []).map(t => {
                const selectedTeam = selectedTeams.find(st => st.id === t.id);
                return {
                  ...t,
                  isSelected: !!selectedTeam,
                  // 保留选中团队的最新成员数据
                  members: selectedTeam?.members || t.members,
                };
              }),
            }
          : award
      )
    );
    setTeamSearchModalVisible(false);
  };

  const canProceedToNextStep = useMemo(() => {
    // 只要有奖项且有记录就可以进入下一步
    return awards.some((award) => {
      if (award.awardType === 'individual') {
        return award.recipients.length > 0;
      } else {
        return (award.teams?.length || 0) > 0;
      }
    });
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
      <header
        style={{
          backgroundColor: '#1a1a2e',
          padding: '16px 24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <h1 style={{ margin: 0, fontSize: '18px', fontWeight: 600, color: '#fff' }}>
          获奖海报生成系统
        </h1>
        <div style={{ fontSize: '14px', color: '#a0aec0' }}>
          当前用户: 李水花 (IT平台服务部)
        </div>
      </header>

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
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                <div
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    backgroundColor: index <= currentStep ? '#1890ff' : '#f1f5f9',
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
                    backgroundColor: index < currentStep ? '#1890ff' : '#f1f5f9',
                    margin: '0 16px',
                    marginBottom: '24px',
                  }}
                />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      <main style={{ padding: '24px 24px 80px 24px', maxWidth: '1200px', margin: '0 auto' }}>
        {currentStep === 0 && (
          <>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '24px',
                gap: '16px',
              }}
            >
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
                  whiteSpace: 'nowrap',
                }}
              >
                <span>+</span>
                <span>添加展播奖项</span>
              </button>
              <DataRangeFilter
                value={selectedDepartment}
                onChange={handleDepartmentChange}
                accessibleDepartments={accessibleDepartments}
                currentUserDepartment={currentUserDepartment}
              />
            </div>

            <div
              style={{
                marginBottom: '16px',
                padding: '12px 16px',
                backgroundColor: '#e6f4ff',
                border: '1px solid #91caff',
                borderRadius: '6px',
                fontSize: '14px',
                color: '#0958d9',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="#0958d9">
                <path d="M8 1.5a6.5 6.5 0 1 0 0 13 6.5 6.5 0 0 0 0-13zM0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8zm6.5-.25A.75.75 0 0 1 7.25 7h1.5a.75.75 0 0 1 .75.75v2.75h.25a.75.75 0 0 1 0 1.5h-2a.75.75 0 0 1 0-1.5h.25v-2h-.25a.75.75 0 0 1-.75-.75zM8 6a1 1 0 1 1 0-2 1 1 0 0 1 0 2z"/>
              </svg>
              <span>已为你筛选出近期获奖数据，请你从中挑选用于展播的奖项。</span>
            </div>

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
                    currentDepartment={selectedDepartment === '全部部门' ? '' : selectedDepartment}
                    onAddRecipient={
                      award.awardType === 'individual'
                        ? (allRecipients, selectedRecipients) => handleAddRecipient(award.id, allRecipients, selectedRecipients)
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
                    onViewAllTeams={
                      award.awardType === 'team'
                        ? () => handleViewAllTeams(award.id)
                        : undefined
                    }
                    onRemoveAward={award.isDefault ? undefined : () => handleRemoveAward(award.id)}
                  />
                ))}
              </div>
            )}
          </>
        )}

        {currentStep === 1 && (
          <div style={{ backgroundColor: '#fff', borderRadius: '8px', padding: '48px', textAlign: 'center', color: '#6b7280' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>🎨</div>
            <h2 style={{ margin: '0 0 8px 0', color: '#1a1a2e' }}>制作展播</h2>
            <p>请先在第一步选择展播数据</p>
          </div>
        )}

        {currentStep === 2 && (
          <div style={{ backgroundColor: '#fff', borderRadius: '8px', padding: '48px', textAlign: 'center', color: '#6b7280' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>📄</div>
            <h2 style={{ margin: '0 0 8px 0', color: '#1a1a2e' }}>生成展播</h2>
            <p>请先在第二步制作展播</p>
          </div>
        )}
      </main>

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
            disabled={currentStep === 0 ? !canProceedToNextStep : false}
            style={{
              padding: '8px 24px',
              backgroundColor: currentStep === 0 && !canProceedToNextStep ? '#e2e8f0' : '#1890ff',
              color: '#fff',
              border: 'none',
              borderRadius: '4px',
              cursor: currentStep === 0 && !canProceedToNextStep ? 'not-allowed' : 'pointer',
              fontSize: '14px',
              zIndex: 1000,
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

      <AddRecipientModal
        visible={addRecipientModalVisible}
        currentDepartment={selectedDepartment === '全部部门' ? '' : selectedDepartment}
        currentAward={awards.find(a => a.id === currentAwardId)}
        allRecipients={currentAllRecipients}
        selectedRecipients={currentSelectedRecipients}
        onCancel={() => setAddRecipientModalVisible(false)}
        onConfirm={handleConfirmAddRecipient}
      />

      <TeamSearchModal
        visible={teamSearchModalVisible}
        awardTitle={awards.find(a => a.id === currentAwardId)?.title || ''}
        existingTeams={teamSearchViewOnly
          ? (awards.find(a => a.id === currentAwardId)?.teams || [])
          : (awards.find(a => a.id === currentAwardId)?.allTeams || [])
        }
        onCancel={() => setTeamSearchModalVisible(false)}
        onConfirm={handleConfirmAddTeam}
        currentDepartment={selectedDepartment === '全部部门' ? '' : selectedDepartment}
        viewOnly={teamSearchViewOnly}
      />

      <AddAwardModal
        visible={addAwardModalVisible}
        onCancel={() => setAddAwardModalVisible(false)}
        onConfirm={handleAddAward}
        existingAwards={awards}
        externalDeptPath={selectedDepartment === '全部部门' ? [] : [selectedDepartment]}
      />
    </div>
  );
}

export default App;
