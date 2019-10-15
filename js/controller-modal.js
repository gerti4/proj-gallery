'use strict'

var gProjType;
var gCurrProj = 0;


$(document).ready(function () {

  $('.portfolio-link').click(function () {

    gProjType = $(this)[0].dataset.type;
    renderModal(gProjType);
  })

  // $('.proj-nav').click(function () {
  //     var nextProj = (+$(this)[0].dataset.nav) + gCurrProj ;

  //     gCurrProj = getCurrProj(gProjType,nextProj);
  //     renderModal(gProjType, gCurrProj);
  // })
})

function projNavigate(elProjNav) {
  console.log(elProjNav);

  var nextProj = (+elProjNav.dataset.nav) + gCurrProj;
  console.log(nextProj);

  gCurrProj = getCurrProj(gProjType, nextProj);
  renderModal(gProjType, gCurrProj);
}



function renderModal(type, currProj = 0) {

  var proj = getProjToShow(type, currProj);


  var strHTML = `<h2>${proj.name}</h2>`;
  strHTML += `<p class="item-intro text-muted">Lorem ipsum dolor sit amet consectetur.</p>`;
  strHTML += ` <div class="page-nav d-flex flex-row" style="max-width: 90%">
    <button class="proj-nav d-block" style="height: fit-content;
        align-self: center;" data-nav="-1" onclick="projNavigate(this)">‹</button>
        <img class="img-fluid d-block mx-auto" src="${proj.img}" alt="">
    <button class="proj-nav d-block" style="height: fit-content;
    align-self: center;" data-nav="1" onclick="projNavigate(this)">›</button>
  </div>
    
    <p>Use this area to describe your project. Lorem ipsum dolor sit amet, consectetur adipisicing elit. Est blanditiis
      dolorem culpa incidunt minus dignissimos deserunt repellat aperiam quasi sunt officia expedita beatae cupiditate,
      maiores repudiandae, nostrum, reiciendis facere nemo!</p>
    <ul class="list-inline">
      <li>Date: Oktober 2019</li>
      <li><a target="_blank" href=${proj.link}>link to project!</a></li>
    </ul>
    <button class="btn btn-primary" data-dismiss="modal" type="button">
        <i class="fa fa-times"></i>
        Close Project</button>`;
  $('.modal-body').html(strHTML);

}

function sendMail() {
  // var email=$('.email').val();
  var subject = $('.subject').val();
  var content = $('.txt').val();
  console.log('!!');
  
  window.location.href =`https://mail.google.com/mail/?view=cm&fs=1&to=${email}&su=${subject}&body=${content}`;

  return false;
  // window.location.href = "mailto:"+'pazgerti4@gmail.com'+"?subject="+subject+"&body="+content;
}