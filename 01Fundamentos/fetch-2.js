// Peticion GET 
//https://reqres.in/api/users

fetch('https://reqres.in/api/users')
    .then()
    // .then(resp =>{
    //         // return resp.json().then(console.log)
    //         return resp.json()
    // })
    .then(resp =>  resp.json())
    .then(respObj =>{
        console.log(respObj)
    })


fetch('https://www.wikipedia.org')
     .then(console.log)
     .then(resp => resp.text())
     then(html =>{
         document.open()
         document.write(html)
         document.close()
     })