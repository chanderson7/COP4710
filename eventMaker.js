let currentContact = 0;
const CONTACTS_PER_PAGE = 10;
let currentEvents;
// let userID;
let currentEvent


function applyHidden(div) {
    div.setAttribute("class",div.getAttribute("class")+ " hidden");
}
function viewComments(eventID){
    sessionStorage.setItem("event", eventID)
    currentEvent = sessionStorage.getItem("event");
    window.location.href = "comments.html"
}

function addCommentCB(response, status, xhr){
    if (status !== "error") {
        if (response.error === "Successfully added comment!") {
            $("#addCommentAlert").removeClass("collapse alert-danger").addClass("alert-success").text(response.error)
            // re-search to show new contact
            // let searchData = {
            //     "userId" : readCookie("id"), //55
            //     "search" : $("#searchBar").val()
            // }
            // postHandler(searchData, searchCB, API.searchCon)
        } else {
            $("#addCommentAlert").removeClass("collapse alert-success").addClass("alert-danger").text(response.error)
            // $("#loginPass").removeClass("is-valid")
            // $("#loginUser").removeClass("is-valid")
        }
    } else {
        $("#addCommentAlert").removeClass("collapse alert-success").addClass("alert-danger").text(status)
    }
}

$("#allEvtButton").click(function (event){
    postHandler({}, searchCB, API.viewAllEvents)
})
$("#publicEvBtn").click(function (event){
    postHandler({}, searchCB, API.viewPublicEvents)
})
$("#privateEvBtn").click(function (event){
    postHandler({}, searchCB, API.viewPrivateEvents)
})
$("#RSOEvBtn").click(function (event){
    postHandler({}, searchCB, API.viewRSOEvents)
})

// this takes the div class attribute as well as  the inner content
function makeCommentButtons(eventID){ // this will have to be user_id, one per user.
    let newRow = document.createElement("div");
    newRow.setAttribute("class","row commentButtons");
    newRow.setAttribute("eventID",eventID);// RSOID

    let viewCommentsButton = document.createElement("button");
    viewCommentsButton.setAttribute("class","col text-right viewCommentsButton");// editEvent
    viewCommentsButton.addEventListener("click",function(){ viewComments(eventID)});
    viewCommentsButton.innerHTML = "View Comments";// Edit Event Feedback

    let addCommentButton = document.createElement("button");
    addCommentButton.setAttribute("class","col addCommentButton");//
    addCommentButton.setAttribute("data-bs-target", "#addCommentModal")
    addCommentButton.setAttribute("data-bs-toggle", "modal")
    addCommentButton.addEventListener("click",function(){ currentEvent = eventID });
    addCommentButton.innerHTML = "Add Comment";// join RSO

    newRow.appendChild(viewCommentsButton);
    newRow.appendChild(addCommentButton);

    return newRow;
}

function makeCatDescInfo(divClass,category,description){// remove phone arg
    let ci = document.createElement("div");
    ci.setAttribute("class","row "+divClass);

    let categoryDiv = document.createElement("div");
    categoryDiv.setAttribute("class","col catLocInfoText categoryText");// descriptionText
    categoryDiv.innerHTML = category;

    // remove block
    let descriptionDiv= document.createElement("div");
    descriptionDiv.setAttribute("class","col catLocInfoText descriptionText");
    descriptionDiv.innerHTML = description;

    ci.appendChild(categoryDiv);
    ci.appendChild(descriptionDiv);//remove

    return ci;
}
function makeDateTimeInfo(divClass,time,date){// remove phone arg
    let ci = document.createElement("div");
    ci.setAttribute("class","row "+divClass);

    let timeDiv = document.createElement("div");
    timeDiv.setAttribute("class","col contactInfoText descriptionText");// descriptionText
    timeDiv.innerHTML = time;

    // remove block
    let dateDiv= document.createElement("div");
    dateDiv.setAttribute("class","col contactInfoText ratingText");
    dateDiv.innerHTML = date;

    ci.appendChild(timeDiv);
    ci.appendChild(dateDiv);//remove

    return ci;
}
function makeContactInfo(divClass,email,phone) {
    let ci = document.createElement("div");
    ci.setAttribute("class", "row " + divClass);

    let emailDiv = document.createElement("div");
    emailDiv.setAttribute("class", "col contactInfoText");
    emailDiv.innerHTML = email;

    //remove this block
    let phoneDiv = document.createElement("div");
    phoneDiv.setAttribute("class", "col contactInfoText");
    phoneDiv.innerHTML = phone;

    ci.appendChild(emailDiv);
    ci.appendChild(phoneDiv);
    return ci;
}
function makeDescriptionInfo(divClass,email,phone) {
    let ci = document.createElement("div");
    ci.setAttribute("class", "row " + divClass);

    let phoneDiv = document.createElement("div");
    phoneDiv.setAttribute("class", "col contactInfoText");
    phoneDiv.innerHTML = phone;

    ci.appendChild(phoneDiv);
    return ci;
}

