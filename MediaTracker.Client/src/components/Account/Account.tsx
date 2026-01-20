import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../bll/store.ts";
import Avatar from "../common/Avatar.tsx";
import styles from "./Account.module.css";
import React, { useRef } from "react";
import { uploadUserAvatar } from "../../bll/account/thunks.ts";
import { Camera, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import RedCustomBtn from "../common/CustomButtons/RedCustomBtn.tsx";
import { logout } from "../../bll/auth/authSlice.ts";

function Account() {
    const dispatch = useDispatch<AppDispatch>();
    const { user, status } = useSelector((state: RootState) => state.account);
    const navigate = useNavigate();

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
                <div className={styles.avatarSection}>
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

                    <div className={styles.info}>
                        <h1 className={styles.username}>{user.username}</h1>
                        <div className={styles.email}>{user.email}</div>
                    </div>
                </div>

                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    style={{ display: "none" }}
                    accept="image/png, image/jpeg, image/jpg"
                />

                <div className={styles.actions}>
                    <RedCustomBtn
                        onClick={() => navigate("change-password")}
                        isLoading={false}
                        text={"Change Password"}
                        style={{ width: "100%" }}
                    />

                    <RedCustomBtn
                        onClick={() => {
                            dispatch(logout());
                        }}
                        text={"Logout"}
                        isLoading={false}
                        style={{ width: "100%" }}
                    />
                </div>
            </div>
        </div>
    );
}

export default Account;