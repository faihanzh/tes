import { useEffect, useState } from "react";
import { FlatList, View } from "react-native";
import { Appbar, Button, Card, Dialog, Portal, Text, TextInput } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import * as SQLite from 'expo-sqlite';

type Book = {
    id: number;
    title: string;
    author: string;
    year: number;
    category: String;
    description: string;
    image: string;
};

const db = SQLite.openDatabaseSync("books.db", {
    useNewConnection: true
})

export default function BookPage() {
    const [formData, setFormData] = useState({
        title: "",
        author: "",
        year: "",
        category: "",
        description: "",
        image: ""
    })
    const [editId, setEditId] = useState<Number | null>(null)
    const [visible, setVisible] = useState(false)
    const [books, setBooks] = useState<Book[]>([]);
    async function initDatabase() {
        try {
            await db.execAsync(
                `CREATE TABLE IF NOT EXISTS books (
                    id integer primary key autoincrement,
                    title text not null,
                    author text not null,
                    category text not null,
                    year integer not null,
                    description text not null, 
                    image text not null
                )`,
            )
        } catch (error) {
            console.error("failed to create table books", error)
        }
    }

    useEffect(() => {
        initDatabase()
    }, [])

    async function AddBook(){
        try {
        const year = parseInt(formData.year)
        await db.runAsync(
            `INSERT INTO books (title, author, category, year, description, image) VALUES (?, ?, ?, ?, ?, ?)`, 
            [
                formData.title,
                formData.author,
                formData.category,
                year,
                formData.description,
                "https://marketplace.canva.com/EAGL8xM7Flc/1/0/1003w/canva-ilustrasi-hewan-lucu-berwarna-hutan-cover-buku-anak-Imj1LDHrFUQ.jpg"
            ],
        );
         const newBooks = {
        id: Date.now(),
        title: formData.title,
        author: formData.author,
        year: year,
        category: formData.category,
        description: formData.description,
        image: "https://marketplace.canva.com/EAGL8xM7Flc/1/0/1003w/canva-ilustrasi-hewan-lucu-berwarna-hutan-cover-buku-anak-Imj1LDHrFUQ.jpg"
    };
    setBooks([newBooks, ...books]);

  
        }catch(error){
            console.error("failed to insert book", error);
        }
    };

     async function deleteBook(id: any) {
      try{
        await db.runAsync(`DELETE FROM books WHERE id = ?`, [id]);
        const updatedBooks = books.filter((book) => book.id !== id);
        setBooks(updatedBooks);
      }catch (error) {
        console.error("failed to delete book", error)
      }
    }
    
    return (
        <View style={{ flex: 1 }}>
            <Appbar.Header>
                <Appbar.BackAction onPress={() => { }} />
                <Appbar.Content title="Books" />
                <Appbar.Action icon="plus" onPress={() => {
                    setVisible(true);
                }}/>
            </Appbar.Header>
            <View style={{ padding: 8 }}>
                <FlatList
                    data={books}
                    keyExtractor={(item) => item.id.toString()}
                    numColumns={2}
                    columnWrapperStyle={{
                        justifyContent: "space-between",
                        marginBottom: 12,
                    }}
                    renderItem={({ item }) => (
                        <Card style={{ width: "48%" }}>
                            <Card.Cover source={{ uri: item.image }} />
                            <View style={{ marginTop: 8, marginBottom: 4, paddingHorizontal: 4 }}>

                                {/* tittle */}
                                <Text style={{ fontSize: 16, fontWeight: "bold" }}>
                                    {item.title}
                                </Text>

                                {/* author, year, dan category */}
                                <Text style={{ fontSize: 12, color: "#666", marginBottom: 4 }}>
                                    {item.author} - {item.year} - {item.category}
                                </Text>

                                {/* description */}
                                <Text style={{ fontSize: 12, color: "#666" }}>
                                    {item.description}
                                </Text>

                            </View>



                            <View style={{ gap: 8, marginTop: 10, flexDirection: "row" }}>
                                <Button
                                    mode="contained"
                                    onPress={() => {
                                        setVisible(true);
                                        setEditId(item.id)
                                    }}
                                    buttonColor="blue"
                                    style={{ flex: 1 }}
                                > Edit</Button>
                            </View>

                            <View style={{ gap: 8, marginTop: 10, flexDirection: "row" }}>
                                <Button
                                    mode="contained"
                                    onPress={() => {
                                      deleteBook(item.id);
                                    }}
                                    buttonColor="red"
                                    style={{ flex: 1 }}
                                > 
                                 {""}delete
                                </Button>
                            </View>
                        </Card>
                    )}
                />
            </View>

            <Portal>
                <Dialog visible={visible} onDismiss={() => setVisible(false)}>
                    <Dialog.Title>This is a title</Dialog.Title>
                    <Dialog.Content>
                        <View>
                            <TextInput label={"Judul"} mode="outlined" style={{ marginBottom: 12 }}
                             onChangeText={(text) => {setFormData({...formData, title: text})}} value={formData.title}/>

                            <TextInput label={"Penulis"} mode="outlined" style={{ marginBottom: 12 }}
                            onChangeText={(text) => {setFormData({...formData, author: text})}} value={formData.author}/>

                            <TextInput label={"Kategori"} mode="outlined" style={{ marginBottom: 12 }}
                            onChangeText={(text) => {setFormData({...formData, category: text})}} value={formData.category}/>

                            <TextInput label={"Tahun"} mode="outlined" style={{ marginBottom: 12 }} keyboardType="number-pad"
                            onChangeText={(text) => {setFormData({...formData, year: text})}} value={formData.year}/>
                            
                            <TextInput label={"Deskripsi"} mode="outlined" style={{ marginBottom: 12 }} multiline numberOfLines={3}
                            onChangeText={(text) => {setFormData({...formData, description: text})}} value={formData.description}/>
                        </View>
                    </Dialog.Content>
                    <Dialog.Actions>
                        <Button onPress={() => setVisible(false)}>Cancel</Button>
                        <Button onPress={() => {
                          setVisible(false);
                          AddBook();
                        }}>Save</Button>
                    </Dialog.Actions>
                </Dialog>
            </Portal>
        </View>
    );
}