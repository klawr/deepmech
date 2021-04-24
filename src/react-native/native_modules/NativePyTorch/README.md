
# react-native-native-py-torch

## Getting started

`$ npm install react-native-native-py-torch --save`

### Mostly automatic installation

`$ react-native link react-native-native-py-torch`

### Manual installation


#### iOS

1. In XCode, in the project navigator, right click `Libraries` ➜ `Add Files to [your project's name]`
2. Go to `node_modules` ➜ `react-native-native-py-torch` and add `RNNativePyTorch.xcodeproj`
3. In XCode, in the project navigator, select your project. Add `libRNNativePyTorch.a` to your project's `Build Phases` ➜ `Link Binary With Libraries`
4. Run your project (`Cmd+R`)<

#### Android

1. Open up `android/app/src/main/java/[...]/MainActivity.java`
  - Add `import com.reactlibrary.RNNativePyTorchPackage;` to the imports at the top of the file
  - Add `new RNNativePyTorchPackage()` to the list returned by the `getPackages()` method
2. Append the following lines to `android/settings.gradle`:
  	```
  	include ':react-native-native-py-torch'
  	project(':react-native-native-py-torch').projectDir = new File(rootProject.projectDir, 	'../node_modules/react-native-native-py-torch/android')
  	```
3. Insert the following lines inside the dependencies block in `android/app/build.gradle`:
  	```
      compile project(':react-native-native-py-torch')
  	```

#### Windows
[Read it! :D](https://github.com/ReactWindows/react-native)

1. In Visual Studio add the `RNNativePyTorch.sln` in `node_modules/react-native-native-py-torch/windows/RNNativePyTorch.sln` folder to their solution, reference from their app.
2. Open up your `MainPage.cs` app
  - Add `using Native.Py.Torch.RNNativePyTorch;` to the usings at the top of the file
  - Add `new RNNativePyTorchPackage()` to the `List<IReactPackage>` returned by the `Packages` method


## Usage
```javascript
import RNNativePyTorch from 'react-native-native-py-torch';

// TODO: What to do with the module?
RNNativePyTorch;
```
  