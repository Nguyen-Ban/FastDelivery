import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, Alert, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import COLOR from '@/constants/Colors';
import orderService from '@/services/order.service';
import driverService from '@/services/driver.service';
import { useRouter } from 'expo-router';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

interface CompleteDeliveryPanelProps {
    orderId: string;
    driverName?: string;
    onBack?: () => void;
    onSubmit?: () => void;
}

const tagsList = ['Thân thiện', 'Cẩn thận', 'Đúng giờ', 'Thái độ tốt', 'Đóng phục gọn gàng', 'Sạch sẽ'];
const tipsList = [5000, 10000, 15000];
const ratingComments = ['Tệ', 'Không hài lòng', 'Bình thường', 'Hài lòng', 'Tuyệt vời'];

const CompleteDeliveryPanel: React.FC<CompleteDeliveryPanelProps> = ({ orderId, driverName = 'Nguyễn Văn A', onBack, onSubmit }) => {
    const [rating, setRating] = useState<number>(0);
    const [tip, setTip] = useState<number | null>(null);
    const [selectedTags, setSelectedTags] = useState<string[]>([]);
    const [comment, setComment] = useState<string>('');
    const router = useRouter();

    const toggleTag = (tag: string) => {
        if (selectedTags.includes(tag)) {
            setSelectedTags(prevTags => {
                const newTags = prevTags.filter((t) => t !== tag);
                setComment(newTags.join(', ')); // Update comment when removing tag
                return newTags;
            });
        } else {
            setSelectedTags(prevTags => {
                const newTags = [...prevTags, tag];
                setComment(newTags.join(', ')); // Update comment when adding tag
                return newTags;
            });
        }
    };
    const handleSubmit = async () => {
        const res = await driverService.reviewDriver({ orderId, rating, comment });
        if (!res.success) return
        Alert.alert('Đánh giá thành công', `Cảm ơn bạn đã đánh giá tài xế!`);
        if (onSubmit) onSubmit();
    };

    return (
        <View style={styles.panelContainer}>
            <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
                <Text style={styles.header}>Đơn hàng đã hoàn thành!</Text>
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
                <Text style={styles.sectionTitle}>Gửi lời khen của bạn</Text>
                <View style={styles.tagWrap}>
                    {tagsList.map(tag => (
                        <TouchableOpacity
                            key={tag}
                            style={[styles.tag, selectedTags.includes(tag) && styles.tagSelected]}
                            onPress={() => toggleTag(tag)}
                        >
                            <Text style={selectedTags.includes(tag) ? styles.tagTextSelected : styles.tagText}>{tag}</Text>
                        </TouchableOpacity>
                    ))}
                </View>
                <View style={styles.buttonContainer}>
                    <TouchableOpacity style={[styles.submitButton, styles.homeButton]} onPress={() => router.push('/customer/home')}>
                        <Text style={styles.submitText}>Về trang chủ</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.submitButton, styles.reviewButton]} onPress={handleSubmit}>
                        <Text style={styles.submitText}>Gửi đánh giá</Text>
                    </TouchableOpacity>
                </View>
                <Text style={styles.note}>
                    Bạn có điều gì muốn sẻ chia cùng chúng tôi? Hãy để lại đánh giá ngay nhé! Đánh giá và bình luận của bạn sẽ được hiển thị ở chế độ ẩn danh.
                </Text>
            </ScrollView>
        </View>
    );
};

const PANEL_HEIGHT = SCREEN_HEIGHT * 0.7;

const styles = StyleSheet.create({
    panelContainer: {
        backgroundColor: '#fff',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -3 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 10,
        minHeight: PANEL_HEIGHT,
        maxHeight: PANEL_HEIGHT + 40,
        paddingBottom: 10,
    },
    scroll: {
        padding: 20,
        paddingBottom: 40,
    },
    header: { fontSize: 22, fontWeight: 'bold', textAlign: 'center', marginBottom: 20, color: COLOR.orange50 },
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
    buttonContainer: {
        flexDirection: 'row',
        gap: 10,
        marginTop: 30,
    },
    submitButton: {
        backgroundColor: COLOR.orange50,
        paddingVertical: 14,
        borderRadius: 10,
        alignItems: 'center',
        flex: 1,
    },
    homeButton: {
        backgroundColor: COLOR.blue70,
    },
    reviewButton: {
        backgroundColor: COLOR.orange50,
    },
    submitText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
    note: {
        fontSize: 13,
        color: '#666',
        marginTop: 20,
        textAlign: 'center',
    },
});

export default CompleteDeliveryPanel;