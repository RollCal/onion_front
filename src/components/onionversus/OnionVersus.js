import React, {useEffect, useState, useRef, useCallback} from 'react';
import axios from "axios";
import OnionVersusFlow from "./OnionVersusFlow";
import {Box, Button, Input, InputGroup, InputLeftElement, Skeleton, Stack, useMediaQuery} from "@chakra-ui/react";
import {SearchIcon} from '@chakra-ui/icons';

function OnionVersus(props) {
    const [versusList, setVersusList] = useState([]);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [order, setOrder] = useState("popular");
    const [pendingSearch, setPendingSearch] = useState("");
    const [isMobileView] = useMediaQuery("(max-width: 1050px)");

    const getVersusList = async (pageNumber, reset = false) => {
        try {
            setLoading(true);
            const response = await axios.get(`/api/onions/onionlist?order=${order}&page=${pageNumber}`);
            setVersusList(prevData => reset ? response.data.data : [...prevData, ...response.data.data]);
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
        setVersusList([]);
        if (page !== 1) {
            setPage(1);
        } else {
            getVersusList(1, true);
        }
    }, [order]);

    const observer = useRef();
    const lastItemElementRef = useCallback(node => {
        if (loading) return;
        if (observer.current) observer.current.disconnect();
        observer.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && hasMore) {
                setPage(prevPage => prevPage + 1);
            }
        }, {threshold: 0.5});
        if (node) observer.current.observe(node);
    }, [loading, hasMore]);

    const handleOrderChange = (newOrder) => {
        setPendingSearch("")
        setOrder(newOrder);
    };

    const handlePendingSearchChange = (event) => {
        setPendingSearch(event.target.value);
    };

    const handleSearchSubmit = (event) => {
        event.preventDefault();
        if (pendingSearch.trim() !== "") {
            setOrder(`search: ${pendingSearch}`);
        }
    };

    const handleKeyPress = (event) => {
        if (event.key === 'Enter') {
            handleSearchSubmit(event);
        }
    };

    return (
        <Box position="relative">
            {!isMobileView && (
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
                    <Button
                        backgroundColor={order === 'popular' ? '#F24822' : 'transparent'}
                        color={order === 'popular' ? 'white' : 'black'}
                        borderColor="black"
                        border="2px"
                        mr='5px'
                        onClick={() => handleOrderChange('popular')}
                    >
                        인기순
                    </Button>
                    <Button
                        backgroundColor={order === 'latest' ? '#F24822' : 'transparent'}
                        color={order === 'latest' ? 'white' : 'black'}
                        borderColor="black"
                        border="2px"
                        mr='5px'
                        onClick={() => handleOrderChange('latest')}
                    >
                        최신순
                    </Button>
                    <Button
                        backgroundColor={order === 'old' ? '#F24822' : 'transparent'}
                        color={order === 'old' ? 'white' : 'black'}
                        borderColor="black"
                        border="2px"
                        mr='5px'
                        onClick={() => handleOrderChange('old')}
                    >
                        날짜순
                    </Button>
                    <Box flex="1"></Box>
                </Box>
            )}
            <Box
                position="absolute"
                top="-83px"
                left="50%"
                transform="translateX(-50%)"
                display="flex"
                justifyContent="center"
                alignItems="center"
                zIndex="1000"
                bg="white"
                p={2}
                borderRadius="md"
            >
                <InputGroup>
                    <InputLeftElement pointerEvents="none">
                        <SearchIcon color="gray.300"/>
                    </InputLeftElement>
                    <Input
                        type="text"
                        value={pendingSearch}
                        onChange={handlePendingSearchChange}
                        onKeyPress={handleKeyPress}
                        placeholder="어니언을 검색하세요!"
                        size="md"
                        bg="white.100"
                        borderRadius="50px"
                        borderWidth="1px"
                        borderColor="gray.300"
                        boxShadow="sm"
                        pr={5}
                        w="300px"
                    />
                </InputGroup>
            </Box>
            <form id="searchForm" onSubmit={handleSearchSubmit} style={{display: 'none'}}>
                {/* 검색 폼 컨텐츠 */}
            </form>
            {versusList.map((item, index) => (
                <OnionVersusFlow versus_data={item} key={index}/>
            ))}
            {loading &&
                <Box padding="40px">
                    <Stack>
                        <Skeleton width='100%' height='500px'/>
                        <Skeleton width='100%' height='500px'/>
                        <Skeleton width='100%' height='500px'/>
                    </Stack>
                </Box>}
            <div ref={lastItemElementRef}></div>
        </Box>
    );
}

export default OnionVersus;
