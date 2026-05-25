#!/usr/bin/env python3
"""
自动化测试脚本 - 验证获奖海报生成系统的两个优化需求：
1. 默认应该为全部部门数据
2. 选择奖项列下的搜索框获取焦点就显示所有数据
"""

from playwright.sync_api import sync_playwright
import time

def test_award_poster_app():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=False)  # 设置为False以便观察
        page = browser.new_page()
        
        print("=" * 60)
        print("开始测试 - 获奖海报生成系统")
        print("=" * 60)
        
        # 访问应用
        print("\n[1] 访问应用: http://localhost:3001/")
        page.goto('http://localhost:3001/')
        page.wait_for_load_state('networkidle')
        time.sleep(2)
        
        # 截图初始状态
        page.screenshot(path='d:/test/award-poster-app/test-results/01-initial-state.png', full_page=True)
        print("  ✓ 已截图: 01-initial-state.png")
        
        # 测试1: 检查部门选择器默认值
        print("\n[2] 测试1: 检查部门选择器默认值是否为'全部部门'")
        try:
            # 查找部门选择器
            dept_selector = page.locator('text=部门:').locator('..').locator('select')
            dept_value = dept_selector.input_value()
            print(f"  当前部门选择器值: {dept_value}")
            
            # 获取选中的文本
            selected_text = dept_selector.evaluate("el => el.options[el.selectedIndex].text")
            print(f"  当前选中的部门: {selected_text}")
            
            if dept_value == 'all' or '全部' in selected_text:
                print("  ✓ 测试通过: 默认值为全部部门")
            else:
                print(f"  ✗ 测试失败: 默认值为 '{selected_text}'，期望为'全部部门'")
        except Exception as e:
            print(f"  ✗ 测试出错: {e}")
        
        # 测试2: 检查奖项搜索框焦点行为
        print("\n[3] 测试2: 检查奖项搜索框获取焦点时是否显示所有数据")
        try:
            # 查找"选择奖项"区域的搜索框
            # 先找到"选择奖项"标题
            award_section = page.locator('text=选择奖项').first
            print(f"  找到'选择奖项'区域: {award_section.is_visible()}")
            
            # 在"选择奖项"区域内查找搜索框
            search_input = page.locator('input[placeholder*="搜索"]').first
            print(f"  找到搜索框: {search_input.is_visible()}")
            
            # 获取焦点前的数据状态
            page.screenshot(path='d:/test/award-poster-app/test-results/02-before-focus.png', full_page=True)
            print("  ✓ 已截图: 02-before-focus.png (获取焦点前)")
            
            # 点击搜索框获取焦点
            print("  点击搜索框获取焦点...")
            search_input.click()
            time.sleep(1)
            
            page.screenshot(path='d:/test/award-poster-app/test-results/03-after-focus.png', full_page=True)
            print("  ✓ 已截图: 03-after-focus.png (获取焦点后)")
            
            # 检查是否有数据展示
            # 查找奖项列表项
            award_items = page.locator('.award-item, [class*="award"], tr').all()
            print(f"  获取焦点后显示的奖项数量: {len(award_items)}")
            
            if len(award_items) > 0:
                print("  ✓ 测试通过: 获取焦点后显示了数据")
            else:
                print("  ✗ 测试失败: 获取焦点后仍未显示数据")
                
        except Exception as e:
            print(f"  ✗ 测试出错: {e}")
            import traceback
            traceback.print_exc()
        
        # 测试3: 尝试输入关键词搜索
        print("\n[4] 测试3: 输入关键词搜索")
        try:
            search_input = page.locator('input[placeholder*="搜索"]').first
            search_input.fill("优秀")
            time.sleep(1)
            
            page.screenshot(path='d:/test/award-poster-app/test-results/04-after-search.png', full_page=True)
            print("  ✓ 已截图: 04-after-search.png (输入关键词后)")
            
        except Exception as e:
            print(f"  ✗ 测试出错: {e}")
        
        print("\n" + "=" * 60)
        print("测试完成")
        print("=" * 60)
        
        browser.close()

if __name__ == '__main__':
    import os
    os.makedirs('d:/test/award-poster-app/test-results', exist_ok=True)
    test_award_poster_app()
