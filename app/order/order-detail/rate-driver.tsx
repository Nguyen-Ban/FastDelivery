import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Image, ScrollView, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import COLOR from '../../../constants/Colors';

const RateDriver = () => {
  const { driverName = 'Nguyễn Văn A', orderId } = useLocalSearchParams();
  const [rating, setRating] = useState(0);
  const [tip, setTip] = useState<number | null>(null);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const router = useRouter();

  const tags = ['Thân thiện', 'Cẩn thận', 'Đúng giờ', 'Thái độ tốt', 'Đóng phục gọn gàng', 'Sạch sẽ'];
  const tips = [5000, 10000, 15000];
  const ratingComments = ['Tệ', 'Không hài lòng', 'Bình thường', 'Hài lòng', 'Tuyệt vời'];

interface TagToggleProps {
    tag: string;
}

const toggleTag = (tag: string): void => {
    if (selectedTags.includes(tag)) {
        setSelectedTags(selectedTags.filter((t: string) => t !== tag));
    } else {
        setSelectedTags([...selectedTags, tag]);
    }
};

  const handleSubmit = () => {
    Alert.alert('Đánh giá thành công', `Cảm ơn bạn đã đánh giá tài xế!`);
    router.replace('/home');
  };

  return (
    <SafeAreaView style={styles.container}>
        {/* Back Button */}
        <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.replace('/home')}
        >
            <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>

      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.header}>Đánh giá Tài xế</Text>

        <Image
          source={{ uri: 'https://cdn-icons-png.flaticon.com/512/1995/1995523.png' }}
          style={styles.avatar}
        />
        <Text style={styles.name}>{driverName}</Text>

        <View style={styles.stars}>
          {Array.from({ length: 5 }).map((_, i) => (
            <TouchableOpacity key={i} onPress={() => setRating(i + 1)}>
              <Ionicons
                name={i < rating ? 'star' : 'star-outline'}
                size={36}
                color={COLOR.orange50}
              />
            </TouchableOpacity>
          ))}
        </View>
        <Text style={styles.commentLabel}>
            {rating === 0 ? 'Đánh giá' : ratingComments[rating - 1]}
        </Text>

        <Text style={styles.sectionTitle}>Tài xế quá nhiệt tình? Thưởng thêm cho Tài xế</Text>
        <View style={styles.tipRow}>
          {tips.map((value) => (
            <TouchableOpacity
              key={value}
              style={[styles.tipButton, tip === value && styles.tipButtonActive]}
              onPress={() => setTip(value)}
            >
              <Text style={tip === value ? styles.tipTextActive : styles.tipText}>
                {value / 1000}K
              </Text>
            </TouchableOpacity>
          ))}
          <TouchableOpacity style={styles.tipButton}>
            <Text style={styles.tipText}>Khác</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.sectionTitle}>Gửi lời khen của bạn</Text>
        <View style={styles.tagWrap}>
          {tags.map(tag => (
            <TouchableOpacity
              key={tag}
              style={[styles.tag, selectedTags.includes(tag) && styles.tagSelected]}
              onPress={() => toggleTag(tag)}
            >
              <Text style={selectedTags.includes(tag) ? styles.tagTextSelected : styles.tagText}>{tag}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitText}>Gửi đi</Text>
        </TouchableOpacity>

        <Text style={styles.note}>
          Bạn có điều gì muốn sẻ chia cùng chúng tôi? Hãy để lại đánh giá ngay nhé! Đánh giá và bình luận của bạn sẽ được hiển thị ở chế độ ẩn danh.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  scroll: { padding: 20, paddingBottom: 40 },
  header: { fontSize: 22, fontWeight: 'bold', textAlign: 'center', marginBottom: 20 },
  avatar: { width: 100, height: 100, borderRadius: 50, alignSelf: 'center', marginBottom: 10 },
  name: { textAlign: 'center', fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
  stars: { flexDirection: 'row', justifyContent: 'center', marginBottom: 5 },
  commentLabel: { textAlign: 'center', color: '#888', marginBottom: 20 },
  sectionTitle: { fontSize: 16, fontWeight: '600', marginTop: 20, marginBottom: 10 },
  tipRow: { flexDirection: 'row', gap: 10 },
  tipButton: {
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 6,
  },
  tipButtonActive: {
    backgroundColor: COLOR.orange50,
    borderColor: COLOR.orange50,
  },
  tipText: { color: '#555' },
  tipTextActive: { color: '#fff' },
  tagWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginVertical: 10,
  },
  tag: {
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 6,
  },
  tagSelected: {
    backgroundColor: COLOR.orange50,
    borderColor: COLOR.orange50,
  },
  tagText: { color: '#333' },
  tagTextSelected: { color: '#fff' },
  submitButton: {
    backgroundColor: COLOR.orange50,
    paddingVertical: 14,
    borderRadius: 10,
    marginTop: 30,
    alignItems: 'center',
  },
  submitText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  note: {
    fontSize: 13,
    color: '#666',
    marginTop: 20,
    textAlign: 'center',
  },
  backButton: {
        position: 'absolute',
        top: 20,
        left: 20,
        backgroundColor: COLOR.orange50,
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 3,
        elevation: 5,
    }
});

export default RateDriver;
