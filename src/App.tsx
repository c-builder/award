import React, { useState, useMemo } from 'react';
import {
  AwardCard,
  DataRangeFilter,
  AddRecipientModal,
  TeamSearchModal,
  AddAwardModal,
} from './components';
import { Award } from './components/types';

// 模拟奖项数据
const mockAwards: Award[] = [
  {
    id: '2',
    title: '2025年明日之星',
    issuingDepartment: '华为公司',
    awardType: 'individual',
    recipients: [
      { name: '李山花', employeeId: '00494097', department: '华为公司', isSelected: true },
      { name: '王五', employeeId: '00507890', department: '华为公司', isSelected: true },
      { name: '赵六', employeeId: '00501111', department: '华为公司', isSelected: true },
      { name: '张三', employeeId: '00501234', department: '质量与流程IT部/质量部/测试组', isSelected: true },
      { name: '李四', employeeId: '00505678', department: '智能汽车解决方案部/智能驾驶组', isSelected: true },
      { name: '钱七', employeeId: '00502222', department: '质量与流程IT部/流程部/优化组', isSelected: true },
      { name: '孙八', employeeId: '00503333', department: '智能汽车解决方案部/智能座舱组', isSelected: true },
      { name: '周九', employeeId: '00504444', department: '云与计算业务部/大数据组', isSelected: true },
      { name: '吴十', employeeId: '00505555', department: 'IT平台服务部/技术支持部', isSelected: true },
      { name: '郑十一', employeeId: '00506666', department: '质量与流程IT部/IT部/开发组', isSelected: true },
      { name: '王十二', employeeId: '00507777', department: '智能汽车解决方案部/智能驾驶组', isSelected: true },
      { name: '冯十三', employeeId: '00508888', department: '云与计算业务部/云计算组', isSelected: true },
      { name: '陈十四', employeeId: '00509999', department: 'IT平台服务部/平台开发部', isSelected: true },
      { name: '褚十五', employeeId: '00510000', department: '质量与流程IT部/质量部/测试组', isSelected: true },
      { name: '卫十六', employeeId: '00511111', department: '智能汽车解决方案部/智能座舱组', isSelected: true },
      { name: '蒋十七', employeeId: '00512222', department: '云与计算业务部/大数据组', isSelected: true },
      { name: '沈十八', employeeId: '00513333', department: 'IT平台服务部/平台运维部', isSelected: true },
      { name: '韩十九', employeeId: '00514444', department: '质量与流程IT部/流程部/优化组', isSelected: true },
      { name: '杨二十', employeeId: '00515555', department: '智能汽车解决方案部/智能驾驶组', isSelected: true },
      { name: '朱二一', employeeId: '00516666', department: '云与计算业务部/云计算组', isSelected: true },
      { name: '秦二二', employeeId: '00517777', department: 'IT平台服务部/平台开发部', isSelected: true },
      { name: '尤二三', employeeId: '00518888', department: '质量与流程IT部/IT部/开发组', isSelected: true },
      { name: '许二四', employeeId: '00519999', department: '智能汽车解决方案部/智能座舱组', isSelected: true },
      { name: '何二五', employeeId: '00520000', department: '云与计算业务部/大数据组', isSelected: true },
      { name: '吕二六', employeeId: '00521111', department: 'IT平台服务部/技术支持部', isSelected: true },
      { name: '施二七', employeeId: '00522222', department: '质量与流程IT部/质量部/测试组', isSelected: true },
      { name: '张二八', employeeId: '00523333', department: '智能汽车解决方案部/智能驾驶组', isSelected: true },
      { name: '孔二九', employeeId: '00524444', department: '云与计算业务部/云计算组', isSelected: true },
      { name: '曹三十', employeeId: '00525555', department: 'IT平台服务部/平台运维部', isSelected: true },
      { name: '严三一', employeeId: '00526666', department: '质量与流程IT部/流程部/优化组', isSelected: true },
      { name: '华三二', employeeId: '00527777', department: 'IT平台服务部/平台开发部', isSelected: true },
      { name: '金三三', employeeId: '00528888', department: '质量与流程IT部/IT部/开发组', isSelected: true },
      { name: '魏三四', employeeId: '00529999', department: '智能汽车解决方案部/智能座舱组', isSelected: true },
      { name: '陶三五', employeeId: '00530000', department: '云与计算业务部/大数据组', isSelected: true },
      { name: '姜三六', employeeId: '00531111', department: 'IT平台服务部/技术支持部', isSelected: true },
      { name: '戚三七', employeeId: '00532222', department: '质量与流程IT部/质量部/测试组', isSelected: true },
      { name: '谢三八', employeeId: '00533333', department: '智能汽车解决方案部/智能驾驶组', isSelected: true },
      { name: '邹三九', employeeId: '00534444', department: '云与计算业务部/云计算组', isSelected: true },
      { name: '喻四十', employeeId: '00535555', department: 'IT平台服务部/平台运维部', isSelected: true },
      { name: '柏四一', employeeId: '00536666', department: '质量与流程IT部/流程部/优化组', isSelected: true },
      { name: '水四二', employeeId: '00537777', department: 'IT平台服务部/平台开发部', isSelected: true },
      { name: '窦四三', employeeId: '00538888', department: '质量与流程IT部/IT部/开发组', isSelected: true },
      { name: '章四四', employeeId: '00539999', department: '智能汽车解决方案部/智能座舱组', isSelected: true },
      { name: '云四五', employeeId: '00540000', department: '云与计算业务部/大数据组', isSelected: true },
      { name: '苏四六', employeeId: '00541111', department: 'IT平台服务部/技术支持部', isSelected: true },
      { name: '潘四七', employeeId: '00542222', department: '质量与流程IT部/质量部/测试组', isSelected: true },
      { name: '葛四八', employeeId: '00543333', department: '智能汽车解决方案部/智能驾驶组', isSelected: true },
      { name: '奚四九', employeeId: '00544444', department: '云与计算业务部/云计算组', isSelected: true },
      { name: '范五十', employeeId: '00545555', department: 'IT平台服务部/平台运维部', isSelected: true },
      { name: '彭五一', employeeId: '00546666', department: '质量与流程IT部/流程部/优化组', isSelected: true },
      { name: '郎五二', employeeId: '00547777', department: 'IT平台服务部/平台开发部', isSelected: true },
      { name: '鲁五三', employeeId: '00548888', department: '质量与流程IT部/IT部/开发组', isSelected: true },
      { name: '韦五四', employeeId: '00549999', department: '智能汽车解决方案部/智能座舱组', isSelected: true },
      { name: '昌五五', employeeId: '00550000', department: '云与计算业务部/大数据组', isSelected: true },
      { name: '马五六', employeeId: '00551111', department: 'IT平台服务部/技术支持部', isSelected: true },
      { name: '苗五七', employeeId: '00552222', department: '质量与流程IT部/质量部/测试组', isSelected: true },
      { name: '凤五八', employeeId: '00553333', department: '智能汽车解决方案部/智能驾驶组', isSelected: true },
      { name: '花五九', employeeId: '00554444', department: '云与计算业务部/云计算组', isSelected: true },
      { name: '方六十', employeeId: '00555555', department: 'IT平台服务部/平台运维部', isSelected: true },
      { name: '俞六一', employeeId: '00556666', department: '质量与流程IT部/流程部/优化组', isSelected: true },
      { name: '任六二', employeeId: '00557777', department: 'IT平台服务部/平台开发部', isSelected: true },
    ],
  },
  {
    id: '3',
    title: '2025年OCC委员会2025年4月激励奖项',
    issuingDepartment: '质量与流程IT质量与运营部',
    awardType: 'team',
    recipients: [],
    teams: [
      {
        id: 'team-001',
        name: '新员工OCC实践培训优秀团队',
        leaderName: '赵六',
        leaderId: '00501111',
        memberCount: 10,
        isSelected: true,
        members: [
          { name: '李山花', employeeId: '00494097', department: 'IT平台服务部/平台开发部', role: '组长' },
          { name: '张三', employeeId: '00501234', department: '质量与流程IT部/质量部/测试组' },
          { name: '李四', employeeId: '00505678', department: '智能汽车解决方案部/智能驾驶组' },
          { name: '王五', employeeId: '00507890', department: '云与计算业务部/云计算组' },
          { name: '赵六', employeeId: '00501111', department: 'IT平台服务部/平台运维部' },
          { name: '钱七', employeeId: '00502222', department: '质量与流程IT部/质量部/测试组' },
          { name: '孙八', employeeId: '00503333', department: '智能汽车解决方案部/智能驾驶组' },
          { name: '周九', employeeId: '00504444', department: '云与计算业务部/云计算组' },
          { name: '吴十', employeeId: '00505555', department: 'IT平台服务部/平台开发部' },
          { name: '郑十一', employeeId: '00506666', department: '质量与流程IT部/质量部/测试组' },
        ],
      },
      {
        id: 'team-002',
        name: 'CIO值班优秀团队',
        leaderName: '钱七',
        leaderId: '00502222',
        memberCount: 8,
        isSelected: true,
        members: [
          { name: '王五', employeeId: '00507890', department: '云与计算业务部/云计算组', role: '值班长' },
          { name: '赵六', employeeId: '00501111', department: 'IT平台服务部/平台运维部' },
          { name: '钱七', employeeId: '00502222', department: '质量与流程IT部/质量部/测试组' },
          { name: '孙八', employeeId: '00503333', department: '智能汽车解决方案部/智能驾驶组' },
          { name: '周九', employeeId: '00504444', department: '云与计算业务部/云计算组' },
          { name: '吴十', employeeId: '00505555', department: 'IT平台服务部/平台开发部' },
          { name: '郑十一', employeeId: '00506666', department: '质量与流程IT部/质量部/测试组' },
          { name: '王十二', employeeId: '00507777', department: '智能汽车解决方案部/智能驾驶组' },
        ],
      },
      {
        id: 'team-003',
        name: 'OCC委员会和OCC运营大会组织优秀团队',
        leaderName: '孙八',
        leaderId: '00503333',
        memberCount: 12,
        isSelected: true,
        members: [
          { name: '李山花', employeeId: '00494097', department: 'IT平台服务部/平台开发部' },
          { name: '张三', employeeId: '00501234', department: '质量与流程IT部/质量部/测试组' },
          { name: '李四', employeeId: '00505678', department: '智能汽车解决方案部/智能驾驶组' },
          { name: '王五', employeeId: '00507890', department: '云与计算业务部/云计算组' },
          { name: '赵六', employeeId: '00501111', department: 'IT平台服务部/平台运维部' },
          { name: '钱七', employeeId: '00502222', department: '质量与流程IT部/质量部/测试组' },
          { name: '孙八', employeeId: '00503333', department: '智能汽车解决方案部/智能驾驶组' },
          { name: '周九', employeeId: '00504444', department: '云与计算业务部/云计算组' },
          { name: '吴十', employeeId: '00505555', department: 'IT平台服务部/平台开发部' },
          { name: '郑十一', employeeId: '00506666', department: '质量与流程IT部/质量部/测试组' },
          { name: '王十二', employeeId: '00507777', department: '智能汽车解决方案部/智能驾驶组' },
          { name: '冯十三', employeeId: '00508888', department: '云与计算业务部/云计算组' },
        ],
      },
      {
        id: 'team-004',
        name: 'OCC模式复制构建及推广优秀团队',
        leaderName: '周九',
        leaderId: '00504444',
        memberCount: 6,
        isSelected: true,
        members: [
          { name: '李山花', employeeId: '00494097', department: 'IT平台服务部/平台开发部' },
          { name: '张三', employeeId: '00501234', department: '质量与流程IT部/质量部/测试组' },
          { name: '李四', employeeId: '00505678', department: '智能汽车解决方案部/智能驾驶组' },
          { name: '王五', employeeId: '00507890', department: '云与计算业务部/云计算组' },
          { name: '赵六', employeeId: '00501111', department: 'IT平台服务部/平台运维部' },
          { name: '钱七', employeeId: '00502222', department: '质量与流程IT部/质量部/测试组' },
        ],
      },
    ],
  },
  {
    id: '4',
    title: '2025年Q1优秀团队奖',
    issuingDepartment: 'IT平台服务部',
    awardType: 'team',
    recipients: [],
    teams: [
      {
        id: 'team-005',
        name: '平台架构优化团队',
        leaderName: '李山花',
        leaderId: '00494097',
        memberCount: 15,
        isSelected: true,
        members: [
          { name: '李山花', employeeId: '00494097', department: 'IT平台服务部/平台开发部', role: '架构师' },
          { name: '张三', employeeId: '00501234', department: '质量与流程IT部/质量部/测试组' },
          { name: '李四', employeeId: '00505678', department: '智能汽车解决方案部/智能驾驶组' },
          { name: '王五', employeeId: '00507890', department: '云与计算业务部/云计算组' },
          { name: '赵六', employeeId: '00501111', department: 'IT平台服务部/平台运维部' },
          { name: '钱七', employeeId: '00502222', department: '质量与流程IT部/质量部/测试组' },
          { name: '孙八', employeeId: '00503333', department: '智能汽车解决方案部/智能驾驶组' },
          { name: '周九', employeeId: '00504444', department: '云与计算业务部/云计算组' },
          { name: '吴十', employeeId: '00505555', department: 'IT平台服务部/平台开发部' },
          { name: '郑十一', employeeId: '00506666', department: '质量与流程IT部/质量部/测试组' },
          { name: '王十二', employeeId: '00507777', department: '智能汽车解决方案部/智能驾驶组' },
          { name: '冯十三', employeeId: '00508888', department: '云与计算业务部/云计算组' },
          { name: '陈十四', employeeId: '00509999', department: 'IT平台服务部/平台开发部' },
          { name: '褚十五', employeeId: '00510000', department: '质量与流程IT部/质量部/测试组' },
          { name: '卫十六', employeeId: '00511111', department: '智能汽车解决方案部/智能驾驶组' },
        ],
      },
      {
        id: 'team-006',
        name: 'DevOps转型推进团队',
        leaderName: '赵六',
        leaderId: '00501111',
        memberCount: 20,
        isSelected: true,
        members: [
          { name: '李山花', employeeId: '00494097', department: 'IT平台服务部/平台开发部' },
          { name: '张三', employeeId: '00501234', department: '质量与流程IT部/质量部/测试组' },
          { name: '李四', employeeId: '00505678', department: '智能汽车解决方案部/智能驾驶组' },
          { name: '王五', employeeId: '00507890', department: '云与计算业务部/云计算组' },
          { name: '赵六', employeeId: '00501111', department: 'IT平台服务部/平台运维部', role: '负责人' },
          { name: '钱七', employeeId: '00502222', department: '质量与流程IT部/质量部/测试组' },
          { name: '孙八', employeeId: '00503333', department: '智能汽车解决方案部/智能驾驶组' },
          { name: '周九', employeeId: '00504444', department: '云与计算业务部/云计算组' },
          { name: '吴十', employeeId: '00505555', department: 'IT平台服务部/平台开发部' },
          { name: '郑十一', employeeId: '00506666', department: '质量与流程IT部/质量部/测试组' },
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
        ],
      },
    ],
  },
  {
    id: '5',
    title: '2025年流程IT持续改进团队及时激励奖',
    issuingDepartment: '质量与流程IT部',
    awardType: 'team',
    recipients: [],
    teams: [
      {
        id: 'team-7',
        name: '流程自动化改造团队',
        leaderName: '钱七',
        leaderId: '00502222',
        memberCount: 16,
        isSelected: true,
        members: [
          { name: '李山花', employeeId: '00494097', department: 'IT平台服务部/平台开发部' },
          { name: '张三', employeeId: '00501234', department: '质量与流程IT部/质量部/测试组' },
          { name: '李四', employeeId: '00505678', department: '智能汽车解决方案部/智能驾驶组' },
          { name: '王五', employeeId: '00507890', department: '云与计算业务部/云计算组' },
          { name: '赵六', employeeId: '00501111', department: 'IT平台服务部/平台运维部' },
          { name: '钱七', employeeId: '00502222', department: '质量与流程IT部/质量部/测试组', role: '负责人' },
          { name: '孙八', employeeId: '00503333', department: '智能汽车解决方案部/智能驾驶组' },
          { name: '周九', employeeId: '00504444', department: '云与计算业务部/云计算组' },
          { name: '吴十', employeeId: '00505555', department: 'IT平台服务部/平台开发部' },
          { name: '郑十一', employeeId: '00506666', department: '质量与流程IT部/质量部/测试组' },
          { name: '王十二', employeeId: '00507777', department: '智能汽车解决方案部/智能驾驶组' },
          { name: '冯十三', employeeId: '00508888', department: '云与计算业务部/云计算组' },
          { name: '陈十四', employeeId: '00509999', department: 'IT平台服务部/平台开发部' },
          { name: '褚十五', employeeId: '00510000', department: '质量与流程IT部/质量部/测试组' },
          { name: '卫十六', employeeId: '00511111', department: '智能汽车解决方案部/智能驾驶组' },
          { name: '蒋十七', employeeId: '00512222', department: '云与计算业务部/云计算组' },
        ],
      },
    ],
  },
  {
    id: '6',
    title: '2025年优秀员工奖',
    issuingDepartment: '华为公司',
    awardType: 'individual',
    recipients: [
      { name: '袁六三', employeeId: '00558888', department: 'IT平台服务部/平台开发部', isSelected: true },
      { name: '柳六四', employeeId: '00559999', department: '质量与流程IT部/IT部/开发组', isSelected: true },
      { name: '酆六五', employeeId: '00560000', department: '智能汽车解决方案部/智能座舱组', isSelected: true },
      { name: '鲍六六', employeeId: '00561111', department: '云与计算业务部/大数据组', isSelected: true },
      { name: '史六七', employeeId: '00562222', department: 'IT平台服务部/技术支持部', isSelected: true },
      { name: '唐六八', employeeId: '00563333', department: '质量与流程IT部/质量部/测试组', isSelected: true },
      { name: '费六九', employeeId: '00564444', department: '智能汽车解决方案部/智能驾驶组', isSelected: true },
      { name: '廉七十', employeeId: '00565555', department: '云与计算业务部/云计算组', isSelected: true },
      { name: '岑七一', employeeId: '00566666', department: 'IT平台服务部/平台运维部', isSelected: true },
      { name: '薛七二', employeeId: '00567777', department: '质量与流程IT部/流程部/优化组', isSelected: true },
      { name: '雷七三', employeeId: '00568888', department: 'IT平台服务部/平台开发部', isSelected: true },
      { name: '贺七四', employeeId: '00569999', department: '质量与流程IT部/IT部/开发组', isSelected: true },
      { name: '倪七五', employeeId: '00570000', department: '智能汽车解决方案部/智能座舱组', isSelected: true },
      { name: '汤七六', employeeId: '00571111', department: '云与计算业务部/大数据组', isSelected: true },
      { name: '滕七七', employeeId: '00572222', department: 'IT平台服务部/技术支持部', isSelected: true },
      { name: '殷七八', employeeId: '00573333', department: '质量与流程IT部/质量部/测试组', isSelected: true },
      { name: '罗七九', employeeId: '00574444', department: '智能汽车解决方案部/智能驾驶组', isSelected: true },
      { name: '毕八十', employeeId: '00575555', department: '云与计算业务部/云计算组', isSelected: true },
      { name: '郝八一', employeeId: '00576666', department: 'IT平台服务部/平台运维部', isSelected: true },
      { name: '邬八二', employeeId: '00577777', department: '质量与流程IT部/流程部/优化组', isSelected: true },
      { name: '安八三', employeeId: '00578888', department: 'IT平台服务部/平台开发部', isSelected: true },
      { name: '常八四', employeeId: '00579999', department: '质量与流程IT部/IT部/开发组', isSelected: true },
      { name: '乐八五', employeeId: '00580000', department: '智能汽车解决方案部/智能座舱组', isSelected: true },
      { name: '于八六', employeeId: '00581111', department: '云与计算业务部/大数据组', isSelected: true },
      { name: '时八七', employeeId: '00582222', department: 'IT平台服务部/技术支持部', isSelected: true },
      { name: '傅八八', employeeId: '00583333', department: '质量与流程IT部/质量部/测试组', isSelected: true },
      { name: '皮八九', employeeId: '00584444', department: '智能汽车解决方案部/智能驾驶组', isSelected: true },
      { name: '卞九十', employeeId: '00585555', department: '云与计算业务部/云计算组', isSelected: true },
      { name: '齐九一', employeeId: '00586666', department: 'IT平台服务部/平台运维部', isSelected: true },
      { name: '康九二', employeeId: '00587777', department: '质量与流程IT部/流程部/优化组', isSelected: true },
      { name: '伍九三', employeeId: '00588888', department: 'IT平台服务部/平台开发部', isSelected: true },
      { name: '余九四', employeeId: '00589999', department: '质量与流程IT部/IT部/开发组', isSelected: true },
      { name: '元九五', employeeId: '00590000', department: '智能汽车解决方案部/智能座舱组', isSelected: true },
      { name: '卜九六', employeeId: '00591111', department: '云与计算业务部/大数据组', isSelected: true },
      { name: '顾九七', employeeId: '00592222', department: 'IT平台服务部/技术支持部', isSelected: true },
      { name: '孟九八', employeeId: '00593333', department: '质量与流程IT部/质量部/测试组', isSelected: true },
      { name: '平九九', employeeId: '00594444', department: '智能汽车解决方案部/智能驾驶组', isSelected: true },
      { name: '黄一百', employeeId: '00595555', department: '云与计算业务部/云计算组', isSelected: true },
      { name: '和一百零一', employeeId: '00596666', department: 'IT平台服务部/平台运维部', isSelected: true },
    ],
  },
];

