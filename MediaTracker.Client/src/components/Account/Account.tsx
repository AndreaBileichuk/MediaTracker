import {useDispatch, useSelector} from "react-redux";
import type {AppDispatch, RootState} from "../../bll/store.ts";
import Avatar from "../common/Avatar.tsx";
import styles from "./Account.module.css";
import React, {useRef} from "react";
import {uploadUserAvatar} from "../../bll/account/thunks.ts";
import {Camera, Loader2} from "lucide-react";

function Account() {
    const dispatch = useDispatch<AppDispatch>();
    const {user, status} = useSelector((state: RootState) => state.account);

    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleAvatarClick = () => {
        if (status !== 'loading') {
            fileInputRef.current?.click();
        }
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];

        if (file) {
            dispatch(uploadUserAvatar(file));
        }
    };

    if (!user) return null;

    const isUploading = status === 'loading';

    return (
        <div className={styles.container}>
            <div className={styles.card}>
                <div
                    className={styles.avatarWrapper}
                    onClick={handleAvatarClick}
                    title="Click to change avatar"
                >
                    <Avatar avatarUrl={user.avatarUrl} />

                    <div className={styles.avatarOverlay}>
                        {isUploading ? (
                            <Loader2 className={styles.spinner} size={32} />
                        ) : (
                            <Camera className={styles.cameraIcon} size={32} />
                        )}
                    </div>
                </div>

                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    style={{ display: "none" }}
                    accept="image/png, image/jpeg, image/jpg"
                />

                <div className={styles.info}>
                    <h1 className={styles.username}>{user.username}</h1>
                    <div className={styles.email}>{user.email}</div>
                </div>
            </div>
        </div>
    );
}

export default Account;