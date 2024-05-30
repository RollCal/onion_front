import React, {useEffect, useState} from 'react';
import axios from "axios";
import OnionVersusFlow from "./OnionVersusFlow";

function OnionVersus(props) {

    // 상태 변수 선언
    const [versusList, setVersusList] = useState([]);

    async function getVersusList() {
        try {
            const response = await axios.get('/api/onions/onionlist');
            console.log(response.data);
            return response.data;
        } catch (error) {
            console.error(error);
            return [];
        }
    }

    useEffect(() => {
        // getVersusList 함수 호출 후 결과를 상태 변수에 저장
        getVersusList().then(data => setVersusList(data));
    }, []);

    return (
        <div>
            {
                versusList.map(item => (
                    <OnionVersusFlow versus_id={item.id} key={item.id}/>
                ))
            }
        </div>
    );
}

export default OnionVersus;