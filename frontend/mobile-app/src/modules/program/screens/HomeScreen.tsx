import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, RefreshControl } from 'react-native';
import { useAuth } from '../../../shared/context/AuthContext';
import { programsApi, dashboardApi } from '../../../services/api';
import { colors, spacing, fontSize, borderRadius } from '../../../shared/theme';

export default function HomeScreen({ navigation }: any) {
  const { user } = useAuth();
  const [programs, setPrograms] = useState<any[]>([]);
  const [selectedProgram, setSelectedProgram] = useState<any>(null);
  const [dashboard, setDashboard] = useState<any>(null);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const programsRes = await programsApi.getAssigned();
      if (programsRes.success && programsRes.data) {
        setPrograms(programsRes.data);
        if (programsRes.data.length === 1) {
          setSelectedProgram(programsRes.data[0]);
        }
      }
      
      const dashRes = await dashboardApi.getAgent();
      if (dashRes.success) {
        setDashboard(dashRes.data);
      }
    } catch (error) {
      console.error('Error loading home data:', error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const getDynamicModules = () => {
    if (!selectedProgram?.uiConfig) return defaultModules;
    return selectedProgram.uiConfig.map((mod: any) => ({
      key: mod.module_key,
      title: mod.display_name,
      icon: mod.icon,
      color: mod.module_key === 'farmers' ? colors.primary :
             mod.module_key === 'surveys' ? colors.secondary :
             mod.module_key === 'procurement' ? '#7B1FA2' : colors.primaryDark,
    }));
  };

  const defaultModules = [
    { key: 'farmers', title: 'My Farmers', color: colors.primary },
    { key: 'surveys', title: 'Surveys', color: colors.secondary },
    { key: 'procurement', title: 'Procurement', color: '#7B1FA2' },
    { key: 'harvest', title: 'Harvest', color: '#FF5722' },
    { key: 'traceability', title: 'Traceability', color: '#00BCD4' },
  ];

  return (
    <ScrollView
      style={styles.container}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Welcome back!</Text>
          <Text style={styles.userName}>{user?.name || user?.mobile || 'Agent'}</Text>
        </View>
        <TouchableOpacity style={styles.syncButton}>
          <Text style={styles.syncText}>Sync</Text>
        </TouchableOpacity>
      </View>

      {/* Program Selector */}
      {programs.length > 1 && (
        <View style={styles.programSelector}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {programs.map((prog) => (
              <TouchableOpacity
                key={prog.id}
                style={[
                  styles.programChip,
                  selectedProgram?.id === prog.id && styles.programChipActive,
                ]}
                onPress={() => setSelectedProgram(prog)}
              >
                <Text
                  style={[
                    styles.programChipText,
                    selectedProgram?.id === prog.id && styles.programChipTextActive,
                  ]}
                >
                  {prog.name}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}

      {/* Stats Cards */}
      {dashboard && (
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{dashboard.total_farmers || 0}</Text>
            <Text style={styles.statLabel}>Farmers</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{dashboard.pending_surveys || 0}</Text>
            <Text style={styles.statLabel}>Pending</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{dashboard.completed_surveys || 0}</Text>
            <Text style={styles.statLabel}>Completed</Text>
          </View>
        </View>
      )}

      {/* Module Grid */}
      <View style={styles.modulesContainer}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.modulesGrid}>
          {getDynamicModules().map((module) => (
            <TouchableOpacity
              key={module.key}
              style={[styles.moduleCard, { borderLeftColor: module.color }]}
              onPress={() => {
                if (module.key === 'farmers') {
                  navigation.navigate('Farmers');
                } else if (module.key === 'surveys') {
                  navigation.navigate('Surveys');
                }
              }}
            >
              <Text style={styles.moduleTitle}>{module.title}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Activity Section */}
      <View style={styles.activityContainer}>
        <Text style={styles.sectionTitle}>Recent Activity</Text>
        <View style={styles.activityCard}>
          <Text style={styles.activityText}>No recent activity</Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.lg,
    backgroundColor: colors.primary,
  },
  greeting: {
    color: colors.white,
    fontSize: fontSize.sm,
    opacity: 0.8,
  },
  userName: {
    color: colors.white,
    fontSize: fontSize.xl,
    fontWeight: 'bold',
  },
  syncButton: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
  },
  syncText: {
    color: colors.white,
    fontWeight: '600',
  },
  programSelector: {
    padding: spacing.md,
    backgroundColor: colors.surface,
  },
  programChip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.round,
    backgroundColor: colors.background,
    marginRight: spacing.sm,
  },
  programChipActive: {
    backgroundColor: colors.primary,
  },
  programChipText: {
    color: colors.textSecondary,
    fontSize: fontSize.sm,
  },
  programChipTextActive: {
    color: colors.white,
  },
  statsContainer: {
    flexDirection: 'row',
    padding: spacing.md,
    gap: spacing.sm,
  },
  statCard: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    alignItems: 'center',
    elevation: 1,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  statValue: {
    fontSize: fontSize.xl,
    fontWeight: 'bold',
    color: colors.primary,
  },
  statLabel: {
    fontSize: fontSize.xs,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  modulesContainer: {
    padding: spacing.md,
  },
  sectionTitle: {
    fontSize: fontSize.lg,
    fontWeight: '600',
    color: colors.text,
    marginBottom: spacing.md,
  },
  modulesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  moduleCard: {
    width: '48%',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    padding: spacing.lg,
    borderLeftWidth: 4,
    elevation: 1,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  moduleTitle: {
    fontSize: fontSize.md,
    fontWeight: '600',
    color: colors.text,
  },
  activityContainer: {
    padding: spacing.md,
    paddingBottom: spacing.xl * 2,
  },
  activityCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    padding: spacing.lg,
    alignItems: 'center',
  },
  activityText: {
    color: colors.textSecondary,
    fontSize: fontSize.sm,
  },
});