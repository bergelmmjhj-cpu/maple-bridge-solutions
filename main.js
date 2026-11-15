// Year in footer + build a clean mailto: email from the contact form.
(function () {
  var yr = document.getElementById('yr');
  if (yr) yr.textContent = new Date().getFullYear();
  var form = document.getElementById('mailform');
  if (!form) return;
  form.addEventListener('submit', function (e) {
    if (!form.checkValidity()) return;
    e.preventDefault();
    var v = function (id) { var el = document.getElementById(id); return el ? el.value.trim() : ''; };
    var subject = 'Enquiry: ' + v('f-service') + (v('f-company') ? ' (' + v('f-company') + ')' : '');
    var body = 'Name: ' + v('f-name') + '\nBusiness: ' + v('f-company') + '\nInterested in: ' + v('f-service') + '\n\n' + v('f-msg');
    window.location.href = 'mailto:northislepartners@gmail.com?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
  });
})();
