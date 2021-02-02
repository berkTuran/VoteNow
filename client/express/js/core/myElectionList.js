//e.result is not iterable hatası
$(document).ready(() => {
    var modal = {}
    modal.userId=localStorage.getItem("id");
    
    $.post("https://us-central1-votenow-e5dc8.cloudfunctions.net/getMyElections", modal).then(e => {
        let row = $("#my-election-list");
        
        for (let i of e.result) {
           console.log(e.result); 
            row.append(`<div class="boxed boxed--border bg--secondary boxed--lg box-shadow mx-auto" style='overflow-wrap: break-word;'>
                <h5>${i.electionName}</h5><p>${i.electionDiscription}</p>
                <div id='vote-now'><a class="btn btn--primary" data-field='${i.id}'><span class="btn__text" data-field='${i.id}'>Vote Now</span></a></div></div>`);
        }
    });
});