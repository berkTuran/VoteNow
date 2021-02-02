//e.result is not iterable hatası
$(document).ready(() => {
    // var modal = {}
    // modal.status=true
    
    $.post("https://us-central1-votenow-e5dc8.cloudfunctions.net/getAllSurveys").then(e => {
        let row = $("#survey-list");
        
        for (let i of e.result) {  
            row.append(`<div class="boxed boxed--border bg--secondary boxed--lg box-shadow mx-auto" style='overflow-wrap: break-word;'>
                 
                <h5>${i.data.surveyName}</h5>
                <div id='vote-now-survey'><a class="btn btn--primary" data-field='${i.id}'><span class="btn__text" data-field='${i.id}'>Vote Now</span></a></div></div>`
        );
        }
    });
});