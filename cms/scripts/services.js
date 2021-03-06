/* global angular */

'use strict';

/* Services */

var cmsServices = angular.module('cmsServices', ['ngResource']);

cmsServices.service('cmsService',['$http',function($http){
    var cms = this;

    cms._appPrograms = [];
    cms._tabProgram = null;
    cms._tabContentProgram = null;
    cms._smsProgram = null;

    cms.getPrograms = function(){
        var url = "/api/programs.json?filter=programType:eq:WITHOUT_REGISTRATION&filter=name:ilike:cms&&paging=false&fields=id,name,version,categoryCombo[id,isDefault,categories[id]],programStages[id,version,programStageSections[id],programStageDataElements[dataElement[id,optionSet[id,version]]]]";
        return $http.get(url).then(handleSuccess, handleError('Error loading data elements groups'));
    }
    cms.getCharts = function(){
        var url = "/api/charts.json?paging=false";
        return $http.get(url).then(handleSuccess, handleError('Error loading favourite charts'));
    }
    cms.getPageTemplates = function(orientation,page){
        var templates = "";
        if(page=="home"){

            if(orientation=="left"){
                templates = "views/menus/leftmenu.html";
            }

            if(orientation=="center"){
                templates = "views/partials/home.html";
            }

            if(orientation=="right"){
                templates = "views/menus/rightmenu.html";
            }

        }else{

            if(orientation=="left"){
                templates = "views/menus/leftmenu_cms.html";
            }
            if(orientation=="center"){
                templates = "views/partials/home_cms.html";
            }
            if(orientation=="right"){
                templates = "views/menus/rightmenu_cms.html";
            }

        }


        return templates;
    }

    cms.getTabs = function(eventObject){
        return cms.loadEvent(eventObject);
    }

    cms.getDefaultPage = function(){
        if(!localStorage.getItem('defaultPage')){cms.setDefaultPage('home')}
        return localStorage.getItem('defaultPage');
    }

    cms.setDefaultPage = function(pageName){
        localStorage.setItem('defaultPage',pageName);
    }

    cms.addTab = function(eventPayload){
        return cms.saveEvent(eventPayload,'Error saving home page menus');
    }

    cms.getTabContent = function(eventObject){
        return cms.loadEvent(eventObject);
    }

    cms.addTabContent = function(eventPayload){
        return cms.saveEvent(eventPayload,'Error saving tab contents');
    }


    cms.getMessages = function(){
        return cms.loadMessages();
    }

    cms.addMessage = function(eventPayload){
        return cms.saveEvent(eventPayload,'Error sending message');
    }

    cms.getExternalLinks = function(eventObject){
        return cms.loadEvent(eventObject);
    }

    cms.addExternalLinks = function(eventPayload){
        var url = "/api/events";
        return $http({
            method: 'POST',
            url: url,
            data:eventPayload,
            dataType: "json",
            cache: true,
            ifModified: true
        }).then(handleSuccess, handleError('Error saving home page menus'));
    }

    cms.loadEvent = function(eventObject){
        var url = "/api/events.json?orgUnit=m0frOspS7JY&program="+eventObject.id+"&paging=false";
        return $http.get(url).then(handleSuccess, handleError('Error loading external links'));
    }

    cms.loadMessages = function(){
        var url = "/api/messageConversations.json?fields=:all&page=1";
        return $http.get(url).then(handleSuccess, handleError('Error loading external links'));
    }

    cms.deleteMessage = function(id){
        var url = "/api/messageConversations/"+id;
        return $http.delete(url).then(handleSuccess, handleError('Error loading message'));
    }
    //
    cms.retrieveSetting = function(){

        var url = "/api/systemSettings";
        return $http.get(url).then(handleSuccess, handleError("Error loading Messages"));
    }

    cms.saveSetting = function(firstMessage,secondMessage,hideMessageOne,hideMessageTwo){

        var url = "/api/systemSettings";
        var expireDate = new Date();
        return $http({method:'POST',data:{SMS_CONFIG:[{first_message:firstMessage,hide:hideMessageOne,expireDate:expireDate},{second_message:secondMessage,hide:hideMessageTwo,expireDate:expireDate}]},url:url}).then(handleSuccess, handleError(""));
    }

    cms.deleteSetting = function(data){

        var url = "/api/systemSettings";
        return $http({method:'POST',data:{SMS_CONFIG:[data]},url:url}).then(handleSuccess, handleError(""));
    }

    cms.saveEvent = function(eventPayload,errorMessage){
        var url = "/api/events";
        return $http({
            method: 'POST',
            url: url,
            data:eventPayload,
            dataType: "json",
            cache: true,
            ifModified: true
        }).then(handleSuccess, handleError(errorMessage));
    }

    cms.updateEvent = function(eventPayload,data,eventId,errorMessage){
        var url = "/api/events/"+eventId;

        var payload = {
            "program":eventPayload.program,
            "orgUnit": "m0frOspS7JY",
            "eventDate": "2013-05-17",
            "dataValues":
                data

        }
        return $http({
            method: 'PUT',
            url: url,
            data:payload,
            dataType: "json",
            cache: true,
            ifModified: true
        }).then(handleSuccess, handleError(errorMessage));
    }

    cms.deleteEvent = function(eventId,errorMessage){
        var url = "/api/events/"+eventId;
        return $http.delete(url).then(handleSuccess, handleError(errorMessage));
    }
    //
    //cms.deleteEvent = function(){
    //    var url = "/api/events/RpniengtNGl";
    //    return $http.delete(url).then(handleSuccess, handleError(""));
    //}
    //cms.deleteEvent();

     cms.getUsers = function(){
        var url = "/api/users.json?paging=false";
        return $http.get(url).then(handleSuccess, handleError('Error loading users'));
    }

    cms.loggedUser = function(){
        var url = "/api/me.json";
        return $http.get(url).then(handleSuccess, handleError('Error loading logeged in user'));
    }

    cms.processUsers = function(users){
        var finalUsers = []
       angular.forEach(users,function(user,index){
           user.icon = "<i class='fa fa-user'></i>";
           finalUsers.push(user);
       })

        return finalUsers;
    }


    return cms;
}]);

