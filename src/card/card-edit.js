import {Component} from '../component.js';
import {Color} from '../utils.js';
import flatpickr from 'flatpickr';

export class CardEdit extends Component {
  constructor(data) {
    super();
    this._number = data.number;
    this._title = data.title;
    this._tags = data.tags;
    this._picture = data.picture;
    this._dueDate = data.dueDate;
    this._repeatingDays = data.repeatingDays;
    this._color = data.color;
    this._isFavorite = data.isFavorite;
    this._isDone = data.isDone;

    this._state.isDeadline = this._isDeadline();
    this._state.isRepeatingDate = this._isRepeatingDate();

    this._onSubmit = null;
    this._onSubmitButtonClick = this._onSubmitButtonClick.bind(this);
    this._onChangeColor = this._onChangeColor.bind(this);
    this._onChangeDate = this._onChangeDate.bind(this);
    this._onChangeRepeated = this._onChangeRepeated.bind(this);
    this._onAddTag = this._onAddTag.bind(this);
    this._onDeleteTag = this._onDeleteTag.bind(this);
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

  _isDeadline() {
    if (this._dueDate) {
      return true;
    }
    return false;
  }

  _isRepeatingDate() {
    return Object.values(this._repeatingDays).some((val) => val === true);
  }

  _processForm(formData) {
    const entry = {
      title: ``,
      color: ``,
      tags: [],
      dueDate: {
        date: ``,
        time: ``
      },
      repeatingDays: {
        'mo': false,
        'tu': false,
        'we': false,
        'th': false,
        'fr': false,
        'sa': false,
        'su': false,
      }
    };

    const taskEditMapper = CardEdit.createMapper(entry);
    for (const pair of formData.entries()) {
      const [property, value] = pair;
      if (taskEditMapper[property]) {
        taskEditMapper[property](value);
      }
    }
    return entry;
  }

  _onSubmitButtonClick(evt) {
    evt.preventDefault();
    const formData = new FormData(this._element.querySelector(`.card__form`));
    const newData = this._processForm(formData);
    if (typeof this._onSubmit === `function`) {
      this._onSubmit(newData);
    }
    return this.update(newData);
  }

  _onChangeColor() {
    this._color = this._element.querySelector(`.card__color-input:checked`).value;
    this._element.className = this._element.className.replace(/(?!card|\--|edit)\b\S+/, this._color);
  }

  _onChangeDate() {
    this._state.isDeadline = !this._state.isDeadline;
    this.removeListeners();
    this._partialUpdate();
    this.createListeners();
  }

  _onChangeRepeated() {
    this._state.isRepeatingDate = !this._state.isRepeatingDate;
    this.removeListeners();
    this._partialUpdate();
    this.createListeners();
  }

  _onAddTag() {
    const newTag = this._element.querySelector(`.card__hashtag-input`).value;
    if (this._tags.length < 2) {
      this._tags.push(newTag);
      this.removeListeners();
      this._partialUpdate();
      this.createListeners();
    }
  }

  _onDeleteTag(evt) {
    const currentTag = evt.target.parentElement.querySelector(`.card__hashtag-hidden-input`).value;
    this._tags = this._tags.filter((tag) => {
      return tag !== currentTag;
    });
    this.removeListeners();
    this._partialUpdate();
    this.createListeners();
  }

  _partialUpdate() {
    this._element.innerHTML = this.template;
  }

  set onSubmit(fn) {
    this._onSubmit = fn;
  }

  get template() {
    return `
      <article class="card card--edit ${Color[this._color]} ${this._isRepeatingDate() && `card--repeat`}">
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
                <div class="card__dates">
                  <button class="card__date-deadline-toggle" type="button">
                    date: <span class="card__date-status">${this._isDeadline() || this._state.isDeadline ? `yes` : `no`}</span>
                  </button>

                  <fieldset class="card__date-deadline" ${!this._state.isDeadline && `disabled`}>
                    <label class="card__input-deadline-wrap">
                      <input
                        class="card__date"
                        type="text"
                        placeholder="${this._dueDate.date}"
                        value="${this._dueDate.date}"
                        name="date"
                      />
                    </label>
                    <label class="card__input-deadline-wrap">
                      <input
                        class="card__time"
                        type="text"
                        placeholder="${this._dueDate.time}"
                        value="${this._dueDate.time}"
                        name="time"
                      />
                    </label>
                  </fieldset>

                  <button class="card__repeat-toggle" type="button">
                    repeat:<span class="card__repeat-status">${this._isRepeatingDate() ? `yes` : `no`}</span>
                  </button>

                  <fieldset class="card__repeat-days" ${!this._state.isRepeatingDate || !this._isRepeatingDate() && `disabled`}>
                    <div class="card__repeat-days-inner">
                      <input
                        class="visually-hidden card__repeat-day-input"
                        type="checkbox"
                        id="repeat-mo-${this._number}"
                        name="repeat"
                        value="mo"
                        ${this._repeatingDays.mo ? `checked` : ``}
                      />
                      <label class="card__repeat-day" for="repeat-mo-${this._number}"
                        >mo</label
                      >
                      <input
                        class="visually-hidden card__repeat-day-input"
                        type="checkbox"
                        id="repeat-tu-${this._number}"
                        name="repeat"
                        value="tu"
                        ${this._repeatingDays.tu ? `checked` : ``}
                      />
                      <label class="card__repeat-day" for="repeat-tu-${this._number}"
                        >tu</label
                      >
                      <input
                        class="visually-hidden card__repeat-day-input"
                        type="checkbox"
                        id="repeat-we-${this._number}"
                        name="repeat"
                        value="we"
                        ${this._repeatingDays.we ? `checked` : ``}
                      />
                      <label class="card__repeat-day" for="repeat-we-${this._number}"
                        >we</label
                      >
                      <input
                        class="visually-hidden card__repeat-day-input"
                        type="checkbox"
                        id="repeat-th-${this._number}"
                        name="repeat"
                        value="th"
                        ${this._repeatingDays.th ? `checked` : ``}
                      />
                      <label class="card__repeat-day" for="repeat-th-${this._number}"
                        >th</label
                      >
                      <input
                        class="visually-hidden card__repeat-day-input"
                        type="checkbox"
                        id="repeat-fr-${this._number}"
                        name="repeat"
                        value="fr"
                        ${this._repeatingDays.fr ? `checked` : ``}
                      />
                      <label class="card__repeat-day" for="repeat-fr-${this._number}"
                        >fr</label
                      >
                      <input
                        class="visually-hidden card__repeat-day-input"
                        type="checkbox"
                        name="repeat"
                        value="sa"
                        id="repeat-sa-${this._number}"
                        ${this._repeatingDays.sa ? `checked` : ``}
                      />
                      <label class="card__repeat-day" for="repeat-sa-${this._number}"
                        >sa</label
                      >
                      <input
                        class="visually-hidden card__repeat-day-input"
                        type="checkbox"
                        id="repeat-su-${this._number}"
                        name="repeat"
                        value="su"
                        ${this._repeatingDays.su ? `checked` : ``}
                      />
                      <label class="card__repeat-day" for="repeat-su-${this._number}"
                        >su</label
                      >
                    </div>
                  </fieldset>
                </div>

                <div class="card__hashtag">
                  <div class="card__hashtag-list">
                  ${this._createTag()}
                  </div>

                  <label>
                    <input
                      type="text"
                      class="card__hashtag-input"
                      name="hashtag-input"
                      value=""
                      placeholder="Type new hashtag here"
                    />
                  </label>
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

              <div class="card__colors-inner">
                <h3 class="card__colors-title">Color</h3>
                <div class="card__colors-wrap">
                  <input
                    type="radio"
                    id="color-black-${this._number}"
                    class="card__color-input card__color-input--black visually-hidden"
                    name="color"
                    value="black"
                    ${this._color === `black` && `checked`}
                  />
                  <label
                    for="color-black-${this._number}"
                    class="card__color card__color--black"
                    >black</label
                  >
                  <input
                    type="radio"
                    id="color-yellow-${this._number}"
                    class="card__color-input card__color-input--yellow visually-hidden"
                    name="color"
                    value="yellow"
                    ${this._color === `yellow` && `checked`}
                  />
                  <label
                    for="color-yellow-${this._number}"
                    class="card__color card__color--yellow"
                    >yellow</label
                  >
                  <input
                    type="radio"
                    id="color-blue-${this._number}"
                    class="card__color-input card__color-input--blue visually-hidden"
                    name="color"
                    value="blue"
                    ${this._color === `blue` && `checked`}
                  />
                  <label
                    for="color-blue-${this._number}"
                    class="card__color card__color--blue"
                    >blue</label
                  >
                  <input
                    type="radio"
                    id="color-green-${this._number}"
                    class="card__color-input card__color-input--green visually-hidden"
                    name="color"
                    value="green"
                    ${this._color === `green` && `checked`}
                  />
                  <label
                    for="color-green-${this._number}"
                    class="card__color card__color--green"
                    >green</label
                  >
                  <input
                    type="radio"
                    id="color-pink-${this._number}"
                    class="card__color-input card__color-input--pink visually-hidden"
                    name="color"
                    value="pink"
                    ${this._color === `pink` && `checked`}
                  />
                  <label
                    for="color-pink-${this._number}"
                    class="card__color card__color--pink"
                    >pink</label
                  >
                </div>
              </div>
            </div>

            <div class="card__status-btns">
              <button class="card__save" type="submit">save</button>
              <button class="card__delete" type="button">delete</button>
            </div>
          </div>
        </form>
      </article>
    `.trim();
  }

  createListeners() {
    this._element.querySelector(`.card__form`).addEventListener(`submit`, this._onSubmitButtonClick);
    this._element.querySelector(`.card__date-deadline-toggle`).addEventListener(`click`, this._onChangeDate);
    this._element.querySelector(`.card__repeat-toggle`).addEventListener(`click`, this._onChangeRepeated);
    this._element.querySelector(`.card__hashtag-input`).addEventListener(`change`, this._onAddTag);
    [...this._element.querySelectorAll(`.card__color-input`)].map((btn) => {
      btn.addEventListener(`click`, this._onChangeColor);
    });

    [...this._element.querySelectorAll(`.card__hashtag-delete`)].map((btn) => {
      btn.addEventListener(`click`, this._onDeleteTag);
    });

    if (this._state.isDeadline) {
      flatpickr(this._element.querySelector(`.card__date`), {altInput: true, defaultDate: this._dueDate.date, altFormat: `j F`, dateFormat: `j F`});
      flatpickr(this._element.querySelector(`.card__time`), {enableTime: true, noCalendar: true, altInput: true, defaultDate: this._dueDate.time, altFormat: `h:i K`, dateFormat: `h:i K`});
    }
  }

  removeListeners() {
    this._element.querySelector(`.card__form`).removeEventListener(`submit`, this._onSubmitButtonClick);
    this._element.querySelector(`.card__date-deadline-toggle`).removeEventListener(`click`, this._onChangeDate);
    this._element.querySelector(`.card__repeat-toggle`).removeEventListener(`click`, this._onChangeRepeated);
    this._element.querySelector(`.card__hashtag-input`).removeEventListener(`change`, this._onAddTag);
    [...this._element.querySelectorAll(`.card__color-input`)].map((btn) => {
      btn.removeEventListener(`click`, this._onChangeColor);
    });
    [...this._element.querySelectorAll(`.card__hashtag-delete`)].map((btn) => {
      btn.removeEventListener(`click`, this._onDeleteTag);
    });
  }

  update(data) {
    this._title = data.title;
    this._tags = data.tags;
    this._color = data.color;
    this._repeatingDays = data.repeatingDays;
    this._dueDate = data.dueDate;
  }

  static createMapper(target) {
    return {
      hashtag: (value) => target.tags.push(value),
      text: (value) => {
        target.title = value;
      },
      color: (value) => {
        target.color = value;
      },
      repeat: (value) => {
        target.repeatingDays[value] = true;
      },
      date: (value) => {
        target.dueDate.date = value;
      },
      time: (value) => {
        target.dueDate.time = value;
      }
    };
  }
}
