
# Proyect S-peak

## Content Table

* [Tecnology](#tech)
* [Project structure](#structure)
* [Env Configuration](#conf)
* [DevTools](#devTools)
* [Run](#run)
* [Tests](#test)


## <a name="tech"></a> Tecnology

Project tecnology

* [NodeJS](https://nodejs.org/es/)
* [React](https://facebook.github.io/react/)
* [CreateReactNativeApp](https://github.com/react-community/create-react-native-app)
* [Jest](https://facebook.github.io/jest/)


## <a name="structure"></a> Project Structure

| File name     |   Description      |
| ------------ | -------------------|
| config/          | Configuration webpack files |
| constants/          | Constanst (environmentes)|
| node_modules/        | Node modules dependencies|
| public/      | Files like index.html and favicon.ico|
| scripts/      | Webpack scripts |
| app/      | Source files|
| app/components      | Common components like buttons and sidebar|
| app/pages      | Pages components (connected with redux state)|
| src/middlewares     | Middlewares like promise and loggers|
| src/reducers     | Reducers files|
| src/assets     | General assets like images|
| *.eslintrc*     | JS rules |
| *.gitignore*     | patterns are used to exclude certain files in your working directory **git**  |
| *package.json*     |  dependecies list and scripts |
| *yarn.lock*     |   |
| *README.md*   | README file|

## <a name="conf"></a> Env configuration

* Installing node [NVM](https://github.com/creationix/nvm#installation) o [NVM WINDOWS](https://github.com/coreybutler/nvm-windows)

```shell
  nvm install stable
```

* Install [YARN](https://yarnpkg.com/lang/en/docs/install/) project dependences
* Install [ReactDevTools](https://chrome.google.com/webstore/detail/react-developer-tools/fmkadmapgofadopljbjfkapdkoienihi) for Google Chrome
* Install [React Native Cli](https://facebook.github.io/react-native/docs/getting-started.html)
* Install [Android Studio](https://developer.android.com/studio/) or [Genymotion](https://www.genymotion.com/) for Android and cofigure a virtual machine.
* Install XCode for IOS (Only for Mac)

## <a name="run"></a> Run project

Install project dependences

```shell
    yarn install
```

Run for ios-android

```shell
    yarn ios
```

```shell
    yarn android
```

Open React Dev Tools

 http://localhost:8081/debugger-ui/
## <a name="test"></a> Testing

Run test.

```shell
    yarn test
```
