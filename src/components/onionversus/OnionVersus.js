import React, { useEffect, useState, useRef, useCallback } from 'react';
import axios from "axios";
import OnionVersusFlow from "./OnionVersusFlow";
import { Box, Button, Input } from "@chakra-ui/react";

function OnionVersus(props) {
    const [versusList, setVersusList] = useState([]);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [order, setOrder] = useState("");
    const [search, setSearch] = useState("");
    const [pendingSearch, setPendingSearch] = useState("");

    const getVersusList = async (pageNumber, reset = false) => {
        try {
            setLoading(true);
            const searchParam = search? `search:${search}` : '';
            const response = await axios.get(`/api/onions/onionlist?order=${order}${searchParam}&page=${pageNumber}`);
            setVersusList(prevData => reset? response.data.data : [...prevData,...response.data.data]);
            setHasMore(response.data.meta.num_page > pageNumber);
            setLoading(false);
        } catch (error) {
            setLoading(false);
            console.error(error);
        }
    };

    useEffect(() => {
        getVersusList(page);
    }, [page]);

    useEffect(() => {
        setPage(1);
        setVersusList([]);
        getVersusList(1, true);
    }, [order, search]);

    const observer = useRef();
    const lastItemElementRef = useCallback(node => {
        if (loading) return;
        if (observer.current) observer.current.disconnect();
        observer.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && hasMore) {
                setPage(prevPage => prevPage + 1);
            }
        }, { threshold: 0.5 });
        if (node) observer.current.observe(node);
    }, [loading, hasMore]);

    const handleOrderChange = (newOrder) => {
        setOrder(newOrder);
    };

    const handlePendingSearchChange = (event) => {
        setPendingSearch(event.target.value);
    };

    const handleSearchSubmit = (event) => {
        event.preventDefault();
        setSearch(pendingSearch);
    };

    return (
        <Box>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
                <Button colorScheme="gray" variant="outline" borderColor="black" border="2px" onClick={() => handleOrderChange('popular')}>
                    인기순
                </Button>
                <Button colorScheme="gray" variant="outline" borderColor="black" border="2px" onClick={() => handleOrderChange('latest')}>
                    최신순
                </Button>
                <Button colorScheme="gray" variant="outline" borderColor="black" border="2px" onClick={() => handleOrderChange('old')}>
                    날짜순
                </Button>
                <Box flex="1"></Box>
                <Input
                    type="text"
                    value={pendingSearch}
                    onChange={handlePendingSearchChange}
                    placeholder="검색어를 입력하세요"
                    size="md"
                    bg="white"
                    _placeholder={{ color: "gray.500" }}
                    borderRadius="lg"
                    borderWidth="1px"
                    borderColor="gray.300"
                    boxShadow="sm"
                    p={2}
                    w="400px"
                />
                <Button colorScheme="purple" variant="solid" type="submit" form="searchForm">
                    검색
                </Button>
            </Box>
            <form id="searchForm" onSubmit={handleSearchSubmit}>
                {/* 검색 폼 컨텐츠 */}
            </form>
            {versusList.map((item, index) => (
                <OnionVersusFlow versus_data={item} key={index} />
            ))}
            {loading && <Box padding="40px">Loding...</Box>}
            <div ref={lastItemElementRef}></div>
        </Box>
    );
}

export default OnionVersus;
