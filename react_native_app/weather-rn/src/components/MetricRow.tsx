import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';

interface Props {
  label: string;
  value: string;
}

export default function MetricRow({ label, value }: Props) {
  return (
    <View style={styles.container}>
      <Text variant="bodyMedium">{label}</Text>
      <Text variant="bodyMedium">{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
});
