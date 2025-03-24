# FastDelivery API


## Installation and Running

### Using Docker

1. Create .env file from template:
```bash
cp .env.example .env
```

3. Run application with Docker Compose:
```bash
docker-compose up --build
```

The application will run on http://localhost:3000

### Running Directly for dev (without Docker)

1. Install dependencies:
```bash
npm install
```

2. Create .env file from template and update environment variables:
```bash
cp .env.example .env
```

2.1. Add local db password to .env

3. Run application:
```bash
npm start
```

## API Endpoints
Import `fastdelivery.postman_collection.json` into Postman for detail setup
### Authentication

#### 1. Start Authentication Process
- **Endpoint**: `POST /api/auth/start`
- **Description**: Start authentication process with phone number
#### 2. Verify OTP
- **Endpoint**: `POST /api/auth/verify-otp`
- **Description**: Verify the sent OTP code
#### 3. Login
- **Endpoint**: `POST /api/auth/login`
- **Description**: Login with phone number and password
#### 4. Register
- **Endpoint**: `POST /api/auth/register`
- **Description**: Register a new account
#### 5. Refresh Access Token
- **Endpoint**: `POST /api/auth/refresh-token`
- **Description**: Refresh access token using refresh token
#### 6. Resend OTP
- **Endpoint**: `POST /api/auth/resend-otp`
- **Description**: Resend OTP code
