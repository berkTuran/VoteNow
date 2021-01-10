$(document).ready(() => {
    $.get("https://us-central1-votenow-e5dc8.cloudfunctions.net/getAllElections").then(e => {
        let row = $("#election-list");
        for (let i of e.result) {
            row.append(`<div class="boxed boxed--border bg--secondary boxed--lg box-shadow mx-auto" style='overflow-wrap: break-word;'>
            <h5>${i.data.electionName}</h5><p>${i.data.electionDiscription}</p>
            <div id='vote-now'><a class="btn btn--primary" data-field='${i.id}'><span class="btn__text" data-field='${i.id}'>Vote Now</span></a></div></div>`);
        }
    });

    setTimeout(() => {
        $("div#vote-now").on("click", (e) => {
            let id = $(e.target).attr("data-field");
            console.log(id);
            localStorage.setItem("vote-election-id", id);
            location.href = "/vote.html";
        });
    }, 1000);
});