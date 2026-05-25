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
}

customElements.define('tabbed-carousel-component', TabbedCarouselComponent);
