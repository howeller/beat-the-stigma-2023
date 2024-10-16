
var pathToRootFromPHP = "../../";

function createDomRefs()
{
	dClient 	= document.getElementById( "client" );
	dCampaign 	= document.getElementById( "campaign" );
	dListing 	= document.getElementById( "listing" );
}
function loadedHandler()
{
	createDomRefs();
	createListing();
}
function createListing()
{
	var dLine1 = document.createElement("hr");
	var dLine2 = document.createElement("hr");
	var oldFilePath = "";
	var oldHeader = 3;

	dListing.innerHTML = "";
	dListing.appendChild( dLine1 );

	loopThroughFolders( oldFilePath , objData.listing , oldHeader );

	dListing.appendChild( dLine2 );
}

function createSubCats( nthHeader , title )
{
	var tag;

	// if ( nthHeader <= 4 )
	// {
		tag = document.createElement( "h" + nthHeader );
		tag.innerHTML = title;
	// }

	return tag;
}

function loopThroughFolders( oldFilePath , objFolderList , oldHeader )
{
	var nth,newFilePath,newHeader;

	for ( nth in objFolderList )
	{
		newFilePath = oldFilePath + objFolderList[ nth ].folderName + "/";

		var tag = createSubCats( oldHeader , objFolderList[ nth ].title );
		dListing.appendChild( tag );

		if ( objFolderList[ nth ].folderList )
		{
			newHeader = oldHeader + 1;
			loopThroughFolders( newFilePath , objFolderList[ nth ].folderList , newHeader );
		}
		if ( objFolderList[ nth ].bannerList )
		{
			loopThroughCreatives( newFilePath , objFolderList[ nth ].bannerList );
		}
	}

}

function loopThroughCreatives( oldFilePath , objBannerList )
{
	var nth,newFilePath;
	var ul = document.createElement("ul");

	dListing.appendChild( ul );

	for ( nth in objBannerList )
	{
		newFilePath = oldFilePath + objBannerList[ nth ].src;

		var li = ( objBannerList[ nth ].tagname ) ? createTagName( objBannerList[ nth ] ) : createBannerLink( objBannerList[ nth ] , newFilePath );

		ul.appendChild( li );
	}
}

function createTagName( bannerData )
{
	var span = document.createElement( bannerData.tagname );
		span.innerHTML = bannerData.innerHTML;
		span.className = ( bannerData.className ) ? bannerData.className : "";

	return span;
}

function createBannerLink( bannerData , filePath )
{
	var displaySize = ( bannerData.overwriteSizeDisplay ) ? bannerData.overwriteSizeDisplay : bannerData.w +"x"+ bannerData.h;
    
    var hrefData;
	if (bannerData.url)
	{
		hrefData = bannerData.url
	}
	else
	{
        hrefData = objData.pathToRoot + "preview/builder/page.html?";
		hrefData += "backup=" + bannerData.backup;
		hrefData += "&type=" + bannerData.type;
		hrefData += "&w=" + bannerData.w;
		hrefData += "&h=" + bannerData.h;
		hrefData += ( bannerData.approved ) ? "&approved=" + bannerData.approved : "";
		hrefData += ( bannerData.dload ) ? "&dload="+ bannerData.dload : "";
		hrefData += ( bannerData.sizesArray ) ? "&sizesArray=" + bannerData.sizesArray : "";
		hrefData += "&displaySize=" + displaySize;
		hrefData += "&displayName=" + bannerData.label;
		hrefData += "&src=" + filePath;
		if(bannerData.manualzip === true) hrefData += "&manualzip=" + bannerData.manualzip;
    }

	var span = document.createElement("span");
		span.setAttribute( "class" , "dimensions" );
		span.innerHTML = displaySize + " - ";

	var a = document.createElement("a");
    a.setAttribute( "href" , hrefData );
		
		a.setAttribute( "target" , "_self" );
		a.innerHTML = bannerData.label;

	var approvedClass = ( bannerData.approved ) ? "icon-approved" : "icon-indev";
	var divApproved = document.createElement("div");
		divApproved.setAttribute( "class" , approvedClass );

	var li = document.createElement("li");
		li.appendChild( divApproved );
		li.appendChild( span );
		li.appendChild( a );

	if ( bannerData.dload )
	{
		var fileList = "html5,html5responsive";
		var downloadLink = ( fileList.indexOf( bannerData.type ) < 0 ) ? autoZip( filePath , bannerData.type ) : autoZip( filePath , "zip" );

		var dIcon = document.createElement("span");
			dIcon.setAttribute( "class" , "download_icon" );
		var dLink = document.createElement("a");
			dLink.setAttribute( "id" , "ahref-download" );
			dLink.setAttribute( "target" , "_self" );
			dLink.setAttribute( "href" , downloadLink );
			dLink.appendChild( dIcon );
		li.appendChild( dLink );
	}

	return li;
}

function autoZip( filePath , fileFormat )
{
	var url = "";

	switch ( fileFormat )
	{
		case "zip":
			url = objData.pathToRoot + "preview/builder/zipAndDownload.php?filepath=" + pathToRootFromPHP + filePath + "&zipname=" + pathToRootFromPHP + filePath;
			break;

		default:
			url = objData.pathToRoot + filePath + "." + fileFormat ;
			break;
	}

	return url;
}

function strCamelCase( str )
{
	return str.charAt(0).toUpperCase() + str.slice(1);
}

window.onload = function (){ loadedHandler(); };
