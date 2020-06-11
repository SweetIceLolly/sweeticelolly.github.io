var newWindow;
var msg = $('#message');
var articleTemplate;

$(() => {
  $.get('article_template.html')
  .done(data => {
    articleTemplate = data;
  })
  .fail(() => {
    msg.html('Failed to load template!');
  });
  
  $('#preview').click(() => {
    var title = $('#title').val().trim();
    var desc = $('#description').val().trim();
    var link = $('#link').val().trim();
    var mdLink = $('#rawmdlink').val().trim();
    var category = $('#category').val().trim();

    msg.html('');
    if (!(title.length * desc.length * link.length * mdLink.length * category.length)) {
      msg.html('Information incomplete');
      return;
    }

    var preview = articleTemplate.replace(/\[ARTICLE_TITLE\]/g, title);
    preview = preview.replace(/\[RAW_MD_URL\]/g, mdLink);
    preview = preview.replace(/\[CATEGORY_NAME\]/g, category);
    newWindow = window.open();
    newWindow.document.write(preview);
  });

  $('#loadcontents').click(() => {
    newWindow.dispatchEvent(new Event('load'));
  });

  $('#submit').click(() => {
    var password = $('#password').val();
    msg.html('');
    if (password.length == 0) {
      msg.html('Password cannot be empty');
      return;
    }

    var title = $('#title').val().trim();
    var desc = $('#description').val().trim();
    var link = $('#link').val().trim();
    var mdLink = $('#rawmdlink').val().trim();
    var category = $('#category').val().trim();

    // Check for potential mistakes
    if (link.slice(-5) !== '.html') {
      if (!confirm('Link is not suffixed by ".html"! Proceed?')) {
        return;
      }
    }
    if (mdLink.slice(0, 34) !== 'https://raw.githubusercontent.com/') {
      if (!confirm('Raw markdown link is not prefixed by "https://raw.githubusercontent.com/"! Proceed?')) {
        return;
      }
    }
    if (mdLink.slice(-3) !== '.md') {
      if (!confirm('Raw markdown link is not suffixed by ".md"! Proceed?')) {
        return;
      }
    }

    msg.html('Loading...');
    var payload = {
      password: password,
      title: title,
      description: desc,
      link: link,
      category: category
    };
    $.post('https://sweet-blog-database.herokuapp.com/addarticle', payload)
    .done(data => {
      var contentData = JSON.parse(data.message);
      msg.html('Article added. id=' + contentData.id);

      // Generate the article page
      var preview = articleTemplate.replace(/\[ARTICLE_TITLE\]/g, title);
      preview = preview.replace(/\[RAW_MD_URL\]/g, mdLink);
      preview = preview.replace(/\[CATEGORY_NAME\]/g, category);
      preview = preview.replace(/\[ARTICLE_ID\]/g, contentData.id);

      // Download the page
      // Thanks to https://ourcodeworld.com/articles/read/189/how-to-create-a-file-and-generate-a-download-with-javascript-in-the-browser-without-a-server
      var element = document.createElement('a');
      element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(preview));
      element.setAttribute('download', link);
      element.style.display = 'none';
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
    })
    .fail(xhr => {
      if (xhr.responseJSON) {
        msg.html('Failed! Error ' + xhr.responseJSON.status + ': ' + xhr.responseJSON.message);
      } else {
        msg.html('Failed!');
      }
    });
  });
});