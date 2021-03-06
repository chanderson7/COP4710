let addConForm =  $("#addConForm")
let addCommentForm = $("#addCommentForm")
let addRSOForm = $("#addRSOForm")

function getFormInfo(form) {
    let data = {}
    form.serializeArray().map(function(x){ data[x.name] = x.value })
    let contact = {"User_id": readCookie("id")}
    contact = $.extend(contact, data)
    // console.log(contact)
    return contact
}

// callbacks
function accDeleteCB(response, textStatus, xhr){
    if (textStatus !== "error") {
        if (response.error === "") {
            $("#delAccAlert").removeClass("collapse alert-danger").addClass("alert-success").text(valMsg.accDelSucc)
            doLogout()
        } else {
            $("#delAccAlert").removeClass("collapse alert-success").addClass("alert-danger").text(response.error)
        }
    }
    else {
        $("#delAccAlert").removeClass("collapse alert-success").addClass("alert-danger").text(valMsg.accDelErr)
    }
}

$("#searchBar").on("keyup", function(event){
    // console.log(event)
    event.stopPropagation()
    let data = {
        "userId" : readCookie("id"), //55
        "search" : $("#searchBar").val()
    }
    // console.log(data)
    postHandler(data, searchCB, API.searchCon)
})

function addConCB(response, status, xhr){
    let newContact
    if (status !== "error") {
        if (response.error === "Event Added!") {
            $("#addConAlert").removeClass("collapse alert-danger").addClass("alert-success").text(response.error)
            // re-search to show new contact
            postHandler({}, searchCB, API.viewAllEvents)
        } else {
            $("#addConAlert").removeClass("collapse alert-success").addClass("alert-danger").text(response.error)
            // $("#loginPass").removeClass("is-valid")
            // $("#loginUser").removeClass("is-valid")
        }
    } else {
        $("#addConAlert").removeClass("collapse alert-success").addClass("alert-danger").text(valMsg.addConErr)
    }
}

function addRSOCB(response, status, xhr){
    if (status !== "error") {
        console.log(response)
        if (response.error === "RSO Added!") {

            $("#addRSOAlert").removeClass("collapse alert-danger").addClass("alert-success").text(response.error)
            // re-search to show new contact
            postHandler({}, searchRSOCB, API.viewAllRSOs)
        } else {
            $("#addRSOAlert").removeClass("collapse alert-success").addClass("alert-danger").text(response.error)
            // $("#loginPass").removeClass("is-valid")
            // $("#loginUser").removeClass("is-valid")
        }
    } else {
        $("#addRSOAlert").removeClass("collapse alert-success").addClass("alert-danger").text("Http Error")
    }
}

// event and validation handling
$(function() {
    // add contact
    addConForm.validate({
        submitHandler: function (form, event) {
            event.preventDefault()
            // console.log(event)

            let data = getFormInfo($("#addConForm"))
            postHandler(data, addConCB, API.createEvent)
        },
        rules: {
            Category: "required",
            Name: "required",
            Event_id: "required",
            Description: "required",
            Time: "required",
            Date: "required",
            Contact_email: "required",
            Contact_phone: {
                validPhone: true
            }
        },
        messages: {
            // Category: valMsg.noFName,
            Name: valMsg.noLName,
            Description: valMsg.noDesc,
            Contact_email: valMsg.badEmail,
            Contact_phone: {
                validPhone: valMsg.badPhone
            }
        },
        errorClass: "is-invalid",
        validClass: "is-valid",
        errorPlacement: function(error, element){
            $(element).next().append(error)
        }
    })

    addCommentForm.validate({
        submitHandler: function (form, event) {
            event.preventDefault()
            // console.log(event)

            let data = getFormInfo($("#addCommentForm"))
            data = $.extend(data, {"Event_id":currentEvent})
            postHandler(data, addCommentCB, API.addComment)
        },
        rules: {
            Category: "required",
                Name: "required",
                Description: "required",
                Time: "required",
                Date: "required",
                Contact_email: "required",
                Contact_phone: {
                    validPhone: true
            }
        },
        messages: {
            // Category: valMsg.noFName,
            Name: "Please provide a name",
            Description: valMsg.noDesc,
            Time:"Please provide a time",
            Date:"Please provide a date",
            Contact_email: valMsg.badEmail,
            Contact_phone: {
                validPhone: valMsg.badPhone
            }
        },
        errorClass: "is-invalid",
            validClass: "is-valid",
            errorPlacement: function(error, element){
            $(element).next().append(error)
        }
    })

    addRSOForm.validate({
        submitHandler: function (form, event) {
            event.preventDefault()
            // console.log(event)
            let data = getFormInfo($("#addRSOForm"))
            // console.log(data)
            postHandler(data, addRSOCB, API.createRSO)
        },
        rules: {
            Name: "required",
            // RSO_id: "Required",
            Description: "required",
        },
        messages: {
            Name: "Please provide a name",
            // RSO_id: "Please provide an ID",
            Description: valMsg.noDesc,
        },
        errorClass: "is-invalid",
        validClass: "is-valid",
        errorPlacement: function(error, element){
            $(element).next().append(error)
        }
    })

    //delete account
    $("#accDelForm").validate({
        submitHandler: function (form, event){
            event.preventDefault()
            let data = getLoginInfo($("#accDelForm"))
            postHandler(data, accDeleteCB, API.delAcc)
        },// validation settings for form
        rules: {
            login: "required",
            password: "required"
        },
        messages: {
            login: "Please enter your username",
            password: "Please enter your password"
        },
        errorClass: "is-invalid",
        errorPlacement: function(error, element){
            $(element).next().append(error)
        }
    })
})

