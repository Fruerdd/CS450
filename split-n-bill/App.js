import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  Image,
  StyleSheet,
  ScrollView,
  SafeAreaView,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { INITIAL_FRIENDS } from "./constants/Friends";

const STORAGE_KEY = "split-n-bill:friends";

export default function App() {
  const [friends, setFriends] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedFriend, setSelectedFriend] = useState(null);

  // Load from storage on mount
  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then((raw) => {
      if (raw) {
        setFriends(JSON.parse(raw));
      } else {
        setFriends(INITIAL_FRIENDS);
      }
    });
  }, []);

  // Persist whenever friends changes
  useEffect(() => {
    if (friends.length > 0) {
      AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(friends));
    }
  }, [friends]);

  function handleAddFriend(newFriend) {
    setFriends((prev) => [...prev, newFriend]);
    setShowAddForm(false);
  }

  function handleSelectFriend(friend) {
    setSelectedFriend((prev) => (prev?.id === friend.id ? null : friend));
    setShowAddForm(false);
  }

  function handleSplitBill(balanceChange) {
    setFriends((prev) =>
      prev.map((f) =>
        f.id === selectedFriend.id
          ? { ...f, balance: f.balance + balanceChange }
          : f
      )
    );
    setSelectedFriend(null);
  }

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Split the Bill</Text>

        {/* Friends List */}
        <FriendList
          friends={friends}
          selectedFriend={selectedFriend}
          onSelect={handleSelectFriend}
        />

        {/* Add Friend toggle button */}
        <TouchableOpacity
          style={styles.btnOrange}
          onPress={() => {
            setShowAddForm((v) => !v);
            setSelectedFriend(null);
          }}
        >
          <Text style={styles.btnText}>
            {showAddForm ? "CLOSE" : "ADD FRIEND"}
          </Text>
        </TouchableOpacity>

        {/* Add Friend form */}
        {showAddForm && (
          <AddFriendForm onAdd={handleAddFriend} onClose={() => setShowAddForm(false)} />
        )}

        {/* Split Bill form */}
        {selectedFriend && (
          <SplitBillForm
            friend={selectedFriend}
            onSplit={handleSplitBill}
            onClose={() => setSelectedFriend(null)}
          />
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

/* ─── FriendList ─────────────────────────────────────────── */
function FriendList({ friends, selectedFriend, onSelect }) {
  return (
    <View style={styles.card}>
      {friends.map((friend) => (
        <FriendRow
          key={friend.id}
          friend={friend}
          isSelected={selectedFriend?.id === friend.id}
          onSelect={onSelect}
        />
      ))}
    </View>
  );
}

function FriendRow({ friend, isSelected, onSelect }) {
  const balanceColor =
    friend.balance < 0 ? "#e74c3c" : friend.balance > 0 ? "#27ae60" : "#555";

  const balanceText =
    friend.balance < 0
      ? `You owe ${friend.name} $${Math.abs(friend.balance)}`
      : friend.balance > 0
      ? `${friend.name} owes you $${friend.balance}`
      : `${friend.name} and you are even`;

  return (
    <View style={styles.friendRow}>
      <Image source={{ uri: friend.image }} style={styles.avatar} />
      <View style={styles.friendInfo}>
        <Text style={styles.friendName}>{friend.name}</Text>
        <Text style={[styles.balance, { color: balanceColor }]}>{balanceText}</Text>
      </View>
      <TouchableOpacity
        style={[styles.btnOrange, isSelected && styles.btnSelected]}
        onPress={() => onSelect(friend)}
      >
        <Text style={styles.btnText}>{isSelected ? "CLOSE" : "SELECT"}</Text>
      </TouchableOpacity>
    </View>
  );
}

/* ─── AddFriendForm ──────────────────────────────────────── */
function AddFriendForm({ onAdd, onClose }) {
  const [name, setName] = useState("");
  const [image, setImage] = useState("");

  function handleSubmit() {
    if (!name.trim()) return;
    const id = Date.now();
    const resolvedImage = image.trim() || `https://i.pravatar.cc/48?u=${id}`;
    onAdd({ id, name: name.trim(), image: resolvedImage, balance: 0 });
    setName("");
    setImage("");
  }

  return (
    <View style={styles.card}>
      <Text style={styles.formTitle}>Add new friend</Text>
      <View style={styles.formRow}>
        <Text style={styles.label}>👤 Name:</Text>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
          placeholder="Friend's name"
        />
      </View>
      <View style={styles.formRow}>
        <Text style={styles.label}>🖼 Image:</Text>
        <TextInput
          style={styles.input}
          value={image}
          onChangeText={setImage}
          placeholder="Image URL (optional)"
        />
      </View>
      <View style={styles.formButtons}>
        <TouchableOpacity style={styles.btnOrange} onPress={handleSubmit}>
          <Text style={styles.btnText}>ADD FRIEND</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.btnGray} onPress={onClose}>
          <Text style={styles.btnText}>CLOSE</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

/* ─── SplitBillForm ──────────────────────────────────────── */
function SplitBillForm({ friend, onSplit, onClose }) {
  const [bill, setBill] = useState("");
  const [myExpense, setMyExpense] = useState("");
  const [whoPaysBill, setWhoPaysBill] = useState("you");

  const billNum = parseFloat(bill) || 0;
  const myNum = parseFloat(myExpense) || 0;
  const friendExpense = billNum > 0 && myNum <= billNum ? billNum - myNum : 0;

  function handleSplit() {
    if (!billNum || myNum > billNum) return;
    // Positive balance = friend owes us; negative = we owe friend
    const change = whoPaysBill === "you" ? friendExpense : -myNum;
    onSplit(change);
  }

  return (
    <View style={styles.card}>
      <Text style={styles.formTitle}>Split a bill with {friend.name}</Text>

      <View style={styles.formRow}>
        <Text style={styles.label}>💰 Bill value:</Text>
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          value={bill}
          onChangeText={setBill}
          placeholder="0"
        />
      </View>

      <View style={styles.formRow}>
        <Text style={styles.label}>👤 Your expense:</Text>
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          value={myExpense}
          onChangeText={(v) => {
            const n = parseFloat(v) || 0;
            if (n <= billNum) setMyExpense(v);
          }}
          placeholder="0"
        />
      </View>

      <View style={styles.formRow}>
        <Text style={styles.label}>👤 {friend.name}'s expense:</Text>
        <TextInput
          style={[styles.input, styles.inputDisabled]}
          value={friendExpense > 0 ? String(friendExpense) : ""}
          editable={false}
          placeholder="0"
        />
      </View>

      <Text style={[styles.label, { marginTop: 12 }]}>Who is paying the bill?</Text>
      <View style={styles.radioRow}>
        <TouchableOpacity
          style={styles.radioOption}
          onPress={() => setWhoPaysBill("you")}
        >
          <View style={styles.radioOuter}>
            {whoPaysBill === "you" && <View style={styles.radioInner} />}
          </View>
          <Text style={styles.radioLabel}>You</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.radioOption}
          onPress={() => setWhoPaysBill("friend")}
        >
          <View style={styles.radioOuter}>
            {whoPaysBill === "friend" && <View style={styles.radioInner} />}
          </View>
          <Text style={styles.radioLabel}>{friend.name}</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.formButtons}>
        <TouchableOpacity style={styles.btnOrange} onPress={handleSplit}>
          <Text style={styles.btnText}>SPLIT BILL</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.btnGray} onPress={onClose}>
          <Text style={styles.btnText}>CLOSE</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

/* ─── Styles ─────────────────────────────────────────────── */
const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#f4f4f4" },
  container: { padding: 16, gap: 16 },
  title: { fontSize: 22, fontWeight: "bold", textAlign: "center", marginBottom: 8 },

  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },

  friendRow: { flexDirection: "row", alignItems: "center", paddingVertical: 10, gap: 12 },
  avatar: { width: 48, height: 48, borderRadius: 24 },
  friendInfo: { flex: 1 },
  friendName: { fontWeight: "600", fontSize: 15 },
  balance: { fontSize: 12, marginTop: 2 },

  formTitle: { fontSize: 16, fontWeight: "700", marginBottom: 14, textAlign: "center" },
  formRow: { flexDirection: "row", alignItems: "center", marginBottom: 10, gap: 8 },
  label: { width: 130, fontSize: 13, color: "#444" },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    fontSize: 14,
  },
  inputDisabled: { backgroundColor: "#f0f0f0", color: "#888" },

  radioRow: { flexDirection: "row", gap: 24, marginTop: 8, marginBottom: 4 },
  radioOption: { flexDirection: "row", alignItems: "center", gap: 6 },
  radioOuter: {
    width: 18, height: 18, borderRadius: 9,
    borderWidth: 2, borderColor: "#e67e22",
    alignItems: "center", justifyContent: "center",
  },
  radioInner: { width: 9, height: 9, borderRadius: 5, backgroundColor: "#e67e22" },
  radioLabel: { fontSize: 14 },

  formButtons: { flexDirection: "row", gap: 10, marginTop: 16, justifyContent: "center" },

  btnOrange: {
    backgroundColor: "#e67e22",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
  },
  btnSelected: { backgroundColor: "#888" },
  btnGray: {
    backgroundColor: "#999",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
  },
  btnText: { color: "#fff", fontWeight: "700", fontSize: 12 },
});
