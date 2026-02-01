# JuniorKits - Equipment Management System

A professional web application for movie production and photo studios to manage, monitor, and track their equipment and gear inventory for upcoming jobs.

## Features

### 🔐 Secure Access
- Login page with passcode authentication ("joopie")
- Session persistence with localStorage

### 📅 Job Management
- Monthly calendar view for job scheduling
- Add, edit, and delete job events
- Highlight upcoming job events
- Interactive equipment checklist for each job
- Job details: date, location, price, description

### 📦 Inventory Management
- Complete equipment inventory tracking
- Add, edit, and delete equipment items
- Equipment attributes: short name, full name, value, defects, quantity, buy date, notes, status
- Status tracking: NEW, OLD, DAMAGED, UNAVAILABLE
- Search and filter functionality
- Equipment value calculation and reporting

### ✅ Equipment Checklist System
- Interactive checklist for job equipment requirements
- Track equipment availability and packing status
- Notes and defect tracking per item
- Visual status indicators and progress tracking

## Tech Stack

- **Frontend**: React 18 with Vite
- **UI Framework**: Material-UI (MUI) v7
- **Routing**: React Router v7
- **Icons**: Lucide React
- **Date Handling**: Date-fns
- **Database**: Firebase Firestore
- **Authentication**: Firebase Auth (custom passcode)
- **Styling**: CSS-in-JS with custom design system
- **Hosting**: Firebase Hosting

## Design Philosophy

This application avoids generic "AI slop" aesthetics with:
- Custom color scheme (deep slate blue, warm orange accents)
- Helvetica Neue typography (avoiding overused system fonts)
- Unique visual elements and animations
- Production-grade UI with attention to detail
- Context-specific design choices

## Project Structure

```
juniorkits/
├── src/
│   ├── components/          # Reusable components
│   │   └── EquipmentChecklist.js
│   ├── pages/              # Main page components
│   │   ├── Login.js
│   │   ├── Dashboard.js
│   │   ├── JobsTab.js
│   │   └── InventoryTab.js
│   ├── services/           # Firebase services
│   │   └── firebase.js
│   ├── styles/             # Global styles
│   │   └── global.css
│   ├── App.js              # Main app component
│   └── main.jsx            # Entry point
├── public/                 # Static assets
├── firebase.json           # Firebase hosting config
├── vite.config.js          # Vite build config
└── README.md
```

## Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Adimaano/juniorkits.git
   cd juniorkits
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up Firebase:**
   - Create a Firebase project at [Firebase Console](https://console.firebase.google.com/)
   - Enable Firestore Database
   - Enable Authentication (if using Firebase Auth)
   - Update the Firebase configuration in `src/services/firebase.js` with your project credentials

4. **Run the development server:**
   ```bash
   npm run dev
   ```

5. **Build for production:**
   ```bash
   npm run build
   ```

## Firebase Configuration

Update the Firebase configuration in `src/services/firebase.js`:

```javascript
const firebaseConfig = {
  apiKey: "your-api-key",
  authDomain: "your-project-id.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project-id.appspot.com",
  messagingSenderId: "your-sender-id",
  appId: "your-app-id"
};
```

## Usage

1. **Access the application:**
   - Navigate to `http://localhost:3000`
   - Enter the passcode: `joopie`

2. **Job Management:**
   - Use the "Jobs" tab to view the calendar
   - Click dates to add or view jobs
   - Use the checklist to track equipment for each job

3. **Inventory Management:**
   - Use the "Inventory" tab to manage equipment
   - Add new equipment with all required attributes
   - Search and filter equipment by status or name

## Data Models

### Equipment
```javascript
{
  id: string,
  shortName: string,        // Short, descriptive name
  fullName: string,         // Manufacturer, model, etc.
  value: number,            // MSRP/price
  defects: string[],        // List of damages/defects
  howMany: number,          // Quantity available
  buyDate: string,          // Date acquired
  notes: string,            // Additional description
  status: string,           // NEW, OLD, DAMAGED, UNAVAILABLE
  createdAt: string,
  updatedAt: string
}
```

### Job
```javascript
{
  id: string,
  date: string,             // Job date
  location: string,         // Job location
  price: number,            // Expected payment
  description: string,      // Job description
  gear: string[],           // Array of equipment IDs
  createdAt: string,
  updatedAt: string
}
```

## Deployment

### Firebase Hosting

1. **Install Firebase CLI:**
   ```bash
   npm install -g firebase-tools
   ```

2. **Login to Firebase:**
   ```bash
   firebase login
   ```

3. **Initialize Firebase project:**
   ```bash
   firebase init hosting
   ```

4. **Build the application:**
   ```bash
   npm run build
   ```

5. **Deploy to Firebase:**
   ```bash
   firebase deploy
   ```

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Accessibility

The application includes:
- Keyboard navigation support
- Screen reader compatibility
- High contrast mode support
- Reduced motion preferences
- Focus indicators

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - see LICENSE file for details.

## Support

For issues, questions, or feature requests, please [open an issue](https://github.com/Adimaano/juniorkits/issues) on GitHub.

---

**JuniorKits** - Professional equipment management for creative studios.