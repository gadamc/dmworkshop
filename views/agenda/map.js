function(doc) {
 if(doc.type == "agenda"){
  
  var output = {};

  for (var i in doc.fields){
   var extId = doc.fields[i]['external_id'];

   if (extId == "date"){

     output[extId] =  doc.fields[i]['values'][0]['start'] ;
   }

   if(extId == "title"){
     output[extId] =  doc.fields[i]['values'][0]['value'] ; 
   }

   if(extId == "speaker"){
     output[extId] =  doc.fields[i]['values'][0]['value']['title']; 
   }

   if(extId == "event-title"){
     output["location"] =  doc.fields[i]['values'][0]['value'] ; 
   }

  }
  emit(output["date"], output);
 }
}