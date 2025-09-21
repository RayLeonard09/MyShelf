// HomeScreen.js
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  Modal,
  StyleSheet,
  Alert,
  ImageBackground,
} from "react-native";
import { db, auth } from "./firebase";
import { signOut } from "firebase/auth";
import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
  getDoc, // ✅ added
} from "firebase/firestore";
import { Asset } from "expo-asset";

export default function HomeScreen({ navigation }) {
  const [items, setItems] = useState([]);
  const [name, setName] = useState("");
  const [stock, setStock] = useState("");
  const [price, setPrice] = useState("");

  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [editName, setEditName] = useState("");
  const [editStock, setEditStock] = useState("");
  const [editPrice, setEditPrice] = useState("");

  const [profile, setProfile] = useState(null); // ✅ user profile

  const user = auth.currentUser;
  const itemsRef = collection(db, "inventory");

  // ✅ background
  const bgImage = Asset.fromModule(require("./assets/splash.jpg")).uri;

  const fetchItems = async () => {
    const snapshot = await getDocs(itemsRef);
    setItems(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
  };

  const fetchProfile = async () => {
    if (user) {
      const userDoc = await getDoc(doc(db, "users", user.uid));
      if (userDoc.exists()) {
        setProfile(userDoc.data());
      }
    }
  };

  useEffect(() => {
    fetchItems();
    fetchProfile();
  }, []);

  const addItem = async () => {
    if (!name || !stock || !price) {
      return Alert.alert("Missing Fields", "Please fill out all fields.");
    }
    await addDoc(itemsRef, {
      name,
      stock: Number(stock),
      price: Number(price),
      lastEditedBy: user?.email || "Unknown",
      lastEditedAt: new Date().toISOString(),
    });
    setName("");
    setStock("");
    setPrice("");
    fetchItems();
  };

  const openEditModal = (item) => {
    setEditItem(item);
    setEditName(item.name);
    setEditStock(item.stock.toString());
    setEditPrice(item.price.toString());
    setEditModalVisible(true);
  };

  const updateItem = async () => {
    if (!editItem) return;
    const itemDoc = doc(db, "inventory", editItem.id);
    await updateDoc(itemDoc, {
      name: editName,
      stock: Number(editStock),
      price: Number(editPrice),
      lastEditedBy: user?.email || "Unknown",
      lastEditedAt: new Date().toISOString(),
    });
    setEditModalVisible(false);
    fetchItems();
  };

  const deleteItem = async (id) => {
    const itemDoc = doc(db, "inventory", id);
    await deleteDoc(itemDoc);
    fetchItems();
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigation.replace("Signin");
    } catch (error) {
      Alert.alert("Logout Failed", error.message);
    }
  };

  const formatDate = (isoString) => {
    if (!isoString) return "";
    const date = new Date(isoString);
    return `${date.toLocaleDateString()} ${date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    })}`;
  };

  return (
    <ImageBackground
      source={{ uri: bgImage }}
      style={{ flex: 1 }}
      resizeMode="cover"
    >
      <View style={styles.overlay}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerText}>📦 MyShelf</Text>

          <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
            <Text style={styles.userName}>
              {profile
                ? `${profile.firstName} ${profile.lastName}`
                : user?.email}
            </Text>
            <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
              <Text style={styles.logoutText}>Logout</Text>
            </TouchableOpacity>
          </View>
        </View>

        <Text style={styles.welcomeText}>
          Hello,{" "}
          {profile ? `${profile.firstName} ${profile.lastName}` : user?.email} 👋
        </Text>

        {/* Input Form */}
        <View style={styles.inputCard}>
          <Text style={styles.sectionTitle}>➕ Add New Item</Text>
          <TextInput
            placeholder="Item Name"
            value={name}
            onChangeText={setName}
            style={styles.input}
          />
          <TextInput
            placeholder="Stock"
            value={stock}
            onChangeText={setStock}
            keyboardType="numeric"
            style={styles.input}
          />
          <TextInput
            placeholder="Price"
            value={price}
            onChangeText={setPrice}
            keyboardType="numeric"
            style={styles.input}
          />
          <TouchableOpacity style={styles.addButton} onPress={addItem}>
            <Text style={styles.addButtonText}>Add Item</Text>
          </TouchableOpacity>
        </View>

        {/* Inventory List */}
        <Text style={styles.sectionTitle}>📋 Inventory</Text>
        {items.length === 0 ? (
          <Text style={styles.emptyText}>
            No items yet. Add your first inventory item!
          </Text>
        ) : (
          <FlatList
            data={items}
            keyExtractor={(item) => item.id}
            numColumns={2}
            columnWrapperStyle={{ justifyContent: "space-between" }}
            renderItem={({ item }) => (
              <View style={styles.itemCard}>
                <Text style={styles.itemName}>{item.name}</Text>
                <Text style={styles.itemDetail}>Stock: {item.stock}</Text>
                <Text style={styles.itemPrice}>₱{item.price}</Text>
                <Text style={styles.itemMeta}>
                  ✏️ {item.lastEditedBy} • {formatDate(item.lastEditedAt)}
                </Text>
                <View style={styles.itemActions}>
                  <TouchableOpacity onPress={() => openEditModal(item)}>
                    <Text style={styles.editText}>Edit</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => deleteItem(item.id)}>
                    <Text style={styles.deleteText}>Delete</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          />
        )}

        {/* Edit Modal */}
        <Modal visible={editModalVisible} animationType="slide" transparent={true}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalCard}>
              <Text style={styles.modalTitle}>✏️ Edit Item</Text>
              <TextInput
                value={editName}
                onChangeText={setEditName}
                style={styles.input}
              />
              <TextInput
                value={editStock}
                onChangeText={setEditStock}
                keyboardType="numeric"
                style={styles.input}
              />
              <TextInput
                value={editPrice}
                onChangeText={setEditPrice}
                keyboardType="numeric"
                style={styles.input}
              />
              <TouchableOpacity style={styles.addButton} onPress={updateItem}>
                <Text style={styles.addButtonText}>Save Changes</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.addButton, { backgroundColor: "#ccc", marginTop: 10 }]}
                onPress={() => setEditModalVisible(false)}
              >
                <Text style={{ fontWeight: "bold" }}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
    </ImageBackground>
  );
}

