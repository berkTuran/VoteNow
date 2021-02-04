$(document).ready(() => {
    if (localStorage.getItem("vote-election-id") == null) {
        location.href = "/electionList.html";
    }
    let electionId = localStorage.getItem("vote-election-id");
    localStorage.removeItem("vote-election-id");

    let model = {};
    model.status = true;
    var election = {};
    var rand = {};

    $.post("https://us-central1-votenow-e5dc8.cloudfunctions.net/getAllElections", model)
        .then(e => {
            e.result.forEach(element => {
                if (element.electionId == electionId) {
                    election = element;
                }
            });
            election.candidates.forEach(candidate => {
                let row = $("#candidate-list");

                row.append(
                    `<div class="boxed boxed--border bg--secondary boxed--lg box-shadow mx-auto" style='overflow-wrap: break-word;'>
                    <p style="text-align:center;"><img src="${candidate.profileImageUrl}"  width="200" height="200"> </img> </p>
                        <h2 style="text-align:center;">${candidate.firstName + " " + candidate.lastName}</h2>
                                <p style="text-align:center;" >${candidate.bio}</p> 
                    <div id='submit-button' onClick="clickButton('${electionId}');"   data-field='${candidate.id}' style="text-align:center;"><a class="btn btn--primary" >
                        <span class="btn__text" >Vote Now</span></a></div></div>`);

            });
        });

    


    



});


async function clickButton(id) {
    let model2 = {};
    model2.electionId = id;
    model2.userId = localStorage.getItem('id')
    model2.candidateId = $("#submit-button").attr("data-field");

    let result = await $.post("https://us-central1-votenow-e5dc8.cloudfunctions.net/voteElection", model2);
    if (!!result.error) {
        alert(result.error);
    } else {
        alert("Vote Success!");
        location.href = "/home.html";
    }


}