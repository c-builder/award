import React, { useState, useRef, useEffect } from 'react';

export type DataRangeOption = 'all' | 'my' | 'specific';

export interface DataRangeFilterProps {
  value?: DataRangeOption;
  onChange?: (value: DataRangeOption, specificDept?: string, specificDeptPath?: string[]) => void;
  className?: string;
  myDepartment?: string;
  myDepartmentPath?: string[];
}

interface Option {
  value: DataRangeOption;
  label: string;
}

const options: Option[] = [
  { value: 'all', label: '全部部门' },
  { value: 'my', label: '我的部门' },
  { value: 'specific', label: '指定部门' },
];

// 多级部门数据结构
interface DepartmentNode {
  name: string;
  children?: DepartmentNode[];
}

const departmentTree: DepartmentNode[] = [
  {
    name: '质量与流程IT部',
    children: [
      {
        name: '质量部',
        children: [
          { name: '测试组' },
          { name: '评审组' },
          { name: '认证组' },
        ],
      },
      {
        name: '流程部',
        children: [
          { name: '优化组' },
          { name: '标准组' },
        ],
      },
      {
        name: 'IT部',
        children: [
          { name: '开发组' },
          { name: '运维组' },
        ],
      },
    ],
  },
  {
    name: 'IT平台服务部',
    children: [
      { name: '平台开发部' },
      { name: '平台运维部' },
      { name: '技术支持部' },
    ],
  },
  {
    name: '智能汽车解决方案部',
    children: [
      { name: '智能驾驶组' },
      { name: '智能座舱组' },
      { name: '车联网组' },
    ],
  },
  {
    name: '云与计算业务部',
    children: [
      { name: '云计算组' },
      { name: '大数据组' },
      { name: 'AI组' },
    ],
  },
  {
    name: '华为公司',
    children: [
      { name: '人力资源部' },
      { name: '财务部' },
      { name: '行政部' },
    ],
  },
];

