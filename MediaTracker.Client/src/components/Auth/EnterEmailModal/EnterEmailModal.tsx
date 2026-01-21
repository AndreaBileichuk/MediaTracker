import {createPortal} from "react-dom";
import s from "../../common/ConfirmationModal/ConfirmationModal.module.css";
import {X} from "lucide-react";
import {CustomInput} from "../../common/CustomInput.tsx";
import {type FormEvent, useState} from "react";
import RedCustomBtn from "../../common/CustomButtons/RedCustomBtn.tsx";

interface EnterEmailModalProps {
    isOpen: boolean,
    onClose: () => void
    onConfirm: (email: string) => Promise<void>
    isLoading: boolean
}

const modalRoot = document.getElementById("modal");

function EnterEmailModal({isOpen, onClose, onConfirm, isLoading}: EnterEmailModalProps) {
    const [email, setEmail] = useState("");

    if (!isOpen || modalRoot == null) return null;

    async function handleSubmit(e : FormEvent<HTMLFormElement>) {
        e.preventDefault();
        await onConfirm(email);
        setEmail("")
    }

    function handleClose() {
        onClose();
        setEmail("")
    }

    return createPortal((
            <div className={s.overlay} onClick={handleClose}>
                <div className={s.modal} onClick={(e) => e.stopPropagation()}>
                    <div className={s.header}>
                        <h3>Write your email</h3>
                        <button onClick={onClose} className={s.closeBtn}><X size={20}/></button>
                    </div>

                    <form className={s.body} onSubmit={handleSubmit}>
                        <CustomInput
                            label=""
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="your@email.com"
                            required
                        />

                        <div className={s.footer}>
                            <button className={s.cancelBtn} onClick={handleClose}>Cancel</button>
                            <RedCustomBtn isLoading={isLoading} text={"Save"}/>
                        </div>
                    </form>
                </div>
            </div>
        ),
        modalRoot
    );
}

export default EnterEmailModal;