(function () {
  var input = document.getElementById('searchInput');
  var results = document.getElementById('searchResults');
  if (!input || !results) return;

  var pages = [];
  var controller = null;
  var indexUrl = input.dataset.indexUrl || '/index.json';

  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  function normalize(value) {
    return String(value || '').toLocaleLowerCase().normalize('NFKD').replace(/[\u0300-\u036f]/g, '');
  }

  function fuzzyScore(text, term) {
    var direct = text.indexOf(term);
    if (direct !== -1) return 1000 - direct - (text.length - term.length) * 0.01;
    var ti = 0;
    var first = -1;
    var gaps = 0;
    for (var i = 0; i < text.length && ti < term.length; i += 1) {
      if (text[i] === term[ti]) {
        if (first === -1) first = i;
        if (ti > 0) gaps += i - 1;
        ti += 1;
      }
    }
    return ti === term.length ? 300 - first - gaps * 0.25 : -1;
  }

  function scorePage(page, terms) {
    var title = normalize(page.title);
    var tags = normalize((page.tags || []).join(' '));
    var body = normalize(page.content || page.summary);
    var total = 0;
    for (var i = 0; i < terms.length; i += 1) {
      var titleScore = fuzzyScore(title, terms[i]);
      var tagScore = fuzzyScore(tags, terms[i]);
      var bodyScore = fuzzyScore(body, terms[i]);
      var best = Math.max(titleScore * 4, tagScore * 2.5, bodyScore);
      if (best < 0) return -1;
      total += best;
    }
    return total;
  }

  function render(q) {
    q = normalize(q).trim();
    if (!q) {
      results.innerHTML = '<p class="search-empty">' + escapeHtml(input.dataset.empty) + '</p>';
      return;
    }
    var terms = q.split(/\s+/).filter(Boolean);
    var list = pages.map(function (page) {
      return { page: page, score: scorePage(page, terms) };
    }).filter(function (match) {
      return match.score >= 0;
    }).sort(function (a, b) {
      return b.score - a.score;
    }).slice(0, 30).map(function (match) {
      return match.page;
    });
    if (!list.length) {
      results.innerHTML = '<p class="search-empty">' + escapeHtml(input.dataset.noResults) + '</p>';
      return;
    }
    results.innerHTML = list.map(function (p) {
      var tags = (p.tags && p.tags.length) ? ' · ' + p.tags.join(', ') : '';
      return '<a class="search-result" href="' + p.url + '">' +
        '<div class="search-result__title">' + escapeHtml(p.title) + '</div>' +
        '<div class="search-result__meta">' + escapeHtml(p.date) + escapeHtml(tags) + '</div>' +
        '<div class="search-result__summary">' + escapeHtml(p.summary) + '</div></a>';
    }).join('');
  }

  function loadIndex() {
    if (controller) controller.abort();
    controller = 'AbortController' in window ? new AbortController() : null;
    results.setAttribute('aria-busy', 'true');
    results.innerHTML = '<p class="search-empty">' + escapeHtml(input.dataset.loading) + '</p>';
    fetch(indexUrl, controller ? { signal: controller.signal } : {})
    .then(function (r) {
      if (!r.ok) throw new Error('HTTP ' + r.status);
      return r.json();
    })
    .then(function (d) {
      pages = (d && d.pages) || [];
      results.setAttribute('aria-busy', 'false');
      render(input.value);
    })
    .catch(function (error) {
      if (error && error.name === 'AbortError') return;
      results.setAttribute('aria-busy', 'false');
      results.innerHTML = '<div class="search-error"><p>' + escapeHtml(input.dataset.error) + '</p><button class="btn btn--ghost" type="button" data-search-retry>' + escapeHtml(input.dataset.retry) + '</button></div>';
    });
  }

  results.addEventListener('click', function (event) {
    if (event.target.closest('[data-search-retry]')) loadIndex();
  });

  loadIndex();

  var inputTimer = null;
  input.addEventListener('input', function () {
    window.clearTimeout(inputTimer);
    inputTimer = window.setTimeout(function () { render(input.value); }, 120);
  });
})();