function makeCatDescHeaders(divClass, category, description){
    let ci = document.createElement("div");
    ci.setAttribute("class", "row " + divClass);

    let categoryDiv = document.createElement("div");
    categoryDiv.setAttribute("class", "col eventInfoText");
    categoryDiv.innerHTML = category;

    let descriptionDiv = document.createElement("div");
    descriptionDiv.setAttribute("class", "col eventInfoText");
    descriptionDiv.innerHTML = description;

    ci.appendChild(categoryDiv);
    ci.appendChild(descriptionDiv);
    return ci;
}
function makeTimeDateHeaders(divClass, time, date) {// get rid of phone arg
    let ci = document.createElement("div");
    ci.setAttribute("class", "row " + divClass);

    let timeDiv = document.createElement("div");
    timeDiv.setAttribute("class", "col eventInfoText");
    timeDiv.innerHTML = time;

    let dateDiv = document.createElement("div");
    dateDiv.setAttribute("class", "col eventInfoText");
    dateDiv.innerHTML = date;
    return ci;
}
function makeContactInfoHeaders(divClass, phone, email){
    let ci = document.createElement("div");
    let phoneDiv= document.createElement("div");
    phoneDiv.setAttribute("class","col eventInfoText");
    phoneDiv.innerHTML = phone;

    let emailDiv = document.createElement("div");
    emailDiv.setAttribute("class","eventInfoText");
    emailDiv.innerHTML = email;

    ci.appendChild(phoneDiv);
    ci.appendChild(emailDiv);

    return ci;
}
function makeDescriptionHeader(divClass, description){
    let ci = document.createElement("div");
    let descriptionDiv= document.createElement("div");
    descriptionDiv.setAttribute("class","col eventInfoText");
    descriptionDiv.innerHTML = description;

    ci.appendChild(descriptionDiv);

    return ci;
}

function appendEventChildren(event, eventDiv, eventID){
    // here is where we make all the subdivs for the contact
    // Below is for the name title
    let eventName = document.createElement("div");
    eventName.setAttribute("class","eventNameText col");
    eventName.setAttribute("Name",event.Name);
    // eventName.setAttribute("lastName",event.Category);
    eventName.innerHTML = event.Name;

    // the extend button
    let extendButton = document.createElement("button");
    extendButton.setAttribute("class","contactExtendButton col-2");
    extendButton.setAttribute("eventID",event.Event_id);
    extendButton.innerHTML = "&#8681;";
    extendButton.addEventListener("click", function(){changeEventInfoState(eventID)});

    // the ones below only come up whem the extend button is pressed
    let catDesc = document.createElement("div");//was additionalInfo
    catDesc.setAttribute("class","catLocInfo");
    catDesc.appendChild(makeCatDescHeaders("catLocInfoHeaders","Category","Description"))
    let catLocInfo = makeCatDescInfo("catLocInfoContent", event.Category, event.Description)

    let timeDate = document.createElement("div");
    timeDate.setAttribute("class","timeDateInfo");
    timeDate.appendChild(makeTimeDateHeaders("timeDateHeaders", "Time", "Date"))//, "Description")
    let timeDateInfo =  makeDateTimeInfo("timeDateInfoContent",event.Time,event.Date)

    let contacts = document.createElement("div");
    contacts.setAttribute("class","contactInfo");
    contacts.appendChild(makeContactInfoHeaders("contactInfoHeaders", "Email", "Phone"))
    let contactInfo =  makeContactInfo("contactInfoContent",event.Contact_email,event.Contact_phone)

    // let description = document.createElement("div");
    // description.setAttribute("class","descriptionInfo");
    // description.appendChild(makeDescriptionHeader("descriptionHeader", "Description"))
    // let descriptionInfo =  makeDescriptionInfo("descriptionInfoContent",event.Description)

    // now we append the children
    let commentButtons = makeCommentButtons(eventID);
    eventDiv.appendChild(eventName);
    eventDiv.appendChild(extendButton);

    applyHidden(catDesc);
    applyHidden(catLocInfo);
    applyHidden(timeDate);
    applyHidden(timeDateInfo);
    applyHidden(contacts)
    applyHidden(contactInfo)
    // applyHidden(description);
    // applyHidden(descriptionInfo);
    applyHidden(commentButtons);

    eventDiv.appendChild(catDesc);
    eventDiv.appendChild(catLocInfo);

    eventDiv.appendChild(timeDate)
    eventDiv.appendChild(timeDateInfo)

    eventDiv.appendChild(contacts)
    eventDiv.appendChild(contactInfo)

    // eventDiv.appendChild(description)
    // eventDiv.appendChild(descriptionInfo)

    eventDiv.appendChild(commentButtons);
}

