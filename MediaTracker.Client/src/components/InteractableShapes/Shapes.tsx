import {forwardRef, useEffect, useImperativeHandle, useState} from 'react';
import styles from './Shapes.module.css';
import {Face, type FaceMode} from "./Face.tsx";

const useMousePosition = () => {
    const [position, setPosition] = useState({ x: 0, y: 0 });

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            setPosition({ x: e.clientX, y: e.clientY });
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    return position;
};

export interface ShapesHandle {
    startTyping: () => void;
    showPassword: () => void;
    reset: () => void;
}

const Shapes = forwardRef<ShapesHandle>((_, ref) => {
    const { x, y } = useMousePosition();
    const [mode, setMode] = useState<FaceMode>('normal');

    useImperativeHandle(ref, () => {
        return {
            startTyping() {
                setMode('typing');
            },
            showPassword() {
                setMode('hiding');
            },
            reset() {
                setMode('normal');
            }
        }
    });

    return (
        <div className={styles.container}>
            <div className={styles.shapes}>
                <div className={styles.square}>
                    <Face mouseX={x} mouseY={y} mode={mode}/>
                </div>

                <div className={styles.semicircle}>
                    <Face mouseX={x} mouseY={y} mode={mode}/>
                </div>

                <div className={styles.rectangle}>
                    <Face mouseX={x} mouseY={y} mode={mode}/>
                </div>
            </div>
        </div>
    );
});

export default Shapes;