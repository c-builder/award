#!/usr/bin/env python3
"""
将新生成的15个奖项数据合并到awards.json
"""

import json

# 读取原始数据
with open('d:/test/award-poster-app/src/mock/data/awards.json', 'r', encoding='utf-8') as f:
    original_awards = json.load(f)

print(f"原始奖项数量: {len(original_awards)}")

# 读取新数据
with open('d:/test/award-poster-app/new-awards.json', 'r', encoding='utf-8') as f:
    new_awards = json.load(f)

print(f"新增奖项数量: {len(new_awards)}")

# 合并数据
all_awards = original_awards + new_awards

print(f"合并后奖项数量: {len(all_awards)}")

# 保存回原始文件
with open('d:/test/award-poster-app/src/mock/data/awards.json', 'w', encoding='utf-8') as f:
    json.dump(all_awards, f, ensure_ascii=False, indent=2)

print("\n数据合并完成！")
print("新增的奖项:")
for award in new_awards:
    print(f"  - {award['title']} ({award['awardType']}, {award['issueDate'][:4]}年)")
