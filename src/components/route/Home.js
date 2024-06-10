import React from 'react';
import Layout from "../Layout";
import OnionVersus from "../onionversus/OnionVersus";

function Home(props) {
    return (
        <Layout>
            <div style={{justifyContent: 'center', height: '100%', width: '100%', paddingLeft:'3%', paddingRight:'3%'}}>
                <OnionVersus/>
            </div>
        </Layout>
);
}

export default Home;
