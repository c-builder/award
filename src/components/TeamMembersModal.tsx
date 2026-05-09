import React, { useState, useEffect, useMemo } from 'react';
import { Pagination } from './Pagination';
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
  '00517777': { name: '秦二二', employeeId: '00517777', department: 'IT平台服务部/平台运维部' },
  '00518888': { name: '尤二三', employeeId: '00518888', department: '质量与流程IT部/流程部/优化组' },
  '00519999': { name: '许二四', employeeId: '00519999', department: '智能汽车解决方案部/智能座舱组' },
  '00520000': { name: '何二五', employeeId: '00520000', department: '云与计算业务部/大数据组' },
  '00521111': { name: '吕二六', employeeId: '00521111', department: 'IT平台服务部/技术支持部' },
  '00522222': { name: '施二七', employeeId: '00522222', department: '质量与流程IT部/IT部/开发组' },
  '00523333': { name: '张二八', employeeId: '00523333', department: '智能汽车解决方案部/智能驾驶组' },
  '00524444': { name: '孔二九', employeeId: '00524444', department: '云与计算业务部/云计算组' },
  '00525555': { name: '曹三十', employeeId: '00525555', department: 'IT平台服务部/平台开发部' },
  '00526666': { name: '严三一', employeeId: '00526666', department: '质量与流程IT部/质量部/测试组' },
};

