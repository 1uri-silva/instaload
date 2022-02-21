import { Video } from 'expo-av';
import React from 'react';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

type Props = {
  uri: string
  downloadLoad: boolean
  downloadSync: (url: string) => Promise<void>
};

export const VideoComponent: React.FC<Props> = ({ uri, downloadSync, downloadLoad }) => {
  return (
    <View style={{ marginVertical: 10, marginHorizontal: 7, alignItems: 'center' }}>
      <Video
        source={{ uri }}
        useNativeControls
        resizeMode={Video.RESIZE_MODE_CONTAIN}
        style={{ width: 300, height: 200 }}
      />

      <TouchableOpacity
        onPress={ () => downloadSync(uri)}
        style={styles.buttonLoad}
      >
        {downloadLoad ? <ActivityIndicator size='large' color='#fff'/> : <Text style={styles.text}>Download</Text>}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  buttonLoad: {
    width: 200,
    height: 50,
    marginTop: 20,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'red'
  },
  text: {
    color: '#fff',
    fontSize: 18,
    lineHeight: 20,
    fontWeight: '600'
  }
});