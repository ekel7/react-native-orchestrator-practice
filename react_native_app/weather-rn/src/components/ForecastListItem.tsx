import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Card } from 'react-native-paper';

interface Props {
  date: string;
  description: string;
  temp: number;
}

export default function ForecastListItem({ date, description, temp }: Props) {
  return (
    <Card style={styles.card}>
      <Card.Content>
        <Text variant="bodyMedium">{date}</Text>
        <Text variant="titleMedium">{temp}°C</Text>
        <Text variant="bodySmall">{description}</Text>
      </Card.Content>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: { marginVertical: 4, marginHorizontal: 16 },
});
