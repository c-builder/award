#!/usr/bin/env python3
"""
调整mock数据，使：
- 智能汽车解决方案部只有3个奖
- 云与计算业务部只有4个奖
"""

import json

# 读取数据
with open('d:/test/award-poster-app/src/mock/data/awards.json', 'r', encoding='utf-8') as f:
    awards = json.load(f)

print(f"总奖项数: {len(awards)}")

# 统计每个部门在哪些奖项中有获奖人员
def get_dept_from_person(person):
    """从人员部门信息中提取一级部门"""
    dept = person.get('department', '')
    return dept.split('/')[0] if dept else ''

def get_dept_from_member(member):
    """从团队成员部门信息中提取一级部门"""
    dept = member.get('department', '')
    return dept.split('/')[0] if dept else ''

def check_award_has_dept(award, target_dept):
    """检查奖项是否有该部门的获奖人员"""
    # 检查个人奖获奖人
    if award.get('recipients'):
        for person in award['recipients']:
            if get_dept_from_person(person) == target_dept:
                return True
    
    # 检查团队奖成员
    if award.get('teams'):
        for team in award['teams']:
            if team.get('members'):
                for member in team['members']:
                    if get_dept_from_member(member) == target_dept:
                        return True
    
    return False

# 统计智能汽车解决方案部
auto_dept = "智能汽车解决方案部"
auto_awards = []
for award in awards:
    if check_award_has_dept(award, auto_dept):
        auto_awards.append(award['id'])
        
print(f"\n智能汽车解决方案部当前在 {len(auto_awards)} 个奖项中有获奖人员:")
for aid in auto_awards:
    award = next((a for a in awards if a['id'] == aid), None)
    if award:
        print(f"  - ID {aid}: {award['title']}")

# 统计云与计算业务部
cloud_dept = "云与计算业务部"
cloud_awards = []
for award in awards:
    if check_award_has_dept(award, cloud_dept):
        cloud_awards.append(award['id'])
        
print(f"\n云与计算业务部当前在 {len(cloud_awards)} 个奖项中有获奖人员:")
for aid in cloud_awards:
    award = next((a for a in awards if a['id'] == aid), None)
    if award:
        print(f"  - ID {aid}: {award['title']}")

# 调整策略：
# 1. 对于智能汽车解决方案部，保留3个奖项，从其他奖项中移除该部门人员
# 2. 对于云与计算业务部，保留4个奖项，从其他奖项中移除该部门人员

# 保留的奖项ID（根据原始5个奖项 + 新生成的15个奖项）
# 原始: 1-5, 新生成: 6-20

# 智能汽车解决方案部保留3个奖项：id 1, 3, 和 新生成的一个
auto_keep_ids = ['1', '3', '14']  # 明日之星、Q1优秀团队奖、2025年Q1敏捷实践奖

# 云与计算业务部保留4个奖项：id 1, 6, 和新生成的两个
cloud_keep_ids = ['1', '6', '8', '13']  # 明日之星、管理卓越奖、效率提升奖、数字化转型奖

print(f"\n调整策略:")
print(f"  智能汽车解决方案部保留奖项: {auto_keep_ids}")
print(f"  云与计算业务部保留奖项: {cloud_keep_ids}")

# 从非保留奖项中移除智能汽车解决方案部人员
def remove_dept_from_award(award, target_dept):
    """从奖项中移除目标部门的人员"""
    modified = False
    
    # 处理个人奖获奖人
    if award.get('recipients'):
        original_count = len(award['recipients'])
        award['recipients'] = [p for p in award['recipients'] if get_dept_from_person(p) != target_dept]
        if len(award['recipients']) != original_count:
            modified = True
    
    # 处理团队奖成员
    if award.get('teams'):
        for team in award['teams']:
            if team.get('members'):
                original_count = len(team['members'])
                team['members'] = [m for m in team['members'] if get_dept_from_member(m) != target_dept]
                team['memberCount'] = len(team['members'])
                if len(team['members']) != original_count:
                    modified = True
    
    return modified

# 执行调整
print("\n开始调整...")

# 调整智能汽车解决方案部
removed_auto = []
for award in awards:
    if award['id'] not in auto_keep_ids:
        if check_award_has_dept(award, auto_dept):
            if remove_dept_from_award(award, auto_dept):
                removed_auto.append(award['id'])

print(f"  从奖项 {removed_auto} 中移除了智能汽车解决方案部人员")

# 调整云与计算业务部
removed_cloud = []
for award in awards:
    if award['id'] not in cloud_keep_ids:
        if check_award_has_dept(award, cloud_dept):
            if remove_dept_from_award(award, cloud_dept):
                removed_cloud.append(award['id'])

print(f"  从奖项 {removed_cloud} 中移除了云与计算业务部人员")

# 验证调整结果
print("\n调整后统计:")

auto_awards_after = []
for award in awards:
    if check_award_has_dept(award, auto_dept):
        auto_awards_after.append(award['id'])
print(f"  智能汽车解决方案部: {len(auto_awards_after)} 个奖项 {auto_awards_after}")

cloud_awards_after = []
for award in awards:
    if check_award_has_dept(award, cloud_dept):
        cloud_awards_after.append(award['id'])
print(f"  云与计算业务部: {len(cloud_awards_after)} 个奖项 {cloud_awards_after}")

# 保存调整后的数据
with open('d:/test/award-poster-app/src/mock/data/awards.json', 'w', encoding='utf-8') as f:
    json.dump(awards, f, ensure_ascii=False, indent=2)

print("\n数据已保存!")
