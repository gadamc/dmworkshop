var dbname = window.location.pathname.split("/")[1];
var appName = window.location.pathname.split("/")[3];
var db = $.couch.db(dbname);

// ____________________________________________________________________________________
$(document).ready(function(){

	$("#participantsTable").tablesorter( );

	db.view(appName + "/participants_confirmed",  {
		key:"yes",
		success:function(data){
			$.each(data.rows, function(i, row){

				var row = '<tr class="participantsTable_body_elements">' 
				row += '<td>'+data.rows[i]['value']['name']+'</td>';  
				row += '<td>'+data.rows[i]['value']['companyorganisation']+'</td>'
				row += '<td>'+data.rows[i]['value']['title-of-talk']+'</td>'   
				$('#participantsTable_body').append(row);

				$("#participantsTable").trigger("update");

			});

		}
	});

});