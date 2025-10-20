import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  Modal,
  StyleSheet,
  ImageBackground,
  Image,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { db, auth } from "./firebase";
import { signOut } from "firebase/auth";
import { collection, addDoc, getDocs, updateDoc, deleteDoc, doc } from "firebase/firestore";
import { Asset } from "expo-asset";

export default function App({ navigation }) {
  const [items, setItems] = useState([]);
  const [name, setName] = useState("");
  const [stock, setStock] = useState("");
  const [price, setPrice] = useState("");

  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [editName, setEditName] = useState("");
  const [editStock, setEditStock] = useState("");
  const [editPrice, setEditPrice] = useState("");

  const bgImage = Asset.fromModule(require("./assets/splash.jpg")).uri;

  // READ
  const fetchItems = async () => {
    try {
      const itemsRef = collection(db, "inventory");
      const snapshot = await getDocs(itemsRef);
      const fetchedItems = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      console.log("Fetched items:", fetchedItems); // Debug log
      setItems(fetchedItems);
    } catch (error) {
      console.error("Error fetching items:", error);
      alert("Error fetching items. Please check your connection.");
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  // CREATE
  const addItem = async () => {
    if (!name || !stock || !price) return;
    try {
      const itemsRef = collection(db, "inventory");
      await addDoc(itemsRef, { 
        name, 
        stock: Number(stock), 
        price: Number(price),
        createdAt: new Date().toISOString()
      });
      setName("");
      setStock("");
      setPrice("");
      fetchItems();
    } catch (error) {
      console.error("Error adding item:", error);
      alert("Error adding item. Please try again.");
    }
  };

  // OPEN EDIT MODAL
  const openEditModal = (item) => {
    setEditItem(item);
    setEditName(item.name);
    setEditStock(item.stock.toString());
    setEditPrice(item.price.toString());
    setEditModalVisible(true);
  };

  // UPDATE
  const updateItem = async () => {
    if (!editItem) return;
    const itemDoc = doc(db, "inventory", editItem.id);
    await updateDoc(itemDoc, {
      name: editName,
      stock: Number(editStock),
      price: Number(editPrice),
    });
    setEditModalVisible(false);
    fetchItems();
  };

  // DELETE
  const deleteItem = async (id) => {
    const itemDoc = doc(db, "inventory", id);
    await deleteDoc(itemDoc);
    fetchItems();
  };

  // LOGOUT
  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigation.replace("Signin");
    } catch (error) {
      console.error("Logout error:", error);
      alert("Failed to logout. Please try again.");
    }
  };

  return (
    <ImageBackground source={{ uri: bgImage }} style={styles.bg} resizeMode="cover">
      <LinearGradient colors={["rgba(0,0,0,0.7)", "rgba(0,0,0,0.3)"]} style={styles.overlay}>
        {/* 🔴 Logout Button */}
        <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>

        {/* ✅ Logo + Title beside each other */}
        <View style={styles.header}>
          <Image source={require("./assets/icon.png")} style={styles.logoSmall} />
          <Text style={styles.title}>MyShelf</Text>
        </View>

        {/* Inputs */}
        <View style={styles.inputContainer}>
          <TextInput
            placeholder="Item Name"
            placeholderTextColor="rgba(255,255,255,0.7)"
            value={name}
            onChangeText={setName}
            style={styles.input}
          />
          <TextInput
            placeholder="Stock"
            placeholderTextColor="rgba(255,255,255,0.7)"
            value={stock}
            onChangeText={setStock}
            keyboardType="numeric"
            style={styles.input}
          />
          <TextInput
            placeholder="Price"
            placeholderTextColor="rgba(255,255,255,0.7)"
            value={price}
            onChangeText={setPrice}
            keyboardType="numeric"
            style={styles.input}
          />

          <TouchableOpacity style={styles.addButton} onPress={addItem}>
            <Text style={styles.addButtonText}>+ Add Item</Text>
          </TouchableOpacity>
        </View>

        {/* Inventory List */}
        <FlatList
          data={items}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingBottom: 100 }}
          renderItem={({ item }) => (
            <View style={styles.itemCard}>
              <Text style={styles.itemText}>
                {item.name} — Stock: {item.stock} — ₱{item.price}
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

        {/* Edit Modal */}
        <Modal visible={editModalVisible} animationType="slide" transparent={true}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalCard}>
              <Text style={styles.modalTitle}>✏️ Edit Item</Text>
              <TextInput
                value={editName}
                onChangeText={setEditName}
                placeholder="Name"
                style={styles.modalInput}
              />
              <TextInput
                value={editStock}
                onChangeText={setEditStock}
                keyboardType="numeric"
                placeholder="Stock"
                style={styles.modalInput}
              />
              <TextInput
                value={editPrice}
                onChangeText={setEditPrice}
                keyboardType="numeric"
                placeholder="Price"
                style={styles.modalInput}
              />

              <TouchableOpacity style={styles.saveButton} onPress={updateItem}>
                <Text style={styles.saveButtonText}>Save Changes</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setEditModalVisible(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </LinearGradient>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  bg: { flex: 1 },
  overlay: { flex: 1, padding: 20 },
  logoutButton: {
    alignSelf: "flex-end",
    backgroundColor: "rgba(255,0,0,0.8)",
    padding: 10,
    borderRadius: 10,
    marginBottom: 15,
  },
  logoutText: { color: "#fff", fontWeight: "bold" },

  // ✅ New Header Style
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  logoSmall: {
    width: 35,
    height: 35,
    marginRight: 10,
    borderRadius: 8,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
  },

  inputContainer: { marginBottom: 15 },
  input: {
    backgroundColor: "rgba(255,255,255,0.15)",
    borderColor: "rgba(255,255,255,0.3)",
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
    color: "#fff",
  },
  addButton: {
    backgroundColor: "#28a745",
    padding: 14,
    borderRadius: 12,
    alignItems: "center",
  },
  addButtonText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
  itemCard: {
    backgroundColor: "rgba(255,255,255,0.15)",
    borderRadius: 14,
    padding: 15,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.25)",
  },
  itemText: { color: "#fff", fontSize: 16, marginBottom: 8 },
  itemActions: { flexDirection: "row", justifyContent: "flex-end" },
  editText: { color: "#4CAF50", marginRight: 20, fontWeight: "bold" },
  deleteText: { color: "#FF4444", fontWeight: "bold" },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.6)",
  },
  modalCard: {
    width: "85%",
    backgroundColor: "rgba(255,255,255,0.95)",
    borderRadius: 16,
    padding: 20,
  },
  modalTitle: { fontSize: 20, fontWeight: "bold", marginBottom: 10, color: "#333" },
  modalInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
    backgroundColor: "#fff",
  },
  saveButton: {
    backgroundColor: "#007BFF",
    padding: 14,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 10,
  },
  saveButtonText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
  cancelButton: {
    backgroundColor: "gray",
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
  },
  cancelButtonText: { color: "#fff", fontWeight: "bold" },
});
