import { AntDesign } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Keyboard, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

type Props = {
  getUrl: (uri: string) => void
};

export const Header: React.FC<Props> = ({ getUrl }) => {
  const [uri, setUri] = useState('');

  return (
    <View style={[styles.container, , {
      marginTop: StatusBar?.currentHeight
    }]}>
      <Text style={styles.textTitle}>Download Image/Video Instagram</Text>

      <View style={styles.content}>
        <TextInput
          value={uri}
          placeholder='Enter your user instagram'
          placeholderTextColor='#000'
          autoCompleteType='off'
          autoCapitalize='none'
          onChangeText={ e => setUri(e)}
          style={styles.input}
          />
        <TouchableOpacity
          style={styles.button}
          onPress={ () => {
            getUrl(uri);
            setUri('');
            Keyboard.dismiss();
          } }
        >
        <AntDesign name="arrowdown" size={20} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 200,
    width: '100%',
    padding: 15,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'purple',
  },
  textTitle: {
    fontSize: 20,
    color: '#fff',
    lineHeight: 25,
    fontWeight: '600',
  },
  content: {
    width: '100%',
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  input: {
    height: 50,
    padding: 10,
    width: '80%',
    marginTop: 20,
    borderRadius: 8,
    backgroundColor: '#fff',
  },
  button: {
    width: 50,
    height: 50,
    padding: 10,
    marginTop: 20,
    marginLeft: 8,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'blue',
  }
})