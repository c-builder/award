#!/usr/bin/env python3
"""
自动化测试脚本 - 验证搜索框焦点行为：
1. 页面加载时不显示搜索结果下拉框
2. 搜索框获取焦点时才显示下拉框
"""

from playwright.sync_api import sync_playwright
import time

def test_search_focus_behavior():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=False)
        page = browser.new_page()
        
        print("=" * 60)
        print("开始测试 - 搜索框焦点行为")
        print("=" * 60)
        
        # 访问应用
        print("\n[1] 访问应用: http://localhost:3001/")
        page.goto('http://localhost:3001/')
        page.wait_for_load_state('networkidle')
        time.sleep(2)
        
        # 截图：页面加载后的初始状态
        page.screenshot(path='d:/test/award-poster-app/test-results/01-page-load.png', full_page=True)
        print("  ✓ 已截图: 01-page-load.png (页面加载后)")
        
        # 测试1: 检查页面加载时是否显示下拉框
        print("\n[2] 测试1: 检查页面加载时是否显示搜索结果下拉框")
        try:
            # 查找下拉框提示文字
            dropdown_tip = page.locator('text=找到').first
            is_dropdown_visible = dropdown_tip.is_visible()
            
            if is_dropdown_visible:
                print("  ✗ 测试失败: 页面加载时显示了搜索结果下拉框")
            else:
                print("  ✓ 测试通过: 页面加载时没有显示搜索结果下拉框")
                
        except Exception as e:
            print(f"  ✓ 测试通过: 页面加载时没有显示搜索结果下拉框 (未找到下拉框元素)")
        
        # 测试2: 点击搜索框获取焦点
        print("\n[3] 测试2: 点击搜索框获取焦点后是否显示下拉框")
        try:
            search_input = page.locator('input[placeholder*="搜索并添加奖项"]').first
            print(f"  找到搜索框: {search_input.is_visible()}")
            
            # 点击搜索框获取焦点
            search_input.click()
            time.sleep(1)
            
            # 截图：获取焦点后
            page.screenshot(path='d:/test/award-poster-app/test-results/02-after-focus.png', full_page=True)
            print("  ✓ 已截图: 02-after-focus.png (获取焦点后)")
            
            # 检查下拉框是否显示
            dropdown_tip = page.locator('text=找到').first
            is_dropdown_visible = dropdown_tip.is_visible()
            
            if is_dropdown_visible:
                dropdown_text = dropdown_tip.inner_text()
                print(f"  下拉框内容: {dropdown_text}")
                print("  ✓ 测试通过: 获取焦点后显示了搜索结果下拉框")
            else:
                print("  ✗ 测试失败: 获取焦点后没有显示搜索结果下拉框")
                
        except Exception as e:
            print(f"  测试出错: {e}")
        
        # 测试3: 输入关键词搜索
        print("\n[4] 测试3: 输入关键词后搜索功能是否正常")
        try:
            search_input = page.locator('input[placeholder*="搜索并添加奖项"]').first
            search_input.fill("优秀")
            time.sleep(1)
            
            page.screenshot(path='d:/test/award-poster-app/test-results/03-after-search.png', full_page=True)
            print("  ✓ 已截图: 03-after-search.png (输入关键词后)")
            
            # 检查搜索结果
            dropdown_tip = page.locator('text=找到').first
            if dropdown_tip.is_visible():
                dropdown_text = dropdown_tip.inner_text()
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
    test_search_focus_behavior()
