# Ionic Angular PWA Project

## Description
A Progressive Web Application (PWA) built with Ionic and Angular, featuring native capabilities through Capacitor.

## Prerequisites
- Node.js (v22)
- npm (v6 or higher)
- Android Studio (for Android builds)
- Java Development Kit (JDK) 17

### Installing Prerequisites on Ubuntu
```bash
# Install Node.js and npm
curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
sudo apt install -y nodejs

# Install JDK
sudo apt update
sudo apt install -y openjdk-17-jdk openjdk-17-jre

# Install Android Studio dependencies
sudo apt install -y libc6:i386 libncurses5:i386 libstdc++6:i386 lib32z1 libbz2-1.0:i386
```

## Project Setup

1. Install global dependencies:
```bash
npm install -g @angular/cli
npm install -g @ionic/cli
```

2. Clone the repository:
```bash
git clone [your-repository-url]
cd [project-name]
```

3. Install project dependencies:
```bash
npm install
```

## Development

### Running the Development Server
```bash
ionic serve
```
The application will be available at `http://localhost:8100`

### Building the Project
```bash
# For web
ionic build --prod

# For Android
ionic capacitor add android
ionic capacitor copy android
ionic capacitor open android
```

## Android Build Process

### Setting up Android Studio
1. Download Android Studio from [official website](https://developer.android.com/studio)
2. Extract and install:
```bash
cd ~/Downloads
tar -xvf android-studio-*.tar.gz
sudo mv android-studio /opt/
```

3. Set up environment variables:
```bash
echo 'export ANDROID_HOME=$HOME/Android/Sdk' >> ~/.bashrc
echo 'export PATH=$PATH:$ANDROID_HOME/tools' >> ~/.bashrc
echo 'export PATH=$PATH:$ANDROID_HOME/platform-tools' >> ~/.bashrc
source ~/.bashrc
```

### Generating APK
1. Open project in Android Studio:
```bash
ionic capacitor open android
```

2. In Android Studio:
- Go to Build > Generate Signed Bundle / APK
- Select 'APK'
- Create/select keystore
- Choose release build variant
- Select destination folder

## PWA Features
- Offline capability
- Install prompts
- Native-like experience
- Push notifications (if implemented)

## Project Structure
```
src/
├── app/
│   ├── components/
│   ├── pages/
│   ├── services/
│   └── app.module.ts
├── assets/
├── theme/
└── index.html
```

## Configuration Files
- `capacitor.config.ts`: Capacitor configuration
- `angular.json`: Angular CLI configuration
- `config.xml`: Ionic configuration
- `manifest.webmanifest`: PWA configuration

## Troubleshooting

### Common Issues

1. Build Errors
```bash
# Clear caches
ionic cache clear
npm cache clean --force

# Reinstall dependencies
rm -rf node_modules
npm install
```

2. Android Studio Issues
```bash
# Fix permissions
sudo chown -R $USER:$USER /opt/android-studio

# Enable KVM for better emulator performance
sudo apt install qemu-kvm
sudo adduser $USER kvm
```

## Contributing
[Add your contribution guidelines here]

## License
[Add your license information here]

## Contact
[Add your contact information here]
