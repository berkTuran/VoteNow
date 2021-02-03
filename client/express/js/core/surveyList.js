$(document).ready(() => {
     var modal = {}
     modal.status=true
    
    $.post("https://us-central1-votenow-e5dc8.cloudfunctions.net/getAllSurveys", modal).then(e => {
        let row = $("#survey-list");
        console.log(e.result)
        for (let i of e.result) {  
            row.append(`<div class="boxed boxed--border bg--secondary boxed--lg box-shadow mx-auto" style='overflow-wrap: break-word;'>
                 
                <h5>${i.surveyName}</h5>
                <p>${i.surveyDescription}</p>
                <div id='vote-now-survey'><a class="btn btn--primary" data-field='${i.id}'><span class="btn__text" data-field='${i.id}'>Vote Now</span></a></div></div>`
        );
        }
    });
});