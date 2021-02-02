$(document).ready(() => {
    var modal = {}
    modal.status=false
    
    $.post("https://us-central1-votenow-e5dc8.cloudfunctions.net/getAllElections", modal).then(e => {
        let row = $("#finished");
        
        for (let i of e.result) {
          console.log(e.result);  
            row.append(`<div class="boxed boxed--border bg--secondary boxed--lg box-shadow mx-auto" style='overflow-wrap: break-word;'>
                 
                <h5>${i.electionName}</h5>
                <div id='vote-now'><a class="btn btn--primary" data-field='${i.id}' href="result.html" ><span class="btn__text" data-field='${i.id}'>See Results</span></a></div></div>`
        );
        }
    });
});