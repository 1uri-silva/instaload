import React from 'react';
import { ActivityIndicator, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

type Props = {
  uri: string
  downloadLoad: boolean
  downloadSync: (url: string) => Promise<void>
};
export const ImageComponent: React.FC<Props> = ({ uri, downloadSync, downloadLoad }) => {

  return (
    <View style={{ marginVertical: 10, marginHorizontal: 7, alignItems: 'center' }}>
      <Image
        source={{ uri }}
        style={{ width: 300, height: 200, borderRadius: 5 }}
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
  buttonPlay: {
    width: 200,
    height: 50,
    marginTop: 50,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'blue'
  },
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