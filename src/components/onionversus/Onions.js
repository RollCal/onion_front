import React, {useCallback, useEffect, useState} from 'react';
import axios from "axios";
import {useParams} from "react-router";
import OnionFlow from "./OnionFlow";
import CreateOnion from "./CreateOnion";
import {Link} from "react-router-dom";

function Onions(props) {

    const param = useParams();

    const [onionList, setOnionList] = useState([]);
    const [onion, setOnion] = useState();

    // 댓글 목록 불러오기
    async function getVersusComment(onion_id) {
        try {
            // 댓글 등록 대상 업데이트
            setOnion(onion_id);
            const response = await axios.get(`/api/onions/${onion_id}`);
            // 댓글 목록 리턴
            return response.data.children;
        } catch (error) {
            return [];
        }
    }

    // 댓글 렌더링
    const GetComments = ({comment, depth = 0},) => {
        return (
            <div style={{margin: "10px"}}>
                <h2><Link to={`/onion/${comment.id}`}>{comment.title}</Link></h2>
            </div>
        )
    }

    useEffect(() => {
        // 처음 렌더링시 route에서 가져온 id 로 댓글 목록 불러오기
        getVersusComment(param.onion_id).then((data => setOnionList(data)));
    }, [param.onion_id]); // 목록에있는 데이터들이 변경 될때마나 리랜더링, 공백일때는 무조건 한번 랜더링


    return (
        <div>
            {/*다이어 그램 생성*/}
            {/*getVersusComment는 노드 클릭시 해당 노드의 댓글을 가져오기 위해 사용*/}
            {/*setOnionList는 댓글 목록 리렌더링 하기위해 사용*/}
            <OnionFlow onion_id={param.onion_id} key={param.onion_id} getVersusComment={getVersusComment}
                       setOnionList={setOnionList}/>
            <div>
                댓글
                <hr/>
                {onionList.map(comment =>
                    <GetComments key={comment.id} comment={comment}/>
                )}
            </div>
            {/*댓글 작성 컴포넌트*/}
            {/*setOnionList는 댓글 작성후 댓글목록 리렌더링 하기위해 사용*/}
            <CreateOnion onion_id={onion} setOnionList={setOnionList}/>
        </div>
    );
}

export default Onions;