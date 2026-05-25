import { Component } from '@theme/component';

/**
 * @typedef {Object} TabbedCarouselRefs
 * @property {HTMLButtonElement[]} tabs - Tab buttons
 * @property {HTMLElement[]} panels - Tab panels
 */

/** @extends {Component<TabbedCarouselRefs>} */
class TabbedCarouselComponent extends Component {
  connectedCallback() {
    super.connectedCallback();

    // Move tab buttons from their block groups into the tabs header row.
    // Each Tab block renders its button inside .tabbed-carousel__tab-group;
    // the CSS hides them there and shows them once they're in .tabbed-carousel__tabs.
    const tabsContainer = this.querySelector('.tabbed-carousel__tabs');

    if (tabsContainer && this.refs.tabs.length > 0) {
      for (const tab of this.refs.tabs) {
        tabsContainer.appendChild(tab);
      }
    }

    // Activate the first tab
    if (this.refs.tabs.length > 0) {
      const firstTabId = this.refs.tabs[0].getAttribute('data-tab-id');
      this.activateTab(firstTabId);
    }

    // Set up scroll-based arrow visibility on all panels
    this.#initScrollListeners();
  }

  /**
   * Activates a tab and its corresponding panel by block ID.
   *
   * @param {string} tabId - The block ID of the tab to activate
   */
  activateTab(tabId) {
    for (const tab of this.refs.tabs) {
      const isActive = tab.getAttribute('data-tab-id') === tabId;
      tab.classList.toggle('tabbed-carousel__tab--active', isActive);
      tab.setAttribute('aria-selected', String(isActive));
    }

    for (const panel of this.refs.panels) {
      if (panel.getAttribute('data-tab-id') === tabId) {
        panel.removeAttribute('hidden');
      } else {
        panel.setAttribute('hidden', '');
      }
    }
  }

  /**
   * Switches the active tab and shows the corresponding panel.
   *
   * @param {Event} event - The click event from the tab button
   */
  switchTab(event) {
    const button = /** @type {HTMLButtonElement} */ (event.target).closest('[data-tab-id]');
    if (!button) return;

    const tabId = button.getAttribute('data-tab-id');
    this.activateTab(tabId);
  }

  /**
   * Scrolls the active panel's track forward by one card width.
   */
  next() {
    const track = this.#getActiveTrack();
    if (!track) return;
    const cardWidth = track.querySelector('.tabbed-carousel__card, .tabbed-carousel__view-all')?.offsetWidth ?? 208;
    track.scrollBy({ left: cardWidth + 16, behavior: 'smooth' });
  }

  /**
   * Scrolls the active panel's track backward by one card width.
   */
  previous() {
    const track = this.#getActiveTrack();
    if (!track) return;
    const cardWidth = track.querySelector('.tabbed-carousel__card, .tabbed-carousel__view-all')?.offsetWidth ?? 208;
    track.scrollBy({ left: -(cardWidth + 16), behavior: 'smooth' });
  }

  /**
   * Returns the scroll track of the currently visible panel.
   *
   * @returns {HTMLElement | null}
   */
  #getActiveTrack() {
    const activePanel = this.querySelector('.tabbed-carousel__panel:not([hidden])');
    return activePanel ? activePanel.querySelector('.tabbed-carousel__track') : null;
  }

  /**
   * Attaches scroll listeners to every panel's track and sets initial arrow state.
   */
  #initScrollListeners() {
    for (const panel of this.refs.panels) {
      const track = panel.querySelector('.tabbed-carousel__track');
      if (!track) continue;

      const update = () => this.#updateScrollArrows(panel, track);
      track.addEventListener('scroll', update, { passive: true });
      update(); // set initial state
    }
  }

  /**
   * Toggles prev/end classes on a panel based on its track's current scroll position.
   *
   * @param {HTMLElement} panel
   * @param {HTMLElement} track
   */
  #updateScrollArrows(panel, track) {
    const hasPrev = track.scrollLeft > 0;
    const atEnd = Math.round(track.scrollLeft) + track.clientWidth >= track.scrollWidth;
    panel.classList.toggle('tabbed-carousel__panel--has-prev', hasPrev);
    panel.classList.toggle('tabbed-carousel__panel--at-end', atEnd);
  }
}

customElements.define('tabbed-carousel-component', TabbedCarouselComponent);
