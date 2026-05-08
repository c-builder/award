import React, { useState, useMemo, useEffect } from 'react';
import { Recipient } from './types';
import { DeptCascader } from './DeptCascader';

export interface AddRecipientModalProps {
  visible: boolean;
  awardId: string;
  currentDepartment: string;
  onCancel: () => void;
  onConfirm: (selectedRecipients: Recipient[]) => void;
}

// 模拟人员数据（带完整部门路径）
const mockEmployees: Recipient[] = [
  { name: '李山花', employeeId: '00494097', department: 'IT平台服务部/平台开发部' },
  { name: '张三', employeeId: '00501234', department: '质量与流程IT部/质量部/测试组' },
  { name: '李四', employeeId: '00505678', department: '智能汽车解决方案部/智能驾驶组' },
  { name: '王五', employeeId: '00507890', department: '云与计算业务部/云计算组' },
  { name: '赵六', employeeId: '00501111', department: 'IT平台服务部/平台运维部' },
  { name: '钱七', employeeId: '00502222', department: '质量与流程IT部/流程部/优化组' },
  { name: '孙八', employeeId: '00503333', department: '智能汽车解决方案部/智能座舱组' },
  { name: '周九', employeeId: '00504444', department: '云与计算业务部/大数据组' },
  { name: '吴十', employeeId: '00505555', department: 'IT平台服务部/技术支持部' },
  { name: '郑十一', employeeId: '00506666', department: '质量与流程IT部/IT部/开发组' },
];

// 模拟已获奖项数据
const mockAwards: Record<string, string> = {
  '00494097': '半年度优秀个人奖',
  '00501111': '明日之星',
};

/**
 * 添加获奖人弹窗组件
 * 支持搜索、部门筛选、批量选择和确认添加
 */
