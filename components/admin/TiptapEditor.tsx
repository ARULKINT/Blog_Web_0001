"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import CharacterCount from "@tiptap/extension-character-count";
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import { common, createLowlight } from "lowlight";
import { useEffect } from "react";
import { cn } from "@/lib/utils";
import {
  Bold, Italic, Strikethrough, Code, Heading2, Heading3,
  List, ListOrdered, Quote, Minus, Link2, Image as ImageIcon,
  Undo, Redo, Code2,
} from "lucide-react";

const lowlight = createLowlight(common);

interface TiptapEditorProps {
  content: string;
  onChange: (html: string) => void;
  placeholder?: string;
}

export function TiptapEditor({ content, onChange, placeholder = "Write your article…" }: TiptapEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({ codeBlock: false }),
      CodeBlockLowlight.configure({ lowlight }),
      Image.configure({ HTMLAttributes: { class: "rounded-xl max-w-full my-4" } }),
      Link.configure({ openOnClick: false, HTMLAttributes: { class: "text-accent underline" } }),
      Placeholder.configure({ placeholder }),
      CharacterCount,
    ],
    content,
    onUpdate({ editor }) {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: "prose prose-base dark:prose-invert max-w-none min-h-[400px] px-6 py-5 focus:outline-none",
      },
    },
    immediatelyRender: false,
  });

  // Sync external content changes (e.g. loading from DB)
  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content, { emitUpdate: false });
    }
  }, [content, editor]);

  const addImage = () => {
    const url = window.prompt("Image URL:");
    if (url && editor) editor.chain().focus().setImage({ src: url }).run();
  };

  const setLink = () => {
    const prev = editor?.getAttributes("link").href as string | undefined;
    const url = window.prompt("URL:", prev);
    if (url === null) return;
    if (url === "") { editor?.chain().focus().unsetLink().run(); return; }
    editor?.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  };

  if (!editor) return null;

  const TOOLBAR: { label: string; icon: React.ReactNode; action: () => boolean | void; active?: boolean }[][] = [
    [
      { label: "Undo", icon: <Undo className="h-3.5 w-3.5" />, action: () => editor.chain().focus().undo().run() },
      { label: "Redo", icon: <Redo className="h-3.5 w-3.5" />, action: () => editor.chain().focus().redo().run() },
    ],
    [
      { label: "Bold", icon: <Bold className="h-3.5 w-3.5" />, action: () => editor.chain().focus().toggleBold().run(), active: editor.isActive("bold") },
      { label: "Italic", icon: <Italic className="h-3.5 w-3.5" />, action: () => editor.chain().focus().toggleItalic().run(), active: editor.isActive("italic") },
      { label: "Strike", icon: <Strikethrough className="h-3.5 w-3.5" />, action: () => editor.chain().focus().toggleStrike().run(), active: editor.isActive("strike") },
      { label: "Inline code", icon: <Code className="h-3.5 w-3.5" />, action: () => editor.chain().focus().toggleCode().run(), active: editor.isActive("code") },
    ],
    [
      { label: "H2", icon: <Heading2 className="h-3.5 w-3.5" />, action: () => editor.chain().focus().toggleHeading({ level: 2 }).run(), active: editor.isActive("heading", { level: 2 }) },
      { label: "H3", icon: <Heading3 className="h-3.5 w-3.5" />, action: () => editor.chain().focus().toggleHeading({ level: 3 }).run(), active: editor.isActive("heading", { level: 3 }) },
    ],
    [
      { label: "Bullet list", icon: <List className="h-3.5 w-3.5" />, action: () => editor.chain().focus().toggleBulletList().run(), active: editor.isActive("bulletList") },
      { label: "Ordered list", icon: <ListOrdered className="h-3.5 w-3.5" />, action: () => editor.chain().focus().toggleOrderedList().run(), active: editor.isActive("orderedList") },
      { label: "Blockquote", icon: <Quote className="h-3.5 w-3.5" />, action: () => editor.chain().focus().toggleBlockquote().run(), active: editor.isActive("blockquote") },
      { label: "Code block", icon: <Code2 className="h-3.5 w-3.5" />, action: () => editor.chain().focus().toggleCodeBlock().run(), active: editor.isActive("codeBlock") },
      { label: "Divider", icon: <Minus className="h-3.5 w-3.5" />, action: () => editor.chain().focus().setHorizontalRule().run() },
    ],
    [
      { label: "Link", icon: <Link2 className="h-3.5 w-3.5" />, action: setLink, active: editor.isActive("link") },
      { label: "Image", icon: <ImageIcon className="h-3.5 w-3.5" />, action: addImage },
    ],
  ];

  return (
    <div className="border border-border rounded-2xl overflow-hidden bg-surface">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-1 px-3 py-2 border-b border-border bg-surface-2">
        {TOOLBAR.map((group, gi) => (
          <div key={gi} className={cn("flex items-center gap-0.5", gi < TOOLBAR.length - 1 && "pr-2 border-r border-border mr-1")}>
            {group.map((btn) => (
              <button
                key={btn.label}
                type="button"
                title={btn.label}
                onClick={btn.action}
                className={cn(
                  "h-7 w-7 rounded-lg flex items-center justify-center transition-colors",
                  btn.active ? "bg-accent text-accent-foreground" : "text-muted hover:text-text hover:bg-border"
                )}
              >
                {btn.icon}
              </button>
            ))}
          </div>
        ))}
        <span className="ml-auto text-xs text-muted">
          {editor.storage.characterCount.words()} words
        </span>
      </div>

      {/* Editor area */}
      <EditorContent editor={editor} />
    </div>
  );
}
