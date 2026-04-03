# Saksham - Counselling and Booking Platform

A full-stack web application built for counselling services, appointment booking, and community support. This platform connects students with counsellors, provides resources, and fosters a supportive community through forums and chatbots.

## 🚀 Features

- **User Authentication**: Secure login/registration with JWT tokens and role-based access (Student, Counsellor, Admin)
- **Appointment Booking**: Schedule and manage counselling sessions with counsellors
- **Forum**: Community discussion platform for sharing experiences and support
- **Resources**: Access to mental health resources and educational materials
- **Chatbot**: AI-powered assistant for immediate support
- **Counsellor Dashboard**: Manage appointments and student interactions
- **Responsive Design**: Mobile-first design with dark/light theme support
- **Real-time Notifications**: Toast notifications for user actions

## 🛠 Tech Stack

### Backend
- **Java 17+** with Spring Boot
- **Spring Security** with JWT authentication
- **PostgreSQL** database (via Supabase)
- **Maven** for dependency management
- **Docker** for containerization

### Frontend
- **React 18** with Vite
- **Redux Toolkit** for state management
- **Tailwind CSS** + **DaisyUI** for styling
- **Axios** for API communication
- **Lucide React** for icons
- **React Router** for navigation

### DevOps
- **Docker Compose** for local development
- **Git** for version control

## 📋 Prerequisites

Before running this application, make sure you have the following installed:

- **Java 17 or higher**
- **Node.js 18+ and npm**
- **Docker and Docker Compose**
- **Git**

## 🏃‍♂️ Quick Start

### 1. Clone the Repository

```bash
git clone <repository-url>
cd saksham
```

### 2. Backend Setup

```bash
cd backend

# Install dependencies and run
# macOS / Linux
./mvnw spring-boot:run

# Windows PowerShell / Command Prompt
.\mvnw.cmd spring-boot:run
```

Use the `spring-boot:run` goal, not `spring-boot` by itself.

The backend will start on `http://localhost:8080`

### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

The frontend will start on `http://localhost:5173`

### 4. Using Docker (Alternative)

```bash
# Build and run all services
docker-compose up --build
```

## 🔧 Configuration

### Backend Configuration

Update `backend/src/main/resources/application.properties`:

```properties
# Database Configuration
spring.datasource.url=jdbc:postgresql://localhost:5432/saksham_db
spring.datasource.username=your_username
spring.datasource.password=your_password

# JWT Configuration
jwt.secret=your_jwt_secret_key
jwt.expiration=86400000

# Server Configuration
server.port=8080
```

### Frontend Configuration

Update `frontend/src/services/api.js` with your backend URL:

```javascript
const api = axios.create({
  baseURL: "http://localhost:8080", // or your deployed backend URL
  // ...
});
```

## 📚 API Documentation

### Authentication Endpoints
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `POST /api/auth/forgot-password` - Password reset request

### Booking Endpoints
- `GET /api/bookings` - Get user bookings
- `POST /api/bookings` - Create new booking
- `PUT /api/bookings/{id}` - Update booking
- `DELETE /api/bookings/{id}` - Cancel booking

### Resources Endpoints
- `GET /api/resources` - Get all resources (public)
- `POST /api/resources` - Add new resource (admin only)
- `PUT /api/resources/{id}` - Update resource
- `DELETE /api/resources/{id}` - Delete resource

### Forum Endpoints
- `GET /api/forum/posts` - Get forum posts
- `POST /api/forum/posts` - Create new post
- `POST /api/forum/posts/{id}/comments` - Add comment to post

## 🏗 Project Structure

```
saksham/
├── backend/
│   ├── src/main/java/com/saksham/
│   │   ├── controller/     # REST controllers
│   │   ├── entity/         # JPA entities
│   │   ├── repository/     # Data repositories
│   │   ├── service/        # Business logic
│   │   ├── security/       # JWT and security config
│   │   └── config/         # Application configuration
│   ├── src/main/resources/
│   │   └── application.properties
│   └── pom.xml
├── frontend/
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Page components
│   │   ├── features/       # Redux slices and thunks
│   │   ├── services/       # API services
│   │   └── store/          # Redux store configuration
│   ├── public/             # Static assets
│   └── package.json
├── docs/                   # Documentation
├── docker-compose.yml      # Docker services
└── README.md
```

## 🚀 Deployment

### Backend Deployment
```bash
cd backend
./mvnw clean package -DskipTests
java -jar target/saksham-0.0.1-SNAPSHOT.jar
```

### Frontend Deployment
```bash
cd frontend
npm run build
# Serve the dist/ folder with any static server
```

### Docker Deployment
```bash
docker-compose -f docker-compose.yml up -d
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Support

For support, email support@saksham.com or join our Discord community.

## 🙏 Acknowledgments

- Built with ❤️ for mental health awareness
- Thanks to all contributors and the open-source community