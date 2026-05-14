import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { useAuth } from '../../shared/context/AuthContext';
import { colors, spacing, fontSize, borderRadius } from '../../shared/theme';

export default function LoginScreen({ navigation }: any) {
  const [mobile, setMobile] = useState('');
  const [otp, setOtp] = useState('');
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login, verifyOtp } = useAuth();

  const handleRequestOtp = async () => {
    if (mobile.length !== 10) {
      Alert.alert('Error', 'Please enter a valid 10-digit mobile number');
      return;
    }
    
    setLoading(true);
    try {
      await login(mobile);
      setShowOtpInput(true);
      Alert.alert('Success', 'OTP sent to your mobile number');
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (otp.length !== 6) {
      Alert.alert('Error', 'Please enter 6-digit OTP');
      return;
    }

    setLoading(true);
    try {
      await verifyOtp(mobile, otp);
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Invalid OTP');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Text style={styles.logo}>AgriTrack</Text>
        <Text style={styles.tagline}>Agricultural Program Management</Text>
      </View>

      <View style={styles.formContainer}>
        <Text style={styles.title}>
          {showOtpInput ? 'Enter OTP' : 'Login with Mobile'}
        </Text>

        {!showOtpInput ? (
          <>
            <TextInput
              style={styles.input}
              placeholder="Mobile Number"
              placeholderTextColor={colors.gray}
              keyboardType="phone-pad"
              maxLength={10}
              value={mobile}
              onChangeText={setMobile}
            />
            <TouchableOpacity
              style={[styles.button, loading && styles.buttonDisabled]}
              onPress={handleRequestOtp}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color={colors.white} />
              ) : (
                <Text style={styles.buttonText}>Send OTP</Text>
              )}
            </TouchableOpacity>
          </>
        ) : (
          <>
            <Text style={styles.otpInfo}>OTP sent to {mobile}</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter 6-digit OTP"
              placeholderTextColor={colors.gray}
              keyboardType="number-pad"
              maxLength={6}
              value={otp}
              onChangeText={setOtp}
            />
            <TouchableOpacity
              style={[styles.button, loading && styles.buttonDisabled]}
              onPress={handleVerifyOtp}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color={colors.white} />
              ) : (
                <Text style={styles.buttonText}>Verify & Login</Text>
              )}
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.resendButton}
              onPress={() => setShowOtpInput(false)}
            >
              <Text style={styles.resendText}>Change Mobile Number</Text>
            </TouchableOpacity>
          </>
        )}
      </View>

      <Text style={styles.version}>Version 1.0.0</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: spacing.lg,
    justifyContent: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: spacing.xl * 2,
  },
  logo: {
    fontSize: fontSize.xxl * 1.5,
    fontWeight: 'bold',
    color: colors.primary,
  },
  tagline: {
    fontSize: fontSize.md,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  formContainer: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    elevation: 2,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  title: {
    fontSize: fontSize.lg,
    fontWeight: '600',
    color: colors.text,
    marginBottom: spacing.lg,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    fontSize: fontSize.md,
    marginBottom: spacing.md,
  },
  button: {
    backgroundColor: colors.primary,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    alignItems: 'center',
    marginTop: spacing.sm,
  },
  buttonDisabled: {
    backgroundColor: colors.gray,
  },
  buttonText: {
    color: colors.white,
    fontSize: fontSize.md,
    fontWeight: '600',
  },
  otpInfo: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  resendButton: {
    marginTop: spacing.md,
    alignItems: 'center',
  },
  resendText: {
    color: colors.primary,
    fontSize: fontSize.sm,
  },
  version: {
    position: 'absolute',
    bottom: spacing.lg,
    alignSelf: 'center',
    color: colors.gray,
    fontSize: fontSize.xs,
  },
});