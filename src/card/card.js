import {createElement} from '../utils.js';

export class Card {
  constructor(data) {
    this._title = data.title;
    this._tags = data.tags;
    this._picture = data.picture;
    this._color = data.color;
    this._repeatingDays = data.repeatingDays;
    this._isFavorite = data.isFavorite;
    this._isDone = data.isDone;

    this._element = null;
    this._onEdit = null;
  }

  _createTag() {
    return this._tags.map((tag) => `
    <span class="card__hashtag-inner">
      <input type="hidden" name="hashtag" value="repeat" class="card__hashtag-hidden-input" />
      <button type="button" class="card__hashtag-name">#${tag}</button>
      <button type="button" class="card__hashtag-delete"> delete</button>
    </span>
    `).join(``);
  }

  _isRepeatingDate() {
    return Object.values(this._repeatingDays).some((val) => val === true);
  }

  _onEditButtonClick() {
    if (typeof this._onEdit === `function`) {
      this._onEdit();
    }
  }

  set onEdit(fn) {
    this._onEdit = fn;
  }

  get element() {
    return this._element;
  }

  get template() {
    return `
      <article class="card card--${this._color} ${this._isRepeatingDate() ? `card--repeat` : ``}">
        <form class="card__form" method="get">
          <div class="card__inner">
            <div class="card__control">
              <button type="button" class="card__btn card__btn--edit">
                edit
              </button>
              <button type="button" class="card__btn card__btn--archive">
                archive
              </button>
              <button
                type="button"
                class="card__btn card__btn--favorites ${!this._isFavorite ? `card__btn--disabled` : ``}"
              >
                favorites
              </button>
            </div>

            <div class="card__color-bar">
              <svg class="card__color-bar-wave" width="100%" height="10">
                <use xlink:href="#wave"></use>
              </svg>
            </div>

            <div class="card__textarea-wrap">
              <label>
                <textarea
                  class="card__text"
                  placeholder="Start typing your text here..."
                  name="text"
                >${this._title}</textarea>
              </label>
            </div>

            <div class="card__settings">
              <div class="card__details">
                <div class="card__hashtag">
                  <div class="card__hashtag-list">
                  ${this._createTag()}
                  </div>

                  <label>
                    <input
                      type="text"
                      class="card__hashtag-input"
                      name="hashtag-input"
                      placeholder="Type new hashtag here"
                    />
                  </label>
                </div>
              </div>

              <label class="card__img-wrap ${!this._picture ? `card__img-wrap--empty` : ``}">
                <input
                  type="file"
                  class="card__img-input visually-hidden"
                  name="img"
                />
                <img
                  src="${this._picture}"
                  alt="task picture"
                  class="card__img"
                />
              </label>
            </div>
          </div>
        </form>
      </article>
    `.trim();
  }

  render() {
    this._element = createElement(this.template);
    this.bind();
    return this._element;
  }

  bind() {
    this._element.querySelector(`.card__btn--edit`).addEventListener(`click`, this._onEditButtonClick.bind(this));
  }

  unbind() {
    this._element.querySelector(`.card__btn--edit`).removeEventListener(`click`, this._onEditButtonClick.bind(this));
  }

  unrender() {
    this.unbind();
    this._element = null;
  }
}
