import {random} from './utils.js';

const randomItem = (items) => items[Math.floor(Math.random() * items.length)];
const randomBoolean = () => randomItem([true, false]);

const titles = [
  `Изучить теорию`,
  `Сделать домашку`,
  `Пройти интенсив на соточку`,
];

const tags = new Set([
  `homework`,
  `theory`,
  `practice`,
  `intensive`,
  `keks`,
  `course`,
  `lecture`
]);

const createRandomTags = (elements) => {
  return [...elements].sort(() => 0.5 - Math.random()).slice(0, random(0, 3));
};

const colors = [
  `black`,
  `yellow`,
  `blue`,
  `green`,
  `pink`
];

export default () => ({
  title: randomItem(titles),

  dueDate: new Date(Date.now() - (7 * 24 * 60 * 60 * 1000) + Math.floor(Math.random() * 14 * 24 * 60 * 60 * 1000)),

  tags: createRandomTags(tags),

  picture: `//picsum.photos/100/100?r=${Math.random()}`,

  color: randomItem(colors),

  repeatingDays: {
    'mo': randomBoolean(),
    'tu': randomBoolean(),
    'we': randomBoolean(),
    'th': randomBoolean(),
    'fr': randomBoolean(),
    'sa': randomBoolean(),
    'su': randomBoolean(),
  },

  isFavorite: randomBoolean(),
  isDone: randomBoolean()

});
