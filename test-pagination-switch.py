#!/usr/bin/env python3
"""
自动化测试脚本 - 验证分页切换时搜索框不自动关闭
"""

from playwright.sync_api import sync_playwright
import time

def test_pagination_switch():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=False)
        page = browser.new_page()
        
        print("=" * 60)
        print("开始测试 - 分页切换时搜索框不自动关闭")
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
        
        page.screenshot(path='d:/test/award-poster-app/test-results/01-page1.png', full_page=True)
        print("  ✓ 已截图: 01-page1.png (第1页)")
        
        # 点击第2页
        print("\n[3] 点击第2页按钮")
        try:
            page2_button = page.locator('button:has-text("2")').first
            print(f"  找到第2页按钮: {page2_button.is_visible()}")
            page2_button.click()
            time.sleep(1)
            
            page.screenshot(path='d:/test/award-poster-app/test-results/02-page2.png', full_page=True)
            print("  ✓ 已截图: 02-page2.png (点击第2页后)")
            
            # 检查下拉框是否仍然显示
            dropdown_tip = page.locator('text=找到').first
            if dropdown_tip.is_visible():
                print("  ✓ 测试通过: 切换分页后下拉框仍然显示")
            else:
                print("  ✗ 测试失败: 切换分页后下拉框已关闭")
                
        except Exception as e:
            print(f"  测试出错: {e}")
        
        # 点击下一页
        print("\n[4] 点击下一页按钮")
        try:
            next_button = page.locator('button[title="下一页"]').first
            if next_button.is_visible():
                next_button.click()
                time.sleep(1)
                
                page.screenshot(path='d:/test/award-poster-app/test-results/03-next-page.png', full_page=True)
                print("  ✓ 已截图: 03-next-page.png (点击下一页后)")
                
                # 检查下拉框是否仍然显示
                dropdown_tip = page.locator('text=找到').first
                if dropdown_tip.is_visible():
                    print("  ✓ 测试通过: 点击下一页后下拉框仍然显示")
                else:
                    print("  ✗ 测试失败: 点击下一页后下拉框已关闭")
            else:
                print("  未找到下一页按钮")
        except Exception as e:
            print(f"  测试出错: {e}")
        
        print("\n" + "=" * 60)
        print("测试完成")
        print("=" * 60)
        
        browser.close()

if __name__ == '__main__':
    import os
    os.makedirs('d:/test/award-poster-app/test-results', exist_ok=True)
    test_pagination_switch()
