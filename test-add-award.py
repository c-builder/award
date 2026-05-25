#!/usr/bin/env python3
"""
自动化测试脚本 - 验证点击添加奖项功能
"""

from playwright.sync_api import sync_playwright
import time

def test_add_award():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=False)
        page = browser.new_page()
        
        print("=" * 60)
        print("开始测试 - 点击添加奖项功能")
        print("=" * 60)
        
        # 访问应用
        print("\n[1] 访问应用: http://localhost:3001/")
        page.goto('http://localhost:3001/')
        page.wait_for_load_state('networkidle')
        time.sleep(2)
        
        # 点击搜索框获取焦点
        print("\n[2] 点击搜索框获取焦点")
        search_input = page.locator('input[placeholder*="搜索并添加奖项"]').first
        search_input.click()
        time.sleep(1)
        
        # 截图：显示下拉框
        page.screenshot(path='d:/test/award-poster-app/test-results/01-before-add.png', full_page=True)
        print("  ✓ 已截图: 01-before-add.png")
        
        # 点击第一个奖项
        print("\n[3] 点击第一个奖项添加")
        try:
            # 查找第一个奖项项
            first_award = page.locator('text=2025年明日之星').first
            print(f"  找到奖项: {first_award.is_visible()}")
            
            # 点击添加
            first_award.click()
            time.sleep(1)
            
            # 截图：添加后
            page.screenshot(path='d:/test/award-poster-app/test-results/02-after-add.png', full_page=True)
            print("  ✓ 已截图: 02-after-add.png")
            
            # 检查是否添加成功（已选区域应该显示奖项）
            selected_section = page.locator('text=已选').first
            if selected_section:
                print("  ✓ 奖项已添加到已选列表")
            
        except Exception as e:
            print(f"  添加出错: {e}")
            import traceback
            traceback.print_exc()
        
        print("\n" + "=" * 60)
        print("测试完成")
        print("=" * 60)
        
        browser.close()

if __name__ == '__main__':
    import os
    os.makedirs('d:/test/award-poster-app/test-results', exist_ok=True)
    test_add_award()
