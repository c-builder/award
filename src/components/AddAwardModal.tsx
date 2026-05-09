import React, { useState, useEffect, useMemo } from 'react';
import { DeptCascader } from './DeptCascader';
import { Pagination } from './Pagination';
import { Award } from './types';

/**
 * 获奖人员信息
 */
export interface Recipient {
  name: string;
  employeeId: string;
  department: string;
}

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
  recipients?: Recipient[];
}

/**
 * 添加展播奖项弹窗Props
 */
export interface AddAwardModalProps {
  visible: boolean;
  onCancel: () => void;
  onConfirm: (selectedAwards: AwardItem[]) => void;
  /** 当前已存在的奖项列表（用于重复检测） */
  existingAwards?: Award[];
  /** 外部部门筛选状态（与主页面同步） */
  externalDeptPath?: string[];
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
 * 模拟获奖人员数据
 */
const MOCK_RECIPIENTS: Record<string, Recipient[]> = {
  'award-001': [
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
  ],
  'award-002': [
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
    { name: '王十二', employeeId: '00507777', department: '智能汽车解决方案部/智能驾驶组' },
    { name: '冯十三', employeeId: '00508888', department: '云与计算业务部/云计算组' },
    { name: '陈十四', employeeId: '00509999', department: 'IT平台服务部/平台开发部' },
    { name: '褚十五', employeeId: '00510000', department: '质量与流程IT部/质量部/测试组' },
    { name: '卫十六', employeeId: '00511111', department: '智能汽车解决方案部/智能驾驶组' },
    { name: '蒋十七', employeeId: '00512222', department: '云与计算业务部/云计算组' },
    { name: '沈十八', employeeId: '00513333', department: 'IT平台服务部/平台开发部' },
    { name: '韩十九', employeeId: '00514444', department: '质量与流程IT部/质量部/测试组' },
    { name: '杨二十', employeeId: '00515555', department: '智能汽车解决方案部/智能驾驶组' },
    { name: '朱二一', employeeId: '00516666', department: '云与计算业务部/云计算组' },
    { name: '秦二二', employeeId: '00517777', department: 'IT平台服务部/平台运维部' },
    { name: '尤二三', employeeId: '00518888', department: '质量与流程IT部/流程部/优化组' },
    { name: '许二四', employeeId: '00519999', department: '智能汽车解决方案部/智能座舱组' },
    { name: '何二五', employeeId: '00520000', department: '云与计算业务部/大数据组' },
    { name: '吕二六', employeeId: '00521111', department: 'IT平台服务部/技术支持部' },
    { name: '施二七', employeeId: '00522222', department: '质量与流程IT部/IT部/开发组' },
    { name: '张二八', employeeId: '00523333', department: '智能汽车解决方案部/智能驾驶组' },
    { name: '孔二九', employeeId: '00524444', department: '云与计算业务部/云计算组' },
    { name: '曹三十', employeeId: '00525555', department: 'IT平台服务部/平台开发部' },
  ],
  'award-003': [
    { name: '李山花', employeeId: '00494097', department: 'IT平台服务部/平台开发部' },
    { name: '张三', employeeId: '00501234', department: '质量与流程IT部/质量部/测试组' },
    { name: '李四', employeeId: '00505678', department: '智能汽车解决方案部/智能驾驶组' },
    { name: '王五', employeeId: '00507890', department: '云与计算业务部/云计算组' },
    { name: '赵六', employeeId: '00501111', department: 'IT平台服务部/平台运维部' },
    { name: '钱七', employeeId: '00502222', department: '质量与流程IT部/流程部/优化组' },
    { name: '孙八', employeeId: '00503333', department: '智能汽车解决方案部/智能座舱组' },
  ],
  'award-004': [
    { name: '李山花', employeeId: '00494097', department: 'IT平台服务部/平台开发部' },
    { name: '张三', employeeId: '00501234', department: '质量与流程IT部/质量部/测试组' },
    { name: '李四', employeeId: '00505678', department: '智能汽车解决方案部/智能驾驶组' },
    { name: '王五', employeeId: '00507890', department: '云与计算业务部/云计算组' },
    { name: '赵六', employeeId: '00501111', department: 'IT平台服务部/平台运维部' },
  ],
  'award-005': [
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
    { name: '王十二', employeeId: '00507777', department: '智能汽车解决方案部/智能驾驶组' },
    { name: '冯十三', employeeId: '00508888', department: '云与计算业务部/云计算组' },
    { name: '陈十四', employeeId: '00509999', department: 'IT平台服务部/平台开发部' },
    { name: '褚十五', employeeId: '00510000', department: '质量与流程IT部/质量部/测试组' },
    { name: '卫十六', employeeId: '00511111', department: '智能汽车解决方案部/智能驾驶组' },
    { name: '蒋十七', employeeId: '00512222', department: '云与计算业务部/云计算组' },
  ],
  'award-006': [
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
    { name: '王十二', employeeId: '00507777', department: '智能汽车解决方案部/智能驾驶组' },
    { name: '冯十三', employeeId: '00508888', department: '云与计算业务部/云计算组' },
    { name: '陈十四', employeeId: '00509999', department: 'IT平台服务部/平台开发部' },
    { name: '褚十五', employeeId: '00510000', department: '质量与流程IT部/质量部/测试组' },
    { name: '卫十六', employeeId: '00511111', department: '智能汽车解决方案部/智能驾驶组' },
    { name: '蒋十七', employeeId: '00512222', department: '云与计算业务部/云计算组' },
    { name: '沈十八', employeeId: '00513333', department: 'IT平台服务部/平台开发部' },
    { name: '韩十九', employeeId: '00514444', department: '质量与流程IT部/质量部/测试组' },
    { name: '杨二十', employeeId: '00515555', department: '智能汽车解决方案部/智能驾驶组' },
    { name: '朱二一', employeeId: '00516666', department: '云与计算业务部/云计算组' },
    { name: '秦二二', employeeId: '00517777', department: 'IT平台服务部/平台运维部' },
    { name: '尤二三', employeeId: '00518888', department: '质量与流程IT部/流程部/优化组' },
    { name: '许二四', employeeId: '00519999', department: '智能汽车解决方案部/智能座舱组' },
    { name: '何二五', employeeId: '00520000', department: '云与计算业务部/大数据组' },
    { name: '吕二六', employeeId: '00521111', department: 'IT平台服务部/技术支持部' },
  ],
  'award-007': [
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
    { name: '王十二', employeeId: '00507777', department: '智能汽车解决方案部/智能驾驶组' },
    { name: '冯十三', employeeId: '00508888', department: '云与计算业务部/云计算组' },
  ],
  'award-008': [
    { name: '李山花', employeeId: '00494097', department: 'IT平台服务部/平台开发部' },
    { name: '张三', employeeId: '00501234', department: '质量与流程IT部/质量部/测试组' },
    { name: '李四', employeeId: '00505678', department: '智能汽车解决方案部/智能驾驶组' },
    { name: '王五', employeeId: '00507890', department: '云与计算业务部/云计算组' },
    { name: '赵六', employeeId: '00501111', department: 'IT平台服务部/平台运维部' },
    { name: '钱七', employeeId: '00502222', department: '质量与流程IT部/流程部/优化组' },
    { name: '孙八', employeeId: '00503333', department: '智能汽车解决方案部/智能座舱组' },
    { name: '周九', employeeId: '00504444', department: '云与计算业务部/大数据组' },
  ],
  'award-009': [
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
  ],
  'award-010': [
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
    { name: '王十二', employeeId: '00507777', department: '智能汽车解决方案部/智能驾驶组' },
    { name: '冯十三', employeeId: '00508888', department: '云与计算业务部/云计算组' },
  ],
  'award-011': [
    { name: '李山花', employeeId: '00494097', department: 'IT平台服务部/平台开发部' },
    { name: '张三', employeeId: '00501234', department: '质量与流程IT部/质量部/测试组' },
    { name: '李四', employeeId: '00505678', department: '智能汽车解决方案部/智能驾驶组' },
    { name: '王五', employeeId: '00507890', department: '云与计算业务部/云计算组' },
    { name: '赵六', employeeId: '00501111', department: 'IT平台服务部/平台运维部' },
  ],
  'award-012': [
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
    { name: '王十二', employeeId: '00507777', department: '智能汽车解决方案部/智能驾驶组' },
    { name: '冯十三', employeeId: '00508888', department: '云与计算业务部/云计算组' },
    { name: '陈十四', employeeId: '00509999', department: 'IT平台服务部/平台开发部' },
    { name: '褚十五', employeeId: '00510000', department: '质量与流程IT部/质量部/测试组' },
  ],
};

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
    recipients: MOCK_RECIPIENTS['award-001'],
  },
  {
    id: 'award-002',
    name: '2025年明日之星',
    category: '个人奖',
    recipientCount: 29,
    issuingDepartment: '华为公司',
    issuingDepartmentPath: ['华为公司'],
    recipients: MOCK_RECIPIENTS['award-002'],
  },
  {
    id: 'award-003',
    name: '2025年OCC委员会4月激励奖',
    category: '团队奖',
    recipientCount: 7,
    issuingDepartment: '质量与流程IT部/质量部',
    issuingDepartmentPath: ['质量与流程IT部', '质量部'],
    recipients: MOCK_RECIPIENTS['award-003'],
  },
  {
    id: 'award-004',
    name: '2025年对首批落地短信费用治理优秀个人奖',
    category: '个人奖',
    recipientCount: 5,
    issuingDepartment: '质量与流程IT部/流程部',
    issuingDepartmentPath: ['质量与流程IT部', '流程部'],
    recipients: MOCK_RECIPIENTS['award-004'],
  },
  {
    id: 'award-005',
    name: '2025年流程IT持续改进团队及时激励奖',
    category: '团队奖',
    recipientCount: 16,
    issuingDepartment: '智能汽车解决方案部/智能驾驶组',
    issuingDepartmentPath: ['智能汽车解决方案部', '智能驾驶组'],
    recipients: MOCK_RECIPIENTS['award-005'],
  },
  {
    id: 'award-006',
    name: '2025年公有云业务部金戈奖(总裁奖)',
    category: '团队奖',
    recipientCount: 25,
    issuingDepartment: '质量与流程IT部/IT部',
    issuingDepartmentPath: ['质量与流程IT部', 'IT部'],
    recipients: MOCK_RECIPIENTS['award-006'],
  },
  {
    id: 'award-007',
    name: '2025年Q1优秀团队奖',
    category: '团队奖',
    recipientCount: 12,
    issuingDepartment: 'IT平台服务部/平台运维部',
    issuingDepartmentPath: ['IT平台服务部', '平台运维部'],
    recipients: MOCK_RECIPIENTS['award-007'],
  },
  {
    id: 'award-008',
    name: '2025年创新突破个人奖',
    category: '个人奖',
    recipientCount: 8,
    issuingDepartment: '智能汽车解决方案部/车联网组',
    issuingDepartmentPath: ['智能汽车解决方案部', '车联网组'],
    recipients: MOCK_RECIPIENTS['award-008'],
  },
  {
    id: 'award-009',
    name: '2025年优秀项目经理奖',
    category: '个人奖',
    recipientCount: 10,
    issuingDepartment: '华为公司/人力资源部',
    issuingDepartmentPath: ['华为公司', '人力资源部'],
    recipients: MOCK_RECIPIENTS['award-009'],
  },
  {
    id: 'award-010',
    name: '2025年技术创新团队奖',
    category: '团队奖',
    recipientCount: 12,
    issuingDepartment: 'IT平台服务部/平台开发部',
    issuingDepartmentPath: ['IT平台服务部', '平台开发部'],
    recipients: MOCK_RECIPIENTS['award-010'],
  },
  {
    id: 'award-011',
    name: '2025年质量之星奖',
    category: '个人奖',
    recipientCount: 5,
    issuingDepartment: '质量与流程IT部/质量部',
    issuingDepartmentPath: ['质量与流程IT部', '质量部'],
    recipients: MOCK_RECIPIENTS['award-011'],
  },
  {
    id: 'award-012',
    name: '2025年数字化转型优秀团队奖',
    category: '团队奖',
    recipientCount: 14,
    issuingDepartment: '云与计算业务部/云计算组',
    issuingDepartmentPath: ['云与计算业务部', '云计算组'],
    recipients: MOCK_RECIPIENTS['award-012'],
  },
];

