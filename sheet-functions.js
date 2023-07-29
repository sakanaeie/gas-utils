/**
 * 文字列を文字で分割して数える
 *
 * @param {Array}  list 複数"列"が与えられたときはそれらを合算 e.g. A1:B2
 * @param {string} c
 * @returns {int[]} 第一引数と同じ"行"数となる
 */
function splitCountByList(list, c) {
  let result = [];
  list.forEach(row => {
    let num = 0;
    row.forEach(cell => {
      if ('' !== cell) {
        num += cell.split(c).length;
      }
    });
    result.push(num);
  });

  return result;
}

/**
 * 呼び出し元のセルと同色なセルを取得する
 *
 * @param {string} a1notation e.g. A1:B2
 * @returns {Range[]}
 */
function getColoredCells(a1notation) {
  let sheet      = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  let range      = sheet.getRange(a1notation);
  let numRows    = range.getNumRows();
  let numColumns = range.getNumColumns();
  let colorCode  = sheet.getActiveRange().getBackground();

  let list = [];
  for (let i = 1; i <= numRows; i++) {
    for (let j = 1; j <= numColumns; j++) {
      let cell = range.getCell(i, j);
      if (cell.getBackground() === colorCode) {
        if ('#ffffff' === colorCode && '' === cell.getValue()) {
          // do nothing
        } else {
          list.push(cell);
        }
      }
    }
  }

  return list;
}

/**
 * 呼び出し元のセルと同色なセルを数える
 *
 * @param {string} a1notation e.g. A1:B2
 * @returns {int}
 */
function countColoredCells(a1notation) {
  return getColoredCells(a1notation).length;
}

/**
 * ガントチャート風のスケジュールを生成する
 *
 * # 注意
 * - 1行目は日付行、2行目は曜日行、3行目以降はチャートになる
 *   - データ行の2行上で呼び出す必要があるということ
 *
 * # 使い方
 * - 条件付き書式で非空白セルに色付けする
 *
 * # 呼び出し方の例
 * =gantt($A$2,A4:A30,B4:B30,C4:C30,D4:D30,$B$2,$C$2,$D$2)
 *
 * @param {Date}    today           今日
 * @param {Date[]}  startList       開始日の列
 * @param {mixed[]} startTimingList 開始タイミングの表示文字列の列
 * @param {Date[]}  endList         終了日の列
 * @param {mixed[]} endTimingList   終了タイミングの表示文字列の列
 * @param {int}     pastDays        表示する過去の日数
 * @param {int}     futureDays      表示する未来の日数
 * @param {mixed}   dummy           再計算誘発用ダミー
 * @returns {string[]}
 */
function gantt(today, startList, startTimingList, endList, endTimingList, pastDays, futureDays, dummy) {
  dummy       = '';
  let mark    = '';
  let results = [];

  const WEEKDAY_JP_LIST = ['日', '月', '火', '水', '木', '金', '土'];
  const HEADER_COUTN    = 2; // 日付行、曜日行

  const isSameDate = (a, b) => {
    return Utilities.formatDate(a, 'Asia/Tokyo', 'yyyyMMdd').toString() === Utilities.formatDate(b, 'Asia/Tokyo', 'yyyyMMdd').toString();
  };

  const formatTimingString = (value) => {
    if (value instanceof Date) {
      return Utilities.formatDate(value, 'Asia/Tokyo', 'HH:mm');
    }
    return value;
  };

  startList.forEach((start, index) => {
    start   = start[0];          // 行として与えられるため、行の先頭を取得する
    let end = endList[index][0]; // 同上
    if (HEADER_COUTN < index + 1) {
      if ('' === start || '' === end) {
        results.push(['']);
        return;
      }
    }

    let oneday = new Date(today);
    oneday.setDate(oneday.getDate() - pastDays);

    let row = [];
    for (let i = pastDays * -1; i <= futureDays; i++) {
      if (0 === index) {
        // 日付行

        if (1 === oneday.getDate()) {
          row.push(Utilities.formatDate(oneday, 'Asia/Tokyo', 'MM-dd'));
        } else {
          row.push(Utilities.formatDate(oneday, 'Asia/Tokyo', 'dd'));
        }
      } else if (1 === index) {
        // 曜日行

        row.push(WEEKDAY_JP_LIST[oneday.getDay()]);
      } else {
        // チャート行

        if (start <= oneday && oneday <= end) {
          if (       isSameDate(oneday, start)) {
            // 開始日
            mark = formatTimingString(startTimingList[index][0]);
          } else if (isSameDate(oneday, end)) {
            // 終了日
            mark = formatTimingString(endTimingList[index][0]);
          } else if (today > oneday) {
            mark = ' ';
          } else {
            mark = ' ';
          }
          row.push(mark);
        } else {
          row.push('');
        }
      }

      oneday.setDate(oneday.getDate() + 1);
    }

    results.push(row);
  });

  return results;
}
