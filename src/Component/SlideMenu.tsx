import React, { useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, Animated, Dimensions, Image, ScrollView, BackHandler } from 'react-native';
import { Bell, Settings, Mic, HelpCircle, Bookmark, BarChart2, ChevronRight } from 'lucide-react-native';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../../App';

const { width } = Dimensions.get('window');
const MENU_WIDTH = width * 1;

type Props = {
  navigation: NavigationProp<RootStackParamList>;
};

interface SlideMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const SlideMenu: React.FC<SlideMenuProps> = ({ isOpen, onClose }) => {
  const navigation = useNavigation();
  const slideAnim = useRef(new Animated.Value(MENU_WIDTH)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: isOpen ? 0 : MENU_WIDTH,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: isOpen ? 1 : 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  }, [isOpen]);

  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      if (isOpen) {
        onClose();
        return true;
      }
      return false;
    });

    return () => backHandler.remove();
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <>
      <Animated.View
        className="absolute inset-0 bg-black/50 z-40"
        style={{ opacity: fadeAnim }}
      >
        <TouchableOpacity
          className="flex-1"
          onPress={onClose}
          activeOpacity={1}
        />
      </Animated.View>
      <Animated.View
        className="absolute right-0 top-0 bottom-0 bg-black z-50"
        style={{
          width: MENU_WIDTH,
          transform: [{ translateX: slideAnim }],
        }}
      >
        <ScrollView className="flex-1">
          {/* Top Section with Pattern */}
          <View className="relative">
            <View className="h-40 bg-[#1A1625]">
              <Image
                source={require('../../Assets/pattern.png')}
                className="absolute top-0 left-0 right-0 h-40 "
                resizeMode="cover"
              />
              
              {/* Profile Section */}
              <View className="px-2  fixed top-24">
                <View className="flex-row justify-between items-center">
                  {/* Profile Info */}
                  <View className="flex-row items-center space-x-4 ml-2">
                    <View className="w-28 h-28 rounded-full bg-[#201323] border border-[#3E2B42]" />
                    <View>
                      <Text className="text-white text-2xl font-medium pl-2">Profile</Text>
                      <Text className="text-gray-400 text-base pl-2">9131678393</Text>
                    </View>
                  </View>
                  
                  {/* Icons */}
                  <View className="flex-row space-x-4 mr-4 gap-2 mb-3">
                    <TouchableOpacity>
                      <Bell size={24} color="#FFFFFF" />
                    </TouchableOpacity>
                    <TouchableOpacity>
                      <Settings size={24} color="#FFFFFF" />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </View>
          </View>

          {/* Main Content */}
          <View className="px-4 mt-16">
            {/* Trending Section */}
            <View className="mb-8">
              <View className="flex-row justify-between items-center mb-4">
                <View className="flex-row items-center">
                  <Text className="text-[#FF6B00] text-2xl mr-2">🔥</Text>
                  <Text className="text-white text-2xl font-medium">Trending</Text>
                </View>
                <ChevronRight size={24} color="#FFFFFF" />
              </View>
              
              <ScrollView 
                horizontal 
                showsHorizontalScrollIndicator={false}
                className="mb-2"
              >
                <View className="flex-row space-x-4">
                  <Image
                    source={require('../../Assets/athelete.png')}
                    className="w-40 h-40 rounded-xl"
                    resizeMode="cover"
                  />
                  <Image
                    source={require('../../Assets/athelete2.png')}
                    className="w-40 h-40 rounded-xl"
                    resizeMode="cover"
                  />
                  <Image
                    source={require('../../Assets/athelete3.png')}
                    className="w-40 h-40 rounded-xl"
                    resizeMode="cover"
                  />
                </View>
              </ScrollView>
            </View>

            {/* Menu Items */}
            <TouchableOpacity className="flex-row justify-between items-center py-4 px-4 mb-3 rounded-xl bg-[#201323] border border-[#3E2B42]">
              <View className="flex-row items-center">
                <Mic size={24} color="#C7FE5F" />
                <Text className="text-white text-xl ml-3">News</Text>
              </View>
              <ChevronRight size={24} color="#FFFFFF" />
            </TouchableOpacity>

            <TouchableOpacity className="flex-row justify-between items-center py-4 px-4 mb-3 rounded-xl bg-[#201323] border border-[#3E2B42]">
              <View className="flex-row items-center">
                <HelpCircle size={24} color="#C7FE5F" />
                <Text className="text-white text-xl ml-3">Quiz</Text>
              </View>
              <ChevronRight size={24} color="#FFFFFF" />
            </TouchableOpacity>

            <TouchableOpacity className="flex-row justify-between items-center py-4 px-4 mb-3 rounded-xl bg-[#201323] border border-[#3E2B42]">
              <View className="flex-row items-center">
                <BarChart2 size={24} color="#C7FE5F" />
                <Text className="text-white text-xl ml-3">Polls</Text>
              </View>
              <ChevronRight size={24} color="#FFFFFF" />
            </TouchableOpacity>

            <TouchableOpacity className="flex-row justify-between items-center py-4 px-4 mb-3 rounded-xl bg-[#201323] border border-[#3E2B42]">
              <View className="flex-row items-center">
                <Bookmark size={24} color="#C7FE5F" />
                <Text className="text-white text-xl ml-3">Bookmarks</Text>
              </View>
              <ChevronRight size={24} color="#FFFFFF" />
            </TouchableOpacity>

            {/* Footer Menu */}
            <View className="mt-6 mb-8">
              <Text className="text-gray-500 mb-4 text-sm">OTHERS</Text>
              {['FAQs', 'About us', 'Privacy Policy', 'Terms and Conditions'].map((item, index) => (
                <TouchableOpacity key={index} className="py-2">
                  <Text className="text-white text-base">{item}</Text>
                </TouchableOpacity>
              ))}
              <TouchableOpacity className="py-2 mt-2">
                <Text className="text-red-500 text-base">Log Out</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </Animated.View>
    </>
  );
};

export default SlideMenu;