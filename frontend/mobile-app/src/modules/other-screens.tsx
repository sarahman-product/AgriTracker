import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, spacing } from '../../../shared/theme';

export default function AddFarmScreen({ navigation }: any) {
  return (
    <View style={styles.container}>
      <Text>Add Farm Screen - Coming Soon</Text>
    </View>
  );
}

export default function CropEnrollmentScreen({ navigation }: any) {
  return (
    <View style={styles.container}>
      <Text>Crop Enrollment - Coming Soon</Text>
    </View>
  );
}

export default function SurveysListScreen({ navigation }: any) {
  return (
    <View style={styles.container}>
      <Text>Surveys List - Coming Soon</Text>
    </View>
  );
}

export default function SurveyFormScreen({ navigation }: any) {
  return (
    <View style={styles.container}>
      <Text>Survey Form - Coming Soon</Text>
    </View>
  );
}

export default function DashboardScreen({ navigation }: any) {
  return (
    <View style={styles.container}>
      <Text>Dashboard - Coming Soon</Text>
    </View>
  );
}

const styles = StyleSheet.create({ container: { flex: 1, backgroundColor: colors.background, padding: spacing.md } });