import { StyleSheet, Text, View } from 'react-native';

// Mock component for the web to prevent bundling react-native-maps
const MockMapView = (props: any) => (
  <View {...props}>
    <View style={styles.container}>
      <Text style={styles.text}>Map is not available on the web.</Text>
    </View>
  </View>
);

const MockMarker = () => null; // Markers do nothing on the web

export { MockMapView as MapView, MockMarker as Marker };

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#e0e0e0' },
  text: { color: '#666' },
});