import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator, TextInput } from 'react-native';
import { farmersApi } from '../../../services/api';
import { colors, spacing, fontSize, borderRadius } from '../../../shared/theme';

export default function FarmersListScreen({ navigation }: any) {
  const [farmers, setFarmers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadFarmers();
  }, []);

  const loadFarmers = async () => {
    try {
      const response = await farmersApi.getAll();
      if (response.success) {
        setFarmers(response.data || []);
      }
    } catch (error) {
      console.error('Error loading farmers:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      loadFarmers();
      return;
    }
    try {
      const response = await farmersApi.search(searchQuery);
      if (response.success) {
        setFarmers(response.data || []);
      }
    } catch (error) {
      console.error('Search error:', error);
    }
  };

  const renderFarmer = ({ item }: any) => (
    <TouchableOpacity
      style={styles.farmerCard}
      onPress={() => navigation.navigate('FarmerDetail', { farmerId: item.id })}
    >
      <View style={styles.farmerInfo}>
        <Text style={styles.farmerName}>{item.name || 'Unknown'}</Text>
        <Text style={styles.farmerMobile}>{item.mobile}</Text>
        <Text style={styles.farmerLocation}>{item.village || ''}, {item.district || ''}</Text>
      </View>
      <View style={styles.kycBadge}>
        <Text style={[styles.kycText, { 
          color: item.kyc_status === 'verified' ? colors.success : colors.warning 
        }]}>
          {item.kyc_status || 'pending'}
        </Text>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search farmers..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          onSubmitEditing={handleSearch}
        />
        <TouchableOpacity style={styles.addButton} onPress={() => navigation.navigate('AddFarmer')}>
          <Text style={styles.addButtonText}>+ Add</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={farmers}
        renderItem={renderFarmer}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No farmers found</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  searchContainer: { flexDirection: 'row', padding: spacing.md, gap: spacing.sm },
  searchInput: { flex: 1, backgroundColor: colors.surface, borderRadius: borderRadius.md, padding: spacing.md },
  addButton: { backgroundColor: colors.primary, borderRadius: borderRadius.md, paddingHorizontal: spacing.md, justifyContent: 'center' },
  addButtonText: { color: colors.white, fontWeight: '600' },
  listContainer: { padding: spacing.md, paddingBottom: spacing.xl * 2 },
  farmerCard: { backgroundColor: colors.surface, borderRadius: borderRadius.md, padding: spacing.md, marginBottom: spacing.sm, flexDirection: 'row', justifyContent: 'space-between', elevation: 1 },
  farmerInfo: { flex: 1 },
  farmerName: { fontSize: fontSize.md, fontWeight: '600', color: colors.text },
  farmerMobile: { fontSize: fontSize.sm, color: colors.textSecondary, marginTop: spacing.xs },
  farmerLocation: { fontSize: fontSize.xs, color: colors.gray, marginTop: spacing.xs },
  kycBadge: { alignSelf: 'center' },
  kycText: { fontSize: fontSize.xs, fontWeight: '600', textTransform: 'uppercase' },
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingTop: spacing.xl * 2 },
  emptyText: { color: colors.gray, fontSize: fontSize.md },
});