// App.js
import React, { useEffect, useState } from "react";
import { View, Text, TextInput, Button, FlatList, TouchableOpacity, Modal } from "react-native";
import { db, auth } from "./firebase"; // ✅ make sure auth is exported in firebase.js
import { signOut } from "firebase/auth";
import { collection, addDoc, getDocs, updateDoc, deleteDoc, doc } from "firebase/firestore";

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

  const itemsRef = collection(db, "inventory");

  // READ
  const fetchItems = async () => {
    const snapshot = await getDocs(itemsRef);
    setItems(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
  };

  useEffect(() => {
    fetchItems();
  }, []);

  // CREATE
  const addItem = async () => {
    if (!name || !stock || !price) return;
    await addDoc(itemsRef, { name, stock: Number(stock), price: Number(price) });
    setName(""); setStock(""); setPrice("");
    fetchItems();
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
      navigation.replace("Signin"); // ✅ redirect back to Signin screen
    } catch (error) {
      console.error("Logout error:", error);
      alert("Failed to logout. Please try again.");
    }
  };

  return (
    <View style={{ padding: 20, marginTop: 50 }}>
      {/* 🔴 Logout Button */}
      <TouchableOpacity
        onPress={handleLogout}
        style={{
          alignSelf: "flex-end",
          backgroundColor: "red",
          padding: 10,
          borderRadius: 8,
          marginBottom: 10,
        }}
      >
        <Text style={{ color: "white", fontWeight: "bold" }}>Logout</Text>
      </TouchableOpacity>

      <Text style={{ fontSize: 22, fontWeight: "bold" }}>Inventory</Text>

      <TextInput
        placeholder="Item Name"
        value={name}
        onChangeText={setName}
        style={{ borderWidth: 1, marginVertical: 5, padding: 8 }}
      />
      <TextInput
        placeholder="Stock"
        value={stock}
        onChangeText={setStock}
        keyboardType="numeric"
        style={{ borderWidth: 1, marginVertical: 5, padding: 8 }}
      />
      <TextInput
        placeholder="Price"
        value={price}
        onChangeText={setPrice}
        keyboardType="numeric"
        style={{ borderWidth: 1, marginVertical: 5, padding: 8 }}
      />
      <Button title="Add Item" onPress={addItem} />

      {/* INVENTORY LIST */}
      <FlatList
        data={items}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={{ borderWidth: 1, padding: 10, marginVertical: 5 }}>
            <Text>
              {item.name} - Stock: {item.stock} - ₱{item.price}
            </Text>
            <View style={{ flexDirection: "row", marginTop: 5 }}>
              <TouchableOpacity onPress={() => openEditModal(item)} style={{ marginRight: 10 }}>
                <Text style={{ color: "green" }}>Edit</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => deleteItem(item.id)}>
                <Text style={{ color: "red" }}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />

      {/* EDIT MODAL */}
      <Modal visible={editModalVisible} animationType="slide" transparent={true}>
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "rgba(0,0,0,0.5)",
          }}
        >
          <View style={{ backgroundColor: "white", padding: 20, borderRadius: 10, width: "80%" }}>
            <Text style={{ fontSize: 18, fontWeight: "bold", marginBottom: 10 }}>Edit Item</Text>

            <TextInput value={editName} onChangeText={setEditName} style={{ borderWidth: 1, marginVertical: 5, padding: 8 }} />
            <TextInput value={editStock} onChangeText={setEditStock} keyboardType="numeric" style={{ borderWidth: 1, marginVertical: 5, padding: 8 }} />
            <TextInput value={editPrice} onChangeText={setEditPrice} keyboardType="numeric" style={{ borderWidth: 1, marginVertical: 5, padding: 8 }} />

            <Button title="Save Changes" onPress={updateItem} />
            <Button title="Cancel" color="gray" onPress={() => setEditModalVisible(false)} />
          </View>
        </View>
      </Modal>
    </View>
  );
}
