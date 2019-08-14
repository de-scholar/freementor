const openSlide=document.querySelector("#open-slide-menu");
const closeSlide=document.querySelector("#close-slide-menu");
const nav_admin=document.querySelector(".nav-admin");
const content=document.querySelector("#content");

const openSlideMenu=()=>{
 nav_admin.style.width="250px";
 nav_admin.style.left="0";
 console.log(window.innerWidth);
 
 if(window.innerWidth>768){
  content.style.marginLeft="250px";
 }
 else{
   content.style.marginLeft="0";
 }
 
}

const closeSlideMenu=()=>{
 nav_admin.style.width="0";
 nav_admin.style.left="-120px";
 content.style.marginLeft="0"; 
}

openSlide.addEventListener('click',openSlideMenu);
closeSlide.addEventListener('click',closeSlideMenu);