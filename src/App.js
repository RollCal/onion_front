import {ChakraProvider} from '@chakra-ui/react'
import {BrowserRouter, Route, Routes} from "react-router-dom";
import Home from "./components/route/Home";
import Detail from "./components/route/Detail";
function App() {

    return (
        <ChakraProvider>
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
