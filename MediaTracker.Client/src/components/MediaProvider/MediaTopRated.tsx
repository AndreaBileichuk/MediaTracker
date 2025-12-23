import {useEffect, useState} from "react";
import {mediaApi, type MediaApiResponse} from "../../api/mediaApi.ts";
import MediaList from "./common/MediaList.tsx";
import Pagination from "../common/Pagination/Pagination.tsx";
import styles from "./MediaProvider.module.css";
import {Outlet} from "react-router-dom";

function MediaTopRated() {
    const [media, setMedia] = useState<MediaApiResponse | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [currentPage, setCurrentPage] = useState<number>(1);

    useEffect(() => {
        async function fetchList() {
            try {
                setIsLoading(true);
                const response = await mediaApi.getTopRated("movie", currentPage);
                const result = response.data;

                if(!result.isSuccess || !result.data) {
                    alert("Something went wrong");
                    return;
                }

                setMedia(result.data);
            }
            catch(error) {
                console.log(error);
            }
            finally {
                setIsLoading(false);
            }
        }

        fetchList();
    }, [currentPage]);

    if(isLoading || !media || !media.results) {
        return <div>Loading...</div>
    }

    return (
        <div className={styles.container}>
            <h1 style={{ color: 'white', marginBottom: '2rem' }}>Top Rated Media</h1>
            <MediaList mediaList={media.results}/>

            <Pagination
                totalPages={media.totalPages}
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
            />

            <Outlet/>
        </div>
    );
}

export default MediaTopRated;