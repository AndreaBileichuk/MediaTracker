import {useEffect, useRef, useState} from "react";
import styles from "./Shapes.module.css";

export type FaceMode = 'normal' | 'typing' | 'hiding';

interface FaceProps {
    mouseX: number;
    mouseY: number;
    mode: FaceMode;
}

export const Face = ({mouseX, mouseY, mode}: FaceProps) => {
    const faceRef = useRef<HTMLDivElement>(null);
    const [pupilPos, setPupilPos] = useState({x: 0, y: 0});
    const [eyebrowStyle, setEyebrowStyle] = useState({});
    const [mouthStyle, setMouthStyle] = useState({});

    useEffect(() => {
        if (!faceRef.current) return;

        if (mode === 'hiding') {
            setEyebrowStyle({transform: `translateY(0px) rotate(0deg)`});
            setMouthStyle({borderBottomLeftRadius: '20%', borderBottomRightRadius: '20%'});
            return;
        }

        if (mode === 'typing') {
            setPupilPos({x: -12, y: 0});
            setEyebrowStyle({transform: `translateY(-5px) rotate(0deg)`});
            setMouthStyle({borderBottomLeftRadius: '50%', borderBottomRightRadius: '50%'});
            return;
        }

        const rect = faceRef.current.getBoundingClientRect();
        const faceCenterX = rect.left + rect.width / 2;
        const faceCenterY = rect.top + rect.height / 2;

        const angle = Math.atan2(mouseY - faceCenterY, mouseX - faceCenterX);
        const maxRadius = 10;
        const x = Math.cos(angle) * maxRadius;
        const y = Math.sin(angle) * maxRadius;

        setPupilPos({x, y});

        const screenPercentY = mouseY / window.innerHeight;
        const eyebrowY = (screenPercentY - 0.5) * 15;
        const rotation = (screenPercentY - 0.5) * 15;

        setEyebrowStyle({
            transform: `translateY(${eyebrowY}px) rotate(${rotation}deg)`
        });

        const mouthCurve = 50 - (screenPercentY * 50);
        setMouthStyle({
            borderBottomLeftRadius: `${mouthCurve}%`,
            borderBottomRightRadius: `${mouthCurve}%`
        });

    }, [mouseX, mouseY, mode]);

    return (
        <div className={styles.face} ref={faceRef}>
            <div className={styles.eyebrows} style={eyebrowStyle}>
                <div className={styles.eyebrow}></div>
                <div className={styles.eyebrow}></div>
            </div>
            <div className={styles.eyesRow}>
                <div className={`${styles.eye} ${mode === 'hiding' ? styles.eyeClosed : ''}`}>
                    <div className={styles.pupil}
                         style={{transform: `translate(${pupilPos.x}px, ${pupilPos.y}px)`}}></div>
                    <div className={styles.lashes}>
                        <span className={styles.lash}></span>
                        <span className={styles.lash}></span>
                        <span className={styles.lash}></span>
                    </div>
                </div>
                <div className={`${styles.eye} ${mode === 'hiding' ? styles.eyeClosed : ''}`}>
                    <div className={styles.pupil}
                         style={{transform: `translate(${pupilPos.x}px, ${pupilPos.y}px)`}}></div>
                    <div className={styles.lashes}>
                        <span className={styles.lash}></span>
                        <span className={styles.lash}></span>
                        <span className={styles.lash}></span>
                    </div>
                </div>
            </div>
            <div className={styles.mouth} style={mouthStyle}></div>
        </div>
    );
};