function changeEventInfoState(eventID){
    let event = document.getElementById(eventID);

    let catLoc = event.querySelector(".catLocInfo");
    let catLocInfo = event.querySelector(".catLocInfoContent");
    let timeDate = event.querySelector(".timeDateInfo")
    let timeDateInfo = event.querySelector(".timeDateInfoContent")
    let contacts = event.querySelector(".contactInfo")
    let contactInfo = event.querySelector(".contactInfoContent")
    // let description = event.querySelector(".descriptionInfo")
    // let descriptionInfo = event.querySelector(".descriptionInfoContent")
    let commentButtons = event.querySelector(".commentButtons");
    // if the div is hidden
    if(event.getAttribute("infoHidden")==="true")
    {
        event.setAttribute("infoHidden","false");
        catLoc.setAttribute("class", "catLocInfo")
        catLocInfo.setAttribute("class", "row catLocInfoContent")
        timeDate.setAttribute("class", "timeDateInfo")
        timeDateInfo.setAttribute("class", "row timeDateInfoContent")
        contacts.setAttribute("class","contactInfo");
        contactInfo.setAttribute("class","row contactInfoContent");
        // description.setAttribute("class", "descriptionInfo")
        // descriptionInfo.setAttribute("class", "row descriptionInfoContent")// unclear if this needs row
        commentButtons.setAttribute("class","row commentButtons")
    }
    else{

        applyHidden(catLoc);
        applyHidden(catLocInfo);
        applyHidden(timeDate);
        applyHidden(timeDateInfo);
        applyHidden(contacts)
        applyHidden(contactInfo)
        // applyHidden(description);
        // applyHidden(descriptionInfo);
        applyHidden(commentButtons);
        event.setAttribute("infoHidden","true");
    }
}

function makeEventDiv(event, eventID){
    let eventDiv = document.createElement("div");
    appendEventChildren(event,eventDiv,eventID);

    return eventDiv
}

// loads contacts in range
function loadEvents(events, lower, upper){
    // first we have to remove any contacts from previous loads
    console.log("loadContact's range is from "  +lower +"to"+ upper);
    let contactsDiv = document.querySelector("#contacts");
    contactsDiv.innerHTML ="";
    // now we iterate through the contacts, making a div for each
    // we must make sure that the amount of contacts is within range
    if(upper <= events.length){

        for(let i = lower; i<upper;i++)
        {
            let newContact = makeEventDiv(events[i],events[i].Event_id);
            newContact.setAttribute("id",events[i].Event_id);
            newContact.setAttribute("class","row contact");
            newContact.setAttribute("infoHidden","true");
            contactsDiv.appendChild(newContact);
        }
    }
    else if (upper > events.length && lower<=events.length){

        for(let i = lower; i<events.length;i++)
        {
            let newContact = makeEventDiv(events[i],events[i].Event_id);
            newContact.setAttribute("id",events[i].Event_id);
            newContact.setAttribute("class","row contact");
            newContact.setAttribute("infoHidden","true");
            contactsDiv.appendChild(newContact);
        }
    }
}

function searchCB(response, textStatus, xhr){
    console.log(response)
    if (textStatus !== "error") {
        if (response.error === "") {
            updatePageState(response.results)
            loadEvents(currentEvents,0,CONTACTS_PER_PAGE);
            currentContact = CONTACTS_PER_PAGE;
        } else {
            // TODO: no contacts found error message
            updatePageState({});
            loadEvents(currentEvents,0,CONTACTS_PER_PAGE);
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
    if(currentContact < currentEvents.length){
        // if loading the next amount of contacts will go over the length
        // just go up to length
        if(currentContact + (CONTACTS_PER_PAGE) > currentEvents.length){
            loadEvents(currentEvents,currentContact,currentEvents.length);
            currentContact = currentEvents.length;
        }
        else{
            loadEvents(currentEvents,currentContact,currentContact+(CONTACTS_PER_PAGE*2));
            currentContact+=CONTACTS_PER_PAGE;
        }
    }
}
function getPrevPage(){
    loadEvents(currentEvents,0,10);
    currentContact = 10;

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
    // let searchBar = document.querySelector("#searchBar");
    // postHandler({userId:userID, search:searchBar.value},searchCB,API.searchCon);
    postHandler({},searchCB,API.viewAllEvents);
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
    currentEvents = results;
}

// $( document ).ready(function() {
//     postHandler({}, searchCB, API.viewAllEvents)
// });

// addSearchBarEL()
// postHandler({userId:userID, search:""},searchCB,API.searchCon);
loadInitialPageState();
addPageButtonListeners();
