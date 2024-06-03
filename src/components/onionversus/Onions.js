import React, {useEffect, useState} from 'react';
import axios from "axios";
import {useParams} from "react-router";
import OnionFlow from "./OnionFlow";
import CreateOnion from "./CreateOnion";

function Onions(props) {

    const param = useParams();

    const [onionList, setOnionList] = useState([]);

    async function getVersusList(onion_id) {
        try {
            const response = await axios.get(`/api/onions/${onion_id}`);
            return response.data.children;
        } catch (error) {
            console.error(error);
            return [];
        }
    }

    const GetComments = ({comment, depth=0},) => {
        return (
            <div>

                <h3 style={{marginLeft: depth*20}}>{comment.title}</h3>
                {comment.children && comment.children.map(childComment =>
                    <GetComments key={childComment.id} comment={childComment} depth={depth+1} />
                )}
            </div>
        )
    }

    const setOnionListFunction = (data) => {
        setOnionList([...onionList, data]);
    }

    useEffect(() => {
        getVersusList(param.onion_id).then((data => setOnionList(data)));
    }, [param]); // 목록에있는 데이터들이 변경 될때마나 리랜더링, 공백일때는 무조건 한번 랜더링


    return (
        <div>
            <OnionFlow onion_id={param.onion_id} key={param.onion_id}/>
            <div>
                댓글
                <hr/>
                {onionList.map(comment =>
                    <GetComments key={comment.id} comment={comment}/>
                )}
            </div>
            <CreateOnion onion_id={param.onion_id} setOnionList={setOnionListFunction} />
        </div>
    );
}

export default Onions;