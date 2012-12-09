var dbname = window.location.pathname.split("/")[1];
var appName = window.location.pathname.split("/")[3];
var db = $.couch.db(dbname);

var adamCount = 0;
var dianaCount = 0;
var allenCount = 0;

// ____________________________________________________________________________________
$(document).ready(function(){


  // query the database and ask for all of the items in the agenda.
  // we'll sort through each agenda item and place it in the appropriate
  // table based upon its date. this javascript is tightly coupled to agenda.html

  db.view(appName + "/agenda",  {
    success:function(data){
      $.each(data.rows, function(i, row){

        //each row returned by the database contains a key/value pair
        //in the key is the date of the event, and the value contains an object
        //holding the date, speaker, speaker_id, and title

        //first, parse the key (which holds the date) to a string
        //with the proper timezone before we fill it into a table row

        //have to do this silliness in 
        //order to support IE... I think. Mixed reports.

        var a=data.rows[i]['key'].split(" ");
        var d= a[0].split("-");
        var t= a[1].split(":");

        for(var ii=0; ii<d.length; ii++) { d[ii] = parseInt(d[ii], 10); } 
        for(var ii=0; ii<t.length; ii++) { t[ii] = parseInt(t[ii], 10); } 


        var temp = new Date(d[0],d[1] - 1,d[2],t[0], t[1], t[2]);  
        //our data comes in UTC, so we need to know the local time on the day of the conference
        var date = new Date(d[0],d[1] - 1,d[2],t[0], t[1] + -1*temp.getTimezoneOffset(), t[2]);
  

        //now separate time and date 
        var ttime = date.toLocaleTimeString();
        var eventTime = ttime.split(":")[0] + ":"  + ttime.split(":")[1];
        var eventDate = a[0];

        //debug
        // console.log(ttime)
        // console.log(eventDate)
        // console.log(date)

        //see if there's a particular speaker for this event
        var speaker = "";
        if( data.rows[i]['value']['speaker']){
          speaker = data.rows[i]['value']['speaker'];
        }

        // create the cells of this particular row in the table
        // and give a unique ID to the second cell to be filled in
        // by the code below

        var elId = (eventDate + eventTime + speaker).replace(/ /g,"_").replace(/:/g,"_");

        var row = '<tr class="' + eventDate +'_body_elements" id="rowid_' + elId + '">' 
        row += '<td style="width: 10%" >' + eventTime + '</td>';  
        row += '<td style="width: 60%" id="' + elId + '"></td>'
        row += '<td style="width: 30%">' + speaker + '</td>'

        $('#' + eventDate + '_body').append(row); //this adds the row to the table in agenda.html


        //if we know the speaker_id, and no title was given
        //go to the database and grab the title of the talk


        if( data.rows[i]['value']['speaker_id'] && !data.rows[i]['value']['title'] ){

          db.openDoc(data.rows[i]['value']['speaker_id'].toString(), {

            success: function( participantDoc ) {
              for (var jj in  participantDoc ['fields']){
                if ( participantDoc['fields'][jj]['external_id'] == 'title-of-talk'){
                  
                  var htmlString; 
                  
                 
                  // else 
                  // if(participantDoc['title'] == 'Diana Goehringer')  {
                  //   dianaCount = dianaCount + 1;
                  //   //console.log(participantDoc['title'] + ' ' + dianaCount)
                  //   //htmlString = '<a href="">' + participantDoc['fields'][jj]['values'][0]['value'] + '</a>'
                  //   htmlString = participantDoc['fields'][jj]['values'][0]['value']
                  // }
                  // else 
                  if(participantDoc['title'] == 'Allen Caldwell')  {
                    allenCount = allenCount + 1;
                    //console.log(participantDoc['title'] + ' ' + allenCount)
                    //htmlString = '<a href="">' + participantDoc['fields'][jj]['values'][0]['value'] + '</a>'
                    htmlString = '<a href="https://cloudant.com/db/edelweiss/dmworkshop/' + data.rows[i]['value']['speaker_id'] + '/Caldwell HAP.pdf">' + participantDoc['fields'][jj]['values'][0]['value'] + '</a>'

                  }
                  else{
                    //console.log(participantDoc['title'])
                    htmlString = participantDoc['fields'][jj]['values'][0]['value']
                    for(fileName in participantDoc['_attachments']){
                      htmlString = '<a href="https://cloudant.com/db/edelweiss/dmworkshop/' + data.rows[i]['value']['speaker_id'] + '/' + fileName + '">' + participantDoc['fields'][jj]['values'][0]['value'] + '</a>'
                      break;
                    }
                  }
                  
                  document.getElementById(elId).innerHTML = htmlString;
                }

              }
            }
          });
        }
        
        //otherwise, if a title is given to us in the original return from the database
        //fill in the title here

        if(data.rows[i]['value']['title']){
          document.getElementById(elId).innerHTML =  data.rows[i]['value']['title'] ;
        
          if( data.rows[i]['value']['title'] == "Breakfast")  
            $('#rowid_' + elId).addClass("success")
          
          if (data.rows[i]['value']['title'] == "Lunch" )
            $('#rowid_' + elId).addClass("error")

          if (eventDate != "2012-11-18" && data.rows[i]['value']['title'] == "Dinner")
            $('#rowid_' + elId).addClass("info")
        }


        
        
        $('#' + eventDate ).trigger("update");

      });

    }
  });

});

