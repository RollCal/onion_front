import React from 'react';

function Layout(props) {
    return (
        <div>
            <nav style={{
                backgroundColor: "black",
                marginBottom: "30px",
            }}>
                네브바
            </nav>
            <main>
                {props.children}
            </main>
            <footer style={{
                backgroundColor: "black",
                marginBottom: "30px",
            }}>
                푸터
            </footer>
        </div>
    );
}

export default Layout;