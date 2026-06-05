import { useEffect, useRef, useState } from 'react';
import { Platform, Pressable, StyleSheet, View, ActivityIndicator } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';

interface CameraViewComponentProps {
  onCapture: (photoUri: string) => void;
  isProcessing: boolean;
}

export function CameraViewComponent({ onCapture, isProcessing }: CameraViewComponentProps) {
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef<CameraView>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (permission?.status === 'undetermined') {
      requestPermission();
    }
  }, [permission, requestPermission]);

  const handleCapture = async () => {
    if (!cameraRef.current) return;

    try {
      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.8,
        base64: false,
      });

      if (photo?.uri) {
        onCapture(photo.uri);
      }
    } catch (error) {
      console.error('Capture error:', error);
    }
  };

  const handlePickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]?.uri) {
        onCapture(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Image picker error:', error);
    }
  };

  if (permission?.status === 'denied') {
    return (
      <ThemedView style={styles.centerContainer}>
        <ThemedText type="subtitle" style={styles.centerText}>
          Camera permission required
        </ThemedText>
        <ThemedText style={styles.centerHint}>
          Allow camera access in settings to scan recyclables
        </ThemedText>
        <Pressable onPress={requestPermission} style={styles.retryButton}>
          <ThemedView type="backgroundElement" style={styles.retryButtonContent}>
            <ThemedText style={styles.retryButtonText}>Grant Permission</ThemedText>
          </ThemedView>
        </Pressable>
      </ThemedView>
    );
  }

  if (permission?.status !== 'granted') {
    return (
      <ThemedView style={styles.centerContainer}>
        <ActivityIndicator size="large" />
      </ThemedView>
    );
  }

  return (
    <View style={styles.container}>
      <CameraView
        ref={cameraRef}
        style={styles.camera}
        facing="back"
        onCameraReady={() => setIsReady(true)}
      />

      <View style={styles.overlay}>
        <View style={styles.focusBox} />
      </View>

      {isProcessing && (
        <View style={styles.processingOverlay}>
          <ActivityIndicator size="large" color="#FFF" />
          <ThemedText style={styles.processingText}>Analyzing...</ThemedText>
        </View>
      )}

      <View style={styles.controlsContainer}>
        <Pressable
          onPress={handlePickImage}
          disabled={!isReady || isProcessing}
          style={({ pressed }) => [
            styles.controlButton,
            styles.secondaryButton,
            (pressed || isProcessing) && styles.disabled,
          ]}
        >
          <ThemedText style={styles.controlButtonText}>Gallery</ThemedText>
        </Pressable>

        <Pressable
          onPress={handleCapture}
          disabled={!isReady || isProcessing}
          style={({ pressed }) => [
            styles.controlButton,
            styles.captureButton,
            (pressed || isProcessing) && styles.disabled,
          ]}
        >
          <View style={styles.captureButtonInner} />
        </Pressable>

        <View style={styles.spacer} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  camera: {
    flex: 1,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    pointerEvents: 'none',
  },
  focusBox: {
    width: 250,
    height: 250,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 10,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Spacing.four,
    gap: Spacing.three,
  },
  centerText: {
    textAlign: 'center',
  },
  centerHint: {
    textAlign: 'center',
    fontSize: 14,
  },
  retryButton: {
    marginTop: Spacing.three,
  },
  retryButtonContent: {
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.three,
    borderRadius: Spacing.three,
    alignItems: 'center',
  },
  retryButtonText: {
    fontWeight: '600',
  },
  processingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    gap: Spacing.three,
  },
  processingText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
  controlsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    paddingVertical: Spacing.four,
    paddingHorizontal: Spacing.three,
  },
  controlButton: {
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.three,
    borderRadius: Spacing.three,
    minWidth: 80,
    alignItems: 'center',
  },
  secondaryButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  captureButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  captureButtonInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#3B82F6',
  },
  controlButtonText: {
    color: '#FFF',
    fontWeight: '600',
    fontSize: 12,
  },
  spacer: {
    width: 60,
  },
  disabled: {
    opacity: 0.5,
  },
});
