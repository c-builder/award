#!/usr/bin/env python3
"""
自动化测试脚本 - 验证搜索下拉框分页功能
"""

from playwright.sync_api import sync_playwright
import time

def test_pagination():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=False)
        page = browser.new_page()
        
        print("=" * 60)
        print("开始测试 - 搜索下拉框分页功能")
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
        
        # 截图：显示分页
        page.screenshot(path='d:/test/award-poster-app/test-results/01-pagination.png', full_page=True)
        print("  ✓ 已截图: 01-pagination.png")
        
        # 检查分页组件是否存在
        print("\n[3] 检查分页组件")
        try:
            # 查找分页按钮
            page_buttons = page.locator('button').all()
            print(f"  找到 {len(page_buttons)} 个按钮")
            
            # 查找包含页码的按钮
            pagination_info = page.locator('text=找到').first
            if pagination_info.is_visible():
                info_text = pagination_info.inner_text()
                print(f"  搜索结果: {info_text}")
        except Exception as e:
            print(f"  检查出错: {e}")
        
        # 测试点击下一页
        print("\n[4] 测试点击下一页")
        try:
            # 查找下一页按钮（通常是最后一个按钮，包含右箭头）
            next_button = page.locator('button[title="下一页"]').first
            if next_button.is_visible():
                print("  找到下一页按钮")
                next_button.click()
                time.sleep(1)
                
                page.screenshot(path='d:/test/award-poster-app/test-results/02-page2.png', full_page=True)
                print("  ✓ 已截图: 02-page2.png")
            else:
                print("  未找到下一页按钮（可能数据不足5条）")
        except Exception as e:
            print(f"  点击下一页出错: {e}")
        
        print("\n" + "=" * 60)
        print("测试完成")
        print("=" * 60)
        
        browser.close()

if __name__ == '__main__':
    import os
    os.makedirs('d:/test/award-poster-app/test-results', exist_ok=True)
    test_pagination()
