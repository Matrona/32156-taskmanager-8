export default (caption, amount, isChecked = false) => {

  let isDisabled = false;

  if (amount <= 0) {
    isDisabled = true;
  }

  return `
    <input
      type="radio"
      id="filter__${caption.toLowerCase()}"
      class="filter__input visually-hidden"
      name="filter"
      ${isChecked ? ` checked` : ``}
      ${isDisabled ? ` disabled` : ``}
    />
    <label for="filter__${caption.toLowerCase()}" class="filter__label">${caption} <span class="filter__${caption.toLowerCase()}-count">${amount}</span></label>
  `;
};
