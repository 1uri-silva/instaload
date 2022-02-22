import axios from 'axios';
import * as FileSystem from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library';
import * as Notifications from 'expo-notifications';
import React, { StatusBar } from 'expo-status-bar';
import * as update from 'expo-updates';
import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Alert, FlatList, StyleSheet, View } from 'react-native';
import { Empty } from './src/components/empty';
import { Header } from './src/components/header';
import { ImageComponent } from './src/components/image';
import { VideoComponent } from './src/components/video';

type NodeDisplayContent = {
  node: {
    __typename: 'GraphImage' | 'GraphSidecar' | 'GraphVideo'
    id: string
    display_url: string
    video_url: string
  }
}

export type StateResource = {
  graphql: {
    user: {
      biography: string
      profile_pic_url: string
      username: string
      edge_owner_to_timeline_media: {
        count: number
        edges: Array<NodeDisplayContent>
      }
    }
  }
};

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

export default function App() {

  const [progressDownload, setProgressDownload] = useState(false)
  const [loading, setLoading] = useState({
    load: false,
    message: ''
  })
  const [infoResource, setInfoResource] = useState<StateResource | null>(null)
  const [status, requestPermission] = MediaLibrary.usePermissions();

  useEffect(() => {
    (async () => {
      if (!status?.granted) {
        await requestPermission()
      }
    }) ()
  }, [status])

  useEffect(() => {
    (async () => {
      const updateCheck = await update.checkForUpdateAsync();
      if(updateCheck.isAvailable) {
        await update.fetchUpdateAsync();
        await update.reloadAsync();
      }
    }) ()
  }, [])

  const getUrl = useCallback(async (uriInstagram: string) => {
    setLoading({
      load: true,
      message: 'Iniciando download'
    })
    const urlRequest = `https://www.instagram.com/${uriInstagram}/?__a=1`;
    try {
      const { data } = await axios.get<StateResource>(urlRequest)

      if (data) {
        setLoading({
          load: false,
          message: 'Download concluído'
        })
        setInfoResource(data)
      }
    } catch (error) {
      Alert.alert('Alert', 'User is not found')
      setLoading({
        load: false,
        message: ''
      })
      setInfoResource(null)
    }
 
  },[])

  async function registerForPushNotificationsAsync(title: string, file: string) {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: title,
        body: file,
        subtitle: 'Download conclued',
        // sound: 'mySoundFile.wav', // Provide ONLY the base filename
      },
      trigger: {
        seconds: 2,
        channelId: 'new-download',
      },
    })
  }
  const downloadSync = useCallback(async (url: string) => {
    if (!status?.granted) {
      await requestPermission()
    }
    setProgressDownload(true)
    const replace = url.match(/\.([^\./\?]+)($|\?)/)[1]
    const file = `${Math.random()}.${replace}`
    const fileLocation = FileSystem.documentDirectory + file;
    const { uri } = await FileSystem.downloadAsync(url, fileLocation)
    await MediaLibrary.createAssetAsync(uri)
    setProgressDownload(false)
    registerForPushNotificationsAsync(loading.message, file)
  }, []);

  return (
    <View style={styles.container}>
      <Header getUrl={getUrl}/>
      {loading.load && !infoResource ?
        <ActivityIndicator size='large' color='#dedede'/>
        : (
          <FlatList
            data={infoResource?.graphql.user.edge_owner_to_timeline_media.edges}
            keyExtractor={item => item.node.id}
            ListEmptyComponent={<Empty />}
            renderItem={({ item }) => {
              return (
                item.node.__typename  === 'GraphImage' || item.node.__typename  === 'GraphSidecar' ? (
                  <ImageComponent
                    uri={item.node.display_url}
                    key={item.node.id}
                    downloadLoad={progressDownload}
                    downloadSync={() => downloadSync(item.node.display_url)}
                  />
                ) : (
                  <VideoComponent
                    uri={item.node.video_url}
                    key={item.node.id}
                    downloadLoad={progressDownload}
                    downloadSync={() => downloadSync(item.node.video_url)}
                  />
                )
              )
            }}
            contentContainerStyle={{
              width: '100%',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          />
        )}
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    // alignItems: 'center',
  },
});
