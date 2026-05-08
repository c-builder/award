import React, { useState, useEffect, useMemo } from 'react';
import { DeptCascader } from './DeptCascader';

/**
 * 奖项类别
 */
export type AwardCategory = '个人奖' | '团队奖';

/**
 * 奖项项
 */
export interface AwardItem {
  id: string;
  name: string;
  category: AwardCategory;
  recipientCount: number;
  issuingDepartment: string;
  issuingDepartmentPath: string[];
}

/**
 * 添加展播奖项弹窗Props
 */
export interface AddAwardModalProps {
  visible: boolean;
  onCancel: () => void;
  onConfirm: (selectedAwards: AwardItem[]) => void;
}

/**
 * 年份选项
 */
const YEAR_OPTIONS = [
  { value: '2025', label: '2025年' },
  { value: '2024', label: '2024年' },
  { value: '2023', label: '2023年' },
];

/**
 * 模拟奖项数据 - 跨部门数据（带完整部门路径）
 */
const MOCK_AWARDS: AwardItem[] = [
  {
    id: 'award-001',
    name: '2025年半年度优秀个人奖',
    category: '个人奖',
    recipientCount: 10,
    issuingDepartment: 'IT平台服务部/平台开发部',
    issuingDepartmentPath: ['IT平台服务部', '平台开发部'],
  },
  {
    id: 'award-002',
    name: '2025年明日之星',
    category: '个人奖',
    recipientCount: 29,
    issuingDepartment: '华为公司',
    issuingDepartmentPath: ['华为公司'],
  },
  {
    id: 'award-003',
    name: '2025年OCC委员会4月激励奖',
    category: '团队奖',
    recipientCount: 7,
    issuingDepartment: '质量与流程IT部/质量部',
    issuingDepartmentPath: ['质量与流程IT部', '质量部'],
  },
  {
    id: 'award-004',
    name: '2025年对首批落地短信费用治理优秀个人奖',
    category: '个人奖',
    recipientCount: 5,
    issuingDepartment: '质量与流程IT部/流程部',
    issuingDepartmentPath: ['质量与流程IT部', '流程部'],
  },
  {
    id: 'award-005',
    name: '2025年流程IT持续改进团队及时激励奖',
    category: '团队奖',
    recipientCount: 16,
    issuingDepartment: '智能汽车解决方案部/智能驾驶组',
    issuingDepartmentPath: ['智能汽车解决方案部', '智能驾驶组'],
  },
  {
    id: 'award-006',
    name: '2025年公有云业务部金戈奖(总裁奖)',
    category: '团队奖',
    recipientCount: 25,
    issuingDepartment: '质量与流程IT部/IT部',
    issuingDepartmentPath: ['质量与流程IT部', 'IT部'],
  },
  {
    id: 'award-007',
    name: '2025年Q1优秀团队奖',
    category: '团队奖',
    recipientCount: 12,
    issuingDepartment: 'IT平台服务部/平台运维部',
    issuingDepartmentPath: ['IT平台服务部', '平台运维部'],
  },
  {
    id: 'award-008',
    name: '2025年创新突破个人奖',
    category: '个人奖',
    recipientCount: 8,
    issuingDepartment: '智能汽车解决方案部/车联网组',
    issuingDepartmentPath: ['智能汽车解决方案部', '车联网组'],
  },
];

/**
 * 添加展播奖项弹窗组件
 * 支持按年份、部门筛选，搜索奖项名称，选择奖项后确认添加
 */
