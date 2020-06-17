$(() => {
  /**
   * Get contents
   */
  /*
  Contents item template:
  <div class="summary">
      <a class="article-title" href="[link]">[title]</a>
      <div class="article-info">
          [YYYY MMM DD] · [Category] · [Count] comment[s]
      </div>
      <div class="article-desc">
          [Description]
      </div>
  </div>
  */
  var tmpHtml = '';
  var container = $('#content');
  
  container.html('<div style="text-align: center"><img class="loading-img" src="/images/loading.gif"><br>Loading contents...</div>');
  getContents(
    contentData => {
      contentData.forEach(elem => {
        tmpHtml += '<div class="summary"><a class="article-title" href="' + elem.link + '">' + elem.title + '</a>' +
          '<div class="article-info">' + elem.time + ' · ' + elem.category + ' · ' + elem.commentcount + ' comment' +
          (elem.commentcount > 1 ? 's' : '') + '</div><div class="article-desc">' + elem.description + '</div></div>';
      });
      container.html(tmpHtml);
    },
    xhr => {
      if (xhr.responseJSON) {
        container.html('Failed to get contents!<br>Error ' + xhr.responseJSON.status + ': ' + xhr.responseJSON.message);
      } else {
        container.html('Failed to get contents!');
      }
    }
  );

  bindEvents();
});