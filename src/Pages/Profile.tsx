// ProfileScreen.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Modal,
  ScrollView,
} from 'react-native';
import { Svg, Circle } from 'react-native-svg';
import { ChevronLeft, ChevronRight, Pencil } from 'lucide-react-native';
import { NavigationProp } from '@react-navigation/native';

type RootStackParamList = {
  Profile: undefined;
  [key: string]: undefined | object;
};

interface Props {
  navigation: NavigationProp<RootStackParamList>;
}

interface DayType {
  day: number;
  isCurrentMonth: boolean;
}

type DatePickerView = 'date' | 'month' | 'year';

const MONTHS = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
];

const WEEK_DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const ProfileScreen: React.FC<Props> = ({ navigation }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    dateOfBirth: '',
    gender: '',
  });

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [pickerView, setPickerView] = useState<DatePickerView>('date');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const generateYears = () => {
    const currentYear = new Date().getFullYear();
    const years: number[] = [];
    for (let i = currentYear - 100; i <= currentYear; i++) {
      years.push(i);
    }
    return years;
  };

  const getDaysInMonth = (date: Date): DayType[] => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDay = new Date(year, month, 1).getDay();
    
    const days: DayType[] = [];
    const previousMonth = new Date(year, month, 0);
    const daysInPreviousMonth = previousMonth.getDate();
    
    // Previous month days
    for (let i = firstDay - 1; i >= 0; i--) {
      days.push({
        day: daysInPreviousMonth - i,
        isCurrentMonth: false
      });
    }
    
    // Current month days
    for (let i = 1; i <= daysInMonth; i++) {
      days.push({
        day: i,
        isCurrentMonth: true
      });
    }
    
    // Next month days
    const remainingDays = 42 - days.length;
    for (let i = 1; i <= remainingDays; i++) {
      days.push({
        day: i,
        isCurrentMonth: false
      });
    }
    
    return days;
  };

  const handleDateSelect = (day: DayType) => {
    if (day.isCurrentMonth) {
      const newDate = new Date(currentMonth);
      newDate.setDate(day.day);
      setSelectedDate(newDate);
      const formattedDate = `${String(day.day).padStart(2, '0')}-${String(currentMonth.getMonth() + 1).padStart(2, '0')}-${currentMonth.getFullYear()}`;
      setFormData({
        ...formData,
        dateOfBirth: formattedDate
      });
    }
  };

  const closeDatePicker = () => {
    setShowDatePicker(false);
    setPickerView('date');
  };

  const renderDatePickerContent = () => {
    switch (pickerView) {
      case 'year':
        return (
          <View className="bg-[#1A1A2E] rounded-xl w-[320px] p-4">
            <TouchableOpacity 
              className="flex-row items-center mb-4"
              onPress={() => setPickerView('date')}
            >
              <ChevronLeft color="white" size={24} />
              <Text className="text-white text-lg ml-2">Select Year</Text>
            </TouchableOpacity>
            
            <ScrollView className="h-[300px]">
              <View className="flex-row flex-wrap justify-between">
                {generateYears().reverse().map((year) => (
                  <TouchableOpacity
                    key={year}
                    onPress={() => {
                      const newDate = new Date(currentMonth);
                      newDate.setFullYear(year);
                      setCurrentMonth(newDate);
                      setPickerView('month');
                    }}
                    className={`w-[70px] h-[40px] justify-center items-center m-1 rounded-lg
                      ${currentMonth.getFullYear() === year ? 'bg-[#FFD700]' : ''}`}
                  >
                    <Text className={`${
                      currentMonth.getFullYear() === year ? 'text-black' : 'text-white'
                    }`}>
                      {year}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
          </View>
        );

      case 'month':
        return (
          <View className="bg-[#1A1A2E] rounded-xl w-[320px] p-4">
            <TouchableOpacity 
              className="flex-row items-center mb-4"
              onPress={() => setPickerView('year')}
            >
              <ChevronLeft color="white" size={24} />
              <Text className="text-white text-lg ml-2">
                {currentMonth.getFullYear()}
              </Text>
            </TouchableOpacity>
            
            <View className="flex-row flex-wrap justify-between">
              {MONTHS.map((month, index) => (
                <TouchableOpacity
                  key={month}
                  onPress={() => {
                    const newDate = new Date(currentMonth);
                    newDate.setMonth(index);
                    setCurrentMonth(newDate);
                    setPickerView('date');
                  }}
                  className={`w-[70px] h-[40px] justify-center items-center m-1 rounded-lg
                    ${currentMonth.getMonth() === index ? 'bg-[#FFD700]' : ''}`}
                >
                  <Text className={`${
                    currentMonth.getMonth() === index ? 'text-black' : 'text-white'
                  }`}>
                    {month}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        );

      default:
        return (
          <View className="bg-[#1A1A2E] rounded-xl w-[320px] p-4">
            <TouchableOpacity 
              className="flex-row justify-between items-center mb-4"
              onPress={() => setPickerView('month')}
            >
              <Text className="text-white text-lg">
                {`${MONTHS[currentMonth.getMonth()]} ${currentMonth.getFullYear()}`}
              </Text>
              <ChevronRight color="white" size={24} />
            </TouchableOpacity>

            <View className="flex-row justify-between mb-2">
              {WEEK_DAYS.map((day) => (
                <Text key={day} className="text-gray-400 text-center w-8">
                  {day}
                </Text>
              ))}
            </View>

            <View className="flex-row flex-wrap">
              {getDaysInMonth(currentMonth).map((day, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => handleDateSelect(day)}
                  className={`w-8 h-8 justify-center items-center m-0.5 rounded-lg
                    ${day.isCurrentMonth ? 
                      selectedDate.getDate() === day.day && 
                      selectedDate.getMonth() === currentMonth.getMonth() ? 
                        'bg-[#FFD700]' : '' : 
                      'opacity-30'}`}
                >
                  <Text 
                    className={`${
                      selectedDate.getDate() === day.day && 
                      selectedDate.getMonth() === currentMonth.getMonth() ? 
                        'text-black' : 'text-white'
                    }`}
                  >
                    {day.day}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <View className="flex-row justify-between mt-4">
              <TouchableOpacity 
                onPress={closeDatePicker}
                className="px-4 py-2"
              >
                <Text className="text-white">Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                onPress={closeDatePicker}
                className="bg-[#FFD700] px-4 py-2 rounded-lg"
              >
                <Text className="text-black font-semibold">Apply</Text>
              </TouchableOpacity>
            </View>
          </View>
        );
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-black">
      <StatusBar barStyle="light-content" />
      
      {/* Header */}
      <View className="flex-row items-center px-4 pt-2">
        <TouchableOpacity 
          className="p-2"
          onPress={() => navigation.goBack()}
        >
          <ChevronLeft color="white" size={24} />
        </TouchableOpacity>
        <Text className="text-white text-xl ml-4">Profile</Text>
      </View>

      {/* Profile Image */}
      <View className="items-center mt-5">
        <Svg height="120" width="120">
          <Circle
            cx="60"
            cy="60"
            r="58"
            stroke="#FFD700"
            strokeWidth="2"
            fill="#3E2B42"
          />
        </Svg>
        <TouchableOpacity className="absolute right-[35%] bottom-0 bg-[#FFD700] w-6 h-6 rounded-full justify-center items-center">
          <Pencil color="black" size={14} />
        </TouchableOpacity>
      </View>

      {/* User ID */}
      <Text className="text-white text-lg text-center mt-4">913167893</Text>

      {/* Form Fields */}
      <View className="px-4 mt-6">
        <View className="mb-5">
          <Text className="text-white text-base mb-2">Enter your Full Name</Text>
          <TextInput
            className="bg-[#3E2B42] rounded-lg p-4 text-white text-base"
            placeholder="e.g. John Snow"
            placeholderTextColor="#666"
            value={formData.fullName}
            onChangeText={(text) => setFormData({ ...formData, fullName: text })}
          />
        </View>

        <View className="mb-5">
          <Text className="text-white text-base mb-2">Enter your Email Id</Text>
          <TextInput
            className="bg-[#3E2B42] rounded-lg p-4 text-white text-base"
            placeholder="e.g. johnsnow123@gmail.com"
            placeholderTextColor="#666"
            value={formData.email}
            onChangeText={(text) => setFormData({ ...formData, email: text })}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        <View className="mb-5">
          <Text className="text-white text-base mb-2">Enter your Date Of Birth</Text>
          <TouchableOpacity 
            className="bg-[#3E2B42] rounded-lg p-4"
            onPress={() => setShowDatePicker(true)}
          >
            <Text className={`text-base ${formData.dateOfBirth ? 'text-white' : 'text-gray-500'}`}>
              {formData.dateOfBirth || 'e.g. 02-09-1999'}
            </Text>
          </TouchableOpacity>
        </View>

        <View className="mb-5">
          <Text className="text-white text-base mb-2">Select your Gender</Text>
          <TouchableOpacity className="bg-[#3E2B42] rounded-lg p-4">
            <Text className="text-gray-500 text-base">e.g. Female</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Date Picker Modal */}
      <Modal
        visible={showDatePicker}
        transparent={true}
        animationType="fade"
        statusBarTranslucent
      >
        <View className="flex-1 justify-center items-center bg-black/50">
          {renderDatePickerContent()}
        </View>
      </Modal>

      {/* Done Button */}
      <TouchableOpacity className="bg-[#FFD700] mx-4 p-4 rounded-3xl absolute bottom-8 left-0 right-0">
        <Text className="text-black text-base text-center font-semibold">
          Done
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default ProfileScreen;