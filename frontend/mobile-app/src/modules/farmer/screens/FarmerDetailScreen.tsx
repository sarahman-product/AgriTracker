import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { colors, spacing, fontSize } from '../../../shared/theme';

export default function FarmerDetailScreen({ route, navigation }: any) {
  const { farmerId } = route.params || {};

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.name}>Farmer Name</Text>
        <Text style={styles.mobile}>Mobile Number</Text>
      </View>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Address</Text>
        <Text style={styles.text}>Village, District, State</Text>
      </View>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Farms</Text>
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('AddFarm')}>
          <Text style={styles.buttonText}>Add Farm</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>KYC Status</Text>
        <Text style={styles.text}>Pending</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, padding: spacing.md },
  header: { backgroundColor: colors.surface, padding: spacing.lg, borderRadius: 8, marginBottom: spacing.md },
  name: { fontSize: fontSize.xl, fontWeight: 'bold', color: colors.text },
  mobile: { fontSize: fontSize.md, color: colors.textSecondary, marginTop: spacing.xs },
  section: { backgroundColor: colors.surface, padding: spacing.md, borderRadius: 8, marginBottom: spacing.md },
  sectionTitle: { fontSize: fontSize.md, fontWeight: '600', color: colors.text, marginBottom: spacing.sm },
  text: { fontSize: fontSize.sm, color: colors.textSecondary },
  button: { backgroundColor: colors.primary, padding: spacing.sm, borderRadius: 4, alignItems: 'center', marginTop: spacing.sm },
  buttonText: { color: colors.white, fontWeight: '600' },
});