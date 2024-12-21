import React, { useState, useRef, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Animated,
  StatusBar,
  FlatList,
  Easing,
  Dimensions,
  ViewToken,
} from 'react-native';
import { posts, type Post, type PostPage } from '../../contants/Data';
import { Bookmark, Heart, MessageSquare, Menu, Check, X, Send } from 'lucide-react-native';
import { HeartIcon,CommentIcon,ShareIcon,SaveIcon } from '../Component/ActionIcons';
import SlideMenu from '../Component/SlideMenu';
import PostGradient from '../Component/GradientSvgComp';
import LinearGradient from 'react-native-linear-gradient';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import PageIndicator from '../Component/PageIndicator';
import LoadingPost from '../Component/PostLoader';
import MainLoadingComponent from '../Component/MainLoader';
import ShareModal from '../Component/ShareModal';

const { width, height } = Dimensions.get('window');
const POST_HEIGHT = height * 0.96;

interface PollOption {
  id: string;
  text: string;
  votes?: number;
}

interface ViewableItemsChanged {
  viewableItems: ViewToken[];
  changed: ViewToken[];
}

interface OptionLayout {
  width: number;
  height: number;
}

const CircleProgress = ({ current, total }: { current: number; total: number }) => {
  const segmentAngle = 360 / total;
  
  return (
    <View className="relative w-12 h-12">
      <View className="absolute inset-0 w-12 h-12 rounded-full border-2 border-white/30" />
      {Array.from({ length: total }).map((_, index) => {
        const isActive = index < current;
        return (
          <View
            key={index}
            style={{
              position: 'absolute',
              width: 48,
              height: 48,
              borderRadius: 24,
              borderWidth: 2,
              borderColor: 'transparent',
              borderTopColor: isActive ? '#FFD700' : 'transparent',
              transform: [
                { rotate: `${index * segmentAngle}deg` }
              ]
            }}
          />
        );
      })}
      <View className="absolute inset-0 items-center justify-center">
        <Text className="text-white text-sm font-medium">
          {`${current}/${total}`}
        </Text>
      </View>
    </View>
  );
};

