import React from "react";
import "./HoverableIcon.css";

const HoverableIcon = ({ icon, text, position }) => {
	return (
		<div className="hoverable-icon-container">
			<div className="icon">{icon}</div>
			<div className={`tooltip ${position}`}>{text}</div>
		</div>
	);
};

export default HoverableIcon;
