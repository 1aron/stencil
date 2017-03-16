(function () {
  'use strict';

  /**
   * Base class that provides the core API for Polymer's meta-programming
   * features including template stamping, data-binding, attribute deserialization,
   * and property change observation.
   *
   * @polymerElement
   * @memberof Polymer
   * @extends HTMLElement
   * @mixes Polymer.ElementMixin
   * @summary Custom element base class that provides the core API for Polymer's
   *   key meta-programming features including template stamping, data-binding,
   *   attribute deserialization, and property change observation
   */

  var Element = Polymer.ElementMixin(HTMLElement);
  Polymer.Element = Element;
})();