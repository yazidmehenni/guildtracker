import React, { Component } from 'react';

//props: [your,table,headers], [[your,row,data],[4,2,3],[2,3,1]...]

export default class TableGenerator extends Component {
  markupHeaders = tableHeaders => {
    return (
      <tr className="tr">
        {tableHeaders.map((tableHeader, i) => {
          return (
            <th className="th" key={i}>
              {tableHeader}
            </th>
          );
        })}
      </tr>
    );
  };

  markupIndividualRows = row => {
    return row.map((rowItem, i) => {
      return <td key={i}>{rowItem}</td>;
    });
  };

  markupAllRows = rows => {
    return rows.map((row, i) => {
      return (
        <tr className="tr" key={i}>
          {row && this.markupIndividualRows(row)}
        </tr>
      );
    });
  };

  generateTable = (headers, rows) => {
    return (
      <tbody className="tbody">
        {this.markupHeaders(headers)}
        {this.markupAllRows(rows)}
      </tbody>
    );
  };
  render() {
    return (
      <table className="table is-fullwidth">
        {this.generateTable(this.props.headers, this.props.rows)}
      </table>
    );
  }
}
