# Tailoring Management System

A comprehensive React.js application for managing tailoring/garment business operations with three integrated tools.

## Features

### Tool 1: Customer Measurements
- **Add/Edit Customer**: Store customer information with phone number lookup
- **Measurement Tracking**: Track measurements for different garment types:
  - Blouses (Length, Dart Point, Upper Chest, Chest, Waist, Shoulder, Sleeves, Armhole)
  - Pants (Height, Waist, Hips)
  - Petticoat (Height, Waist)
  - Lengha (Height, Waist)
  - Dresses (Long Length, Mid Length, Chest, Waist, Hips, Slit, Shoulder, Armhole, Sleeves)
- **Search Functionality**: Search customers by name or phone number
- **Phone Lookup**: Auto-fill customer data if exists in database

### Tool 2: Sales Tracking
- **Sales Entry**: Excel-style table for recording daily sales
  - Customer name, number, and address
  - Items: Embroidery Lenghas, Dresses, Blouses, Petticoat
- **Analytics Dashboard** (Password Protected):
  - Daily/Monthly/Yearly views
  - Total sales statistics
  - Item type breakdown with charts
  - Top customers by purchase volume

### Tool 3: Master Production Tracking
- **Manage Masters**: Add/remove master craftsmen
  - Initial masters: Naveed, Kaleem, Aslam, Sharukh master, Ismail, Balamani, Ambica, lalitha, Soumya, Kavitha, Hareeja, Khurshid, Sabir, Arif
- **Daily Work Entry**: Track production with counter buttons
  - Item types: Blouse, Pant's, Tops, Lengha, Petticoat, Alteration, S Falls, P.C., Hook
  - 3 masters per row layout
- **Analytics Dashboard** (Password Protected):
  - Daily/Monthly/Yearly production statistics
  - Master-wise breakdown
  - Item type distribution
  - Sortable tables

## Tech Stack

- **React.js** - Frontend framework
- **Material-UI (MUI)** - UI components and styling
- **Firebase Realtime Database** - Backend and data storage
- **React Router** - Navigation
- **date-fns** - Date handling
- **Recharts** - Analytics charts and visualization

## Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Firebase Configuration

The application uses Firebase Realtime Database with encrypted credentials. The configuration is automatically decrypted at runtime.

### Database Structure

```
/customers
  /{customerId}
    - firstName, lastName, phoneNumber
    - Measurements for all garment types

/sales
  /{date}
    /{entryId}
      - date, rows (sales entries)

/masters
  /{masterId}
    - id, name

/work-entries
  /{date}
    /{masterId}
      - Item counts for each type
```

## Password Protection

Analytics pages are password protected:
- **Password**: `Gundojus@123`

## Usage

### Adding a Customer
1. Navigate to "Customer Measurements" → "Add Customer"
2. Enter phone number and click "Lookup" to check if customer exists
3. Fill in name and measurements for required garment types
4. Click "Save Customer"

### Recording Sales
1. Navigate to "Sales Tracking" → "Sales Entry"
2. Select the date
3. Fill in customer details and items sold in the table
4. Click "Add Row" for multiple entries
5. Click "Save Sales"

### Tracking Master Production
1. Navigate to "Master Production" → "Work Entry"
2. Select the date
3. Use +/- buttons to record items completed by each master
4. Click "Save Work Data"

### Viewing Analytics
1. Click on "Analytics" button in respective sections
2. Enter password: `Gundojus@123`
3. Select date range (daily/monthly/yearly)
4. View charts and statistics

## Features Highlights

- ✅ Material-UI for clean, professional design
- ✅ Responsive layout for all screen sizes
- ✅ Real-time Firebase database sync
- ✅ Excel-style data entry tables
- ✅ Interactive charts and visualizations
- ✅ Password-protected analytics
- ✅ Search and filter functionality
- ✅ Phone number lookup with country codes
- ✅ Auto-extrapolation of common measurements

## Build for Production

```bash
npm run build
```

This creates an optimized production build in the `build` folder.

## Resetting Database After Demo

After demonstrating the application, you can reset all data using the provided Python scripts:

### Quick Reset (Recommended)
```bash
# Windows
reset_db.bat

# Mac/Linux
./reset_db.sh
```

### Manual Reset
```bash
pip install requests
python reset_database_simple.py
```

**What gets deleted:**
- All customers and measurements
- All sales records
- All master craftsmen
- All work entries

See `RESET_DATABASE_README.md` for detailed instructions.

## Contributing

This is a custom tailoring business management system. For modifications or issues, please contact the development team.

## License

Private project for internal use.
