function getCellsSurroundingCell(cell) {
  // It may return negative cells that are not on board,
  // but it doesn't matter since they are not used at all
  // All we need to check is whether we can place a ship on
  // an existing cell or not
  return [
    // return everything around this cell

    // above
    [cell[0] - 1, cell[0] - 1],
    [cell[0], cell[0] - 1],
    [cell[0] + 1, cell[0] - 1],

    // right
    [cell[0] + 1, cell[0]],
    //left
    [cell[0] - 1, cell[0]],

    // below
    [cell[0] - 1, cell[0] + 1],
    [cell[0], cell[0] + 1],
    [cell[0] + 1, cell[0] + 1],
  ]
}

function stringifyElements(arr) {
  return arr.map(el => el.toString());
}

export {
  getCellsSurroundingCell,
  stringifyElements
};