# ThreadLink

ThreadLink is a modern messaging application built with React Native and Expo. It features a robust channel-based chat system, secure authentication, and a clean, responsive UI built with Gluestack UI and Tailwind CSS.

## 🚀 Features

- **Authentication System**
  - Secure Login & Registration
  - Support for Social Auth (GitHub, Google)
  - Persistent sessions using Secure Store

- **Rich Messaging**
  - Real-time channel-based communication
  - Support for **Text**, **Audio**, and **Video** attachments
  - Thread support for organized conversations
  - Emoji picker integration

- **User Experience**
  - Dark/Light mode support with automatic detection
  - Responsive design for mobile and web
  - Customizable user profiles
  - Dynamic channel management (Create, Join, Settings)

- **Media Handling**
  - Image upload and preview
  - Native video playback
  - Audio recording and playback

## 🛠 Tech Stack

- **Core:** [React Native](https://reactnative.dev/), [Expo SDK 52+](https://expo.dev/)
- **Routing:** [Expo Router](https://docs.expo.dev/router/introduction/) (File-based routing)
- **UI & Styling:** 
  - [Gluestack UI](https://gluestack.io/)
  - [NativeWind (Tailwind CSS)](https://www.nativewind.dev/)
  - [Lucide React Native](https://lucide.dev/) (Icons)
- **State Management:** React Context API
- **Networking:** [Axios](https://axios-http.com/)
- **Authentication:** [Better Auth](https://www.better-auth.com/)
- **Storage:** Expo Secure Store & Async Storage

## 📂 Project Structure

```
app/                 # App screens and routes (Expo Router)
├── (app)/          # Protected app routes (Channels, Profile)
├── (auth)/         # Authentication routes (Login, Register)
├── _layout.tsx     # Root layout with providers
components/          # Reusable UI components
├── auth/           # Authentication components
├── channel/        # Chat & Channel components
├── ui/             # Gluestack UI primitives
context/             # Global state providers (Auth, Theme, etc.)
lib/                 # Utilities and API clients
├── api/            # API integration modules
constants/           # Project constants (Colors, Theme)
assets/              # Static assets (Images, Fonts)
```

## ⚡ Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (LTS recommended)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
- [Expo Go](https://expo.dev/client) app on your mobile device (or an Emulator)

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/yourusername/app-front-native-messages.git
   cd app-front-native-messages
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up Environment Variables**

   Create a `.env` file in the root directory (if required by your backend configuration) and configure your API endpoints.
   
   ```env
   EXPO_PUBLIC_API_URL=http://your-api-url
   ```

4. **Start the application**

   ```bash
   npx expo start
   ```

   - Press `a` for Android Emulator
   - Press `i` for iOS Simulator
   - Scan the QR code with **Expo Go** on your physical device

## 📜 Scripts

- `npm start`: Start the Expo development server
- `npm run android`: Run on Android emulator
- `npm run ios`: Run on iOS simulator
- `npm run web`: Run on web browser
- `npm run reset-project`: Reset the project to a clean state
- `npm run lint`: Run ESLint

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License.
