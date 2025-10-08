import { useState } from "react";
import { useEffect } from "react";

function App() {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState(""); // 🟢 Tambahan: state untuk pencarian
  const baseUrl = "https://notes-app-api-one.vercel.app"; // backend kamu

  // 🟢 Fetch semua note dari backend
  const fetchNotes = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${baseUrl}/notes`);
      const result = await res.json();
      setNotes(result.data || []);
    } catch (error) {
      console.error("Error fetching notes:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  // 🟢 Tambah note baru
  const addNote = async (newTitle, newContent) => {
    try {
      const res = await fetch(`${baseUrl}/notes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: newTitle,
          content: newContent,
        }),
      });

      const result = await res.json();
      if (res.ok) {
        setNotes((prev) => [result.data, ...prev]);
      } else {
        alert(result.message || "Gagal menambah catatan");
      }
    } catch (error) {
      console.error("Error adding note:", error);
    }
  };

  // 🟢 Update note
  const handleUpdateNote = async (id, updateTitle, updateContent) => {
    try {
      const res = await fetch(`${baseUrl}/notes/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: updateTitle, content: updateContent }),
      });

      const result = await res.json();
      if (res.ok) {
        setNotes((prevNotes) =>
          prevNotes.map((note) => (note.id === id ? result.data : note))
        );
      } else {
        alert(result.message || "Gagal mengupdate catatan");
      }
    } catch (error) {
      console.error("Error updating note:", error);
    }
  };

  // 🟢 Hapus note
  const handleDelete = async (id) => {
    if (!confirm("Yakin ingin menghapus catatan ini?")) return;

    try {
      const res = await fetch(`${baseUrl}/notes/${id}`, { method: "DELETE" });
      if (res.ok) {
        setNotes((prev) => prev.filter((note) => note.id !== id));
      } else {
        console.error("Gagal menghapus catatan");
      }
    } catch (error) {
      console.error("Error deleting note:", error);
    }
  };

  // 🟢 Filter notes berdasarkan pencarian
  const filteredNotes = notes.filter(
    (note) =>
      note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      note.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <Navbar />
      <main className="min-h-screen flex flex-col mt-24 items-center bg-gray-50">
        <NoteForm onAddNote={addNote} />

        {/* 🟢 Search Bar */}
        <div className="container max-w-xl px-5 mb-6">
          <input
            type="text"
            placeholder="Cari catatan..."
            className="w-full rounded-md border border-gray-300 p-3 focus:outline-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {loading ? (
          <p className="text-gray-600">Loading notes...</p>
        ) : (
          <NoteList
            notes={filteredNotes} // gunakan hasil filter
            onDelete={handleDelete}
            onUpdate={handleUpdateNote}
          />
        )}
      </main>
    </>
  );
}

export default App;

// ================== Komponen ==================

const Navbar = () => {
  return (
    <nav className="w-full fixed top-0 flex justify-center bg-white shadow z-50">
      <div className="flex justify-between px-5 py-5 container">
        <img src="/santri.jpg" alt="Logo" className="h-8" />
      </div>
    </nav>
  );
};

const NoteForm = ({ onAddNote }) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;
    onAddNote(title, content);
    setTitle("");
    setContent("");
  };

  return (
    <section className="container max-w-xl px-5 mb-8">
      <h1 className="flex flex-col items-center text-center text-4xl p-9">
        catatan siswa
      </h1>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-4 bg-white p-5 shadow rounded-lg"
      >
        <input
          type="text"
          placeholder="Title"
          className="rounded-md border border-gray-300 p-3 focus:outline-blue-500"
          required
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <textarea
          placeholder="Content"
          className="resize-y min-h-14 rounded-md border border-gray-300 p-3 focus:outline-blue-500"
          required
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <button
          type="submit"
          className="bg-gray-300 hover:bg-black transition text-white font-semibold rounded-lg py-3"
        >
          Add Note
        </button>
      </form>
    </section>
  );
};

const NoteItem = ({ note, onDelete, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [titleEdited, setTitleEdited] = useState(note.title);
  const [contentEdited, setContentEdited] = useState(note.content);

  const handleCancel = () => {
    setTitleEdited(note.title);
    setContentEdited(note.content);
    setIsEditing(false);
  };

  return (
    <div className="rounded-lg shadow-md bg-white w-[300px] p-5 flex flex-col items-center text-center">
      {isEditing ? (
        <>
          <input
            value={titleEdited}
            type="text"
            className="rounded-md border border-gray-300 p-2 w-full"
            onChange={(e) => setTitleEdited(e.target.value)}
          />
          <textarea
            value={contentEdited}
            className="rounded-md border border-gray-300 p-2 w-full mt-2"
            onChange={(e) => setContentEdited(e.target.value)}
          />
          <div className="mt-4 flex gap-2">
            <button
              className="bg-gray-400 text-white px-3 py-1 rounded"
              onClick={handleCancel}
            >
              Cancel
            </button>
            <button
              className="bg-green-500 text-white px-3 py-1 rounded"
              onClick={() => {
                onUpdate(note.id, titleEdited, contentEdited);
                setIsEditing(false);
              }}
            >
              Save
            </button>
          </div>
        </>
      ) : (
        <>
          <p className="font-semibold text-xl">{note.title}</p>
          <p className="text-sm text-gray-500">
            ~{showFormattedDate(note.created_at)}
          </p>
          <p className="mt-2 text-gray-800">{note.content}</p>
          <div className="mt-4 flex gap-2">
            <button
              className="bg-black text-white px-3 py-1 rounded"
              onClick={() => setIsEditing(true)}
            >
              ✒️edit
            </button>
            <button
              className="bg-black text-white px-3 py-1 rounded"
              onClick={() => onDelete(note.id)}
            >
              🗑️delete
            </button>
          </div>
        </>
      )}
    </div>
  );
};

const NoteList = ({ notes, onUpdate, onDelete }) => {
  return (
    <section className="container py-8">
      <h2 className="inline-flex items-center gap-2 text-2xl font-semibold mb-6">
        <img src="/note.svg" alt="note icon" className="w-8 h-8" />
        Notes
      </h2>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {notes.length > 0 ? (
          notes.map((note) => (
            <NoteItem
              key={note.id}
              note={note}
              onUpdate={onUpdate}
              onDelete={onDelete}
            />
          ))
        ) : (
          <p className="text-gray-500">Tidak ada catatan.</p>
        )}
      </div>
    </section>
  );
};

// Helper
const showFormattedDate = (date) => {
  const options = {
    year: "numeric",
    month: "long",
    weekday: "long",
    day: "numeric",
  };
  return new Date(date).toLocaleDateString("id-ID", options);
};
