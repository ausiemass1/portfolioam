/* global M $ */
document.addEventListener("DOMContentLoaded", function () {
  var elems = document.querySelectorAll(".sidenav");
  M.Sidenav.init(elems);
});

$(document).ready(function () {
  // Initialize the dropdown
  $(".dropdown-trigger").dropdown();
});

