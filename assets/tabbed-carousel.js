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
  }

  /**
   * Switches the active tab and shows the corresponding panel.
   *
   * @param {Event} event - The click event from the tab button
   */
  switchTab(event) {
    const button = /** @type {HTMLButtonElement} */ (event.target).closest('[data-tab-index]');
    if (!button) return;

    const index = parseInt(button.getAttribute('data-tab-index') ?? '0', 10);

    for (const tab of this.refs.tabs) {
      const tabIndex = parseInt(tab.getAttribute('data-tab-index') ?? '0', 10);
      const isActive = tabIndex === index;

      tab.classList.toggle('tabbed-carousel__tab--active', isActive);
      tab.setAttribute('aria-selected', String(isActive));
    }

    for (const panel of this.refs.panels) {
      const panelIndex = parseInt(panel.getAttribute('data-tab-index') ?? '0', 10);
      const isActive = panelIndex === index;

      if (isActive) {
        panel.removeAttribute('hidden');
      } else {
        panel.setAttribute('hidden', '');
      }
    }
  }
}

customElements.define('tabbed-carousel-component', TabbedCarouselComponent);
