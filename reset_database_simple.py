"""
Simple Firebase Database Reset Script (REST API)
================================================

This script uses Firebase REST API to reset the database.
No Firebase Admin SDK credentials needed!

Usage:
    python reset_database_simple.py
"""

import requests
import json


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
        response = requests.get(url)
        if response.status_code == 200:
            data = response.json()
            return len(data) if data else 0
        return 0
    except Exception as e:
        print(f"Error getting count for {collection}: {e}")
        return 0


def delete_collection(collection):
    """Delete a collection using REST API"""
    db_url = get_database_url()
    url = f"{db_url}/{collection}.json"
    
    try:
        response = requests.delete(url)
        if response.status_code == 200:
            return True
        else:
            print(f"Error deleting {collection}: HTTP {response.status_code}")
            return False
    except Exception as e:
        print(f"Error deleting {collection}: {e}")
        return False


def main():
    """Main function"""
    print("""
╔══════════════════════════════════════════════════════════════╗
║                                                              ║
║     Tailoring Management System - Simple Database Reset     ║
║                    (REST API Version)                        ║
║                                                              ║
╚══════════════════════════════════════════════════════════════╝
    """)
    
    collections = [
        'tailoring_customers',
        'tailoring_sales',
        'tailoring_masters',
        'tailoring_work_entries'
    ]
    
    # Display current data
    print("\n" + "="*60)
    print("📊 CURRENT DATABASE STATUS")
    print("="*60)
    
    counts = {}
    total = 0
    
    for collection in collections:
        count = get_data_count(collection)
        counts[collection] = count
        total += count
        status = "📦" if count > 0 else "📭"
        print(f"{status} {collection:30s}: {count:4d} items")
    
    print("-"*60)
    print(f"{'TOTAL DATA ITEMS':30s}: {total:4d}")
    print("="*60)
    
    if total == 0:
        print("\n✨ Database is already empty. Nothing to delete!")
        return
    
    # Confirm deletion
    print("\n⚠️  WARNING: This action cannot be undone!")
    print("All data from the tailoring management system will be permanently deleted.")
    print("\nType 'DELETE' to confirm or anything else to cancel: ", end='')
    
    confirmation = input().strip()
    
    if confirmation != 'DELETE':
        print("\n❌ Database reset cancelled.")
        print("No data was deleted.")
        return
    
    # Delete collections
    print("\n🗑️  Starting database reset...\n")
    
    deleted_counts = {}
    
    for collection in collections:
        if counts[collection] > 0:
            if delete_collection(collection):
                deleted_counts[collection] = counts[collection]
                print(f"✅ Deleted {collection}: {counts[collection]} items")
            else:
                deleted_counts[collection] = 0
                print(f"❌ Failed to delete {collection}")
        else:
            deleted_counts[collection] = 0
            print(f"⏭️  Skipped {collection}: Already empty")
    
    # Summary
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


if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print("\n\n⚠️  Operation cancelled by user.")
        print("No data was deleted.")
    except Exception as e:
        print(f"\n❌ Unexpected error: {e}")
        import traceback
        traceback.print_exc()


