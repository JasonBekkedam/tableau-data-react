import React, { useEffect, useState } from "react";
import { Button, Modal } from "react-bootstrap";
import DataTableComponent from "./DataTableComponent";
import LoadingIndicatorComponent from "./LoadingIndicatorComponent";
import SheetListComponent from "./SheetListComponent";
import "./styles/Main.css";
import BasicTable from "./TableComponent";

import CardComponent from "./CardComponent";

// Declare this so our linter knows that tableau is a global object
/* global tableau */

function MainComponent() {
	const [isLoading, setIsLoading] = useState(true);
	const [selectedSheet, setSelectedSheet] = useState(undefined);
	const [sheetNames, setSheetNames] = useState([]);
	const [rows, setRows] = useState([]);
	const [headers, setHeaders] = useState([]);
	const [dataKey, setDataKey] = useState(1);
	const [filteredFields, setFilteredFields] = useState([]);
	const [dashboardName, setDashboardName] = useState("");

	const [worksheetNames, setworksheetNames] = useState([]);
	const [dataTable, setdataTable] = useState([]);

	let unregisterEventFn = undefined;

	useEffect(() => {
		getData();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	async function getData() {
		console.log("ok");

		const initialize = await initAsync();
		console.log(initialize);

		//elements on the dashboard where the extension is located
		const dashboardContents = await getDashboardContents();
		console.log("dashboardContents", dashboardContents);

		//List of worksheetNames
		const worksheetNames = await getWorksheetNames(dashboardContents);
		setworksheetNames(worksheetNames);
		console.log("worksheetNames", worksheetNames);

		//Create JSON DataTables
		const dataTables = await getDataTables(worksheetNames);
		setdataTable(dataTables);
		console.log("dataTables", dataTables);
	}

	const getDashboardContents = () => {
		return tableau.extensions.dashboardContent.dashboard;
	};

	const initAsync = () => {
		return tableau.extensions.initializeAsync();
	};

	const getWorksheetNames = (dashboardContens) => {
		const tableNames = [];
		for (const sheet in dashboardContens["worksheets"]) {
			const worksheetName = dashboardContens["worksheets"][sheet]["name"];
			console.log("sheet", dashboardContens["worksheets"][sheet]);

			tableNames.push(worksheetName);
		}

		return tableNames;
	};

	async function getDataTables(worksheetNames) {
		//what will be returned in the end
		const dataTablesDict = {};

		//all worksheets
		const worksheets =
			tableau.extensions.dashboardContent.dashboard.worksheets;

		//cycle through worksheets
		for (const sheetIndex in worksheetNames) {
			const sheetName = worksheetNames[sheetIndex];
			const worksheet = worksheets.find(function (sheet) {
				return sheet.name === sheetName;
			});

			console.log("worksheet", worksheet);

			const getDataTable = () =>
				worksheet.getSummaryDataAsync().then(function (worksheetData) {
					return worksheetData;
				});

			const dataTable = await getDataTable();

			const jsonData = [];

			//build JSON
			//get a list of Column Names for each Datatable
			const columnList = dataTable.columns;
			console.log({ columnList });
			const columnNameList = [];

			for (const columnIndex in columnList) {
				const columnName = columnList[columnIndex].fieldName;

				columnNameList.push(columnName);
			}

			for (const dataRowIndex in dataTable.data) {
				console.log("test1", dataTable["data"]);
				const dataRow = dataTable["data"][dataRowIndex];

				const dataValueFinal = {};

				for (const columnNameIndex in columnNameList) {
					const columnName = columnNameList[columnNameIndex];

					//Create Dict Of All Data For Each Column Name
					dataValueFinal[columnName] =
						dataRow[columnNameIndex]["value"];

					dataValueFinal["tableauSheetName"] = sheetName;
				}
				jsonData.push(dataValueFinal);
			}

			dataTablesDict[sheetName] = jsonData;
		}
		console.log({ dataTablesDict });
		return dataTablesDict;
	}

	let output = (
		<div>
			<BasicTable></BasicTable>
			<CardComponent dataTable={dataTable}></CardComponent>
		</div>
	);

	return <>{output}</>;
}

export default MainComponent;
