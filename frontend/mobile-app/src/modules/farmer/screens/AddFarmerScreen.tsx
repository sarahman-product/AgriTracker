import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import { farmersApi } from '../../../services/api';
import { colors, spacing, fontSize, borderRadius } from '../../../shared/theme';

export default function AddFarmerScreen({ navigation }: any) {
  const [form, setForm] = useState({ name: '', mobile: '', father_name: '', village: '', district: '', state: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!form.name || !form.mobile) {
      Alert.alert('Error', 'Name and mobile are required');
      return;
    }
    setLoading(true);
    try {
      await farmersApi.create(form);
      Alert.alert('Success', 'Farmer added successfully');
      navigation.goBack();
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to add farmer');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.label}>Full Name *</Text>
      <TextInput style={styles.input} placeholder="Enter name" value={form.name} onChangeText={(v) => setForm({ ...form, name: v })} />
      <Text style={styles.label}>Mobile Number *</Text>
      <TextInput style={styles.input} placeholder="10-digit mobile" keyboardType="phone-pad" maxLength={10} value={form.mobile} onChangeText={(v) => setForm({ ...form, mobile: v })} />
      <Text style={styles.label}>Father/Spouse Name</Text>
      <TextInput style={styles.input} placeholder="Enter name" value={form.father_name} onChangeText={(v) => setForm({ ...form, father_name: v })} />
      <Text style={styles.label}>Village</Text>
      <TextInput style={styles.input} placeholder="Enter village" value={form.village} onChangeText={(v) => setForm({ ...form, village: v })} />
      <Text style={styles.label}>District</Text>
      <TextInput style={styles.input} placeholder="Enter district" value={form.district} onChangeText={(v) => setForm({ ...form, district: v })} />
      <Text style={styles.label}>State</Text>
      <TextInput style={styles.input} placeholder="Enter state" value={form.state} onChangeText={(v) => setForm({ ...form, state: v })} />
      <TouchableOpacity style={[styles.button, loading && styles.buttonDisabled]} onPress={handleSubmit} disabled={loading}>
        <Text style={styles.buttonText}>{loading ? 'Saving...' : 'Save Farmer'}</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, padding: spacing.md },
  label: { fontSize: fontSize.sm, fontWeight: '600', color: colors.text, marginBottom: spacing.xs, marginTop: spacing.md },
  input: { backgroundColor: colors.surface, borderRadius: borderRadius.md, padding: spacing.md, fontSize: fontSize.md },
  button: { backgroundColor: colors.primary, padding: spacing.md, borderRadius: borderRadius.md, alignItems: 'center', marginTop: spacing.lg },
  buttonText: { color: colors.white, fontSize: fontSize.md, fontWeight: '600' },
  buttonDisabled: { backgroundColor: colors.gray },
});