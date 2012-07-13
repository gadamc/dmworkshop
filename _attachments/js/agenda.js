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

				var speaker = "";
				if( data.rows[i]['value']['speaker']){
					speaker = data.rows[i]['value']['speaker'];
				}

				var row = '<tr class="' + eventDate +'_body_elements">' 
				row += '<td>' + eventTime + '</td>';  
				row += '<td id="' + eventDate + eventTime + speaker + '"></td>'
				console.log("adding a row with ID " + eventDate + eventTime + speaker);				
				//console.log(data.rows[i])
				//console.log( document.getElementById(eventDate + eventTime + speaker).innerHTML );
				
				row += '<td>' + speaker + '</td>'

				console.log("appending row to " + eventDate);
				$('#' + eventDate + '_body').append(row);				

				//if we know the speaker_id, and no title was given
				if( data.rows[i]['value']['speaker_id'] && !data.rows[i]['value']['title'] ){
					console.log("found speaker id and no title");
					db.openDoc(data.rows[i]['value']['speaker_id'].toString(), {

						success: function( participantDoc ) {
							console.log("found doc" + data.rows[i]['value']['speaker_id'] )
							for (var jj in  participantDoc ['fields']){
								if ( participantDoc['fields'][jj]['external_id'] == 'title-of-talk'){
									document.getElementById(eventDate + eventTime + speaker).innerHTML = participantDoc['fields'][jj]['values'][0]['value'] ;
									console.log( participantDoc['fields'][jj]['values'][0]['value'] );
									console.log( document.getElementById(eventDate + eventTime + speaker).innerHTML );
								}
							}
						}
					});
				}
				
				if(data.rows[i]['value']['title']){
					console.log("found  title");
					document.getElementById(eventDate + eventTime + speaker).innerHTML =  data.rows[i]['value']['title'] ;
					console.log( document.getElementById(eventDate + eventTime + speaker).innerHTML );
				}


				
				$('#' + eventDate ).trigger("update");

			});

		}
	});

});