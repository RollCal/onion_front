import React from 'react';
import Layout from "../Layout";
import OnionVersus from "../onionversus/OnionVersus";

function Home(props) {
    return (
        <Layout>
            <div style={{display: 'flex', justifyContent: 'center'}}>
                <OnionVersus/>
            </div>
        </Layout>
);
}

export default Home;