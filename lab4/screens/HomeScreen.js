import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';

import FileItem from '../components/FileItem';
import StorageCard from '../components/StorageCard';
import CreateFolderModal from '../components/CreateFolderModal';
import CreateFileModal from '../components/CreateFileModal';

import {
  ROOT_DIR,
  ensureRootDirectory,
  loadDirectoryItems,
  getParentPath,
  getRelativePath,
  createFolder,
  createTextFile,
  deletePath,
  getStorageStats,
} from '../utils/fileHelpers';

export default function HomeScreen({ navigation }) {
  const [activePath, setActivePath] = useState(ROOT_DIR);
  const [directoryData, setDirectoryData] = useState([]);
  const [deviceStorage, setDeviceStorage] = useState({
    total: 0,
    free: 0,
    used: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isFolderModalOpen, setIsFolderModalOpen] = useState(false);
  const [isFileModalOpen, setIsFileModalOpen] = useState(false);

  const fetchDirectoryData = useCallback(async (path) => {
    try {
      setIsLoading(true);
      await ensureRootDirectory();

      const [itemsList, stats] = await Promise.all([
        loadDirectoryItems(path),
        getStorageStats(),
      ]);

      setDirectoryData(itemsList);
      setDeviceStorage(stats);
    } catch (error) {
      Alert.alert('Увага', error.message || 'Не вдалося прочитати папку');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchDirectoryData(activePath);
    }, [activePath, fetchDirectoryData])
  );

  const onItemPress = (item) => {
    if (item.isDirectory) {
      setActivePath(item.uri);
      return;
    }

    if (item.name.toLowerCase().endsWith('.txt')) {
      navigation.navigate('Editor', {
        fileUri: item.uri,
        fileName: item.name,
      });
      return;
    }

    navigation.navigate('Details', {
      uri: item.uri,
      name: item.name,
      isDirectory: false,
    });
  };

  const onItemDetails = (item) => {
    navigation.navigate('Details', {
      uri: item.uri,
      name: item.name,
      isDirectory: item.isDirectory,
    });
  };

  const onItemDelete = (item) => {
    Alert.alert(
      'Видалення',
      `Точно видалити "${item.name}"?`,
      [
        { text: 'Ні', style: 'cancel' },
        {
          text: 'Так, видалити',
          style: 'destructive',
          onPress: async () => {
            try {
              await deletePath(item.uri);
              await fetchDirectoryData(activePath);
            } catch (error) {
              Alert.alert('Помилка', error.message || 'Не вдалося видалити файл');
            }
          },
        },
      ]
    );
  };

  const buildFolder = async (name) => {
    try {
      await createFolder(activePath, name);
      setIsFolderModalOpen(false);
      await fetchDirectoryData(activePath);
    } catch (error) {
      Alert.alert('Помилка', error.message || 'Збій при створенні папки');
    }
  };

  const buildFile = async ({ name, content }) => {
    try {
      await createTextFile(activePath, name, content);
      setIsFileModalOpen(false);
      await fetchDirectoryData(activePath);
    } catch (error) {
      Alert.alert('Помилка', error.message || 'Збій при створенні файлу');
    }
  };

  const navigateUp = () => {
    if (activePath === ROOT_DIR) return;
    setActivePath(getParentPath(activePath));
  };

  return (
    <SafeAreaView style={styles.mainWrapper}>
      <FlatList
        data={directoryData}
        keyExtractor={(item) => item.uri}
        contentContainerStyle={styles.listPadding}
        ListHeaderComponent={
          <>
            <StorageCard
              total={deviceStorage.total}
              free={deviceStorage.free}
              used={deviceStorage.used}
            />

            <View style={styles.breadcrumbCard}>
              <Text style={styles.breadcrumbTitle}>Директорія</Text>
              <Text style={styles.breadcrumbPath}>{getRelativePath(activePath)}</Text>
            </View>

            <View style={styles.buttonRow}>
              <TouchableOpacity
                style={[
                  styles.navButton,
                  activePath === ROOT_DIR && styles.navButtonDisabled,
                ]}
                onPress={navigateUp}
                disabled={activePath === ROOT_DIR}
              >
                <Text style={styles.buttonTextLight}>Назад</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.navButton}
                onPress={() => fetchDirectoryData(activePath)}
              >
                <Text style={styles.buttonTextLight}>Оновити</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.buttonRow}>
              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => setIsFolderModalOpen(true)}
              >
                <Text style={styles.buttonTextLight}>+ Папка</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => setIsFileModalOpen(true)}
              >
                <Text style={styles.buttonTextLight}>+ Файл TXT</Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.headerText}>Файли та папки</Text>
          </>
        }
        renderItem={({ item }) => (
          <FileItem
            item={item}
            onOpen={() => onItemPress(item)}
            onInfo={() => onItemDetails(item)}
            onDelete={() => onItemDelete(item)}
          />
        )}
        ListEmptyComponent={
          isLoading ? (
            <ActivityIndicator size="large" color="#0D9488" style={{ marginTop: 40 }} />
          ) : (
            <Text style={styles.placeholderText}>Тут поки що порожньо</Text>
          )
        }
      />

      <CreateFolderModal
        visible={isFolderModalOpen}
        onClose={() => setIsFolderModalOpen(false)}
        onSubmit={buildFolder}
      />

      <CreateFileModal
        visible={isFileModalOpen}
        onClose={() => setIsFileModalOpen(false)}
        onSubmit={buildFile}
      />
    </SafeAreaView>
  );
}


const styles = StyleSheet.create({
  mainWrapper: {
    flex: 1,
    backgroundColor: '#F3F4F6', 
  },
  listPadding: {
    padding: 20,
    paddingBottom: 40,
  },
  breadcrumbCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 3,
  },
  breadcrumbTitle: {
    fontSize: 12,
    color: '#6B7280',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 6,
  },
  breadcrumbPath: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  navButton: {
    flex: 1,
    backgroundColor: '#4B5563', 
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    marginHorizontal: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  navButtonDisabled: {
    backgroundColor: '#D1D5DB', 
    elevation: 0,
    shadowOpacity: 0,
  },
  actionButton: {
    flex: 1,
    backgroundColor: '#0D9488', 
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    marginHorizontal: 4,
    shadowColor: '#0D9488',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  buttonTextLight: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 15,
  },
  headerText: {
    fontSize: 20,
    fontWeight: '800',
    color: '#111827',
    marginTop: 10,
    marginBottom: 10,
    marginLeft: 4,
  },
  placeholderText: {
    textAlign: 'center',
    marginTop: 40,
    fontSize: 16,
    color: '#9CA3AF',
    fontStyle: 'italic',
  },
});