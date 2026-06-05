import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';
import * as ImagePicker from 'expo-image-picker';
import { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, View } from 'react-native';

interface CameraViewComponentProps {
  onCapture: (photoUri: string) => void;
  isProcessing: boolean;
}

export function CameraViewComponent({ onCapture, isProcessing }: CameraViewComponentProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [cameraActive, setCameraActive] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!cameraActive) return;

    const startCamera = async () => {
      try {
        setError(null);
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment' },
          audio: false,
        });

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          streamRef.current = stream;
          setIsReady(true);
        }
      } catch (err) {
        setError(
          err instanceof Error ? err.message : 'Failed to access camera'
        );
        setCameraActive(false);
      }
    };

    startCamera();

    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, [cameraActive]);

  const handleCapture = async () => {
    if (!videoRef.current || !canvasRef.current) return;

    try {
      const context = canvasRef.current.getContext('2d');
      if (!context) {
        console.error('Could not get canvas context');
        return;
      }

      canvasRef.current.width = videoRef.current.videoWidth;
      canvasRef.current.height = videoRef.current.videoHeight;

      context.drawImage(
        videoRef.current,
        0,
        0,
        canvasRef.current.width,
        canvasRef.current.height
      );

      canvasRef.current.toBlob(
        (blob) => {
          if (blob) {
            const url = URL.createObjectURL(blob);
            console.log('Captured image:', url);
            onCapture(url);
          } else {
            console.error('Blob is null');
          }
        },
        'image/jpeg',
        0.95
      );
    } catch (err) {
      console.error('Capture error:', err);
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
        setCameraActive(false);
      }
    } catch (error) {
      console.error('Image picker error:', error);
    }
  };

  if (error) {
    return (
      <ThemedView style={styles.centerContainer}>
        <ThemedText type="subtitle" style={styles.centerText}>
          Camera not available
        </ThemedText>
        <ThemedText style={styles.centerHint}>{error}</ThemedText>
        <Pressable onPress={() => setCameraActive(true)} style={styles.retryButton}>
          <ThemedView type="backgroundElement" style={styles.retryButtonContent}>
            <ThemedText style={styles.retryButtonText}>Retry</ThemedText>
          </ThemedView>
        </Pressable>
      </ThemedView>
    );
  }

  if (!cameraActive) {
    return null;
  }

  return (
    <View style={styles.container}>
      <video
        ref={videoRef}
        style={styles.video}
        autoPlay
        playsInline
        muted
      />

      <canvas ref={canvasRef} style={styles.hidden} />

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
        <ThemedText style={styles.instructionText}>Tap the blue button to scan</ThemedText>
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

        <Pressable
          onPress={handlePickImage}
          disabled={!isReady || isProcessing}
          style={({ pressed }) => [
            styles.controlButton,
            styles.secondaryButton,
            (pressed || isProcessing) && styles.disabled,
          ]}
        >
          <ThemedText style={styles.controlButtonText}>Pick from gallery</ThemedText>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    position: 'relative',
  } as any,
  video: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  } as any,
  hidden: {
    display: 'none',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    pointerEvents: 'none',
  } as any,
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
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    gap: Spacing.three,
    zIndex: 20,
  } as any,
  processingText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
  controlsContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
    paddingVertical: Spacing.four,
    paddingHorizontal: Spacing.three,
    gap: Spacing.three,
    zIndex: 30,
  } as any,
  instructionText: {
    color: '#FFF',
    fontWeight: '600',
    fontSize: 16,
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
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  captureButtonInner: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#3B82F6',
  },
  controlButtonText: {
    color: '#FFF',
    fontWeight: '600',
    fontSize: 14,
  },
  disabled: {
    opacity: 0.5,
  },
});
