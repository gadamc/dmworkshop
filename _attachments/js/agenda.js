var dbname = window.location.pathname.split("/")[1];
var appName = window.location.pathname.split("/")[3];
var db = $.couch.db(dbname);

// ____________________________________________________________________________________
$(document).ready(function(){

	$("#participantsTable").tablesorter( );



	db.view(appName + "/agenda",  {
		success:function(data){
			$.each(data.rows, function(i, row){


				//have to do this silliness in 
				//order to support IE... I think. Mixed reports.

				var a=data.rows[i]['key'].split(" ");
				var d= a[0].split("-");
				var t= a[1].split(":");

				for(var ii=0; ii<d.length; ii++) { d[ii] = parseInt(d[ii], 10); } 
				for(var ii=0; ii<t.length; ii++) { t[ii] = parseInt(t[ii], 10); } 

				var temp = new Date();  //our data comes in UTC, so we need to know the local time
				var date = new Date(d[0],d[1] - 1,d[2],t[0], t[1] + -1*temp.getTimezoneOffset(), t[2]);
	


				//now separate time and date and fill table column
				var ttime = date.toLocaleTimeString();
				var eventTime = ttime.split(":")[0] + ":"  + ttime.split(":")[1];
				var eventDate = a[0];

				//debug
				// console.log(ttime)
				// console.log(eventDate)
				// console.log(date)

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