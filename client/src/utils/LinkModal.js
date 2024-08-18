import React from "react";
import ReactModal from "react-modal";
import * as Icons from "./Icons";

// Modal setting.
const modalStyles = {
    overlay: {
        zIndex: 10000,
    },
    content: {
        top: "50%",
        left: "50%",
        right: "auto",
        bottom: "auto",
        width: 480,
        marginRight: "-50%",
        padding: 24,
        transform: "translate(-50%, -50%)",
        border: "2px solid var(--color-gray-4)",
        borderRadius: "4px",
    },
};

ReactModal.setAppElement("#root");

function Modal(props) {
    const { style, ...rest } = props;

    return (
        <ReactModal style={{ ...modalStyles, ...style }} {...rest}>
            {props.children}
        </ReactModal>
    );
}

export function LinkModal(props) {
    const { url, closeModal, onChangeUrl, onSaveLink, onRemoveLink, ...rest } = props;
    return (
        <Modal {...rest}>
            <h2 className="modal-title">Edit link</h2>
            <button className="modal-close" type="button" onClick={closeModal}>
                <Icons.X />
            </button>
            <input className="modal-input" autoFocus value={url} onChange={onChangeUrl} />
            <div className="modal-buttons">
                <button className="button-remove" type="button" onClick={onRemoveLink}>
                    Remove
                </button>
                <button className="button-save" type="button" onClick={onSaveLink}>
                    Save
                </button>
            </div>
        </Modal>
    );
}
