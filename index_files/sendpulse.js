/**
 * @copyright (C) 2016 SendPulse Inc.
 * @author Victor Burak <vb@sendpulse.com>
 */
(function(window) {
  'use strict';

  var jQ;
  var HOST_PRODUCTION = '//login.sendpulse.com';
  var HOST_DEVELOPMENT = '//login.sendpulse.dev';

  /**
   * @param {string} id Form id
   * @constructor
   *
   * @description
   * SPForm Class constructor.
   */
  function SPForm(id) {
    var self = this;

    /**
     * Forms registry in global scope.
     */
    window.SPFormRegistry = window.SPFormRegistry || {};

    self.id = id;
    self.formSelector = '#sp-form-' + self.id;
    self.$form = jQ(self.formSelector);
    self.$formMessage = jQ(self.formSelector + ' .sp-message');
    self.$formOuter = jQ(self.formSelector).parent('.subscribe-form');
    self.$submitButton = jQ(self.formSelector + ' button.form-button');
    self.$closeButton = jQ(self.formSelector + ' .sp-btn-close');
    self.formHash = self.$form.attr('sp-hash');
    self.formType = self.$form.hasClass('sp-form-popup') ? 'popup' : 'embed';
    self.formType = self.$form.hasClass('sp-form-fixed') ? 'fixed' : self.formType;
    self.inputs = {};
    self.inputsSelector = self.formSelector + ' .sp-element-container :input';
    self.language = self.$form.attr('sp-lang');
    self.preparedData = {};
    self.sent = false;

    self.showOptions = {};
    self.submitURL = HOST_PRODUCTION;

    self.submitURL += '/members/forms/jsonp-submit';
    self.history = new SPHistory(self.formHash);
    self.valid = true;
    self.ipInfo = {};
    self.previewMode = window.location.hostname === 'forms.sendpulse.com';

    self.init();
  }

  /**
   * @return {SPForm} SPForm
   *
   * @description
   * Initialize form elements.
   */
  SPForm.prototype.init = function() {
    var self = this;

    self.$closeButton.on('click', function(e) {
      self.close(e);
    });

    self.$submitButton.prop('disabled', !self.valid);

    jQ(self.inputsSelector).each(function(i, e) {
      var $input = jQ(e);

      /**
       * @description
       * Remove visible tips.
       */
      $input.hideTip = function() {
        if ($input.hasClass('subscribe-form-invalid')) {
          this.removeClass('subscribe-form-invalid');
          this.next('.subscribe-form-popup').detach();
        }
      };

      /**
       * @param {String} type Tip type
       *
       * @description
       * Show specified tip for input element
       */
      $input.showTip = function(type) {
        var tips = JSON.parse(decodeURIComponent(this.attr('sp-tips')));

        this.addClass('subscribe-form-invalid');

        if (tips.hasOwnProperty(type)) {
          this.after(jQ('<div/>', {
            class: 'subscribe-form-popup subscribe-form-invalid',
            html: tips[type]
          }));
        }
      };

      $input.on('focus', function(e) {
        self.hideAllTips();
      });

      // if ($input.attr('sp-type') === 'phone') {
      if ($input.attr('name') === 'sform[phone]') {
        $input.intlTelInput({
          initialCountry: 'auto',
          separateDialCode: true,
          geoIpLookup: function(callback) {
            jQ.get('//ipinfo.io', function() {
            }, 'jsonp').always(function(resp) {
              self.ipInfo = resp;
              var countryCode = (resp && resp.country) ? resp.country : '';
              callback(countryCode);
            });
          },
          utilScript: '//cdnjs.cloudflare.com/ajax/libs/intl-tel-input/9.2.4/js/utils.js'
        });
      }

      self.inputs[e.name] = $input;
    });

    self.$submitButton.off('click').on('click', function(e) {
      self.submit();
    });

    if (self.previewMode) {
      self.$form.removeClass('sp-form-popup');
      self.$form.removeClass('sp-form-fixed');
      self.$formOuter.removeClass('sp-popup-outer');
      self.$closeButton.remove();
    }

    return self;
  };

  /**
   * @description
   * Start form.
   */
  SPForm.prototype.run = function() {
    var self = this;

    self.show();

    // console.log('SPForm', self, 'IP info', self.ipInfo);
  };

  /**
   * @description
   * Hide all opened tips.
   */
  SPForm.prototype.hideAllTips = function() {
    var self = this;

    for (var i in self.inputs) {
      if (self.inputs.hasOwnProperty(i) && self.inputs[i].hasOwnProperty('hideTip')) {
        self.inputs[i].hideTip();
      }
    }
  };

  /**
   * @description
   * Disavle all inputs after sending.
   */
  SPForm.prototype.disableInputs = function() {
    var self = this;

    jQ(self.inputsSelector).prop('disabled', true);
    self.$submitButton.prop('disabled', true);
  };

  /**
   * @param {Object} e Event
   *
   * @description
   * Close form according to conditions.
   */
  SPForm.prototype.close = function(e) {
    var self = this;

    self.$formOuter.addClass('sp-hide');

    if (!self.history.getSubmits().length) {
      self.history.addReject((new Date()).getTime());
    }
  };

  /**
   * @description
   * Show 'popup' form according to conditions.
   */
  SPForm.prototype.show = function() {
    var self = this;

    // Make visible whole form container first.
    self.$formOuter.removeClass('sp-force-hide');
    self.history.addLastShow();

    if (self.previewMode) {
      raiseForm();
      return;
    }

    if (self.formType !== 'embed') {
      if (self.history.getSubmits().length) {
        return;
      }

      if (self.history.getRejects().length > 1) {
        return;
      }

      if (self.history.getRejects().length === 1) {
        var now = (new Date()).getTime();
        var diffInDays = (now - self.history.getLastShow()) / 86400000; // 1 day = 1000 * 60 * 60 * 24;

        if (self.showOptions.repeat > 0 && diffInDays < self.showOptions.repeat) {
          return;
        }
      }

      if (self.formType === 'popup') {
        showPopup();
      }

      if (self.formType === 'fixed') {
        raiseForm();
      }
    }

    /**
     * @private
     * @description
     * Show 'popup' form.
     */
    function showPopup() {
      switch (self.showOptions.condition) {
        case 'onEnter':
          raiseForm(self.showOptions.delay);
          break;
        case 'onScroll':
          jQ(window).scroll(function() {
            if (jQ(window).scrollTop() + jQ(window).height() === jQ(document).height()) {
              raiseForm();
            }
          });
          break;
        case 'onClose':
          jQ(window).on('unload', function(e) {
            e.preventDefault();
            raiseForm();
          });
          break;
        default:
      }
    }

    /**
     * @private
     * @param {Integer=} delay Delay in seconds
     *
     * @description
     * Shows form div.
     */
    function raiseForm(delay) {
      delay = delay || 0.2;
      delay *= 1000;

      setTimeout(function() {
        self.$formOuter.addClass('sp-showing');
        setTimeout(function() {
          self.$formOuter.addClass('sp-show');
        }, 200);
        setTimeout(function() {
          self.$formOuter.removeClass('sp-showing');
        }, 400);
      }, delay);
    }
  };

  /**
   * @return {SPForm} SPForm
   *
   * @description
   * Validate all the inputs.
   */
  SPForm.prototype.validateAll = function() {
    var self = this;
    self.valid = true;

    // console.log('validateAll()');

    for (var i in self.inputs) {
      if (self.inputs.hasOwnProperty(i) && self.inputs[i].attr('sp-type') !== undefined) {
        var $input = self.inputs[i];
        var result = self.validate($input);
        self.valid = self.valid && result;
      }
    }

    return self;
  };

  /**
   * @param {Object} $input Input field (jQuery object)
   * @return {boolean} Validation status
   *
   * @description
   * Validate one input field.
   */
  SPForm.prototype.validate = function($input) {
    var self = this;
    var type = $input.attr('sp-type');

    // console.log('- validate', type, $input);

    if (type === undefined) {
      return true;
    }

    if ($input.name === 'sform[phone]') {
      type = 'phone';
    }

    var valid = true;
    var value = $input.val();

    $input.hideTip();

    if ($input.prop('required') && value === '') {
      valid = false;
      $input.showTip('required');
      self.$submitButton.prop('disabled', false);

      return valid;
    }

    if (valid && value !== '') {
      switch (type) {
        case 'address':
          valid = isValidAddress(value);
          break;
        case 'date':
          valid = isValidDate(value);
          break;
        case 'email':
          valid = isValidEmail(value);
          break;
        case 'phone':
          if ($input.prop('required')) {
            valid = isValidPhone($input);
          }
          break;
        default:
      }
    }

    if (!valid) {
      $input.showTip('wrong');
    }

    return valid;

    /**
     * @private
     * @param {string} value Value
     * @return {boolean} Validation status
     */
    function isValidAddress(value) {
      return true;
    }

    /**
     * @private
     * @param {string} value Value
     * @return {boolean} Validation status
     */
    function isValidDate(value) {
      return true;
    }

    /**
     * @private
     * @param {string} value Value
     * @return {boolean} Validation status
     */
    function isValidEmail(value) {
      var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

      return re.test(value);
    }

    /**
     * @private
     * @param {string} value Value
     * @return {boolean} Validation status
     */
    function isValidPhone(value) {
      return jQ.trim($input.val()) ? $input.intlTelInput("isValidNumber") : false;
    }
  };

  /**
   * @param {Object} response Response object
   *
   * @description
   * JSONP callback for submit.
   */
  SPForm.prototype.cbSubmit = function(response) {
    var self = this;

    // console.log('cbSubmit()', response);

    if (response.hasOwnProperty('html') && response.hasOwnProperty('status')) {
      if (response.status === 'success') {
        self.$formMessage.addClass('sp-message-success');
        self.sent = true;
        $('.subscribe-form-field').hide();
        self.history.addSubmit();
      } else {
        self.$formMessage.addClass('sp-message-error');
      }
      self.$formMessage.html(response.html);
    }

    self.removeInstanceFromRegistry();
  };

  /**
   * @description
   * Submit the form to remote server.
   */
  SPForm.prototype.submit = function() {
    var self = this;

    if (self.formType === 'popup' && self.history.getSubmits().length > 1) {
      throw new Error('Form has been submitted twice already. Enough!');
    }

    if (!self.sent) {
      self.validateAll();

      if (self.valid) {
        self.putInstanceToRegistry();
        prepareData();
        self.disableInputs();
        send();
      }
    }

    /**
     * @private
     *
     * @description
     * Make request with JSONP.
     */
    function send() {
      jQ.ajax({
        url: self.submitURL + '?callback=?',
        dataType: "jsonp",
        data: self.preparedData,
        jsonpCallback: self.makeCallbackName('cbSubmit')
      });
    }

    /**
     * @private
     *
     * @description
     * Prepare form data to send.
     */
    function prepareData() {
      for (var i in self.inputs) {
        if (self.inputs.hasOwnProperty(i)) {
          var input = self.inputs[i];

          switch (input.attr('sp-type')) {
            case 'phone':
              self.preparedData[i] = input.intlTelInput('getNumber');
              break;
            case 'checkbox':
              if (input.prop('checked')) {
                self.preparedData[i] = input.val();
              } else {
                self.preparedData[i] = 'no';
              }
              break;
            case 'radio':
              // ugly crutch!!!
              self.preparedData[i] = jQ('[name="' + i + '"]:checked').val();
              break;
            default:
              self.preparedData[i] = input.val();
          }
        }
      }

      // Fucking compatibility to ugly legacy engine.
      self.preparedData.sform_lang = self.language;
      self.preparedData["sform[hash]"] = self.formHash;

      self.preparedData["sform[" + window.btoa('autoSite') + "]"] = window.location.host;

      if (!jQ.isEmptyObject(self.ipInfo)) {
        self.preparedData["sform[" + window.btoa('autoIp') + "]"] = self.ipInfo.ip;
        self.preparedData["sform[" + window.btoa('autoCity') + "]"] = self.ipInfo.city;
        self.preparedData["sform[" + window.btoa('autoRegion') + "]"] = self.ipInfo.region;
        self.preparedData["sform[" + window.btoa('autoCountry') + "]"] = self.ipInfo.country;
      }

      // console.log('prepareData()', self.preparedData);
    }
  };

  /**
   * @param {string} method Method name
   * @return {string} Callback name
   *
   * @description
   * Get normalized callback name to keep link with current instance.
   */
  SPForm.prototype.makeCallbackName = function(method) {
    var self = this;
    return "SPFormRegistry['" + self.formHash + "']." + method;
  };

  /**
   * @description
   * Put current instance to registry.
   */
  SPForm.prototype.putInstanceToRegistry = function() {
    var self = this;
    window.SPFormRegistry[self.formHash] = self;
  };

  /**
   * @description
   * Remove current instance from registry.
   */
  SPForm.prototype.removeInstanceFromRegistry = function() {
    var self = this;
    if (window.SPFormRegistry[self.formHash] !== undefined) {
      delete window.SPFormRegistry[self.formHash];
    }
  };
// --- end of SPForm

  /**
   * @param {String} formHash Form hash
   * @constructor
   *
   * @description
   * SPHistory constructor
   */
  function SPHistory(formHash) {
    var self = this;

    self.formHash = formHash;
    self.all = self.raise();
  }

  /**
   * @description
   * Read all history from local storage
   * @return {{submits: Array, rejects: Array, lastShow: number}} History data object
   */
  SPHistory.prototype.raise = function() {
    var self = this;

    if (localStorage.hasOwnProperty(self.formHash)) {
      try {
        return JSON.parse(localStorage.getItem(self.formHash));
      } catch (e) {
        console.error(e);
      }
    }

    return {submits: [], rejects: [], lastShow: 0};
  };

  /**
   * @description
   * Persist history
   */
  SPHistory.prototype.persist = function() {
    var self = this;

    localStorage.setItem(self.formHash, JSON.stringify(self.all));
  };

  /**
   * @description
   * Add value helper.
   * @param {string} key Storage key
   * @param {string} value Value
   */
  SPHistory.prototype.add = function(key, value) {
    var self = this;
    value = value || (new Date()).getTime();

    switch (key) {
      case 'submits':
      case 'rejects':
        self.all[key].push(value);
        break;
      case 'lastShow':
        self.all[key] = value;
        break;
      default:
    }

    self.persist();
  };

  SPHistory.prototype.addSubmit = function(value) {
    var self = this;
    self.add('submits', value);
  };

  SPHistory.prototype.addReject = function(value) {
    var self = this;
    self.add('rejects', value);
  };

  SPHistory.prototype.addLastShow = function(value) {
    var self = this;
    self.add('lastShow', value);
  };

  /**
   * @param {string} key Storage key
   * @return {*} Value
   *
   * @description
   * Get value helper.
   */
  SPHistory.prototype.get = function(key) {
    var self = this;

    if (self.all.hasOwnProperty(key)) {
      return self.all[key];
    }
  };

  SPHistory.prototype.getSubmits = function() {
    var self = this;
    return self.get('submits');
  };

  SPHistory.prototype.getRejects = function() {
    var self = this;
    return self.get('rejects');
  };

  SPHistory.prototype.getLastShow = function() {
    var self = this;
    return self.get('lastShow');
  };

// --- end of SPHistory

  /**
   * @constructor
   *
   * @description
   * Resource loader.
   */
  function ResourceLoader() {
  }

  /**
   * @static
   * @param {String} url URL
   * @param {Function} callback Callback function
   * @return {Promise} Promise
   *
   * @description
   * Load script and invoke callback in case of success.
   */
  ResourceLoader.loadScript = function(url, callback) {
    return new Promise(function(resolve, reject) {
      var script = document.createElement("script");

      script.type = "text/javascript";
      script.async = true;
      script.src = url + '?t=' + (new Date()).getTime();
      document.getElementsByTagName("head")[0].appendChild(script);

      if (script.readyState) { // IE
        script.onreadystatechange = function() {
          if (script.readyState === "loaded" ||
            script.readyState === "complete") {
            script.onreadystatechange = null;
            (typeof callback === 'function') && callback();
            resolve();
          }
        };
      } else { // Others browsers
        script.onload = function() {
          (typeof callback === 'function') && callback();
          resolve();
        };
      }

      script.onerror = function() {
        reject(new Error('Loading fail! ' + url));
      };
    });
  };

  /**
   * @static
   * @param {String} url URL
   * @param {Function} callback Callback function
   * @return {Promise} Promise
   *
   * @description
   * Load CSS file and invoke callback in case of success.
   */
  ResourceLoader.loadCss = function(url, callback) {
    return new Promise(function(resolve, reject) {
      var script = document.createElement("link");

      script.rel = 'stylesheet';
      script.media = 'screen';
      script.href = url + '?t=' + (new Date()).getTime();
      document.getElementsByTagName("head")[0].appendChild(script);

      if (script.readyState) { // IE
        script.onreadystatechange = function() {
          if (script.readyState === "loaded" ||
            script.readyState === "complete") {
            script.onreadystatechange = null;
            (typeof callback === 'function') && callback();
            resolve();
          }
        };
      } else { // Others browsers
        script.onload = function() {
          (typeof callback === 'function') && callback();
          resolve();
        };
      }

      script.onerror = function() {
        reject(new Error('Loading fail! ' + url));
      };
    });
  };

  /**
   * @static
   * @param {Function} callback Callback function
   */
  ResourceLoader.loadPromisePolyfill = function(callback) {
    var url = '//polyfill.io/v2/polyfill.min.js?flags=gated,always&features=Promise,&rum=0';
    var script = document.createElement("script");

    script.type = "text/javascript";
    script.async = false;
    script.src = url + '?t=' + (new Date()).getTime();
    document.getElementsByTagName("head")[0].appendChild(script);

    if (script.readyState) { // IE
      script.onreadystatechange = function() {
        if (script.readyState === "loaded" ||
          script.readyState === "complete") {
          script.onreadystatechange = null;
          (typeof callback === 'function') && callback();
        }
      };
    } else { // Others browsers
      script.onload = function() {
        (typeof callback === 'function') && callback();
      };
    }

    script.onerror = function() {
      throw new Error('Loading fail! ' + url);
    };
  };
// --- end of ResourceLoader

  /**
   * @param {function} callback Success callback.
   *
   * @description
   * The bootstraping function:
   *  - checks jQuery and loads it if none presented
   *  - executes callback function on success
   */
  function spBootstrap(callback) {
    var resume = new Promise(function(resolve, reject) {
      if (typeof window.jQuery === 'undefined') {
        ResourceLoader.loadScript('//ajax.googleapis.com/ajax/libs/jquery/3.1.1/jquery.min.js',
          function() {
            // console.log('Load jQuery');
            jQ = window.jQuery;
          })
          .then(function() {
            resolve();
          });
      } else {
        // console.log('jQuery exists');
        jQ = window.jQuery;
        resolve();
      }
    });

    resume.then(callback);
  }

  /**
   * @description
   * Run the application.
   */
  function spStart() {
    var cdnHost = 'cdn.sendpulse.com';

    var queue = [];
    var phone = jQ('div.sp-form [name="sform[phone]"]');
    var ids = gatherFormsIds();

    var dep = new Promise(function(resolve, reject) {
      // Load dependency for phone input
      if (phone.length > 0) {
        queue.push(
          ResourceLoader.loadCss('//cdnjs.cloudflare.com/ajax/libs/intl-tel-input/9.2.4/css/intlTelInput.css'));
        queue.push(
          ResourceLoader.loadScript('//cdnjs.cloudflare.com/ajax/libs/intl-tel-input/9.2.4/js/intlTelInput.min.js'));
        queue.push(
          ResourceLoader.loadScript('//cdnjs.cloudflare.com/ajax/libs/intl-tel-input/9.2.4/js/utils.js'));
      }

      Promise.all(queue).then(
        function() {
          resolve();
        },
        function(reason) {
          console.error('Necessary scripts have not been loaded:', reason);
        });
    });

    dep.then(function() {
      for (var i = 0, l = ids.length; i < l; i++) {
        // console.log('Start form', ids[i]);
        (new SPForm(ids[i])).run();
      }
    });
  }

  /**
   * @return {Array} Array of forms ids.
   * @throws Form missing exception.
   *
   * @description
   * Get array of available forms ids.
   */
  function gatherFormsIds() {
    var forms = jQ('div.sp-form');
    var count = forms.length;
    var ids = [];

    if (!count) {
      throw new Error('SendPulse: Subscription form ID is missing or code is corrupted!');
    }

    for (var i = 0; i < count; i++) {
      ids.push(jQ(forms[i]).attr('sp-id'));
    }

    return ids;
  }

  /**
   * Main run.
   */
  window.onload = function() {
    var forms = $('div.sp-form');
    if (!forms.length) {
      console.log('SendPulse: no subscription form on that page. Do not load SendPulse script here!');
      return;
    }

    var promisesSupported = typeof Promise !== "undefined" && Promise.toString().indexOf("[native code]") !== -1;

    if (promisesSupported) {
      spBootstrap(spStart);
    } else {
      ResourceLoader.loadPromisePolyfill(function() {
        spBootstrap(spStart);
      });
    }
  };
})(window);

//# sourceMappingURL=default-handler.js.map
