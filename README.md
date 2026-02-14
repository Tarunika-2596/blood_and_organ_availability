# Blood and Organ Availability Web Application

A full-stack MERN application for managing and searching blood and organ availability across hospitals.

## Tech Stack

- **Frontend**: React.js, React Router, Context API, Axios
- **Backend**: Node.js, Express.js, MongoDB, Mongoose
- **Authentication**: JWT with bcrypt

## Features

### General Users (No Login)
- Search blood by group and city
- Search organs by type and city
- View hospital details and availability
- Outdated data highlighting (>24 hours)

### Hospital Staff
- Register and login
- Update blood stock
- Update organ availability
- Automatic timestamp logging

### Admin
- Approve/reject hospital registrations
- Disable inactive hospitals
- View system logs
- Monitor updates

## Setup Instructions

### Prerequisites
- Node.js (v14+)
- MongoDB (running locally or connection string)

### Backend Setup

1. Navigate to backend folder:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables in `.env`:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/blood_organ_db
JWT_SECRET=your_jwt_secret_key_change_in_production
```

4. Start the server:
```bash
npm run dev
```

Backend will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to frontend folder:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

Frontend will run on `http://localhost:3000`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register hospital/admin
- `POST /api/auth/login` - Login

### Blood
- `GET /api/blood/search?group=A+&city=Chennai` - Search blood
- `PUT /api/blood/update` - Update blood stock (Hospital only)

### Organs
- `GET /api/organs/search?organ=Kidney&city=Chennai` - Search organs
- `PUT /api/organs/update` - Update organ availability (Hospital only)

### Hospitals
- `GET /api/hospitals` - Get all hospitals
- `PUT /api/hospitals/:id/approve` - Approve hospital (Admin only)
- `PUT /api/hospitals/:id/disable` - Disable hospital (Admin only)

### Admin
- `GET /api/admin/hospitals` - Get all hospitals (Admin only)
- `GET /api/admin/logs` - Get update logs (Admin only)

## Database Schema

### Collections
- **users** - User accounts (hospital staff, admin)
- **hospitals** - Hospital information
- **bloodstocks** - Blood availability data
- **organavailabilities** - Organ availability data
- **updatelogs** - System update logs

## Default Admin Creation

To create an admin user, use MongoDB shell or Compass:

```javascript
// First create admin user via registration endpoint or directly in DB
// Then manually set role to 'admin' in the users collection
```

## Project Structure

```
backend/
├── config/         # Database configuration
├── controllers/    # Request handlers
├── models/         # Mongoose schemas
├── routes/         # API routes
├── middleware/     # Auth middleware
└── server.js       # Entry point

frontend/
├── public/         # Static files
└── src/
    ├── components/ # Reusable components
    ├── pages/      # Page components
    ├── services/   # API calls
    ├── context/    # Auth context
    └── App.js      # Main component
```

## Security Features

- Password hashing with bcrypt
- JWT-based authentication
- Role-based access control
- Input validation
- Protected routes

## Notes

- Blood stock cannot be negative
- Only approved hospitals can update data
- Data older than 24 hours is marked as outdated
- All updates are logged automatically
