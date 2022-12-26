/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var jpdpBaseURL = "http://api.login2explore.com:5577";
var jpdbIRL = "/api/irl";
var jpdbIML = "/api/iml";
var stuDBName = "SCHOOL-DB";
var stuRelName = "STUDENT-TABLE";
var conToken = "90938276|-31949273783409325|90952649";

$("#stuid").focus();

function saveRecNoToLS(jsonObj){
    var lvData = JSON.parse(jsonObj.data);
    localStorage.setItem("recno",lvData.rec_no);
}

function getStuidASJsonObj(){
    var stuid = $("#stuid").val();
    var jsonStr = {
        id:stuid
    };
    return JSON.stringify(jsonStr);
}

function fillData(jsonObj){
    saveRecNoToLS(jsonObj);
    var record = JSON.parse(jsonObj.data).record;
    $("#stuname").val(record.name);
    $("#stuclass").val(record.class);
    $("#bdate").val(record.bdate);
    $("#adr").val(record.address);
    $("#enrldate").val(record.enrldate);
}

function resetForm(){
    $("#stuid").val("");
    $("#stuname").val("");
    $("#stuclass").val("");
    $("#bdate").val("");
    $("#adr").val("");
    $("#enrldate").val("");
    
    $("#stuid").prop("disabled",false);
    $("#save").prop("disabled",true);
    $("#change").prop("disabled",true);
    $("#reset").prop("disabled",true);
    $("#stuid").focus();
}

function validateData(){
    var stuid,stuname,stuclass,bdate,adr,enrldate;
    stuid = $("#stuid").val();
    stuname = $("#stuname").val();
    stuclass = $("#stuclass").val();
    bdate = $("#bdate").val();
    adr = $("#adr").val();
    enrldate = $("#enrldate").val();
    
    if(stuid === ""){
        alert("Student ID is missing");
        $("#stuid").focus();
        return "";
    }
    if(stuname === ""){
        alert("Student Name is missing");
        $("#stuname").focus();
        return "";
    }
    if(stuclass === ""){
        alert("Student Class is missing");
        $("#stuclass").focus();
        return "";
    }
    if(bdate === ""){
        alert("Student Birth-Date is missing");
        $("#bdate").focus();
        return "";
    }
    if(adr === ""){
        alert("Student Address is missing");
        $("#adr").focus();
        return "";
    }
    if(enrldate === ""){
        alert("Student Enrollment-Date is missing");
        $("#enrldate").focus();
        return "";
    }
    
    var jsonStrObj = {
        id:stuid,
        name:stuname,
        class:stuclass,
        bdate:bdate,
        address:adr,
        enrldate:enrldate
    };
    return JSON.stringify(jsonStrObj);
}

function getStu(){
    var stuIdJsonObj = getStuidASJsonObj();
    var getRequest = createGET_BY_KEYRequest(conToken, stuDBName, stuRelName, stuIdJsonObj);
    jQuery.ajaxSetup({async:false});
    var resJsonObj = executeCommandAtGivenBaseUrl(getRequest, jpdpBaseURL, jpdbIRL);
    jQuery.ajaxSetup({async:true});
    if(resJsonObj.status === 400){
        $("#save").prop("disabled",false);
        $("#reset").prop("disabled",false);
        $("#stuname").focus();
    }
    else if(resJsonObj.status === 200){
        $("#stuid").prop("disabled",true);
        fillData(resJsonObj);
        
        $("#change").prop("disabled",false);
        $("#reset").prop("disabled",false);
        $("#stuname").focus();
    }
}

function saveData(){
    var jsonStrObj = validateData();
    if(jsonStrObj === ""){
        return "";
    } 
    var putRequest = createPUTRequest(conToken, jsonStrObj, stuDBName, stuRelName);
    jQuery.ajaxSetup({async:false});
    var resJsonObj = executeCommandAtGivenBaseUrl(putRequest, jpdpBaseURL, jpdbIML);
    jQuery.ajaxSetup({async:true});
    resetForm();
    $("#stuid").focus();
}

function changeData(){
    $("#change").prop("disabled",true);
    jsonChg = validateData();
    var updateRequest = createUPDATERecordRequest(conToken, jsonChg, stuDBName, stuRelName, localStorage.getItem("recno"));
    jQuery.ajaxSetup({async:false});
    var resJsonObj = executeCommandAtGivenBaseUrl(updateRequest,jpdpBaseURL, jpdbIML);
    jQuery.ajaxSetup({async:true});
    console.log(resJsonObj);
    resetForm();
    $("#stuid").focus();
}
