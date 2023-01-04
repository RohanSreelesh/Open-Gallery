function init(){

    document.getElementById("add-workshop").addEventListener("click", handleAddWorkshop);
}

function handleAddWorkshop(){
    let name = document.getElementById("work-name").value;
    let minage = document.getElementById("work-age").value;
    let artistname = document.getElementById("add-workshop").value;
    let xhttp =  new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if(this.readyState ==4 && this.status ==200){
            location.href = `http://localhost:3000/artist/profile/${artistname}/`
        }
    }
    xhttp.open("PUT",`http://localhost:3000/artist/addworkshop`);
    xhttp.setRequestHeader('Content-Type', 'application/json');
    xhttp.send(JSON.stringify({name:name, age:minage}));
}