/*eslint semi: ["error", "always"]*/
// twitch api server does not allow cross-origin requests so jsonp must be used
// all requests must include headers to define Client_Id and Accept: (define api version)

function clearView() {
  $('#mods-list').html("");
  $('#chatters-list').html("");
  $('#user-details').html("");
}

function showList(bool) {
  if (bool) {
    $('.feedback-section').css({'display':'none'})
    $('.chatters-section').css({'display':'block'})
  } else {
    $('.feedback-section').css({'display':'block'})
    $('.chatters-section').css({'display':'none'})
  }
}

function populateUserDetails(data) {
  $('#user-details').html("");
  $('#user-details').append("<li>Date Created: " + data.users[0].created_at + "</li>");
  $('#user-details').append("<li><img src='" + data.users[0].logo + "'></li>");
  $('#user-details').append("<li>Bio: " + data.users[0].bio + "</li>");
}

// populates the viewers list and attaches onClick to each user
function populateViewers(data) {
  if (data.data.chatter_count <= 1) {
    alert('Did not find any data. Did you check the spelling?');
  }
  var viewersArray = data.data.chatters.viewers;
  var randomViewer = viewersArray[Math.floor(Math.random() * viewersArray.length)];

  data.data.chatters.moderators.forEach(function(mod) {
    var liMod = $("<li><a>" + mod + "</a></li>");
    $('#mods-list').append(liMod);
    liMod.click(function() {
      var url = `https://api.twitch.tv/kraken/users?login=${mod}&api_version=5&client_id=apc58vh6azavxes7g26dbazltd9em3a`;
      $.ajax({
          dataType: 'json',
          url: url
        })
        .done(function(data) {
          populateUserDetails(data);
        });
      $('#user h4').html(`${mod}:`);
    });
  });

  viewersArray.forEach(function(viewer) {
    var liViewer = $("<li><a>" + viewer + "</a></li>");
    $('#chatters-list').append(liViewer);
    liViewer.click(function() {
      var url = `https://api.twitch.tv/kraken/users?login=${viewer}&api_version=5&client_id=apc58vh6azavxes7g26dbazltd9em3a`;
      $.ajax({
          dataType: 'json',
          url: url
        })
        .done(function(data) {
          populateUserDetails(data);
        });
      $('#user h4').html(`${viewer}:`);
    });
  });

  $('#random').click(function(e) {
    var randomViewer = viewersArray[Math.floor(Math.random() * viewersArray.length)];
    var url = `https://api.twitch.tv/kraken/users?login=${randomViewer}&api_version=5&client_id=apc58vh6azavxes7g26dbazltd9em3a`;
    $.ajax({
        dataType: 'json',
        url: url
      })
      .done(function(data) {
        populateUserDetails(data);
      });
    $('#user h4').html(`${randomViewer}:`);
  });
  console.log(data);
}

$(function() {
  showList(false)
  $('#search-box').keypress(function(e) {
    if (e.which == 13) {
      e.preventDefault();
      clearView();
      let streamer = $('#search-box').val().toLowerCase();
      $("#stream-title").html($('#search-box').val());

      // uses chatters api (unsupported twitch) to get chatters list
      // chatters api may break when twitch api defaults to version 5
    var url = `https://tmi.twitch.tv/group/user/${streamer}/chatters`;
    $.ajax({
      dataType: 'jsonp',
      url: url
    })
      .done(function(data) {
        console.log(data);
        if (data.status >= 400) {
          showList(false)
          alert('Could not find that username. Please check twitch.tv to make sure the user is streaming.');
        } else {
          showList(true)
          populateViewers(data);
        }
      })
      .fail(function(data) {
        alert('Request failed.');
      });
    }
  });
  $(document).on('click', 'a', function(event){
    event.preventDefault();
    setTimeout(function () {
      $("html, body").animate({ scrollTop: $("#stream-title").offset().top }, 500 );
    }, 10);
  });
});
