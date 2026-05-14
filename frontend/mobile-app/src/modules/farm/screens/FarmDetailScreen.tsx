import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, spacing } from '../../../shared/theme';

export default function FarmDetailScreen() {
  return <View style={styles.container}><Text>Farm Details</Text></View>;
}

export default function AddFarmScreen({ navigation }: any) {
  return (
    <View style={styles.container}>
      <Text>Add Farm Screen</Text>
    </View>
  );
}

const styles = StyleSheet.create({ container: { flex: 1, backgroundColor: colors.background, padding: spacing.md } });