import React, { Component } from 'react';

//props: [your,table,headers], [[your,row,data],[4,2,3],[2,3,1]...]

export default class TableGenerator extends Component {
  markupHeaders = tableHeaders => {
    return (
      <tr>
        {tableHeaders.map(tableHeader => {
          return <th key={tableHeader}>{tableHeader}</th>;
        })}
      </tr>
    );
  };

  markupIndividualRows = row => {
    return (
      <tr key={row}>
        {row.map(rowItem => {
          return <td key={rowItem}>{rowItem}</td>;
        })}
      </tr>
    );
  };

  markupAllRows = rows => {
    return rows.map(row => {
      return this.markupIndividualRows(row);
    });
  };

  generateTable = (headers, rows) => {
    return (
      <tbody>
        {this.markupHeaders(headers)}
        {this.markupAllRows(rows)}
      </tbody>
    );
  };
  render() {
    return (
      <table>{this.generateTable(this.props.headers, this.props.rows)}</table>
    );
  }
}
