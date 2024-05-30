import './App.css';
import OnionVersusFlow from "./components/OnionVersusFlow";
import Layout from "./components/Layout";
import OnionVersus from "./components/OnionVersus";

function App() {
    return (
        <Layout>
            <div style={{
                display: "flex",
                flexWrap: "wrap",
                justifyContent: "space-around",
            }}>
                <OnionVersus/>
            </div>
        </Layout>
    );
}

export default App;
