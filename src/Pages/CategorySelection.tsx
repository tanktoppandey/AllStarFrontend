import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  ImageSourcePropType,
} from 'react-native';
import { NavigationProp } from '@react-navigation/native';

// Import RootStackParamList from App
import { RootStackParamList } from '../../App';

// Define types for the sports images
type SportsImages = {
  [key: string]: ImageSourcePropType;
};

// Define types for navigation prop
type Props = {
  navigation: NavigationProp<RootStackParamList>;
};

// Define types for InterestCard props
interface InterestCardProps {
  title: string;
  image: ImageSourcePropType;
  onPress: (interest: string) => void;
  isSelected: boolean;
}

// Import images from assets folder
const sports: SportsImages = {
  football: require('../../Assets/category/football.png'),
  cricket: require('../../Assets/category/cricket.png'),
  esports: require('../../Assets/category/esports.png'),
  kabaddi: require('../../Assets/category/kabbadi.png'),
  mma: require('../../Assets/category/MMA.png'),
  motorsports: require('../../Assets/category/motorsport.png'),
};

const InterestCard: React.FC<InterestCardProps> = ({ title, image, onPress, isSelected }) => (
  <TouchableOpacity
    style={[styles.card, isSelected && styles.selectedCard]}
    onPress={() => onPress(title.toLowerCase())}
  >
    <Image source={image} style={styles.cardImage} />
    <Text style={styles.cardTitle}>{title}</Text>
  </TouchableOpacity>
);

const InterestScreen: React.FC<Props> = ({ navigation }) => {
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);

  const toggleInterest = (interest: string): void => {
    setSelectedInterests(prev => 
      prev.includes(interest)
        ? prev.filter(item => item !== interest)
        : [...prev, interest]
    );
  };

  const handleContinue = (): void => {
    if (selectedInterests.length > 0) {
      // You might want to store the selected interests somewhere (e.g., Redux, Context, AsyncStorage)
      // before navigating to the Feed screen
      navigation.navigate('NewsFeed');
    }
  };

  const handleSkip = (): void => {
    navigation.navigate('NewsFeed');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <View style={styles.header}>
        <Text style={styles.title}>Select your Interest</Text>
        <TouchableOpacity onPress={handleSkip}>
          <Text style={styles.skipButton}>Skip</Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.subtitle}>Pick at least one or more...</Text>
      
      <View style={styles.gridContainer}>
        <View style={styles.row}>
          <InterestCard
            title="Football"
            image={sports.football}
            onPress={toggleInterest}
            isSelected={selectedInterests.includes('football')}
          />
          <InterestCard
            title="Cricket"
            image={sports.cricket}
            onPress={toggleInterest}
            isSelected={selectedInterests.includes('cricket')}
          />
        </View>
        <View style={styles.row}>
          <InterestCard
            title="Esports"
            image={sports.esports}
            onPress={toggleInterest}
            isSelected={selectedInterests.includes('esports')}
          />
          <InterestCard
            title="Kabaddi"
            image={sports.kabaddi}
            onPress={toggleInterest}
            isSelected={selectedInterests.includes('kabaddi')}
          />
        </View>
        <View style={styles.row}>
          <InterestCard
            title="MMA"
            image={sports.mma}
            onPress={toggleInterest}
            isSelected={selectedInterests.includes('mma')}
          />
          <InterestCard
            title="Motorsports"
            image={sports.motorsports}
            onPress={toggleInterest}
            isSelected={selectedInterests.includes('motorsports')}
          />
        </View>
      </View>

      <TouchableOpacity
        style={[
          styles.continueButton,
          selectedInterests.length === 0 && styles.disabledButton
        ]}
        onPress={handleContinue}
        disabled={selectedInterests.length === 0}
      >
        <Text style={styles.continueButtonText}>Continue</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  skipButton: {
    fontSize: 16,
    color: '#FFD700',
  },
  subtitle: {
    fontSize: 16,
    color: '#808080',
    marginTop: 8,
    marginBottom: 24,
  },
  gridContainer: {
    flex: 1,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  card: {
    width: '48%',
    aspectRatio: 1,
    borderRadius: 12,
    overflow: 'hidden',
    position: 'relative',
  },
  selectedCard: {
    borderWidth: 2,
    borderColor: '#FFD700',
  },
  cardImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  cardTitle: {
    position: 'absolute',
    bottom: 12,
    left: 12,
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  continueButton: {
    backgroundColor: '#FFD700',
    paddingVertical: 16,
    borderRadius: 25,
    alignItems: 'center',
    marginBottom: 20,
  },
  disabledButton: {
    backgroundColor: '#3D3D3D',
  },
  continueButtonText: {
    color: '#000000',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default InterestScreen;