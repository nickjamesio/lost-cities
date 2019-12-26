import React from 'react'

import NavBar from "./GameAppBar";

function PageLayout({children}) {
    return (
        <>
            <NavBar />
            {children}
        </>
    );
}

export default PageLayout;