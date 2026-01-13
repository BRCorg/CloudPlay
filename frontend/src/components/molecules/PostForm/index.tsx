import { useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { createPost } from "../../../redux/posts/postsSlice";

export default function CreatePostPage() {
    const dispatch = useAppDispatch();
    const { loading, error } = useAppSelector((state) => state.posts);

    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [file, setFile] = useState<File | null>(null);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        dispatch(createPost({ title, content, file: file ?? undefined }));
    };

    return (
        <form onSubmit={handleSubmit} encType="multipart/form-data">
            <label htmlFor="title">Titre</label>
            <input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Titre"
                required
            />

            <label htmlFor="content">Contenu</label>
            <textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Contenu"
                required
            />

            <label htmlFor="file">Image (facultatif)</label>
            <input
                id="file"
                type="file"
                accept="image/*"
                onChange={(e) => setFile(e.target.files?.[0] ?? null)}
            />

            <button type="submit" disabled={loading}>
                {loading ? "Loading…" : "Publier"}
            </button>

            {error && <div className="error">{error}</div>}
        </form>

    );
}
