import React, { useEffect, useState, useRef, useCallback } from 'react';
import axios from "axios";
import OnionVersusFlow from "./OnionVersusFlow";

function OnionVersus(props) {
    const [versusList, setVersusList] = useState([]);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true); // 더 이상 불러올 페이지가 있는지 여부

    const itemsPerPage = 3; // 백엔드에서 반환하는 항목 수에 맞춰 조정

    const getVersusList = async (pageNumber) => {
        try {
            setLoading(true);
            const response = await axios.get(`/api/onions/onionlist?order=popular&search=&page=${pageNumber}`);
            setVersusList(prevData => [...prevData,...response.data.data]);
            setHasMore(response.data.meta.num_page > pageNumber); // 페이지 번호가 총 페이지 수보다 작거나 같으면 더 이상 불러올 페이지가 없음
            setLoading(false);
        } catch (error) {
            setLoading(false);
            console.error(error);
        }
    };

    useEffect(() => {
        getVersusList(page);
    }, [page]);

    const observer = useRef();
    const lastItemElementRef = useCallback(node => {
        if (loading) return;
        if (observer.current) observer.current.disconnect();
        observer.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && hasMore) {
                setPage(prevPage => prevPage + 1);
            }
        }, { threshold: 0.5 }); // 스크롤이 끝에 가까워졌을 때 콜백을 트리거
        if (node) observer.current.observe(node);
    }, [loading, hasMore]);

    return (
        <div>
            {versusList.map((item, index) => (
                <OnionVersusFlow versus_data={item} key={index} />
            ))}
            {loading && <p>Loading...</p>}
            <div ref={lastItemElementRef}></div>
        </div>
    );
}

export default OnionVersus;
