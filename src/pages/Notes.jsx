import { useMemo, useState } from "react";
import {
    Archive,
    Check,
    Edit3,
    FileText,
    Folder,
    MoreHorizontal,
    Plus,
    Search,
    Tag,
    Trash2,
    X,
} from "lucide-react";

import { useLife } from "../context/LifeContext";

const initialForm = {
    title: "",
    content: "",
    category: "Personal",
    color: "purple",
};

const categories = [
    "Personal",
    "College",
    "Work",
    "Ideas",
    "Study",
    "Creative",
    "Projects",
    "Other",
];

const colors = [
    {
        name: "purple",
        label: "Lavender",
        value: "#8b72b9",
    },
    {
        name: "green",
        label: "Sage",
        value: "#72a28a",
    },
    {
        name: "rose",
        label: "Rose",
        value: "#c58b9d",
    },
    {
        name: "blue",
        label: "Blue",
        value: "#7195b8",
    },
    {
        name: "yellow",
        label: "Soft Yellow",
        value: "#c5aa68",
    },
];

function Notes() {
    const {
        notes,
        addNote,
        updateNote,
        deleteNote,
    } = useLife();

    const [search, setSearch] = useState("");
    const [categoryFilter, setCategoryFilter] = useState("all");

    const [showFilters, setShowFilters] = useState(false);

    const [showNoteModal, setShowNoteModal] = useState(false);

    const [editingNote, setEditingNote] = useState(null);
    const [selectedNote, setSelectedNote] = useState(null);

    const [form, setForm] = useState(initialForm);

    const [deleteTarget, setDeleteTarget] = useState(null);

    const filteredNotes = useMemo(() => {
        const searchText = search.trim().toLowerCase();

        return notes
            .filter((note) => {
                const matchesSearch =
                    !searchText ||
                    note.title
                        .toLowerCase()
                        .includes(searchText) ||
                    note.content
                        .toLowerCase()
                        .includes(searchText) ||
                    note.category
                        .toLowerCase()
                        .includes(searchText);

                const matchesCategory =
                    categoryFilter === "all" ||
                    note.category.toLowerCase() ===
                    categoryFilter.toLowerCase();

                return matchesSearch && matchesCategory;
            })
            .sort((a, b) => {
                const first = new Date(
                    b.updatedAt || b.createdAt || 0
                ).getTime();

                const second = new Date(
                    a.updatedAt || a.createdAt || 0
                ).getTime();

                return first - second;
            });
    }, [notes, search, categoryFilter]);

    const statistics = useMemo(() => {
        const total = notes.length;

        const categoryCount = new Set(
            notes.map((note) => note.category)
        ).size;

        const words = notes.reduce((sum, note) => {
            const count = note.content
                ? note.content.trim().split(/\s+/).filter(Boolean)
                    .length
                : 0;

            return sum + count;
        }, 0);

        return {
            total,
            categoryCount,
            words,
        };
    }, [notes]);

    const openAddModal = () => {
        setEditingNote(null);
        setForm(initialForm);
        setShowNoteModal(true);
    };

    const openEditModal = (note) => {
        setEditingNote(note);

        setForm({
            title: note.title || "",
            content: note.content || "",
            category: note.category || "Personal",
            color: note.color || "purple",
        });

        setShowNoteModal(true);
    };

    const closeModal = () => {
        setShowNoteModal(false);
        setEditingNote(null);
        setForm(initialForm);
    };

    const handleChange = (event) => {
        const { name, value } = event.target;

        setForm((current) => ({
            ...current,
            [name]: value,
        }));
    };

    const handleSubmit = (event) => {
        event.preventDefault();

        if (!form.title.trim()) {
            return;
        }

        const noteData = {
            title: form.title.trim(),
            content: form.content.trim(),
            category: form.category,
            color: form.color,
        };

        if (editingNote) {
            updateNote(editingNote.id, noteData);

            setSelectedNote({
                ...editingNote,
                ...noteData,
            });
        } else {
            addNote(noteData);
        }

        closeModal();
    };

    const handleDelete = () => {
        if (!deleteTarget) {
            return;
        }

        deleteNote(deleteTarget.id);

        if (
            selectedNote &&
            selectedNote.id === deleteTarget.id
        ) {
            setSelectedNote(null);
        }

        setDeleteTarget(null);
    };

    const openNote = (note) => {
        setSelectedNote(note);
    };

    const closeNote = () => {
        setSelectedNote(null);
    };

    const clearFilters = () => {
        setSearch("");
        setCategoryFilter("all");
    };

    const hasActiveFilters =
        search || categoryFilter !== "all";

    const getColor = (colorName) => {
        return (
            colors.find((color) => color.name === colorName)
                ?.value || "#8b72b9"
        );
    };

    const formatDate = (dateString) => {
        if (!dateString) {
            return "Recently";
        }

        const date = new Date(dateString);

        if (Number.isNaN(date.getTime())) {
            return "Recently";
        }

        return date.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
        });
    };

    const formatDateTime = (dateString) => {
        if (!dateString) {
            return "Recently";
        }

        const date = new Date(dateString);

        if (Number.isNaN(date.getTime())) {
            return "Recently";
        }

        return date.toLocaleString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
            hour: "numeric",
            minute: "2-digit",
        });
    };

    const getPreview = (content) => {
        if (!content) {
            return "No additional content.";
        }

        const cleanContent = content.replace(/\s+/g, " ").trim();

        if (cleanContent.length <= 120) {
            return cleanContent;
        }

        return `${cleanContent.slice(0, 120)}...`;
    };

    const getWordCount = (content) => {
        if (!content?.trim()) {
            return 0;
        }

        return content
            .trim()
            .split(/\s+/)
            .filter(Boolean).length;
    };

    return (
        <div className="notes-page">
            {/* PAGE INTRO */}

            <section className="page-intro">
                <div>
                    <p className="page-eyebrow">
                        <FileText size={14} />
                        Capture your thoughts
                    </p>

                    <h1>Notes</h1>

                    <p>
                        Keep ideas, reminders, study notes, and important
                        thoughts organized in one place.
                    </p>
                </div>

                <button
                    type="button"
                    className="primary-button"
                    onClick={openAddModal}
                >
                    <Plus size={18} />
                    New Note
                </button>
            </section>

            {/* STATISTICS */}

            <section className="notes-stat-grid">
                <div className="notes-stat-card">
                    <div className="notes-stat-icon purple">
                        <FileText size={21} />
                    </div>

                    <div>
                        <span className="notes-stat-label">
                            Total notes
                        </span>

                        <strong>{statistics.total}</strong>
                    </div>
                </div>

                <div className="notes-stat-card">
                    <div className="notes-stat-icon green">
                        <Folder size={21} />
                    </div>

                    <div>
                        <span className="notes-stat-label">
                            Categories
                        </span>

                        <strong>{statistics.categoryCount}</strong>
                    </div>
                </div>

                <div className="notes-stat-card">
                    <div className="notes-stat-icon rose">
                        <Tag size={21} />
                    </div>

                    <div>
                        <span className="notes-stat-label">
                            Words written
                        </span>

                        <strong>{statistics.words}</strong>
                    </div>
                </div>
            </section>

            {/* CONTROLS */}

            <section className="notes-controls">
                <div className="notes-search">
                    <Search size={18} />

                    <input
                        type="text"
                        placeholder="Search notes..."
                        value={search}
                        onChange={(event) => setSearch(event.target.value)}
                    />

                    {search && (
                        <button
                            type="button"
                            className="search-clear"
                            onClick={() => setSearch("")}
                            aria-label="Clear search"
                        >
                            <X size={16} />
                        </button>
                    )}
                </div>

                <button
                    type="button"
                    className={`filter-button ${showFilters ? "active" : ""
                        }`}
                    onClick={() =>
                        setShowFilters((current) => !current)
                    }
                >
                    <Folder size={17} />
                    Filters

                    {hasActiveFilters && (
                        <span className="filter-count">!</span>
                    )}
                </button>
            </section>

            {/* FILTER PANEL */}

            {showFilters && (
                <section className="notes-filter-panel">
                    <div className="notes-filter-group">
                        <label>Category</label>

                        <select
                            value={categoryFilter}
                            onChange={(event) =>
                                setCategoryFilter(event.target.value)
                            }
                        >
                            <option value="all">All categories</option>

                            {categories.map((category) => (
                                <option
                                    value={category.toLowerCase()}
                                    key={category}
                                >
                                    {category}
                                </option>
                            ))}
                        </select>
                    </div>

                    {hasActiveFilters && (
                        <button
                            type="button"
                            className="clear-filters"
                            onClick={clearFilters}
                        >
                            Clear filters
                        </button>
                    )}
                </section>
            )}

            {/* NOTES SECTION */}

            <section className="notes-section">
                <div className="notes-section-header">
                    <div>
                        <span className="panel-eyebrow">
                            Your notebook
                        </span>

                        <h2>
                            {filteredNotes.length}{" "}
                            {filteredNotes.length === 1
                                ? "note"
                                : "notes"}
                        </h2>
                    </div>

                    <span className="notes-header-info">
                        {hasActiveFilters
                            ? "Filtered results"
                            : "Recently updated"}
                    </span>
                </div>

                {filteredNotes.length === 0 ? (
                    <div className="notes-empty-state">
                        <div className="notes-empty-icon">
                            <FileText size={30} />
                        </div>

                        <h3>No notes found</h3>

                        <p>
                            {notes.length === 0
                                ? "Start capturing your ideas by creating your first note."
                                : "Try changing your search or category filter."}
                        </p>

                        {notes.length === 0 ? (
                            <button
                                type="button"
                                className="primary-button"
                                onClick={openAddModal}
                            >
                                <Plus size={17} />
                                Create your first note
                            </button>
                        ) : (
                            <button
                                type="button"
                                className="secondary-button"
                                onClick={clearFilters}
                            >
                                Clear filters
                            </button>
                        )}
                    </div>
                ) : (
                    <div className="notes-grid">
                        {filteredNotes.map((note) => {
                            const color = getColor(note.color);

                            return (
                                <article
                                    className="note-management-card"
                                    key={note.id}
                                    onClick={() => openNote(note)}
                                >
                                    <div
                                        className="note-card-color"
                                        style={{
                                            background: color,
                                        }}
                                    />

                                    <div className="note-management-content">
                                        <div className="note-card-top">
                                            <div
                                                className="note-icon"
                                                style={{
                                                    color,
                                                    background: `${color}18`,
                                                }}
                                            >
                                                <FileText size={19} />
                                            </div>

                                            <div
                                                className="note-card-actions"
                                                onClick={(event) =>
                                                    event.stopPropagation()
                                                }
                                            >
                                                <button
                                                    type="button"
                                                    className="note-more-button"
                                                    onClick={() =>
                                                        setSelectedNote(note)
                                                    }
                                                    aria-label="Open note"
                                                >
                                                    <MoreHorizontal size={18} />
                                                </button>
                                            </div>
                                        </div>

                                        <h3>{note.title}</h3>

                                        <p className="note-preview">
                                            {getPreview(note.content)}
                                        </p>

                                        <div className="note-card-meta">
                                            <span className="note-category">
                                                {note.category}
                                            </span>

                                            <span>
                                                {formatDate(
                                                    note.updatedAt || note.createdAt
                                                )}
                                            </span>
                                        </div>

                                        <div className="note-card-footer">
                                            <span>
                                                {getWordCount(note.content)} words
                                            </span>

                                            <button
                                                type="button"
                                                className="note-open-button"
                                                onClick={(event) => {
                                                    event.stopPropagation();
                                                    openNote(note);
                                                }}
                                            >
                                                Open
                                            </button>
                                        </div>
                                    </div>
                                </article>
                            );
                        })}
                    </div>
                )}
            </section>

            {/* NOTE VIEWER */}

            {selectedNote && (
                <div
                    className="modal-overlay note-viewer-overlay"
                    onMouseDown={(event) => {
                        if (event.target === event.currentTarget) {
                            closeNote();
                        }
                    }}
                >
                    <div className="note-viewer">
                        <div
                            className="note-viewer-accent"
                            style={{
                                background: getColor(selectedNote.color),
                            }}
                        />

                        <div className="note-viewer-header">
                            <div>
                                <span className="note-viewer-category">
                                    {selectedNote.category}
                                </span>

                                <h2>{selectedNote.title}</h2>

                                <p>
                                    Updated{" "}
                                    {formatDateTime(
                                        selectedNote.updatedAt ||
                                        selectedNote.createdAt
                                    )}
                                </p>
                            </div>

                            <button
                                type="button"
                                className="modal-close"
                                onClick={closeNote}
                                aria-label="Close note"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <div className="note-viewer-body">
                            {selectedNote.content ? (
                                <p>{selectedNote.content}</p>
                            ) : (
                                <p className="note-no-content">
                                    This note doesn't have any content yet.
                                </p>
                            )}
                        </div>

                        <div className="note-viewer-footer">
                            <span>
                                {getWordCount(selectedNote.content)} words
                            </span>

                            <div className="note-viewer-actions">
                                <button
                                    type="button"
                                    className="secondary-button"
                                    onClick={() => {
                                        openEditModal(selectedNote);
                                        closeNote();
                                    }}
                                >
                                    <Edit3 size={16} />
                                    Edit
                                </button>

                                <button
                                    type="button"
                                    className="delete-button"
                                    onClick={() => {
                                        setDeleteTarget(selectedNote);
                                        closeNote();
                                    }}
                                >
                                    <Trash2 size={16} />
                                    Delete
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* ADD / EDIT NOTE MODAL */}

            {showNoteModal && (
                <div
                    className="modal-overlay"
                    onMouseDown={(event) => {
                        if (event.target === event.currentTarget) {
                            closeModal();
                        }
                    }}
                >
                    <div className="modal note-modal">
                        <div className="modal-header">
                            <div>
                                <p className="modal-eyebrow">
                                    {editingNote
                                        ? "Update note"
                                        : "New note"}
                                </p>

                                <h2>
                                    {editingNote
                                        ? "Edit your note"
                                        : "Create a new note"}
                                </h2>
                            </div>

                            <button
                                type="button"
                                className="modal-close"
                                onClick={closeModal}
                                aria-label="Close"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <form
                            className="note-form"
                            onSubmit={handleSubmit}
                        >
                            <div className="form-group">
                                <label htmlFor="note-title">
                                    Note title
                                </label>

                                <input
                                    id="note-title"
                                    name="title"
                                    type="text"
                                    placeholder="e.g. Project ideas"
                                    value={form.title}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label htmlFor="note-category">
                                        Category
                                    </label>

                                    <select
                                        id="note-category"
                                        name="category"
                                        value={form.category}
                                        onChange={handleChange}
                                    >
                                        {categories.map((category) => (
                                            <option
                                                value={category}
                                                key={category}
                                            >
                                                {category}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="form-group">
                                <label htmlFor="note-content">
                                    Content
                                </label>

                                <textarea
                                    id="note-content"
                                    name="content"
                                    rows="10"
                                    placeholder="Write your thoughts here..."
                                    value={form.content}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="form-group">
                                <label>Note color</label>

                                <div className="note-color-picker">
                                    {colors.map((color) => (
                                        <button
                                            type="button"
                                            key={color.name}
                                            className={`note-color-option ${form.color === color.name
                                                    ? "selected"
                                                    : ""
                                                }`}
                                            onClick={() =>
                                                setForm((current) => ({
                                                    ...current,
                                                    color: color.name,
                                                }))
                                            }
                                            title={color.label}
                                            aria-label={`Select ${color.label}`}
                                        >
                                            <span
                                                style={{
                                                    background: color.value,
                                                }}
                                            />

                                            {form.color === color.name && (
                                                <Check size={14} />
                                            )}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="modal-actions">
                                <button
                                    type="button"
                                    className="secondary-button"
                                    onClick={closeModal}
                                >
                                    Cancel
                                </button>

                                <button
                                    type="submit"
                                    className="primary-button"
                                >
                                    <Check size={17} />

                                    {editingNote
                                        ? "Save changes"
                                        : "Create note"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* DELETE CONFIRMATION */}

            {deleteTarget && (
                <div
                    className="modal-overlay"
                    onMouseDown={(event) => {
                        if (event.target === event.currentTarget) {
                            setDeleteTarget(null);
                        }
                    }}
                >
                    <div className="modal confirmation-modal">
                        <div className="confirmation-icon">
                            <Trash2 size={23} />
                        </div>

                        <h2>Delete this note?</h2>

                        <p>
                            You're about to delete{" "}
                            <strong>{deleteTarget.title}</strong>. This
                            action cannot be undone.
                        </p>

                        <div className="confirmation-actions">
                            <button
                                type="button"
                                className="secondary-button"
                                onClick={() => setDeleteTarget(null)}
                            >
                                Cancel
                            </button>

                            <button
                                type="button"
                                className="delete-button"
                                onClick={handleDelete}
                            >
                                <Trash2 size={16} />
                                Delete note
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Notes;