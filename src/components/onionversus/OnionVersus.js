import React, { useEffect, useState, useRef, useCallback } from 'react';
import axios from "axios";
import OnionVersusFlow from "./OnionVersusFlow";
import {Box} from "@chakra-ui/react";

function OnionVersus(props) {
    const [versusList, setVersusList] = useState([]);
    const [loading] = useState(false);
    const [page, setPage] = useState(1);
    const itemsPerPage = 3; // 백엔드에서 반환하는 항목 수에 맞춰 조정

    async function getVersusList(pageNumber) {
        try {
            const response = await axios.get(`/api/onions/onionlist?order=popular&page=${pageNumber}`);
            return response.data.data;
        } catch (error) {
            console.error(error);
            return [];
        }
    }

    useEffect(() => {
        getVersusList(page).then(data => {
            setVersusList(prevData => [...prevData,...data]);
        });
    }, [page]);

    const observer = useRef();
    const lastItemElementRef = useCallback(node => {
        if (loading) return;
        if (observer.current) observer.current.disconnect();
        observer.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting) {
                setPage(prevPage => prevPage + 1);
            }
        });
        if (node) observer.current.observe(node);
    }, [loading]);

    return (
        <Box>
            {
                versusList.map((item, index) => (
                    <OnionVersusFlow versus_data={item} key={index}/>
                ))
            }
            <div ref={lastItemElementRef}></div>
        </Box>
    );
}

export default OnionVersus;
