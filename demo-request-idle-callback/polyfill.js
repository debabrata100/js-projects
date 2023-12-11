window.requestCustomIdleCallback =
  window.requestCustomIdleCallback ||
  function (cb, options) {
    var start = Date.now();
    return setTimeout(function () {
      cb({
        didTimeout: Date.now() - start > timeout || false,
        timeRemaining: function () {
          var timeout = options ? options.timeout : 0;
          if (timeout) {
            return Math.max(0, 50 - (Date.now() - start));
          }
          return Math.max(0, 50 - (Date.now() - start));
        },
      });
    }, 1);
  };

window.cancelCustomIdleCallback =
  window.cancelIdleCallback ||
  function (id) {
    clearTimeout(id);
  };
