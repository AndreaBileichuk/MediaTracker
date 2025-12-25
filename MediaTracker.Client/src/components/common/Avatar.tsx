import {User} from "lucide-react";

interface AvatarProps {
    avatarUrl: string | null
}

function Avatar({avatarUrl}: AvatarProps) {
    return (
        <>
            {avatarUrl
                ? <img src={avatarUrl} alt=""/>
                : <User size={20}/>
            }
        </>
    );
}

export default Avatar;