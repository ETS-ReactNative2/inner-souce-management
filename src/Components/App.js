import React, { useState, Fragment } from 'react';
import Routes from './Routes/Routes';
import Sidebar from './Navigation/Sidebar';
import Modal from './Containers/Modal';
import { BrowserRouter } from 'react-router-dom';

const App = () => {

    return (
        <Fragment>
            <Modal/>
            <BrowserRouter>
                <div className=" bg-nebula-grey-200 w-full h-full antialiased">
                    <div className="flex flex-col lg:flex-row justify-center">
                        <Sidebar />
                        <div className="w-full lg:flex-row lg:max-w-screen-xl">
                            <Routes />
                        </div>
                    </div>
                </div>
            </BrowserRouter>
        </Fragment>
    );
};
export default App;
