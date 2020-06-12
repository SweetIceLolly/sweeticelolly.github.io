const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
var contents;

/**
 * Convert Date object to string
 * @param {Date} date Date object
 */
function dateToString(date) {
  return date.getFullYear() + ' ' + months[date.getMonth()] + ' ' + ('0' + date.getDate()).slice(-2) +
    ' ' + ('0' + date.getHours()).slice(-2) + ':' + ('0' + date.getMinutes()).slice(-2);
}

/**
 * Get contents
 * @param {function(data)} done Callback function called when the request successes
 * @param {function(xhr)} fail Callback function called when the request fails
 */
function getContents(done, fail) {
  contents = [];
  $.get('https://sweet-blog-database.herokuapp.com/getcontents')
  .done(data => {
    var contentData = JSON.parse(data.message);

    // Store contents
    contentData.forEach(elem => {
      contents.push(elem);
    });

    // Analyze timeline and category nodes
    var timeline = {}, category = {};
    var dateString;
    var timelineContainer = $('#timelineresult');
    var categoryContainer = $('#categoryresult');

    contents.forEach((elem, index, arr) => {
      // List unique months
      arr[index].time = dateToString(new Date(elem.time * 1000));
      dateString = arr[index].time.slice(0, 8);
      if (timeline[dateString] === undefined) {
        timeline[dateString] = [elem];
      } else {
        timeline[dateString].push(elem);
      }

      // List unique categories
      if (category[elem.category] === undefined) {
        category[elem.category] = [elem];
      } else {
        category[elem.category].push(elem);
      }
    });

    /*
    Item template:
    <li>
        <a href="javascript:;" title="[Name]">[Name]</a>
    </li>
    <div resultname="[Name]">
        <ul class="navbar extra-padding">
            <li>
                <a href="/" title="[Article Title]">[Article Title]</a>
            </li>
        </ul>
    </div>
    */
    var timelineHtml = '', categoryHtml = '';
    Object.keys(timeline).forEach(key => {
      timelineHtml += '<li><a href="javascript:;" title="' + key + '">' + key + '</a>' +
        '</li><div resultname="' + key + '"><ul class="navbar extra-padding">';
      timeline[key].forEach(elem => {
        timelineHtml += '<li><a href="' + elem.link + '" title="' + elem.title + '">' + elem.title + '</a></li>';
      });
      timelineHtml += '</ul></div>';
    });
    Object.keys(category).forEach(key => {
      categoryHtml += '<li><a href="javascript:;" title="' + key + '">' + key + '</a>' +
        '</li><div resultname="' + key + '"><ul class="navbar extra-padding">';
      category[key].forEach(elem => {
        categoryHtml += '<li><a href="' + elem.link + '" title="' + elem.title + '">' + elem.title + '</a></li>';
      });
      categoryHtml += '</ul></div>';
    });

    timelineContainer.html(timelineHtml);
    categoryContainer.html(categoryHtml);

    // Bind click event to every added node
    $('#timelineresult > li > a').click(toggleTimelineItems);
    $('#categoryresult > li > a').click(toggleCategoryItems);

    // Call the callback function
    if (done) {
      done(contents);
    }
  })
  .fail(fail);
}