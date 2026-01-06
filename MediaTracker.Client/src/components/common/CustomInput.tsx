import styles from "../Login/Login.module.css";
import type {InputHTMLAttributes, ReactNode} from "react";

interface CustomInputProps extends InputHTMLAttributes<HTMLInputElement> {
    label: string;
    errorMessage?: string;
    children?: ReactNode;
}

export function CustomInput({label, errorMessage, children, ...props}: Readonly<CustomInputProps>) {
    return (
        <div className={styles.field}>
            <label className={styles.label}>
                {label}
            </label>
            <div className={styles.inputWrapper}>
                <input
                    {...props}
                    className={`${styles.input} ${errorMessage ? styles.inputError : ''}`}
                />
                {children}
            </div>
            {errorMessage && (
                <span className={styles.fieldError}>
                    {errorMessage}
                </span>
            )}
        </div>
    );
}