import { CameraView, useCameraPermissions } from 'expo-camera';
import { useRef } from 'react';
import { Button, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function ScannerScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef(null);

  // 1. Check if permissions are still loading
  if (!permission) {
    return <View style={styles.container} />;
  }

  // 2. Ask for permission if not granted
  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>We need your permission to show the camera</Text>
        <Button onPress={requestPermission} title="Grant Permission" />
      </View>
    );
  }

  // 3. Function to take a picture
  const takePicture = async () => {
    if (cameraRef.current) {
      const photo = await cameraRef.current.takePictureAsync({ base64: true });
      console.log("Photo snapped!", photo.uri);
      // Next steps: Send this photo's base64 data to the AI API!
    }
  };

  // 4. Render the Camera View (No children inside CameraView!)
  return (
    <View style={styles.container}>
      <CameraView 
        style={styles.camera} 
        facing="back" 
        ref={cameraRef}
      />
      
      {/* Button overlaid using absolute positioning */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.captureButton} onPress={takePicture}>
          <View style={styles.innerCircle} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000', // Black background looks better behind the camera
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 40,
    width: '100%', // Take up full width to center the button properly
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  captureButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  innerCircle: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: 'white',
  },
  text: {
    textAlign: 'center',
    marginBottom: 20,
    fontSize: 16,
    color: 'white',
  }
});