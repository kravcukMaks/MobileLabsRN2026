import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { getPathInfo } from '../utils/fileHelpers';
import { formatBytes, formatDate, getFileTypeLabel } from '../utils/formatters';

export default function DetailsScreen({ route }) {
  const { uri, name, isDirectory } = route.params;
  const [info, setInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDetails() {
      try {
        const result = await getPathInfo(uri);
        setInfo(result);
      } catch (error) {
        Alert.alert('Помилка', error.message || 'Не вдалося завантажити дані');
      } finally {
        setLoading(false);
      }
    }

    fetchDetails();
  }, [uri]);

  if (loading) {
    return (
      <SafeAreaView style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#0D9488" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.wrapper}>
      <View style={styles.infoCard}>
        <InfoField title="Ім'я файлу" content={name} />
        <InfoField title="Тип об'єкта" content={getFileTypeLabel(name, isDirectory)} />
        <InfoField title="Розмір" content={formatBytes(info?.size || 0)} />
        <InfoField title="Остання зміна" content={formatDate(info?.modificationTime)} />
        <InfoField title="Шлях (URI)" content={uri} isLast />
      </View>
    </SafeAreaView>
  );
}

function InfoField({ title, content, isLast }) {
  return (
    <View style={[styles.fieldContainer, isLast && styles.noBorder]}>
      <Text style={styles.fieldTitle}>{title}</Text>
      <Text style={styles.fieldContent}>{content}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: '#F3F4F6', 
    padding: 20,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
  },
  infoCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16, 
    paddingHorizontal: 20,
    paddingVertical: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 3, 
  },
  fieldContainer: {
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6', 
  },
  noBorder: {
    borderBottomWidth: 0,
  },
  fieldTitle: {
    fontSize: 12,
    color: '#6B7280',
    textTransform: 'uppercase', 
    letterSpacing: 0.5,
    marginBottom: 6,
  },
  fieldContent: {
    fontSize: 15,
    color: '#1F2937', 
    fontWeight: '500',
  },
});