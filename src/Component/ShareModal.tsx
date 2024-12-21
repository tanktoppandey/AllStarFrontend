import React, { useEffect } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  Animated,
  Image,
  Dimensions,
  StyleSheet,
  Share,
  StatusBar,
} from 'react-native';
import { X } from 'lucide-react-native';
import LinearGradient from 'react-native-linear-gradient';

const { width, height } = Dimensions.get('window');

interface ShareModalProps {
  isVisible: boolean;
  onClose: () => void;
  post: {
    category: string;
    headline: string;
    description: string;
    image: string;
  } | null;
}

const ShareModal: React.FC<ShareModalProps> = ({ isVisible, onClose, post }) => {
  const slideAnim = React.useRef(new Animated.Value(height)).current;

  useEffect(() => {
    if (isVisible) {
      Animated.spring(slideAnim, {
        toValue: 0,
        useNativeDriver: true,
        friction: 8,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: height,
        duration: 250,
        useNativeDriver: true,
      }).start();
    }
  }, [isVisible]);

  const handleShare = async () => {
    if (!post) return;
    
    try {
      await Share.share({
        message: `${post.headline}\n\n${post.description}`,
        url: post.image,
      });
    } catch (error) {
      console.log('Error sharing:', error);
    }
  };

  if (!post) return null;

  return (
    <Modal
      visible={isVisible}
      transparent
      animationType="none"
      onRequestClose={onClose}
    >
      <StatusBar barStyle="light-content" />
      <View style={styles.modalContainer}>
        <Animated.View
          style={[
            styles.modalContent,
            {
              transform: [{
                translateY: slideAnim
              }]
            }
          ]}
        >
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity
              onPress={onClose}
              style={styles.closeButton}
            >
              <X color="white" size={24} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Share</Text>
          </View>

          {/* Post Preview */}
          <View style={styles.previewContainer}>
            <View style={styles.previewCard}>
              {/* Category Tag */}
              <View style={styles.categoryLabel}>
                <Text style={styles.categoryText}>{post.category}</Text>
              </View>
              
              {/* Post Content */}
              <Text style={styles.headline} numberOfLines={2}>
                {post.headline}
              </Text>
              <Text style={styles.description} numberOfLines={3}>
                {post.description}
              </Text>
              
              {/* Post Image */}
              <View style={styles.imageContainer}>
                <Image
                  source={{ uri: post.image }}
                  style={styles.previewImage}
                  resizeMode="cover"
                />
              </View>
            </View>
          </View>

          {/* Share Button */}
          <View style={styles.bottomContainer}>
            <TouchableOpacity
              onPress={handleShare}
              style={styles.buttonContainer}
            >
              <LinearGradient
                colors={['#FFD205', '#997E03']}
                style={styles.shareButton}
                start={{x: 0, y: 0}}
                end={{x: 0, y: 1}}
              >
                <Text style={styles.shareButtonText}>Share Post</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: '#000000',
  },
  modalContent: {
    flex: 1,
    backgroundColor: '#160919',
    height: height,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 20,
  },
  closeButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  headerTitle: {
    color: 'white',
    fontSize: 20,
    fontWeight: '600',
    marginLeft: 15,
  },
  previewContainer: {
    flex: 1,
    padding: 20,
  },
  previewCard: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  categoryLabel: {
    alignSelf: 'flex-start',
    backgroundColor: '#FFD205',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
    marginBottom: 12,
  },
  categoryText: {
    color: 'black',
    fontWeight: '600',
    fontSize: 14,
  },
  headline: {
    fontSize: 24,
    fontWeight: '700',
    color: '#160919',
    marginBottom: 8,
    lineHeight: 32,
  },
  description: {
    fontSize: 16,
    color: '#4A4A4A',
    marginBottom: 16,
    lineHeight: 24,
  },
  imageContainer: {
    height: 200,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#f5f5f5',
  },
  previewImage: {
    width: '100%',
    height: '100%',
  },
  bottomContainer: {
    padding: 20,
    paddingBottom: 40,
    alignItems: 'center',
  },
  buttonContainer: {
    width: 335,
    height: 40,
  },
  shareButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
    height: 40,
    borderRadius: 24,
    width: '100%',
  },
  shareButtonText: {
    color: 'black',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default ShareModal;