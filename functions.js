/**
 * セルの数値に加算する
 *
 * @param {int} point 加算する値
 */
function incrementCells(point) {
  let ranges = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet().getActiveRangeList().getRanges();

  ranges.map(range => {
    let numRows    = range.getNumRows();
    let numColumns = range.getNumColumns();

    for (let i = 1; i <= numRows; i++) {
      for (let j = 1; j <= numColumns; j++) {
        let cell  = range.getCell(i, j);
        let value = cell.getValue();

        if (value instanceof Date) {
          value.setDate(value.getDate() + point);
        } else {
          value = value * 1 + point;
        }

        cell.setValue(value);
      }
    }
  });
}
