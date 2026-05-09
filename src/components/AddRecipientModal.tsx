import React, { useState, useEffect } from 'react';
import { Recipient } from './types';

export interface AddRecipientModalProps {
  visible: boolean;
  currentDepartment: string;
  existingRecipients?: Recipient[];
  onCancel: () => void;
  onConfirm: (selectedRecipients: Recipient[]) => void;
}

export const AddRecipientModal: React.FC<AddRecipientModalProps> = ({
  visible,
  currentDepartment,
  existingRecipients = [],
  onCancel,
  onConfirm,
}) => {
  const [employeeId, setEmployeeId] = useState('');
  const [queryResult, setQueryResult] = useState<Recipient | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedRecipients, setSelectedRecipients] = useState<Recipient[]>([]);

  useEffect(() => {
    if (!visible) {
      setEmployeeId('');
      setQueryResult(null);
      setError('');
      setLoading(false);
      setSelectedRecipients([]);
    }
  }, [visible]);

  const mockEmployeeData: Record<string, Recipient> = {
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
    '00558888': { name: '袁六三', employeeId: '00558888', department: 'IT平台服务部/平台开发部' },
  };

  // 检查员工是否已存在于当前奖项中
  const isExistingRecipient = (employeeId: string) => {
    return existingRecipients.some(r => r.employeeId === employeeId);
  };

  const handleQuery = async () => {
    if (!employeeId.trim()) {
      setError('请输入工号');
      return;
    }
    setLoading(true);
    setError('');
    setQueryResult(null);
    await new Promise(resolve => setTimeout(resolve, 500));
    const employee = mockEmployeeData[employeeId.trim()];
    if (!employee) {
      setError('未找到该工号对应的员工');
    } else {
      setQueryResult(employee);
    }
    setLoading(false);
  };

  const handleAddToSelected = () => {
    if (!queryResult) return;
    if (selectedRecipients.some(r => r.employeeId === queryResult.employeeId)) {
      setError('该员工已在列表中');
      return;
    }
    setSelectedRecipients([...selectedRecipients, queryResult]);
    setQueryResult(null);
    setEmployeeId('');
  };

  const handleRemoveFromSelected = (empId: string) => {
    setSelectedRecipients(selectedRecipients.filter(r => r.employeeId !== empId));
  };

  const handleConfirm = () => {
    if (selectedRecipients.length === 0) {
      setError('请至少添加一个获奖人');
      return;
    }
    onConfirm(selectedRecipients);
  };

  const isCrossDepartment = (department: string) => {
    const currentDeptParts = currentDepartment.split('/');
    const deptParts = department.split('/');
    return deptParts[0] !== currentDeptParts[0];
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
            添加获奖人
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

        <div
          style={{
            padding: '24px',
            borderBottom: '1px solid #f0f0f0',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
            <input
              type="text"
              placeholder="请输入工号"
              value={employeeId}
              onChange={(e) => setEmployeeId(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleQuery()}
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
              disabled={loading}
              style={{
                padding: '8px 20px',
                backgroundColor: '#1890ff',
                color: '#fff',
                border: 'none',
                borderRadius: '4px',
                fontSize: '14px',
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.7 : 1,
              }}
            >
              {loading ? '查询中...' : '查询'}
            </button>
          </div>

          {error && (
            <div
              style={{
                padding: '12px',
                backgroundColor: '#fff2f0',
                border: '1px solid #ffccc7',
                borderRadius: '4px',
                color: '#ff4d4f',
                fontSize: '14px',
                marginBottom: '16px',
              }}
            >
              {error}
            </div>
          )}

          {queryResult && (
            <div
              style={{
                padding: '16px',
                backgroundColor: isExistingRecipient(queryResult.employeeId) ? '#fff7e6' : '#f6ffed',
                border: `1px solid ${isExistingRecipient(queryResult.employeeId) ? '#ffd591' : '#b7eb8f'}`,
                borderRadius: '6px',
                marginBottom: '16px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ fontSize: '15px', fontWeight: 500, color: '#333', marginBottom: '4px' }}>
                    {queryResult.name}
                    {isCrossDepartment(queryResult.department) && (
                      <span
                        style={{
                          marginLeft: '8px',
                          padding: '2px 6px',
                          backgroundColor: '#1890ff',
                          color: '#fff',
                          fontSize: '11px',
                          borderRadius: '3px',
                        }}
                      >
                        跨
                      </span>
                    )}

                  </div>
                  <div style={{ fontSize: '13px', color: '#666' }}>
                    工号: {queryResult.employeeId} | 部门: {queryResult.department}
                  </div>
                </div>
                <button
                  onClick={handleAddToSelected}
                  disabled={isExistingRecipient(queryResult.employeeId)}
                  style={{
                    padding: '6px 16px',
                    backgroundColor: isExistingRecipient(queryResult.employeeId) ? '#d9d9d9' : '#52c41a',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '4px',
                    fontSize: '14px',
                    cursor: isExistingRecipient(queryResult.employeeId) ? 'not-allowed' : 'pointer',
                  }}
                >
                  {isExistingRecipient(queryResult.employeeId) ? '已存在' : '+ 添加'}
                </button>
              </div>
            </div>
          )}
        </div>

        <div
          style={{
            flex: 1,
            overflow: 'auto',
            padding: '0 24px',
          }}
        >
          <div
            style={{
              padding: '12px 0',
              fontSize: '14px',
              fontWeight: 500,
              color: '#333',
              borderBottom: '1px solid #f0f0f0',
            }}
          >
            已添加列表 ({selectedRecipients.length})
          </div>

          {selectedRecipients.length === 0 ? (
            <div
              style={{
                padding: '88px 24px',
                textAlign: 'center',
                color: '#999',
                fontSize: '14px',
              }}
            >
              <div style={{ fontSize: '13px', marginTop: '8px' }}>请通过工号查询添加获奖人</div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', padding: '12px 0' }}>
              {selectedRecipients.map((recipient) => (
                <div
                  key={recipient.employeeId}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '12px 16px',
                    backgroundColor: '#f8fafc',
                    border: '1px solid #e2e8f0',
                    borderRadius: '6px',
                  }}
                >
                  <div>
                    <div style={{ fontSize: '14px', fontWeight: 500, color: '#333' }}>
                      {recipient.name}
                      {isCrossDepartment(recipient.department) && (
                        <span
                          style={{
                            marginLeft: '8px',
                            padding: '2px 6px',
                            backgroundColor: '#1890ff',
                            color: '#fff',
                            fontSize: '10px',
                            borderRadius: '3px',
                          }}
                        >
                          跨
                        </span>
                      )}
                    </div>
                    <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '2px' }}>
                      {recipient.employeeId} | {recipient.department}
                    </div>
                  </div>
                  <button
                    onClick={() => handleRemoveFromSelected(recipient.employeeId)}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#ff4d4f',
                      fontSize: '18px',
                      cursor: 'pointer',
                      padding: '4px',
                    }}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

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
            onClick={onCancel}
            style={{
              padding: '8px 24px',
              backgroundColor: '#fff',
              color: '#666',
              border: '1px solid #d9d9d9',
              borderRadius: '4px',
              fontSize: '14px',
              cursor: 'pointer',
            }}
          >
            取消
          </button>
          <button
            onClick={handleConfirm}
            disabled={selectedRecipients.length === 0}
            style={{
              padding: '8px 24px',
              backgroundColor: selectedRecipients.length === 0 ? '#d9d9d9' : '#1890ff',
              color: '#fff',
              border: 'none',
              borderRadius: '4px',
              fontSize: '14px',
              cursor: selectedRecipients.length === 0 ? 'not-allowed' : 'pointer',
            }}
          >
            确认 ({selectedRecipients.length})
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddRecipientModal;
