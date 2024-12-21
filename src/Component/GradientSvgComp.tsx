import React from 'react';
import { Animated } from 'react-native';
import Svg, { Defs, LinearGradient, Stop, Rect } from 'react-native-svg';

const AnimatedSvg = Animated.createAnimatedComponent(Svg);

interface PostGradientProps {
  expanded: boolean;
  height: number;
  textLength?: number;
  description?: string;
}

const PostGradient = ({ expanded, height, textLength, description = '' }: PostGradientProps) => {
  // Calculate base and expanded heights
  const baseHeight = height * 0.6;
  
  // Calculate dynamic expanded height based on text content
  const calculateExpandedHeight = () => {
    const baseExpandedHeight = height * 0.8;
    const averageCharPerLine = 40; // Approximate characters per line
    const approximateLines = Math.ceil(description.length / averageCharPerLine);
    
    // Add additional height for each line beyond 3 lines
    const additionalLines = Math.max(0, approximateLines - 3);
    const lineHeight = 24; // Approximate line height in pixels
    const additionalHeight = additionalLines * lineHeight;
    
    return Math.min(baseExpandedHeight + additionalHeight, height * 0.95);
  };

  const expandedHeight = calculateExpandedHeight();
  const animatedHeight = new Animated.Value(expanded ? expandedHeight : baseHeight);

  React.useEffect(() => {
    Animated.spring(animatedHeight, {
      toValue: expanded ? expandedHeight : baseHeight,
      useNativeDriver: false,
      tension: 280,
      friction: 60
    }).start();
  }, [expanded, height, expandedHeight]);

  return (
    <AnimatedSvg
      height={animatedHeight}
      width="100%"
      style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
      }}
      preserveAspectRatio="none"
    >
      <Defs>
        <LinearGradient
          id="post-overlay"
          x1="50%"
          y1="0%"
          x2="50%"
          y2="100%"
        >
          <Stop offset={0} stopOpacity={0} stopColor="#000000" />
          <Stop offset={0.35} stopOpacity={0.2} stopColor="#000000" />
          <Stop offset={0.55} stopOpacity={0.8} stopColor="#000000" />
          <Stop offset={0.6} stopOpacity={1} stopColor="#000000" />
          <Stop offset={1} stopOpacity={1} stopColor="#000000" />
        </LinearGradient>
      </Defs>
      <Rect width="100%" height="100%" fill="url(#post-overlay)" />
    </AnimatedSvg>
  );
};

export default PostGradient;