import {X} from "lucide-react";
import s from "./ConfirmationModal.module.css";
import {createPortal} from "react-dom";

interface ConfirmationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    message: string;
    confirmLabel?: string;
}

const modalRoot = document.getElementById("modal");

function ConfirmationModal({ isOpen, onClose, onConfirm, title, message, confirmLabel = "Delete" }: ConfirmationModalProps) {
    if (!isOpen || modalRoot == null) return null;

    return createPortal(
        <div className={s.overlay} onClick={onClose}>
            <div className={s.modal} onClick={(e) => e.stopPropagation()}>
                <div className={s.header}>
                    <h3>{title}</h3>
                    <button onClick={onClose} className={s.closeBtn}><X size={20}/></button>
                </div>

                <div className={s.body}>
                    <p>{message}</p>
                </div>

                <div className={s.footer}>
                    <button className={s.cancelBtn} onClick={onClose}>Cancel</button>
                    <button className={s.confirmBtn} onClick={onConfirm}>
                        {confirmLabel}
                    </button>
                </div>
            </div>
        </div>,
        modalRoot
    );
}

export default ConfirmationModal;