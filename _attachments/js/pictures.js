var dbname = window.location.pathname.split("/")[1];
var db = $.couch.db(dbname);

// ____________________________________________________________________________________
$(document).ready(function(){

	db.openDoc("pictures", {
    success: function(data) {
      var items = [];

      items.push('<img src="https://cloudant.com/db/edelweiss/dmworkshop/pictures/group.jpg">');

      for (var link in data['_attachments']){
      	if(link != 'group.jpg')
        	items.push('<img src="https://cloudant.com/db/edelweiss/dmworkshop/pictures/' + link + '">');
      }
      $('.pics').append( items.join('') );

      $('.pics').cycle({
		fx: 'shuffle', // choose your transition type, ex: fade, scrollUp, shuffle, etc...
		timeout: 0, 
    	next:   '#next2', 
    	prev:   '#prev2'
	});

    }
  });

});

