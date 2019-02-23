import createFilterElement from './filter.js';
import createCard from './card.js';

// Filter

const filterContainer = document.querySelector(`.main__filter`);
const filterElementsArray = [
  [`ALL`, true],
  [`OVERDUE`],
  [`TODAY`],
  [`FAVORITES`],
  [`Repeating`],
  [`Tags`],
  [`ARCHIVE`]
];

const cardContainer = document.querySelector(`.board__tasks`);
const showCards = (num) => {
  cardContainer.innerHTML = ``;

  for (let i = 1; i <= num; i++) {
    cardContainer.insertAdjacentHTML(`beforeend`, createCard());
  }
};

const random = (min, max) => Math.floor(Math.random() * (max - min)) + min;

// Отрисовываем все фильтры

const showFilter = (container) => {
  const filterElements = filterElementsArray.map((item) => createFilterElement(item[0], random(0, 15), item[1]));
  container.insertAdjacentHTML(`beforeend`, filterElements.join(``));
};

showFilter(filterContainer);

// Добавляем каждому фильтру обработчик события click

const filterElementsLabels = document.querySelectorAll(`.filter__label`);

[].map.call(filterElementsLabels, (label) => {
  label.addEventListener(`click`, () => {
    showCards(random(0, 15));
  });
});

// Card

showCards(7);
