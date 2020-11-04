import React from 'react';
import {
  Link,
  NavLink
} from "react-router-dom";

const NavBar = () => {
  return (
    <nav className="navbar navbar-inverse navbar-fixed-top">
        <div className="container-fluid navigation">
            <div className="navbar-header">
                <button type="button" className="navbar-toggle collapsed" data-toggle="collapse" data-target="#navbar" aria-expanded="false" aria-controls="navbar">
                <span className="sr-only">Toggle navigation</span>
                <span className="icon-bar"></span>
                <span className="icon-bar"></span>
                <span className="icon-bar"></span>
                </button>
                <Link className="navbar-brand" to="/">Scrum Poker</Link>
            </div>
            <div id="navbar" className="collapse navbar-collapse">
                <ul className="nav navbar-nav">
                    <li data-toggle="collapse" data-target=".navbar-collapse.in">
                        <NavLink to="/sessions">Sessions</NavLink>
                    </li>
                    <li data-toggle="collapse" data-target=".navbar-collapse.in">
                        <NavLink to="/instructions">Instructions</NavLink>
                    </li>
                    <li data-toggle="collapse" data-target=".navbar-collapse.in">
                        <NavLink to="/impressum">Impressum</NavLink>
                    </li>
                </ul>
            </div>
        </div>
    </nav>
  );
}

export default NavBar;
