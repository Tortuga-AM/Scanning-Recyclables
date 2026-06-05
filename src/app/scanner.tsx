import { CameraViewComponent } from '@/components/camera-view';
import { DetectionResult } from '@/components/detection-result';
import { FacilitiesList } from '@/components/facilities-list';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { BottomTabInset, Spacing } from '@/constants/theme';
import { DetectionResult as DetectionResultType, detectRecyclable, disposeModel } from '@/utils/recyclables-detector';
import { findNearbyFacilities, openMapsForFacility, RecyclingFacility } from '@/utils/facilities-finder';
import { useEffect, useState } from 'react';
import { Image, Platform, SafeAreaView, StyleSheet } from 'react-native';

export default function ScannerScreen() {
  const [cameraActive, setCameraActive] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [detectionResult, setDetectionResult] = useState<DetectionResultType | null>(null);
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [facilities, setFacilities] = useState<RecyclingFacility[]>([]);
  const [showingFacilities, setShowingFacilities] = useState(false);

  useEffect(() => {
    return () => {
      disposeModel();
    };
  }, []);

  const handleCapture = async (uri: string) => {
    setPhotoUri(uri);
    setCameraActive(false);
    setIsProcessing(true);

    try {
      let imageElement: any = null;

      if (Platform.OS === 'web') {
        imageElement = document.createElement('img');
        imageElement.crossOrigin = 'anonymous';
        imageElement.src = uri;

        await new Promise((resolve, reject) => {
          imageElement.onload = resolve;
          imageElement.onerror = reject;
        });
      } else {
        imageElement = new (Image as any)();
        imageElement.src = uri;
      }

      const result = await detectRecyclable(imageElement);
      setDetectionResult(result);
    } catch (error) {
      console.error('Error processing image:', error);
      setDetectionResult({
        recyclableType: 'unknown',
        confidence: 0,
        detectedObjects: [],
        rawPredictions: [],
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReset = () => {
    setPhotoUri(null);
    setDetectionResult(null);
    setCameraActive(true);
    setShowingFacilities(false);
  };

  const handleFindFacilities = async () => {
    if (detectionResult) {
      try {
        setIsProcessing(true);
        const foundFacilities = await findNearbyFacilities(detectionResult.recyclableType);
        setFacilities(foundFacilities);
        setShowingFacilities(true);
      } catch (error) {
        console.error('Error finding facilities:', error);
        alert('Could not find recycling facilities');
      } finally {
        setIsProcessing(false);
      }
    }
  };

  if (cameraActive) {
    return (
      <ThemedView style={styles.container}>
        <SafeAreaView style={[styles.safeArea, styles.cameraSafeArea]}>
          <ThemedView style={styles.titleContainer}>
            <ThemedText type="subtitle" style={styles.title}>
              Scan Recyclable
            </ThemedText>
            <ThemedText style={styles.subtitle}>
              Point camera at an item to identify if it's recyclable
            </ThemedText>
          </ThemedView>
        </SafeAreaView>
        <CameraViewComponent onCapture={handleCapture} isProcessing={isProcessing} />
      </ThemedView>
    );
  }

  if (showingFacilities) {
    return (
      <ThemedView style={styles.container}>
        <SafeAreaView style={styles.safeArea}>
          <FacilitiesList
            facilities={facilities}
            onClose={() => setShowingFacilities(false)}
          />
        </SafeAreaView>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={[styles.safeArea, styles.resultSafeArea]}>
        {detectionResult && (
          <DetectionResult
            recyclableType={detectionResult.recyclableType}
            confidence={detectionResult.confidence}
            onReset={handleReset}
            onFindFacilities={handleFindFacilities}
          />
        )}
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.three,
    paddingBottom: 0,
  },
  cameraSafeArea: {
    paddingBottom: 0,
    zIndex: 10,
  },
  titleContainer: {
    paddingVertical: Spacing.two,
  },
  resultSafeArea: {
    flex: 1,
    paddingBottom: BottomTabInset + Spacing.three,
  },
  title: {
    textAlign: 'center',
    marginBottom: Spacing.one,
  },
  subtitle: {
    textAlign: 'center',
    fontSize: 14,
  },
});
