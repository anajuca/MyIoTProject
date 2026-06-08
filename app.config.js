import 'dotenv/config';

export default {
  expo: {
    name: "MyloTProject",
    slug: "MyloTProject",
    extra: {
      mqttHost: process.env.EXPO_PUBLIC_MQTT_HOST,
      mqttPort: process.env.EXPO_PUBLIC_MQTT_PORT,
      mqttPath: process.env.EXPO_PUBLIC_MQTT_PATH,
      mqttUser: process.env.EXPO_PUBLIC_MQTT_USER,
      mqttPass: process.env.EXPO_PUBLIC_MQTT_PASS,
    }
  }
};