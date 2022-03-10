document.querySelectorAll('.js-battlefield').forEach(gameboard => {
  for (let i = 0; i < 100; i++) {
    gameboard.appendChild(createCell());
  }
});

function createCell() {
  const cell = document.createElement('div');
  cell.classList.add('gameboard__cell');

  return cell;
}