$(document).ready(() => {
    var modal = {}
    //oy vermeye açık electionları çağırır
    modal.status = true;

    $.post("https://us-central1-votenow-e5dc8.cloudfunctions.net/getAllElections", modal).then(e => {

        for (let i of e.result) {
            let row = $("#election-list");
            row.append(`<div class="boxed boxed--border bg--secondary boxed--lg box-shadow mx-auto" style='overflow-wrap: break-word;'>
            <h5>${i.electionName}</h5><p>${i.electionDiscription}</p>
            
            <div id='vote-now'><a class="btn btn--primary" data-field='${i.electionId}'><span class="btn__text" data-field='${i.electionId}'>Vote Now</span></a></div></div>`);
            console.log(i.electionId) }
    });

    
    setTimeout(() => {
        $("div#vote-now").on("click", (e) => {
            console.log($(e.target).attr("data-field")); 
            let id = $(e.target).attr("data-field");
            
                
            localStorage.setItem("vote-election-id", id);
            location.href = "/vote.html";
        });
    }, 1000);
});