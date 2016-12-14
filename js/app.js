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
    $('header').fadeOut('slow', function() {
      $('.chatters-section').css({'display':'block'}).fadeIn();
      $('header').css({'height':'auto'}).fadeIn();
    });
    $('body').fadeIn('slow');
    setTimeout(function () {
      $("html, body").animate({ scrollTop: $("#stream-title").offset().top }, 500 );
    }, 1000);
  } else {
    $('header').css({'height':'calc(100vh - 80px)'});
    $('.chatters-section').css({'display':'none'});
  }
}

function populateUserDetails(data) {
  $('#user-details').fadeOut('slow');
  $('#user-details').html("");
  setTimeout(function () {
    $('#user-details').append("<li><img src='" + data.users[0].logo + "'></li>");
    $('#user-details').append(`<li><h4>${data.users[0].name}</h4></li>`)
    $('#user-details').append("<li>Date Created: " + data.users[0].created_at + "</li>");
    $('#user-details').append("<li>Bio: " + data.users[0].bio + "</li>");
    $('#user-details').fadeIn('slow');
  }, 600);
}

// populates the viewers list and attaches onClick to each user
function populateViewers(data) {
  if (data.data.chatter_count <= 1) {
    showList(false);
    alert('Did not find any data. Did you check the spelling?');
  } else {
    showList(true);
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
          console.log(data,'data');
          populateUserDetails(data);
        });
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
