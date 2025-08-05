import 'dotenv/config';

export default {
  expo: {
    name: "CEApp",
    slug: "CEApp",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/images/CEAppLogo.png",
    scheme: "ceapp",
    userInterfaceStyle: "automatic",
    newArchEnabled: true,
    ios: {
      supportsTablet: true
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/images/CEAppLogo.png",
        backgroundColor: "#ffffff"
      },
      edgeToEdgeEnabled: true
    },
    web: {
      bundler: "metro",
      output: "static",
      favicon: "./assets/images/CEAppLogo.png"
    },
    plugins: [
      "expo-router",
      [
        "expo-splash-screen",
        {
          image: "./assets/images/splash-icon.png",
          imageWidth: 200,
          resizeMode: "contain",
          backgroundColor: "#ffffff"
        }
      ]
    ],
    experiments: {
      typedRoutes: true
    },
    extra: {
      apiBaseUrl: process.env.API_BASE_URL || "http://localhost:8000"
    }
  }
};
