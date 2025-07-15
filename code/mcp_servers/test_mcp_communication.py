#!/usr/bin/env python3
"""
Test MCP communication to reproduce the charmap encoding error
"""

import asyncio
import sys
import os
import subprocess
import json
from pathlib import Path
import codecs

# Add current directory to path
sys.path.insert(0, str(Path(__file__).parent))

# Force UTF-8 encoding for stderr
if sys.platform == "win32":
    sys.stderr = codecs.getwriter('utf-8')(sys.stderr.detach())
    sys.stdout = codecs.getwriter('utf-8')(sys.stdout.detach())

class MockSearchInput:
    def __init__(self, query: str, max_results: int = 5):
        self.query = query
        self.max_results = max_results

class MockContext:
    pass

async def test_mcp_server_direct():
    """Test the MCP server directly via subprocess"""
    print("Testing MCP server via subprocess...")
    
    try:
        # Start the MCP server as a subprocess
        mcp_script = Path(__file__).parent / "mcp_servers" / "mcp_server_3.py"
        
        # Create a test input
        test_input = {
            "query": "Mahindra XUV 3XO features",
            "max_results": 3
        }
        
        print(f"Starting MCP server: {mcp_script}")
        print(f"Test input: {test_input}")
        
        # Run the MCP server directly
        process = subprocess.Popen(
            [sys.executable, str(mcp_script)],
            stdin=subprocess.PIPE,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            text=True,
            encoding='utf-8', 
            errors='replace'
        )
        
        # Send a test request (simplified MCP protocol)
        request = {
            "jsonrpc": "2.0",
            "id": 1,
            "method": "tools/call",
            "params": {
                "name": "search_web_with_text_content",
                "arguments": {
                    "input": test_input
                }
            }
        }
        
        request_str = json.dumps(request) + "\n"
        print(f"Sending request: {request_str}")
        
        stdout, stderr = process.communicate(input=request_str, timeout=30)
        
        print(f"STDOUT: {stdout}")
        print(f"STDERR: {stderr}")
        
        if "charmap" in stderr or "charmap" in stdout:
            print("❌ CHARMAP ENCODING ERROR DETECTED IN MCP COMMUNICATION!")
        else:
            print("✅ No charmap encoding error in MCP communication")
            
    except Exception as e:
        print(f"❌ Error testing MCP server: {e}")
        import traceback
        traceback.print_exc()

async def test_encoding_in_subprocess():
    """Test encoding issues in subprocess communication"""
    print("\nTesting encoding in subprocess communication...")
    
    try:
        # Create a simple script that returns Unicode content
        test_script = """
import sys
if sys.platform == 'win32':
    try:
        sys.stdout.reconfigure(encoding='utf-8')
        sys.stderr.reconfigure(encoding='utf-8')
    except AttributeError:
        import codecs
        sys.stdout = codecs.getwriter('utf-8')(sys.stdout.detach())
        sys.stderr = codecs.getwriter('utf-8')(sys.stderr.detach())
import json

# Simulate the MCP server response with Unicode content
response = {
    "content": [
        {
            "type": "text",
            "text": "This is test content with Unicode: ñáéíóú 🚗 世界 🌍"
        }
    ]
}

# Try to print the response
try:
    print(json.dumps(response, ensure_ascii=False))
    sys.stdout.flush()
except Exception as e:
    print(f"Error: {e}", file=sys.stderr)
    sys.stderr.flush()
"""
        
        # Write the test script
        script_path = Path(__file__).parent / "test_unicode_script.py"
        with open(script_path, 'w', encoding='utf-8') as f:
            f.write(test_script)
        
        # Run the script as subprocess
        process = subprocess.Popen(
            [sys.executable, str(script_path)],
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            text=True,
            encoding='utf-8'
        )
        
        stdout, stderr = process.communicate(timeout=10)
        
        print(f"STDOUT: {stdout}")
        print(f"STDERR: {stderr}")
        
        if "charmap" in stderr or "charmap" in stdout:
            print("❌ CHARMAP ENCODING ERROR DETECTED!")
        else:
            print("✅ No charmap encoding error")
            
        # Clean up
        script_path.unlink()
        
    except Exception as e:
        print(f"❌ Error testing subprocess encoding: {e}")
        import traceback
        traceback.print_exc()

def test_environment_encoding():
    """Test the environment encoding settings"""
    print("\nTesting environment encoding...")
    
    print(f"Python executable: {sys.executable}")
    print(f"Default encoding: {sys.getdefaultencoding()}")
    print(f"File system encoding: {sys.getfilesystemencoding()}")
    print(f"Platform: {sys.platform}")
    
    # Test stdout encoding
    try:
        print(f"STDOUT encoding: {sys.stdout.encoding}")
    except:
        print("STDOUT encoding: unknown")
    
    # Test stderr encoding - FIXED VERSION
    try:
        # Force UTF-8 encoding for stderr
        if sys.platform == "win32" and sys.stderr.encoding == 'charmap':
            sys.stderr = codecs.getwriter('utf-8')(sys.stderr.detach())
        print(f"STDERR encoding: {sys.stderr.encoding}")
    except Exception as e:
        print(f"STDERR encoding: unknown (error: {e})")

async def main():
    """Run all tests"""
    print("🚀 Testing MCP Communication Encoding Issues")
    print("=" * 50)
    
    # Test environment
    test_environment_encoding()
    
    # Test subprocess encoding
    await test_encoding_in_subprocess()
    
    # Test MCP server communication
    await test_mcp_server_direct()
    
    print("\n" + "=" * 50)
    print("🏁 Tests completed")

if __name__ == "__main__":
    asyncio.run(main()) 