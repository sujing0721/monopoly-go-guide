/* MONOPOLY GO! Strategy Hub — shared scripts (all features guard on element presence) */
(function () {
  /* Section fade-in (panels are visible via <noscript> fallback if JS is off) */
  var panels = document.querySelectorAll('.section-panel');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('in-view'); io.unobserve(e.target); }
      });
    }, { threshold: 0.15 });
    panels.forEach(function (p) { io.observe(p); });
  } else {
    panels.forEach(function (p) { p.classList.add('in-view'); });
  }

  /* Event type filter — cards are static HTML so crawlers can read them */
  var eventGrid = document.getElementById('eventGrid');
  var eventFilters = document.getElementById('eventFilters');
  if (eventGrid && eventFilters) {
    eventFilters.querySelectorAll('.filter-btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        eventFilters.querySelectorAll('.filter-btn').forEach(function (b) { b.classList.remove('active'); });
        btn.classList.add('active');
        var f = btn.dataset.filter;
        eventGrid.querySelectorAll('.event-card').forEach(function (card) {
          card.classList.toggle('hidden', f !== 'All' && card.dataset.type !== f);
        });
      });
    });
  }

  /* On-page search */
  var searchInput = document.getElementById('siteSearch');
  if (searchInput) {
    var searchEmpty = document.getElementById('searchEmpty');
    var selectors = '.stage, .tip-card, .event-card, .order-list li, .duo-col li, .sticker-card';
    searchInput.addEventListener('input', function () {
      var q = searchInput.value.trim().toLowerCase();
      var visibleCount = 0;
      document.querySelectorAll(selectors).forEach(function (item) {
        var match = q === '' || item.textContent.toLowerCase().includes(q);
        item.style.display = match ? '' : 'none';
        if (match) visibleCount++;
      });
      document.querySelectorAll('.card-section').forEach(function (sec) {
        var hasSearchable = sec.querySelector(selectors);
        var anyVisible = Array.prototype.slice.call(sec.querySelectorAll(selectors))
          .some(function (el) { return el.style.display !== 'none'; });
        sec.style.display = (q !== '' && hasSearchable && !anyVisible) ? 'none' : '';
      });
      if (searchEmpty) searchEmpty.classList.toggle('show', q !== '' && visibleCount === 0);
    });
  }

  /* Dice allocation planner */
  var totalDice = document.getElementById('totalDice');
  if (totalDice) {
    var evSlider = document.getElementById('evSlider');
    var buSlider = document.getElementById('buSlider');
    var pvSlider = document.getElementById('pvSlider');
    var evPct = document.getElementById('evPct');
    var buPct = document.getElementById('buPct');
    var pvPct = document.getElementById('pvPct');
    var calcWarn = document.getElementById('calcWarn');
    var outEvent = document.getElementById('outEvent');
    var outBuild = document.getElementById('outBuild');
    var outPvp = document.getElementById('outPvp');

    function updateCalc() {
      var total = Math.max(0, Number(totalDice.value) || 0);
      var ev = Number(evSlider.value), bu = Number(buSlider.value), pv = Number(pvSlider.value);
      var sum = ev + bu + pv;

      evPct.textContent = ev + '%';
      buPct.textContent = bu + '%';
      pvPct.textContent = pv + '%';

      calcWarn.textContent = sum !== 100
        ? 'Your three sliders add up to ' + sum + '%. Aim for 100% — figures below are scaled proportionally.'
        : '';

      var safeSum = sum || 1;
      outEvent.textContent = Math.round(total * ev / safeSum);
      outBuild.textContent = Math.round(total * bu / safeSum);
      outPvp.textContent = Math.round(total * pv / safeSum);
    }
    [totalDice, evSlider, buSlider, pvSlider].forEach(function (el) {
      el.addEventListener('input', updateCalc);
    });
    updateCalc();
  }
})();
