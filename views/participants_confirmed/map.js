function(doc) {
 if(doc.title){
  
  var output = {};

  for (var i in doc.fields){
   var extId = doc.fields[i]['external_id'];

   if (extId == "comfirmed"){
    output["confirmed"] = doc.fields[i]['values'][0]['value']['text'];
   }

   if (extId == "name" || extId == "contact-e-mail-address" || extId == "companyorganisation"
        || extId == "title-of-talk"){
   
     output[extId] =  doc.fields[i]['values'][0]['value'] ; 
  
   }
  }
  emit(output["confirmed"], output);
 }
}