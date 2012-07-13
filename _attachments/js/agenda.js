var dbname = window.location.pathname.split("/")[1];
var appName = window.location.pathname.split("/")[3];
var db = $.couch.db(dbname);

// ____________________________________________________________________________________
$(document).ready(function(){

	$("#participantsTable").tablesorter( );

	db.view(appName + "/agenda",  {
		success:function(data){
			$.each(data.rows, function(i, row){

				var date = new Date(data.rows[i]['key'] + " GMT");

				var ttime = date.toLocaleTimeString();
				var eventTime = ttime.split(":")[0] + ":"  + ttime.split(":")[1];
				var eventDate = data.rows[i]['key'].split(" ")[0];

				var row = '<tr class="' + eventDate +'_body_elements">' 
				row += '<td>' + eventTime + '</td>';  
				row += '<td>' + data.rows[i]['value']['title'] + '</td>'
				
				var speaker = "";
				if( data.rows[i]['value']['speaker']){
					speaker = data.rows[i]['value']['speaker'];
				}
				row += '<td>' + speaker + '</td>'


				$('#' + eventDate + '_body').append(row);
				$('#' + eventDate ).trigger("update");

			});

		}
	});

});