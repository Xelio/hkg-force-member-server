// ==UserScript==
// @name       HKG Force member server
// @namespace  http://xelio.eu.org
// @version    1.2
// @description  Force using member server if logged in
// @include    http://forum*.hkgolden.com/*
// @include    http://search.hkgolden.com/*
// @require    http://code.jquery.com/jquery-1.9.1.min.js
// @run-at document-end
// @copyright  2013+, Xelio
// ==/UserScript==


/*
HKG Force member server (HKGolden Force member server)
Copyright (C) 2013 Xelio Cheong

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/

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

var memberServers = $j.map(shuffle([9, 10, 11]), function(n, i) {return 'forum' + n;});

var inMemberServer = false;
var loggedIn = false;
var searchResult = false;

var currentServer = window.location.href.match(/(forum\d+|search)/)[0];
memberServers.forEach(function(ele, ind, arr) {
  if(currentServer === ele) inMemberServer = true;
});

loggedIn = ($j('a[href="javascript:islogout();"]').length !== 0);

searchResult = window.location.href.match(/search.hkgolden.com\/Search/) !== null;


if(!inMemberServer && loggedIn) {
  if(!searchResult) {
    // redirect to member server
    window.location.href = window.location.href.replace(/(forum\d+|search)/, memberServers[0]);
  } else {
    // replace search link
    $j('a[href^="view.aspx"]').each(function() {
      $j(this).attr('href', 'http://' + memberServers[0] + '.hkgolden.com/' + $j(this).attr('href'));
    });
  }
}
