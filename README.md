# FastDelivery

## Technologies
- Frontend: React Native, Expo Router, Typescript
- Backend: NodeJs, ExpressJs, Javascript
- Database: MySQL, Redis
- Key Third-Party Services: HereMap, Socket.io, Expo Notification, Infobip, VNPay
- Infrastructure: Expo Go, EAS Build, Docker, Cloud VM (optional)
  
## Installation and Running

### Backend

1. Create .env file from template:
    ```bash
    cp .env.docker .env
    ```

2. Run application with Docker Compose:
    ```bash
    docker-compose up --build
    ```

The backend server will run on http://{your-host}:3000

### Mobile App

1. Install dependencies:
    ```bash
    npm install
    ```

2. Run via Expo Go
   ```bash
    npx expo start
   ```

   Tunnel option:

   ```bash
    npx expo start --tunnel
   ```

3. eas build
   login:

   ```bash
   eas login
   ```

   init eas configure (eas.json):

   ```bash
   eas build:configure
   ```

   build (aab/apk):
   --profile production

   ```bash
   eas build --platform android --profile production
   ```

4. Refresh project
   When you're ready, run:

   ```bash
   npm run reset-project
   ```

## Snapshots

<p align="center">
  <img src="https://github.com/user-attachments/assets/889f7bd6-a944-4f12-9964-ff630fd0be60" alt="Picture1" />
  <img src="https://github.com/user-attachments/assets/38c3cf4a-f4f1-4bb9-87e4-31e3afce6ab5" alt="Picture2" />
</p>

<p align="center">
  <img src="https://github.com/user-attachments/assets/da032229-2c28-42bb-876b-94a457fb02c0" alt="Picture3" />
  <img src="https://github.com/user-attachments/assets/363b412c-9d65-4476-9ea7-e58db13c0678" alt="Picture6" />
</p>

<p align="center">
  <img src="https://github.com/user-attachments/assets/eaecf44b-272c-4995-a3b7-36109391b2e3" alt="Picture4" />
</p>

<p align="center">
  <img src="https://github.com/user-attachments/assets/14004c0c-8b82-4a00-a7e1-388a9f08e503" alt="Picture7" />
</p>


