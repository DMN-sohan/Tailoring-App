"""
Firebase Database Reset Script for Tailoring Management System
===============================================================

This script clears all data from the tailoring management system's
Firebase Realtime Database after a demo.

⚠️  WARNING: This will DELETE ALL data from:
    - tailoring_customers
    - tailoring_sales
    - tailoring_masters
    - tailoring_work_entries

Usage:
    python reset_database.py

The script will ask for confirmation before deleting data.
"""

import requests
import sys


def decrypt_shifted_ascii(text):
    """Decrypt the shifted ASCII encrypted string"""
    return ''.join(chr(ord(char) - 1) for char in text)


def get_database_url():
    """Get Firebase database URL"""
    encrypted_url = "iuuqt;00hvoepkvt.qspe.efgbvmu.suec/btjb.tpvuifbtu2/gjsfcbtfebubcbtf/bqq"
    return decrypt_shifted_ascii(encrypted_url)


def get_data_count(collection):
    """Get count of items in a collection"""
    db_url = get_database_url()
    url = f"{db_url}/{collection}.json"
    
    try:
        response = requests.get(url, timeout=10)
        if response.status_code == 200:
            data = response.json()
            return len(data) if data else 0
        return 0
    except Exception as e:
        print(f"⚠️  Warning: Could not get count for {collection}: {e}")
        return 0


def get_data_counts():
    """Get count of items in each collection"""
    counts = {}
    collections = [
        'tailoring_customers',
        'tailoring_sales',
        'tailoring_masters',
        'tailoring_work_entries'
    ]
    
    for collection in collections:
        counts[collection] = get_data_count(collection)
            
    return counts


def display_current_data():
    """Display current data in the database"""
    print("\n" + "="*60)
    print("📊 CURRENT DATABASE STATUS")
    print("="*60)
    
    counts = get_data_counts()
    total = sum(counts.values())
    
    for collection, count in counts.items():
        status = "📦" if count > 0 else "📭"
        print(f"{status} {collection:30s}: {count:4d} items")
    
    print("-"*60)
    print(f"{'TOTAL DATA ITEMS':30s}: {total:4d}")
    print("="*60)
    
    return total


def confirm_deletion():
    """Ask user to confirm deletion"""
    print("\n⚠️  WARNING: This action cannot be undone!")
    print("All data from the tailoring management system will be permanently deleted.")
    print("\nType 'DELETE' to confirm or anything else to cancel: ", end='')
    
    confirmation = input().strip()
    return confirmation == 'DELETE'


def delete_collection(collection):
    """Delete a collection using REST API"""
    db_url = get_database_url()
    url = f"{db_url}/{collection}.json"
    
    try:
        response = requests.delete(url, timeout=10)
        if response.status_code == 200:
            return True
        else:
            print(f"⚠️  Warning: HTTP {response.status_code} when deleting {collection}")
            return False
    except Exception as e:
        print(f"❌ Error deleting {collection}: {e}")
        return False


def reset_database():
    """Reset the entire database"""
    collections = [
        'tailoring_customers',
        'tailoring_sales',
        'tailoring_masters',
        'tailoring_work_entries'
    ]
    
    print("\n🗑️  Starting database reset...\n")
    
    # Get current counts
    counts = get_data_counts()
    deleted_counts = {}
    
    for collection in collections:
        count = counts[collection]
        
        if count > 0:
            if delete_collection(collection):
                deleted_counts[collection] = count
                print(f"✅ Deleted {collection}: {count} items")
            else:
                deleted_counts[collection] = 0
                print(f"❌ Failed to delete {collection}")
        else:
            deleted_counts[collection] = 0
            print(f"⏭️  Skipped {collection}: Already empty")
    
    print("\n" + "="*60)
    print("🎉 DATABASE RESET COMPLETE")
    print("="*60)
    
    total_deleted = sum(deleted_counts.values())
    print(f"\n📊 Total items deleted: {total_deleted}")
    
    for collection, count in deleted_counts.items():
        if count > 0:
            print(f"   - {collection}: {count} items")
    
    print("\n✨ The database is now clean and ready for a new demo!")
    print("="*60)


def main():
    """Main function"""
    print("""
╔══════════════════════════════════════════════════════════════╗
║                                                              ║
║        Tailoring Management System - Database Reset         ║
║                  (Using Firebase REST API)                   ║
║                                                              ║
╚══════════════════════════════════════════════════════════════╝
    """)
    
    print("✅ Connecting to Firebase...")
    
    # Display current data
    total_items = display_current_data()
    
    if total_items == 0:
        print("\n✨ Database is already empty. Nothing to delete!")
        return
    
    # Confirm deletion
    if not confirm_deletion():
        print("\n❌ Database reset cancelled.")
        print("No data was deleted.")
        return
    
    # Reset the database
    reset_database()


if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print("\n\n⚠️  Operation cancelled by user.")
        print("No data was deleted.")
        sys.exit(0)
    except Exception as e:
        print(f"\n❌ Unexpected error: {e}")
        sys.exit(1)

