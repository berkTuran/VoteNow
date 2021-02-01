//BİTEN ELECTİONLAR GETİRİLECEK
$(document).ready(() => {
    $.get("https://us-central1-votenow-e5dc8.cloudfunctions.net/getAllElections").then(e => {
        let row = $("#finished");
        for (let i of e.result) {
            
            row.append(`<div class="boxed boxed--border bg--secondary boxed--lg box-shadow mx-auto" style='overflow-wrap: break-word;'>
                 
                <h5>${i.data.electionName}</h5>
                <div id='vote-now'><a class="btn btn--primary" data-field='${i.id}'><span class="btn__text" data-field='${i.id}'>Vote Now</span></a></div></div>`
        );
        }
    });
});