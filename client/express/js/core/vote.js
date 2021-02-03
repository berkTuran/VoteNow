$(document).ready(() => {


    let model = {};
    model.status = true;

    $.post("https://us-central1-votenow-e5dc8.cloudfunctions.net/getAllElections", model)
        .then(e => {

            var election = {};

            let electionId = localStorage.getItem("vote-election-id");
            e.result.forEach(element => {

                if (element.electionId == electionId) {
                    election = element;
                    //break;

                }

            });
            console.log(election);


           

            
            election.candidates.forEach(candidate => {
                console.log(candidate);
                let row = $("#candidate-list");
                row.append(`<div class="boxed boxed--border bg--secondary boxed--lg box-shadow mx-auto" style='overflow-wrap: break-word;'>
            
            <img src="${candidate.profileImageUrl}"  width="200" height="200"> </img>
            <h2>${candidate.firstName+" "+candidate.lastName}</h2>
            <p>${candidate.bio}</p> 
            
            

            
            <div id='vote-now'><a class="btn btn--primary" data-field='${candidate.firstName}'><span class="btn__text" data-field='${candidate.lastName}'>Vote Now</span></a></div></div>`);
        

            });








            
            //$("div.row div.col-md-10.col-lg-8")
        });
});






