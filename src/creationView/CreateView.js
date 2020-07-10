import * as actionSDK from "action-sdk-sunny";

// var question_counter = 1
var questionCount = 0;
let questions = new Array();
let validate = true;

var question_section = $("#question-section div.container").clone();
var opt = $("div#option-section .option-div").clone();

$(document).ready(function () {
    var today = new Date().toISOString().split('T')[0];
    $('#attendance-date').val(today).attr({ 'min': today });
});

$(document).on("click", "#submit", function () {
    /* Validate */
    var error_text = '';
    $("form").find("input[type='text']").each(function () {
        var element = $(this);
        if (element.val() == "") {
            validate = false;
            if (element.attr('id') == 'quiz-title') {
                error_text += ('Quiz title is required. \n');
            } else if (element.attr('id') == 'question-title') {
                error_text += ('Question is required. \n');
            } else if (element.attr('id').startsWith('option')) {
                error_text += ("Blank option not allowed. \n");
            }
        }
    });

    console.log('validate: ' + validate);

    if (validate == true) {
        submitForm();
    } else {
        alert(error_text);
    }

});

function submitForm() {
    actionSDK
        .executeApi(new actionSDK.GetContext.Request())
        .then(function (response) {
            console.info("GetContext - Response: " + JSON.stringify(response));
            createAction(response.context.actionPackageId);
        })
        /* .catch(function (error) {
            console.error("GetContext - Error: " + JSON.stringify(error));
        }) */;
}

function createAction(actionPackageId) {
    var title = 'Request to mark attendance';
    var attendance_date = $("#attendance-date").val();
    var attendance_time = $("#attendance-time").val();
    var attendance_photo = $("#attendance-photo").is(':checked') ? 'Yes' : 'No';
    var expiry_time = new Date($('#attendance-date').val() + ' ' + $('#attendance-time').val()).getTime() + 7 * 24 * 60 * 60 * 1000;
    var properties = [];
    properties.push(
        {
            name: "Attendance Expiry Date",
            type: "Date",
            value: attendance_date,
        },
        {
            name: "Attendance Expiry Time",
            type: "Time",
            value: attendance_time,
        },
        {
            name: "Attendance Photo",
            type: "LargeText",
            value: attendance_photo,
        },
        {
            name: "Address",
            type: "LargeText",
            value: "",
        },
        {
            name: "Notes",
            type: "LargeText",
            value: "",
        });

    var opt = [
        {
            name: 'Attendance Expiry Date',
            displayName: attendance_date
        },
        {
            name: 'Attendance Expiry Time',
            displayName: attendance_time
        },
        {
            name: 'Attendance Photo',
            displayName: attendance_photo
        },
        {
            name: 'Notes',
            displayName: ""
        },
        {
            name: 'Address',
            displayName: ""
        }
    ];

    var i = 1;
    var dataColumns = [
        {
            name: i.toString(),
            displayName: 'Request to mark attendance',
            valueType: actionSDK.ActionDataColumnValueType.LargeText,
            allowNullValue: false,
            options: opt
        }
    ];
    // properties.push(getcorrectanswers);
    console.log('properties: ' + JSON.stringify(properties));
    var action = {
        id: generateGUID(),
        actionPackageId: actionPackageId,
        version: 1,
        displayName: title,
        expiryTime: expiry_time,
        customProperties: properties,
        dataTables: [{
            name: "TestDataSet",
            itemsVisibility: actionSDK.Visibility.All,
            itemsEditable: false,
            canUserAddMultipleItems: true,
            dataColumns: dataColumns,
        }],
    };
    console.log("action: ");
    console.log(JSON.stringify(action));
    var request = new actionSDK.CreateAction.Request(action);
    actionSDK
        .executeApi(request)
        .then(function (response) {
            console.info("CreateAction - Response: " + JSON.stringify(response));
        })
        .catch(function (error) {
            console.error("CreateAction - Error: " + JSON.stringify(error));
        });
}


function generateGUID() {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
        var r = (Math.random() * 16) | 0,
            v = c == "x" ? r : (r & 0x3) | 0x8;
        return v.toString(16);
    });
}