const NewsFeed: React.FC = () => {
  const [currentPages, setCurrentPages] = useState<{ [key: string]: number }>({});
  const [showDescription, setShowDescription] = useState<{ [key: string]: boolean }>({});
  const [votes, setVotes] = useState<{[key: string]: string}>({});
  const [answers, setAnswers] = useState<{[key: string]: string}>({});
  const [menuOpen, setMenuOpen] = useState(false);
  const [optionLayouts, setOptionLayouts] = useState<{ [key: string]: OptionLayout }>({});
  const [pollAnimations] = useState<{ [key: string]: { [key: string]: Animated.Value } }>({});
  const [postLoadingStatus, setPostLoadingStatus] = useState<{ [key: string]: boolean }>({});
  const [activeIcons, setActiveIcons] = useState<{ [key: string]: boolean }>({});
  
  
  const iconScaleAnimations = useRef<{ [key: string]: Animated.Value }>({}).current;
  const optionScaleAnimations = useRef<{ [key: string]: Animated.Value }>({}).current;
  const scrollX = useRef(new Animated.Value(0)).current;
  const [isLoading, setIsLoading] = useState(true);
  const [selectedSharePost, setSelectedSharePost] = useState<Post | null>(null);
  const [shareModalVisible, setShareModalVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    // Return cleanup function
    return () => {
      clearTimeout(timer);
    };
  }, []);

  const handleIconPress = useCallback((postId: string, iconType: string, post?: Post) => {
    const iconKey = `${postId}-${iconType}`;
    
    if (!iconScaleAnimations[iconKey]) {
      iconScaleAnimations[iconKey] = new Animated.Value(1);
    }
  
    Animated.sequence([
      Animated.spring(iconScaleAnimations[iconKey], {
        toValue: 0.8,
        useNativeDriver: true,
        speed: 50,
        bounciness: 12
      }),
      Animated.spring(iconScaleAnimations[iconKey], {
        toValue: 1,
        useNativeDriver: true,
        speed: 50,
        bounciness: 12
      })
    ]).start();
  
    if (iconType === 'send' && post) {
      setSelectedSharePost(post);
      setShareModalVisible(true);
    } else {
      setActiveIcons(prev => ({
        ...prev,
        [iconKey]: !prev[iconKey]
      }));
    }
  }, []);

  const handleImageLoad = useCallback((postId: string) => {
    setPostLoadingStatus(prev => ({
      ...prev,
      [postId]: true
    }));
  }, []);

  

  const getOrCreatePollAnimation = useCallback((pageId: string, optionId: string) => {
    if (!pollAnimations[pageId]) {
      pollAnimations[pageId] = {};
    }
    if (!pollAnimations[pageId][optionId]) {
      pollAnimations[pageId][optionId] = new Animated.Value(0);
    }
    return pollAnimations[pageId][optionId];
  }, [pollAnimations]);

  const animatePollResults = useCallback((pageId: string, options: PollOption[]) => {
    if (!options) return;
    
    const animations = options.map(option => {
      const anim = getOrCreatePollAnimation(pageId, option.id);
      return Animated.timing(anim, {
        toValue: option.votes || 0,
        duration: 1200,
        easing: Easing.bezier(0.4, 0.0, 0.2, 1),
        useNativeDriver: false,
      });
    });
    
    Animated.stagger(150, animations).start();
  }, [getOrCreatePollAnimation]);

  const getOrCreateOptionScaleAnimation = useCallback((optionId: string) => {
    if (!optionScaleAnimations[optionId]) {
      optionScaleAnimations[optionId] = new Animated.Value(1);
    }
    return optionScaleAnimations[optionId];
  }, []);

  const handlePageChange = useCallback((postId: string, offset: number) => {
    const pageIndex = Math.round(offset / width);
    setCurrentPages(prev => ({ ...prev, [postId]: pageIndex }));
  }, []);

  const handleOptionLayout = useCallback((pageId: string, optionId: string, layout: OptionLayout) => {
    setOptionLayouts(prev => ({
      ...prev,
      [`${pageId}-${optionId}`]: layout
    }));
  }, []);

  const toggleDescription = useCallback((postId: string) => {
    setShowDescription(prev => ({
      ...prev,
      [postId]: !prev[postId]
    }));
  }, []);

  const renderPageContent = useCallback((page: PostPage, postId: string) => {
    const isDescriptionVisible = showDescription[postId];

    switch (page.type) {
      case 'normal':
        return (
          <View>
            <Text 
              className="text-white leading-6 opacity-90 mb-2 text-base"
              numberOfLines={isDescriptionVisible ? undefined : 2}
            >
              {page.description}
            </Text>
            <TouchableOpacity 
              onPress={() => toggleDescription(postId)}
              hitSlop={{ top: 10, bottom: 10 }}
            >
              <Text className="text-[#FFD700] text-sm font-semibold">
                {isDescriptionVisible ? 'Show less' : 'Read more'}
              </Text>
            </TouchableOpacity>
          </View>
        );

      case 'poll':
        return (
          <View className="w-full -mx-5 ml-0">
            <View className="w-screen px-4">
              <View className="py-4">
                <View className="self-start bg-[#FFD700] px-3 py-1.5 rounded-2xl mb-4">
                  <Text className="text-black font-semibold text-sm">Poll</Text>
                </View>
                <Text className="text-white text-2xl mb-6 font-bold">{page.question}</Text>
                {page.options?.map(option => {
                  const isVoted = votes[page.id] !== undefined;
                  const animation = getOrCreatePollAnimation(page.id, option.id);
                  const scaleAnimation = getOrCreateOptionScaleAnimation(option.id);
                  const layout = optionLayouts[`${page.id}-${option.id}`];
          
                  return (
                    <Animated.View
                      key={option.id}
                      style={{
                        transform: [{
                          scale: scaleAnimation
                        }]
                      }}
                    >
                      <TouchableOpacity
                        onPress={() => {
                          if (!isVoted && page.options) {
                            Animated.sequence([
                              Animated.spring(scaleAnimation, {
                                toValue: 0.95,
                                useNativeDriver: true,
                                speed: 50,
                                bounciness: 12
                              }),
                              Animated.spring(scaleAnimation, {
                                toValue: 1,
                                useNativeDriver: true,
                                speed: 50,
                                bounciness: 12
                              })
                            ]).start();

                            setVotes(prev => ({ ...prev, [page.id]: option.id }));
                            animatePollResults(page.id, page.options);
                          }
                        }}
                        onLayout={(e) => {
                          handleOptionLayout(page.id, option.id, {
                            width: e.nativeEvent.layout.width,
                            height: e.nativeEvent.layout.height
                          });
                        }}
                        className="relative mb-3 last:mb-0 w-full"
                      >
                        <View className="p-2 rounded-full mt-2 relative border border-white/20">
                          {isVoted && layout && (
                            <Animated.View
                              style={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                bottom: 0,
                                borderTopLeftRadius: 9999,
                                borderBottomLeftRadius: 9999,
                                overflow: 'hidden',
                                width: animation.interpolate({
                                  inputRange: [0, 100],
                                  outputRange: [0, layout.width - 10],
                                }),
                              }}
                            >
                              {votes[page.id] === option.id ? (
                                <LinearGradient
                                  start={{x: 0, y: 0}}
                                  end={{x: 1, y: 0}}
                                  colors={['#FFD20599', '#FFD20533']}
                                  style={{ flex: 1 }}
                                />
                              ) : (
                                <View className="absolute inset-0 bg-white/20" />
                              )}
                            </Animated.View>
                          )}
                          <View className="flex-row justify-between items-center relative z-10">
                            <Text className={`${votes[page.id] === option.id ? 'text-white' : 'text-white'} font-medium text-lg`}>
                              {option.text}
                            </Text>
                            {isVoted && (
                              <Text className={`${votes[page.id] === option.id ? ' text-yellow-400' : 'text-white'} font-medium`}>
                                {option.votes}%
                              </Text>
                            )}
                          </View>
                        </View>
                      </TouchableOpacity>
                    </Animated.View>
                  );
                })}
              </View>
            </View>
          </View>
        );

      case 'mcq':
        return (
          <View className="w-full -mx-5 right-0 ml-0">
            <View className="self-start bg-[#FFD700] px-3 py-1 rounded-2xl mb-4 mx-4">
              <Text className="text-black font-semibold text-sm">Quiz</Text>
            </View>
            <View className="w-screen px-4 py-4">
              <Text className="text-white text-xl font-bold mb-6">{page.question}</Text>
              {page.options?.map(option => {
                const isAnswered = Boolean(answers[page.id]);
                const isCorrect = page.correctAnswer === option.id;
                const isSelected = answers[page.id] === option.id;
                const showIcon = isAnswered && (isSelected || isCorrect);
                const scaleAnimation = getOrCreateOptionScaleAnimation(option.id);
                
                return (
                  <Animated.View
                    key={option.id}
                    style={{
                      transform: [{
                        scale: scaleAnimation
                      }]
                    }}
                  >
                    <TouchableOpacity
                      onPress={() => {
                        if (!isAnswered) {
                          Animated.sequence([
                            Animated.spring(scaleAnimation, {
                              toValue: 0.95,
                              useNativeDriver: true,
                              speed: 50,
                              bounciness: 12
                            }),
                            Animated.spring(scaleAnimation, {
                              toValue: 1,
                              useNativeDriver: true,
                              speed: 50,
                              bounciness: 12
                            })
                          ]).start();

                          setAnswers(prev => ({ ...prev, [page.id]: option.id }));
                        }
                      }}
                      className="mb-3 last:mb-0 mt-3 w-full"
                      disabled={isAnswered}
                    >
                      <View className="p-3 rounded-full relative overflow-hidden border border-white/20 w-full flex-row justify-between items-center">
                        {isAnswered && isSelected && (
                          <LinearGradient
                            start={{x: 0, y: 0}}
                            end={{x: 1, y: 0}}
                            colors={isCorrect ? ['#7BE300', '#C7FE60'] : ['#FF2E00', '#FF6201']}
                            style={{
                              position: 'absolute',
                              top: 0,
                              left: 0,
                              right: 0,
                              bottom: 0,
                            }}
                          />
                        )}
                        <Text className={`
                          font-medium text-lg flex-1
                          ${isSelected ? 'text-black' : 'text-white'}
                          ${isAnswered ? 'text-left' : 'text-center'}
                        `}>
                          {option.text}
                        </Text>
                        {showIcon && (
                          <View className={`
                            w-6 h-6 rounded-full 
                            ${isSelected ? 'bg-white' : isCorrect ? 'bg-[#7BE300]' : 'bg-[#FF2E00]'}
                            items-center justify-center
                          `}>
                            {isCorrect? (
                              <Check size={16} strokeWidth={3} color={isSelected ? "black" : "white"} />
                            ) : (
                              <X size={16} strokeWidth={3} color={isSelected ? "black" : "white"} />
                            )}
                          </View>
                        )}
                      </View>
                    </TouchableOpacity>
                  </Animated.View>
                );
              })}
            </View>
          </View>
        );
    }
  }, [
    showDescription,
    toggleDescription,
    votes,
    answers,
    optionLayouts,
    getOrCreatePollAnimation,
    handleOptionLayout,
    animatePollResults,
    getOrCreateOptionScaleAnimation
  ]);

  const renderPost = useCallback(({ item: post }: { item: Post; index: number }) => {
    const isPostLoaded = postLoadingStatus[post.id];
    
    return (
      <View style={{ height: POST_HEIGHT, width }} className="bg-black">
        {!isPostLoaded &&  (
          <View style={{ height: POST_HEIGHT, width }} className="absolute inset-0 z-10">
            <LoadingPost />
          </View>
        )}
        
        <FlatList
          data={post.pages}
          renderItem={({ item: page }) => (
            <View style={{ width, height: POST_HEIGHT }} className="relative">
              <Image
                source={{ uri: page.image }}
                className="absolute inset-0 w-full h-full"
                resizeMode="cover"
                onLoad={() => {
                  handleImageLoad(post.id);
                }}
              />
              
              <View style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                height: POST_HEIGHT * 0.45,
                zIndex: 1
              }}>
                <PostGradient 
                  expanded={showDescription[post.id]} 
                  height={POST_HEIGHT}
                />
              </View>
              
              <View className="flex-1">
                <View 
                  className={`absolute bottom-24 left-0 z-10 ${
                    page.type === 'normal' 
                      ? 'right-16 px-5' 
                      : 'right-0'
                  }`}
                >
                  <View className="relative">
                    {page.type === 'normal' && (
                      <>
                        <View className="self-start bg-[#FFD205] px-3 py-1 rounded-full z-20 mb-4">
                          <Text className="text-black font-semibold text-sm">
                            {post.category}
                          </Text>
                        </View>
                        <Text className="text-white text-2xl leading-8 mb-4 font-extrabold">
                          {post.headline}
                        </Text>
                      </>
                    )}
                    <View className="relative">
                      {renderPageContent(page, post.id)}
                    </View>
                  </View>
                </View>

                {page.type === 'normal' && (
  <View className="absolute bottom-24 right-5 z-10">
    {[
      { type: 'heart', Icon: HeartIcon },
      { type: 'message', Icon: CommentIcon },
      { type: 'send', Icon: ShareIcon },
      { type: 'bookmark', Icon: SaveIcon }
    ].map(({ type, Icon }, index) => {
      const iconKey = `${post.id}-${type}`;
      const scaleAnim = iconScaleAnimations[iconKey] || new Animated.Value(1);
      
      return (
        <Animated.View
          key={type}
          style={{
            transform: [{ scale: scaleAnim }],
            marginBottom: index === 3 ? 0 : 12
          }}
        >
          <TouchableOpacity
            onPress={() => handleIconPress(post.id, type, post)}
            className={`w-10 h-10 rounded-full items-center justify-center ${
              activeIcons[iconKey] ? 'bg-black' : 'transparent'
            }`}
          >
            <Icon 
              size={32} 
              fillColor={activeIcons[iconKey] ? "#160919" : "transparent"}
              strokeColor={activeIcons[iconKey] ? "#696969" : "#696969"}
              pathColor={activeIcons[iconKey] ? "#FCFCFC" : "#FCFCFC"}
            />
          </TouchableOpacity>
        </Animated.View>
      );
    })}
  </View>
)}
              </View>
            </View>
          )}
          keyExtractor={item => item.id}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { x: scrollX } } }],
            { useNativeDriver: false }
          )}
          scrollEventThrottle={16}
          viewabilityConfig={{
            itemVisiblePercentThreshold: 50
          }}
          getItemLayout={(_, index) => ({
            length: width,
            offset: width * index,
            index,
          })}
          decelerationRate="fast"
          onMomentumScrollEnd={(e) => {
            handlePageChange(post.id, e.nativeEvent.contentOffset.x);
          }}
        />
        
        <View className="absolute bottom-5 left-5 z-50">
          <PageIndicator
            currentPage={currentPages[post.id] || 0}
            totalPages={post.pages.length}
            animValue={scrollX}
            uniqueId={`post-${post.id}`}  
          />
        </View>
      </View>
    );
  }, [
    renderPageContent,
    showDescription,
    activeIcons,
    handleIconPress,
    postLoadingStatus,
    handleImageLoad,
    currentPages,
    handlePageChange,
    scrollX
  ]);



  if (isLoading) {
    return <MainLoadingComponent />;
  }

  return (
    <View className="flex-1 bg-black">
      <StatusBar barStyle="light-content" />
      
      <View className="absolute top-0 left-0 right-0 z-50 flex-row justify-end px-4 pt-12 pb-4">
        <TouchableOpacity 
          onPress={() => setMenuOpen(true)}
          className="w-10 h-10 items-center justify-center rounded-full bg-black/50"
        >
          <Menu color="white" size={24} />
        </TouchableOpacity>
      </View>

      <SlideMenu isOpen={menuOpen} onClose={() => setMenuOpen(false)} />
      

      <ShareModal
      isVisible={shareModalVisible}
      onClose={() => setShareModalVisible(false)}
      post={selectedSharePost && {
        category: selectedSharePost.category,
        headline: selectedSharePost.headline,
        description: selectedSharePost.pages[0]?.description || '',
        image: selectedSharePost.pages[0]?.image || '',
      }}
    />


      <FlatList
        data={posts}
        renderItem={renderPost}
        keyExtractor={item => item.id}
        pagingEnabled
        showsVerticalScrollIndicator={false}
        snapToInterval={POST_HEIGHT}
        snapToAlignment="start"
        decelerationRate="fast"
        getItemLayout={(_, index) => ({
          length: POST_HEIGHT,
          offset: POST_HEIGHT * index,
          index,
        })}
      />
    </View>
  );
};

export default NewsFeed;