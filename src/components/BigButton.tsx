import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
  View,
} from 'react-native';

interface BigButtonProps {
  title: string;
  onPress: () => void;
  icon?: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'danger';
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
}

export const BigButton: React.FC<BigButtonProps> = ({
  title,
  onPress,
  icon,
  variant = 'primary',
  loading = false,
  disabled = false,
  style,
}) => {
  const isOutline = variant === 'outline';
  const isSecondary = variant === 'secondary';
  const isDanger = variant === 'danger';

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      disabled={disabled || loading}
      style={[
        styles.button,
        isSecondary && styles.secondaryButton,
        isOutline && styles.outlineButton,
        isDanger && styles.dangerButton,
        (disabled || loading) && styles.disabledButton,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={isOutline ? '#0284C7' : '#FFFFFF'} />
      ) : (
        <View style={styles.contentRow}>
          {icon ? <View style={styles.iconContainer}>{icon}</View> : null}
          <Text
            style={[
              styles.text,
              isSecondary && styles.secondaryText,
              isOutline && styles.outlineText,
              isDanger && styles.dangerText,
            ]}
          >
            {title}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#0284C7', // Strong vibrant cyan/blue high contrast
    minHeight: 58,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 14,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
  },
  secondaryButton: {
    backgroundColor: '#0F172A', // Slate dark
  },
  outlineButton: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: '#0284C7',
    elevation: 0,
    shadowOpacity: 0,
  },
  dangerButton: {
    backgroundColor: '#DC2626',
  },
  disabledButton: {
    opacity: 0.5,
  },
  contentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainer: {
    marginRight: 10,
  },
  text: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  secondaryText: {
    color: '#FFFFFF',
  },
  outlineText: {
    color: '#0284C7',
  },
  dangerText: {
    color: '#FFFFFF',
  },
});
