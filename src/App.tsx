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

  const RECENT_MONTHS = 3;
  const REFERENCE_DATE = new Date('2026-01-15');

  const isWithinRecentMonths = (dateStr?: string): boolean => {
    if (!dateStr) return false;
    const issueDate = new Date(dateStr);
    const threeMonthsAgo = new Date(REFERENCE_DATE);
    threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - RECENT_MONTHS);
    return issueDate >= threeMonthsAgo;
  };

  const initialAwards = useMemo(() => mockAwards
    .filter(award => award.isDefault || isWithinRecentMonths(award.issueDate))
    .map(award => ({
      ...award,
      allTeams: award.awardType === 'team' ? (award.allTeams || award.teams || []) : undefined,
    })), []);
  const [awards, setAwards] = useState<Award[]>(initialAwards);

  // 选中的奖项ID集合（用于展播）
  const [selectedAwardIds, setSelectedAwardIds] = useState<Set<string>>(new Set());

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
    const defaultAwards = awards.filter(award => award.isDefault || isWithinRecentMonths(award.issueDate));
    const customAwards = awards.filter(award => !award.isDefault && !isWithinRecentMonths(award.issueDate));

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

    const filteredCustomAwards = selectedDepartment === '全部部门'
      ? customAwards
      : customAwards.filter(award => {
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

    return [...filteredDefaultAwards, ...filteredCustomAwards];
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
    // 同时从选中列表中移除
    setSelectedAwardIds((prev) => {
      const newSet = new Set(prev);
      newSet.delete(awardId);
      return newSet;
    });
  };

  // 处理奖项选中/取消选中
  const handleSelectAward = (awardId: string, selected: boolean) => {
    setSelectedAwardIds((prev) => {
      const newSet = new Set(prev);
      if (selected) {
        newSet.add(awardId);
      } else {
        newSet.delete(awardId);
      }
      return newSet;
    });
  };

  // 全选/取消全选
  const handleSelectAll = (selectAll: boolean) => {
    if (selectAll) {
      setSelectedAwardIds(new Set(filteredAwards.map(a => a.id)));
    } else {
      setSelectedAwardIds(new Set());
    }
  };

  const handleAddAward = (selectedAwards: Award[]) => {
    setAwards((prev) => {
      // 新逻辑：首页列表完全替换为弹窗中选中的奖项
      // 保留原有奖项的 recipients 和 teams 数据（如果存在）
      const newAwards: Award[] = selectedAwards.map((item) => {
        // 查找是否已存在该奖项（用于保留 recipients/teams 数据）
        const existingAward = prev.find(a => a.title === item.title);

        return {
          id: existingAward?.id || item.id,
          title: item.title,
          issuingDepartment: item.issuingDepartment,
          awardType: item.awardType,
          recipients: existingAward?.recipients || item.recipients || [],
          teams: existingAward?.teams || item.teams || (item.awardType === 'team' ? [] : undefined),
          allTeams: item.allTeams,
          selected: false,
          isDefault: existingAward?.isDefault || item.isDefault || false,
          issueDate: item.issueDate,
          pushDate: existingAward?.pushDate || item.pushDate || new Date().toISOString().split('T')[0],
        };
      });

      return newAwards;
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
                    selected={selectedAwardIds.has(award.id)}
                    onSelect={(selected) => handleSelectAward(award.id, selected)}
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
                    onRemoveAward={() => handleRemoveAward(award.id)}
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

        {currentStep === 0 && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            {/* 全选/取消全选 */}
            <button
              onClick={() => handleSelectAll(selectedAwardIds.size < filteredAwards.length)}
              disabled={filteredAwards.length === 0}
              style={{
                padding: '6px 16px',
                backgroundColor: filteredAwards.length === 0 ? '#f5f5f5' : '#fff',
                color: filteredAwards.length === 0 ? '#bfbfbf' : '#1890ff',
                border: '1px solid #d9d9d9',
                borderRadius: '4px',
                cursor: filteredAwards.length === 0 ? 'not-allowed' : 'pointer',
                fontSize: '14px',
                transition: 'all 0.2s',
              }}
            >
              {selectedAwardIds.size === filteredAwards.length && filteredAwards.length > 0 ? '取消全选' : '全选'}
            </button>
            {/* 已选X个奖项 */}
            <span style={{ fontSize: '14px', color: '#666' }}>
              已选 <strong style={{ color: '#1890ff', fontSize: '16px' }}>{selectedAwardIds.size}</strong> 个奖项
            </span>
          </div>
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
            disabled={currentStep === 0 ? selectedAwardIds.size === 0 : false}
            style={{
              padding: '8px 24px',
              backgroundColor: currentStep === 0 && selectedAwardIds.size === 0 ? '#e2e8f0' : '#1890ff',
              color: '#fff',
              border: 'none',
              borderRadius: '4px',
              cursor: currentStep === 0 && selectedAwardIds.size === 0 ? 'not-allowed' : 'pointer',
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
        onUpdateTeam={(updatedTeam) => handleUpdateTeam(currentAwardId, updatedTeam)}
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
