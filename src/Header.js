import React from "react";
import {NavLink} from "react-router-dom"

function Header () {
    return (
        <header className="App-header">
            <NavLink to="/">
                <h1>Contentful Cookbook</h1>
            </NavLink>
        </header>
    )
}

export default Header