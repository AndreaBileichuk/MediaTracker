import {useEffect, useState} from "react";
import {myMediaApi, type MyMediaListApiResponse} from "../../api/myMediaApi.ts";
import Pagination from "../common/Pagination/Pagination.tsx";
import {useNavigate} from "react-router-dom";

function MediaList() {
    const [myMedia, setMyMedia] = useState<MyMediaListApiResponse | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const navigate = useNavigate();

    useEffect(() => {

        async function handleFetch() {
            const result = await myMediaApi.getMedia(currentPage);
            const data = result.data;

            if(data.isSuccess && data.data) {
                setMyMedia(data.data);
            }
        }
        handleFetch();
    }, [currentPage])

    if(myMedia == null || myMedia.results == null) {
        return <div>Loading...</div>
    }

    return (
        <div>
            {myMedia.results.length == 0 && <div>
                <h1>Start your collection right now!</h1>
                <button onClick={() => {
                    navigate("/media/search");
                }}>Go!</button>
            </div>}

            {myMedia.results.map(m => (
                <div>{m.title}</div>
            ))}

            <Pagination
                totalPages = {myMedia.totalPages}
                currentPage={currentPage}
                setCurrentPage = {setCurrentPage}
            />
        </div>
    );
}

export default MediaList;