import {ChakraProvider, Box, Flex} from '@chakra-ui/react'
import {BrowserRouter, Route, Routes} from "react-router-dom";
import Home from "./components/route/Home";
import Detail from "./components/route/Detail";
import {GlobalProvider} from "./components/GlobalState";
import CreateVersus from "./components/route/CreateVersus";
function App() {

    return (
        <ChakraProvider>
            <GlobalProvider>
                <Flex direction="column" bg="gray.10" justifyContent="center" alignItems="center" p={0}> {/* 화면 중앙 정렬 */}
                    <Box width="70%" minWidth='800px' bg="white" boxShadow="md" direction="column" p={0} justifyContent="center" alignItems="center" height="100%">
                        <BrowserRouter>
                            <Routes>
                                <Route path="/" element={<Home/>}/>
                                <Route path="onion/:onion_id" element={<Detail />}/>
                                <Route path="versus/create" element={<CreateVersus />}/>
                            </Routes>
                        </BrowserRouter>
                    </Box>
                </Flex>
            </GlobalProvider>
        </ChakraProvider>
    );
}

export default App;
