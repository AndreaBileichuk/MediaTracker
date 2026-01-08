import {useEffect, useState} from "react";
import {mediaProviderApi, type MediaApiResponse, type MediaType} from "../../api/mediaProviderApi.ts";
import MediaList from "./common/MediaList.tsx";
import Pagination from "../common/Pagination/Pagination.tsx";
import styles from "./MediaProvider.module.css";
import {Outlet} from "react-router-dom";
import TypeSelector from "./common/TypeSelector.tsx";

function MediaTopRated() {
    const [media, setMedia] = useState<MediaApiResponse | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [type, setType] = useState<MediaType>("movie");

    useEffect(() => {
        async function fetchList() {
            try {
                setIsLoading(true);
                const response = await mediaProviderApi.getTopRated(type, currentPage);
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
    }, [currentPage, type]);

    function handleTypeChange(newType: MediaType) {
        if (type === newType) return;
        setType(newType);
        setCurrentPage(1);
    }

    if(isLoading || !media || !media.results) {
        return <div>Loading...</div>
    }

    return (
        <div className={styles.container}>
            <h1 style={{ color: 'white', marginBottom: '2rem' }}>Top Rated Media</h1>

            <TypeSelector handleTypeChange={handleTypeChange} type={type}/>

            <MediaList mediaList={media.results} type={type}/>

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