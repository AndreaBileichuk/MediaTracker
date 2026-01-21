import {createPortal} from "react-dom";
import {useState} from "react";
import s from "../../common/ConfirmationModal/ConfirmationModal.module.css";
import {X} from "lucide-react";
import {CustomInput} from "../../common/CustomInput.tsx";
import RedCustomBtn from "../../common/CustomButtons/RedCustomBtn.tsx";

interface SendVerificationModalProps {
    isOpen: boolean,
    onClose: () => void
    onConfirm: (email: string) => Promise<void>
    isLoading: boolean,
    initialEmail: string
}

const modalRoot = document.getElementById("modal");

function SendVerificationModal({isOpen, onClose, onConfirm, isLoading, initialEmail} : SendVerificationModalProps) {
    const [email, setEmail] = useState(initialEmail);

    if (!isOpen || modalRoot == null) return null;

    async function handleSubmit() {
        alert("FKDLFKDF")
    }

    async function handleClose() {

    }
    
    return createPortal(
        <div className={s.overlay} onClick={handleClose}>
            <div className={s.modal} onClick={(e) => e.stopPropagation()}>
                <div className={s.header}>
                    <h3>Verify your email.</h3>
                    <button onClick={onClose} className={s.closeBtn}><X size={20}/></button>
                </div>

                <div className={s.body}>
                    <CustomInput
                        label=""
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="your@email.com"
                        required
                    />

                    <div className={s.footer}>
                        <RedCustomBtn onClick={handleSubmit} isLoading={isLoading} text={"Send again"}/>
                    </div>
                </div>
            </div>
        </div>,
        modalRoot
    );
}

export default SendVerificationModal;