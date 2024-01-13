import AbstractView from '../framework/view/abstract-view';
import {getTimeOnWay, humaniseDate, humaniseTime} from '../utils/date';

/**
 * function that returns event offer item template
 * @param {OfferItemObjectData} offer
 * @return {string}
 */
function createEventOfferTemplate(offer) {
  const {title, price} = offer;

  return (`
    <li class="event__offer">
      <span class='event__offer-title'>${title}</span>
      &plus;&euro;&nbsp;
      <span class="event__offer-price">${price}</span>
    </li>
  `);
}

/**
 * function that returns event item template
 * @param {EventObjectData} event
 * @param {Array<OfferItemObjectData>} offersData
 * @param {DestinationObjectData} destination
 * @return {string}
 */
function createEventItemTemplate(event, offersData, destination) {
  const { type, basePrice, dateFrom, dateTo, isFavorite, offers } = event;
  const filteredOffers = offersData.filter((offer) => offers.indexOf(offer.id) >= 0);
  const date = humaniseDate(dateFrom);
  const timeFrom = humaniseTime(dateFrom);
  const timeTo = humaniseTime(dateTo);
  const timeOnWay = getTimeOnWay(dateFrom, dateTo);
  const favoriteBtnClassName = isFavorite ? 'event__favorite-btn--active' : '';

  return (
    `<li class="trip-events__item">
      <div class="event">
        <time class="event__date" datetime="${dateFrom}">${date}</time>
        <div class="event__type">
          <img class="event__type-icon" width="42" height="42" src="img/icons/${type}.png" alt="Event type icon">
        </div>
        <h3 class="event__title">${type} ${destination.name}</h3>
        <div class="event__schedule">
          <p class="event__time">
            <time class="event__start-time" datetime="${dateFrom}">${timeFrom}</time>
            &mdash;
            <time class="event__end-time" datetime="${dateTo}">${timeTo}</time>
          </p>
          <p class="event__duration">${timeOnWay}</p>
        </div>
        <p class="event__price">
          &euro;&nbsp;<span class="event__price-value">${basePrice}</span>
        </p>
        <h4 class="visually-hidden">Offers:</h4>
        <ul class="event__selected-offers">
          ${filteredOffers.map((offer) => createEventOfferTemplate(offer)).join(' ')}
        </ul>
        <button class="event__favorite-btn ${favoriteBtnClassName}" type="button">
          <span class="visually-hidden">Add to favorite</span>
          <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
            <path d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z"/>
          </svg>
        </button>
        <button class="event__rollup-btn" type="button">
          <span class="visually-hidden">Open event</span>
        </button>
      </div>
    </li>`
  );
}

export default class EventItemView extends AbstractView {
  /**
   * @type {(null|EventObjectData)} event
   */
  #event = null;
  /**
   * @type {Array<OfferItemObjectData>} offers
   */
  #offers = [];
  /**
   * @type {(null|DestinationObjectData)} destination
   */
  #destination = null;

  /**
   * @type {(null|function)} destination
   */
  #handleEditClick = null;

  constructor({event, offers, destination, onEditClick}) {
    super();

    this.#event = event;
    this.#offers = offers;
    this.#destination = destination;

    this.#handleEditClick = onEditClick;
    this.element.querySelector('.event__rollup-btn').addEventListener('click', this.#editClickHandler);
  }

  get template() {
    if(!this.#event || !this.#destination) {
      return '';
    }

    return createEventItemTemplate(this.#event, this.#offers, this.#destination);
  }

  #editClickHandler = (event) => {
    event.preventDefault();
    this.#handleEditClick();
  };
}
