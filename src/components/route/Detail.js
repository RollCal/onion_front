import React from 'react';
import Layout from "../Layout";
import Onions from "../onionversus/Onions";

function Detail(props) {

    return (
        <Layout>
            <div style={{display: 'flex', justifyContent: 'center'}}>
                <Onions/>
            </div>
        </Layout>
    );
}

export default Detail;