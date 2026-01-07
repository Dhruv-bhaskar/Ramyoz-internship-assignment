// pages/index.js
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/router";

export default function Home() {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    try {
      const res = await fetch("/api/notes");
      const data = await res.json();
      if (data.success) {
        setNotes(data.data);
      }
    } catch (error) {
      console.error("Error fetching notes:", error);
    } finally {
      setLoading(false);
    }
  };

  const deleteNote = async (id) => {
    if (!confirm("Are you sure you want to delete this note?")) return;

    try {
      const res = await fetch(`/api/notes/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setNotes(notes.filter((note) => note._id !== id));
      }
    } catch (error) {
      console.error("Error deleting note:", error);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const filteredNotes = notes.filter(
    (note) =>
      note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg font-medium">
            Loading your notes...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-200 to-zinc-300">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm shadow-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="flex sm:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-indigo-600 to-purple-600 p-3 rounded-2xl shadow-lg">
                <svg
                  className="w-7 h-7 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  />
                </svg>
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  Notify
                </h1>
                <p className="text-xs text-gray-500 font-medium">
                  Your personal note-taking companion
                </p>
              </div>
            </div>

            <Link
              href="/notes/new"
              className="hidden sm:flex bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-5 py-2.5 rounded-xl hover:shadow-lg hover:shadow-indigo-200 transform hover:scale-105 transition-all duration-200 flex items-center gap-2 font-semibold text-sm"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
              Create Note
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Bar */}
        {notes.length > 0 && (
          <div className="mb-10">
            <div className="relative max-w-2xl mx-auto">
              <input
                type="text"
                placeholder="Search notes by title or content..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-6 py-4 pl-14 bg-white rounded-2xl shadow-md border-2 border-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition text-gray-700 placeholder-gray-400"
              />
              <svg
                className="w-6 h-6 text-gray-400 absolute left-5 top-1/2 transform -translate-y-1/2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-5 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              )}
            </div>
            {searchQuery && (
              <p className="text-center text-gray-600 mt-4 font-medium">
                Found {filteredNotes.length}{" "}
                {filteredNotes.length === 1 ? "note" : "notes"}
              </p>
            )}
          </div>
        )}

        {/* Stats */}
        {notes.length > 0 && (
          <div className="mb-10">
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl shadow-lg shadow-gray-300 p-4 text-white max-w-sm mx-auto">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-4xl font-bold">{notes.length}</p>
                  <p className="text-indigo-100 font-medium mt-1">
                    Total Notes
                  </p>
                </div>
                <div className="bg-white/20 p-4 rounded-xl backdrop-blur-sm">
                  <svg
                    className="size-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Notes Grid */}
        {filteredNotes.length === 0 ? (
          <div className="text-center py-16">
            <div className="bg-white rounded-3xl shadow-xl p-12 max-w-md mx-auto border border-gray-100">
              <div className="bg-gradient-to-br from-indigo-100 to-purple-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg
                  className="w-12 h-12 text-indigo-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                {searchQuery ? "No notes found" : "No notes yet"}
              </h3>
              <p className="text-gray-500 mb-6">
                {searchQuery
                  ? "Try a different search term"
                  : "Start capturing your ideas and thoughts"}
              </p>
              {!searchQuery && (
                <Link
                  href="/notes/new"
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-xl hover:shadow-lg hover:shadow-indigo-200 transform hover:scale-105 transition-all duration-200 font-semibold"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                  Create your first note
                </Link>
              )}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredNotes.map((note) => (
              <div
                key={note._id}
                className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 transform hover:-translate-y-2"
              >
                <div className="p-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 min-h-[3.5rem] group-hover:text-indigo-600 transition-colors">
                    {note.title}
                  </h2>
                  <p className="text-gray-600 mb-4 line-clamp-3 min-h-[4.5rem] leading-relaxed mt-[-0.8rem]">
                    {note.content}
                  </p>
                  <div className="flex items-center gap-2 text-sm text-gray-500 mb-5 font-medium">
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    {formatDate(note.createdAt)}
                  </div>
                  <div className="flex gap-3">
                    <Link
                      href={`/notes/${note._id}`}
                      className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-4 py-2.5 rounded-xl hover:shadow-lg hover:shadow-indigo-200 transition-all text-center font-semibold text-sm"
                    >
                      View/Edit
                    </Link>
                    <button
                      onClick={() => deleteNote(note._id)}
                      className="bg-red-50 text-red-600 px-4 py-2.5 rounded-xl hover:bg-red-600 hover:text-white transition-all"
                      title="Delete note"
                    >
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="bg-white/80 backdrop-blur-sm border-t border-gray-200 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <p className="text-center text-gray-500 text-sm font-medium">
            Built with ❤️ using Next.js, MongoDB & Tailwind CSS
          </p>
        </div>
      </footer>
    </div>
  );
}
