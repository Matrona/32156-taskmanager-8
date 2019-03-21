import {random} from './utils.js';
import createRandomCard from './data.js';
import {Card} from './card/card.js';
import {CardEdit} from './card/card-edit.js';
import createFilterElement from './filter.js';

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

// Card

const cardContainer = document.querySelector(`.board__tasks`);

const showCards = (num) => {
  cardContainer.innerHTML = ``;

  const cardComponentData = [];
  const cardComponent = [];
  const editCardComponent = [];

  for (let i = 1; i <= num; i++) {
    cardComponentData[i] = createRandomCard();
    cardComponentData[i].number = i;
    cardComponent[i] = new Card(cardComponentData[i]);
    editCardComponent[i] = new CardEdit(cardComponentData[i]);

    cardComponent[i].onEdit = () => {
      editCardComponent[i].render();
      cardContainer.replaceChild(editCardComponent[i].element, cardComponent[i].element);
      cardComponent[i].unrender();
    };

    editCardComponent[i].onSubmit = (newObject) => {
      cardComponentData[i].title = newObject.title;
      cardComponentData[i].tags = newObject.tags;
      cardComponentData[i].color = newObject.color;
      cardComponentData[i].repeatingDays = newObject.repeatingDays;
      cardComponentData[i].dueDate = newObject.dueDate;

      cardComponent[i].update(cardComponentData[i]);
      cardComponent[i].render();
      cardContainer.replaceChild(cardComponent[i].element, editCardComponent[i].element);
      editCardComponent[i].unrender();
    };

    cardContainer.appendChild(cardComponent[i].render());
  }
};

// Отрисовываем все фильтры

const showFilter = (container) => {
  const filterElements = filterElementsArray.map((item) => createFilterElement(item[0], random(0, 15), item[1]));
  container.insertAdjacentHTML(`beforeend`, filterElements.join(``));
};

showFilter(filterContainer);

// Добавляем каждому фильтру обработчик события click

const filterElementsLabels = document.querySelectorAll(`.filter__label`);

filterElementsLabels.forEach((label) => {
  label.addEventListener(`click`, () => {
    showCards(random(0, 15));
  });
});

// Card

showCards(7);
