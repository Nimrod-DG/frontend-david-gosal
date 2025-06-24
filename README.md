# Frontend Test Application
A comprehensive React application built for frontend testing with autocomplete functionality, authentication, and modern UI/UX design.

## Features

- 🔐 **Authentication System** - Simple login/register functionality
- 🌍 **Country Selection** - Autocomplete with data from API
- 🚢 **Port Selection** - Dynamic loading based on selected country
- 📦 **Product Selection** - Dynamic loading based on selected port
- 💰 **Price Calculation** - Automatic total calculation with discount
- 🌙 **Dark Mode** - Toggle between light and dark themes
- 📱 **Responsive Design** - Works on all device sizes
- ⚡ **State Management** - Redux Toolkit for efficient state management
- 🎨 **Modern UI** - Material-UI components with custom styling
- 🔄 **Error Handling** - Comprehensive error handling and loading states
- ✅ **Form Validation** - React Hook Form with validation

## Tech Stack
- **Frontend Framework**: React 18
- **State Management**: Redux Toolkit
- **UI Library**: Material-UI (MUI)
- **Routing**: React Router DOM
- **Form Handling**: React Hook Form
- **HTTP Client**: Axios
- **Notifications**: React Hot Toast
- **Build Tool**: Vite

## API Endpoints

The application integrates with the following APIs:

- **Countries**: `http://202.157.176.100:3001/negaras`
- **Ports**: `http://202.157.176.100:3001/pelabuhans?filter={"where":{"id_negara":1}}`
- **Products**: `http://202.157.176.100:3001/barangs?filter={"where":{"id_pelabuhan":11}}`

## Installation & Setup
### Prerequisites

- Node.js (version 16 or higher)
- npm or yarn package manager

### Steps

1. **Clone the repository**
   ```bash
   git clone https://github.com/Nimrod-DG/frontend-david-gosal.git
   cd frontend-test-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173`

## How to Use

### 1. Authentication
- **Register**: Create a new account with name, email, and password
- **Login**: Sign in with your registered credentials
- User data is stored in localStorage for demo purposes

### 2. Dashboard
- View welcome message and application statistics
- Access navigation to different sections

### 3. Form Page
- **Step 1**: Select a country from the autocomplete dropdown
- **Step 2**: Choose a port (automatically filtered by selected country)
- **Step 3**: Select a product (automatically filtered by selected port)
- **Step 4**: View automatic price calculation with discount applied

### 4. Features
- **Dark Mode**: Toggle using the switch in the navigation bar
- **Responsive**: Works seamlessly on desktop, tablet, and mobile
- **Error Handling**: Graceful error messages with retry options
- **Loading States**: Visual feedback during API calls

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Layout/         # Layout components (Navbar, etc.)
│   └── UI/             # Generic UI components
├── pages/              # Page components
│   ├── Login/          # Login page
│   ├── Register/       # Registration page
│   ├── Dashboard/      # Dashboard page
│   └── FormPage/       # Main form page
├── services/           # API services
├── store/              # Redux store and slices
│   └── slices/         # Redux slices
├── theme/              # Material-UI theme configuration
├── App.jsx             # Main app component
└── main.jsx            # Application entry point
```

## Key Features Explained

### Autocomplete Functionality
- **Countries**: Loads all available countries on page load
- **Ports**: Dynamically loads when a country is selected
- **Products**: Dynamically loads when a port is selected
- All dropdowns include search functionality and loading states

### Price Calculation
- Formula: `Total = Price × (Discount / 100)`
- Automatic formatting in Indonesian Rupiah (IDR)
- Real-time calculation when product is selected

### State Management
- **Auth State**: User authentication status and data
- **Theme State**: Dark/light mode preference
- **Form State**: Selected values and API data
- Persistent storage using localStorage

### Error Handling
- Network timeout handling
- API error responses
- User-friendly error messages
- Retry functionality for failed requests

## Environment Variables

No environment variables are required for this demo application as it uses hardcoded API endpoints.

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
