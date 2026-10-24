import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Linking,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useI18n } from '../src/i18n';
import { BigButton } from '../src/components/BigButton';
import { initClassifier } from '../src/ml/classifier';

export default function HomeScreen() {
  const router = useRouter();
  const { t, toggleLanguage, lang } = useI18n();
  const [loadingAction, setLoadingAction] = useState<string | null>(null);

  // Hidden debug screen tap counter
  const tapCountRef = useRef(0);
  const lastTapRef = useRef(0);

  useEffect(() => {
    // Eagerly initialize model in background on app start
    initClassifier().catch((err) => {
      console.warn('Initial model load attempt:', err);
    });
  }, []);

  const handleTitleTap = () => {
    const now = Date.now();
    if (now - lastTapRef.current < 800) {
      tapCountRef.current += 1;
    } else {
      tapCountRef.current = 1;
    }
    lastTapRef.current = now;

    if (tapCountRef.current >= 5) {
      tapCountRef.current = 0;
      router.push('/debug');
    }
  };

  const handleTakePhoto = async () => {
    setLoadingAction('camera');
    try {
      const { status, canAskAgain } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== ImagePicker.PermissionStatus.GRANTED) {
        Alert.alert(
          t.cameraPermissionTitle,
          t.cameraPermissionMessage,
          [
            { text: t.permissionDismiss, style: 'cancel' },
            canAskAgain
              ? { text: t.openSettings, onPress: () => Linking.openSettings() }
              : { text: t.openSettings, onPress: () => Linking.openSettings() },
          ]
        );
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: false,
        quality: 1,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const uri = result.assets[0].uri;
        router.push({
          pathname: '/result',
          params: { uri },
        });
      }
    } catch (err) {
      console.error('Camera error:', err);
      Alert.alert('Error', t.processingError);
    } finally {
      setLoadingAction(null);
    }
  };

  const handleChooseGallery = async () => {
    setLoadingAction('gallery');
    try {
      const { status, canAskAgain } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== ImagePicker.PermissionStatus.GRANTED) {
        Alert.alert(
          t.galleryPermissionTitle,
          t.galleryPermissionMessage,
          [
            { text: t.permissionDismiss, style: 'cancel' },
            canAskAgain
              ? { text: t.openSettings, onPress: () => Linking.openSettings() }
              : { text: t.openSettings, onPress: () => Linking.openSettings() },
          ]
        );
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: false,
        quality: 1,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const uri = result.assets[0].uri;
        router.push({
          pathname: '/result',
          params: { uri },
        });
      }
    } catch (err) {
      console.error('Gallery error:', err);
      Alert.alert('Error', t.processingError);
    } finally {
      setLoadingAction(null);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        {/* Top bar with language toggle & history */}
        <View style={styles.topBar}>
          <TouchableOpacity
            style={styles.historyBtn}
            onPress={() => router.push('/history')}
            activeOpacity={0.7}
          >
            <Text style={styles.historyBtnText}>📁 {t.historyLink}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.langBadge}
            onPress={toggleLanguage}
            activeOpacity={0.7}
          >
            <Text style={styles.langBadgeText}>
              🌐 {t.languageToggle}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Title area (tap 5 times to open hidden debug screen) */}
        <TouchableOpacity
          activeOpacity={1}
          onPress={handleTitleTap}
          style={styles.titleSection}
        >
          <Text style={styles.appTitle}>{t.appTitle}</Text>
          <Text style={styles.appSubtitle}>{t.appSubtitle}</Text>
          <View style={styles.offlinePill}>
            <Text style={styles.offlinePillText}>⚡ 100% Offline AI</Text>
          </View>
        </TouchableOpacity>

        {/* Action Buttons: Take Photo & Choose Gallery */}
        <View style={styles.actionsContainer}>
          <BigButton
            title={t.takePhotoButton}
            onPress={handleTakePhoto}
            loading={loadingAction === 'camera'}
            style={styles.primaryActionButton}
          />

          <BigButton
            title={t.chooseGalleryButton}
            onPress={handleChooseGallery}
            loading={loadingAction === 'gallery'}
            variant="secondary"
            style={styles.secondaryActionButton}
          />
        </View>

        {/* Tips for a good photo */}
        <View style={styles.tipsCard}>
          <Text style={styles.tipsTitle}>💡 {t.tipsCardTitle}</Text>
          <View style={styles.tipItem}>
            <Text style={styles.tipBullet}>•</Text>
            <Text style={styles.tipText}>{t.tip1}</Text>
          </View>
          <View style={styles.tipItem}>
            <Text style={styles.tipBullet}>•</Text>
            <Text style={styles.tipText}>{t.tip2}</Text>
          </View>
          <View style={styles.tipItem}>
            <Text style={styles.tipBullet}>•</Text>
            <Text style={styles.tipText}>{t.tip3}</Text>
          </View>
          <View style={styles.tipItem}>
            <Text style={styles.tipBullet}>•</Text>
            <Text style={styles.tipText}>{t.tip4}</Text>
          </View>
          <View style={styles.tipItem}>
            <Text style={styles.tipBullet}>•</Text>
            <Text style={styles.tipText}>{t.tip5}</Text>
          </View>
        </View>

        {/* Footer with About link */}
        <View style={styles.footer}>
          <TouchableOpacity
            onPress={() => router.push('/about')}
            style={styles.aboutLinkBtn}
            activeOpacity={0.7}
          >
            <Text style={styles.aboutLinkText}>ℹ️ {t.aboutLink}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  container: {
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  historyBtn: {
    backgroundColor: '#E2E8F0',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
  },
  historyBtnText: {
    color: '#334155',
    fontWeight: '700',
    fontSize: 13,
  },
  langBadge: {
    backgroundColor: '#0F172A',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
  },
  langBadgeText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 13,
  },
  titleSection: {
    alignItems: 'center',
    marginTop: 18,
    marginBottom: 28,
  },
  appTitle: {
    fontSize: 34,
    fontWeight: '900',
    color: '#0F172A',
    letterSpacing: 0.5,
    textAlign: 'center',
  },
  appSubtitle: {
    fontSize: 15,
    color: '#475569',
    marginTop: 4,
    textAlign: 'center',
    fontWeight: '500',
  },
  offlinePill: {
    marginTop: 10,
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#86EFAC',
  },
  offlinePillText: {
    color: '#166534',
    fontSize: 12,
    fontWeight: '700',
  },
  actionsContainer: {
    marginBottom: 26,
    gap: 14,
  },
  primaryActionButton: {
    backgroundColor: '#0284C7',
  },
  secondaryActionButton: {
    backgroundColor: '#1E293B',
  },
  tipsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  tipsTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 12,
  },
  tipItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  tipBullet: {
    color: '#0284C7',
    fontSize: 16,
    fontWeight: '900',
    marginRight: 8,
    lineHeight: 20,
  },
  tipText: {
    flex: 1,
    fontSize: 14,
    color: '#334155',
    lineHeight: 20,
  },
  footer: {
    marginTop: 24,
    alignItems: 'center',
  },
  aboutLinkBtn: {
    paddingVertical: 10,
    paddingHorizontal: 18,
  },
  aboutLinkText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0284C7',
  },
});
