import React, { useEffect, useState, useRef, useCallback } from 'react';
import axios from "axios";
import OnionVersusFlow from "./OnionVersusFlow";

function OnionVersus(props) {
    const [versusList, setVersusList] = useState([]);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true); // 더 이상 불러올 페이지가 있는지 여부
    const itemsPerPage = 3; // 백엔드에서 반환하는 항목 수에 맞춰 조정
    const [order, setOrder] = useState("latest");
    const [search, setSearch] = useState("");

    const getVersusList = async (pageNumber) => {
        try {
            setLoading(true);
            const response = await axios.get(`/api/onions/onionlist?order=${order}&search=${search}&page=${pageNumber}`);
            setVersusList(prevData => [...prevData, ...response.data.data]);
            setHasMore(response.data.meta.num_page > pageNumber); // 페이지 번호가 총 페이지 수보다 작거나 같으면 더 이상 불러올 페이지가 없음
            setLoading(false);
        } catch (error) {
            setLoading(false);
            console.error(error);
        }
    };

    useEffect(() => {
        getVersusList(page);
    }, [page, order, search]);

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

    const handleOrderChange = (newOrder) => {
        setOrder(newOrder);
        setPage(1);
        setVersusList([]);
    };

    const handleSearchChange = (event) => {
        setSearch(event.target.value);
    };

    const handleSearchSubmit = (event) => {
        event.preventDefault();
        setPage(1);
        setVersusList([]);
    };

    return (
        <div>
            <div style={{ display: "flex", justifyContent: "flex-end" }}>
                <button onClick={() => handleOrderChange('popular')}>인기순</button>
                <button onClick={() => handleOrderChange('latest')}>최신순</button>
                <button onClick={() => handleOrderChange('old')}>날짜순</button>
            </div>
            <form onSubmit={handleSearchSubmit} style={{ display: "flex", justifyContent: "flex-end", margin: "10px 0" }}>
                <input
                    type="text"
                    value={search}
                    onChange={handleSearchChange}
                    placeholder="검색어를 입력하세요"
                />
                <button type="submit">검색</button>
            </form>
            {versusList.map((item, index) => (
                <OnionVersusFlow versus_data={item} key={index} />
            ))}
            {loading && <p style={{ fontSize: '120px' }}>Loading...</p>}
            <div ref={lastItemElementRef}></div>
        </div>
    );
}

export default OnionVersus;
