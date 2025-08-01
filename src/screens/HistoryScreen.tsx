import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux'
import { RootState, AppDispatch } from '../redux/store';
import { View, Pressable, Text, FlatList, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { loadHistory, clearHistory } from '../redux/weatherSlice';
import { HistoryScreenProps } from '../navigation/AppNavigator';
import { cityNameMap } from '../config/cityMapping';

export default function HistoryScreen({ navigation }: HistoryScreenProps) {
    const dispatch = useDispatch<AppDispatch>();
    const { history } = useSelector((state: RootState) => state.weather);

    const handleClear = () => {
        Alert.alert("清除歷史紀錄", "您確定要清除所有查詢紀錄嗎？", [
            { text: "取消", style: "cancel" },
            { text: "確定", onPress: () => dispatch(clearHistory()), style: 'destructive' },
        ]);
    };

    // 當畫面聚焦時重新載入歷史紀錄
    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            dispatch(loadHistory());
        });
        return unsubscribe;
    }, [navigation, dispatch]);

    return (
        <View style={styles.pageContainer}>
            <FlatList
                data={history}
                keyExtractor={(item, index) => `${item}-${index}`}
                renderItem={({ item }) => {
                    // 將 API 回傳的英文地名轉為小寫
                    const englishName = item.name.toLowerCase();
                    // 使用對照表找到對應的中文名稱，如果找不到，就直接顯示英文原名
                    const displayName = cityNameMap.enToZh[englishName] || item.name;

                    return (
                        <TouchableOpacity
                            style={styles.historyItem}
                            onPress={() => {
                                navigation.popTo('Search', { locationData: item });
                            }}
                        >
                            <Text style={styles.historyText}>{displayName}</Text>
                        </TouchableOpacity>
                    );
                }}
                ListEmptyComponent={<Text style={styles.emptyText}>目前沒有歷史紀錄。</Text>}
                style={{ marginTop: 20 }}
            />
            {history.length > 0 && <Pressable style={styles.clearButton} onPress={handleClear}>
                <Text style={styles.clearButtonText}>清除所有紀錄</Text>
            </Pressable>}
        </View>
    );
}

const styles = StyleSheet.create({
    pageContainer: {
        flex: 1,
        padding: 16,
        backgroundColor: '#f0f8ff'
    },
    historyItem: {
        backgroundColor: '#fff',
        padding: 16,
        borderRadius: 8,
        marginBottom: 8
    },
    historyText: {
        fontSize: 18
    },
    emptyText: {
        textAlign: 'center',
        marginTop: 48,
        fontSize: 16,
        color: '#888'
    },
    clearButton: {
        backgroundColor: '#ff6347',
        padding: 16,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 16,
        marginBottom: 16
    },
    clearButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold'
    }
});
