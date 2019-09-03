const users=[
  {email:"admin@gmail.com",password:'R1234567',role:'admin'},
  {email:"normal@gmail.com",password:'A1234567',role:'user'}
];
const form_login=document.querySelector('#form_login');

const initModal=(modalRef='.modal',trigger_btn)=>{//{modalReference,trigger-button}
      
      document.querySelector(trigger_btn).addEventListener('click',()=>{
        hide_all();
        document.querySelector(modalRef).classList.add('show');
      });

      document.querySelector(`${modalRef} .modal-body .modal-close`).addEventListener('click',()=>{
        document.querySelector(modalRef).classList.remove('show');
      });
 }

const hide_all=()=>{
  const all_modal=document.querySelectorAll('.modal');
      all_modal.forEach( function(modal) {
        modal.classList.remove('show');
      });
     
 }



 form_login.addEventListener('submit',(e)=>{
   e.preventDefault();

   const email=document.querySelector('#email');
   const password=document.querySelector('#password');
   const all_validation_container=document.querySelectorAll('.input-validation-msg');

   const response=checkPassword(email.value,password.value);
   if(response.status===200){
     const {data:user}=response;
     return user.role==='admin'?redirect('UI/html/admin/dashboard.html'):
                                redirect('UI/html/dashboard.html');
   }
  
   all_validation_container.forEach((container)=>{
     
      if(container.dataset.field===response.field){

        container.innerText=response.error;
      }
   });
 });

 const checkPassword=(email,password,feedback)=>{
  let resp={};
  const [fetch_user]=users.filter((user)=>user.email===email);
  
   if(fetch_user){

     if(fetch_user.password===password){
      resp={
        status:200,
        data:fetch_user
      };
     }
     else{
      resp={
        status:400,
        error:'Invalid Password',
        field:'password'
      };
     }
    
   }
   else{
    resp={
      status:400,
      error:'Invalid Email',
      field:'email'
    };
   }
   return resp;
 }

 const redirect=(path)=>{
   const [basic_path]=window.location.href.split('UI');
   window.location.href=basic_path+path;
 }