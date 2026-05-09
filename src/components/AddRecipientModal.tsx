import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Recipient, Award } from './types';
import { DeptCascader } from './DeptCascader';
import { Pagination } from './Pagination';

export interface AddRecipientModalProps {
  visible: boolean;
  currentDepartment?: string;
  currentAward?: Award;
  existingRecipients?: Recipient[];
  onCancel: () => void;
  onConfirm: (selectedRecipients: Recipient[]) => void;
}

const PAGE_SIZE = 10;

export const AddRecipientModal: React.FC<AddRecipientModalProps> = ({
  visible,
  currentDepartment = '',
  currentAward,
  existingRecipients = [],
  onCancel,
  onConfirm,
}) => {
  const [searchText, setSearchText] = useState('');
  const [selectedDeptPath, setSelectedDeptPath] = useState<string[]>([]);
  const [selectedRecipients, setSelectedRecipients] = useState<Recipient[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const headerCheckboxRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (visible) {
      setSearchText('');
      setSelectedDeptPath([]);
      setSelectedRecipients([]);
      setCurrentPage(1);
    }
  }, [visible]);

  const employeePool = useMemo(() => {
    if (!currentAward) return [];
    return currentAward.recipients.map(r => ({
      name: r.name,
      employeeId: r.employeeId,
      department: r.department,
    }));
  }, [currentAward]);

  const isSelected = (employeeId: string) => {
    return selectedRecipients.some(r => r.employeeId === employeeId);
  };

  const isExisting = (employeeId: string) => {
    return existingRecipients.some(r => {
      if (r.employeeId !== employeeId) return false;
      if (!currentDepartment) return true;
      const dept = r.department.split('/')[0];
      return dept === currentDepartment || r.isManuallyAdded;
    });
  };

  const filteredEmployees = useMemo(() => {
    return employeePool.filter(emp => {
      const matchSearch = !searchText || 
        emp.name.toLowerCase().includes(searchText.toLowerCase()) ||
        emp.employeeId.includes(searchText);
      
      let matchDept = true;
      if (selectedDeptPath.length > 0) {
        const deptParts = emp.department.split('/');
        matchDept = selectedDeptPath.every((dept, index) => deptParts[index] === dept);
      }
      
      return matchSearch && matchDept;
    });
  }, [employeePool, searchText, selectedDeptPath]);

  const selectableEmployees = useMemo(() => {
    return filteredEmployees.filter(e => !isExisting(e.employeeId));
  }, [filteredEmployees, existingRecipients, currentDepartment]);

  const selectedCount = useMemo(() => {
    return selectableEmployees.filter(e => isSelected(e.employeeId)).length;
  }, [selectableEmployees, selectedRecipients]);

  const isAllSelected = selectableEmployees.length > 0 && selectedCount === selectableEmployees.length;
  const isIndeterminate = selectedCount > 0 && selectedCount < selectableEmployees.length;
  const isHeaderDisabled = selectableEmployees.length === 0;

  useEffect(() => {
    if (headerCheckboxRef.current) {
      headerCheckboxRef.current.indeterminate = isIndeterminate;
    }
  }, [isIndeterminate]);

  const paginatedEmployees = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return filteredEmployees.slice(start, start + PAGE_SIZE);
  }, [filteredEmployees, currentPage]);

  const toggleSelection = (recipient: Recipient) => {
    if (isExisting(recipient.employeeId)) return;
    
    if (isSelected(recipient.employeeId)) {
      setSelectedRecipients(prev => prev.filter(r => r.employeeId !== recipient.employeeId));
    } else {
      setSelectedRecipients(prev => [...prev, { ...recipient, isSelected: true }]);
    }
  };

  const handleConfirm = () => {
    onConfirm(selectedRecipients);
  };

  const handleReset = () => {
    setSearchText('');
    setSelectedDeptPath([]);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
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
          width: '900px',
          maxHeight: '80vh',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* 标题栏 */}
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
            添加获奖人{currentAward ? ` - ${currentAward.title}` : ''}
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

        {/* 搜索栏 */}
        <div
          style={{
            padding: '16px 24px',
            borderBottom: '1px solid #f0f0f0',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
          }}
        >
          <input
            type="text"
            placeholder="搜索姓名/工号"
            value={searchText}
            onChange={(e) => { setSearchText(e.target.value); setCurrentPage(1); }}
            style={{
              padding: '8px 12px',
              border: '1px solid #d9d9d9',
              borderRadius: '4px',
              fontSize: '14px',
              width: '180px',
              outline: 'none',
            }}
          />
          <span style={{ color: '#666', fontSize: '14px' }}>部门:</span>
          <DeptCascader
            value={selectedDeptPath}
            onChange={(value) => { setSelectedDeptPath(value); setCurrentPage(1); }}
            placeholder="全部部门"
          />
          <button
            style={{
              padding: '8px 20px',
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
          <button
            onClick={handleReset}
            style={{
              padding: '8px 20px',
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

        {/* 内容区域 */}
        <div style={{ flex: 1, overflow: 'auto', display: 'flex', flexDirection: 'column' }}>
          {/* 表格 */}
          <div style={{ flex: 1, overflow: 'auto', padding: '16px 0' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ backgroundColor: '#fafafa' }}>
                  <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 500, color: '#333', borderBottom: '1px solid #f0f0f0', width: '40px' }}>
                    <input
                      ref={headerCheckboxRef}
                      type="checkbox"
                      checked={isAllSelected}
                      disabled={isHeaderDisabled}
                      onChange={() => {
                        if (isAllSelected) {
                          setSelectedRecipients(prev => prev.filter(r => !selectableEmployees.some(e => e.employeeId === r.employeeId)));
                        } else {
                          setSelectedRecipients(prev => {
                            const existingIds = new Set(prev.map(r => r.employeeId));
                            const toAdd = selectableEmployees.filter(e => !existingIds.has(e.employeeId)).map(e => ({ ...e, isSelected: true }));
                            return [...prev, ...toAdd];
                          });
                        }
                      }}
                      style={{ cursor: isHeaderDisabled ? 'not-allowed' : 'pointer' }}
                    />
                  </th>
                  <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 500, color: '#333', borderBottom: '1px solid #f0f0f0' }}>姓名</th>
                  <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 500, color: '#333', borderBottom: '1px solid #f0f0f0' }}>工号</th>
                  <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 500, color: '#333', borderBottom: '1px solid #f0f0f0' }}>部门</th>
                  <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 500, color: '#333', borderBottom: '1px solid #f0f0f0' }}>状态</th>
                </tr>
              </thead>
              <tbody>
                {paginatedEmployees.map((emp) => {
                  const selected = isSelected(emp.employeeId);
                  const existing = isExisting(emp.employeeId);
                  return (
                    <tr
                      key={emp.employeeId}
                      style={{
                        backgroundColor: selected ? '#e6f7ff' : 'transparent',
                        cursor: existing ? 'not-allowed' : 'pointer',
                        opacity: existing ? 0.6 : 1,
                      }}
                      onClick={() => toggleSelection(emp)}
                    >
                      <td style={{ padding: '12px 16px', borderBottom: '1px solid #f0f0f0' }}>
                        <input
                          type="checkbox"
                          checked={selected}
                          disabled={existing}
                          onChange={() => {}}
                          style={{ cursor: existing ? 'not-allowed' : 'pointer' }}
                        />
                      </td>
                      <td style={{ padding: '12px 16px', borderBottom: '1px solid #f0f0f0', color: '#333' }}>
                        {emp.name}
                      </td>
                      <td style={{ padding: '12px 16px', borderBottom: '1px solid #f0f0f0', color: '#666', fontFamily: 'monospace' }}>{emp.employeeId}</td>
                      <td style={{ padding: '12px 16px', borderBottom: '1px solid #f0f0f0', color: '#666' }}>{emp.department}</td>
                      <td style={{ padding: '12px 16px', borderBottom: '1px solid #f0f0f0', color: '#666' }}>
                        {existing ? (
                          <span style={{ fontSize: '12px', color: '#999', backgroundColor: '#f5f5f5', padding: '2px 8px', borderRadius: '3px' }}>已添加</span>
                        ) : selected ? (
                          <span style={{ fontSize: '12px', color: '#1890ff', backgroundColor: '#e6f7ff', padding: '2px 8px', borderRadius: '3px' }}>已选中</span>
                        ) : null}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* 分页器 */}
          <div style={{ padding: '0 24px', borderTop: '1px solid #f0f0f0', flexShrink: 0 }}>
            <Pagination
              current={currentPage}
              pageSize={PAGE_SIZE}
              total={filteredEmployees.length}
              onChange={handlePageChange}
              showTotal
            />
          </div>

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
            确认
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddRecipientModal;
