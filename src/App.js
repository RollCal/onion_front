import {ChakraProvider} from '@chakra-ui/react'
import {BrowserRouter, Route, Routes} from "react-router-dom";
import Home from "./components/route/Home";
import Detail from "./components/route/Detail";
import {GlobalProvider} from "./components/GlobalState";
import CreateVersus from "./components/route/CreateVersus";
function App() {

    return (
        <ChakraProvider>
            <GlobalProvider>
                <BrowserRouter>
                    <Routes>
                        <Route path="/" element={<Home/>}/>
                        <Route path="onion/:onion_id" element={<Detail />}/>
                        <Route path="versus/create" element={<CreateVersus />}/>
                    </Routes>
                </BrowserRouter>
            </GlobalProvider>
        </ChakraProvider>
    );
}

export default App;