// 步骤定义
const steps = [
  { num: 1, label: '选择展播数据' },
  { num: 2, label: '制作展播' },
  { num: 3, label: '生成展播' },
];

function App() {
  const [currentStep, setCurrentStep] = useState(0);
  const [awards, setAwards] = useState<Award[]>(mockAwards);

  // 弹窗状态
  const [addRecipientModalVisible, setAddRecipientModalVisible] = useState(false);
  const [teamSearchModalVisible, setTeamSearchModalVisible] = useState(false);
  const [addAwardModalVisible, setAddAwardModalVisible] = useState(false);
  const [currentAwardId, setCurrentAwardId] = useState<string>('');

  // 当前用户部门
  const currentUserDepartment = 'IT平台服务部';

  // 当前用户有权限查看的部门列表
  const accessibleDepartments = [
    '全部部门',
    'IT平台服务部',
    '质量与流程IT部',
    '智能汽车解决方案部',
    '云与计算业务部',
    '华为公司',
  ];

  // 当前选中的部门（默认全部部门）
  const [selectedDepartment, setSelectedDepartment] = useState<string>('全部部门');

  // 根据选中的部门筛选奖项（使用包含匹配，子部门也能匹配到父部门）
  const filteredAwards = useMemo(() => {
    if (selectedDepartment === '全部部门') {
      return awards;
    }
    return awards.filter((award) => award.issuingDepartment.startsWith(selectedDepartment));
  }, [awards, selectedDepartment]);

  // 处理部门切换
  const handleDepartmentChange = (dept: string) => {
    setSelectedDepartment(dept);
  };

  // 处理添加获奖人
  const handleAddRecipient = (awardId: string) => {
    setCurrentAwardId(awardId);
    setAddRecipientModalVisible(true);
  };

  // 处理移除获奖人
  const handleRemoveRecipient = (awardId: string, recipientToRemove: any) => {
    setAwards((prev) =>
      prev.map((award) =>
        award.id === awardId
          ? {
              ...award,
              recipients: award.recipients.filter(
                (r) => r.employeeId !== recipientToRemove.employeeId
              ),
            }
          : award
      )
    );
  };

  // 处理选中/取消选中获奖人
  const handleSelectRecipient = (awardId: string, recipient: any) => {
    setAwards((prev) =>
      prev.map((award) =>
        award.id === awardId
          ? {
              ...award,
              recipients: award.recipients.map((r) =>
                r.employeeId === recipient.employeeId
                  ? { ...r, isSelected: !r.isSelected }
                  : r
              ),
            }
          : award
      )
    );
  };

  // 处理添加团队
  const handleAddTeam = (awardId: string) => {
    setCurrentAwardId(awardId);
    setTeamSearchModalVisible(true);
  };

  // 处理移除团队
  const handleRemoveTeam = (awardId: string, teamToRemove: any) => {
    setAwards((prev) =>
      prev.map((award) =>
        award.id === awardId
          ? {
              ...award,
              teams: award.teams?.filter((t) => t.id !== teamToRemove.id) || [],
            }
          : award
      )
    );
  };

  // 处理选中/取消选中团队
  const handleSelectTeam = (awardId: string, team: any) => {
    setAwards((prev) =>
      prev.map((award) =>
        award.id === awardId
          ? {
              ...award,
              teams: award.teams?.map((t) =>
                t.id === team.id ? { ...t, isSelected: !t.isSelected } : t
              ) || [],
            }
          : award
      )
    );
  };

  // 处理全选/取消全选获奖人
  const handleSelectAllRecipients = (awardId: string, selectAll: boolean) => {
    setAwards((prev) =>
      prev.map((award) =>
        award.id === awardId
          ? {
              ...award,
              recipients: award.recipients.map((r) => ({
                ...r,
                isSelected: selectAll,
              })),
            }
          : award
      )
    );
  };

  // 处理全选/取消全选团队
  const handleSelectAllTeams = (awardId: string, selectAll: boolean) => {
    setAwards((prev) =>
      prev.map((award) =>
        award.id === awardId
          ? {
              ...award,
              teams: award.teams?.map((t) => ({
                ...t,
                isSelected: selectAll,
              })) || [],
            }
          : award
      )
    );
  };

  // 处理更新团队（成员变更后同步）
  const handleUpdateTeam = (awardId: string, updatedTeam: any) => {
    setAwards((prev) =>
      prev.map((award) =>
        award.id === awardId
          ? {
              ...award,
              teams: award.teams?.map((t) =>
                t.id === updatedTeam.id ? updatedTeam : t
              ) || [],
            }
          : award
      )
    );
  };

  // 处理删除整个奖项
  const handleRemoveAward = (awardId: string) => {
    setAwards((prev) => prev.filter((award) => award.id !== awardId));
  };

  // 处理添加奖项
  const handleAddAward = (selectedAwards: any[]) => {
    setAwards((prev) => {
      // 1. 保留默认数据（deletable=false）
      const defaultAwards = prev.filter((award) => !award.deletable);

      // 2. 创建新选中的奖项
      const newAwards: Award[] = selectedAwards.map((item) => ({
        id: String(Date.now() + Math.random()),
        title: item.name,
        issuingDepartment: item.issuingDepartment,
        awardType: item.category === '团队奖' ? 'team' : 'individual',
        recipients: [],
        teams: item.category === '团队奖' ? [] : undefined,
        selected: false,
        deletable: true, // 通过弹框添加的奖项可删除
      }));

      // 3. 合并：默认数据 + 新选中的奖项
      return [...defaultAwards, ...newAwards];
    });
    setAddAwardModalVisible(false);
  };

  // 处理确认添加获奖人
  const handleConfirmAddRecipient = (recipients: any[]) => {
    setAwards((prev) =>
      prev.map((award) =>
        award.id === currentAwardId
          ? {
              ...award,
              recipients: [...award.recipients, ...recipients.map(r => ({ ...r, isSelected: true }))],
            }
          : award
      )
    );
    setAddRecipientModalVisible(false);
  };

  // 处理确认添加团队
  const handleConfirmAddTeam = (teams: any[]) => {
    setAwards((prev) =>
      prev.map((award) =>
        award.id === currentAwardId
          ? {
              ...award,
              teams: [...(award.teams || []), ...teams],
            }
          : award
      )
    );
    setTeamSearchModalVisible(false);
  };

  // 处理奖项选中/取消选中
  const handleToggleAwardSelection = (awardId: string) => {
    setAwards((prev) =>
      prev.map((award) =>
        award.id === awardId ? { ...award, selected: !award.selected } : award
      )
    );
  };

  // 获取已选中的奖项数量
  const selectedAwardsCount = useMemo(() => {
    return awards.filter((award) => award.selected).length;
  }, [awards]);

  // 检查是否可以进入下一步（选中的奖项必须都有选中的人或团队）
  const canProceedToNextStep = useMemo(() => {
    const selectedAwards = awards.filter((award) => award.selected);
    if (selectedAwards.length === 0) return false;
    
    return selectedAwards.every((award) => {
      if (award.awardType === 'individual') {
        // 个人奖：至少有一个选中的获奖人
        return award.recipients.some((r) => r.isSelected);
      } else {
        // 团队奖：至少有一个选中的团队
        return award.teams?.some((t) => t.isSelected) ?? false;
      }
    });
  }, [awards]);

  return (
    <div
      className="app"
      style={{
        minHeight: '100vh',
        backgroundColor: '#f5f5f5',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
      }}
    >
      {/* 顶部导航 */}
      <header
        style={{
          backgroundColor: '#1a1a2e',
          padding: '16px 24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <h1
          style={{
            margin: 0,
            fontSize: '18px',
            fontWeight: 600,
            color: '#fff',
          }}
        >
          获奖海报生成系统
        </h1>
        <div style={{ fontSize: '14px', color: '#a0aec0' }}>
          当前用户: 李山花 (IT平台服务部)
        </div>
      </header>

      {/* 步骤条 */}
      <div
        style={{
          backgroundColor: '#fff',
          padding: '24px',
          borderBottom: '1px solid #e2e8f0',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            maxWidth: '600px',
            margin: '0 auto',
          }}
        >
          {steps.map((step, index) => (
            <React.Fragment key={step.num}>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '8px',
                }}
              >
                <div
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    backgroundColor:
                      index <= currentStep ? '#1890ff' : '#f1f5f9',
                    color: index <= currentStep ? '#fff' : '#94a3b8',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '14px',
                    fontWeight: 600,
                  }}
                >
                  {step.num}
                </div>
                <span
                  style={{
                    fontSize: '14px',
                    color: index <= currentStep ? '#1890ff' : '#94a3b8',
                    fontWeight: index === currentStep ? 500 : 400,
                  }}
                >
                  {step.label}
                </span>
              </div>
              {index < steps.length - 1 && (
                <div
                  style={{
                    width: '120px',
                    height: '2px',
                    backgroundColor:
                      index < currentStep ? '#1890ff' : '#f1f5f9',
                    margin: '0 16px',
                    marginBottom: '24px',
                  }}
                />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* 主内容区 */}
      <main style={{ padding: '24px 24px 80px 24px', maxWidth: '1200px', margin: '0 auto' }}>
        {currentStep === 0 && (
          <>
            {/* 操作按钮和数据范围筛选 - 按钮放左侧便于高频操作 */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '24px',
                gap: '16px',
              }}
            >
              <button
                onClick={() => setAddAwardModalVisible(true)}
                style={{
                  padding: '8px 16px',
                  backgroundColor: '#1890ff',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  whiteSpace: 'nowrap',
                }}
              >
                <span>+</span>
                <span>添加展播奖项</span>
              </button>
              <DataRangeFilter
                value={selectedDepartment}
                onChange={handleDepartmentChange}
                accessibleDepartments={accessibleDepartments}
                currentUserDepartment={currentUserDepartment}
              />
            </div>

            {/* 提示文本 */}
            <div
              style={{
                marginBottom: '16px',
                padding: '12px 16px',
                backgroundColor: '#e6f4ff',
                border: '1px solid #91caff',
                borderRadius: '6px',
                fontSize: '14px',
                color: '#0958d9',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="#0958d9"
              >
                <path d="M8 1.5a6.5 6.5 0 1 0 0 13 6.5 6.5 0 0 0 0-13zM0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8zm6.5-.25A.75.75 0 0 1 7.25 7h1.5a.75.75 0 0 1 .75.75v2.75h.25a.75.75 0 0 1 0 1.5h-2a.75.75 0 0 1 0-1.5h.25v-2h-.25a.75.75 0 0 1-.75-.75zM8 6a1 1 0 1 1 0-2 1 1 0 0 1 0 2z"/>
              </svg>
              <span>已为你筛选出近期获奖数据，请你从中挑选用于展播的奖项。</span>
            </div>

            {/* 奖项列表 - 空状态 */}
            {filteredAwards.length === 0 ? (
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '80px 24px',
                  backgroundColor: '#fff',
                  borderRadius: '8px',
                  boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
                }}
              >
                <div style={{ fontSize: '64px', marginBottom: '16px' }}>🏆</div>
                <h3 style={{ margin: '0 0 8px 0', color: '#1a1a2e', fontSize: '16px' }}>
                  暂无符合条件的奖项
                </h3>
                <p style={{ margin: 0, color: '#6b7280', fontSize: '14px' }}>
                  该部门下暂时没有获奖数据，您可以切换部门查看或添加新的奖项
                </p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {filteredAwards.map((award) => (
                  <AwardCard
                    key={award.id}
                    award={award}
                    selected={award.selected || false}
                    onToggleSelection={() => handleToggleAwardSelection(award.id)}
                    onAddRecipient={
                      award.awardType === 'individual'
                        ? () => handleAddRecipient(award.id)
                        : undefined
                    }
                    onRemoveRecipient={
                      award.awardType === 'individual'
                        ? (recipient) => handleRemoveRecipient(award.id, recipient)
                        : undefined
                    }
                    onSelectRecipient={
                      award.awardType === 'individual'
                        ? (recipient) => handleSelectRecipient(award.id, recipient)
                        : undefined
                    }
                    onAddTeam={
                      award.awardType === 'team'
                        ? () => handleAddTeam(award.id)
                        : undefined
                    }
                    onRemoveTeam={
                      award.awardType === 'team'
                        ? (team) => handleRemoveTeam(award.id, team)
                        : undefined
                    }
                    onSelectTeam={
                      award.awardType === 'team'
                        ? (team) => handleSelectTeam(award.id, team)
                        : undefined
                    }
                    onSelectAllTeams={
                      award.awardType === 'team'
                        ? (selectAll) => handleSelectAllTeams(award.id, selectAll)
                        : undefined
                    }
                    onSelectAllRecipients={
                      award.awardType === 'individual'
                        ? (selectAll) => handleSelectAllRecipients(award.id, selectAll)
                        : undefined
                    }
                    onUpdateTeam={
                      award.awardType === 'team'
                        ? (team) => handleUpdateTeam(award.id, team)
                        : undefined
                    }
                    onRemoveAward={() => handleRemoveAward(award.id)}
                  />
                ))}
              </div>
            )}
          </>
        )}

        {currentStep === 1 && (
          <div
            style={{
              backgroundColor: '#fff',
              borderRadius: '8px',
              padding: '48px',
              textAlign: 'center',
              color: '#6b7280',
            }}
          >
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>🎨</div>
            <h2 style={{ margin: '0 0 8px 0', color: '#1a1a2e' }}>制作展播</h2>
            <p>请先在第一步选择展播数据</p>
          </div>
        )}

        {currentStep === 2 && (
          <div
            style={{
              backgroundColor: '#fff',
              borderRadius: '8px',
              padding: '48px',
              textAlign: 'center',
              color: '#6b7280',
            }}
          >
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>📄</div>
            <h2 style={{ margin: '0 0 8px 0', color: '#1a1a2e' }}>生成展播</h2>
            <p>请先在第二步制作展播</p>
          </div>
        )}
      </main>

      {/* 底部操作栏 */}
      <div
        style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          backgroundColor: '#fff',
          borderTop: '1px solid #e2e8f0',
          padding: '16px 24px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '16px',
        }}
      >
        {currentStep === 0 && (
          <span style={{ fontSize: '14px', color: '#6b7280', marginRight: '16px' }}>
            已选 {selectedAwardsCount} 个奖项
          </span>
        )}
        {currentStep > 0 && (
          <button
            onClick={() => setCurrentStep(currentStep - 1)}
            style={{
              padding: '8px 24px',
              backgroundColor: '#fff',
              color: '#1a1a2e',
              border: '1px solid #e2e8f0',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '14px',
            }}
          >
            上一步
          </button>
        )}
        {currentStep < steps.length - 1 && (
          <button
            onClick={() => setCurrentStep(currentStep + 1)}
            disabled={currentStep === 0 ? !canProceedToNextStep : false}
            style={{
              padding: '8px 24px',
              backgroundColor: currentStep === 0 && !canProceedToNextStep ? '#e2e8f0' : '#1890ff',
              color: '#fff',
              border: 'none',
              borderRadius: '4px',
              cursor: currentStep === 0 && !canProceedToNextStep ? 'not-allowed' : 'pointer',
              fontSize: '14px',
            }}
          >
            下一步
          </button>
        )}
        {currentStep === steps.length - 1 && (
          <button
            style={{
              padding: '8px 24px',
              backgroundColor: '#16a34a',
              color: '#fff',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '14px',
            }}
          >
            生成展播
          </button>
        )}
      </div>

      {/* 弹窗 */}
      <AddRecipientModal
        visible={addRecipientModalVisible}
        currentDepartment={currentUserDepartment}
        existingRecipients={awards.find(a => a.id === currentAwardId)?.recipients || []}
        onCancel={() => setAddRecipientModalVisible(false)}
        onConfirm={handleConfirmAddRecipient}
      />

      <TeamSearchModal
        visible={teamSearchModalVisible}
        existingTeams={awards.find(a => a.id === currentAwardId)?.teams || []}
        onCancel={() => setTeamSearchModalVisible(false)}
        onConfirm={handleConfirmAddTeam}
      />

      <AddAwardModal
        visible={addAwardModalVisible}
        onCancel={() => setAddAwardModalVisible(false)}
        onConfirm={handleAddAward}
        existingAwards={awards}
        externalDeptPath={selectedDepartment === '全部部门' ? [] : [selectedDepartment]}
      />
    </div>
  );
}

export default App;