// 🎨 Styles
const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(255,255,255,0.05)",
    padding: 15,
    paddingTop: 40,
  },
  header: {
    backgroundColor: "rgba(0,123,255,0.9)",
    padding: 15,
    borderRadius: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  headerText: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
  },
  userName: {
    color: "#fff",
    fontWeight: "600",
    marginRight: 10,
  },
  logoutButton: {
    backgroundColor: "rgba(255,77,77,0.9)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  logoutText: {
    color: "#fff",
    fontWeight: "bold",
  },
  welcomeText: {
    fontSize: 16,
    marginBottom: 10,
    color: "#f1f1f1",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 10,
    color: "#fff",
  },
  inputCard: {
    backgroundColor: "rgba(255,255,255,0.7)",
    borderRadius: 12,
    padding: 15,
    marginBottom: 20,
    elevation: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: "rgba(221,221,221,0.6)",
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
    backgroundColor: "rgba(255,255,255,0.8)",
    color: "#000",
  },
  addButton: {
    backgroundColor: "#007BFF",
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
  },
  addButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  emptyText: {
    textAlign: "center",
    color: "#ddd",
    marginTop: 30,
    fontStyle: "italic",
  },
  itemCard: {
    flex: 1,
    backgroundColor: "rgba(255,255,255,0.75)",
    padding: 15,
    margin: 5,
    borderRadius: 12,
    elevation: 3,
  },
  itemName: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
    color: "#111",
  },
  itemDetail: {
    fontSize: 14,
    color: "#333",
  },
  itemPrice: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#007BFF",
    marginTop: 5,
  },
  itemMeta: {
    fontSize: 12,
    color: "#444",
    marginTop: 8,
  },
  itemActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 12,
  },
  editText: {
    color: "#007BFF",
    fontWeight: "600",
  },
  deleteText: {
    color: "#FF4D4D",
    fontWeight: "600",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalCard: {
    width: "90%",
    backgroundColor: "rgba(255,255,255,0.95)",
    padding: 20,
    borderRadius: 12,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "center",
    color: "#111",
  },
});
