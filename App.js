import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';
import MQTTService from './src/services/mqttService';
import StatusModal from './src/components/StatusModal';
import LightControl from './src/components/LightControl';
import Gauges from './src/components/Gauges';

const mqtt = new MQTTService();

const {
  mqttHost,
  mqttPort,
  mqttPath,
  mqttUser,
  mqttPass
} = Constants.expoConfig.extra;

export default function App() {
  const [isConnected, setIsConnected] = useState(false);
  const [showError, setShowError] = useState(false);
  const [isLightOn, setIsLightOn] = useState(false);
  const [temp, setTemp] = useState(0);
  const [hum, setHum] = useState(0);

  const mqttConfig = {
    host: mqttHost,
    port: parseInt(mqttPort),
    path: mqttPath,
    user: mqttUser,
    pass: mqttPass,
    clientId: 'RN_App_' + Math.random(),
  };

  const saveLastData = async (key, value) => {
    try {
      await AsyncStorage.setItem(key, String(value));
    } catch (e) {
      console.log('Erro ao salvar:', e);
    }
  };

  const loadLastData = async () => {
    try {
      const lastTemp  = await AsyncStorage.getItem('last_temp');
      const lastHum   = await AsyncStorage.getItem('last_hum');
      const lastLight = await AsyncStorage.getItem('last_light');

      if (lastTemp)  setTemp(parseFloat(lastTemp));
      if (lastHum)   setHum(parseFloat(lastHum));
      if (lastLight) setIsLightOn(lastLight === 'true');
    } catch (e) {
      console.log('Erro ao carregar:', e);
    }
  };

  useEffect(() => {
    loadLastData();   
    startConnection(); 
  }, []);

  const startConnection = () => {
    setShowError(false);
    mqtt.connect(
      mqttConfig,
      (topic, message) => {
        if (topic === 'casa/temp') {
          setTemp(parseFloat(message));
          saveLastData('last_temp', message);
        }
        if (topic === 'casa/umid') {
          setHum(parseFloat(message));
          saveLastData('last_hum', message);
        }
        if (topic === 'casa/luz') {
          const isOn = message === "1";
          setIsLightOn(isOn);
          saveLastData('last_light', isOn);
        }
      },
      () => {
        setIsConnected(true);
        mqtt.subscribe('casa/temp');
        mqtt.subscribe('casa/umid');
        mqtt.subscribe('casa/luz');
      },
      (err) => {
        setIsConnected(false);
        setShowError(true);
      }
    );
  };

  const toggleLight = () => {
    const newState = isLightOn ? "0" : "1";
    mqtt.publish('casa/luz', newState);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Smart Home IoT</Text>

      <LightControl isLightOn={isLightOn} onToggle={toggleLight} />

      <Gauges temp={temp} hum={hum} />

      <StatusModal
        visible={showError}
        onRetry={startConnection}
        onLater={() => setShowError(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#ffafcc',
    padding: 20, alignItems: 'center'
  },
  header: { color: '#333840', fontSize: 24,
    fontWeight: 'bold', marginTop: 40,
    marginBottom: 20
  },
});