import {
    deleteUser,
    EmailAuthProvider,
    reauthenticateWithCredential,
} from "firebase/auth";
import { deleteDoc, doc, getDoc, setDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { useAuth } from "../../context/AuthContext";
import { db } from "../../firebaseConfig";

export default function Profile() {
  const { user, logout } = useAuth();

  // Стани для зберігання даних профілю
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [city, setCity] = useState("");

  // Стани для UI
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [currentPassword, setCurrentPassword] = useState(""); // Потрібно для видалення акаунту

  // 1. Завантаження даних з Firestore при відкритті екрану
  useEffect(() => {
    const fetchUserData = async () => {
      if (!user) return;

      try {
        // Звертаємося до колекції 'users', документ з ID = user.uid
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          setName(data.name || "");
          setAge(data.age || "");
          setCity(data.city || "");
        }
      } catch (error) {
        console.error("Помилка завантаження:", error);
        Alert.alert("Помилка", "Не вдалося завантажити дані профілю");
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [user]);

  // 2. Збереження (або оновлення) даних у Firestore
  const handleSaveProfile = async () => {
    if (!user) return;
    setIsSaving(true);

    try {
      const docRef = doc(db, "users", user.uid);
      // setDoc з { merge: true } оновить існуючі поля або створить нові
      await setDoc(
        docRef,
        {
          name: name,
          age: age,
          city: city,
          email: user.email, // Додамо email для зручності перегляду в базі
        },
        { merge: true },
      );

      Alert.alert("Успіх", "Профіль успішно оновлено!");
    } catch (error) {
      console.error("Помилка збереження:", error);
      Alert.alert(
        "Помилка",
        "Не вдалося зберегти дані. Перевірте правила Firestore.",
      );
    } finally {
      setIsSaving(false);
    }
  };

  // 3. Видалення облікового запису та даних з бази (із повторною авторизацією)
  const handleDeleteAccount = async () => {
    if (!currentPassword) {
      return Alert.alert(
        "Увага",
        "Для видалення акаунту введіть свій поточний пароль внизу екрану.",
      );
    }

    Alert.alert(
      "Видалення акаунту",
      "Ви впевнені? Це видалить ваш профіль та всі дані без можливості відновлення.",
      [
        { text: "Скасувати", style: "cancel" },
        {
          text: "Видалити",
          style: "destructive",
          onPress: async () => {
            try {
              setIsLoading(true);

              // Крок 3.1: Повторна авторизація (вимога Firebase для видалення)
              const credential = EmailAuthProvider.credential(
                user.email,
                currentPassword,
              );
              await reauthenticateWithCredential(user, credential);

              // Крок 3.2: Спочатку видаляємо документ з бази
              const docRef = doc(db, "users", user.uid);
              await deleteDoc(docRef);

              // Крок 3.3: Потім видаляємо самого користувача з Authentication
              await deleteUser(user);

              // (logout викличеться автоматично через onAuthStateChanged)
            } catch (error) {
              console.error("Помилка видалення:", error);
              if (error.code === "auth/invalid-credential") {
                Alert.alert(
                  "Помилка",
                  "Невірний пароль для підтвердження видалення.",
                );
              } else {
                Alert.alert(
                  "Помилка",
                  "Не вдалося видалити акаунт: " + error.message,
                );
              }
            } finally {
              setIsLoading(false);
            }
          },
        },
      ],
    );
  };

  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ paddingBottom: 40 }}
    >
      <View style={styles.header}>
        <Text style={styles.title}>Мій Профіль</Text>
        <TouchableOpacity onPress={logout} style={styles.logoutBtn}>
          <Text style={styles.logoutText}>Вийти</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.subtitle}>Email: {user?.email}</Text>

      <View style={styles.formGroup}>
        <Text style={styles.label}>{"Ім'я:"}</Text>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
          placeholder="Введіть ваше ім'я"
        />

        <Text style={styles.label}>Вік:</Text>
        <TextInput
          style={styles.input}
          value={age}
          onChangeText={setAge}
          placeholder="Введіть ваш вік"
          keyboardType="numeric"
        />

        <Text style={styles.label}>Місто:</Text>
        <TextInput
          style={styles.input}
          value={city}
          onChangeText={setCity}
          placeholder="Введіть ваше місто"
        />

        <TouchableOpacity
          style={[styles.saveBtn, isSaving && { opacity: 0.7 }]}
          onPress={handleSaveProfile}
          disabled={isSaving}
        >
          <Text style={styles.saveBtnText}>
            {isSaving ? "Збереження..." : "Зберегти зміни"}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Небезпечна зона: Видалення акаунту */}
      <View style={styles.dangerZone}>
        <Text style={styles.dangerTitle}>Небезпечна зона</Text>
        <Text style={styles.dangerDesc}>
          Для видалення акаунту необхідна повторна авторизація.
        </Text>

        <TextInput
          style={styles.inputDanger}
          value={currentPassword}
          onChangeText={setCurrentPassword}
          placeholder="Введіть поточний пароль"
          secureTextEntry
        />

        <TouchableOpacity
          style={styles.deleteBtn}
          onPress={handleDeleteAccount}
        >
          <Text style={styles.deleteBtnText}>Видалити акаунт</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f5f5", padding: 20 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 40,
    marginBottom: 20,
  },
  title: { fontSize: 28, fontWeight: "bold" },
  subtitle: { fontSize: 16, color: "#666", marginBottom: 20 },
  logoutBtn: { padding: 10 },
  logoutText: { color: "#007AFF", fontSize: 16, fontWeight: "600" },
  formGroup: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  label: { fontSize: 16, fontWeight: "500", marginBottom: 8, color: "#333" },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 12,
    borderRadius: 8,
    marginBottom: 20,
    fontSize: 16,
  },
  saveBtn: {
    backgroundColor: "#28a745",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
  saveBtnText: { color: "#fff", fontSize: 18, fontWeight: "bold" },

  dangerZone: {
    marginTop: 40,
    padding: 20,
    backgroundColor: "#ffe5e5",
    borderRadius: 15,
    borderWidth: 1,
    borderColor: "#ffcccc",
  },
  dangerTitle: {
    color: "#d9534f",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  dangerDesc: { color: "#d9534f", marginBottom: 15 },
  inputDanger: {
    borderWidth: 1,
    borderColor: "#ffcccc",
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 8,
    marginBottom: 15,
  },
  deleteBtn: {
    backgroundColor: "#d9534f",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  deleteBtnText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
});
