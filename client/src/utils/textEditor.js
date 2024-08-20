import React, { useCallback, useState, forwardRef, useImperativeHandle } from "react";
import classNames from "classnames";
import { useEditor, EditorContent, BubbleMenu } from "@tiptap/react";
import Placeholder from "@tiptap/extension-placeholder";
import Document from "@tiptap/extension-document";
import Paragraph from "@tiptap/extension-paragraph";
import Text from "@tiptap/extension-text";
import Link from "@tiptap/extension-link";
import Bold from "@tiptap/extension-bold";
import Underline from "@tiptap/extension-underline";
import Italic from "@tiptap/extension-italic";
import Strike from "@tiptap/extension-strike";
import Code from "@tiptap/extension-code";
import History from "@tiptap/extension-history";
import * as Icons from "./Icons";
import { LinkModal } from "./LinkModal";

export const SimpleEditor = forwardRef(({ onChange, ...props }, ref) => {
    const editor = useEditor({
        extensions: [
            Document,
            History,
            Paragraph,
            Text,
            Link.configure({
                openOnClick: false,
            }),
            Bold,
            Underline,
            Italic,
            Strike,
            Code,
            Placeholder.configure({
                placeholder: "Type here...",
            }),
        ],
        content: "",
        onUpdate: ({ editor }) => {
            const content = editor.getHTML();
            if (onChange) {
                onChange(content);
            }
        },
    });

    useImperativeHandle(ref, () => ({
        getContent: () => editor.getHTML(),
    }));

    const [modalIsOpen, setIsOpen] = useState(false);
    const [url, setUrl] = useState("");

    const openModal = useCallback(() => {
        setUrl(editor.getAttributes("link").href);
        setIsOpen(true);
    }, [editor]);

    const closeModal = useCallback(() => {
        setIsOpen(false);
        setUrl("");
    }, []);

    const saveLink = useCallback(() => {
        if (url) {
            editor.chain().focus().extendMarkRange("link").setLink({ href: url, target: "_blank" }).run();
        } else {
            editor.chain().focus().extendMarkRange("link").unsetLink().run();
        }
        closeModal();
    }, [editor, url, closeModal]);

    const removeLink = useCallback(() => {
        editor.chain().focus().extendMarkRange("link").unsetLink().run();
        closeModal();
    }, [editor, closeModal]);

    const toggleBold = useCallback(() => {
        editor.chain().focus().toggleBold().run();
    }, [editor]);

    const toggleUnderline = useCallback(() => {
        editor.chain().focus().toggleUnderline().run();
    }, [editor]);

    const toggleItalic = useCallback(() => {
        editor.chain().focus().toggleItalic().run();
    }, [editor]);

    const toggleStrike = useCallback(() => {
        editor.chain().focus().toggleStrike().run();
    }, [editor]);

    const toggleCode = useCallback(() => {
        editor.chain().focus().toggleCode().run();
    }, [editor]);

    if (!editor) {
        return null;
    }

    return (
        <div className={classNames("editor", props.className)}>
            <div className="menu">
                <button
                    type="button"
                    className="menu-button"
                    onClick={() => editor.chain().focus().undo().run()}
                    disabled={!editor.can().undo()}
                >
                    <Icons.RotateLeft />
                </button>
                <button
                    type="button"
                    className="menu-button"
                    onClick={() => editor.chain().focus().redo().run()}
                    disabled={!editor.can().redo()}
                >
                    <Icons.RotateRight />
                </button>
                <button
                    type="button"
                    className={classNames("menu-button", {
                        "is-active": editor.isActive("link"),
                    })}
                    onClick={openModal}
                >
                    <Icons.Link />
                </button>
                <button
                    type="button"
                    className={classNames("menu-button", {
                        "is-active": editor.isActive("bold"),
                    })}
                    onClick={toggleBold}
                >
                    <Icons.Bold />
                </button>
                <button
                    type="button"
                    className={classNames("menu-button", {
                        "is-active": editor.isActive("underline"),
                    })}
                    onClick={toggleUnderline}
                >
                    <Icons.Underline />
                </button>
                <button
                    type="button"
                    className={classNames("menu-button", {
                        "is-active": editor.isActive("italic"),
                    })}
                    onClick={toggleItalic}
                >
                    <Icons.Italic />
                </button>
                <button
                    type="button"
                    className={classNames("menu-button", {
                        "is-active": editor.isActive("strike"),
                    })}
                    onClick={toggleStrike}
                >
                    <Icons.Strikethrough />
                </button>
                <button
                    type="button"
                    className={classNames("menu-button", {
                        "is-active": editor.isActive("code"),
                    })}
                    onClick={toggleCode}
                >
                    <Icons.Code />
                </button>
            </div>

            <BubbleMenu
                className="bubble-menu-light"
                tippyOptions={{ duration: 150 }}
                editor={editor}
                shouldShow={({ editor, view, state, oldState, from, to }) => {
                    return from === to && editor.isActive("link");
                }}
            >
                <button type="button" className="button" onClick={openModal}>
                    Edit
                </button>
                <button type="button" className="button-remove" onClick={removeLink}>
                    Remove
                </button>
            </BubbleMenu>

            <EditorContent editor={editor} className="editor-content" />

            <LinkModal
                url={url}
                isOpen={modalIsOpen}
                onRequestClose={closeModal}
                contentLabel="Edit Link Modal"
                closeModal={closeModal}
                onChangeUrl={(e) => setUrl(e.target.value)}
                onSaveLink={saveLink}
                onRemoveLink={removeLink}
            />
        </div>
    );
});
