<<<<<<< HEAD:fe/README.md
# Project Structure:

- app: root component, entry point, pages
- backend: backend server
- components: custom components
- context: context api
- navigation: navigation setup
- hooks: react hooks
- constants: const var (.env, .theme, ...)
- services: api call

# Welcome to your Expo app 👋
=======
# FastDelivery API


## Installation and Running

### Using Docker
>>>>>>> origin/be-order-feature:README.md

1. Create .env file from template:
```bash
cp .env.example .env
```

3. Run application with Docker Compose:
```bash
docker-compose up --build
```

The application will run on http://localhost:3000

<<<<<<< HEAD:fe/README.md
   ```bash
   npm install
   ```

   eas:

   ```bash
   npm install -g eas-cli
   ```
=======
### Running locally (FOR DEV)
>>>>>>> origin/be-order-feature:README.md

1. Install dependencies:
```bash
npm install
```

<<<<<<< HEAD:fe/README.md
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

   This command will move the starter code to the **app-example** directory and create a blank **app** directory where you can start developing.

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

## Learn more

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.

## Join the community

Join our community of developers creating universal apps.

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.
=======
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
>>>>>>> origin/be-order-feature:README.md
