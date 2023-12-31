import {render, replace} from '../framework/render';
import EventItemView from '../view/event-item-view';
import EventListView from '../view/event-list-view';
import EmptyEventListView from '../view/empty-event-list-view';
import SortView from '../view/sort-view';
import EditEventFormView from '../view/edit-event-form-view';
import NewEventButtonView from '../view/new-event-button-view';
import FiltersView from '../view/filters-view';
// import AddEventFormView from '../view/add-event-form-view';

export default class TripPresenter {
  #headerContainer = null;
  #tripFiltersContainer = null;
  #tripContainer = null;
  #tripModel = null;

  #handleAddEventForm = () => {
    this.#addEventState = !this.#addEventState;
  };

  #newEventButton = new NewEventButtonView({ onClick: this.#handleAddEventForm });
  #filters = new FiltersView();
  #sort = new SortView();
  #eventListComponent = new EventListView();
  #emptyEventListComponent = new EmptyEventListView();

  #addEventState = false;
  #events = [];
  #offers = [];
  #destinations = [];

  constructor({headerContainer, tripFiltersContainer, tripContainer, tripModel}) {
    this.#headerContainer = headerContainer;
    this.#tripFiltersContainer = tripFiltersContainer;
    this.#tripContainer = tripContainer;
    this.#tripModel = tripModel;
  }

  #renderEvent(event, offers, destinations) {
    const currentOffers = this.#offers.find((offer) => offer.type === event.type)?.offers;
    const currentDestination = this.#destinations.find((destination) => destination.id === event.destination);

    const escKeyDownHandler = (evt) => {
      if (evt.key === 'Escape' || evt.key === 'ArrowUp') {
        evt.preventDefault();
        replaceFormToItem();
        document.removeEventListener('keydown', escKeyDownHandler);
      }
    };
    const eventItem = new EventItemView({
      event,
      offers: currentOffers,
      destination: currentDestination,
      onEditClick: () => {
        replaceItemToForm();
        document.addEventListener('keydown', escKeyDownHandler);
      }
    });
    const editEventForm = new EditEventFormView({
      event,
      offers,
      destinations,
      onFormSubmit: () => {
        replaceFormToItem();
        document.removeEventListener('keydown', escKeyDownHandler);
      }
    });

    function replaceItemToForm() {
      replace(editEventForm, eventItem);
    }

    function replaceFormToItem() {
      replace(eventItem, editEventForm);
    }

    render(eventItem, this.#eventListComponent.element);
  }

  // #renderAddEventForm() {
  //   const addEventForm = new AddEventFormView();
  //
  //   render(addEventForm, this.#eventListComponent.element);
  // }

  init() {
    this.#events = [...this.#tripModel.events];
    this.#offers = [...this.#tripModel.offers];
    this.#destinations = [...this.#tripModel.destinations];

    render(this.#newEventButton, this.#headerContainer);
    render(this.#filters, this.#tripFiltersContainer);

    if (this.#events.length === 0) {
      return render(this.#emptyEventListComponent, this.#tripContainer);
    }

    render(this.#sort, this.#tripContainer);
    render(this.#eventListComponent, this.#tripContainer);

    for (const event of this.#events) {
      this.#renderEvent(event, this.#offers, this.#destinations);
    }
  }
}
