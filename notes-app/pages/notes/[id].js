// pages/notes/[id].js
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";

export default function EditNote() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const { id } = router.query;

  useEffect(() => {
    if (id) {
      fetchNote();
    }
  }, [id]);

  const fetchNote = async () => {
    try {
      const res = await fetch(`/api/notes/${id}`);
      const data = await res.json();

      if (data.success) {
        setTitle(data.data.title);
        setContent(data.data.content);
      } else {
        setError("Note not found");
      }
    } catch (error) {
      setError("Failed to load note");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSaving(true);

    if (!title.trim() || !content.trim()) {
      setError("Both title and content are required");
      setSaving(false);
      return;
    }

    try {
      const res = await fetch(`/api/notes/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title, content }),
      });

      const data = await res.json();

      if (data.success) {
        router.push("/");
      } else {
        setError(data.error || "Failed to update note");
      }
    } catch (error) {
      setError("An error occurred while updating the note");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="mb-6">
          <Link href="/" className="text-blue-600 hover:text-blue-700">
            ← Back to Notes
          </Link>
        </div>

        <h1 className="text-3xl font-bold text-gray-900 mb-5">Edit Note</h1>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="bg-white border rounded-lg shadow-md py-3 px-6"
        >
          <div className="mb-6">
            <label
              htmlFor="title"
              className="block text-gray-600 font-semibold mb-2"
            >
              Title
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="text-stone-700 w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              placeholder="Enter note title"
              disabled={saving}
            />
          </div>

          <div className="mb-3">
            <label
              htmlFor="content"
              className="block text-gray-700 font-semibold mb-2"
            >
              Content
            </label>
            <textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows="10"
              className="text-stone-700 w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 resize-vertical"
              placeholder="Enter note content"
              disabled={saving}
            />
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={saving}
              className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-3xl hover:bg-blue-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
            <Link
              href="/"
              className="px-6 py-3 border border-gray-300 rounded-4xl bg-red-400 hover:bg-red-500 font-semibold transition-all"
            >
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
