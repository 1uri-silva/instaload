import LottieView from 'lottie-react-native';
import React, { useEffect, useState } from 'react';
import empty from '../../assets/empty.json';

export const Empty: React.FC = () => {
  const [play, setPlay] = useState(false);

  useEffect(() => {
    setPlay(false)
  }, []);

  return <LottieView
    source={empty}
    autoPlay={play}
    style={{
      width: 400,
      height: 400,
    }}
  />
}
