
var pathToRoot = "../../";
var pathToRootFromPHP = "../../";

var QueryString = function ()
{
    // This function is anonymous, is executed immediately and
    // the return value is assigned to QueryString!
    var query_string = {};
    var query = window.location.search.substring(1);
    var vars = query.split("&");
    // console.log(vars);

    for ( var i=0 ; i<vars.length; i++ )
    {
        var pair = vars[i].split("=");
        // console.log("QUERY ["+ pair[0] +" : "+ pair[1] +"]");

        // If first entry with this name
        if ( typeof query_string[ pair[0] ] === "undefined" )
        {
            query_string[ pair[0] ] = decodeURIComponent( pair[1] );
        // If second entry with this name
        }
        else if ( typeof query_string[ pair[0] ] === "string" )
        {
            var arr = [ query_string[ pair[0] ] , decodeURIComponent( pair[1] ) ];
            query_string[ pair[0] ] = arr;
            // If third or later entry with this name
        }
        else
        {
            query_string[ pair[0] ].push( decodeURIComponent( pair[1] ) );
        }
    }

    return query_string;
}();

var isMobile = ( QueryString.mobile == "true" ) ? "?mobile" : "";


function loadedHandler()
{
    checkBannerType();
//    checkStatus();
}

function checkBannerType()
{
    switch ( QueryString.type )
    {
        case "html5":
            setAssetName( QueryString.assetname );
            createBannerHTML( QueryString , isMobile );
            createToggleBtn();
            createReplayBtn();
            addDownloadLink( QueryString.src , "zip" );
            addBackUpLink();
            checkForBackUp();
            break;

        case "html5responsive":
            setAssetName( QueryString.assetname );
            createBannerHTML( QueryString , isMobile );
            createToggleBtn();
            createReplayBtn();
            addDownloadLink( QueryString.src , "zip" );
            addBackUpLink();
            checkForBackUp();
            addSizesDropDown( QueryString.sizesArray );
            break;

        case "mp4":
            setAssetName( QueryString.assetname );
            createBannerVideo( QueryString );
            addDownloadLink( QueryString.src , QueryString.type );
            break;

        default:
            setAssetName( QueryString.assetname );
            createBannerStatic( QueryString, "."+QueryString.type );
            addDownloadLink( QueryString.src , QueryString.type );
    }
}

// ADD BACKUP IMAGE NEXT TO HTML
function checkForBackUp()
{
    if ( QueryString.backup != "undefined" && QueryString.backup != "false" )
    {
        var isCustomBackupType = QueryString.backup !== 'true',// Check if custom file ext is passed for HTML backup
            fileType = isCustomBackupType ? QueryString.backup : "jpg"
            fileNameSuffix = "-backup."+fileType;

        createBannerStatic( QueryString, fileNameSuffix );
    }
}

function setAssetName( assetName )
{
    id("creative").innerHTML = QueryString.displayName;
}

function createBannerStatic( data, fileNameSuffix )
{
    var i = document.createElement("img");
        i.setAttribute( "src" , pathToRoot+data.src + fileNameSuffix );
        i.setAttribute( "width" , data.w+"px" );
        i.setAttribute( "height" , data.h+"px" );
        i.setAttribute( "alt" , "" );
        i.style.border = "none";
        i.style.marginBottom = "10px";
        i.style.verticalAlign = "top";

    id("preview-holder").appendChild(i);
}

function createBannerVideo( data )
{
    var fileNameSuffix = ( QueryString.type == "mp4" ) ? ".mp4" : ".mp4";
    var i = document.createElement("video");
        i.setAttribute( "src" , pathToRoot+data.src + fileNameSuffix );
        i.setAttribute( "width" , data.w+"px" );
        i.setAttribute( "height" , data.h+"px" );
        i.setAttribute( "controls" , true );
        i.style.border = "none";
        i.style.marginBottom = "10px";
        i.style.verticalAlign = "top";

    id("preview-holder").appendChild(i);
}

function createBannerHTML( data , isMobile )
{
    var i = document.createElement("iframe");
        i.onload = eventFrameLoaded;    // CHECK VIDEO TAG EXISTS TO AUTOMATE DEVICE TOGGLE BUTTON
        i.setAttribute( "id" , "iBanner" );
        i.setAttribute( "src" , pathToRoot+data.src+"/index.html"+isMobile );
        i.setAttribute( "width" , data.w+"px" );
        i.setAttribute( "height" , data.h+"px" );
        i.style.border = "none";
        i.style.marginRight = "10px";
        i.style.marginBottom = "10px";
        i.style.background = "#dedede";
        i.sandbox = "allow-popups allow-scripts allow-same-origin"; 
        i.scrolling = "no";

    id("preview-holder").appendChild(i);
}

function addSizesDropDown( sizesArray )
{
    var sizesArray = parseSizesStringToArray( sizesArray );
    var sizes = document.createElement("div");
        sizes.setAttribute( "id" , "sizes" );
        sizes.style.color = "#919699";
        sizes.style.fontWeight = "normal";

    id("resize").appendChild( sizes );

    var selectSizes = document.createElement("select");
        selectSizes.setAttribute( "id" , "sizesList" );
        selectSizes.style.fontSize = "11px";
        selectSizes.setAttribute( "onchange" , "resizeIframe(this)" );

    var i, option, label;

    for ( i in sizesArray )
    {
        if ( sizesArray[i].size ==="fullscreen" )
        {
            createFullScreen();
        }
        else
        {
            label = ( sizesArray[i].label ) ? sizesArray[i].label +" : " : "";

            option = document.createElement("option");
            option.value = sizesArray[i].size;
            option.innerHTML = label + sizesArray[i].size;

            selectSizes.appendChild( option ); 
        }
    }

    id("sizes").appendChild( selectSizes );
    id("resizeHolder").style.display = "inline-block";
}

