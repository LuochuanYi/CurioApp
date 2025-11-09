# 🎨 CurioApp - Interactive Children's Educational App

Beautiful React Native educational app with creative UI shapes and interactive audio content.

![CurioApp](./assets/images/curio-branding.png)

## 🌟 Features

### 🎨 Creative UI Design
- **📖 Opened Book Shapes** for stories with realistic spine and page details
- **🎨 Paint Palette Shapes** for learning categories with artistic elements
- **🎵 Music List Style** for songs with interactive icons
- **✨ Transparent Backgrounds** (25% opacity) for elegant card design
- **📱 Mobile-Optimized** with seamless responsive design

### 🔊 Rich Audio Integration
- **🎵 Real MP3 Audio Files** for all songs and background music
- **🗣️ Text-to-Speech Narration** for interactive storytelling
- **🎧 Multi-language Support** with quality voice synthesis
- **🔄 Seamless Audio Transitions** between content

### 📱 Cross-Platform Compatibility
- **✅ iOS Deployment** via Expo Go (tested and working)
- **✅ Android Support** with React Native
- **🌐 Web Compatibility** for browser testing
- **📊 Tunnel Mode** for easy device testing

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- Expo CLI
- iOS/Android device with Expo Go app

### Installation
```bash
# Clone the repository
git clone https://github.com/LuochuanYi/CurioApp.git
cd CurioApp

# Install dependencies
npm install

# Start the development server
npx expo start
```

### 📱 Running on Device
1. Install **Expo Go** on your iOS/Android device
2. Run `npx expo start --tunnel` for cross-network access
3. Scan the QR code with Expo Go app
4. Enjoy the beautiful CurioApp! 🎉

## 📚 Documentation

- **[📋 GitHub Management Guide](./GITHUB_GUIDE.md)** - Complete Git workflow and repository management
- **[🔊 Audio Integration Guide](./FINAL_AUDIO_SUCCESS.md)** - Audio setup and troubleshooting  
- **[🎵 Music Implementation Guide](./MUSIC_GUIDE.md)** - Song and audio file management

## 🎯 Project Structure

```
CurioApp/
├── 📱 screens/          # Main app screens
│   ├── HomeScreen.js    # Dashboard with featured content
│   ├── Engagescreen.js  # Full content discovery
│   └── ...
├── 🎨 components/       # Reusable UI components
│   ├── CurioCard.js     # Custom card shapes
│   ├── CurioButton.js   # Interactive buttons  
│   └── ...
├── 🎵 assets/           # Media files
│   ├── audio/songs/     # MP3 audio files
│   └── images/          # App images and branding
├── 🎨 theme/            # Design system
└── 📊 data/             # App content and configuration
```

## 🎨 Design Highlights

### Creative Shape Components
- **Opened Books**: Multi-layered design with spine, pages, and decorative elements
- **Paint Palettes**: Artistic oval shapes with thumb holes and colorful paint dots  
- **Music Lists**: Clean, accessible design with musical note icons

### Theme System
- **Consistent Color Palette** with CURIO_THEME integration
- **Responsive Typography** with TEXT_STYLES components
- **Accessible Design** with proper ARIA labels and roles

## 🛠️ Development

### 🔧 Available Scripts
```bash
npm start              # Start Expo development server
npx expo start --web   # Start web version  
npx expo start --tunnel# Start with tunnel for device access
npm run ios            # Run on iOS simulator
npm run android        # Run on Android emulator
```

### 🎯 Key Commands
```bash
# Restore to baseline (Beautiful Design Complete)
git checkout master
git reset --hard 3f72836

# Create new feature branch
git checkout -b feature/your-feature-name

# Push changes
git add .
git commit -m "✨ Your descriptive commit message"
git push origin master
```

## 🎵 Audio Content

The app includes a rich library of children's content:

### 📚 Stories
- The Three Little Pigs
- Goldilocks and the Three Bears  
- Little Red Riding Hood
- And more interactive tales!

### 🎵 Songs
- Twinkle, Twinkle, Little Star
- The Wheels on the Bus
- ABC Song
- Brahms' Lullaby
- And many more favorites!

## 🚀 Deployment

### 📱 Mobile Testing
```bash
# For reliable device connection
npx expo start --tunnel

# For local network testing  
npx expo start
```

### 🌐 Web Testing
```bash
# Launch web version
npx expo start --web
```

## 🤝 Contributing

1. **Fork** the repository
2. **Create** feature branch: `git checkout -b feature/amazing-feature`
3. **Commit** changes: `git commit -m '✨ Add amazing feature'`
4. **Push** to branch: `git push origin feature/amazing-feature`
5. **Open** a Pull Request

## 📋 Baseline Information

**Current Baseline**: Commit `3f72836`  
**Description**: 🎨 Beautiful Design Complete with all creative shapes and mobile deployment

**Features in Baseline**:
- ✅ All custom shape components implemented
- ✅ Transparent background design system
- ✅ Complete audio integration with real MP3 files
- ✅ Cross-platform mobile deployment ready
- ✅ Accessibility features integrated
- ✅ Comprehensive documentation

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Expo Team** for excellent React Native development tools
- **React Native Community** for comprehensive mobile framework
- **Audio Content** sourced from royalty-free educational libraries

---

**Built with ❤️ for children's education and creative learning experiences**

🎯 **Repository**: https://github.com/LuochuanYi/CurioApp