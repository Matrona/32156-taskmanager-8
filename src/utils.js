export const random = (min, max) => Math.floor(Math.random() * (max - min)) + min;
export const randomItem = (items) => items[Math.floor(Math.random() * items.length)];
export const randomBoolean = () => randomItem([true, false]);

export const createElement = (template) => {
  const newElement = document.createElement(`div`);
  newElement.innerHTML = template;
  return newElement.firstChild;
};

export const Color = {
  blue: `card--blue`,
  black: `card--black`,
  yellow: `card--yellow`,
  green: `card--green`,
  pink: `card--pink`,
};
