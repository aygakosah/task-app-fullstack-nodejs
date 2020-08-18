let token =localStorage.getItem('token')
const logout_btn=document.querySelector('#logout-button')
const addtask_form = document.querySelector('#message-form')
const input_describe=document.querySelector('#describe-task')
const input_completed =document.querySelector('#completed')
const profile_btn = document.querySelector('#Read-profile')
const searchtask_form = document.querySelector('#tasks-search')
const searchByName = document.querySelector('#Searchbyname')
const taskUpdateform = document.querySelector('#Update-task')
const deleteTask = document.querySelector('#deleteTask')


//  Where the messages wiil be populated
const $messages =document.querySelector('#messages')

//Templates
const messageTemplate = document.querySelector('#message-template').innerHTML
const locationTemplate = document.querySelector('#location-template').innerHTML


deleteTask.addEventListener('submit', (e)=>{
    e.preventDefault();
    const itemtodelete = document.querySelector('#deleteInput').value.toLowerCase()
    const options ={
        method:'DELETE',
        headers:{
            'Authorization':'Bearer '+token
        }
    }
    fetch('/tasks/'+itemtodelete, options).then(response=>{
        response.json().then((data)=>{
            console.log(data)
        })
    })
})
taskUpdateform.addEventListener('submit', (e)=>{
    e.preventDefault();
    const orignalTask = document.querySelector('#originalTaskName').value.toLowerCase()
    const newTask = document.querySelector('#newTaskName').value
    const compUpdate = document.querySelector('#completionUpdate').value
    const compUpdate_val = compUpdate.toLowerCase()=="yes"?true:false
    const data ={description:newTask, completed:compUpdate_val}
    const options ={
        method:'PATCH',
        headers:{
            'Content-Type':'application/json',
            'Authorization': 'Bearer ' + token
        },
        body: JSON.stringify(data)
    }
    fetch('/tasksupdate?description='+orignalTask, options).then(response=>{
        response.json().then((data)=>{
            const html = Mustache.render(locationTemplate, {
                title:"UPDATED TASK",
                description:data.description,
                completed:data.completed,
                createdAt:data.createdAt,
                updatedAt:data.updatedAt
            })
            $messages.insertAdjacentHTML('beforeend', html)
        })
    })
})
searchByName.addEventListener('submit', (e)=>{
    e.preventDefault()
    const options ={
        method:'GET',
        headers:{
            'Authorization': 'Bearer ' + token
        }
    }
    const description =document.querySelector('#taskname').value.trim().toLowerCase()
    console.log(description)
    
    fetch('/taskbyname/'+description, options).then(response=>{
        response.json().then((data)=>{
            // if(data.error){
            //     const html =Mustache.render(locationTemplate, {
            //         title:"NO SUCH TASK"
            //     })
            // }
            console.log(data.error)
            const html = Mustache.render(locationTemplate, {
                title:"YOUR TASK",
                description:data.description,
                completed:data.completed,
                createdAt:data.createdAt,
                updatedAt:data.updatedAt,
            })
            $messages.insertAdjacentHTML('beforeend', html)
        })
    })
})
searchtask_form.addEventListener('submit', (e)=>{
    const sortTime = document.querySelector('#sortTasksbyTime').value
    const sortComplete = document.querySelector('#sortTasksbycomplete').value
    e.preventDefault()
    let time =sortTime=="asc"?"asc":"desc"
    let comp =""
    
    if(sortComplete==""){
        comp=""
    }
    if(sortComplete=="true"){
        comp=""
        comp+="true"
    }
    if(sortComplete=="false"){
        comp=""
        comp+=false
    }
    const options ={
        method:'GET',
        headers:{
            'Authorization': 'Bearer ' + token
        }
    }
    console.log(sortComplete)
    console.log(sortTime)
    fetch('/tasks?limit=10&completed='+comp+'&sortBy=createdAt:'+time, options).then(response=>{
        response.json().then((data)=>{
            data.forEach(element => {
                const html =Mustache.render(locationTemplate, {
                    // title:"YOUR TASKS",
                    description:element.description,
                    completed:element.completed,
                    createdAt:element.createdAt,
                    updatedAt:element.updatedAt
                
                })
                $messages.insertAdjacentHTML('beforeend', html)
            });
            console.log(data)
        })
    })
})

profile_btn.addEventListener('click', ()=>{
    const options ={
        method:'GET',
        headers:{
            'Authorization': 'Bearer ' + token
        }
    }
    fetch('users/me', options).then(response=>{
        response.json().then((data)=>{
            const html =Mustache.render(messageTemplate, {
                username:data.name,
                email:data.email,
                createdAt:data.createdAt,
                updatedAt:data.updatedAt
            
            })
            
            $messages.insertAdjacentHTML('beforeend', html) 
        })
       
        
    })
    
})
addtask_form.addEventListener('submit', ()=>{
    // e.preventDefault();
    const task = input_describe.value.toLowerCase()
    let itbool=""
    const completed = input_completed.value
    itbool+=completed
    const actbool = itbool.toLowerCase()=="yes"?true:false
    const data ={description:task, completed:actbool}
    const options ={
        method:'POST',
        headers:{
            'Content-Type':'application/json',
            'Authorization': 'Bearer ' + token
        },
        body: JSON.stringify(data)
    }
    fetch('/tasks', options).then(response=>{
        response.json().then((data)=>{
            if(response.status=='200'){
                console.log(data)
            }
        })
    })
})

logout_btn.addEventListener('click', ()=>{
    const options ={
        method:'POST',
        headers:{
            'Authorization': 'Bearer ' + token
        }
    }
    fetch('/users/logout', options).then(response=>{
        if(response.status=='200'){
            setTimeout(()=>{
                location.href='../index.html'
            }, 2000)

        }
    })
})





