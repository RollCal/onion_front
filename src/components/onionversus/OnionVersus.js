import React, {useEffect, useState, useRef, useCallback} from 'react';
import axios from "axios";
import OnionVersusFlow from "./OnionVersusFlow";
import {Box, Button} from "@chakra-ui/react";

function OnionVersus(props) {
    const [versusList, setVersusList] = useState([]);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [order, setOrder] = useState('popular')
    const [hasMore, setHasMore] = useState(true); // 더 이상 불러올 페이지가 있는지 여부
    const getVersusList = async (searchOrder, searchPage) => {
        try {
            setLoading(true);
            const response = await axios.get(`/api/onions/onionlist?order=${searchOrder}&search=&page=${searchPage}`);
            setVersusList(prevData => [...prevData, ...response.data.data]);
            setHasMore(response.data.meta.num_page > searchPage); // 페이지 번호가 총 페이지 수보다 작거나 같으면 더 이상 불러올 페이지가 없음
            setLoading(false);
        } catch (error) {
            setLoading(false);
        }
    };

    useEffect(() => {
        getVersusList(order, page);
    }, [page]);

    const observer = useRef();
    const lastItemElementRef = useCallback(node => {
        if (loading) return;
        if (observer.current) observer.current.disconnect();
        observer.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && hasMore) {
                setPage(prevPage => prevPage + 1);
            }
        }, {threshold: 0.5}); // 스크롤이 끝에 가까워졌을 때 콜백을 트리거
        if (node) observer.current.observe(node);
    }, [loading, hasMore]);

    const handleOrderChange = (newOrder) => {
        setVersusList([]);
        setOrder(newOrder);
        setPage(1);
    };
    return (

        <Box>
            <Box style={{display: "flex", justifyContent: "flex-end"}} gap={3}>
                <Button colorScheme='gray' variant='outline' borderColor="black" border="2px"
                        onClick={() => handleOrderChange('popular')}>
                    인기순
                </Button>
                 <Button colorScheme='gray' variant='outline' borderColor="black" border="2px"
                         onClick={() => handleOrderChange('latest')}>
                    최신순
                </Button>
                 <Button colorScheme='gray' variant='outline' borderColor="black" border="2px"
                         onClick={() => handleOrderChange('old')}>
                    날짜순
                </Button>
            </Box>
            {versusList.map((item, index) => (
                <OnionVersusFlow versus_data={item} key={index}/>
            ))}
            {loading && <Box padding="40px">
                Loding...
            </Box>}
            <div ref={lastItemElementRef}></div>
        </Box>
    );
}

export default OnionVersus;
