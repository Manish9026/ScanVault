# SecureGuard - Advanced Malware Scanning System

A comprehensive full-stack malware scanning system built with modern web technologies, featuring real-time threat detection, file analysis, and a beautiful user interface.

## 🚀 Features

### Backend Features
- **File Upload API** - Secure file upload with validation and deduplication
- **Background Scanning** - Asynchronous malware scanning with queue management
- **Real-time Processing** - In-memory queue system with automatic job processing
- **Advanced Detection** - Heuristic malware detection with keyword analysis
- **File Management** - Complete CRUD operations with metadata storage
- **Security** - Rate limiting, input validation, and secure file handling
- **Monitoring** - Comprehensive logging and error handling

### Frontend Features
- **Drag & Drop Upload** - Intuitive file upload with progress tracking
- **Real-time Dashboard** - Live updates with automatic refresh
- **Advanced Filtering** - Filter files by status (pending, clean, infected)
- **File Details** - Modal dialogs with comprehensive file information
- **Status Tracking** - Visual indicators for scan progress and results
- **Responsive Design** - Mobile-first design with smooth animations
- **Toast Notifications** - Real-time alerts for important events

## 🛠️ Tech Stack

### Backend
- **Node.js** with TypeScript
- **Express.js** for REST API
- **Multer** for file uploads
- **Winston** for logging
- **In-memory Database** (MongoDB simulation)
- **In-memory Queue** (RabbitMQ simulation)
- **Redis-like Caching** for deduplication

### Frontend
- **React 18** with TypeScript
- **Vite** for development and building
- **Tailwind CSS** for styling
- **Lucide React** for icons
- **React Hot Toast** for notifications
- **Axios** for API communication

## 📦 Installation & Setup

### Prerequisites
- Node.js 18+ 
- npm or yarn

### 1. Install Dependencies
```bash
# Install root dependencies
npm install

# Install backend dependencies
cd backend && npm install

# Install frontend dependencies
cd ../frontend && npm install
```

### 2. Configure Environment
```bash
# Backend configuration
cd backend
cp .env.example .env
# Edit .env file with your configuration
```

### 3. Start Development Servers
```bash
# From root directory - starts both backend and frontend
npm run dev

# Or start individually:
npm run dev:backend  # Backend on http://localhost:3001
npm run dev:frontend # Frontend on http://localhost:5173
```

## 🔧 Configuration

### Backend Environment Variables
```env
PORT=3001
NODE_ENV=development
UPLOAD_DIR=./uploads
MAX_FILE_SIZE=5242880
MONGODB_URI=mongodb://localhost:27017/malware_scanner
REDIS_URI=redis://localhost:6379
RABBITMQ_URI=amqp://localhost:5672
WEBHOOK_URL=https://hooks.slack.com/services/YOUR/WEBHOOK/URL
```

### Supported File Types
- **PDF** (.pdf)
- **Word Documents** (.docx)
- **Images** (.jpg, .jpeg, .png)
- **Maximum Size**: 5MB per file

## 🧪 How Malware Scanning Works

### Detection Algorithm
The malware scanner uses multiple detection methods:

1. **Keyword Analysis**: Searches for suspicious strings like:
   - `rm -rf` (dangerous shell commands)
   - `eval(` (code injection)
   - `bitcoin` (cryptocurrency mining)
   - Various malware-related terms

2. **File Extension Analysis**: Checks for potentially dangerous file extensions

3. **Pattern Matching**: Uses regex patterns to detect:
   - Script injection attempts
   - Shell command execution
   - Base64 encoded payloads

4. **Heuristic Analysis**: Random infection simulation (10% chance) for demonstration

### Scanning Process
1. File uploaded and validated
2. Hash generated for deduplication
3. Metadata stored in database
4. Scan job queued for background processing
5. Worker processes file with 2-5 second delay
6. Results updated in real-time
7. Alerts sent for infected files

## 📊 API Endpoints

### File Upload
```http
POST /api/upload
Content-Type: multipart/form-data
```

### Get All Files
```http
GET /api/upload
GET /api/upload?status=pending
GET /api/upload?status=scanned
```

### Get Specific File
```http
GET /api/upload/:id
```

### Get Statistics
```http
GET /api/upload/stats/overview
```

### Health Check
```http
GET /api/health
```

## 🎨 UI/UX Features

### Design Elements
- **Modern Interface**: Clean, professional design with smooth animations
- **Color-coded Status**: Visual indicators for different file states
  - 🟡 Yellow: Pending scan
  - 🟢 Green: Clean files
  - 🔴 Red: Infected files
- **Responsive Layout**: Works perfectly on all device sizes
- **Interactive Elements**: Hover states, transitions, and micro-interactions
- **Real-time Updates**: Automatic refresh every 5 seconds
- **Progress Tracking**: Upload progress bars and scan status indicators

### User Experience
- **Drag & Drop**: Intuitive file upload experience
- **Instant Feedback**: Toast notifications for all actions
- **Filter & Search**: Easy file management with status filtering
- **Detail Views**: Comprehensive file information in modal dialogs
- **Error Handling**: Clear error messages and recovery options

## 🔒 Security Features

- **Input Validation**: Strict file type and size validation
- **Rate Limiting**: Protection against upload abuse
- **Secure Headers**: Helmet.js for security headers
- **File Sanitization**: Safe file handling and storage
- **CORS Protection**: Configured cross-origin policies
- **Error Handling**: Secure error responses without information leakage

## 📈 Performance Optimizations

- **File Deduplication**: Hash-based duplicate detection
- **Efficient Queue**: In-memory queue with concurrent processing
- **Lazy Loading**: Optimized component rendering
- **Caching**: Redis-like caching for frequently accessed data
- **Compression**: Optimized asset delivery
- **Memory Management**: Efficient file processing and cleanup

<!-- ## 🚀 Deployment

### Build for Production
```bash
npm run build
``` -->


Built with ❤️ for secure file processing and threat detection.