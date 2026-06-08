import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import CircularProgress from 'react-native-circular-progress-indicator';

export default function Gauges({ temp, hum }) {
  return (
    <View style={styles.row}>
      <View style={styles.gaugeBox}>
        <CircularProgress
          value={temp}
          radius={60}
          title={'°C'}
          titleColor={'#666e7a'}
          activeStrokeColor={'#e38484'}
          inActiveStrokeColor={'#f0f6ff'}
          textColor={'#666e7a'}
        />
        <Text style={styles.label}>Temperatura</Text>
      </View>

      <View style={styles.gaugeBox}>
        <CircularProgress
          value={hum}
          radius={60}
          title={'%'}
          titleColor={'#666e7a'}
          activeStrokeColor={'#84b5e3'}
          inActiveStrokeColor={'#f0f6ff'}
          textColor={'#666e7a'}
        />
        <Text style={styles.label}>Umidade</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', justifyContent: 'space-between',
    width: '100%',
  },
  gaugeBox: { backgroundColor: '#ffc8dd', padding: 15,
    borderRadius: 20, alignItems: 'center', width: '48%',
  },
  label: { color: '#333840', marginTop: 10,
    fontSize: 14,
  },
});