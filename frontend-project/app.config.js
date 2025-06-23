module.exports = {
  name: 'Food Recipe',
  slug: 'food-recipe',
  version: '1.0.0',
  orientation: 'portrait',
  icon: './assets/images/large.png',
  userInterfaceStyle: 'light',
  splash: {
    image: './assets/images/large.png',
    resizeMode: 'contain',
    backgroundColor: '#ffffff'
  },
  assetBundlePatterns: [
    '**/*'
  ],
  ios: {
    supportsTablet: true,
    bundleIdentifier: 'com.mihigojordan.MyNewProject',
    buildNumber: '1.0.0'
  },
  android: {
    package: 'com.fidele.foodrecipe',
    versionCode: 1,
    permissions: [
      'CAMERA',
      'READ_EXTERNAL_STORAGE',
      'WRITE_EXTERNAL_STORAGE',
      'INTERNET'
    ],
    adaptiveIcon: {
      foregroundImage: './assets/images/large.png',
      backgroundColor: '#ffffff'
    }
  },
  web: {
    favicon: './assets/images/favicon.png'
  },
  plugins: [
    'expo-router',
    [
      'expo-notifications',
      {
        icon: './assets/notification-icon.png',
        color: '#ffffff',
       
      }
    ]
  ],
  scheme: 'food-recipe',
  extra: {
    eas: {
      projectId: 'aadd5cf6-7cda-4515-938d-c597a3272268'
    }
  },
  owner: 'fidele'
}; 