import { Text, Button, TextInput, View, StyleSheet } from "react-native";
import { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Index() {
  const [name, setName] = useState("");
  const [umur, setUmur] = useState("");
  const [kelas, setKelas] = useState("");
  const [jurusan, setJurusan] = useState("");
  const [sekolah, setSekolah] = useState("");

  const saveData = async () => {
    await AsyncStorage.setItem("name", name);
    await AsyncStorage.setItem("umur", umur);
    await AsyncStorage.setItem("kelas", kelas);
    await AsyncStorage.setItem("jurusan", jurusan);
    await AsyncStorage.setItem("sekolah", sekolah);
  };

  const loadData = async () => {
    setName((await AsyncStorage.getItem("name")) || "");
    setUmur((await AsyncStorage.getItem("umur")) || "");
    setKelas((await AsyncStorage.getItem("kelas")) || "");
    setJurusan((await AsyncStorage.getItem("jurusan")) || "");
    setSekolah((await AsyncStorage.getItem("sekolah")) || "");
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.label}>Nama: {name}</Text>
      <TextInput style={styles.input} value={name} onChangeText={setName} />

      <Text style={styles.label}>Umur: {umur}</Text>
      <TextInput style={styles.input} value={umur} onChangeText={setUmur} />

      <Text style={styles.label}>Kelas: {kelas}</Text>
      <TextInput style={styles.input} value={kelas} onChangeText={setKelas} />

      <Text style={styles.label}>Jurusan: {jurusan}</Text>
      <TextInput style={styles.input} value={jurusan} onChangeText={setJurusan} />

      <Text style={styles.label}>Sekolah: {sekolah}</Text>
      <TextInput style={styles.input} value={sekolah} onChangeText={setSekolah} />

      <View style={{ marginTop: 20 }}>
        <Button title="Simpan" onPress={saveData} />
        <View style={{ height: 8 }} />
        <Button title="Ambil Data" onPress={loadData} />
      </View>
    </SafeAreaView>   
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0D0D0D",
    padding: 20,
  },
  label: {
    color: "#FFFFFF",
    fontSize: 16,
    marginTop: 12,
    marginBottom: 6,
  },
  input: {
    backgroundColor: "#1A1A1A",
    color: "#FFFFFF",
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ffffffff",
  },
});
