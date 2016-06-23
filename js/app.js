$(function(){
  $('#search-btn').click(function(e){
    e.preventDefault();
    var streamer = $('#search-box').val().toLowerCase();
    $.getJSON("https://tmi.twitch.tv/group/user/"+streamer+"/chatters?callback=?",function(data){
      var viewersArray = data.data.chatters.viewers
      var randomViewer = viewersArray[Math.floor(Math.random() * viewersArray.length)];
      $('#mods-list').html("")

      $('#chatters-list').html("")
      $('#user-details').html("")
      data.data.chatters.moderators.forEach(function(mod){
        var liMod = $("<li><a>"+mod+"</a></li>");
        $('#mods-list').append(liMod)
        liMod.click(function() {
          $.getJSON("https://api.twitch.tv/kraken/users/"+mod+"?callback=?",function(data){
            $('#user-details').html("")
            $('#user h4').html(mod+":");
            $('#user-details').append("<li>Date Created: "+data.created_at+"</li>" )
            $('#user-details').append("<li><img src='"+data.logo+"'></li>")
            $('#user-details').append("<li>Bio: "+data.bio+"</li>" )
          })
          $('#user h4').html(mod+":");

        })
      })
      viewersArray.forEach(function(viewer){
        var liViewer = $("<li><a>"+viewer+"</a></li>");
        $('#chatters-list').append(liViewer)
        liViewer.click(function() {
          $.getJSON("https://api.twitch.tv/kraken/users/"+viewer+"?callback=?",function(data){
            console.log(data);
            $('#user-details').html("")
            $('#user h4').html(viewer+":");
            $('#user-details').append("<li>Date Created: "+data.created_at+"</li>" )
            $('#user-details').append("<li><img src='"+data.logo+"'></li>")
            $('#user-details').append("<li>Bio: "+data.bio+"</li>" )
          })

        })
      })
      $('#random').click(function(e){
        var randomViewer = viewersArray[Math.floor(Math.random() * viewersArray.length)];
        $.getJSON("https://api.twitch.tv/kraken/users/"+randomViewer+"?callback=?",function(data){
          console.log(data);
          $('#user-details').html("")
          $('#user h4').html(data.name+":");
          $('#user-details').append("<li>Date Created: "+data.created_at+"</li>" )
          $('#user-details').append("<li><img src='"+data.logo+"'></li>")
          $('#user-details').append("<li>Bio: "+data.bio+"</li>" )
        })
      })

      console.log(data);
    })



  })
})
