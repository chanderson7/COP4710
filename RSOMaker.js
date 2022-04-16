let currentContact = 0;
const CONTACTS_PER_PAGE = 10;
let currentRSOs;
let userID;

function applyHidden(div) {
    div.setAttribute("class",div.getAttribute("class")+ " hidden");
}

function leaveRSO(RSOID){
    var xhr = new XMLHttpRequest();
    let data = { User_id:readCookie("id"), RSO_id:RSOID}
    xhr.open("POST", urlBase + site + API.leaveRSO, true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.responseType = "json";
    console.log(JSON.stringify(data));
    console.log(urlBase + site + API.leaveRSO);
    xhr.send(JSON.stringify(data));
    xhr.onload = function() {
        var status = xhr.status;
        if (status === 200) {
                window.alert(xhr.response.error)
        }
    }
    console.log('HEY');
}

function addRSOCB(response, status, xhr){
    if (status !== "error") {
        if (response.error === "Event Added!") {
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

function joinRSO(RSOID){
    var xhr = new XMLHttpRequest();
    let data = { User_id:readCookie("id"), RSO_id:RSOID}
    xhr.open("POST", urlBase + site + API.joinRSO, true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.responseType = "json";
    console.log(JSON.stringify(data));
    console.log(urlBase + site + API.joinRSO);
    xhr.send(JSON.stringify(data));
    xhr.onload = function() {
        var status = xhr.status;
        if (status === 200) {
                window.alert(xhr.response.error)
        }
    }
    console.log('');
}

// this takes the div class attribute as well as  the inner content
function makeLeaveJoinDiv(RSOID){
    let newRow = document.createElement("div");
    newRow.setAttribute("class","row memberButtons");
    newRow.setAttribute("RSOid",RSOID);// RSOID
    let joinButton = document.createElement("button");
    let leaveButton = document.createElement("button");
    joinButton.setAttribute("class","col text-right joinRSOButton");// removeRSOButton
    leaveButton.setAttribute("class","col leaveRSOButton");//
    leaveButton.addEventListener("click",function(){ leaveRSO(RSOID) });// RSOID
    joinButton.addEventListener("click",function(){joinRSO(RSOID)});
    joinButton.innerHTML = "Join RSO";// join RSO
    leaveButton.innerHTML = "Leave RSO";// Leave RSO
    newRow.appendChild(joinButton);
    newRow.appendChild(leaveButton);
    return newRow;
}

function makeNameDescInfo(divClass, text, rating){// remove phone arg
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

function makeNameDescHeaders(divClass, text, rating){
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

function appendContactChildren(RSO,RSODiv,RSOID){
    // the extend button
    let extendButton = document.createElement("button");
    extendButton.setAttribute("class","RSOExtendButton col-2");
    extendButton.setAttribute("RSOID",RSO.RSO_id);
    extendButton.innerHTML = "&#8681;";
    extendButton.addEventListener("click", function(){changeRSOInfoState(RSOID)});

    let nameDesc = document.createElement("div");//was additionalInfo
    nameDesc.setAttribute("class","nameDescInfo");
    nameDesc.appendChild(makeNameDescHeaders("nameDescInfoHeaders","Name","Description"))
    let nameDescInfo = makeNameDescInfo("nameDescInfoContent", RSO.Name, RSO.Description)

    // now we append the children
    let memberButtons = makeLeaveJoinDiv(RSOID);
    RSODiv.appendChild(extendButton);

    applyHidden(nameDesc)
    applyHidden(nameDescInfo);
    applyHidden(memberButtons);

    RSODiv.appendChild(nameDesc);
    RSODiv.appendChild(nameDescInfo);
    RSODiv.appendChild(memberButtons);
}

// this function changes state of info from hidden to showing or vis-versa
function changeRSOInfoState(RSOID){
    let RSO = document.getElementById(RSOID);
    let nameDescHeaders = RSO.querySelector(".nameDescInfo");
    let nameDescInfo = RSO.querySelector(".nameDescInfoContent");
    let editButtons = RSO.querySelector(".memberButtons");
    // if the div is hidden
    if(RSO.getAttribute("infoHidden")==="true")
    {
        RSO.setAttribute("infoHidden","false");
        nameDescHeaders.setAttribute("class","nameDescInfo");
        nameDescInfo.setAttribute("class","row nameDescInfoContent");
        editButtons.setAttribute("class","row memberButtons")
    }
    else{
        applyHidden(nameDescHeaders);
        applyHidden(nameDescInfo);
        applyHidden(editButtons);
        RSO.setAttribute("infoHidden","true");
    }
}

function makeContactDiv(RSO, RSOID){
    let RSODiv = document.createElement("div");
    appendContactChildren(RSO,RSODiv,RSOID);
    return RSODiv
}

// loads contacts in range
function loadRSOs(RSOs, lower, upper){
    // first we have to remove any RSOs from previous loads
    console.log("loadRSO's range is from "  +lower +"to"+ upper);
    let contactsDiv = document.querySelector("#RSOs");
    contactsDiv.innerHTML ="";
    // now we iterate through the RSOs, making a div for each
    // we must make sure that the amount of RSOs is within range
    if(upper <= RSOs.length){

        for(let i = lower; i<upper;i++)
        {
            let newContact = makeContactDiv(RSOs[i],RSOs[i].RSO_id);
            newContact.setAttribute("id",RSOs[i].RSO_id);
            newContact.setAttribute("class","row RSO");
            newContact.setAttribute("infoHidden","true");
            contactsDiv.appendChild(newContact);
        }
    }
    else if (upper > RSOs.length && lower<=RSOs.length){

        for(let i = lower; i<RSOs.length;i++)
        {
            let newContact = makeContactDiv(RSOs[i],RSOs[i].RSO_id);
            newContact.setAttribute("id", RSOs[i].RSO_id);
            newContact.setAttribute("class","row RSO");
            newContact.setAttribute("infoHidden","true");
            contactsDiv.appendChild(newContact);
        }
    }
}

function searchRSOCB(response, textStatus, xhr){
    if (textStatus !== "error") {
        if (response.error === "") {
            updatePageState(response.results)
            loadRSOs(currentRSOs,0,CONTACTS_PER_PAGE);
            currentContact = CONTACTS_PER_PAGE;
        } else {
            // TODO: no contacts found error message
            updatePageState({});
            loadRSOs(currentRSOs,0,CONTACTS_PER_PAGE);
        }
    } else {
        // TODO: please try again error msg
        // updatePageState(JSONResults.results)
        // loadContacts(JSONResults.results, 0, CONTACTS_PER_PAGE)
        // console.log(JSONResults)
    }
}

function getNextPage(){

    // only load next page if there is one
    if(currentContact < currentRSOs.length){
        // if loading the next amount of contacts will go over the length
        // just go up to length
        if(currentContact + (CONTACTS_PER_PAGE) > currentRSOs.length){
            loadRSOs(currentRSOs,currentContact, currentRSOs.length);
            currentContact = currentRSOs.length;
        }
        else{
            loadRSOs(currentRSOs,currentContact,currentContact+(CONTACTS_PER_PAGE*2));
            currentContact+=CONTACTS_PER_PAGE;
        }
    }
}
function getPrevPage(){
    loadRSOs(currentRSOs,0,10);
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
    postHandler({},searchRSOCB,API.viewAllRSOs);
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
    currentRSOs = results;
}

// addSearchBarEL()
// postHandler({userId:userID, search:""},searchCB,API.searchCon);
loadInitialPageState();
addPageButtonListeners();
