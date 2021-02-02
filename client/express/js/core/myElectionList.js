//e.result is not iterable hatası
$(document).ready(() => {
    var modal = {}
    modal.id=localStorage.getItem("id");
    modal.status=false;
    
    $.post("https://us-central1-votenow-e5dc8.cloudfunctions.net/getAllElections", modal).then(e => {
        let row = $("#my-election-list");
        
        for (let i of e.result) {
           console.log(e.result); 
            row.append(`<div class="boxed boxed--border bg--secondary boxed--lg box-shadow mx-auto" style='overflow-wrap: break-word;'>
                <h5>${i.data.electionName}</h5><p>${i.data.electionDiscription}</p>
                <div id='vote-now'><a class="btn btn--primary" data-field='${i.id}'><span class="btn__text" data-field='${i.id}'>Vote Now</span></a></div></div>`);
        }
    });
});