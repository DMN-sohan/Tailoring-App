# 🗑️ Database Reset Scripts - Quick Guide

## 📁 Available Scripts

We provide **3 ways** to reset your database after demos:

| Script | Method | Setup Required | Best For |
|--------|--------|----------------|----------|
| `reset_database_simple.py` | REST API | ✅ Easy (just `requests`) | Quick & simple |
| `reset_database.py` | REST API | ✅ Easy (just `requests`) | Same as simple version |
| `reset_db.bat` / `reset_db.sh` | Wrapper | ✅ None | **RECOMMENDED** - One-click |

---

## 🚀 Quick Start (Recommended)

### Windows:
```bash
# Double-click reset_db.bat
# OR run in terminal:
reset_db.bat
```

### Mac/Linux:
```bash
chmod +x reset_db.sh
./reset_db.sh
```

### Manual (Any OS):
```bash
pip install requests
python reset_database_simple.py
```

---

## 📋 What Gets Deleted

All these collections will be **permanently removed**:

- ❌ `tailoring_customers` - All customer data
- ❌ `tailoring_sales` - All sales records
- ❌ `tailoring_masters` - All master craftsmen
- ❌ `tailoring_work_entries` - All work tracking data

---

## 🎯 Detailed Usage

### Method 1: Simple Script (RECOMMENDED) ⭐

**No Firebase credentials needed!**

```bash
# Install dependency
pip install requests

# Run script
python reset_database_simple.py
```

**Pros:**
- ✅ No Firebase Admin SDK setup
- ✅ No service account needed
- ✅ Works immediately
- ✅ Uses REST API

**Cons:**
- ⚠️ Requires Firebase rules to allow deletions

---

### Method 2: Standard Script

**Same as simple version, uses REST API**

```bash
# Install dependency
pip install requests

# Run script
python reset_database.py
```

**Note:** Both `reset_database.py` and `reset_database_simple.py` now use the same Firebase REST API approach. They work identically!

---

### Method 3: Quick Scripts

**One-click convenience wrappers**

**Windows:**
```bash
reset_db.bat
```

**Mac/Linux:**
```bash
chmod +x reset_db.sh
./reset_db.sh
```

**What they do:**
1. Check if Python is installed
2. Install `requests` if needed
3. Run `reset_database_simple.py`
4. Wait for user confirmation

---

## 🔒 Safety Features

### All scripts include:

1. **Preview**: Shows what will be deleted
2. **Confirmation**: Must type `DELETE` to proceed
3. **Summary**: Reports what was deleted
4. **Ctrl+C**: Cancel anytime

### Example Flow:

```
📊 CURRENT DATABASE STATUS
============================================================
📦 tailoring_customers          :   15 items
📦 tailoring_sales              :    8 items
📦 tailoring_masters            :   14 items
📦 tailoring_work_entries       :   32 items
------------------------------------------------------------
TOTAL DATA ITEMS                :   69
============================================================

⚠️  WARNING: This action cannot be undone!
Type 'DELETE' to confirm or anything else to cancel: DELETE

✅ Deleted tailoring_customers: 15 items
✅ Deleted tailoring_sales: 8 items
✅ Deleted tailoring_masters: 14 items
✅ Deleted tailoring_work_entries: 32 items

🎉 DATABASE RESET COMPLETE
```

---

## 🛠️ Installation

### Minimal Setup (Simple Script):
```bash
pip install requests
```

### Full Setup (Admin SDK):
```bash
pip install -r requirements.txt
```

Or individually:
```bash
pip install firebase-admin google-cloud-firestore google-cloud-storage
```

---

## 📝 After Reset Checklist

Once database is reset:

1. ✅ Open app: http://localhost:3000
2. ✅ Go to "Manage Masters"
3. ✅ System will auto-initialize 14 default masters
4. ✅ Add test customer
5. ✅ Record test sales
6. ✅ Enter test work data
7. ✅ Verify analytics work

---

## ⚠️ Troubleshooting

### "ModuleNotFoundError: No module named 'requests'"
```bash
pip install requests
```

### "Permission denied" Error
Check Firebase Database Rules. Must allow delete operations:
```json
{
  "rules": {
    ".read": true,
    ".write": true
  }
}
```

### Script hangs or freezes
Press `Ctrl+C` to cancel and try again.

### "Python not found"
Install Python from https://www.python.org/

**Windows**: Make sure "Add to PATH" is checked during installation

**Mac**: Use `python3` instead of `python`

---

## 🎓 Advanced Usage

### Automated Reset (No Confirmation)
```bash
echo DELETE | python reset_database_simple.py
```

### Script Integration
```python
# In your test script
import subprocess
subprocess.run(['python', 'reset_database_simple.py'], 
               input=b'DELETE\n')
```

### Check Database Status Only
```bash
# Run and type anything except DELETE
python reset_database_simple.py
# Type: cancel
```

---

## 📊 Script Comparison

| Feature | Simple | Admin SDK | Quick Scripts |
|---------|--------|-----------|---------------|
| Installation | Easy | Complex | Easiest |
| Dependencies | 1 package | 3 packages | Auto-install |
| Credentials | None | Required | None |
| Speed | Fast | Fast | Fast |
| Security | Rules-based | Bypasses rules | Rules-based |
| Production Ready | ✅ | ✅✅✅ | ✅ |

---

## 🔗 Related Documentation

- `DATABASE_RESET_GUIDE.md` - Detailed guide
- `requirements.txt` - Python dependencies
- `PROJECT_SUMMARY.md` - Database structure
- `CHANGELOG.md` - Version history

---

## 💡 Tips

1. **Always run after demos** to keep clean state
2. **Test locally first** before production use
3. **Take screenshots** if you need to recreate demo data
4. **Version control** your reset scripts
5. **Schedule regular resets** for test environments

---

## 🆘 Need Help?

1. Check Firebase Console connectivity
2. Verify internet connection
3. Ensure Python is installed correctly
4. Check Firebase Database Rules
5. Review error messages carefully

---

## 📦 Files Overview

```
tailoring-app/
├── reset_database_simple.py    ⭐ RECOMMENDED - Easy, REST API
├── reset_database.py            🔐 Advanced - Admin SDK
├── reset_db.bat                 🪟 Windows quick script
├── reset_db.sh                  🐧 Mac/Linux quick script
├── requirements.txt             📦 Python dependencies
├── DATABASE_RESET_GUIDE.md      📚 Detailed guide
└── RESET_DATABASE_README.md     📖 This file
```

---

**Remember**: Database resets are **permanent**. Always confirm before proceeding! 🔒

---

## ⚡ Quick Reference

| Task | Command |
|------|---------|
| **Quick reset (Windows)** | `reset_db.bat` |
| **Quick reset (Mac/Linux)** | `./reset_db.sh` |
| **Simple reset** | `python reset_database_simple.py` |
| **Admin SDK reset** | `python reset_database.py` |
| **Install simple deps** | `pip install requests` |
| **Install all deps** | `pip install -r requirements.txt` |
| **Check status only** | Run script, type "cancel" |
| **Force reset** | `echo DELETE \| python reset_database_simple.py` |

---

✨ **Happy Demo-ing!** ✨

