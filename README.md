# React Native Voip24h-SDK 

[![NPM version](https://img.shields.io/npm/v/react-native-voip24h-sdk.svg?style=flat)](https://www.npmjs.com/package/react-native-voip24h-sdk)

## Mục lục

- [Tính năng](#tính-năng)
- [Yêu cầu](#yêu-cầu)
- [Cài đặt](#cài-đặt)
- [Sử dụng](#sử-dụng)
- [CallKit](#callkit)
- [Graph](#graph)

## Tính năng
- Callkit:
    - Đăng nhập/Đăng xuất/Refresh kết nối tài khoản SIP
    - Gọi đi/Nhận cuộc gọi đến 
    - Chấp nhận cuộc gọi/Từ chối cuộc gọi đến/Ngắt máy 
    - Pause/Resume cuộc gọi
    - Hold/Unhold cuộc gọi
    - Bật/Tắt mic
    - Lấy trạng thái mic
    - Bật/Tắt loa
    - Lấy trạng thái loa
    - Transfer cuộc gọi
    - Send DTMF
- Graph:
    - Lấy access token
    - Request API từ: https://docs-sdk.voip24h.vn/

## Yêu cầu
- OS Platform:
    - Android -> `minSdkVersion: 23`
    - IOS -> `iOS Deployment Target: 11`
- Permissions: khai báo và cấp quyền lúc runtime
    - Android: Trong file `AndroidManifest.xml`
        ```
        <uses-permission android:name="android.permission.INTERNET" />
        <uses-permission android:name="android.permission.RECORD_AUDIO"/>
        ```
        
    - IOS: Trong file `Info.plist`
        ```
        <key>NSAppTransportSecurity</key>
    	<dict>
    		<key>NSAllowsArbitraryLoads</key><true/>
    	</dict>
    	<key>NSMicrophoneUsageDescription</key>
	    <string>{Your permission microphone description}</string>
        ```

## Cài đặt
Sử dụng npm:
```bash
$ npm install react-native-voip24h-sdk
```
Linking module:
- Android: 
    - Trong file `settings.gradle`
        ```
        include ':react-native-voip24h-sdk'
        project(':react-native-voip24h-sdk').projectDir = new File(rootProject.projectDir, '../node_modules/react-native-voip24h-sdk/android')
        ```
    - Trong `build.gradle`:
        ```
        allprojects {
            repositories {
                ...
                maven {
                    name "linphone.org maven repository"
                    url "https://linphone.org/maven_repository/"
                    content {
                        includeGroup "org.linphone.no-video"
                    }
                }
            }
        }
        ```
    - Trong file `app/build.gradle`
        ```
        android {
            ...
            packagingOptions {
                pickFirst 'lib/x86/libc++_shared.so'
                pickFirst 'lib/x86_64/libc++_shared.so'
                pickFirst 'lib/arm64-v8a/libc++_shared.so'
                pickFirst 'lib/armeabi-v7a/libc++_shared.so'
            }
        }
        
        dependencies {
            ...
            implementation project(':react-native-voip24h-sdk')
        }
        ```
- IOS: 
    - Trong `ios/Podfile`:
        ```
        ...
        use_frameworks!
        target 'Your Project' do
            ...
            # Comment dòng use_flipper!()
            # use_flipper!()
            pod 'linphone-sdk-novideo', :podspec => '../node_modules/react-native-voip24h-sdk/third_party_podspecs/linphone-sdk-novideo.podspec'
        end
        ```
    - Trong folder `ios` mở terminal, nhập dòng lệnh:
        ```bash
        $ rm -rf Pods/
        $ pod install
        ```
    > Note: Từ react-native vesion > 0.63.0. Nếu build app trên platform ios mà bị lỗi Swift Compiler error: folly/folly-config.h not found -> Could not build Objective-C module 'linphone'.
    > -- Fixing: Trong file Pods/RCT-Folly/folly/portability/Config.h, comment dòng #include <folly/folly-config.h>

## Sử dụng
```
import { NativeEventEmitter } from 'react-native';
import { GraphModule, SipModule, MethodRequest } from 'react-native-voip24h-sdk';
// TODO: What to do with the module?
console.log(GraphModule);
console.log(SipModule);
console.log(MethodRequest);
```

## CallKit
- Khởi tạo SipModule:
    ```
    SipModule.initializeModule();
    ```
- Login tài khoản SIP:
    ```
    SipModule.registerSipAccount(extension, password, IP);
    ```
- Lấy trạng thái đăng kí tài khoản SIP
    ```
    SipModule.getSipRegistrationState()
        .then((state) => console.log(`State: ${state}`))
        .catch((error) => console.log(error))
    ```
- Logout tài khoản SIP:
    ```
    SipModule.unregisterSipAccount();
    ```
- Refresh kết nối SIP:
    ```
    SipModule.refreshRegisterSipAccount();
    ```
- Gọi đi:
    ```
    SipModule.call(phoneNumber);
    ```
- Ngắt máy:
    ```
    SipModule.hangup();
    ```
- Chấp nhận cuộc gọi đến:
    ```
    SipModule.acceptCall();
    ```
- Từ chối cuộc gọi đến:
    ```
    SipModule.decline();
    ```
- Transfer cuộc gọi:
    ```
    SipModule.transfer("extension");
    ```
- Lấy call id:
    ```
    SipModule.getCallId()
        .then((callId) => console.log(`Call ID: ${callId}`))
        .catch((error) => console.log(error))
    ```
- Lấy số lượng cuộc gọi nhỡ:
    ```
    SipModule.getMissedCalls()
        .then((state) => console.log(`Missed calls: ${state}`))
        .catch((error) => console.log(error))
    ```
- Pause/Resume cuộc gọi:
    ```
    SipModule.pause();
    SipModule.resume();
    ```
- Bật/Tắt mic
    ```
    SipModule.toggleMic()
        .then((result) => {
          if(result) 
            console.log("Enabled mic") 
          else 
            console.log("Disabled mic")
        })
        .catch((e) => console.log("Something has gone wrong"))
    ```
- Trạng thái mic
    ```
    SipModule.isMicEnabled()
        .then((result) => console.log(`Mic enabled: ${result}`))
        .catch((error) => console.log(error));
    ```
- Bật/Tắt loa:
    ```
    SipModule.toggleSpeaker()
        .then((result) => {
          if(result) 
            console.log("Enabled speaker") 
          else 
            console.log("Disabled speaker")
        })
        .catch((e) => console.log("Something has gone wrong"))
    ```
- Trạng thái loa
    ```
    SipModule.isSpeakerEnabled()
        .then((result) => console.log(`Speaker enabled: ${result}`))
        .catch((error) => console.log(error));
    ```
- Send DTMF:
    ```
    SipModule.sendDtmf("number#");
    ```
- Register event listener SIP:
    ```
    const callbacks =  {
        AccountRegistrationStateChanged: (body) => console.log(`AccountRegistrationStateChanged -> registrationState: ${body.registrationState} - message: ${body.message}`),
        Ring: (body) => console.log(`Ring -> extension: ${body.extension} - phone: ${body.phone} - type: ${body.type}`),
        Up: (body) => console.log("Up"),
        Paused: () => console.log("Paused"),
        Missed: (body) => console.log(`Missed -> phone: ${body.phone} - Total missed: ${body.totalMissed}`),
        Hangup: () => console.log("Hangup"),
        Error: (body) => console.log(`Error -> message: ${body.message}`)
    }
    
    React.useEffect(() => {
        let eventEmitter = new NativeEventEmitter(SipModule)
        const eventListeners = Object.entries(callbacks).map(
            ([event, callback]) => {
                return eventEmitter.addListener(event, callback)
            }
        )
        return () => {
          eventListeners.forEach((item) => {
            item.remove();
          })
        };
    }, []);
    ```

## Graph
- Lấy access token: key và security certificate(secert) do `Voip24h` cung cấp
    ```
    GraphModule.getAccessToken(key, secert, {
        success: (statusCode, message, oauth) => console.log(oauth.token),
        error: (errorCode, message) => console.log(`Error code: ${errorCode}, Message: ${message}`)
    });
    ```
- Request API: phương thức, endpoint, data body tham khảo từ docs https://docs-sdk.voip24h.vn/
    - Function: GraphModule.sendRequest(method, endpoint, token, params, callback)
    - Params function:
        - method: là các method như MethodRequest.POST, MethodRequest.GET,...
        - endpoint: là các chuỗi ở cuối đường dẫn của URL  Request, ví dụ: "call/find", "call/findone", "phonebook/find",...
        - token: là access token
        - params: là data body dạng object, ví dụ: { offset: 0, limit: 25 }
        - callback: trả kết quả ra dạng jsonObject. 
    - Để lấy data sử dụng funtion GraphModule.getData(jsonObject), để lấy list data sử dụng function GraphModule.getListData(jsonObject) đối với các api request lấy danh sách.

## License
```
The MIT License (MIT)

Copyright (c) 2022 VOIP24H

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```