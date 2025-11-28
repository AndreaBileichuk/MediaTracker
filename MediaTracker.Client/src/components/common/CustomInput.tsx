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
                    // Додаємо клас з пропсів, якщо треба, але основний беремо зі стилів
                    className={`${styles.input} ${errorMessage ? styles.inputError : ''}`}
                />
                {children} {/* Кнопка ока рендериться тут, всередині relative блоку */}
            </div>
            {errorMessage && (
                <span className={styles.fieldError}>
                    {errorMessage}
                </span>
            )}
        </div>
    );
}