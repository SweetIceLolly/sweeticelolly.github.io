$(() => {
  getContents();
  
  /**
   * Get article from GitHub
   * And parse the markdown
   * Huge thanks to Showdown: https://github.com/showdownjs/showdown
   */
  var article = $('#article');
  (() => {
    showdown.setFlavor('github');
    var converter = new showdown.Converter();
    article.load(article.attr('targetarticle'), () => {
      article.html(converter.makeHtml(article.html()));
    });
  })();

  bindEvents();
});