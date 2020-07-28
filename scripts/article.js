$(() => {
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

      // Bind click handler for all img
      $('#article img').click(openImage);
    });
  })();

  /**
   * Open an image in a new tab when it is clicked
   */
  function openImage() {
    window.open($(this).prop('src'));
  }

  /**
   * Get article into from the database
   */
  getArticleInfo = function() {
    $.get('https://sweet-blog-database.herokuapp.com/getarticleinfo?articleid=' + parseInt(article.attr('articleid')))
    .done(data => {
      var contentData = JSON.parse(data.message);

      // Article info template: [YYYY MMM DD] · [Category] · [Count] comment[s]
      $('#article-info').html(
        dateToString(new Date(contentData.time * 1000)) + ' · ' + contentData.category + ' · ' +
        contentData.comments.length + ' comment' + (contentData.comments.length > 1 ? 's' : '')
      );
      if (contentData.comments.length == 0) {
        $('#commentcount').html('Be the first commenter!');
      } else {
        $('#commentcount').html(contentData.comments.length + ' comment' + (contentData.comments.length > 1 ? 's' : ''));
      }

      /*
      Comment template:
      <div class="commentinfo">
          <a class="commenticon" href="[Link]" target="_blank">
              <img src="https://avatars0.githubusercontent.com/u/[id]?s=460">
          </a>
          <div class="commentheader">
              <div class="commenter"><a href="[Link]" target="_blank">[Name]</a></div>
              <div class="commenterclient">[Client]</div>
              <div class="commenteros">[OS]</div>
              <div class="commentdate">[YYYY MMM DD]</div>
              <div class="commentcontent">[Content]</div>
          </div>
      </div>
      */
      var tmpHtml = '';
      contentData.comments.forEach(elem => {
        tmpHtml += '<div class="commentinfo"><a class="commenticon" href="https://github.com/' + elem.username + '" target="_blank">' +
          '<img src="https://avatars0.githubusercontent.com/u/' + elem.githubid + '?s=460"></a><div class="commentheader">' +
          '<div class="commenter"><a href="https://github.com/' + elem.username + '" target="_blank">' + elem.username + '</a></div>' +
          '<div class="commenterclient">' + elem.client + '</div><div class="commenteros">' + elem.os + '</div>' +
          '<div class="commentdate">' + dateToString(new Date(elem.time * 1000)) + '</div>' +
          '<div class="commentcontent">' + elem.content + '</div></div></div>';
      });
      $('#commentsarea').html(tmpHtml);
    })
    .fail(() => {
      $('#commentcount').html('Failed to retrieve comments :(');
    });
  }
  getArticleInfo();
  getContents();

  /**
   * Count for length of the comment
   * escapeHtml: Thanks to https://stackoverflow.com/questions/1787322/htmlspecialchars-equivalent-in-javascript
   */
  var commentBox = $('#commentbox');
  var msgContainer = $('#commentmsg');
  const escapeHtml = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' };
  commentBox.on('input', () => {
    var text = commentBox.val();
    commentBox.val(text.replace(/[\r\n]+/gm, ""));
    var textLength = commentBox.val().trim().replace(/[&<>"']/g, m => { return escapeHtml[m]; }).length;
    if (textLength > 1000) {
      msgContainer.html('<div style="color: red">Length: ' + textLength + '/1000</div>');
    } else {
      msgContainer.html('Length: ' + textLength + '/1000');
    }
  });

  /**
   * Login to GitHub. Send comment request if successfully authenticated
   */
  $('#commentbtn').click(() => {
    var commentContent = commentBox.val().trim();
    var textLength = commentContent.replace(/[&<>"']/g, m => { return escapeHtml[m]; }).length;

    if (textLength == 0) {
      msgContainer.html('Please say something! :(');
      commentBox.focus();
      return;
    }
    if (textLength > 1000) {
      msgContainer.html("Thanks! But that's too long...");
      commentBox.focus();
      return;
    }
    msgContainer.html('<img src="/images/loading.gif">');

    // Initialize with OAuth.io app public key
    OAuth.initialize('Tm3QjK8Ihu-IO8bUig31XpjqAKA');

    // Use popup for OAuth
    OAuth.popup('github')
    .done(github => {
      var payload = {
        token: github.access_token,
        articleid: parseInt(article.attr('articleid')),
        content: commentContent
      };
      $.post('https://sweet-blog-database.herokuapp.com/addcomment', payload)
      .done(data => {
        msgContainer.html('Comment added! Thank you! <span title="LOVE AND DETERMINATION!" style="color: #e25555;">❤</span>');
        getArticleInfo();
        commentBox.val('');
      })
      .fail(xhr => {
        if (xhr.responseJSON) {
          msgContainer.html('Failed to comment! Error ' + xhr.responseJSON.status + ': ' + xhr.responseJSON.message);
        } else {
          msgContainer.html('Failed to comment!');
        }
      });
    })
    .fail(() => {
      msgContainer.html('');
    });
  });

  function submitSurvey() {
    var payload = {
      articleid: parseInt(article.attr('articleid')),
      surveyans: this.id.slice(-1)
    };
    $.post('https://sweet-blog-database.herokuapp.com/submitsurvey', payload);
    $('#surveyarea').html('<div>Thank you for your feedback!</div><div>感谢您的反馈！</div>');
  }
  $('.surveybtn').click(submitSurvey);

  bindEvents();
});