// functions to reset form fields and validation
$("#addConModal").on("hide.bs.modal", function(event){
    addConForm[0].reset()
    $("#addConForm").validate().resetForm()
    $("#addConAlert").addClass("collapse").removeClass("alert-danger alert-success")
})

$("#addCommentModal").on("hide.bs.modal", function(event){
    addCommentForm[0].reset()
    $("#addCommentForm").validate().resetForm()
    $("#addCommentAlert").addClass("collapse").removeClass("alert-danger alert-success")
})

$("#addRSOModal").on("hide.bs.modal", function(event){
    addRSOForm[0].reset()
    $("#addRSOForm").validate().resetForm()
    $("#addRSOAlert").addClass("collapse").removeClass("alert-danger alert-success")
})

$("#editConForm").on("keydown", function(){
    // $("#editAlert").addClass("collapse").removeClass("alert-danger alert-success")
})
$("#accDelForm").on("keydown",function(){
    $("#delAccAlert").addClass("collapse").removeClass("alert-danger alert-success")
})
addConForm.on("keydown", function(){
    $("#addConAlert").addClass("collapse").removeClass("alert-danger alert-success")
})
addCommentForm.on("keydown", function(){
    $("#addCommentAlert").addClass("collapse").removeClass("alert-danger alert-success")
})



$("#logoutBtn").click(function (event){
    doLogout()
})

$(function() {
    $(document).ready(function(){
        if (readCookie("id") < 0){
            window.location.href = "index.html";
        }
    });
})

// validator settings
$(function() {
    $.validator.addMethod("validPhone", function (value, element) {
        return phonePattern.test(value)
    })

})
// $.validator.setDefaults({});
function makeContactDiv(contact){
    let contactDiv = document.createElement("div");
}

function fillContactDiv(contact,contactDiv){
    // setting contact attributes
    contact.setAttribute("class","contact");
    contact.setAttribute("id",contact.ID);
    // adding the name part
    let contactName = document.createElement("div");
    contactName.setAttribute("class","contactNameText");
    contactName.innerHTML = contact.firstName +" "+contact.lastName;
    // add the button
    let extendButton = document.createElement("button");
    extendButton.setAttribute("class","contactExtendButton");
    extendButton.setAttribute("contactID",contact.ID);
    // here we would add the event listener
    contact.appendChild(contactName);
}
/*
function getContactInfo(contact){
  let email = contact.email;
  let phoneNum = contact.phoneNum;
  let contactInfoDiv = document.createElement("div");
  contactInfoDiv.innerHTML = email + "  "+ phoneNum;
  return contactInfoDiv;
}
*/
function basicCallback(response, status, xhr) {
    console.log("GENERIC CALLBACK\n", response + "\n", status+"\n", xhr+"\n");
}

/*
function postJSONSearch(url, json_data) {
    var xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.responseType = "json";
    xhr.send(JSON.stringify(json_data));
    xhr.onload = function() {
        var status = xhr.status;
        if (status === 200) {
            myCallback(null, xhr.response);
        } else {
            myCallback(status, xhr.response);
        }
    }
}
*/

// let demoRequest = {"userId":"55","search":""};
// postJSONSearch("https://cop4331.acobble.io/Search.php",demoRequest);
