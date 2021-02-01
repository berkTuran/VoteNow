$("#freePlan").click(async () => {

    if (localStorage.getItem("id") != null) {
       
           alert("Purchase successful!");
           localStorage.setItem("plan",1);
       

    } else {
       alert("You need to login first!");
       location.href = "/signin.html"
    }
 
 });
 
 $("#bestPlan").click(async () => {
 
 if (localStorage.getItem("id") != null) {
    $("#submit-payment").click(async () => {
   
        let model = {};
        model.fname = $("input#fname").val();
        model.pmail = $("input#pmail").val();
        model.state = $("input#state").val();
        model.zip = $("input#zip").val();
        model.cname = $("input#cname").val();
        model.ccnum = $("input#ccnum").val();
        model.expmonth = $("input#expmonth").val();
        model.expyear = $("input#expyear").val();
        model.cvv = $("input#cvv").val();
    
    
        if (model.fname === "" || model.pmail === "" || model.zip === "" || model.state === "" || model.cname === "" || model.ccnum === "" || model.expmonth === "" || model.expyear === "" || model.cvv === "") {
            alert("Required value can't be left blank.");
        } else {
          
             localStorage.setItem("plan",2);
            

                alert("Purchase successful!");
    
           
        }
    
    });
 } else {
    alert("You need to login first!");
    location.href = "/signin.html"
 }
 
 });
 
 $("#premiumPlan").click(async () => {
 
 if (localStorage.getItem("id") != null) {
    $("#submit-payment").click(async () => {
   
        let model = {};
        model.fname = $("input#fname").val();
        model.pmail = $("input#pmail").val();
        model.state = $("input#state").val();
        model.zip = $("input#zip").val();
        model.cname = $("input#cname").val();
        model.ccnum = $("input#ccnum").val();
        model.expmonth = $("input#expmonth").val();
        model.expyear = $("input#expyear").val();
        model.cvv = $("input#cvv").val();
    
    
        if (model.fname === "" || model.pmail === "" || model.zip === "" || model.state === "" || model.cname === "" || model.ccnum === "" || model.expmonth === "" || model.expyear === "" || model.cvv === "") {
            alert("Required value can't be left blank.");
        } else {
           
          
            localStorage.setItem("plan",3)
            alert("Purchase successful!");

        }
        
    
    });
 } else {
    alert("You need to login first!");
    location.href = "/signin.html"
 }
 
 });