/**
 * 添加展播奖项弹窗组件
 * 支持按年份、部门筛选，搜索奖项名称，选择奖项后确认添加
 * 支持行内展开查看获奖人员
 * 支持重复添加检测和已选奖项跨部门显示
 */
export const AddAwardModal: React.FC<AddAwardModalProps> = ({
  visible,
  onCancel,
  onConfirm,
  existingAwards = [],
  externalDeptPath = [],
}) => {
  // 筛选状态
  const [year, setYear] = useState<string>('2025');
  const [selectedDeptPath, setSelectedDeptPath] = useState<string[]>([]);
  const [searchKeyword, setSearchKeyword] = useState<string>('');

  // 已选奖项ID集合
  const [selectedAwardIds, setSelectedAwardIds] = useState<Set<string>>(new Set());

  // 展开的奖项ID集合
  const [expandedAwardIds, setExpandedAwardIds] = useState<Set<string>>(new Set());

  // 已存在奖项提示
  const [existingAwardAlert, setExistingAwardAlert] = useState<string | null>(null);

  // 弹窗打开时，同步外部部门筛选状态，并根据当前筛选条件初始化选中状态
  useEffect(() => {
    if (visible) {
      // 同步外部部门筛选状态
      setSelectedDeptPath(externalDeptPath);

      // 获取当前筛选条件下可见的奖项（使用外部部门筛选状态）
      const visibleAwards = MOCK_AWARDS.filter((award) => {
        // 部门筛选（使用外部部门筛选状态）
        if (externalDeptPath.length > 0) {
          const match = externalDeptPath.every((dept, index) => 
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

      // 获取已存在的自定义奖项的ID集合（只包含当前可见的）
      const customAwardIds = new Set<string>();
      existingAwards.forEach(existingAward => {
        if (existingAward.deletable) {
          // 在可见的奖项中查找对应的奖项ID
          const visibleAward = visibleAwards.find(mock => mock.name === existingAward.title);
          if (visibleAward) {
            customAwardIds.add(visibleAward.id);
          }
        }
      });
      setSelectedAwardIds(customAwardIds);
    }
  }, [visible, existingAwards, externalDeptPath, searchKeyword]);

  // 弹窗关闭时重置状态
  useEffect(() => {
    if (!visible) {
      setYear('2025');
      setSelectedDeptPath([]);
      setSearchKeyword('');
      setSelectedAwardIds(new Set());
      setExpandedAwardIds(new Set());
      setExistingAwardAlert(null);
      setCurrentPage(1);
    }
  }, [visible]);

  // 分页状态
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  // 获取已存在的默认奖项名称集合（deletable=false 的默认数据）
  const existingDefaultAwardNames = useMemo(() => {
    return new Set(existingAwards.filter(award => !award.deletable).map(award => award.title));
  }, [existingAwards]);

  // 获取已存在的自定义奖项名称集合（deletable=true 的数据）
  const existingCustomAwardNames = useMemo(() => {
    return new Set(existingAwards.filter(award => award.deletable).map(award => award.title));
  }, [existingAwards]);

  // 筛选后的奖项列表（只显示当前筛选条件下的奖项）
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

  // 分页后的奖项列表
  const paginatedAwards = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return filteredAwards.slice(startIndex, startIndex + pageSize);
  }, [filteredAwards, currentPage]);

  // 筛选条件改变时重置页码
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedDeptPath, searchKeyword]);

  // 已选奖项列表
  const selectedAwards = useMemo(() => {
    return MOCK_AWARDS.filter((award) => selectedAwardIds.has(award.id));
  }, [selectedAwardIds]);

  // 切换奖项选中状态
  const toggleAwardSelection = (awardId: string) => {
    const award = MOCK_AWARDS.find(a => a.id === awardId);
    if (!award) return;

    // 检查是否是默认数据（deletable=false），默认数据不可选中
    if (existingDefaultAwardNames.has(award.name)) {
      setExistingAwardAlert(`"${award.name}" 已存在于当前展播中`);
      // 3秒后清除提示
      setTimeout(() => setExistingAwardAlert(null), 3000);
      return;
    }

    // 其他情况（新数据或自定义数据），直接切换选中状态
    const newSelected = new Set(selectedAwardIds);
    if (newSelected.has(awardId)) {
      newSelected.delete(awardId);
    } else {
      newSelected.add(awardId);
    }
    setSelectedAwardIds(newSelected);
  };

  // 切换奖项展开状态
  const toggleAwardExpand = (awardId: string) => {
    const newExpanded = new Set(expandedAwardIds);
    if (newExpanded.has(awardId)) {
      newExpanded.delete(awardId);
    } else {
      newExpanded.add(awardId);
    }
    setExpandedAwardIds(newExpanded);
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

        {/* 重复添加提示 */}
        {existingAwardAlert && (
          <div
            style={{
              padding: '12px 24px',
              backgroundColor: '#fff2f0',
              borderBottom: '1px solid #ffccc7',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ff4d4f" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            <span style={{ fontSize: '14px', color: '#ff4d4f' }}>
              {existingAwardAlert}
            </span>
          </div>
        )}

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
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {/* 表格头部 */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '50px 2.5fr 1fr 1fr 2fr 100px',
              padding: '12px 24px',
              backgroundColor: '#fafafa',
              borderBottom: '1px solid #e8e8e8',
              fontSize: '14px',
              fontWeight: 500,
              color: '#666',
              flexShrink: 0,
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
          <div style={{ flex: 1, overflow: 'auto' }}>
            {paginatedAwards.length > 0 ? (
              paginatedAwards.map((award) => {
                const isSelected = selectedAwardIds.has(award.id);
                const isExpanded = expandedAwardIds.has(award.id);
                const recipients = award.recipients || [];
                const isDefaultExisting = existingDefaultAwardNames.has(award.name);
                const isCustomExisting = existingCustomAwardNames.has(award.name);
                // 选中状态：
                // - 默认数据（deletable=false）：只要存在就显示为选中
                // - 自定义数据（deletable=true）：根据 selectedAwardIds 决定
                const isChecked = isDefaultExisting ? true : isSelected;

                return (
                  <React.Fragment key={award.id}>
                    {/* 主行 */}
                    <div
                      style={{
                        display: 'grid',
                        gridTemplateColumns: '50px 2.5fr 1fr 1fr 2fr 100px',
                        padding: '14px 24px',
                        borderBottom: '1px solid #f0f0f0',
                        fontSize: '14px',
                        color: '#333',
                        backgroundColor: isChecked ? '#e6f7ff' : '#fff',
                        alignItems: 'center',
                        transition: 'background-color 0.2s',
                      }}
                      onMouseEnter={(e) => {
                        if (!isChecked) {
                          e.currentTarget.style.backgroundColor = '#fafafa';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!isChecked) {
                          e.currentTarget.style.backgroundColor = '#fff';
                        }
                      }}
                    >
                      {/* 多选框 */}
                      <div
                        onClick={() => !isDefaultExisting && toggleAwardSelection(award.id)}
                        style={{
                          width: '16px',
                          height: '16px',
                          borderRadius: '2px',
                          border: `2px solid ${isChecked ? '#1890ff' : '#d9d9d9'}`,
                          backgroundColor: isChecked ? '#1890ff' : '#fff',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          cursor: isDefaultExisting ? 'not-allowed' : 'pointer',
                          transition: 'all 0.2s',
                          opacity: isDefaultExisting ? 0.5 : 1,
                        }}
                      >
                        {isChecked && (
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                        )}
                      </div>

                      {/* 奖项名称 */}
                      <div
                        style={{
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                          paddingRight: '16px',
                          color: isDefaultExisting ? '#999' : '#333',
                        }}
                        title={award.name}
                      >
                        {award.name}
                      </div>

                      {/* 奖项类别 */}
                      <div style={{ color: isDefaultExisting ? '#999' : '#666' }}>{award.category}</div>

                      {/* 获奖人数 */}
                      <div style={{ color: isDefaultExisting ? '#999' : '#666' }}>{award.recipientCount}</div>

                      {/* 颁发/设立部门 */}
                      <div
                        style={{
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                          paddingRight: '16px',
                          color: isDefaultExisting ? '#999' : '#666',
                        }}
                        title={award.issuingDepartment}
                      >
                        {award.issuingDepartment}
                      </div>

                      {/* 操作 */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        {/* 查看/收起按钮 */}
                        <button
                          onClick={() => toggleAwardExpand(award.id)}
                          style={{
                            background: 'none',
                            border: 'none',
                            color: '#1890ff',
                            cursor: 'pointer',
                            fontSize: '14px',
                            padding: '0',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.color = '#40a9ff';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.color = '#1890ff';
                          }}
                        >
                          <span>{isExpanded ? '收起' : '查看'}</span>
                          <svg
                            width="12"
                            height="12"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            style={{
                              transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
                              transition: 'transform 0.2s',
                            }}
                          >
                            <polyline points="6 9 12 15 18 9" />
                          </svg>
                        </button>

                        {/* 添加/移除按钮 */}
                        {isDefaultExisting ? (
                          <span
                            style={{
                              color: '#999',
                              fontSize: '14px',
                              cursor: 'not-allowed',
                            }}
                          >
                          </span>
                        ) : isCustomExisting ? (
                          <span
                            onClick={() => toggleAwardSelection(award.id)}
                            style={{
                              color: '#ff4d4f',
                              cursor: 'pointer',
                              fontSize: '14px',
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.color = '#ff7875';
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.color = '#ff4d4f';
                            }}
                          >
                            移除
                          </span>
                        ) : isSelected ? (
                          <span
                            onClick={() => toggleAwardSelection(award.id)}
                            style={{
                              color: '#ff4d4f',
                              cursor: 'pointer',
                              fontSize: '14px',
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.color = '#ff7875';
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.color = '#ff4d4f';
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

                    {/* 展开区域 - 获奖人员列表 */}
                    {isExpanded && (
                      <div
                        style={{
                          padding: '16px 24px 16px 74px',
                          backgroundColor: '#fafafa',
                          borderBottom: '1px solid #f0f0f0',
                          animation: 'slideDown 0.2s ease-out',
                        }}
                      >
                        <div
                          style={{
                            fontSize: '14px',
                            fontWeight: 500,
                            color: '#333',
                            marginBottom: '12px',
                          }}
                        >
                          获奖人员 ({recipients.length}人):
                        </div>
                        <div
                          style={{
                            display: 'flex',
                            flexWrap: 'wrap',
                            gap: '12px',
                          }}
                        >
                          {recipients.map((recipient, index) => (
                            <div
                              key={`${recipient.employeeId}-${index}`}
                              style={{
                                padding: '10px 14px',
                                backgroundColor: '#fff',
                                border: '1px solid #e8e8e8',
                                borderRadius: '6px',
                                minWidth: '140px',
                                maxWidth: '180px',
                                transition: 'all 0.2s',
                              }}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.borderColor = '#1890ff';
                                e.currentTarget.style.boxShadow = '0 2px 8px rgba(24, 144, 255, 0.15)';
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.borderColor = '#e8e8e8';
                                e.currentTarget.style.boxShadow = 'none';
                              }}
                            >
                              <div
                                style={{
                                  fontSize: '14px',
                                  fontWeight: 500,
                                  color: '#333',
                                  marginBottom: '4px',
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis',
                                  whiteSpace: 'nowrap',
                                }}
                                title={recipient.name}
                              >
                                {recipient.name}
                              </div>
                              <div
                                style={{
                                  fontSize: '12px',
                                  color: '#666',
                                  marginBottom: '2px',
                                }}
                              >
                                {recipient.employeeId}
                              </div>
                              <div
                                style={{
                                  fontSize: '11px',
                                  color: '#999',
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis',
                                  whiteSpace: 'nowrap',
                                }}
                                title={recipient.department}
                              >
                                {recipient.department}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </React.Fragment>
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

          {/* 分页器 - 固定在表格底部 */}
          {filteredAwards.length > 0 && (
            <div
              style={{
                padding: '0 24px',
                borderTop: '1px solid #f0f0f0',
                backgroundColor: '#fff',
                flexShrink: 0,
              }}
            >
              <Pagination
                current={currentPage}
                pageSize={pageSize}
                total={filteredAwards.length}
                onChange={setCurrentPage}
              />
            </div>
          )}
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
            style={{
              padding: '9px 28px',
              backgroundColor: '#1890ff',
              color: '#fff',
              border: 'none',
              borderRadius: '4px',
              fontSize: '14px',
              cursor: 'pointer',
              transition: 'background-color 0.2s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#40a9ff';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#1890ff';
            }}
          >
            确认
          </button>
        </div>
      </div>

      {/* CSS 动画 */}
      <style>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default AddAwardModal;