export const DataRangeFilter: React.FC<DataRangeFilterProps> = ({
  value = 'all',
  onChange,
  className = '',
  myDepartmentPath = ['IT平台服务部'],
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [specificDeptSearch, setSpecificDeptSearch] = useState('');
  const [_selectedSpecificDept, setSelectedSpecificDept] = useState<string>('');
  const [selectedPath, setSelectedPath] = useState<string[]>([]);
  const [showSpecificPanel, setShowSpecificPanel] = useState(false);
  const [cascadeLevel, setCascadeLevel] = useState(0);
  const [currentCascadePath, setCurrentCascadePath] = useState<string[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const specificInputRef = useRef<HTMLInputElement>(null);

  // 获取显示的标签
  const getDisplayLabel = () => {
    switch (value) {
      case 'all':
        return '全部部门';
      case 'my':
        return myDepartmentPath.join('/');
      case 'specific':
        return selectedPath.length > 0 ? selectedPath.join('/') : '请选择部门';
      default:
        return '全部部门';
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setShowSpecificPanel(false);
        setCascadeLevel(0);
        setCurrentCascadePath([]);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // 当显示指定部门面板时，自动聚焦搜索框
  useEffect(() => {
    if (showSpecificPanel && specificInputRef.current && cascadeLevel === 0) {
      setTimeout(() => specificInputRef.current?.focus(), 100);
    }
  }, [showSpecificPanel, cascadeLevel]);

  const handleSelect = (optionValue: DataRangeOption) => {
    if (optionValue === 'specific') {
      setShowSpecificPanel(true);
      setCascadeLevel(0);
      setCurrentCascadePath([]);
    } else {
      onChange?.(optionValue, undefined, optionValue === 'my' ? myDepartmentPath : undefined);
      setIsOpen(false);
      setShowSpecificPanel(false);
      setSelectedSpecificDept('');
      setSelectedPath([]);
      setSpecificDeptSearch('');
    }
  };

  const handleSpecificDeptSelect = (_dept: string, path: string[]) => {
    // 保存完整路径
    setSelectedSpecificDept(path.join('/'));
    setSelectedPath(path);
    setShowSpecificPanel(false);
    setIsOpen(false);
    setCascadeLevel(0);
    setCurrentCascadePath([]);
    onChange?.('specific', path.join('/'), path);
  };

  const handleBackToMain = () => {
    if (cascadeLevel > 0) {
      setCascadeLevel(cascadeLevel - 1);
      setCurrentCascadePath(currentCascadePath.slice(0, -1));
    } else {
      setShowSpecificPanel(false);
      setSpecificDeptSearch('');
    }
  };

  const handleDeptClick = (dept: string, hasChildren: boolean) => {
    const newPath = [...currentCascadePath, dept];
    if (hasChildren) {
      setCascadeLevel(cascadeLevel + 1);
      setCurrentCascadePath(newPath);
    } else {
      handleSpecificDeptSelect(dept, newPath);
    }
  };

  // 获取当前层级的部门列表
  const getCurrentLevelDepts = (): { node: DepartmentNode; path: string[] }[] => {
    let current = departmentTree;
    const path: string[] = [];

    for (const deptName of currentCascadePath) {
      const found = current.find(d => d.name === deptName);
      if (found?.children) {
        current = found.children;
        path.push(deptName);
      }
    }

    return current.map(node => ({
      node,
      path: [...path, node.name],
    }));
  };

  // 搜索部门（扁平化搜索）
  const searchDepartments = (): { node: DepartmentNode; path: string[] }[] => {
    const results: { node: DepartmentNode; path: string[] }[] = [];

    const searchRecursive = (nodes: DepartmentNode[], currentPath: string[]) => {
      for (const node of nodes) {
        const newPath = [...currentPath, node.name];
        if (node.name.toLowerCase().includes(specificDeptSearch.toLowerCase())) {
          results.push({ node, path: newPath });
        }
        if (node.children) {
          searchRecursive(node.children, newPath);
        }
      }
    };

    searchRecursive(departmentTree, []);
    return results;
  };

  const currentLevelDepts = cascadeLevel === 0 && specificDeptSearch
    ? searchDepartments()
    : getCurrentLevelDepts().map(({ node, path }) => ({ node, path }));

  // 面包屑路径显示
  const getBreadcrumbText = () => {
    if (currentCascadePath.length === 0) {
      return '选择部门';
    }
    return currentCascadePath.join(' / ');
  };

  return (
    <div
      ref={containerRef}
      className={`data-range-filter ${className}`}
      style={{
        position: 'relative',
        display: 'inline-block',
      }}
    >
      {/* 触发器 */}
      <div
        className="data-range-trigger"
        onClick={() => {
          setIsOpen(!isOpen);
          setShowSpecificPanel(false);
          setCascadeLevel(0);
          setCurrentCascadePath([]);
        }}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
          padding: '6px 12px',
          backgroundColor: '#fff',
          border: '1px solid #d9d9d9',
          borderRadius: '4px',
          cursor: 'pointer',
          fontSize: '14px',
          color: '#333',
          transition: 'all 0.2s',
          minWidth: '200px',
        }}
        role="combobox"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
      >
        <span style={{ color: '#666', whiteSpace: 'nowrap' }}>数据范围:</span>
        <span 
          style={{ 
            fontWeight: 500,
            color: value === 'specific' && selectedPath.length === 0 ? '#999' : '#333',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            maxWidth: '200px',
          }}
        >
          {getDisplayLabel()}
        </span>
        <span
          style={{
            marginLeft: 'auto',
            transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform 0.2s',
            fontSize: '12px',
            color: '#666',
          }}
        >
          ▼
        </span>
      </div>

      {/* 下拉菜单容器 */}
      {isOpen && (
        <div
          className="data-range-dropdown-container"
          style={{
            position: 'absolute',
            top: '100%',
            right: 0,
            marginTop: '4px',
            backgroundColor: '#fff',
            border: '1px solid #d9d9d9',
            borderRadius: '4px',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
            zIndex: 1000,
            minWidth: showSpecificPanel ? '440px' : '200px',
            display: 'flex',
          }}
          role="listbox"
        >
          {/* 主选项列表 */}
          <div
            className="data-range-main-panel"
            style={{
              minWidth: '200px',
              borderRight: showSpecificPanel ? '1px solid #f0f0f0' : 'none',
            }}
          >
            {options.map((option) => (
              <div
                key={option.value}
                className={`data-range-option ${value === option.value ? 'selected' : ''}`}
                onClick={() => handleSelect(option.value)}
                style={{
                  padding: '10px 12px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  color: value === option.value ? '#1890ff' : '#333',
                  backgroundColor: value === option.value ? '#e6f7ff' : '#fff',
                  transition: 'all 0.2s',
                  borderBottom: '1px solid #f0f0f0',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
                onMouseEnter={(e) => {
                  if (value !== option.value) {
                    e.currentTarget.style.backgroundColor = '#f5f5f5';
                  }
                }}
                onMouseLeave={(e) => {
                  if (value !== option.value) {
                    e.currentTarget.style.backgroundColor = '#fff';
                  }
                }}
                role="option"
                aria-selected={value === option.value}
              >
                <span>{option.label}</span>
                {option.value === 'specific' && (
                  <span style={{ fontSize: '12px', color: '#999' }}>›</span>
                )}
              </div>
            ))}
          </div>

          {/* 指定部门级联面板 */}
          {showSpecificPanel && (
            <div
              className="data-range-specific-panel"
              style={{
                width: '240px',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              {/* 面板头部 */}
              <div
                style={{
                  padding: '10px 12px',
                  borderBottom: '1px solid #f0f0f0',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
              >
                <button
                  onClick={handleBackToMain}
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: '14px',
                    color: '#666',
                    padding: '0',
                  }}
                >
                  ‹
                </button>
                <span 
                  style={{ 
                    fontSize: '14px', 
                    fontWeight: 500, 
                    color: '#333',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    flex: 1,
                  }}
                  title={getBreadcrumbText()}
                >
                  {getBreadcrumbText()}
                </span>
              </div>

              {/* 搜索框（仅在第一级显示） */}
              {cascadeLevel === 0 && (
                <div style={{ padding: '10px 12px', borderBottom: '1px solid #f0f0f0' }}>
                  <input
                    ref={specificInputRef}
                    type="text"
                    placeholder="搜索部门..."
                    value={specificDeptSearch}
                    onChange={(e) => setSpecificDeptSearch(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '6px 10px',
                      border: '1px solid #d9d9d9',
                      borderRadius: '4px',
                      fontSize: '13px',
                      outline: 'none',
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Escape') {
                        handleBackToMain();
                      }
                    }}
                  />
                </div>
              )}

              {/* 部门列表 */}
              <div style={{ maxHeight: '240px', overflow: 'auto', flex: 1 }}>
                {currentLevelDepts.length > 0 ? (
                  currentLevelDepts.map(({ node, path }) => {
                    const hasChildren = node.children && node.children.length > 0;
                    const isSelected = selectedPath.join('/') === path.join('/');
                    
                    return (
                      <div
                        key={node.name}
                        onClick={() => handleDeptClick(node.name, !!hasChildren)}
                        style={{
                          padding: '10px 12px',
                          cursor: 'pointer',
                          fontSize: '13px',
                          color: isSelected ? '#1890ff' : '#333',
                          backgroundColor: isSelected ? '#e6f7ff' : '#fff',
                          transition: 'all 0.2s',
                          borderBottom: '1px solid #f0f0f0',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                        }}
                        onMouseEnter={(e) => {
                          if (!isSelected) {
                            e.currentTarget.style.backgroundColor = '#f5f5f5';
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (!isSelected) {
                            e.currentTarget.style.backgroundColor = '#fff';
                          }
                        }}
                        title={path.join(' / ')}
                      >
                        <span 
                          style={{
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                            flex: 1,
                          }}
                        >
                          {cascadeLevel === 0 && specificDeptSearch ? (
                            <span>
                              <span style={{ color: '#999' }}>{path.slice(0, -1).join(' / ')}</span>
                              {path.length > 1 && <span style={{ color: '#999' }}> / </span>}
                              <span>{node.name}</span>
                            </span>
                          ) : (
                            node.name
                          )}
                        </span>
                        {hasChildren && (
                          <span style={{ fontSize: '12px', color: '#999', marginLeft: '8px' }}>›</span>
                        )}
                      </div>
                    );
                  })
                ) : (
                  <div
                    style={{
                      padding: '20px 12px',
                      textAlign: 'center',
                      color: '#999',
                      fontSize: '13px',
                    }}
                  >
                    未找到匹配的部门
                  </div>
                )}
              </div>

              {/* 快速选择当前层级（仅在有路径时显示） */}
              {currentCascadePath.length > 0 && (
                <div
                  style={{
                    padding: '8px 12px',
                    borderTop: '1px solid #f0f0f0',
                    backgroundColor: '#fafafa',
                  }}
                >
                  <button
                    onClick={() => handleSpecificDeptSelect(
                      currentCascadePath[currentCascadePath.length - 1],
                      currentCascadePath
                    )}
                    style={{
                      width: '100%',
                      padding: '6px 0',
                      backgroundColor: '#1890ff',
                      border: 'none',
                      borderRadius: '4px',
                      color: '#fff',
                      fontSize: '13px',
                      cursor: 'pointer',
                    }}
                  >
                    选择当前部门: {currentCascadePath[currentCascadePath.length - 1]}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default DataRangeFilter;
