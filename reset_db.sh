#!/bin/bash
# Quick Database Reset Script for Linux/Mac
# ==========================================

echo ""
echo "========================================"
echo "  Tailoring Management System"
echo "  Quick Database Reset"
echo "========================================"
echo ""

# Check if Python is installed
if ! command -v python3 &> /dev/null && ! command -v python &> /dev/null; then
    echo "ERROR: Python is not installed"
    echo "Please install Python from https://www.python.org/"
    exit 1
fi

# Use python3 if available, otherwise python
PYTHON_CMD="python3"
if ! command -v python3 &> /dev/null; then
    PYTHON_CMD="python"
fi

# Check if requests library is installed
$PYTHON_CMD -c "import requests" 2>/dev/null
if [ $? -ne 0 ]; then
    echo "Installing required dependencies..."
    pip3 install requests || pip install requests
fi

# Run the simple reset script
$PYTHON_CMD reset_database_simple.py

echo ""
read -p "Press Enter to continue..."