cmsServices.service('utilityService',function(){
    var utilityService = this;
    utilityService.prepareEventObject = function(assignedProgram){
        var eventObject = {id:assignedProgram.id};

        return eventObject;
    }

    utilityService.refineTabs = function(events){
        var tabs = [];
        var activeClass = "";
        var contentClass = "";
        angular.forEach(events,function(eventValues,eventIndexs){
            angular.forEach(eventValues.dataValues,function(eventValue,eventIndex){
                if(eventValue.value=="Agriculture"){
                    activeClass = "current";
                    contentClass = "show";
                }else{
                    activeClass = "";
                    contentClass = "hide";
                }
                tabs.push({event:eventValues.event,program:eventValues.program,programStage:eventValues.programStage,dataelement:eventValue.dataElement,value:eventValue.value,active:activeClass,content:contentClass})

            })

        });

        return tabs;
    }
    utilityService.refineTabContent = function(events){
        var content = [];
        var activeClass = "";
        var contentClass = "";
        angular.forEach(events,function(eventValues,eventIndexs){
            var template = {id:eventValues.event,menu:utilityService.getValue('tz5ttCEyPhf',eventValues.dataValues),order:utilityService.getValue('JTvaqwY7kDy',eventValues.dataValues),content:utilityService.getValue('qYjGeQATsEh',eventValues.dataValues)}
            content.push(template);
            })

        return content;

    }
    utilityService.refineMessage = function(message){
        var content = [];
        var activeClass = "";
        var contentClass = "";

        angular.forEach(message.messageConversations,function(messageValues,messageIndexs){
        //    var template = {from:utilityService.getValue('r7FUBZIK1iH',eventValues.dataValues),to:utilityService.getValue('Am2wAwoJdCV',eventValues.dataValues),subject:utilityService.getValue('QLfNQoTlAM9',eventValues.dataValues),body:utilityService.getValue('qYjGeQATsEh',eventValues.dataValues),date:eventValues.created.substring(0,10)}
        //        angular.forEach(template,function(value,index){
        //            if(index == "from"){
        //                template[index] = eval("("+value+")");
        //            }
        //        });
            messageValues.created = messageValues.created.substring(0,10)
            content.push(messageValues);
            })
        //console.log(message.messageConversations);
        return content;

    }
    utilityService.refineExternalLinks = function(events){
        var content = [];
        var activeClass = "";
        var contentClass = "";
        angular.forEach(events,function(eventValues,eventIndexs){
            var template = {url:utilityService.getValue('fNpPvw46Mxl',eventValues.dataValues),name:utilityService.getValue('cReJPO8bM6C',eventValues.dataValues),status:utilityService.getValue('CqGEDx5xw2Y',eventValues.dataValues)}
            content.push(template);
        })

        return content;

    }

    utilityService.getValue = function(element,arrayContainer){
        var value = "";
        angular.forEach(arrayContainer,function(elementObject,elementIndex){
            if(element==elementObject.dataElement){
                value = elementObject.value;
            }
        });

        return value;
    }

    return utilityService;
});

function handleSuccess(res){
    return res.data;
}

function handleError(error){
    return function () {
        return { success: false, message: error };
    };
}