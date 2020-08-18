// const e = require("express")

const signupform = document.querySelector('#register-form')
const signinform = document.querySelector('#login-form')
const usermail = document.querySelector('#your_email')
const userpass = document.querySelector('#your_pass')
const name_input = document.querySelector('#name')
const email_input = document.querySelector('#email')
const password_input= document.querySelector('#pass')
const repass_input = document.querySelector('#re_pass')
const success =document.querySelector('#success-message')
const loginsuccess=document.querySelector('#login-success')
const pass_match = document.querySelector('#password_match')

//COMPARES THE TWO PASSWORDS
const matchpass = ()=>{
    if(password_input.value!=repass_input.value){
        pass_match.textContent ="Passwords do not match"
    }else{
        pass_match.textContent=" "
    }
}
repass_input.addEventListener("keypress", matchpass, false)
repass_input.addEventListener("keyup", matchpass, false)
//Listens for the signup event
signupform.addEventListener('submit', (e)=>{
    e.preventDefault()
    const name =name_input.value
    const email = email_input.value
    const password = password_input.value
    const data = {name, email, password}
    const options ={
        method:'POST',
        headers:{
            'Content-Type':'application/json',
        },
        body: JSON.stringify(data)
    }
   
    fetch('/users', options).then(response=>{
        response.json().then((data)=>{
            if(response.status=='404' && data.name=="MongoError"){
                return success.textContent="Email exists already"
            } 
            const token =data.token 
            localStorage.setItem('token', token)
        })
        console.log(response)
        if(response.status=='201'){
            success.textContent="Account Created"
            setTimeout(()=>{
                location.href='/test.html'
            }, 2000)
            
        }
        
        
    })
    // console.log("Submitted")
})


//Listen to the sign in events
signinform.addEventListener('submit', (e)=>{
    e.preventDefault()
    const usermail_val = usermail.value
    console.log(usermail_val)
    const userpass_val = userpass.value
    console.log(userpass_val)
    const data1 = {email:usermail_val, password:userpass_val}
    console.log(data1)
    const options1 ={
        method:'POST',
        headers:{
            'Content-Type':'application/json',
        },
        body: JSON.stringify(data1)
    }
    fetch('/users/login', options1).then(response=>{
        response.json().then((data)=>{
            const token =data.token 
            localStorage.setItem('token', token)
        })
        if(response.status=='200'){
            loginsuccess.textContent="Login successful"
            setTimeout(()=>{
                location.href='/test.html'
            }, 2000)
            
        }else if(response.status=='404'){
            loginsuccess.textContent="Invalid Username/Password"
        }

    })

})

