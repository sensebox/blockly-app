# Blockly for senseBox app [![Build Status](https://travis-ci.org/sensebox/blockly-app.svg?branch=master)][travis] [![Fdroid Badge](https://img.shields.io/f-droid/v/de.sensebox.blockly.svg)][fdroid] [![github releases](https://img.shields.io/github/release/sensebox/blockly-app.svg?logo=github)][releases]

Blockly for senseBox is a visual programming editor for the senseBox:edu on mobile.
It is based on Google's [Blockly](https://developers.google.com/blockly/) and Carlos Pereira Atencio's [Ardublockly](https://github.com/carlosperate/ardublockly).

### Features
- generate Arduino code with visual drag-and-drop blocks, with blocks for the senseBox platform.
- online compiler for senseBox MCU
- over the air programming via WiFi
- Android 7+ & Web-browser support. (iOS support is upcoming)

[<img src="https://fdroid.gitlab.io/artwork/badge/get-it-on.png" height="75" />][fdroid]
[<img src="https://play.google.com/intl/en_us/badges/images/generic/en_badge_web_generic.png" height="75" />][playstore]

[travis]:     https://travis-ci.org/sensebox/blockly-app
[releases]:   https://github.com/sensebox/blockly-app/releases
[fdroid]:     https://f-droid.org/packages/de.sensebox.blockly/
[playstore]:  https://play.google.com/store/apps/details?id=de.sensebox.blockly

## Development
This is an Ionic 3 / Angular 5 application using Cordova Plugins for mobile-native functionality.


### dev env setup
For a basic web version, only Node.js 8+ is required.
For Android & iOS builds the respective platform tooling is required.

This repo contains mandatory submodules; so you need to clone this repo via
```sh
git clone --recursive https://github.com/sensebox/blockly-app.git
```

To install npm dependencies run `npm install` once.

Then run `npm start` to start a hot-reloading development view in the browser on <http://localhost:8100>.

Ionic & cordova provide CLIs for plugin installation & code generation. You might want to install them with `npm install -g ionic cordova`.

#### android specific
First install the Android toolchain on your system.

Make sure you have the correct environment variables set.
On linux you could add this to your `~/.bashrc`:
```bash
export ANDROID_SDK=$HOME/Android/Sdk
export ANDROID_HOME=$ANDROID_SDK
export PATH=$PATH:$ANDROID_SDK/emulator:$ANDROID_SDK/tools:$ANDROID_SDK/tools/bin:$ANDROID_SDK/platform-tools:$ANDROID_SDK/build-tools/28.0.3
```

To build & deploy on an emulator or device use the `android:*` build commands defined in `package.json` (some only work on linux), for example:
```bash
npm run android:dev # build debug build & deploy to connected device & restart app
```

###### release signing
You need a keystore with a valid signing key!
```
zipalign -p 4 blockly-unsigned.apk blockly-aligned.apk 
apksigner sign -ks reedu-android.keystore --in blockly-aligned.apk --out blockly-signed.apk
```

### updating blockly
Blockly is included as a submodule, linking to <https://github.com/sensebox/ardublockly-1>.
To update it, just pull in the commit you want, and commit the change in this repository:
```bash
cd src/assets/blockly
git pull
cd ../../..
git commit -m 'update blockly'
```

## License
The source code in this repository is GPL-2 licensed.
Submodules such as Blockly may be licensed differently, please check their respective repositories.
