// Toggle delay (ms)
const toggleSpeed = 200;

// If sidebar is shown in mobile site
var sidebarShown = false;

/**
 * Bind events control the sidebar
 */
function bindEvents() {
  /**
   * Toggle sidebar when click on the button
   */
  $('#sidebar-toggle').click(() => {
    $('#sidebar').toggle(toggleSpeed);
    sidebarShown = !sidebarShown;
  });

  /**
   * Toggle sidebar when the window is resized
   * If screen is small and previously the user didn't show the sidebar, hide it
   */
  $(window).resize(() => {
    if (!window.matchMedia('(max-width: 768px)').matches) {
      $('#sidebar').show(toggleSpeed);
    } else {
      if (!sidebarShown) {
        $('#sidebar').hide(toggleSpeed);
      }
    }
  });

  /**
   * Hide sidebar if the screen is small and the user click on the screen
   */
  $('#content').click(() => {
    if (window.matchMedia('(max-width: 768px)').matches) {
      $('#sidebar').hide(toggleSpeed);
      sidebarShown = false;
    }
  });

  /**
   * Show sidebar if the screen is large
   */
  if (!window.matchMedia('(max-width: 768px)').matches) {
    $('#sidebar').show(toggleSpeed);
  }

  /**
   * Toggle timeline
   */
  $('#toggletimeline').click(() => {
    $('#timelineresult').toggle(toggleSpeed);
  });

  /**
   * Toggle category
   */
  $('#togglecategory').click(() => {
    $('#categoryresult').toggle(toggleSpeed);
  });

  /**
   * Search for articles
   */
  var searchBox = $('#search');
  searchBox.on('input', () => {
    var searchResult = $('#searchresult');
    searchStr = searchBox.val().toLowerCase();
    if (searchStr.trim().length > 0) {
      var tmpHtml = '';
      contents.forEach(elem => {
        if (elem.title.toLowerCase().search(searchStr) != -1) {
          tmpHtml += '<li><a href="' + elem.link + '" title="' + elem.title + '">' + elem.title + '</a></li>';
        }
      });
      searchResult.show();
      searchResult.html(tmpHtml);
    } else {
      searchResult.hide(toggleSpeed, () => {
        searchResult.html('');
      });
    }
  });

  /**
   * Clear search box when the user clicks Esc
   */
  searchBox.keydown(e => {
    if (e.keyCode === 27) {
      searchBox.val('');
      searchBox.trigger('input');
    }
  });
}

/**
 * Toggle timeline items
 */
function toggleTimelineItems() {
  $('#timelineresult > div:nth-child(' + ($(this).parent().index() + 2) + ')').toggle(toggleSpeed);
}

/**
 * Toggle category items
 */
function toggleCategoryItems() {
  $('#categoryresult > div:nth-child(' + ($(this).parent().index() + 2) + ')').toggle(toggleSpeed);
}