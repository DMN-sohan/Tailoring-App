# Database Reset Guide

## 🎯 Purpose

The `reset_database.py` script allows you to completely clear all demo data from your Tailoring Management System after demonstrations.

---

## 📋 What Gets Deleted

The script will remove ALL data from these collections:

- ✅ **tailoring_customers** - All customer information and measurements
- ✅ **tailoring_sales** - All sales entries and transactions
- ✅ **tailoring_masters** - All master craftsmen (will need to be re-initialized)
- ✅ **tailoring_work_entries** - All production tracking data

⚠️ **WARNING**: This action is **PERMANENT** and **CANNOT BE UNDONE**

---

## 🔧 Setup Instructions

### Step 1: Install Python Dependencies

```bash
cd tailoring-app
pip install -r requirements.txt
```

Or install manually:

```bash
pip install firebase-admin google-cloud-firestore google-cloud-storage
```

### Step 2: Firebase Admin SDK Setup (Optional but Recommended)

For full functionality, you should set up Firebase Admin SDK credentials:

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Go to **Project Settings** → **Service Accounts**
4. Click **Generate New Private Key**
5. Save the JSON file as `serviceAccountKey.json` in the `tailoring-app` folder

**Note**: The script will work with basic database access, but for production use, proper credentials are recommended.

---

## 🚀 How to Use

### Running the Script

```bash
python reset_database.py
```

### What Happens:

1. **Connection**: Script connects to Firebase
2. **Display**: Shows current data counts
3. **Confirmation**: Asks you to type `DELETE` to confirm
4. **Deletion**: Removes all data from the collections
5. **Summary**: Shows what was deleted

### Example Output:

```
╔══════════════════════════════════════════════════════════════╗
║                                                              ║
║        Tailoring Management System - Database Reset         ║
║                                                              ║
╚══════════════════════════════════════════════════════════════╝

✅ Firebase initialized successfully

============================================================
📊 CURRENT DATABASE STATUS
============================================================
📦 tailoring_customers          :   15 items
📦 tailoring_sales              :   23 items
📦 tailoring_masters            :   14 items
📦 tailoring_work_entries       :   45 items
------------------------------------------------------------
TOTAL DATA ITEMS                :   97
============================================================

⚠️  WARNING: This action cannot be undone!
All data from the tailoring management system will be permanently deleted.

Type 'DELETE' to confirm or anything else to cancel: DELETE

🗑️  Starting database reset...

✅ Deleted tailoring_customers: 15 items
✅ Deleted tailoring_sales: 23 items
✅ Deleted tailoring_masters: 14 items
✅ Deleted tailoring_work_entries: 45 items

============================================================
🎉 DATABASE RESET COMPLETE
============================================================

📊 Total items deleted: 97
   - tailoring_customers: 15 items
   - tailoring_sales: 23 items
   - tailoring_masters: 14 items
   - tailoring_work_entries: 45 items

✨ The database is now clean and ready for a new demo!
============================================================
```

---

## 🛡️ Safety Features

### 1. Confirmation Required
You must type `DELETE` (case-sensitive) to proceed. Any other input cancels the operation.

### 2. Data Preview
Shows exactly how many items will be deleted before asking for confirmation.

### 3. Cancellation Options
- Type anything except `DELETE` to cancel
- Press `Ctrl+C` at any time to abort

### 4. Summary Report
After deletion, shows exactly what was removed.

---

## 📝 Common Use Cases

### After a Demo
```bash
python reset_database.py
# Type DELETE when prompted
```

### Check Database Status (Without Deleting)
```bash
python reset_database.py
# Type anything except DELETE to cancel
```

### Automated Testing Cleanup
```bash
# Add to your test cleanup script
python reset_database.py <<< "DELETE"
```

---

## ⚠️ Important Notes

### 1. Masters Need Re-initialization
After reset, visit the "Manage Masters" page to re-initialize the 14 default masters.

### 2. No Backup
This script does **NOT** create backups. If you need to preserve data:
- Export from Firebase Console before running
- Or manually backup important data

### 3. Database Rules
Ensure your Firebase rules allow delete operations from your IP/authentication.

### 4. Network Connection
Requires active internet connection to access Firebase.

---

## 🔍 Troubleshooting

### Error: "Failed to initialize Firebase"

**Solution**: Check your internet connection and Firebase credentials.

```bash
pip install --upgrade firebase-admin
```

### Error: "Permission denied"

**Solution**: Check Firebase Database Rules. Ensure you have write/delete permissions.

### Script Hangs

**Solution**: Press `Ctrl+C` to cancel and try again.

### "Module not found" Error

**Solution**: Install dependencies:
```bash
pip install firebase-admin
```

---

## 🎓 Advanced Usage

### Script Integration

You can import and use the reset function in other Python scripts:

```python
from reset_database import reset_database, initialize_firebase

# Initialize Firebase
initialize_firebase()

# Reset database (will still ask for confirmation)
reset_database()
```

### Custom Deletion

To delete only specific collections, modify the script:

```python
# In reset_database.py, change the collections list
collections = [
    'tailoring_customers',  # Only delete customers
]
```

---

## 📊 What to Do After Reset

1. **Open the app**: http://localhost:3000
2. **Go to Manage Masters**: Re-initialize the 14 default masters
3. **Add test customer**: Add a sample customer to verify
4. **Record test sale**: Add a test sales entry
5. **Enter test work**: Record some work entries
6. **Check analytics**: Verify all features work

---

## 🔗 Related Files

- `reset_database.py` - The reset script
- `requirements.txt` - Python dependencies
- `src/firebase.js` - Firebase configuration
- `PROJECT_SUMMARY.md` - Database structure documentation

---

## 💡 Tips

1. **Run after each demo** to ensure clean state for next demo
2. **Test locally first** before using on production data
3. **Document important demo data** if you need to recreate it
4. **Use version control** to track when resets occur

---

## 🆘 Support

If you encounter issues:

1. Check Firebase Console for connectivity
2. Verify database rules allow deletions
3. Ensure Python and dependencies are up to date
4. Check network/firewall settings

---

**Remember**: This script is powerful and permanent. Always double-check before confirming deletion! 🔒


