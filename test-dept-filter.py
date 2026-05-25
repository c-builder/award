#!/usr/bin/env python3
"""
自动化测试脚本 - 验证部门过滤功能
"""

from playwright.sync_api import sync_playwright
import time

def test_dept_filter():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=False)
        page = browser.new_page()
        
        print("=" * 60)
        print("开始测试 - 部门过滤功能")
        print("=" * 60)
        
        # 访问应用
        print("\n[1] 访问应用: http://localhost:3001/")
        page.goto('http://localhost:3001/')
        page.wait_for_load_state('networkidle')
        time.sleep(2)
        
        # 测试1: 全部部门时的搜索结果
        print("\n[2] 测试1: 全部部门时的搜索结果")
        search_input = page.locator('input[placeholder*="搜索并添加奖项"]').first
        search_input.click()
        time.sleep(1)
        
        dropdown_tip = page.locator('text=找到').first
        if dropdown_tip.is_visible():
            dropdown_text = dropdown_tip.inner_text()
            print(f"  全部部门时: {dropdown_text}")
        
        # 截图
        page.screenshot(path='d:/test/award-poster-app/test-results/01-all-depts.png', full_page=True)
        print("  ✓ 已截图: 01-all-depts.png")
        
        # 点击其他地方关闭下拉框
        page.keyboard.press('Escape')
        time.sleep(0.5)
        
        # 测试2: 选择特定部门 - IT平台服务部
        print("\n[3] 测试2: 选择IT平台服务部")
        try:
            # 点击部门选择器
            dept_selector = page.locator('.data-range-trigger').first
            dept_selector.click()
            time.sleep(0.5)
            
            # 选择IT平台服务部
            it_dept_option = page.locator('text=IT平台服务部').first
            it_dept_option.click()
            time.sleep(1)
            
            # 再次点击搜索框
            search_input.click()
            time.sleep(1)
            
            dropdown_tip = page.locator('text=找到').first
            if dropdown_tip.is_visible():
                dropdown_text = dropdown_tip.inner_text()
                print(f"  IT平台服务部: {dropdown_text}")
            
            page.screenshot(path='d:/test/award-poster-app/test-results/02-it-dept.png', full_page=True)
            print("  ✓ 已截图: 02-it-dept.png")
            
        except Exception as e:
            print(f"  测试出错: {e}")
        
        # 点击其他地方关闭下拉框
        page.keyboard.press('Escape')
        time.sleep(0.5)
        
        # 测试3: 选择特定部门 - 质量与流程IT部
        print("\n[4] 测试3: 选择质量与流程IT部")
        try:
            # 点击部门选择器
            dept_selector = page.locator('.data-range-trigger').first
            dept_selector.click()
            time.sleep(0.5)
            
            # 选择质量与流程IT部
            quality_dept_option = page.locator('text=质量与流程IT部').first
            quality_dept_option.click()
            time.sleep(1)
            
            # 再次点击搜索框
            search_input.click()
            time.sleep(1)
            
            dropdown_tip = page.locator('text=找到').first
            if dropdown_tip.is_visible():
                dropdown_text = dropdown_tip.inner_text()
                print(f"  质量与流程IT部: {dropdown_text}")
            
            page.screenshot(path='d:/test/award-poster-app/test-results/03-quality-dept.png', full_page=True)
            print("  ✓ 已截图: 03-quality-dept.png")
            
        except Exception as e:
            print(f"  测试出错: {e}")
        
        print("\n" + "=" * 60)
        print("测试完成")
        print("=" * 60)
        
        browser.close()

if __name__ == '__main__':
    import os
    os.makedirs('d:/test/award-poster-app/test-results', exist_ok=True)
    test_dept_filter()
