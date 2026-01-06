import styles from "./GeneralStyles.module.css";
import type {ButtonHTMLAttributes} from "react";

interface RedCustomBtnProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    isLoading: boolean;
    text: string;
}


function RedCustomBtn({isLoading, text, ...props}: RedCustomBtnProps) {
    return (
        <button type="submit" className={styles.button} disabled={isLoading} {...props}>
            {isLoading ? <span className={styles.loader}></span> : text}
        </button>
    );
}

export default RedCustomBtn;