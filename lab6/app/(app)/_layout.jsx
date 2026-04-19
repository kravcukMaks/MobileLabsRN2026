import { Redirect, Stack } from "expo-router";
import { ActivityIndicator, View } from "react-native";
import { useAuth } from "../../context/AuthContext";

export default function AppLayout() {
  const { isAuthenticated, isInitialized } = useAuth();

  // 1. Поки Firebase ініціалізується, показуємо індикатор завантаження
  if (!isInitialized) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  // 2. Якщо перевірка завершена і користувач НЕ авторизований — редирект на вхід
  if (!isAuthenticated) {
    return <Redirect href="/login" />;
  }

  // 3. Якщо авторизований — показуємо захищені екрани
  return <Stack />;
}
