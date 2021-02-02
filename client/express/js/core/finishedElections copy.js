$(document).ready(() => {
    var modal = {}
    modal.status=false
    
    $.post("https://us-central1-votenow-e5dc8.cloudfunctions.net/getAllSurveys", modal).then(e => {
        let row = $("#finished");
        
        for (let i of e.result) {
          console.log(e.result);  
            row.append(`<div class="boxed boxed--border bg--secondary boxed--lg box-shadow mx-auto" style='overflow-wrap: break-word;'>
                 
                <h5>${i.data.surveyName}</h5>
                <div id='vote-now'><a class="btn btn--primary" data-field='${i.id}' href="surveyresult.html" ><span class="btn__text" data-field='${i.id}'>Results</span></a></div></div>`
        );
        }
    });
});