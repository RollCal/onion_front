import React from 'react';
import Layout from "../Layout";
import OnionVersus from "../onionversus/OnionVersus";

function Home(props) {
    return (
        <div style={{display: 'flex', justifyContent: 'center', height: '100vh',}}>
            <OnionVersus/>
        </div>
);
}

export default Home;
