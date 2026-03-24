import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';

type ShoppingItem = {
  id: number;
  text: string;
  done: boolean;
};

export default function ShoppingListScreen() {
  const [input, setInput] = useState('');
  const [items, setItems] = useState<ShoppingItem[]>([]);

  const addItem = () => {
    const trimmed = input.trim();
    if (!trimmed) return;

    const newItem: ShoppingItem = {
      id: Date.now(),
      text: trimmed,
      done: false,
    };

    setItems((prev) => [...prev, newItem]);
    setInput('');
  };

  const toggleItem = (id: number) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, done: !item.done } : item
      )
    );
  };

  const removeItem = (id: number) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <View style={styles.container}>
      <View style={styles.inputRow}>
        <TextInput
          value={input}
          onChangeText={setInput}
          placeholder="new item"
          style={styles.input}
        />

        <TouchableOpacity style={styles.addButton} onPress={addItem}>
          <Text style={styles.addButtonText}>ADD ITEM</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.titleBox}>
        <Text style={styles.title}>SHOPPING LIST</Text>
      </View>

      <ScrollView contentContainerStyle={styles.listContainer}>
        {items.map((item) => (
          <View
                key={item.id}
                style={[styles.itemRow, item.done && styles.itemRowDone]}
            >
            <TouchableOpacity
              style={styles.itemTextWrapper}
              onPress={() => toggleItem(item.id)}
            >
              <Text style={[styles.itemText, item.done && styles.itemTextDone]}>
                {item.text}
              </Text>
            </TouchableOpacity>

            <View style={styles.actions}>
              <TouchableOpacity onPress={() => toggleItem(item.id)}>
                <Text style={styles.actionText}>{item.done ? '☑' : '☐'}</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => removeItem(item.id)}>
                <Text style={styles.deleteText}>✕</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    padding: 20,
  },
  inputRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 20,
    marginBottom: 18,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#bdbdbd',
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  addButton: {
    backgroundColor: '#2ea8ff',
    paddingHorizontal: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 12,
  },
  titleBox: {
    borderWidth: 1,
    borderColor: '#bdbdbd',
    paddingVertical: 12,
    marginBottom: 20,
  },
  title: {
    textAlign: 'center',
    fontSize: 26,
    fontWeight: '700',
    color: '#111',
  },
  listContainer: {
    gap: 12,
    paddingBottom: 24,
  },
  itemRow: {
    backgroundColor: '#17b5f0',
    paddingVertical: 14,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  
  itemRowDone: {
    backgroundColor: '#86efac',
  },
  itemTextWrapper: {
    flex: 1,
    marginRight: 12,
  },
  itemText: {
    color: '#111',
    fontSize: 18,
  },
  itemTextDone: {
    textDecorationLine: 'line-through',
    opacity: 0.6,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  actionText: {
    fontSize: 22,
    color: '#1d4ed8',
    fontWeight: '700',
  },
  deleteText: {
    fontSize: 22,
    color: '#b91c1c',
    fontWeight: '700',
  },
});