// CHECK VIDEO TAG EXISTS TO AUTOMATE DEVICE TOGGLE BUTTON
function eventFrameLoaded(e)
{
    var iFrame = e.currentTarget;
        iFrame.onload = null;
    var iFrameHTML = iFrame.contentDocument.body;

    var elVid = iFrameHTML.getElementsByTagName('video')[0];


    if ( elVid ) id("deviceHolder").style.display = "inline-block";
}

function resizeIframe( e )
{
    var eID = id("sizesList");
    var sizeValue = eID.options[ eID.selectedIndex ].value;

    switch ( sizeValue )
    {
        case "resize":
            window.open( pathToRoot+QueryString.src+"/index.html" , '_self' , "fullscreen=yes" );
            break;

        default:
            var sizeArray = sizeValue.split("x");
            var iBanner = id( "iBanner" );
                iBanner.setAttribute( "width", parseInt( sizeArray[0] ) );
                iBanner.setAttribute( "height" , parseInt( sizeArray[1] ) );
                iBanner.contentWindow.location.reload();
    }
}

function createFullScreen()
{
    var button = document.createElement("button");
        button.setAttribute( "id" , "btn-toggle" );
        button.setAttribute( "class" , "toggle-button" );
        button.setAttribute( "onclick" , "openFullScreen( 'iBanner' )" );
        button.style.marginLeft = "10px";
        button.innerHTML = "fullscreen";

    id("resizeHolder").appendChild( button );
}
// DOESN'T WORK ON IOS DAMMIT!!
function openFullScreen( DomID )
{
    var iframe = id( DomID );
    var requestFullScreen = iframe.requestFullscreen || iframe.mozRequestFullScreen || iframe.webkitRequestFullScreen || iframe.msRequestFullscreen;

    try 
    {
        requestFullScreen.call( iframe );
    } 
    catch ( err ) 
    {
         console.log( err );
    }
}

function id(input)
{
    return document.getElementById(input);
}

// EXAMPLE STRING FORMAT - sizesArray=[name1:500x450,name2:750x450,1030x450]
function parseSizesStringToArray( str )
{
    var arr = str.replace("[","").replace("]","").split(",");
    var arrList = new Array();
    var nth,arrSize,objSize;

    for ( nth in arr )
    {
        objSize = new Object();
        arrSize = arr[nth].split(":");

        if ( arrSize.length == 1 )
        {
            objSize.size = arrSize[0];
        }
        else
        {
            objSize.label = arrSize[0];
            objSize.size = arrSize[1];
        }

        arrList.push( objSize );
    }

    return arrList;
}

function createToggleBtn()
{
    var button = document.createElement("button");
        button.setAttribute( "id" , "btn-toggle" );
        button.setAttribute( "class" , "toggle-button" );
        button.setAttribute( "onclick" , "onToggleDevice()" );
        button.innerHTML = "desktop";

    id("device").appendChild( button );
}

function onToggleDevice( e )
{
    if ( id("btn-toggle").innerHTML == "desktop" )
    {
        id("btn-toggle").innerHTML = "mobile";
        id("iBanner").setAttribute("src", pathToRoot+QueryString.src +"/index.html?mobile" );
    }
    else
    {
        id("btn-toggle").innerHTML = "desktop";
        id("iBanner").setAttribute("src", pathToRoot+QueryString.src +"/index.html" );
    }
}

function createReplayBtn()
{
    var buttonReplay = document.createElement("button");
        buttonReplay.setAttribute( "id" , "btn-replay" );
        buttonReplay.setAttribute( "class" , "replay-button" );
        buttonReplay.setAttribute( "onclick" , "onReplayAd()" );
//        buttonReplay.style.display = "none";
        buttonReplay.innerHTML = "replay";

//    id("device").appendChild( buttonReplay );
}

function addDownloadLink( filePath , fileFormat )
{
    if (QueryString.dload === "true")
    {
        var i = document.createElement("img");
            i.setAttribute("src", pathToRoot+"preview/assets/images/download_icon.png");
            i.setAttribute("width", "14px" );
            i.setAttribute("height", "15px" );
            i.style.padding = "0px 0px 0px 10px";
        var linkText = document.createTextNode( "Download "+ fileFormat );
        var a = document.createElement('a');
            a.setAttribute( "class" , "downloads" );
            a.appendChild(linkText);
            a.appendChild(i);
        
            //autozip & manual zip
            a.href = autoZip( filePath , fileFormat );
            
            a.target = "_self";
            a.style.display = "block";
            a.download = "";

        id("link-holder").appendChild(a);
    }
}

function autoZip(filePath,fileFormat)
{
    switch(fileFormat)
    {
        case "zip":
            return  pathToRoot +"preview/builder/zipAndDownload.php?filepath=" +pathToRootFromPHP+filePath + "&zipname=" +pathToRootFromPHP+filePath;
            break;

        default:
            return pathToRoot+filePath +"."+ fileFormat;
            break;
    }
}

function addBackUpLink()
{
    // OVERRIDE DEFAULT jpg FILE FORMAT IF NOT true or false - zip, gif, etc

    if ( QueryString.backup != "false" && QueryString.backup != "undefined" )
    {
        var suffix = "-backup";
        var fileFormat = ( QueryString.backup != "true") ? QueryString.backup : "jpg";

        addDownloadLink( QueryString.src + suffix , fileFormat );
    }
}

window.onload = function (){ loadedHandler(); };
