import React, { useMemo } from 'react';
import { Award, Recipient, Team } from './types';
import { RecipientCard } from './RecipientCard';

export interface AwardCardProps {
  award: Award;
  onAddRecipient?: () => void;
  onRemoveRecipient?: (recipient: Recipient) => void;
  onAddTeam?: () => void;
  onRemoveTeam?: (team: Team) => void;
}

/**
 * 奖项卡片组件
 * 包含奖项标题、颁发部门、获奖人/团队列表和跨部门人员汇总提示
 */
export const AwardCard: React.FC<AwardCardProps> = ({
  award,
  onAddRecipient,
  onRemoveRecipient,
  onAddTeam,
  onRemoveTeam,
}) => {
  // 计算跨部门人员
  const crossDepartmentRecipients = useMemo(() => {
    return award.recipients.filter(
      (recipient) => recipient.department !== award.issuingDepartment
    );
  }, [award.recipients, award.issuingDepartment]);

  // 生成跨部门人员汇总提示文本
  const crossDeptSummary = useMemo(() => {
    if (crossDepartmentRecipients.length === 0) {
      return null;
    }

    const summary = crossDepartmentRecipients
      .map((r) => `${r.name}(${r.department})`)
      .join('，');

    return `已添加跨部门人员：${summary}`;
  }, [crossDepartmentRecipients]);

  // 判断是否为团队奖
  const isTeamAward = award.awardType === 'team';

  // 获取已选数量（获奖人或团队）
  const selectedCount = isTeamAward 
    ? (award.teams?.length || 0) 
    : award.recipients.length;

  return (
    <div
      className="award-card"
      style={{
        backgroundColor: '#fff',
        borderRadius: '8px',
        padding: '16px',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
      }}
    >
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
        <div>
          <h3
            className="award-title"
            style={{
              fontSize: '16px',
              fontWeight: 600,
              color: '#333',
              margin: 0,
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <span
              className="award-id-badge"
              style={{
                width: '20px',
                height: '20px',
                backgroundColor: '#1890ff',
                color: '#fff',
                borderRadius: '4px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '12px',
                flexShrink: 0,
              }}
            >
              {award.id}
            </span>
            {award.title}
            {/* 奖项类型标签 */}
            <span
              style={{
                padding: '2px 8px',
                backgroundColor: isTeamAward ? '#e6f7ff' : '#f6ffed',
                color: isTeamAward ? '#1890ff' : '#52c41a',
                borderRadius: '4px',
                fontSize: '12px',
                fontWeight: 400,
              }}
            >
              {isTeamAward ? '团队奖' : '个人奖'}
            </span>
          </h3>
          <p
            className="award-department"
            style={{
              fontSize: '12px',
              color: '#666',
              margin: '4px 0 0 28px',
            }}
          >
            颁发部门: {award.issuingDepartment}
          </p>
        </div>
        <span
          className="award-recipient-count"
          style={{
            fontSize: '12px',
            color: '#999',
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
              {award.teams.map((team) => (
                <div
                  key={team.id}
                  style={{
                    padding: '12px 16px',
                    backgroundColor: '#f6ffed',
                    border: '1px solid #b7eb8f',
                    borderRadius: '6px',
                    minWidth: '180px',
                    position: 'relative',
                  }}
                >
                  {/* 移除按钮 */}
                  {onRemoveTeam && (
                    <button
                      onClick={() => onRemoveTeam(team)}
                      style={{
                        position: 'absolute',
                        top: '-6px',
                        right: '-6px',
                        width: '16px',
                        height: '16px',
                        borderRadius: '50%',
                        backgroundColor: '#ff4d4f',
                        color: '#fff',
                        border: 'none',
                        cursor: 'pointer',
                        fontSize: '10px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
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
                      color: '#333',
                      marginBottom: '4px',
                    }}
                  >
                    🏆 {team.name}
                  </div>
                  
                  {/* 负责人 */}
                  <div
                    style={{
                      fontSize: '12px',
                      color: '#666',
                      marginBottom: '2px',
                    }}
                  >
                    负责人: {team.leaderName} ({team.leaderId})
                  </div>
                  
                  {/* 成员数 */}
                  <div
                    style={{
                      fontSize: '12px',
                      color: '#999',
                    }}
                  >
                    成员: {team.memberCount}人
                  </div>
                </div>
              ))}
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
                marginBottom: crossDeptSummary ? '8px' : '0',
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

          {/* 跨部门人员汇总提示 */}
          {crossDeptSummary && (
            <div
              className="cross-dept-summary"
              style={{
                fontSize: '12px',
                color: '#1890ff',
                marginTop: '8px',
                padding: '4px 0',
              }}
            >
              {crossDeptSummary}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default AwardCard;
