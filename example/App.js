/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import type {Node} from 'react';
import { NativeModules, Platform, NativeEventEmitter } from 'react-native'
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
  Button
} from 'react-native';

import {
  Colors,
  DebugInstructions,
  Header,
  LearnMoreLinks,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';

import { GraphModule, SipModule, MethodRequest } from 'react-native-voip24h-sdk'
 
const Section = ({children, title}): Node => {
  const isDarkMode = useColorScheme() === 'dark';
  return (
    <View style={styles.sectionContainer}>
      <Text
        style={[
          styles.sectionTitle,
          {
            color: isDarkMode ? Colors.white : Colors.black,
          },
        ]}>
        {title}
      </Text>
      <Text
        style={[
          styles.sectionDescription,
          {
            color: isDarkMode ? Colors.light : Colors.dark,
          },
        ]}>
        {children}
      </Text>
    </View>
  );
};

const key = "9ecxxxxxxxxxxxxxx";
const secert = "9d7xxxxxxxxxxxx";

const App: () => Node = () => {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  const [result, setResult] = React.useState(1);

  const fetchToken = async() => {
    return new Promise(function(resolve) {
      GraphModule.getAccessToken(
        key, 
        secert,
        {
          success: (statusCode, message, oauth) => resolve(oauth.token),
          error: (errorCode, message) => console.log(`Error code: ${errorCode}, Message: ${message}`)
        }
      );
    });
  };

  const fetchData = async(token: string, params: object) => {
    return new Promise(function(resolve) {
      GraphModule.sendRequest(
        MethodRequest.POST,
        "call/find", 
        token, 
        params,
        {
          success: (statusCode, message, jsonObject) => resolve(jsonObject),
          error: (errorCode, message) => console.log(`Error code: ${errorCode}, Message: ${message}`)
        }
      )
    });
  };

  const onPress = async() => {
    var token = await fetchToken();
    console.log(token);
    const jsonRequest = {
      offset: 0
    }
    var jsonObject = await fetchData(token, jsonRequest);
    var dataList = GraphModule.getListData(jsonObject);
    console.log(dataList);
    // var data = GraphModule.getData(jsonObject);
    // console.log(data);
  };

  const Login = () => {
    SipModule.registerSipAccount("extension", "password", "IP");
  };

  const Call = () => {
    SipModule.call("phoneNumber");
  };

  const Hangup = () => {
    SipModule.hangup();
  };

  const AcceptCall = () => {
    SipModule.acceptCall();
  };

  const Decline = () => {
    SipModule.decline();
  };

  const ToggleMic = () => {
    SipModule.toggleMic()
      .then((result) => {
          if(result) 
            console.log("Enabled mic") 
          else 
            console.log("Disabled mic")
        }
      )
      .catch((e) => console.log("Something has gone wrong"))
  };

  const Pause = () => {
    SipModule.pause();
  };

  const Resume = () => {
    SipModule.resume();
  };

  const Transfer = () => {
    SipModule.transfer("extension");
  };

  const ToggleSpeaker = () => {
    SipModule.toggleSpeaker()
      .then((result) => {
          if(result) 
            console.log("Enabled speaker") 
          else 
            console.log("Disabled speaker")
        }
      )
      .catch((e) => console.log("Something has gone wrong"))
  };

  const SendDtmf = () => {
    SipModule.sendDtmf("4#");
  };

  const Logout = () => {
    SipModule.unregisterSipAccount();
  };

  const RefreshRegister = () => {
    SipModule.refreshRegisterSipAccount();
  };

  const GetCallID = () => {
    SipModule.getCallId()
    .then((callId) => console.log(`Call ID: ${callId}`))
    .catch((error) => console.log(error))
  };

  const GetSipRegistrationState = () => {
    SipModule.getSipRegistrationState()
    .then((state) => console.log(`State: ${state}`))
    .catch((error) => console.log(error))
  };

  const GetMissedCall = () => {
    SipModule.getMissedCalls()
    .then((state) => console.log(`Missed calls: ${state}`))
    .catch((error) => console.log(error))
  };

  // console.log(NativeModules.Voip24hSdk)

  SipModule.initializeModule();

  const callbacks =  {
    onAccountRegistrationStateChanged: (body) => console.log(`onAccountRegistrationStateChanged -> registrationState: ${body.registrationState} - message: ${body.message}`),
    onIncomingReceived: (body) => console.log(`onIncomingReceived -> callee: ${body.callee}`),
    onOutgoingInit: () => console.log("onOutgoingInit"),
    onOutgoingProgress: (body) => console.log(`onOutgoingProgress -> callId: ${body.callId}`),
    onOutgoingRinging: (body) => console.log(`onOutgoingRinging -> callId: ${body.callId}`),
    onStreamsRunning: (body) => console.log(`onStreamsRunning -> callId: ${body.callId} - Callee: ${body.callee}`),
    onPaused: () => console.log("onPaused"),
    onMissed: (body) => console.log(`onMissed -> callee: ${body.callee} - Total missed: ${body.totalMissed}`),
    onReleased: () => console.log("onReleased"),
    onError: (body) => console.log(`onError -> message: ${body.message}`)
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

  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={backgroundStyle}>
        <Header />
        <View
          style={{
            backgroundColor: isDarkMode ? Colors.black : Colors.white,
          }}>
          <Button onPress={onPress} title="Graph"/>
          <Button onPress={Login} title="Login"/>
          <Button onPress={Logout} title="Logout"/>
          <Button onPress={RefreshRegister} title="Refresh register"/>
          <Button onPress={Call} title="Call"/>
          <Button onPress={Hangup} title="Hangup"/>
          <Button onPress={AcceptCall} title="Accept Call"/>
          <Button onPress={Decline} title="Decline"/>
          <Button onPress={Pause} title="Pause"/>
          <Button onPress={Resume} title="Resume"/>
          <Button onPress={Transfer} title="Transfer"/>
          <Button onPress={ToggleMic} title="ToggleMic"/>
          <Button onPress={ToggleSpeaker} title="ToggleSpeaker"/>
          <Button onPress={SendDtmf} title="Send dtmf"/>
          <Button onPress={GetCallID} title="Get CallID"/>
          <Button onPress={GetMissedCall} title="Get Missed Calls"/>
          <Button onPress={GetSipRegistrationState} title="Get Sip Registration State"/>

          <Section title="Step One">
            Edit <Text style={styles.highlight}>App.js</Text> to change this
            screen and then come back to see your edits.
          </Section>
          <Section title="See Your Changes">
            <ReloadInstructions />
          </Section>
          <Section title="Debug">
            <DebugInstructions />
          </Section>
          <Section title="Learn More">
            Read the docs to discover what to do next:
          </Section>
          <LearnMoreLinks />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
});

export default App;