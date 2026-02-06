import {
  Appbar,
  Button,
  Divider,
  List,
  Surface,
  TextInput,
} from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScrollView, View } from "react-native";
import { useEffect, useRef, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

type Student = {
  id: string;
  nama: string;
  kelas: string;
  jurusan: string;
  nipd: string;
};

export default function StudentPage() {
  const scrollRef = useRef<ScrollView>(null);

  const [students, setStudents] = useState<Student[]>([]);
  const [nama, setNama] = useState("");
  const [kelas, setKelas] = useState("");
  const [jurusan, setJurusan] = useState("");
  const [nipd, setNipd] = useState("");
  const [editId, setEditId] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      const stored = await AsyncStorage.getItem("students");
      if (stored) setStudents(JSON.parse(stored));
    };
    loadData();
  }, []);

  const saveData = async (data: Student[]) => {
    setStudents(data);
    await AsyncStorage.setItem("students", JSON.stringify(data));
  };

  const resetForm = () => {
    setNama("");
    setKelas("");
    setJurusan("");
    setNipd("");
    setEditId(null);
  };

  const submitStudent = async () => {
    if (!nama || !kelas || !jurusan || !nipd) return;

    const data = editId
      ? students.map((s) =>
          s.id === editId ? { ...s, nama, kelas, jurusan, nipd } : s
        )
      : [
          ...students,
          {
            id: Date.now().toString(),
            nama,
            kelas,
            jurusan,
            nipd,
          },
        ];

    await saveData(data);
    resetForm();
  };

  const editStudent = (student: Student) => {
    setEditId(student.id);
    setNama(student.nama);
    setKelas(student.kelas);
    setJurusan(student.jurusan);
    setNipd(student.nipd);
    scrollRef.current?.scrollTo({ y: 0, animated: true });
  };

  const deleteStudent = async (id: string) => {
    if (id === editId) resetForm();
    await saveData(students.filter((s) => s.id !== id));
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#FAFAFA" }}>
      <Appbar.Header style={{ backgroundColor: "#8D6E63" }}>
        <Appbar.Content
          title="Data Siswa"
          titleStyle={{ color: "#FFFFFF", fontWeight: "600" }}
        />
      </Appbar.Header>

      <ScrollView ref={scrollRef} contentContainerStyle={{ paddingBottom: 32 }}>
        <View style={{ padding: 16 }}>
          <Surface style={{ padding: 16, borderRadius: 14 }}>
            <TextInput
              label="Nama Siswa"
              value={nama}
              onChangeText={setNama}
              mode="outlined"
              style={{ marginBottom: 10 }}
              activeOutlineColor="#8D6E63"
            />
            <TextInput
              label="Kelas"
              value={kelas}
              onChangeText={setKelas}
              mode="outlined"
              style={{ marginBottom: 10 }}
              activeOutlineColor="#8D6E63"
            />
            <TextInput
              label="Jurusan"
              value={jurusan}
              onChangeText={setJurusan}
              mode="outlined"
              style={{ marginBottom: 10 }}
              activeOutlineColor="#8D6E63"
            />
            <TextInput
              label="NIPD"
              value={nipd}
              onChangeText={setNipd}
              mode="outlined"
              activeOutlineColor="#8D6E63"
            />

            <Button
              mode="contained"
              onPress={submitStudent}
              style={{
                marginTop: 16,
                borderRadius: 10,
                backgroundColor: "#8D6E63",
              }}
            >
              {editId ? "Simpan Perubahan" : "Tambah Siswa"}
            </Button>
          </Surface>
        </View>

        <View style={{ paddingHorizontal: 16 }}>
          {students.map((student) => (
            <Surface
              key={student.id}
              style={{
                marginBottom: 14,
                padding: 16,
                borderRadius: 14,
              }}
            >
              <List.Item
                title={student.nama}
                description={`${student.kelas} • ${student.jurusan}`}
              />

              <Divider style={{ marginVertical: 8 }} />

              <List.Item title="Kelas" description={student.kelas} />
              <Divider />
              <List.Item title="Jurusan" description={student.jurusan} />
              <Divider />
              <List.Item title="NIPD" description={student.nipd} />

              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "flex-end",
                  marginTop: 16,
                }}
              >
                <Button
                  mode="outlined"
                  onPress={() => editStudent(student)}
                  style={{ marginRight: 8 }}
                >
                  Edit
                </Button>
                <Button
                  mode="contained-tonal"
                  onPress={() => deleteStudent(student.id)}
                >
                  Hapus
                </Button>
              </View>
            </Surface>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
