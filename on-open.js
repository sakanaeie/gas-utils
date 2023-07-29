function onOpen() {
  let ui = SpreadsheetApp.getUi();

  let subMenuInc = ui.createMenu('+1 ~ +10');
  let subMenuDec = ui.createMenu('-1 ~ -10');
  for (let i = 0; i < 10; i++) {
    let num = i + 1;
    subMenuInc.addItem(`+${num}`, `i${num}`);
    subMenuDec.addItem(`-${num}`, `d${num}`);
  }

  ui.createMenu('加減算')
    .addItem('+1', 'i1')
    .addItem('+2', 'i2')
    .addItem('+3', 'i3')
    .addSubMenu(subMenuInc)
    .addSeparator()
    .addSubMenu(subMenuDec)
    .addToUi();
}

// 関数 i1 ~ i10, d1 ~ d10 を定義する
for (let i = 0; i < 10; i++) {
  let num = i + 1;
  this[`i${num}`] = () => incrementCells(num);
  this[`d${num}`] = () => incrementCells(num * -1);
}
