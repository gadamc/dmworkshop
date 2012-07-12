var dbname = window.location.pathname.split("/")[1];
var appName = window.location.pathname.split("/")[3];
var db = $.couch.db(dbname);

// ____________________________________________________________________________________
$(document).ready(function(){

	db.openDoc("navbar", {
    success: function(data) {
      var items = [];

      for (var link in data['list']){
        items.push('<li ><a href="' + link + '">' + data['list'][link] + '</a></li>');
      }
      $('#navbarList').append( items.join('') );

    }
  });

});

