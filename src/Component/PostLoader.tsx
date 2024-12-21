import React, { useEffect, useRef } from 'react';
import { View, Animated, Easing, Dimensions, Image, StyleSheet } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

const { width, height } = Dimensions.get('window');

const LoadingPost = () => {
  // Animation values
  const bounceAnim = useRef(new Animated.Value(0)).current;
  const shadowAnim = useRef(new Animated.Value(0)).current;
  const loadingAnims = useRef([
    new Animated.Value(0),
    new Animated.Value(0),
    new Animated.Value(0),
    new Animated.Value(0)
  ]).current;

  useEffect(() => {
    // Bounce animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(bounceAnim, {
          toValue: 1,
          duration: 1000,
          easing: Easing.bezier(0.4, 0, 0.2, 1),
          useNativeDriver: true,
        }),
        Animated.timing(bounceAnim, {
          toValue: 0,
          duration: 1000,
          easing: Easing.bezier(0.4, 0, 0.2, 1),
          useNativeDriver: true,
        })
      ])
    ).start();

    // Shadow animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(shadowAnim, {
          toValue: 1,
          duration: 1000,
          easing: Easing.bezier(0.4, 0, 0.2, 1),
          useNativeDriver: true,
        }),
        Animated.timing(shadowAnim, {
          toValue: 0,
          duration: 1000,
          easing: Easing.bezier(0.4, 0, 0.2, 1),
          useNativeDriver: true,
        })
      ])
    ).start();

    // Loading bars animation
    const loadingSequence = loadingAnims.map(anim =>
      Animated.loop(
        Animated.sequence([
          Animated.timing(anim, {
            toValue: 1,
            duration: 1000,
            easing: Easing.bezier(0.4, 0, 0.2, 1),
            useNativeDriver: true,
          }),
          Animated.timing(anim, {
            toValue: 0,
            duration: 1000,
            easing: Easing.bezier(0.4, 0, 0.2, 1),
            useNativeDriver: true,
          })
        ])
      )
    );

    // Start loading animations with stagger
    Animated.stagger(200, loadingSequence).start();

    return () => {
      // Cleanup animations
      bounceAnim.stopAnimation();
      shadowAnim.stopAnimation();
      loadingAnims.forEach(anim => anim.stopAnimation());
    };
  }, []);

  const translateY = bounceAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -20]
  });

  const shadowScale = shadowAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.8, 1.2]
  });

  const shadowOpacity = shadowAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.5, 0.2]
  });

  return (
    <View style={styles.container}>
      {/* Main background gradient */}
      <LinearGradient
        colors={['#160919', '#302433', '#3E373F']}
        locations={[0, 0.4, 1]}
        style={styles.backgroundGradient}
      />

      {/* Bottom overlay gradient */}
      <LinearGradient
        colors={['rgba(0,0,0,0)', '#000000']}
        locations={[0, 0.799]}
        style={styles.bottomOverlay}
      />

      {/* Content container */}
      <View style={styles.contentContainer}>
        {/* Logo Container with Shadow */}
        <View style={styles.logoContainer}>
          <Animated.View
            style={[
              styles.shadow,
              {
                transform: [{ scale: shadowScale }],
                opacity: shadowOpacity,
              }
            ]}
          />
          <Animated.View
            style={[
              styles.logoWrapper,
              {
                transform: [{ translateY }]
              }
            ]}
          >
            <Image 
              source={require('../../Assets/loader.png')}
              style={styles.logo}
              resizeMode="contain"
            />
          </Animated.View>
        </View>

        {/* Loading Bars */}
        <View style={styles.loadingBarsContainer}>
          {[100, 85, 70, 45].map((barWidth, index) => (
            <View key={index} style={styles.barBackground}>
              <Animated.View
                style={[
                  styles.bar,
                  {
                    width: `${barWidth}%`,
                    opacity: loadingAnims[index].interpolate({
                      inputRange: [0, 1],
                      outputRange: [0.5, 1]
                    })
                  }
                ]}
              />
            </View>
          ))}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: width,
    height: height,
  },
  backgroundGradient: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  bottomOverlay: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    height: 280,
  },
  contentContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoContainer: {
    marginBottom: 64,
  },
  shadow: {
    position: 'absolute',
    bottom: -4,
    left: 16,
    right: 16,
    height: 6,
    backgroundColor: 'black',
    borderRadius: 3,
  },
  logoWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 120,
    height: 120,
  },
  loadingBarsContainer: {
    position: 'absolute',
    bottom: 128,
    width: width * 0.7,
  },
  barBackground: {
    height: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 4,
    marginBottom: 16,
    overflow: 'hidden',
  },
  bar: {
    height: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 4,
  },
});

export default LoadingPost;