export const AddRecipientModal: React.FC<AddRecipientModalProps> = ({
  visible,
  awardId,
  currentDepartment,
  onCancel,
  onConfirm,
}) => {
  const [searchKeyword, setSearchKeyword] = useState('');
  const [selectedDeptPath, setSelectedDeptPath] = useState<string[]>([]);
  const [selectedRecipients, setSelectedRecipients] = useState<Set<string>>(new Set());

  // 弹窗关闭时重置状态
  useEffect(() => {
    if (!visible) {
      setSearchKeyword('');
      setSelectedDeptPath([]);
      setSelectedRecipients(new Set());
    }
  }, [visible]);

  // 过滤人员列表
  const filteredEmployees = useMemo(() => {
    return mockEmployees.filter((employee) => {
      // 部门筛选 - 检查员工部门路径是否以选中的部门路径开头
      let departmentMatch = true;
      if (selectedDeptPath.length > 0) {
        const employeeDeptParts = employee.department.split('/');
        departmentMatch = selectedDeptPath.every((dept, index) => 
          employeeDeptParts[index] === dept
        );
      }
      
      // 搜索筛选（姓名或工号）
      const searchMatch = !searchKeyword || 
        employee.name.includes(searchKeyword) || 
        employee.employeeId.includes(searchKeyword);
      
      return departmentMatch && searchMatch;
    });
  }, [searchKeyword, selectedDeptPath]);

  // 切换选中状态
  const toggleSelection = (employeeId: string) => {
    const newSelected = new Set(selectedRecipients);
    if (newSelected.has(employeeId)) {
      newSelected.delete(employeeId);
    } else {
      newSelected.add(employeeId);
    }
    setSelectedRecipients(newSelected);
  }

  // 全选/取消全选
  const toggleSelectAll = () => {
    if (selectedRecipients.size === filteredEmployees.length && filteredEmployees.length > 0) {
      setSelectedRecipients(new Set());
    } else {
      const allIds = new Set(filteredEmployees.map(e => e.employeeId));
      setSelectedRecipients(allIds);
    }
  };

  // 重置筛选
  const handleReset = () => {
    setSearchKeyword('');
    setSelectedDeptPath([]);
  };

  // 确认添加
  const handleConfirm = () => {
    const selectedList = mockEmployees.filter(e => selectedRecipients.has(e.employeeId));
    onConfirm(selectedList);
  };

  // 获取已选择人员名称列表
  const selectedNames = useMemo(() => {
    return mockEmployees
      .filter(e => selectedRecipients.has(e.employeeId))
      .map(e => e.name);
  }, [selectedRecipients]);

  // 判断是否为跨部门人员
  const isCrossDepartment = (department: string) => {
    const currentDeptParts = currentDepartment.split('/');
    const deptParts = department.split('/');
    return deptParts[0] !== currentDeptParts[0];
  };

  if (!visible) return null;

  return (
    <div
      className="modal-overlay"
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
        className="modal-content"
        style={{
          backgroundColor: '#fff',
          borderRadius: '8px',
          width: '700px',
          maxHeight: '80vh',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* 弹窗标题 */}
        <div
          className="modal-header"
          style={{
            padding: '16px 24px',
            borderBottom: '1px solid #f0f0f0',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <h3
            style={{
              margin: 0,
              fontSize: '16px',
              fontWeight: 500,
              color: '#333',
            }}
          >
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

        {/* 筛选区域 */}
        <div
          className="modal-filter"
          style={{
            padding: '16px 24px',
            display: 'flex',
            gap: '12px',
            alignItems: 'center',
            flexWrap: 'wrap',
          }}
        >
          {/* 搜索框 */}
          <input
            type="text"
            placeholder="搜索姓名/工号"
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
            style={{
              padding: '6px 12px',
              border: '1px solid #d9d9d9',
              borderRadius: '4px',
              fontSize: '14px',
              width: '180px',
              outline: 'none',
            }}
          />

          {/* 部门级联选择器 */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '14px', color: '#666' }}>部门:</span>
            <DeptCascader
              value={selectedDeptPath}
              onChange={(value) => setSelectedDeptPath(value)}
              placeholder="全部部门"
            />
          </div>

          {/* 查询按钮 */}
          <button
            onClick={() => {}}
            style={{
              padding: '6px 16px',
              backgroundColor: '#1890ff',
              color: '#fff',
              border: 'none',
              borderRadius: '4px',
              fontSize: '14px',
              cursor: 'pointer',
            }}
          >
            查询
          </button>

          {/* 重置按钮 */}
          <button
            onClick={handleReset}
            style={{
              padding: '6px 16px',
              backgroundColor: '#fff',
              color: '#666',
              border: '1px solid #d9d9d9',
              borderRadius: '4px',
              fontSize: '14px',
              cursor: 'pointer',
            }}
          >
            重置
          </button>
        </div>

        {/* 表格区域 */}
        <div
          className="modal-body"
          style={{
            flex: 1,
            overflow: 'auto',
            padding: '0 24px',
          }}
        >
          <table
            style={{
              width: '100%',
              borderCollapse: 'collapse',
              fontSize: '14px',
            }}
          >
            <thead>
              <tr
                style={{
                  backgroundColor: '#fafafa',
                  borderBottom: '1px solid #f0f0f0',
                }}
              >
                <th
                  style={{
                    padding: '12px 8px',
                    textAlign: 'left',
                    fontWeight: 500,
                    color: '#666',
                    width: '50px',
                  }}
                >
                  <input
                    type="checkbox"
                    checked={filteredEmployees.length > 0 && selectedRecipients.size === filteredEmployees.length}
                    onChange={toggleSelectAll}
                    style={{ cursor: 'pointer' }}
                  />
                </th>
                <th
                  style={{
                    padding: '12px 8px',
                    textAlign: 'left',
                    fontWeight: 500,
                    color: '#666',
                  }}
                >
                  姓名
                </th>
                <th
                  style={{
                    padding: '12px 8px',
                    textAlign: 'left',
                    fontWeight: 500,
                    color: '#666',
                  }}
                >
                  工号
                </th>
                <th
                  style={{
                    padding: '12px 8px',
                    textAlign: 'left',
                    fontWeight: 500,
                    color: '#666',
                  }}
                >
                  部门
                </th>
                <th
                  style={{
                    padding: '12px 8px',
                    textAlign: 'left',
                    fontWeight: 500,
                    color: '#666',
                  }}
                >
                  已获奖项
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredEmployees.map((employee, index) => {
                const isSelected = selectedRecipients.has(employee.employeeId);
                const isCrossDept = isCrossDepartment(employee.department);
                const award = mockAwards[employee.employeeId] || '-';

                return (
                  <tr
                    key={employee.employeeId}
                    style={{
                      borderBottom: '1px solid #f0f0f0',
                      backgroundColor: index % 2 === 0 ? '#fff' : '#fafafa',
                    }}
                  >
                    <td style={{ padding: '12px 8px' }}>
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleSelection(employee.employeeId)}
                        style={{ cursor: 'pointer' }}
                      />
                    </td>
                    <td style={{ padding: '12px 8px', color: '#333' }}>
                      {employee.name}
                    </td>
                    <td style={{ padding: '12px 8px', color: '#666' }}>
                      {employee.employeeId}
                    </td>
                    <td
                      style={{
                        padding: '12px 8px',
                        color: isCrossDept ? '#1890ff' : '#666',
                      }}
                    >
                      {employee.department}
                    </td>
                    <td style={{ padding: '12px 8px', color: '#666' }}>
                      {award}
                    </td>
                  </tr>
                );
              })}
              {filteredEmployees.length === 0 && (
                <tr>
                  <td
                    colSpan={5}
                    style={{
                      padding: '48px 24px',
                      textAlign: 'center',
                      color: '#999',
                    }}
                  >
                    暂无数据
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* 已选择摘要 */}
        {selectedNames.length > 0 && (
          <div
            className="modal-summary"
            style={{
              padding: '12px 24px',
              borderTop: '1px solid #f0f0f0',
              fontSize: '14px',
              color: '#666',
            }}
          >
            <span>已选择: </span>
            <span style={{ color: '#333' }}>{selectedNames.join('、')}</span>
          </div>
        )}

        {/* 底部按钮 */}
        <div
          className="modal-footer"
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
            disabled={selectedRecipients.size === 0}
            style={{
              padding: '8px 24px',
              backgroundColor: selectedRecipients.size === 0 ? '#d9d9d9' : '#1890ff',
              color: '#fff',
              border: 'none',
              borderRadius: '4px',
              fontSize: '14px',
              cursor: selectedRecipients.size === 0 ? 'not-allowed' : 'pointer',
            }}
          >
            确认
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddRecipientModal;
