import Layout from "./components/Layout";
import {ChakraProvider} from '@chakra-ui/react'

function App() {

    return (
        <ChakraProvider>
            <Layout />
        </ChakraProvider>
    );
}

export default App;
