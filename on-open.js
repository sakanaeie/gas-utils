function onOpen() {
  let ui = SpreadsheetApp.getUi();

  let subMenuInc10 = ui.createMenu('+10 ~ ');
  let subMenuDec10 = ui.createMenu('-10 ~ ');
  let subMenuDec1  = ui.createMenu('-1 ~ ');
  for (let i = 0, num1, num10; i < 10; i++) {
    num1  = i + 1;
    num10 = num1 * 10;
    subMenuInc10.addItem(`+${num10}`, `i${num10}`);
    subMenuDec10.addItem(`-${num10}`, `d${num10}`);
    subMenuDec1.addItem( `-${num1}`,  `d${num1}`);
  }

  let menu = ui.createMenu('加減算');

  for (let i = 0, num; i < 10; i++) {
    num = i + 1;
    menu.addItem(`+${num}`, `i${num}`);
  }

  menu.addSubMenu(subMenuInc10)
    .addSeparator()
    .addSubMenu(subMenuDec1)
    .addSubMenu(subMenuDec10)
    .addToUi();
}

// 関数 i1 ~ i10, d1 ~ d10 を定義する
for (let i = 0, num1, num10; i < 10; i++) {
  num1  = i + 1;
  num10 = num1 * 10;
  this[`i${num1}`]  = () => incrementCells(num1);
  this[`i${num10}`] = () => incrementCells(num10);
  this[`d${num1}`]  = () => incrementCells(num1  * -1);
  this[`d${num10}`] = () => incrementCells(num10 * -1);
}
