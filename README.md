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

### Running locally (FOR DEV)

1. Install dependencies:
```bash
npm install
```

2. Create .env file from template and update environment variables:
```bash
cp .env.dev.example .env
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
    "message": "OTP verified, please complete registration",
    "nextStep": "register"
  }
  ```

#### 3. Login
- **Endpoint**: `POST /api/auth/login`
- **Description**: Login with phone number and password
- **Request Body**:
  ```json
  {
    "phone": "+84123456789",
    "passcode": "your_passcode"
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "message": "Login successful",
    "data": {
      "accessToken": "eyJhbGciOiJIUzI1NiIs...",
      "refreshToken": "eyJhbGciOiJIUzI1NiIs...",
      "user": {
        "id": "user_id",
        "phone": "+84123456789",
        "fullname": "User Name"
      }
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
    "gender": "MALE",
    "date_of_birth": "1990-01-01",
    "email": "user@example.com",
    "passcode": "your_passcode"
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "message": "Registration successful",
    "data": {
      "accessToken": "eyJhbGciOiJIUzI1NiIs...",
      "refreshToken": "eyJhbGciOiJIUzI1NiIs...",
      "user": {
        "id": "user_id",
        "phone": "+84123456789",
        "fullname": "User Name",
        "gender": "MALE",
        "dateOfBirth": "1990-01-01",
        "email": "user@example.com"
      }
    }
  }
  ```

#### 5. Refresh Access Token
- **Endpoint**: `POST /api/auth/refresh-token`
- **Description**: Refresh access token using refresh token
- **Request Body**:
  ```json
  {
    "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "message": "Access token refreshed successfully",
    "data": {
      "accessToken": "eyJhbGciOiJIUzI1NiIs..."
    }
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
    "message": "OTP resent successfully",
    "nextStep": "verify_otp"
  }
  ```

#### 7. Driver Registration
- **Endpoint**: `POST /api/driver/register`
- **Description**: Register as a driver (requires authentication)
- **Headers**:
  ```
  Authorization: Bearer your_access_token
  ```
- **Request Body**:
  ```json
  {
    "license_number": "ABC123-XYZ",
    "vehicle_type": "MOTORBIKE",
    "vehicle_plate": "51G-12345"
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "message": "Driver registration successful",
    "data": {
      "driver": {
        "id": "driver_id",
        "license_number": "ABC123-XYZ",
        "vehicle_type": "MOTORBIKE",
        "vehicle_plate": "51G-12345",
        "status": "OFFLINE",
        "approvalStatus": "PENDING"
      }
    }
  }
  ```
- **Note**: Requires valid authentication token. User must not be already registered as a driver. 