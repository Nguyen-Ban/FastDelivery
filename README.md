# FastDelivery API

```

## Installation and Running

### Using Docker

1. Clone repository:
```bash
git clone <repository-url>
cd FastDelivery
```

2. Create .env file from template:
```bash
cp .env.example .env
```

3. Run application with Docker Compose:
```bash
docker-compose up -d
```

The application will run on http://localhost:3000

### Running Directly (without Docker)

1. Clone repository:
```bash
git clone <repository-url>
cd FastDelivery
```

2. Install dependencies:
```bash
npm install
```

3. Create .env file from template and update environment variables:
```bash
cp .env.example .env
```

4. Run application:
```bash
npm start
```

## API Endpoints

### Authentication

#### 1. Start Authentication Process
- **Endpoint**: `POST /api/auth/start`
- **Description**: Start authentication process with phone number
- **Request Body**:
```json
{
    "phone": "+84123456789"
}
```
- **Response**:
```json
{
    "success": true,
    "message": "OTP sent, please verify",
    "nextStep": "verify_otp"
}
```

#### 2. Verify OTP
- **Endpoint**: `POST /api/auth/verify-otp`
- **Description**: Verify the sent OTP code
- **Request Body**:
```json
{
    "phone": "+84123456789",
    "otp": "123456"
}
```
- **Response**:
```json
{
    "success": true,
    "message": "OTP verified, please enter passcode",
    "nextStep": "login"
}
```

#### 3. Login
- **Endpoint**: `POST /api/auth/login`
- **Description**: Login with phone number and password
- **Request Body**:
```json
{
    "phone": "+84123456789",
    "passcode": "123456"
}
```
- **Response**:
```json
{
    "success": true,
    "message": "Login successful",
    "accessToken": "jwt_token",
    "refreshToken": "refresh_token",
    "user": {
        "id": 1,
        "phone": "+84123456789",
        "fullname": "User Name"
    }
}
```

#### 4. Register
- **Endpoint**: `POST /api/auth/register`
- **Description**: Register a new account
- **Request Body**:
```json
{
    "phone": "+84123456789",
    "fullname": "User Name",
    "gender": "male",
    "email": "user@example.com",
    "passcode": "123456"
}
```
- **Response**:
```json
{
    "success": true,
    "message": "Registration successful",
    "accessToken": "jwt_token",
    "refreshToken": "refresh_token",
    "user": {
        "id": 1,
        "phone": "+84123456789",
        "fullname": "User Name"
    }
}
```

#### 5. Refresh Access Token
- **Endpoint**: `POST /api/auth/refresh-token`
- **Description**: Refresh access token using refresh token
- **Request Body**:
```json
{
    "refreshToken": "refresh_token"
}
```
- **Response**:
```json
{
    "success": true,
    "accessToken": "new_jwt_token"
}
```

#### 6. Resend OTP
- **Endpoint**: `POST /api/auth/resend-otp`
- **Description**: Resend OTP code
- **Request Body**:
```json
{
    "phone": "+84123456789"
}
```
- **Response**:
```json
{
    "success": true,
    "message": "OTP sent successfully",
    "nextStep": "verify_otp"
}
```

## Environment Variables

Create a `.env` file with the following variables:

```env
# Server
PORT=3000
NODE_ENV=development

# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=fastdelivery
DB_USER=postgres
DB_PASSWORD=your_password

# JWT
ACCESS_TOKEN_SECRET=your_access_token_secret
REFRESH_TOKEN_SECRET=your_refresh_token_secret

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379

# SMS Service (Infobip)
INFOBIP_API_KEY=your_infobip_api_key
INFOBIP_SENDER=your_sender_id
```

## Security

- All API endpoints use HTTPS
- JWT is used for authentication
- Refresh tokens are securely stored in Redis
- Passwords are hashed before storing in the database

## Logging

The application uses Winston logger with the following log levels:
- INFO: Normal operation information
- WARN: Potential issues or warnings
- ERROR: System errors

Each log message has a prefix indicating its source (module):
- [App]: Logs from the main application
- [AuthController]: Logs from authentication controller
- [TokenService]: Logs from token service
- [OTPService]: Logs from OTP service
- [AuthMiddleware]: Logs from authentication middleware
- [ErrorMiddleware]: Logs from error handling middleware

## License

MIT 