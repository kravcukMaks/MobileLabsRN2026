import { Link, Stack } from "expo-router";
import { StyleSheet, Text, View } from "react-native";

export default function NotFoundScreen() {
  return (
    <>
      {/* Налаштовуємо заголовок верхньої панелі */}
      <Stack.Screen options={{ title: "Упс!" }} />

      <View style={styles.container}>
        <Text style={styles.title}>Екран не знайдено.</Text>

        <Link href="/" style={styles.link}>
          <Text style={styles.linkText}>Повернутися на головну сторінку</Text>
        </Link>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
  },
  link: {
    marginTop: 15,
    paddingVertical: 15,
  },
  linkText: {
    fontSize: 16,
    color: "#007AFF",
    fontWeight: "600",
  },
});
