import React, { useState } from 'react';
import { View } from 'react-native';
import { Button, Menu } from 'react-native-paper';

interface Props {
  cities: readonly string[];
  selected: string;
  onSelect: (city: string) => void;
}

export default function CitySelector({ cities, selected, onSelect }: Props) {
  const [visible, setVisible] = useState(false);

  const openMenu = () => setVisible(true);
  const closeMenu = () => setVisible(false);

  return (
    <View>
      <Menu
        visible={visible}
        onDismiss={closeMenu}
        anchor={<Button onPress={openMenu}>{selected}</Button>}
      >
        {cities.map((city) => (
          <Menu.Item
            key={city}
            onPress={() => {
              onSelect(city);
              closeMenu();
            }}
            title={city}
          />
        ))}
      </Menu>
    </View>
  );
}
