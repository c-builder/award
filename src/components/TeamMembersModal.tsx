import React, { useState, useEffect } from 'react';
import { Team, TeamMember } from './types';

export interface TeamMembersModalProps {
  visible: boolean;
  team: Team;
  onClose: () => void;
  onConfirm: (updatedTeam: Team) => void;
}

// 模拟员工数据（用于通过工号添加成员）
const mockEmployeeData: Record<string, { name: string; employeeId: string; department: string }> = {
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
  '00511111': { name: '卫十六', employeeId: '00511111', department: '智能汽车解决方案部/智能驾驶组' },
  '00512222': { name: '蒋十七', employeeId: '00512222', department: '云与计算业务部/云计算组' },
  '00513333': { name: '沈十八', employeeId: '00513333', department: 'IT平台服务部/平台开发部' },
  '00514444': { name: '韩十九', employeeId: '00514444', department: '质量与流程IT部/质量部/测试组' },
  '00515555': { name: '杨二十', employeeId: '00515555', department: '智能汽车解决方案部/智能驾驶组' },
  '00516666': { name: '朱二一', employeeId: '00516666', department: '云与计算业务部/云计算组' },
};

/**
 * 团队详情弹框组件
 * 支持查看、添加（通过工号）、删除成员，并同步更新团队数据
 */
export const TeamMembersModal: React.FC<TeamMembersModalProps> = ({
  visible,
  team,
  onClose,
  onConfirm,
}) => {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [employeeId, setEmployeeId] = useState('');
  const [addError, setAddError] = useState('');

  // 弹窗打开时，初始化成员列表
  useEffect(() => {
    if (visible && team.members) {
      setMembers([...team.members]);
    }
  }, [visible, team]);

  // 弹窗关闭时重置状态
  useEffect(() => {
    if (!visible) {
      setEmployeeId('');
      setAddError('');
    }
  }, [visible]);

  // 删除成员
  const handleRemoveMember = (employeeIdToRemove: string) => {
    setMembers((prev) => prev.filter((m) => m.employeeId !== employeeIdToRemove));
  };

  // 通过工号添加成员
  const handleAddMember = () => {
    const trimmedId = employeeId.trim();
    if (!trimmedId) {
      setAddError('请输入工号');
      return;
    }

    // 检查是否已存在
    if (members.some((m) => m.employeeId === trimmedId)) {
      setAddError('该成员已在团队中');
      return;
    }

    const employee = mockEmployeeData[trimmedId];
    if (!employee) {
      setAddError('未找到该工号对应的员工');
      return;
    }

    const newMember: TeamMember = {
      name: employee.name,
      employeeId: employee.employeeId,
      department: employee.department,
      role: '',
    };

    setMembers((prev) => [...prev, newMember]);
    setEmployeeId('');
    setAddError('');
  };

  // 处理输入框回车事件
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleAddMember();
    }
  };

  // 确认更新
  const handleConfirm = () => {
    const updatedTeam: Team = {
      ...team,
      members: members,
      memberCount: members.length,
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
        zIndex: 2000,
      }}
      onClick={onClose}
    >
      <div
        style={{
          backgroundColor: '#fff',
          borderRadius: '8px',
          width: '520px',
          maxHeight: '80vh',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* 弹窗头部 */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '16px 24px',
            borderBottom: '1px solid #f0f0f0',
          }}
        >
          <div>
            <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 600, color: '#333' }}>
              🏆 {team.name}
            </h3>
            <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: '#666' }}>
              共 {members.length} 人
            </p>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '20px',
              color: '#999',
              cursor: 'pointer',
              padding: '0',
              width: '32px',
              height: '32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            ×
          </button>
        </div>

        {/* 添加成员区域 */}
        <div
          style={{
            padding: '16px 24px',
            borderBottom: '1px solid #f0f0f0',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontSize: '14px', color: '#333', whiteSpace: 'nowrap' }}>
              添加成员:
            </span>
            <input
              type="text"
              placeholder="请输入工号"
              value={employeeId}
              onChange={(e) => setEmployeeId(e.target.value)}
              onKeyDown={handleKeyDown}
              style={{
                padding: '6px 12px',
                border: '1px solid #d9d9d9',
                borderRadius: '4px',
                fontSize: '14px',
                width: '160px',
                outline: 'none',
              }}
              onFocus={(e) => {
                e.target.style.borderColor = '#1890ff';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = '#d9d9d9';
              }}
            />
            <button
              onClick={handleAddMember}
              disabled={!employeeId.trim()}
              style={{
                padding: '6px 16px',
                backgroundColor: !employeeId.trim() ? '#d9d9d9' : '#1890ff',
                color: '#fff',
                border: 'none',
                borderRadius: '4px',
                fontSize: '14px',
                cursor: !employeeId.trim() ? 'not-allowed' : 'pointer',
              }}
            >
              添加
            </button>
          </div>
          {addError && (
            <div
              style={{
                marginTop: '8px',
                padding: '6px 12px',
                backgroundColor: '#fff2f0',
                border: '1px solid #ffccc7',
                borderRadius: '4px',
                color: '#ff4d4f',
                fontSize: '13px',
              }}
            >
              {addError}
            </div>
          )}
        </div>

        {/* 成员列表 */}
        <div
          style={{
            flex: 1,
            overflow: 'auto',
            padding: '16px 24px',
          }}
        >
          {members.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {members.map((member) => (
                <div
                  key={member.employeeId}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '10px 12px',
                    backgroundColor: '#f6ffed',
                    borderRadius: '6px',
                    border: '1px solid #b7eb8f',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span
                      style={{
                        width: '28px',
                        height: '28px',
                        borderRadius: '50%',
                        backgroundColor: '#52c41a',
                        color: '#fff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '12px',
                        fontWeight: 500,
                      }}
                    >
                      {member.name.charAt(0)}
                    </span>
                    <div>
                      <div style={{ fontSize: '14px', fontWeight: 500, color: '#333' }}>
                        {member.name}
                      </div>
                      <div style={{ fontSize: '12px', color: '#999' }}>
                        {member.department}
                      </div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ fontSize: '12px', color: '#666' }}>
                      {member.employeeId}
                    </div>
                    <button
                      onClick={() => handleRemoveMember(member.employeeId)}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: '#ff4d4f',
                        fontSize: '18px',
                        cursor: 'pointer',
                        padding: '0',
                        width: '24px',
                        height: '24px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: '4px',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = '#fff1f0';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'transparent';
                      }}
                      title="删除成员"
                    >
                      ×
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '40px', color: '#999', fontSize: '14px' }}>
              暂无成员
            </div>
          )}
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
            style={{
              padding: '8px 24px',
              backgroundColor: '#1890ff',
              color: '#fff',
              border: 'none',
              borderRadius: '4px',
              fontSize: '14px',
              cursor: 'pointer',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#40a9ff';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#1890ff';
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
