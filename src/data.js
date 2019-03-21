import {random, randomItem, randomBoolean} from './utils.js';
import moment from 'moment';

const titles = [`Изучить теорию`, `Сделать домашку`, `Пройти интенсив на соточку`];

const colors = [`black`, `yellow`, `blue`, `green`, `pink`];

const tags = new Set([`homework`, `theory`, `practice`, `intensive`, `keks`, `course`, `lecture`]);

const createRandomTags = (elements) => {
  return [...elements].sort(() => 0.5 - Math.random()).slice(0, random(0, 3));
};

const repeatingDays = {
  mo: false,
  tu: false,
  we: false,
  th: false,
  fr: false,
  sa: false,
  su: false,
};

const createRepeatingDays = (days) => {
  return Object.keys(days).reduce((repDays, dayKey) => {
    repDays[dayKey] = randomBoolean();
    return repDays;
  }, {});
};

const createRandomDate = () => {
  const randomDate = new Date(Date.now() - (7 * 24 * 60 * 60 * 1000) + Math.floor(Math.random() * 14 * 24 * 60 * 60 * 1000));
  return {
    date: moment(randomDate).format(`DD MMMM`),
    time: moment(randomDate).format(`hh:mm A`)
  };
};

export default () => ({
  number: null,
  title: randomItem(titles),
  dueDate: createRandomDate(),
  tags: createRandomTags(tags),
  picture: `//picsum.photos/100/100?r=${Math.random()}`,
  color: randomItem(colors),
  repeatingDays: createRepeatingDays(repeatingDays),
  isFavorite: randomBoolean(),
  isDone: randomBoolean()
});
