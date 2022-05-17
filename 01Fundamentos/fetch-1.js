// Peticion GET 
//https://reqres.in/api/users

var request = new XMLHttpRequest();

request.open('GET', 'https://reqres.in/api/users', true)
request.send(null)

request.onreadystatechange = function (state){

    // console.log(state)

    if(request.readyState === 4){
        var resp = request.response;
        var respoObj = JSON.parse(resp)


        console.log(respoObj)
    }
}