import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  SafeAreaView,
} from 'react-native';
import { NavigationProp } from '@react-navigation/native';
import { RootStackParamList } from '../../App';

type Props = {
  navigation: NavigationProp<RootStackParamList>;
};

const LoginScreen: React.FC<Props> = ({ navigation }) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isLogin, setIsLogin] = useState(true);

  const handleSendOTP = () => {
    // For now, just navigate to NewsFeed
    navigation.navigate('Category');
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
  };

  return (
    <SafeAreaView className="flex-1 bg-[#1A1A1A] p-5">
      {/* Logo */}
      <Image
        source={require('../../Assets/logo.png')}
        className="w-24 h-24 self-start mt-5"
        resizeMode="contain"
      />
      
      <Text className="text-white text-lg font-bold mt-2">
        ALL STARS
      </Text>

      {/* Welcome Text */}
      <View className="mt-10">
        <Text className="text-white text-3xl font-bold">
          Hey, Welcome!
        </Text>
        
        <View className="flex-row items-center mt-2">
          <Text className="text-gray-400 text-base">
            {isLogin ? 'Already have an Account?' : "Don't have an Account?"}
          </Text>
          <TouchableOpacity onPress={toggleMode}>
            <Text className="text-[#FFD700] text-base font-bold ml-2">
              {isLogin ? 'Login' : 'Signup'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Phone Input */}
      <View className="mt-10">
        <Text className="text-white text-lg mb-2">
          Enter Phone Number
        </Text>
        <TextInput
          className="bg-white/10 rounded-lg p-4 text-white text-base"
          placeholder="+91 XXXXXXXXXX"
          placeholderTextColor="#666"
          keyboardType="phone-pad"
          value={phoneNumber}
          onChangeText={setPhoneNumber}
        />
      </View>

      {/* Send OTP Button */}
      <TouchableOpacity 
        className="bg-[#FFD700] rounded-full p-4 items-center mt-8"
        onPress={handleSendOTP}
      >
        <Text className="text-black text-lg font-bold">
          Send OTP
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default LoginScreen;