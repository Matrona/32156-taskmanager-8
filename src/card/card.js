import {Component} from '../component.js';
import {Color} from '../utils.js';

export class Card extends Component {
  constructor(data) {
    super();
    this._title = data.title;
    this._tags = data.tags;
    this._picture = data.picture;
    this._dueDate = data.dueDate;
    this._color = data.color;
    this._repeatingDays = data.repeatingDays;
    this._isFavorite = data.isFavorite;
    this._isDone = data.isDone;

    this._onEdit = null;
    this._onEditButtonClick = this._onEditButtonClick.bind(this);
  }

  _createTag() {
    return this._tags.map((tag) => `
    <span class="card__hashtag-inner">
      <input type="hidden" name="hashtag" value="${tag}" class="card__hashtag-hidden-input" />
      <button type="button" class="card__hashtag-name">#${tag}</button>
      <button type="button" class="card__hashtag-delete"> delete</button>
    </span>
    `).join(``);
  }

  _isRepeatingDate() {
    return Object.values(this._repeatingDays).some((val) => val === true);
  }

  _onEditButtonClick() {
    return typeof this._onEdit === `function` && this._onEdit();
  }

  set onEdit(fn) {
    this._onEdit = fn;
  }

  get template() {
    return `
      <article class="card ${Color[this._color]} ${this._isRepeatingDate() && `card--repeat`}">
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
                class="card__btn card__btn--favorites ${!this._isFavorite && `card__btn--disabled`}"
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
                <div class="card__dates">${this._dueDate.date}<br>${this._dueDate.time}</div>
                <div class="card__hashtag">
                  <div class="card__hashtag-list">
                  ${this._createTag()}
                  </div>
                </div>
              </div>

              <label class="card__img-wrap ${!this._picture && `card__img-wrap--empty`}">
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

  createListeners() {
    this._element.querySelector(`.card__btn--edit`).addEventListener(`click`, this._onEditButtonClick);
  }

  removeListeners() {
    this._element.querySelector(`.card__btn--edit`).removeEventListener(`click`, this._onEditButtonClick);
  }

  update(data) {
    this._title = data.title;
    this._tags = data.tags;
    this._color = data.color;
    this._dueDate = data.dueDate;
    this._repeatingDays = data.repeatingDays;
  }
}
