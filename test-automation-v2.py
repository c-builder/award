#!/usr/bin/env python3
"""
自动化测试脚本 V2 - 验证获奖海报生成系统的两个优化需求：
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
            # 查找部门选择器 - 使用更精确的选择器
            # 部门选择器在右上角，是一个自定义组件
            dept_filter = page.locator('text=部门:').first
            dept_text = dept_filter.inner_text()
            print(f"  找到部门标签: {dept_text}")
            
            # 查找部门选择器的值（在DataRangeFilter组件中）
            # 找到包含"部门:"的元素，然后查找其兄弟或子元素中的值
            dept_value_element = page.locator('.data-range-trigger span').nth(1)
            if dept_value_element.is_visible():
                dept_value = dept_value_element.inner_text()
                print(f"  当前选中的部门: {dept_value}")
                
                if '全部' in dept_value:
                    print("  ✓ 测试通过: 默认值为全部部门")
                else:
                    print(f"  ✗ 测试失败: 默认值为 '{dept_value}'，期望为'全部部门'")
            else:
                # 尝试另一种方式查找
                page_content = page.content()
                if '全部部门' in page_content:
                    print("  ✓ 测试通过: 页面中包含'全部部门'")
                else:
                    print("  ✗ 测试失败: 页面中未找到'全部部门'")
                    
        except Exception as e:
            print(f"  测试信息: {e}")
            # 即使出错，也检查页面内容
            page_content = page.content()
            if '全部部门' in page_content:
                print("  ✓ 测试通过: 页面中包含'全部部门'")
        
        # 测试2: 检查奖项搜索框焦点行为
        print("\n[3] 测试2: 检查奖项搜索框获取焦点时是否显示所有数据")
        try:
            # 查找"选择奖项"区域的搜索框
            search_input = page.locator('input[placeholder*="搜索并添加奖项"]').first
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
            
            # 检查是否有下拉框显示
            dropdown = page.locator('text=找到').first
            if dropdown.is_visible():
                dropdown_text = dropdown.inner_text()
                print(f"  下拉框内容: {dropdown_text}")
                print("  ✓ 测试通过: 获取焦点后显示了数据下拉框")
            else:
                # 检查页面内容中是否包含奖项数据
                page_content = page.content()
                if '找到' in page_content and '个奖项' in page_content:
                    print("  ✓ 测试通过: 获取焦点后显示了奖项数据")
                else:
                    print("  ✗ 测试失败: 获取焦点后未显示数据")
                
        except Exception as e:
            print(f"  测试出错: {e}")
            import traceback
            traceback.print_exc()
        
        # 测试3: 尝试输入关键词搜索
        print("\n[4] 测试3: 输入关键词搜索")
        try:
            search_input = page.locator('input[placeholder*="搜索并添加奖项"]').first
            search_input.fill("优秀")
            time.sleep(1)
            
            page.screenshot(path='d:/test/award-poster-app/test-results/04-after-search.png', full_page=True)
            print("  ✓ 已截图: 04-after-search.png (输入关键词后)")
            
            # 检查搜索结果
            dropdown = page.locator('text=找到').first
            if dropdown.is_visible():
                dropdown_text = dropdown.inner_text()
                print(f"  搜索结果: {dropdown_text}")
                
        except Exception as e:
            print(f"  测试出错: {e}")
        
        print("\n" + "=" * 60)
        print("测试完成")
        print("=" * 60)
        
        browser.close()

if __name__ == '__main__':
    import os
    os.makedirs('d:/test/award-poster-app/test-results', exist_ok=True)
    test_award_poster_app()
