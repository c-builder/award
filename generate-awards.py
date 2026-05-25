#!/usr/bin/env python3
"""
生成15个新的奖项mock数据
"""

import json
import random
from datetime import datetime, timedelta

# 部门列表
departments = [
    "IT平台服务部",
    "质量与流程IT部",
    "智能汽车解决方案部",
    "云与计算业务部",
    "华为公司"
]

# 子部门映射
sub_departments = {
    "IT平台服务部": ["平台开发部", "平台运维部", "技术支持部"],
    "质量与流程IT部": ["质量部", "流程部", "IT部"],
    "智能汽车解决方案部": ["智能驾驶组", "智能座舱组", "车联网组"],
    "云与计算业务部": ["云计算组", "大数据组", "AI平台组"],
    "华为公司": ["人力资源部", "财务部", "行政部"]
}

# 姓氏列表
surnames = ["赵", "钱", "孙", "李", "周", "吴", "郑", "王", "冯", "陈", "褚", "卫", "蒋", "沈", "韩", "杨", "朱", "秦", "尤", "许",
            "何", "吕", "施", "张", "孔", "曹", "严", "华", "金", "魏", "陶", "姜", "戚", "谢", "邹", "喻", "柏", "水", "窦", "章",
            "云", "苏", "潘", "葛", "奚", "范", "彭", "郎", "鲁", "韦", "昌", "马", "苗", "凤", "花", "方", "俞", "任", "袁", "柳"]

# 名字列表
name_chars = ["伟", "芳", "娜", "敏", "静", "丽", "强", "磊", "军", "洋", "勇", "艳", "杰", "娟", "涛", "明", "超", "秀", "霞", "平",
              "刚", "桂", "英", "华", "建", "文", "辉", "玲", "婷", "宇", "浩", "欣", "雨", "晨", "轩", "昊", "瑞", "嘉", "琪", "梓"]

# 奖项标题模板
award_templates = [
    "{year}年{quarter}优秀员工奖",
    "{year}年{quarter}创新突破奖",
    "{year}年{quarter}团队协作奖",
    "{year}年{quarter}技术先锋奖",
    "{year}年{quarter}服务之星奖",
    "{year}年{quarter}管理卓越奖",
    "{year}年{quarter}质量守护奖",
    "{year}年{quarter}效率提升奖",
    "{year}年{quarter}客户满意奖",
    "{year}年{quarter}安全卫士奖",
    "{year}年{quarter}成本优化奖",
    "{year}年{quarter}流程改进奖",
    "{year}年{quarter}数字化转型奖",
    "{year}年{quarter}敏捷实践奖",
    "{year}年{quarter}知识分享奖"
]

quarters = ["Q1", "Q2", "Q3", "Q4", "半年度"]

# 已使用的employeeId集合
used_employee_ids = set()

def generate_employee_id():
    """生成唯一的员工ID"""
    while True:
        emp_id = f"00{random.randint(5000000, 5999999)}"
        if emp_id not in used_employee_ids:
            used_employee_ids.add(emp_id)
            return emp_id

def generate_name():
    """生成随机姓名"""
    surname = random.choice(surnames)
    name = random.choice(name_chars)
    if random.random() > 0.5:
        name += random.choice(name_chars)
    return surname + name

def generate_department():
    """生成随机部门"""
    dept = random.choice(departments)
    sub_dept = random.choice(sub_departments[dept])
    return f"{dept}/{sub_dept}"

def generate_recipients(count, dept_filter=None):
    """生成获奖人员列表"""
    recipients = []
    for _ in range(count):
        if dept_filter and random.random() > 0.3:
            # 70%概率使用指定部门
            dept = dept_filter
        else:
            dept = generate_department()
        
        recipients.append({
            "name": generate_name(),
            "employeeId": generate_employee_id(),
            "department": dept,
            "isSelected": random.random() > 0.7  # 30%概率已选中
        })
    return recipients

def generate_teams(count, dept_filter=None):
    """生成团队列表"""
    team_names = [
        "创新研发团队", "技术支持团队", "客户服务团队", "项目管理团队",
        "质量保证团队", "运维保障团队", "数据分析团队", "产品设计团队",
        "市场推广团队", "运营支持团队", "安全审计团队", "流程优化团队"
    ]
    
    teams = []
    for i in range(count):
        team_name = random.choice(team_names) + f"-{i+1}"
        member_count = random.randint(3, 10)
        members = []
        
        for _ in range(member_count):
            if dept_filter and random.random() > 0.3:
                dept = dept_filter
            else:
                dept = generate_department()
            
            members.append({
                "name": generate_name(),
                "employeeId": generate_employee_id(),
                "department": dept,
                "role": "组长" if _ == 0 else "成员"
            })
        
        teams.append({
            "id": f"team-{random.randint(100, 999)}",
            "name": team_name,
            "memberCount": member_count,
            "isSelected": random.random() > 0.7,
            "members": members
        })
    
    return teams

def generate_award(index):
    """生成单个奖项数据"""
    award_id = index + 6  # 从6开始，因为已有1-5
    
    # 随机选择年份和季度
    year = random.choice(["2024", "2025"])
    quarter = random.choice(quarters)
    
    # 生成奖项标题
    template = award_templates[index]
    title = template.format(year=year, quarter=quarter)
    
    # 随机选择颁发部门
    issuing_dept = random.choice(departments)
    
    # 随机选择奖项类型
    award_type = random.choice(["individual", "team"])
    
    # 生成颁发日期
    if year == "2025":
        month = random.randint(1, 12)
    else:
        month = random.randint(1, 12)
    day = random.randint(1, 28)
    issue_date = f"{year}-{month:02d}-{day:02d}"
    
    # 推送日期（提前几天）
    push_date = datetime.strptime(issue_date, "%Y-%m-%d") - timedelta(days=random.randint(1, 10))
    push_date_str = push_date.strftime("%Y-%m-%d")
    
    award = {
        "id": str(award_id),
        "issueDate": issue_date,
        "title": title,
        "issuingDepartment": issuing_dept,
        "awardType": award_type,
        "isDefault": random.random() > 0.5,
        "pushDate": push_date_str
    }
    
    if award_type == "individual":
        # 个人奖：生成获奖人员
        recipient_count = random.randint(5, 20)
        award["recipients"] = generate_recipients(recipient_count)
    else:
        # 团队奖：生成团队
        team_count = random.randint(2, 8)
        award["recipients"] = []
        award["teams"] = generate_teams(team_count)
        award["awardCount"] = random.randint(10, 100)
    
    return award

# 生成15个新奖项
new_awards = []
for i in range(15):
    award = generate_award(i)
    new_awards.append(award)
    print(f"生成奖项 {i+1}: {award['title']} ({award['awardType']})")

# 保存到文件
with open('d:/test/award-poster-app/new-awards.json', 'w', encoding='utf-8') as f:
    json.dump(new_awards, f, ensure_ascii=False, indent=2)

print(f"\n已生成15个新奖项，保存到 new-awards.json")
