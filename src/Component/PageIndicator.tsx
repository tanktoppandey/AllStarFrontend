import React from 'react';
import { View, Text, Animated, Dimensions } from 'react-native';
import Svg, { Circle } from 'react-native-svg';

const { width } = Dimensions.get('window');
const AnimatedCircle = Animated.createAnimatedComponent(Circle);

interface PageIndicatorProps {
  currentPage: number;
  totalPages: number;
  animValue: Animated.Value;
}

const PageIndicator: React.FC<PageIndicatorProps> = ({ currentPage, totalPages, animValue }) => {
  const size = 48;
  const strokeWidth = 2;
  const center = size / 2;
  const radius = size / 2 - strokeWidth / 2;
  const circumference = 2 * Math.PI * radius;

  // Create the progress animation based on scroll
  const progressAnimation = animValue.interpolate({
    inputRange: Array.from({ length: totalPages }, (_, i) => i * width),
    outputRange: Array.from({ length: totalPages }, (_, i) => 
      circumference - ((i + 1) * (circumference / totalPages))
    ),
    extrapolate: 'clamp'
  });

  return (
    <View className="flex-row items-center">
      <View className="relative w-12 h-12 justify-center items-center">
        <Svg width={size} height={size} style={{ transform: [{ rotate: '-90deg' }] }}>
          {/* Background circle */}
          <Circle
            cx={center}
            cy={center}
            r={radius}
            stroke="rgba(255, 255, 255, 0.3)"
            strokeWidth={strokeWidth}
            fill="transparent"
          />
          
          {/* Animated progress circle */}
          <AnimatedCircle
            cx={center}
            cy={center}
            r={radius}
            stroke="#FFD700"
            strokeWidth={strokeWidth}
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={progressAnimation}
            strokeLinecap="round"
          />
        </Svg>
        
        {/* Center text */}
        <View className="absolute">
          <Text className="text-white text-sm font-medium">
            {`${currentPage + 1}/${totalPages}`}
          </Text>
        </View>
      </View>

      <View className="flex-row items-center ml-3">
        {Array.from({ length: totalPages }).map((_, i) => {
          const inputRange = [(i - 1) * width, i * width, (i + 1) * width];
          
          const scale = animValue.interpolate({
            inputRange,
            outputRange: [0.8, 1, 0.8],
            extrapolate: 'clamp',
          });
          
          const dotWidth = animValue.interpolate({
            inputRange,
            outputRange: [6, 24, 6],
            extrapolate: 'clamp',
          });

          const opacity = animValue.interpolate({
            inputRange,
            outputRange: [0.3, 1, 0.3],
            extrapolate: 'clamp',
          });

          return (
            <Animated.View
              key={i}
              className="h-1.5 rounded-full mx-0.5 bg-[#FFD700]"
              style={{
                width: dotWidth,
                opacity,
                transform: [{ scale }]
              }}
            />
          );
        })}
      </View>
    </View>
  );
};

export default PageIndicator;