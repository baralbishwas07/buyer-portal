# Buyer Portal

A real-estate buyer portal where users can register, browse properties, and manage a personal favourites list.

**Live Demo:** [https://buyer-portal-frontend.vercel.app/](https://buyer-portal-frontend.vercel.app/)

**Stack:** React + Vite (frontend), Express + Prisma (backend), PostgreSQL (Supabase)

---

## How to Run

### 1. Install Dependencies
```bash
# Install backend dependencies
cd backend && npm install

# Install frontend dependencies
cd ../frontend && npm install
```

### 2. Set Up Environment Variables

**backend/.env**
```env
DATABASE_URL="postgresql://postgres...aws-1-ap-south-1.pooler.supabase.com:6543/postgres?pgbouncer=true"
JWT_SECRET="your_access_token_secret"
REFRESH_TOKEN_SECRET="your_refresh_token_secret"
ACCESS_TOKEN_EXPIRY="15m"
REFRESH_TOKEN_EXPIRY="7d"
PORT=5000
CLIENT_URL="http://localhost:5173"
```

**frontend/.env**
```env
VITE_API_URL="http://localhost:5000/api"
```

### 3. Run Database Migrations and Seed
```bash
cd backend
# Create tables in your database
npx prisma migrate dev --name init
# Seed sample data
npm run db:seed
```

### 4. Start the Application

**Terminal 1 (Backend)**
```bash
cd backend && npm run dev
```

**Terminal 2 (Frontend)**
```bash
cd frontend && npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## Example Flows

### Sign Up → Dashboard
1. Go to the **Register** page from the login screen.
2. Fill in your name, email, and password (minimum 6 characters).
3. Click **Create Account**. 
4. You will be automatically logged in and redirected to the **Dashboard** with a success message.

### Login → Add Favourite
1. Go to the **Login** page and enter your credentials.
2. Click **Login**.
3. On the **Dashboard**, browse the property listings.
4. Click **Add to Favourites** on any property card.
5. The button instantly changes to **Favourited** and a success toast appears.

### View & Remove Favourites
1. Click **Favourites** in the top navigation bar.
2. View all your saved properties in a dedicated list.
3. Click **Remove** on any property card to instantly unfavourite it.

### Logout
1. Click the **Logout** button in the navigation bar.
2. Your session cookies will be cleared, and you will be redirected back to the login page.
