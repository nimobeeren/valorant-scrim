import React from 'react';

import Button from './Button';
import './../../styles/components/NavBar.css';


const NavBar = () => (
	<nav>
		<div className="nav__left">
			<h1 className="nav__item">CSGO Scrim Finder</h1>
		</div>
		<div className="nav__right">
			<div className="nav__item">
				<Button className="btn" label="Log in" onClick={() => alert("Not yet implemented")}/>
			</div>
			<div className="nav__item">
				<Button className="btn btn--secondary" label="About" onClick={() => alert("Not yet implemented")}/>
			</div>
		</div>
	</nav>
);

export default NavBar;
