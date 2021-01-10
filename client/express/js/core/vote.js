$(document).ready(() => {
    let model = { electionId: localStorage.getItem("vote-election-id") };
    $.get("https://us-central1-votenow-e5dc8.cloudfunctions.net/getElection", model)
        .then(e => {
            $("div.row div.col-md-10.col-lg-8")
        });
});