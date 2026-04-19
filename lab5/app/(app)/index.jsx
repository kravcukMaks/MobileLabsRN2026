import { Link } from "expo-router";
import {
    FlatList,
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { useAuth } from "../../context/AuthContext"; // Зверни увагу на шлях: (app) -> app -> context

// Тестові дані (модель даних за п. 2.2)
const PRODUCTS = [
  {
    id: "1",
    name: 'MacBook Pro 14"',
    price: "75 000 ₴",
    img: "https://via.placeholder.com/100/000000/FFFFFF/?text=MacBook",
  },
  {
    id: "2",
    name: "iPhone 15 Pro",
    price: "45 000 ₴",
    img: "https://via.placeholder.com/100/000000/FFFFFF/?text=iPhone",
  },
  {
    id: "3",
    name: "AirPods Pro 2",
    price: "10 500 ₴",
    img: "https://via.placeholder.com/100/000000/FFFFFF/?text=AirPods",
  },
];

export default function Catalog() {
  const { logout } = useAuth();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Каталог товарів</Text>
        <TouchableOpacity onPress={logout} style={styles.logoutBtn}>
          <Text style={styles.logoutText}>Вийти</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={PRODUCTS}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Link href={`/details/${item.id}`} asChild>
            <TouchableOpacity style={styles.card}>
              <Image source={{ uri: item.img }} style={styles.image} />
              <View>
                <Text style={styles.name}>{item.name}</Text>
                <Text style={styles.price}>{item.price}</Text>
              </View>
            </TouchableOpacity>
          </Link>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
    marginTop: 40,
  },
  title: { fontSize: 24, fontWeight: "bold" },
  logoutBtn: { backgroundColor: "#ff4444", padding: 8, borderRadius: 8 },
  logoutText: { color: "white", fontWeight: "bold" },
  card: {
    flexDirection: "row",
    padding: 15,
    marginBottom: 10,
    backgroundColor: "#f4f4f4",
    borderRadius: 10,
    alignItems: "center",
  },
  image: { width: 60, height: 60, marginRight: 15, borderRadius: 8 },
  name: { fontSize: 18, fontWeight: "600", marginBottom: 5 },
  price: { color: "#28a745", fontSize: 16, fontWeight: "bold" },
});