export const AddAwardModal: React.FC<AddAwardModalProps> = ({
  visible,
  onCancel,
  onConfirm,
}) => {
  // 筛选状态
  const [year, setYear] = useState<string>('2025');
  const [selectedDeptPath, setSelectedDeptPath] = useState<string[]>([]);
  const [searchKeyword, setSearchKeyword] = useState<string>('');

  // 已选奖项ID集合
  const [selectedAwardIds, setSelectedAwardIds] = useState<Set<string>>(new Set());

  // 弹窗关闭时重置状态
  useEffect(() => {
    if (!visible) {
      setYear('2025');
      setSelectedDeptPath([]);
      setSearchKeyword('');
      setSelectedAwardIds(new Set());
    }
  }, [visible]);

  // 筛选后的奖项列表
  const filteredAwards = useMemo(() => {
    return MOCK_AWARDS.filter((award) => {
      // 部门筛选 - 检查奖项部门路径是否以选中的部门路径开头
      if (selectedDeptPath.length > 0) {
        const match = selectedDeptPath.every((dept, index) => 
          award.issuingDepartmentPath[index] === dept
        );
        if (!match) return false;
      }
      // 搜索关键词筛选
      if (searchKeyword && !award.name.toLowerCase().includes(searchKeyword.toLowerCase())) {
        return false;
      }
      return true;
    });
  }, [selectedDeptPath, searchKeyword]);

  // 已选奖项列表
  const selectedAwards = useMemo(() => {
    return MOCK_AWARDS.filter((award) => selectedAwardIds.has(award.id));
  }, [selectedAwardIds]);

  // 切换奖项选中状态
  const toggleAwardSelection = (awardId: string) => {
    const newSelected = new Set(selectedAwardIds);
    if (newSelected.has(awardId)) {
      newSelected.delete(awardId);
    } else {
      newSelected.add(awardId);
    }
    setSelectedAwardIds(newSelected);
  };

  // 移除已选奖项
  const removeSelectedAward = (awardId: string) => {
    const newSelected = new Set(selectedAwardIds);
    newSelected.delete(awardId);
    setSelectedAwardIds(newSelected);
  };

  // 重置筛选条件
  const handleReset = () => {
    setYear('2025');
    setSelectedDeptPath([]);
    setSearchKeyword('');
  };

  // 确认添加
  const handleConfirm = () => {
    const selectedList = MOCK_AWARDS.filter((award) => selectedAwardIds.has(award.id));
    onConfirm(selectedList);
  };

  // 处理搜索框回车事件
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      // 回车时触发查询（这里已经实时筛选，可以添加额外逻辑）
    }
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
          width: '900px',
          maxHeight: '85vh',
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
            添加展播奖项
          </h3>
          <div style={{ display: 'flex', gap: '12px' }}>
            {/* 关闭按钮 */}
            <button
              onClick={onCancel}
              style={{
                background: 'none',
                border: '1px solid #d9d9d9',
                borderRadius: '4px',
                fontSize: '14px',
                color: '#666',
                cursor: 'pointer',
                padding: '4px 8px',
                lineHeight: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
              title="关闭"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>
        </div>

        {/* 筛选栏 */}
        <div
          className="modal-filter"
          style={{
            padding: '16px 24px',
            borderBottom: '1px solid #f0f0f0',
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
          }}
        >
          {/* 年份筛选 */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '14px', color: '#333', whiteSpace: 'nowrap' }}>年份:</span>
            <select
              value={year}
              onChange={(e) => setYear(e.target.value)}
              style={{
                padding: '6px 12px',
                border: '1px solid #d9d9d9',
                borderRadius: '4px',
                fontSize: '14px',
                backgroundColor: '#fff',
                cursor: 'pointer',
                outline: 'none',
                minWidth: '100px',
              }}
            >
              {YEAR_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* 部门级联选择器 */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '14px', color: '#333', whiteSpace: 'nowrap' }}>部门:</span>
            <DeptCascader
              value={selectedDeptPath}
              onChange={(value) => setSelectedDeptPath(value)}
              placeholder="全部部门"
            />
          </div>

          {/* 搜索框 */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1 }}>
            <input
              type="text"
              placeholder="请输入奖项名称"
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              onKeyDown={handleKeyDown}
              style={{
                padding: '6px 12px',
                border: '1px solid #d9d9d9',
                borderRadius: '4px',
                fontSize: '14px',
                flex: 1,
                maxWidth: '200px',
                outline: 'none',
                transition: 'border-color 0.3s',
              }}
              onFocus={(e) => {
                e.target.style.borderColor = '#1890ff';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = '#d9d9d9';
              }}
            />
          </div>

          {/* 查询按钮 */}
          <button
            onClick={() => {}}
            style={{
              padding: '6px 20px',
              backgroundColor: '#1890ff',
              color: '#fff',
              border: 'none',
              borderRadius: '4px',
              fontSize: '14px',
              cursor: 'pointer',
              transition: 'background-color 0.3s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#40a9ff';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#1890ff';
            }}
          >
            查询
          </button>

          {/* 重置按钮 */}
          <button
            onClick={handleReset}
            style={{
              padding: '6px 20px',
              backgroundColor: '#fff',
              color: '#666',
              border: '1px solid #d9d9d9',
              borderRadius: '4px',
              fontSize: '14px',
              cursor: 'pointer',
              transition: 'all 0.3s',
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
            重置
          </button>
        </div>

        {/* 表格区域 */}
        <div
          className="modal-body"
          style={{
            flex: 1,
            overflow: 'auto',
            padding: '0',
          }}
        >
          {/* 表格头部 */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '50px 2.5fr 1fr 1fr 2fr 80px',
              padding: '12px 24px',
              backgroundColor: '#fafafa',
              borderBottom: '1px solid #e8e8e8',
              fontSize: '14px',
              fontWeight: 500,
              color: '#666',
            }}
          >
            <div></div>
            <div>奖项名称</div>
            <div>奖项类别</div>
            <div>获奖人数</div>
            <div>颁发/设立部门</div>
            <div>操作</div>
          </div>

          {/* 表格内容 */}
          <div>
            {filteredAwards.length > 0 ? (
              filteredAwards.map((award) => {
                const isSelected = selectedAwardIds.has(award.id);
                return (
                  <div
                    key={award.id}
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '50px 2.5fr 1fr 1fr 2fr 80px',
                      padding: '14px 24px',
                      borderBottom: '1px solid #f0f0f0',
                      fontSize: '14px',
                      color: '#333',
                      backgroundColor: isSelected ? '#e6f7ff' : '#fff',
                      alignItems: 'center',
                      transition: 'background-color 0.2s',
                    }}
                    onMouseEnter={(e) => {
                      if (!isSelected) {
                        e.currentTarget.style.backgroundColor = '#fafafa';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isSelected) {
                        e.currentTarget.style.backgroundColor = '#fff';
                      }
                    }}
                  >
                    {/* 单选框 */}
                    <div
                      onClick={() => toggleAwardSelection(award.id)}
                      style={{
                        width: '16px',
                        height: '16px',
                        borderRadius: '50%',
                        border: `2px solid ${isSelected ? '#1890ff' : '#d9d9d9'}`,
                        backgroundColor: isSelected ? '#1890ff' : '#fff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                      }}
                    >
                      {isSelected && (
                        <div
                          style={{
                            width: '6px',
                            height: '6px',
                            borderRadius: '50%',
                            backgroundColor: '#fff',
                          }}
                        />
                      )}
                    </div>

                    {/* 奖项名称 */}
                    <div
                      style={{
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        paddingRight: '16px',
                        color: '#333',
                      }}
                      title={award.name}
                    >
                      {award.name}
                    </div>

                    {/* 奖项类别 */}
                    <div style={{ color: '#666' }}>{award.category}</div>

                    {/* 获奖人数 */}
                    <div style={{ color: '#666' }}>{award.recipientCount}</div>

                    {/* 颁发/设立部门 */}
                    <div
                      style={{
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        paddingRight: '16px',
                        color: '#666',
                      }}
                      title={award.issuingDepartment}
                    >
                      {award.issuingDepartment}
                    </div>

                    {/* 操作 */}
                    <div>
                      {isSelected ? (
                        <span
                          onClick={() => toggleAwardSelection(award.id)}
                          style={{
                            color: '#999',
                            cursor: 'pointer',
                            fontSize: '14px',
                          }}
                        >
                          移除
                        </span>
                      ) : (
                        <span
                          onClick={() => toggleAwardSelection(award.id)}
                          style={{
                            color: '#1890ff',
                            cursor: 'pointer',
                            fontSize: '14px',
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.color = '#40a9ff';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.color = '#1890ff';
                          }}
                        >
                          添加
                        </span>
                      )}
                    </div>
                  </div>
                );
              })
            ) : (
              <div
                style={{
                  padding: '48px 24px',
                  textAlign: 'center',
                  color: '#999',
                  fontSize: '14px',
                }}
              >
                暂无符合条件的奖项
              </div>
            )}
          </div>
        </div>

        {/* 已添加奖项区域 */}
        {selectedAwards.length > 0 && (
          <div
            className="modal-selected"
            style={{
              padding: '12px 24px',
              borderTop: '1px solid #f0f0f0',
              backgroundColor: '#fafafa',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '12px',
              flexWrap: 'wrap',
            }}
          >
            <span
              style={{
                fontSize: '14px',
                color: '#666',
                whiteSpace: 'nowrap',
                paddingTop: '4px',
              }}
            >
              已添加:
            </span>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', flex: 1 }}>
              {selectedAwards.map((award) => (
                <div
                  key={award.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    padding: '4px 12px',
                    backgroundColor: '#fff',
                    border: '1px solid #d9d9d9',
                    borderRadius: '4px',
                    fontSize: '13px',
                    color: '#333',
                  }}
                >
                  <span
                    style={{
                      maxWidth: '150px',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                    title={award.name}
                  >
                    {award.name}
                  </span>
                  <button
                    onClick={() => removeSelectedAward(award.id)}
                    style={{
                      background: 'none',
                      border: 'none',
                      padding: '0',
                      marginLeft: '4px',
                      cursor: 'pointer',
                      color: '#999',
                      fontSize: '14px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: '16px',
                      height: '16px',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = '#ff4d4f';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = '#999';
                    }}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
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
              padding: '9px 28px',
              backgroundColor: '#fff',
              color: '#666',
              border: '1px solid #d9d9d9',
              borderRadius: '4px',
              fontSize: '14px',
              cursor: 'pointer',
              transition: 'all 0.2s',
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
            disabled={selectedAwardIds.size === 0}
            style={{
              padding: '9px 28px',
              backgroundColor: selectedAwardIds.size === 0 ? '#d9d9d9' : '#1890ff',
              color: '#fff',
              border: 'none',
              borderRadius: '4px',
              fontSize: '14px',
              cursor: selectedAwardIds.size === 0 ? 'not-allowed' : 'pointer',
              transition: 'background-color 0.2s',
            }}
            onMouseEnter={(e) => {
              if (selectedAwardIds.size > 0) {
                e.currentTarget.style.backgroundColor = '#40a9ff';
              }
            }}
            onMouseLeave={(e) => {
              if (selectedAwardIds.size > 0) {
                e.currentTarget.style.backgroundColor = '#1890ff';
              }
            }}
          >
            确认
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddAwardModal;
