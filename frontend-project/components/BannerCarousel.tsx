import React from 'react';
import { View, Image, StyleSheet, Dimensions } from 'react-native';
import Swiper from 'react-native-swiper';

interface BannerCarouselProps {
  banners: Array<{ id: string; image: string; title: string }>;
}

const BannerCarousel: React.FC<BannerCarouselProps> = ({ banners }) => {
  return (
    <Swiper 
      style={styles.wrapper}
      showsButtons={true} // Optional: show navigation buttons
      autoplay={true}     // Optional: enable autoplay
    >
      {banners.map((banner) => (
        <View key={banner.id} style={styles.slide}>
          <Image source={{ uri: banner.image }} style={styles.image} />
        </View>
      ))}
    </Swiper>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    height: 150, // Set a fixed height for the swiper
  },
  slide: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
  },
});

export default BannerCarousel;
