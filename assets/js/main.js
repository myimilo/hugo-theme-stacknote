(function () {
  document.documentElement.classList.add('js');
  var navToggle = document.getElementById('siteNavToggle');
  if (navToggle) {
    var syncNavState = function () {
      navToggle.setAttribute('aria-expanded', navToggle.checked ? 'true' : 'false');
    };
    navToggle.addEventListener('change', syncNavState);
    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape' && navToggle.checked) {
        navToggle.checked = false;
        syncNavState();
        navToggle.focus();
      }
    });
    syncNavState();
  }
  document.querySelectorAll('[data-copy-code]').forEach(function (button) {
    button.addEventListener('click', function () {
      var block = button.closest('.code-block');
      var code = block && block.querySelector('pre code');
      if (!code || !navigator.clipboard) return;
      navigator.clipboard.writeText(code.textContent).then(function () {
        var original = button.textContent;
        button.textContent = button.dataset.copiedLabel || original;
        window.setTimeout(function () { button.textContent = original; }, 1600);
      });
    });
  });
})();
