import React from 'react';
import Layout from "../Layout";
import Onions from "../onionversus/Onions";
import {useParams} from "react-router";
import OnionVersusFlow from "../onionversus/OnionVersusFlow";

function Detail(props) {

    const param = useParams();

    return (
        <Layout>
            {/*<OnionVersusFlow/>*/}
            <Onions/>
        </Layout>
    );
}

export default Detail;