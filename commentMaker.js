let currentEVComment = 0;
const CONTACTS_PER_PAGE = 10;
let currentComments;
// let userID;


function applyHidden(div) {
    div.setAttribute("class",div.getAttribute("class")+ " hidden");
}

// adds a contact
function addConCB(response, status, xhr){
    let newContact
    if (status !== "error") {
        if (response.error === "") {
            $("#addConAlert").removeClass("collapse alert-danger").addClass("alert-success").text(valMsg.addConSucc)
            // re-search to show new contact
            let searchData = {
                "userId" : readCookie("id"), //55
                "search" : $("#searchBar").val()
            }
            postHandler(searchData, searchCommentCB, API.searchCon)
        } else {
            $("#addConAlert").removeClass("collapse alert-success").addClass("alert-danger").text(valMsg.conExist)
            // $("#loginPass").removeClass("is-valid")
            // $("#loginUser").removeClass("is-valid")
        }
    } else {
        $("#addConAlert").removeClass("collapse alert-success").addClass("alert-danger").text(valMsg.addConErr)
    }
}

function deleteComment(commentID){
    let markedContact = document.getElementById(commentID);
    if(window.confirm("Are you sure you want to delete this contact?")){
        let data = {User_id:commentID, Event_id:sessionStorage.getItem('event')};
        console.log(data, "\nIn"+ API.deleteComment);
        //API CALL
        var xhr = new XMLHttpRequest();
        xhr.open("POST", urlBase + site + API.deleteComment, true);
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.responseType = "json";
        console.log(urlBase + site + API.deleteComment);
        console.log(JSON.stringify(data));
        xhr.send(JSON.stringify(data));
        xhr.onload = function() {
            var status = xhr.status;
            if (status === 200) {
                if (xhr.response.error === "") {
                    markedContact.remove();
                    window.alert("Contact successfully deleted")
                    // re-search to remove deleted contact on page change
                    let searchData = { Event_id: currentEvent}
                    postHandler(searchData, searchCommentCB, API.viewComments)
                } else {
                    window.alert(xhr.response.error)
                }
            }
        }
        console.log('HEY');
    }
}

/*function deleteContact(id){
  let markedContact = document.getElementById(id);
  if(window.confirm("Are you sure you want to delete this contact?")){
    let data = {contactId:id};
    console.log(data, "\nIn"+ API.delCon)
    //API CALL
    $.ajax({
      url: urlBase + site + API.delCon,
      data: data,
      method: "POST",
      contentType: "application/json; charset=UTF-8",
      dataType: "json",
      success: function (response, textStatus, xhr) {
        console.log("SUCCESS:\n", response, textStatus)
        if (response.error === "") {
          markedContact.remove();
          window.alert("Contact successfully deleted")
        } else {
          window.alert("Contact does not exist")
        }
      },
      error: function(xhr, textStatus, error){
        console.log("\n\tERROR:\n", textStatus, error)
        window.alert("Communication error, please try again")
      }
    }).always(function (xhr, status, error) {
      console.log("IN ALWAYS,\n XHR:", xhr, "\nSTATUS:\n", status, "\nERR:\n", error)
    })
  }
}*/


