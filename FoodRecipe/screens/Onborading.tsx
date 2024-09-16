import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, FlatList, TouchableOpacity, Dimensions } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/StackNavigator';
import { Ionicons } from '@expo/vector-icons'; // For using icons

type OnboardingScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Onboarding'>;

type Props = {
  navigation: OnboardingScreenNavigationProp;
};

const { width, height } = Dimensions.get('window');

const slides = [
    { 
      id: 1, 
      image: require('../assets/images/image1.jpg'), 
      heading: 'Discover Nutritious \nRecipes for Every Need', 
      text: 'No matter your health goal, we have a recipe to fit your needs. Discover healthy options for every lifestyle.' 
    },
    { 
      id: 2, 
      image: require('../assets/images/image2.jpg'), 
      heading: 'Find Your Ideal \nRecipe with Ease', 
      text: 'Browse through our extensive collection of recipes and find the perfect dish for any occasion.' 
    },
    { 
      id: 3, 
      image: require('../assets/images/image3.jpg'), 
      heading: 'Become a Cooking \nExpert in No Time', 
      text: 'With our easy-to-follow recipes and expert tips, cooking has never been more enjoyable. Become a kitchen pro!' 
    },
  ];
  
export default function OnboardingScreen({ navigation }: Props) {
  const [currentSlide, setCurrentSlide] = useState<number>(0);

  const renderSlide = ({ item }: { item: { image: any; heading: string; text: string } }) => (
    <View style={styles.slide}>
      <View style={styles.imageContainer}>
        <Image source={item.image} style={styles.image} />
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.heading}>{item.heading}</Text>
        <Text style={styles.paragraph}>{item.text}</Text>
        {currentSlide === slides.length - 1 ? (
          <TouchableOpacity onPress={() => navigation.navigate('Login')} style={styles.button}>
            <Text style={styles.buttonText}>Get Started</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity onPress={() => setCurrentSlide(currentSlide + 1)} style={styles.button}>
            <Ionicons name="arrow-forward-circle" size={32} color="white" />
          </TouchableOpacity>
        )}
      </View>
      <View style={styles.pagination}>
        {slides.map((_, index) => (
          <View
            key={index}
            style={[
              styles.dot,
              { backgroundColor: index === currentSlide ? '#fff' : '#f6c559' },
            ]}
          />
        ))}
      </View>
    </View>
  );

  return (
    <FlatList
      data={slides}
      renderItem={renderSlide}
      horizontal
      pagingEnabled
      showsHorizontalScrollIndicator={false}
      keyExtractor={(item) => item.id.toString()}
      onMomentumScrollEnd={(event) => {
        const index = Math.floor(event.nativeEvent.contentOffset.x / event.nativeEvent.layoutMeasurement.width);
        setCurrentSlide(index);
      }}
    />
  );
}

const styles = StyleSheet.create({
  slide: {
    width,
    height,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative', // Ensure that pagination is correctly positioned
  },
  imageContainer: {
    width: width * 0.6,
    height: width * 0.6,
    backgroundColor: '#f6c559',
    borderRadius: (width * 0.6) / 2, // To make it a circle
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    borderWidth: 10,
    borderColor: '#f6c559',
    position: 'absolute',
    top: height * 0.1, // Adjust position to be at the top
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  textContainer: {
    marginTop: height * 0.4, // Adjust margin to push text below the image
    marginHorizontal: 20,
    alignItems: 'center',
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 10,
  },
  paragraph: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#f6c559',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
    marginBottom: 10,
    alignItems: 'center',
    width: width * 0.6, // Increase width of the button
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  pagination: {
    flexDirection: 'row',
    position: 'absolute',
    top: height * 0.3, // Position dots just above the paragraph text
    alignSelf: 'center',
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginHorizontal: 4,
  },
});
