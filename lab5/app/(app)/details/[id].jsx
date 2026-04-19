import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

// Ті самі дані (в реальному проєкті вони б тягнулися з API або контексту)
const PRODUCTS = [
  {
    id: "1",
    name: 'MacBook Pro 14"',
    price: "75 000 ₴",
    img: "https://via.placeholder.com/200/000000/FFFFFF/?text=MacBook",
    desc: "Потужний ноутбук на процесорі M3 Pro для професійних завдань.",
  },
  {
    id: "2",
    name: "iPhone 15 Pro",
    price: "45 000 ₴",
    img: "https://via.placeholder.com/200/000000/FFFFFF/?text=iPhone",
    desc: "Титановий корпус, чип A17 Pro та найкраща камера.",
  },
  {
    id: "3",
    name: "AirPods Pro 2",
    price: "10 500 ₴",
    img: "https://via.placeholder.com/200/000000/FFFFFF/?text=AirPods",
    desc: "Активне шумозаглушення нового покоління та чистий звук.",
  },
];

export default function Details() {
  // Отримуємо ID з URL
  const { id } = useLocalSearchParams();
  const router = useRouter();

  // Шукаємо товар за ID
  const product = PRODUCTS.find((p) => p.id === id);

  if (!product) {
    return (
      <View style={styles.container}>
        <Text style={styles.error}>Товар не знайдено</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: product.name }} />

      <Image source={{ uri: product.img }} style={styles.image} />
      <Text style={styles.title}>{product.name}</Text>
      <Text style={styles.price}>{product.price}</Text>
      <Text style={styles.desc}>{product.desc}</Text>

      <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
        <Text style={styles.backBtnText}>Повернутися до каталогу</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
    alignItems: "center",
  },
  image: {
    width: 200,
    height: 200,
    borderRadius: 15,
    marginBottom: 20,
    marginTop: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  price: {
    fontSize: 22,
    color: "#28a745",
    fontWeight: "bold",
    marginBottom: 20,
  },
  desc: {
    fontSize: 16,
    color: "#555",
    textAlign: "center",
    lineHeight: 24,
    marginBottom: 30,
  },
  backBtn: {
    backgroundColor: "#007AFF",
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 8,
  },
  backBtnText: { color: "white", fontSize: 16, fontWeight: "bold" },
  error: { fontSize: 20, color: "red", marginTop: 50 },
});