/**
 * 团队详情弹框组件
 * 支持查看、添加（通过工号）、删除成员，并同步更新团队数据
 * 样式统一为蓝色主题
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

  // 分页状态
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

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
      setCurrentPage(1);
    }
  }, [visible]);

  // 成员列表改变时重置页码
  useEffect(() => {
    setCurrentPage(1);
  }, [members.length]);

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

  // 分页后的成员列表
  const paginatedMembers = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return members.slice(startIndex, startIndex + pageSize);
  }, [members, currentPage]);

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
          borderRadius: '12px',
          width: '520px',
          maxHeight: '80vh',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* 弹窗头部 */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '20px 24px',
            borderBottom: '1px solid #f0f0f0',
            background: 'linear-gradient(135deg, #e6f7ff 0%, #f0f9ff 100%)',
            borderRadius: '12px 12px 0 0',
          }}
        >
          <div>
            <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 600, color: '#1890ff' }}>
              🏆 {team.name}
            </h3>
            <p style={{ margin: '6px 0 0 0', fontSize: '14px', color: '#666' }}>
              共 {members.length} 人
            </p>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '24px',
              color: '#999',
              cursor: 'pointer',
              padding: '0',
              width: '36px',
              height: '36px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: '50%',
              transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#f5f5f5';
              e.currentTarget.style.color = '#666';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.color = '#999';
            }}
          >
            ×
          </button>
        </div>

        {/* 添加成员区域 */}
        <div
          style={{
            padding: '20px 24px',
            borderBottom: '1px solid #f0f0f0',
            backgroundColor: '#fafafa',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontSize: '14px', color: '#333', whiteSpace: 'nowrap', fontWeight: 500 }}>
              添加成员:
            </span>
            <input
              type="text"
              placeholder="请输入工号"
              value={employeeId}
              onChange={(e) => setEmployeeId(e.target.value)}
              onKeyDown={handleKeyDown}
              style={{
                padding: '10px 14px',
                border: '1px solid #d9d9d9',
                borderRadius: '8px',
                fontSize: '14px',
                width: '200px',
                outline: 'none',
                transition: 'all 0.3s',
                boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)',
              }}
              onFocus={(e) => {
                e.target.style.borderColor = '#1890ff';
                e.target.style.boxShadow = '0 0 0 3px rgba(24, 144, 255, 0.1)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = '#d9d9d9';
                e.target.style.boxShadow = '0 1px 2px rgba(0, 0, 0, 0.05)';
              }}
            />
            <button
              onClick={handleAddMember}
              disabled={!employeeId.trim()}
              style={{
                padding: '10px 20px',
                backgroundColor: !employeeId.trim() ? '#d9d9d9' : '#1890ff',
                color: '#fff',
                border: 'none',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: 500,
                cursor: !employeeId.trim() ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s',
                boxShadow: !employeeId.trim() ? 'none' : '0 2px 4px rgba(24, 144, 255, 0.3)',
              }}
              onMouseEnter={(e) => {
                if (employeeId.trim()) {
                  e.currentTarget.style.backgroundColor = '#40a9ff';
                  e.currentTarget.style.transform = 'translateY(-1px)';
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = !employeeId.trim() ? '#d9d9d9' : '#1890ff';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              添加
            </button>
          </div>
          {addError && (
            <div
              style={{
                marginTop: '10px',
                padding: '8px 14px',
                backgroundColor: '#fff2f0',
                border: '1px solid #ffccc7',
                borderRadius: '6px',
                color: '#ff4d4f',
                fontSize: '13px',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              <span>⚠️</span>
              <span>{addError}</span>
            </div>
          )}
        </div>

        {/* 成员列表 */}
        <div
          style={{
            flex: 1,
            overflow: 'auto',
            padding: '20px 24px',
            backgroundColor: '#fff',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {members.length > 0 ? (
            <>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', flex: 1, overflow: 'auto' }}>
                {paginatedMembers.map((member) => (
                <div
                  key={member.employeeId}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '12px 16px',
                    backgroundColor: '#f0f9ff',
                    borderRadius: '8px',
                    border: '1px solid #d9f0ff',
                    transition: 'all 0.2s',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#e6f7ff';
                    e.currentTarget.style.boxShadow = '0 2px 8px rgba(24, 144, 255, 0.1)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#f0f9ff';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span
                      style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: '50%',
                        backgroundColor: '#1890ff',
                        color: '#fff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '14px',
                        fontWeight: 600,
                        boxShadow: '0 2px 4px rgba(24, 144, 255, 0.3)',
                      }}
                    >
                      {member.name.charAt(0)}
                    </span>
                    <div>
                      <div style={{ fontSize: '15px', fontWeight: 500, color: '#333' }}>
                        {member.name}
                      </div>
                      <div style={{ fontSize: '13px', color: '#666', marginTop: '2px' }}>
                        {member.department}
                      </div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div style={{ fontSize: '13px', color: '#999', fontFamily: 'monospace' }}>
                      {member.employeeId}
                    </div>
                    <button
                      onClick={() => handleRemoveMember(member.employeeId)}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: '#ff4d4f',
                        fontSize: '20px',
                        cursor: 'pointer',
                        padding: '0',
                        width: '28px',
                        height: '28px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: '50%',
                        transition: 'all 0.2s',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = '#fff1f0';
                        e.currentTarget.style.transform = 'scale(1.1)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'transparent';
                        e.currentTarget.style.transform = 'scale(1)';
                      }}
                      title="删除成员"
                    >
                      ×
                    </button>
                  </div>
                </div>
              ))}
              </div>

              {/* 分页器 - 固定在成员列表底部 */}
              {members.length > 0 && (
                <div
                  style={{
                    padding: '12px 0 0 0',
                    borderTop: '1px solid #f0f0f0',
                    backgroundColor: '#fff',
                    flexShrink: 0,
                    marginTop: 'auto',
                  }}
                >
                  <Pagination
                    current={currentPage}
                    pageSize={pageSize}
                    total={members.length}
                    onChange={setCurrentPage}
                  />
                </div>
              )}
            </>
          ) : (
            <div style={{ textAlign: 'center', padding: '48px', color: '#999', fontSize: '14px' }}>
              <div style={{ fontSize: '48px', marginBottom: '12px' }}>👥</div>
              <div>暂无成员，请添加团队成员</div>
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
            backgroundColor: '#fafafa',
            borderRadius: '0 0 12px 12px',
          }}
        >
          <button
            onClick={onClose}
            style={{
              padding: '10px 24px',
              backgroundColor: '#fff',
              color: '#666',
              border: '1px solid #d9d9d9',
              borderRadius: '8px',
              fontSize: '14px',
              cursor: 'pointer',
              transition: 'all 0.2s',
              fontWeight: 500,
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
              padding: '10px 24px',
              backgroundColor: '#1890ff',
              color: '#fff',
              border: 'none',
              borderRadius: '8px',
              fontSize: '14px',
              cursor: 'pointer',
              transition: 'all 0.2s',
              fontWeight: 500,
              boxShadow: '0 2px 4px rgba(24, 144, 255, 0.3)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#40a9ff';
              e.currentTarget.style.transform = 'translateY(-1px)';
              e.currentTarget.style.boxShadow = '0 4px 8px rgba(24, 144, 255, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#1890ff';
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 2px 4px rgba(24, 144, 255, 0.3)';
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
