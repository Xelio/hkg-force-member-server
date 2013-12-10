// ==UserScript==
// @name       HKG Force member server
// @namespace  http://xelio.eu.org
// @version    2.0
// @description  Force using member server if logged in
// @include    http://forum*.hkgolden.com/*
// @include    http://search.hkgolden.com/*
// @include    http://profile.hkgolden.com/*
// @require    http://code.jquery.com/jquery-1.9.1.min.js
// @run-at document-end
// @copyright  2013+, Xelio
// ==/UserScript==

var $j = jQuery.noConflict();

// Function for randomizing array
shuffle = function(arr) {
  for(
    var j, x, i = arr.length; i;
    j = Math.random() * i|0,
    x = arr[--i], arr[i] = arr[j], arr[j] = x
  );
  return arr;
}

replaceLink = function() {
  $j('a[href^="view.aspx"]').each(function() {
    $j(this).attr('href', 'http://' + memberServers[0] + '.hkgolden.com/' + $j(this).attr('href'));
    $j(this).attr('target', '_new');
  });
}

var memberServers = $j.map(shuffle([9, 10, 11]), function(n, i) {return 'forum' + n;});

var inMemberServer = false;
var loggedIn = false;
var searchResult = false;
var profilePage = false;

var currentServer = window.location.href.match(/(forum\d+|search|profile)/)[0];
memberServers.forEach(function(ele, ind, arr) {
  if(currentServer === ele) inMemberServer = true;
});

loggedIn = ($j('a[href="javascript:islogout();"]').length !== 0);

searchResult = window.location.href.match(/search.hkgolden.com\/Search/) !== null;

profilePage = window.location.href.match(/profile.hkgolden.com\/profilepage.aspx/) !== null && $j('#ctl00_ContentPlaceHolder1_mainTab_mainTab0_tab').length !== 0;


if(profilePage || (searchResult && loggedIn)) {
  // Replace link target server
  replaceLink();
  
  $j('body').bind('DOMNodeInserted', function() {
    console.log('DOM node inserted');
    replaceLink();
  });
} else if(!inMemberServer && loggedIn && !searchResult) {
  // redirect to member server
  window.location.href = window.location.href.replace(/(forum\d+|search|profile)/, memberServers[0]);
}
