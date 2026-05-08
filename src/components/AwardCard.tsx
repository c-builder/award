import React, { useState } from 'react';
import { Award, Recipient, Team } from './types';
import { RecipientCard } from './RecipientCard';
import { TeamMembersModal } from './TeamMembersModal';

export interface AwardCardProps {
  award: Award;
  index?: number;
  selected?: boolean;
  onToggleSelection?: () => void;
  onAddRecipient?: () => void;
  onRemoveRecipient?: (recipient: Recipient) => void;
  onAddTeam?: () => void;
  onRemoveTeam?: (team: Team) => void;
  onUpdateTeam?: (team: Team) => void;
  /** 删除整个奖项 */
  onRemoveAward?: () => void;
}

/**
 * 奖项卡片组件
 * 包含奖项标题、颁发部门、获奖人/团队列表和跨部门人员汇总提示
 */
export const AwardCard: React.FC<AwardCardProps> = ({
  award,
  selected = false,
  onToggleSelection,
  onAddRecipient,
  onRemoveRecipient,
  onAddTeam,
  onRemoveTeam,
  onUpdateTeam,
  onRemoveAward,
}) => {
  // 鼠标悬停状态
  const [isHovered, setIsHovered] = useState(false);

  // 判断是否为团队奖
  const isTeamAward = award.awardType === 'team';

  // 获取已选数量（获奖人或团队）
  const selectedCount = isTeamAward 
    ? (award.teams?.length || 0) 
    : award.recipients.length;

  // 团队成员弹窗状态
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  const [membersModalVisible, setMembersModalVisible] = useState(false);

  const handleShowMembers = (team: Team) => {
    setSelectedTeam(team);
    setMembersModalVisible(true);
  };

  const handleCloseMembers = () => {
    setMembersModalVisible(false);
    setSelectedTeam(null);
  };

  return (
    <div
      className="award-card"
      style={{
        backgroundColor: selected ? '#f0f7ff' : '#fff',
        borderRadius: '8px',
        padding: '16px',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
        border: selected ? '2px solid #1890ff' : '1px solid #e8e8e8',
        transition: 'all 0.2s',
        position: 'relative',
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* 删除按钮 - 鼠标悬停时显示（仅可删除的奖项显示） */}
      {onRemoveAward && award.deletable && isHovered && (
        <button
          onClick={onRemoveAward}
          style={{
            position: 'absolute',
            top: '8px',
            right: '8px',
            width: '24px',
            height: '24px',
            borderRadius: '50%',
            backgroundColor: '#ff4d4f',
            color: '#fff',
            border: 'none',
            cursor: 'pointer',
            fontSize: '14px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 10,
            transition: 'all 0.2s',
            boxShadow: '0 2px 4px rgba(255, 77, 79, 0.3)',
          }}
          title="删除奖项"
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#ff7875';
            e.currentTarget.style.transform = 'scale(1.1)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = '#ff4d4f';
            e.currentTarget.style.transform = 'scale(1)';
          }}
        >
          ×
        </button>
      )}
      {/* 奖项标题区域 */}
      <div
        className="award-header"
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '12px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1 }}>
          {/* 选中复选框 */}
          {onToggleSelection && (
            <div
              onClick={(e) => {
                e.stopPropagation();
                onToggleSelection();
              }}
              style={{
                width: '18px',
                height: '18px',
                borderRadius: '4px',
                border: `2px solid ${selected ? '#1890ff' : '#d9d9d9'}`,
                backgroundColor: selected ? '#1890ff' : '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                flexShrink: 0,
                transition: 'all 0.2s',
              }}
            >
              {selected && (
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              )}
            </div>
          )}

          <div style={{ flex: 1 }}>
            <h3
              className="award-title"
              style={{
                fontSize: '16px',
                fontWeight: 600,
                color: '#1a1a2e',
                margin: 0,
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              {award.title}
              {/* 奖项类型标签 */}
              <span
                style={{
                  padding: '2px 8px',
                  backgroundColor: isTeamAward ? '#e6f7ff' : '#f0fdf4',
                  color: isTeamAward ? '#1890ff' : '#16a34a',
                  borderRadius: '4px',
                  fontSize: '12px',
                  fontWeight: 500,
                }}
              >
                {isTeamAward ? '团队奖' : '个人奖'}
              </span>
            </h3>
            <p
              className="award-department"
              style={{
                fontSize: '12px',
                color: '#6b7280',
                margin: '4px 0 0 0',
              }}
            >
              颁发部门: {award.issuingDepartment}
            </p>
          </div>
        </div>
        <span
          className="award-recipient-count"
          style={{
            fontSize: '12px',
            color: '#9ca3af',
            flexShrink: 0,
          }}
        >
          已选({selectedCount})
        </span>
      </div>

      {/* 团队奖显示 */}
      {isTeamAward ? (
        <>
          {/* 添加团队按钮 */}
          {onAddTeam && (
            <button
              className="add-team-btn"
              onClick={onAddTeam}
              style={{
                padding: '4px 12px',
                backgroundColor: 'transparent',
                color: '#1890ff',
                border: 'none',
                cursor: 'pointer',
                fontSize: '13px',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                marginBottom: '12px',
              }}
            >
              <span>+</span>
              <span>添加团队奖</span>
            </button>
          )}

          {/* 团队列表 */}
          {award.teams && award.teams.length > 0 && (
            <div
              className="teams-list"
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '12px',
              }}
            >
              {award.teams.map((team) => {
                // 团队卡片悬停状态
                const [isTeamHovered, setIsTeamHovered] = useState(false);
                
                return (
                  <div
                    key={team.id}
                    style={{
                      padding: '12px 16px',
                      backgroundColor: '#f8fafc',
                      border: '1px solid #e2e8f0',
                      borderRadius: '6px',
                      minWidth: '180px',
                      position: 'relative',
                    }}
                    onMouseEnter={() => setIsTeamHovered(true)}
                    onMouseLeave={() => setIsTeamHovered(false)}
                  >
                    {/* 移除按钮 - 鼠标悬停时显示 */}
                    {onRemoveTeam && isTeamHovered && (
                      <button
                        onClick={() => onRemoveTeam(team)}
                        style={{
                          position: 'absolute',
                          top: '-6px',
                          right: '-6px',
                          width: '16px',
                          height: '16px',
                          borderRadius: '50%',
                          backgroundColor: '#ef4444',
                          color: '#fff',
                          border: 'none',
                          cursor: 'pointer',
                          fontSize: '10px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          transition: 'all 0.2s',
                          boxShadow: '0 2px 4px rgba(239, 68, 68, 0.3)',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = '#ff7875';
                          e.currentTarget.style.transform = 'scale(1.1)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = '#ef4444';
                          e.currentTarget.style.transform = 'scale(1)';
                        }}
                      >
                        ×
                      </button>
                    )}
                    
                    {/* 团队名称 */}
                    <div
                      style={{
                        fontSize: '14px',
                        fontWeight: 500,
                        color: '#1a1a2e',
                        marginBottom: '4px',
                      }}
                    >
                      {team.name}
                    </div>
                    
                    {/* 成员数 + 展开按钮 */}
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        marginTop: '4px',
                      }}
                    >
                      <span
                        style={{
                          fontSize: '12px',
                          color: '#6b7280',
                        }}
                      >
                        成员: {team.memberCount}人
                      </span>
                      <button
                        onClick={() => handleShowMembers(team)}
                        style={{
                          background: 'none',
                        border: 'none',
                        color: '#1890ff',
                        fontSize: '12px',
                        cursor: 'pointer',
                        padding: '2px 0',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                      }}
                      title="查看成员列表"
                    >
                      <span>详情</span>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="9 18 15 12 9 6" />
                      </svg>
                    </button>
                  </div>
                </div>
              );})}
            </div>
          )}
        </>
      ) : (
        <>
          {/* 个人奖显示 */}
          {/* 添加获奖人按钮 */}
          {onAddRecipient && (
            <button
              className="add-recipient-btn"
              onClick={onAddRecipient}
              style={{
                padding: '4px 12px',
                backgroundColor: 'transparent',
                color: '#1890ff',
                border: 'none',
                cursor: 'pointer',
                fontSize: '13px',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                marginBottom: '12px',
              }}
            >
              <span>+</span>
              <span>添加获奖人</span>
            </button>
          )}

          {/* 获奖人列表 */}
          {award.recipients.length > 0 && (
            <div
              className="recipients-list"
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '8px',
              }}
            >
              {award.recipients.map((recipient, index) => (
                <RecipientCard
                  key={`${recipient.employeeId || recipient.name}-${index}`}
                  recipient={recipient}
                  issuingDepartment={award.issuingDepartment}
                  onRemove={
                    onRemoveRecipient ? () => onRemoveRecipient(recipient) : undefined
                  }
                />
              ))}
            </div>
          )}

        </>
      )}

      {/* 团队成员弹窗 */}
      <TeamMembersModal
        visible={membersModalVisible}
        team={selectedTeam || { id: '', name: '', leaderName: '', leaderId: '', memberCount: 0 }}
        onClose={handleCloseMembers}
        onConfirm={(updatedTeam) => {
          if (onUpdateTeam) {
            onUpdateTeam(updatedTeam);
          }
        }}
      />
    </div>
  );
};

export default AwardCard;
