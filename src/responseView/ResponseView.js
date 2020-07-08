import * as actionSDK from "action-sdk-sunny";

// ActionSDK.APIs.actionViewDidLoad(true /*success*/ );

// Fetching HTML Elements in Variables by ID.
var root = document.getElementById("root");
var $root = $("#root");
let row = {};
let actionInstance = null;

// *********************************************** HTML ELEMENT***********************************************
$(document).ready(function () {
    OnPageLoad();
});

function OnPageLoad() {
    actionSDK
        .executeApi(new actionSDK.GetContext.Request())
        .then(function (response) {
            console.info("GetContext - Response: " + JSON.stringify(response));
            getActionInstance(response.context.actionId);
        })
        .catch(function (error) {
            console.error("GetContext - Error: " + JSON.stringify(error));
        });
}

function getActionInstance(actionId) {
    actionSDK
        .executeApi(new actionSDK.GetAction.Request(actionId))
        .then(function (response) {
            console.info("Response: " + JSON.stringify(response));
            actionInstance = response.action;
        })
        .catch(function (error) {
            console.log("Error: " + JSON.stringify(error));
        });
}


$(document).on('click', '#share-locations', function () {
    $('#location-section').hide();
    if (actionInstance.properties[2].value == 'Yes') {
        $('#photo-section').show();
    } else {
        $('#notes-section').show();
        $('#photo-previous').hide();    // hide previous button
    }
});

$(document).on('click', '#photo-next', function () {
    $('#photo-section').hide();
    $('#notes-section').show();
});

$(document).on('click', '#photo-previous', function () {
    $('#notes-section').hide();
    if (actionInstance.properties[2].value == 'Yes') {
        $('#photo-section').show();
    }
})


$(document).on('click', '#submit', function () {
    submitForm();
})

// *********************************************** HTML ELEMENT END***********************************************

// *********************************************** SUBMIT ACTION***********************************************

function submitForm() {
    actionSDK
        .executeApi(new actionSDK.GetContext.Request())
        .then(function (response) {
            console.info("GetContext - Response: " + JSON.stringify(response));
            addDataRows(response.context.actionId);
        })
        .catch(function (error) {
            console.error("GetContext - Error: " + JSON.stringify(error));
        });
}

function generateGUID() {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
        var r = (Math.random() * 16) | 0,
            v = c == "x" ? r : (r & 0x3) | 0x8;
        return v.toString(16);
    });
}

function addDataRows(actionId) {
    var addDataRowRequest = new actionSDK.AddActionDataRow.Request(
        getDataRow(actionId)
    );
    var closeViewRequest = new actionSDK.CloseView.Request();
    var batchRequest = new actionSDK.BaseApi.BatchRequest([
        addDataRowRequest,
        closeViewRequest,
    ]);
    actionSDK
        .executeBatchApi(batchRequest)
        .then(function (batchResponse) {
            console.info("BatchResponse: " + JSON.stringify(batchResponse));
        })
        .catch(function (error) {
            console.error("Error: " + JSON.stringify(error));
        });
}

function getDataRow(actionId) {
    row = {};
    var dt = [
        { 'lat': $('#latitude').val() },
        { 'long': $('#longitutde').val() },
        { 'photo': $('#photo').val() },
        { 'notes': $('#notes').val() }
    ];

    row[0] = JSON.stringify(dt);

    var data = {
        id: generateGUID(),
        actionId: actionId,
        dataTableId: "TestDataSet",
        columnValues: row,
    };
    console.log("data-:  " + JSON.stringify(data));
    console.log(data);
    return data;
}


// *********************************************** SUBMIT ACTION END***********************************************