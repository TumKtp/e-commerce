## Development Setup

Follow these steps to set up the project locally or using Docker Compose.

---

### Local Development

1. **Install Prerequisites**  
   Ensure you have **Node.js** and **PostgreSQL** installed on your local machine.

2. **Set Up `.env` File**  
   Create a `.env` file in the root of the project using the `.env.example` file as a template:

   ```bash
   cp .env.example .env
   ```

   Configure the environment variables in the `.env` file as needed.

3. **Create Database Schema**  
   Enable schema synchronization by setting the `synchronize` flag in `src/config/database.ts` to `true`:

   ```typescript
   synchronize: true
   ```

4. **Install Dependencies**  
   Install the required project dependencies:

   ```bash
   npm install
   ```

5. **Run the Project**  
   Start the development server:
   ```bash
   npm run dev
   ```

---

### Using Docker Compose

1. **Start Services**  
   Navigate to the `db` directory and use Docker Compose to start the database and backend services:
   ```bash
   cd db && docker-compose up
   ```

---

### Production Setup

1. **Build for Production**  
   Compile the project for production:

   ```bash
   npm run build
   ```

2. **Run in Production**  
   Start the production server:
   ```bash
   npm start
   ```
