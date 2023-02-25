function locationGetID(){
    return(window.location.href)
}

function locationDetect(){
    if(window.location.href.includes("docs.google.com")){
        return("docs")
    }
}

function locationFormat(){
    if(locationDetect()=="docs"){
        return({
            buttonLocation: {x:75,y:50},
            sidebarLocation: {x:0,y:0}
        })
    }
}

var locationHelper = {
    ID: locationGetID(),
    TYPE: locationDetect(),
    FORMAT: locationFormat()
}
