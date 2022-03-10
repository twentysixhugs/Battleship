function addEventsToButtons(cbRandom, cbReset, cbStart) {
  const random = document.querySelector('.js-random');
  const reset = document.querySelector('.js-reset');
  const start = document.querySelector('.js-start');

  random.addEventListener('click', cbRandom);
  reset.addEventListener('click', cbReset);
  start.addEventListener('click', cbStart);
}

export {
  addEventsToButtons,
}