function makeCommentEditButtons(commentID){
    let newRow = document.createElement("div");
    newRow.setAttribute("class","row editButtons");
    newRow.setAttribute("commentID",commentID);
    let confirmEditButton = document.createElement("button");
    let rejectEditButton = document.createElement("button");
    confirmEditButton.setAttribute("class","col text-right editCommentButton");
    rejectEditButton.setAttribute("class","col removeCommentButton");
    rejectEditButton.addEventListener("click",function(){ rejectEdit() });
    confirmEditButton.addEventListener("click",function(){ confirmCommentEdit(commentID) });
    confirmEditButton.innerHTML = "Confirm Edit";
    rejectEditButton.innerHTML = "Reject Edit";
    newRow.appendChild(confirmEditButton);
    newRow.appendChild(rejectEditButton);
    return newRow;
}
function rejectEdit(){
    resetPageState();
}
function getChildValueByClass(parent,divClass){
    return parent.querySelector("."+divClass).value;
}
function apiCallForEdit(data){
    //API CALL
    var xhr = new XMLHttpRequest();
    xhr.open("POST", urlBase + site + API.editComment, true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.responseType = "json";
    console.log(JSON.stringify(data));
    console.log(urlBase + site + API.editComment);
    xhr.send(JSON.stringify(data));
    xhr.onload = function() {
        var status = xhr.status;
        if (status === 200) {
            if (xhr.response.error === "") {

            } else {
            }
        }
    }
    console.log('HEY');
}
function confirmCommentEdit(commentID){
    // probably not necessary
    //DO API CALL HERE
    // IF THE CALL IS VALID RESET STATE
    // OTHERWISE DISPLAY ISSUE AND WAIT UNTIL BUTTON IS PRESSED AGAIN
    let comment = document.getElementById(commentID);
    let commentText  = getChildValueByClass(comment,"commentText");
    let rating  = getChildValueByClass(comment,"ratingText");

    let data = {
        "Event_id": sessionStorage.getItem("event"),
        "User_id": commentID,
        "Text": commentText,
        "Rating": rating
    };
    // data = $.extend(data, apiCall)
    console.log(data)
    apiCallForEdit(data);
    setTimeout(()=>{ resetPageState() },100);
}
function prepareCommentEdit(commentID){
    let curComment = document.getElementById(commentID);

    /*make the new name div and input fields
    let inputRow = curComment.querySelector(".contactNameText");
    let firstNameInput = document.createElement("input");
    let lastNameInput = document.createElement("input");
    // Set attributes
    firstNameInput.setAttribute("value",inputRow.getAttribute("firstname"));
    firstNameInput.setAttribute("class","firstname col");
    lastNameInput.setAttribute("value",inputRow.getAttribute("lastname"));
    lastNameInput.setAttribute("class","lastname col");

    // append the children to the row class
    inputRow.innerHTML = "";
    inputRow.appendChild(firstNameInput);
    inputRow.appendChild(lastNameInput);*/

    // do the same for email and phone
    let textRatingInfoContentDiv = curComment.querySelector(".textRatingInfoContent");
    let oldTextDiv = curComment.querySelector(".commentText");
    let oldRatingDiv = curComment.querySelector(".ratingText");
    let newTextDiv = document.createElement("input");
    let newRatingDiv = document.createElement("input");

    newTextDiv.setAttribute("value",oldTextDiv.innerHTML);
    newRatingDiv.setAttribute("value",oldRatingDiv.innerHTML);
    newTextDiv.setAttribute("class","commentText contactInfoText col");
    newRatingDiv.setAttribute("class","ratingText contactInfoText col");
    textRatingInfoContentDiv.innerHTML = "";
    textRatingInfoContentDiv.appendChild(newTextDiv);
    textRatingInfoContentDiv.appendChild(newRatingDiv);

    // remove old buttons
    curComment.querySelector(".editButtons").remove();
    curComment.appendChild(makeCommentEditButtons(commentID));
}


// this takes the div class attribute as well as  the inner content
function makeEditDeleteCommentButtons(commentID){ // this will have to be user_id, one per user.
    let newRow = document.createElement("div");
    newRow.setAttribute("class","row editButtons");
    newRow.setAttribute("commentID",commentID);//
    let editButton = document.createElement("button");
    let deleteButton = document.createElement("button");
    editButton.setAttribute("class","col text-right editCommentButton");
    deleteButton.setAttribute("class","col removeCommentButton");//
    deleteButton.addEventListener("click",function(){ deleteComment(commentID) });
    editButton.addEventListener("click",function(){prepareCommentEdit(commentID)});
    editButton.innerHTML = "Edit Comment";// join RSO
    deleteButton.innerHTML = "Remove Comment";// join RSO
    newRow.appendChild(editButton);
    newRow.appendChild(deleteButton);
    return newRow;
}

function makeTextRatingInfo(divClass, text, rating){// remove phone arg
    let ci = document.createElement("div");
    ci.setAttribute("class","row "+divClass);

    let categoryDiv = document.createElement("div");
    categoryDiv.setAttribute("class","col textRatingInfoText commentText");// descriptionText
    categoryDiv.innerHTML = text;

    // remove block
    let locationDiv= document.createElement("div");
    locationDiv.setAttribute("class","col textRatingInfoText ratingText");
    locationDiv.innerHTML = rating;

    ci.appendChild(categoryDiv);
    ci.appendChild(locationDiv);//remove

    return ci;
}

function makeTextRatingHeaders(divClass, text, rating){
    let ci = document.createElement("div");
    ci.setAttribute("class", "row " + divClass);

    let categoryDiv = document.createElement("div");
    categoryDiv.setAttribute("class", "col eventInfoText");
    categoryDiv.innerHTML = text;

    let locationDiv = document.createElement("div");
    locationDiv.setAttribute("class", "col eventInfoText");
    locationDiv.innerHTML = rating;

    ci.appendChild(categoryDiv);
    ci.appendChild(locationDiv);
    return ci;
}

function appendCommentChildren(comment, commentDiv, commentID){
    // here is where we make all the subdivs for the contact
    // Below is for the name title
    // let eventName = document.createElement("div");
    // eventName.setAttribute("class","eventNameText col");
    // eventName.setAttribute("Name",comment.Name);
    // // eventName.setAttribute("lastName",event.Category);
    // eventName.innerHTML = comment.name;

    // the extend button
    let extendButton = document.createElement("button");
    extendButton.setAttribute("class","contactExtendButton col-2");
    extendButton.setAttribute("commentID",comment.User_id);
    extendButton.innerHTML = "&#8681;";
    extendButton.addEventListener("click", function(){changeCommInfoState(commentID)});

    // the ones below only come up whem the extend button is pressed
    let textRating = document.createElement("div");//was additionalInfo
    textRating.setAttribute("class","textRatingInfo");
    textRating.appendChild(makeTextRatingHeaders("textRatingInfoHeaders","Comment","Rating"))
    let textRatingInfo = makeTextRatingInfo("textRatingInfoContent", comment.Text, comment.Rating)

    // now we append the children
    let commentButton = makeEditDeleteCommentButtons(commentID);
    // commentDiv.appendChild(eventName);
    commentDiv.appendChild(extendButton);

    applyHidden(textRating);
    applyHidden(textRatingInfo);
    applyHidden(commentButton);

    commentDiv.appendChild(textRating);
    commentDiv.appendChild(textRatingInfo);
    commentDiv.appendChild(commentButton);
}

function changeCommInfoState(commentID){
    let comment = document.getElementById(commentID);

    let textRating = comment.querySelector(".textRatingInfo");
    let textRatingInfo = comment.querySelector(".textRatingInfoContent");

    let editButtons = comment.querySelector(".editButtons");
    // if the div is hidden
    if(comment.getAttribute("infoHidden")==="true")
    {
        comment.setAttribute("infoHidden","false");
        textRating.setAttribute("class", "textRatingInfo")
        textRatingInfo.setAttribute("class", "row textRatingInfoContent")

        editButtons.setAttribute("class","row editButtons")
    }
    else{

        applyHidden(textRating);
        applyHidden(textRatingInfo);

        applyHidden(editButtons);
        comment.setAttribute("infoHidden","true");
    }
}

function makeCommentDiv(comment, commentID){
    let commentDiv = document.createElement("div");
    appendCommentChildren(comment,commentDiv,commentID);

    return commentDiv
}

// loads contacts in range
function loadComments(comments,lower,upper){
    // first we have to remove any contacts from previous loads
    console.log("loadContact's range is from "  +lower +"to"+ upper);
    let commentsDiv = document.querySelector("#comments");
    commentsDiv.innerHTML ="";
    // now we iterate through the contacts, making a div for each
    // we must make sure that the amount of contacts is within range
    if(upper <= comments.length){

        for(let i = lower; i<upper;i++)
        {
            let newComment = makeCommentDiv(comments[i],comments[i].User_id);
            newComment.setAttribute("id",comments[i].User_id);
            newComment.setAttribute("class","row contact");
            newComment.setAttribute("infoHidden","true");
            commentsDiv.appendChild(newComment);
        }
    }
    else if (upper > comments.length && lower<=comments.length){

        for(let i = lower; i<comments.length;i++)
        {
            let newComment = makeCommentDiv(comments[i],comments[i].User_id);
            newComment.setAttribute("id",comments[i].User_id);
            newComment.setAttribute("class","row contact");
            newComment.setAttribute("infoHidden","true");
            commentsDiv.appendChild(newComment);
        }
    }
}

function searchCommentCB(response, textStatus, xhr){
    if (textStatus !== "error") {
        if (response.error === "") {
            sessionStorage.setItem("event", response.results[0].Event_id)
            currentEvent = sessionStorage.getItem("event");
            updatePageState(response.results)
            loadComments(currentComments,0,CONTACTS_PER_PAGE);
            currentEVComment = CONTACTS_PER_PAGE;
        } else {
            // TODO: no contacts found error message
            updatePageState({});
            loadComments(currentComments,0,CONTACTS_PER_PAGE);
        }
    } else {
        // TODO: please try again error msg
        // updatePageState(JSONResults.results)
        // loadContacts(JSONResults.results, 0, CONTACTS_PER_PAGE)
        // console.log(JSONResults)
    }
}

function getContactInfo(contact){
    let email = contact.email;
    let phoneNum = contact.phoneNumber;
    let contactInfoDiv = document.createElement("div");
    contactInfoDiv.innerHTML = email + "  "+ phoneNum;
    return contactInfoDiv;
}

// this function changes state of info from hidden to showing or vis-versa

function getNextPage(){

    // only load next page if there is one
    if(currentEVComment < currentComments.length){
        // if loading the next amount of contacts will go over the length
        // just go up to length
        if(currentEVComment + (CONTACTS_PER_PAGE) > currentComments.length){
            loadComments(currentComments,currentEVComment,currentComments.length);
            currentEVComment = currentComments.length;
        }
        else{
            loadComments(currentComments,currentEVComment,currentEVComment+(CONTACTS_PER_PAGE*2));
            currentEVComment+=CONTACTS_PER_PAGE;
        }
    }
}
function getPrevPage(){
    loadComments(currentComments,0,10);
    currentEVComment = 10;

}
function addPageButtonListeners(){
    let prevButton = document.querySelector("#prevButton");
    let nextButton = document.querySelector("#nextButton");
    prevButton.addEventListener("click",function(){getPrevPage()});
    nextButton.addEventListener("click",function(){getNextPage()});
}

/*
function addSearchBarEL(){
  let searchBar = document.querySelector("searchBar");
  // on every change to the search bar there will be a search executed
  searchBar.addEventListener("input",function(){searchAndUpdate(userID)});

}
*/
function searchAndUpdate(){
    // first get search bar contents
    let searchBar = document.querySelector("#searchBar");
    postHandler({Event_id:sessionStorage.getItem("event")},searchCommentCB,API.viewComments);
}

// this will get the ID of the current user with a cookie as well as call the empty search
// which will fill the page
function loadInitialPageState(){
    userID = readCookie("id");
    searchAndUpdate();
}
function resetPageState(){
    searchAndUpdate();
}
function updatePageState(results){
    currentComments = results;
}

// addSearchBarEL()
// postHandler({userId:userID, search:""},searchCB,API.searchCon);
loadInitialPageState();
addPageButtonListeners();

$( document ).ready(function() {
    postHandler({Event_id:sessionStorage.getItem("event")}, searchCommentCB, API.viewComments)
});