import {ChakraProvider} from '@chakra-ui/react'
import {BrowserRouter, Route, Routes} from "react-router-dom";
import Home from "./components/route/Home";
import Detail from "./components/route/Detail";
import Header from "./Header";
function App() {

    return (
        <ChakraProvider>
            <Header />
                <BrowserRouter>
                    <Routes>
                        <Route path="/" element={<Home/>}/>
                        <Route path="onion/:onion_id" element={<Detail />}/>
                    </Routes>
                </BrowserRouter>
        </ChakraProvider>
    );
}

export default App;
