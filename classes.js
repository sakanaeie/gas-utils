/**
 * シートの行
 */
class SheetRow {
  /**
   * constructor
   *
   * @param {Array} row
   * @param {Array} columns
   */
  constructor(row, columns) {
    columns.forEach((name, index) => {
      this[name] = row[index];
    });
  }
}
