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
