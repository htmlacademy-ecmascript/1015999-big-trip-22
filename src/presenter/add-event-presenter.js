import {remove, render, RenderPosition} from '../framework/render';
import {UpdateType, UserAction} from '../const';
import EditEventFormView from '../view/edit-event-form-view';
import dayjs from 'dayjs';

export default class AddEventPresenter {
  #offers = [];
  #destinations = [];
  /**
   * @type {HTMLElement}
   */
  #eventListContainer = null;
  /**
   * @type {function}
   */
  #handleEventChange = null;
  /**
   * @type {function}
   */
  #handleDestroy = null;

  #eventEditComponent = null;

  constructor({offers, destinations, eventListContainer, onEventChange, onDestroy}) {
    this.#offers = offers;
    this.#destinations = destinations;
    this.#eventListContainer = eventListContainer;
    this.#handleEventChange = onEventChange;
    this.#handleDestroy = onDestroy;
  }

  #generateEmptyForm() {
    return {
      id: '',
      basePrice: 0,
      dateFrom: dayjs().startOf('day').toISOString(),
      dateTo: dayjs().endOf('day').toISOString(),
      destination: this.#destinations[0]?.id || '',
      isFavorite: false,
      offers: [],
      type: this.#offers[0]?.type
    };
  }

  init() {
    if (this.#eventEditComponent !== null) {
      return;
    }

    this.#eventEditComponent = new EditEventFormView({
      event: this.#generateEmptyForm(),
      offers: this.#offers,
      destinations: this.#destinations,
      onFormSubmit: this.#handleFormSubmit,
      onFormReset: this.#handleDeleteClick,
      onFormDelete: this.#handleDeleteClick
    });

    render(this.#eventEditComponent, this.#eventListContainer, RenderPosition.AFTERBEGIN);

    document.addEventListener('keydown', this.#escKeyDownHandler);
  }

  destroy() {
    if (this.#eventEditComponent === null) {
      return;
    }

    this.#handleDestroy();

    remove(this.#eventEditComponent);
    this.#eventEditComponent = null;

    document.removeEventListener('keydown', this.#escKeyDownHandler);
  }

  #handleFormSubmit = (event) => {
    this.#handleEventChange(
      UserAction.ADD_EVENT,
      UpdateType.MINOR,
      {id: Math.random(), ...event},
    );
    this.destroy();
  };

  #handleDeleteClick = () => {
    this.destroy();
  };

  #escKeyDownHandler = (event) => {
    if (event.key === 'Escape' || event.key === 'Esc') {
      event.preventDefault();
      this.destroy();
    }
  };
}
