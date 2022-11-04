import React, { useEffect, useState } from "react";

const CardComponent = (props) => {
	const printProps = () => {
		if ("Sale Map" in props["dataTable"]) {
			console.log("dwqdwq");
			console.log("props", props["dataTable"]["Sale Map"]);
			const dataTable = props["dataTable"]["Sale Map"];
			console.log(dataTable.map((datapoint) => dataTable["State"]));
			return dataTable;
		} else {
			console.log("meh");
			return [];
		}
	};

	const data = printProps();

	const datapoint = data.map((datapoint) => <h1>{datapoint["State"]}</h1>);

	return <div>{datapoint}</div>;
};

export default CardComponent;
