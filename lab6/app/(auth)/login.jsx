import { Link } from "expo-router";
import { useState } from "react";
import {
    Alert,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { useAuth } from "../../context/AuthContext";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login, resetPassword } = useAuth();

  const handleReset = () => {
    if (!email)
      return Alert.alert("Помилка", "Введіть email для скидання пароля");
    resetPassword(email);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Вхід у систему</Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
      />

      <TextInput
        style={styles.input}
        placeholder="Пароль"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <TouchableOpacity
        style={styles.button}
        onPress={() => login(email, password)}
      >
        <Text style={styles.buttonText}>Увійти</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={handleReset} style={styles.link}>
        <Text style={{ color: "#666" }}>Забули пароль?</Text>
      </TouchableOpacity>

      <Link href="/register" asChild>
        <TouchableOpacity style={styles.link}>
          <Text style={styles.linkText}>Створити новий акаунт</Text>
        </TouchableOpacity>
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 25,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 30,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 15,
    borderRadius: 12,
    marginBottom: 15,
  },
  button: {
    backgroundColor: "#007AFF",
    padding: 18,
    borderRadius: 12,
    alignItems: "center",
  },
  buttonText: { color: "#fff", fontSize: 18, fontWeight: "bold" },
  link: { marginTop: 20, alignItems: "center" },
  linkText: { color: "#007AFF", fontWeight: "600" },
});
