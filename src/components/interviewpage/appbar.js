import * as React from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import "./appbar.css"



export default function PrimarySearchAppBar() {
    const location = useLocation();
    return (
        <>
            <div className="fill"></div>
            <nav id="navbar">
                <ul>     
                    <button className='fill' onClick={() => {navigator.clipboard.writeText(location.pathname)}}>Share Link</button>
                   
                </ul>
            </nav>
            <div className="filler two"></div>
        </>
    );
}
