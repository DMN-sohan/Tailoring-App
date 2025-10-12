# Setup and Running Instructions

## Quick Start

The application has been set up and is ready to run!

### Development Server

The development server should already be running. If not, run:

```bash
cd tailoring-app
npm start
```

The application will open automatically at [http://localhost:3000](http://localhost:3000)

## First Time Setup Checklist

✅ React app initialized
✅ All dependencies installed:
   - @mui/material (Material-UI components)
   - @mui/icons-material (Material-UI icons)
   - @emotion/react & @emotion/styled (styling)
   - firebase (database)
   - react-router-dom (routing)
   - date-fns (date utilities)
   - recharts (charts/analytics)

✅ Firebase configured with encrypted credentials
✅ All pages and components created:
   - Home page with navigation
   - Customer management (add/edit/list)
   - Sales entry and analytics
   - Master management and work entry
   - Master analytics

## Application Structure

```
tailoring-app/
├── src/
│   ├── components/
│   │   └── ProtectedRoute.js       # Password protection
│   ├── pages/
│   │   ├── Home.js                 # Main landing page
│   │   ├── CustomerForm.js         # Add/Edit customer
│   │   ├── CustomerList.js         # View all customers
│   │   ├── SalesEntry.js           # Sales data entry
│   │   ├── SalesAnalytics.js       # Sales analytics (protected)
│   │   ├── ManageMasters.js        # Manage master list
│   │   ├── WorkEntry.js            # Daily work entry
│   │   └── MasterAnalytics.js      # Master analytics (protected)
│   ├── firebase.js                 # Firebase configuration
│   ├── App.js                      # Main app with routing
│   └── index.js                    # App entry point
├── public/
├── package.json
└── README.md
```

## Navigation Flow

### Tool 1: Customer Measurements
- Home → "Add Customer" or "View Customers"
- View Customers → Click edit icon → Edit customer
- Customer Form has phone lookup feature

### Tool 2: Sales Tracking
- Home → "Sales Entry" (main entry page)
- Home → "Analytics" (password protected)
- Password: `Gundojus@123`

### Tool 3: Master Production
- Home → "Manage Masters" (add/remove masters)
- Home → "Work Entry" (daily production tracking)
- Home → "Analytics" (password protected)
- Password: `Gundojus@123`

## Default Data

### Initial Masters
When you first visit "Manage Masters", the system will initialize with these masters:
- Naveed
- Kaleem
- Aslam
- Sharukh master
- Ismail
- Balamani
- Ambica
- lalitha
- Soumya
- Kavitha
- Hareeja
- Khurshid
- Sabir
- Arif

## Database

Firebase Realtime Database is automatically configured. Data structure:
- `/customers` - Customer information and measurements
- `/sales` - Daily sales entries
- `/masters` - List of master craftsmen
- `/work-entries` - Daily production data by master

## Features to Test

1. **Customer Management**
   - Add a new customer with phone number
   - Search for customers
   - Edit existing customer measurements

2. **Sales Tracking**
   - Enter sales data for a date
   - Add multiple rows
   - Delete rows
   - View analytics (use password)

3. **Master Production**
   - View initial masters list
   - Add/remove masters
   - Enter daily work using +/- buttons
   - View production analytics (use password)

## Troubleshooting

### Port Already in Use
If port 3000 is already in use:
```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Then restart
npm start
```

### Firebase Connection Issues
- Check internet connection
- Firebase config is encrypted and decrypted automatically
- Check browser console for specific errors

### Material-UI Styling Issues
- Clear browser cache
- Restart development server

## Production Build

To create a production build:
```bash
npm run build
```

The optimized files will be in the `build/` folder.

## Support

For any issues or questions about the application, refer to the README.md file or check the inline code comments.

---

**Password for Analytics**: `Gundojus@123`


