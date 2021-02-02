//veritabanından doğru sonuç dönmüyor!
//arrayde 0. eleman hep null geliyor ve diğer electionlar gelemiyor

$(document).ready(() => {
    var modal = {}
    modal.userId=localStorage.getItem("id");
    
    $.post("https://us-central1-votenow-e5dc8.cloudfunctions.net/getMyElections", modal).then(e => {
        let row = $("#my-election-list");
        
        for (let i of e.result) {
           console.log(e.result);
            
            if (i.isOpen == true ) {
                row.append(`<div class="boxed boxed--border bg--secondary boxed--lg box-shadow mx-auto" style='overflow-wrap: break-word;'>
                <h5>${i.electionName}</h5><p>${i.electionDiscription}</p>
                <div id='vote-now'><a class="btn btn--primary" data-field='${i.id}'><span class="btn__text" data-field='${i.id}'>Vote Now</span></a></div></div>`);
            }else {
                row.append(`<div class="boxed boxed--border bg--secondary boxed--lg box-shadow mx-auto" style='overflow-wrap: break-word;'>
                <h5>${i.electionName}</h5><p>${i.electionDiscription}</p>
                <div id='vote-now'><a class="btn btn--primary" data-field='${i.id}'><span class="btn__text" data-field='${i.id}'>See Results</span></a></div></div>`);
            }
        }
    });
});