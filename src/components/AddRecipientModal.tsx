import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Recipient, Award } from './types';
import { DeptCascader } from './DeptCascader';
import { Pagination } from './Pagination';

export interface AddRecipientModalProps {
  visible: boolean;
  currentDepartment?: string;
  currentAward?: Award;
  allRecipients?: Recipient[];
  selectedRecipients?: Recipient[];
  onCancel: () => void;
  onConfirm: (selectedRecipients: Recipient[]) => void;
}

const DEFAULT_PAGE_SIZE = 10;

export const AddRecipientModal: React.FC<AddRecipientModalProps> = ({
  visible,
  currentAward,
  allRecipients = [],
  onCancel,
  onConfirm,
}) => {
  const [searchText, setSearchText] = useState('');
  const [selectedDeptPath, setSelectedDeptPath] = useState<string[]>([]);
  const [selectedRecipients, setSelectedRecipients] = useState<Recipient[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);
  const headerCheckboxRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (visible) {
      setSearchText('');
      setSelectedDeptPath([]);
      // 初始化时，根据 allRecipients 中的 isSelected 状态设置选中
      const initiallySelected = allRecipients.filter(r => r.isSelected).map(r => ({ ...r }));
      setSelectedRecipients(initiallySelected);
      setCurrentPage(1);
      setPageSize(DEFAULT_PAGE_SIZE);
    }
  }, [visible, allRecipients]);

  const employeePool = useMemo(() => {
    return allRecipients.map(r => ({
      name: r.name,
      employeeId: r.employeeId,
      department: r.department,
      isSelected: r.isSelected,
    }));
  }, [allRecipients]);

  const isSelected = (employeeId: string) => {
    return selectedRecipients.some(r => r.employeeId === employeeId);
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

  // 所有员工都可以选择
  const selectableEmployees = useMemo(() => {
    return filteredEmployees;
  }, [filteredEmployees]);

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
    const start = (currentPage - 1) * pageSize;
    return filteredEmployees.slice(start, start + pageSize);
  }, [filteredEmployees, currentPage, pageSize]);

  const toggleSelection = (recipient: Recipient) => {
    const selected = isSelected(recipient.employeeId);

    if (selected) {
      // 取消勾选
      setSelectedRecipients(prev => prev.filter(r => r.employeeId !== recipient.employeeId));
    } else {
      // 勾选
      setSelectedRecipients(prev => [...prev, { ...recipient }]);
    }
  };

  const handleConfirm = () => {
    // 保存时只返回当前选中的获奖人
    onConfirm(selectedRecipients);
  };

  const handleReset = () => {
    setSearchText('');
    setSelectedDeptPath([]);
    setCurrentPage(1);
    setPageSize(DEFAULT_PAGE_SIZE);
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
        overflow: 'hidden',
        overscrollBehavior: 'contain',
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
            编辑获奖人{currentAward ? ` - ${currentAward.title}` : ''}
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
        <div style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column', overscrollBehavior: 'contain' }}>
          {/* 表格 */}
          <div style={{ flex: 1, overflow: 'auto', padding: '16px 0' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead style={{ position: 'sticky', top: 0, zIndex: 10 }}>
                <tr style={{ backgroundColor: '#fafafa' }}>
                  <th style={{ padding: '12px 16px', textAlign: 'center', fontWeight: 500, color: '#333', borderBottom: '1px solid #f0f0f0', width: '60px' }}>
                    <div
                      onClick={() => {
                        if (isHeaderDisabled) return;
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
                      style={{
                        width: '18px',
                        height: '18px',
                        border: `2px solid ${isHeaderDisabled ? '#d9d9d9' : isAllSelected || isIndeterminate ? '#1890ff' : '#d9d9d9'}`,
                        borderRadius: '3px',
                        backgroundColor: isAllSelected || isIndeterminate ? '#1890ff' : '#fff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto',
                        cursor: isHeaderDisabled ? 'not-allowed' : 'pointer',
                        transition: 'all 0.2s',
                        opacity: isHeaderDisabled ? 0.5 : 1,
                      }}
                    >
                      {isAllSelected ? (
                        <svg
                          width="12"
                          height="12"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="#fff"
                          strokeWidth="3"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      ) : isIndeterminate ? (
                        <div
                          style={{
                            width: '10px',
                            height: '2px',
                            backgroundColor: '#fff',
                            borderRadius: '1px',
                          }}
                        />
                      ) : null}
                    </div>
                  </th>
                  <th style={{ padding: '12px 16px', textAlign: 'center', fontWeight: 500, color: '#333', borderBottom: '1px solid #f0f0f0', width: '80px' }}>序号</th>
                  <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 500, color: '#333', borderBottom: '1px solid #f0f0f0' }}>姓名</th>
                  <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 500, color: '#333', borderBottom: '1px solid #f0f0f0' }}>工号</th>
                  <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 500, color: '#333', borderBottom: '1px solid #f0f0f0' }}>部门</th>
                </tr>
              </thead>
              <tbody>
                {paginatedEmployees.map((emp, index) => {
                  const selected = isSelected(emp.employeeId);
                  const seq = (currentPage - 1) * pageSize + index + 1;
                  return (
                    <tr
                      key={emp.employeeId}
                      style={{
                        backgroundColor: selected ? '#e6f7ff' : 'transparent',
                        cursor: 'pointer',
                      }}
                      onClick={() => toggleSelection(emp)}
                    >
                      <td style={{ padding: '12px 16px', borderBottom: '1px solid #f0f0f0', textAlign: 'center' }}>
                        <div
                          style={{
                            width: '18px',
                            height: '18px',
                            border: `2px solid ${selected ? '#1890ff' : '#d9d9d9'}`,
                            borderRadius: '3px',
                            backgroundColor: selected ? '#1890ff' : '#fff',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            margin: '0 auto',
                            transition: 'all 0.2s',
                          }}
                        >
                          {selected && (
                            <svg
                              width="12"
                              height="12"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="#fff"
                              strokeWidth="3"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <polyline points="20 6 9 17 4 12" />
                            </svg>
                          )}
                        </div>
                      </td>
                      <td style={{ padding: '12px 16px', borderBottom: '1px solid #f0f0f0', textAlign: 'center', color: '#666' }}>
                        {seq}
                      </td>
                      <td style={{ padding: '12px 16px', borderBottom: '1px solid #f0f0f0', color: '#333' }}>
                        {emp.name}
                      </td>
                      <td style={{ padding: '12px 16px', borderBottom: '1px solid #f0f0f0', color: '#666', fontFamily: 'monospace' }}>{emp.employeeId}</td>
                      <td style={{ padding: '12px 16px', borderBottom: '1px solid #f0f0f0', color: '#666' }}>{emp.department}</td>
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
              pageSize={pageSize}
              total={filteredEmployees.length}
              onChange={handlePageChange}
              onPageSizeChange={(size) => { setPageSize(size); setCurrentPage(1); }}
              showTotal
              showPageSize
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
            style={{
              padding: '8px 24px',
              backgroundColor: '#1890ff',
              color: '#fff',
              border: 'none',
              borderRadius: '4px',
              fontSize: '14px',
              cursor: 'pointer',
            }}
          >
            保存
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddRecipientModal;
