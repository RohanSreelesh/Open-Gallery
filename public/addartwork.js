function init(){
    document.getElementById("submit-art").addEventListener("click",handleAddArt);
}

function handleAddArt(){
    let name = document.getElementById("artwork-name").value;
    let year = document.getElementById("artwork-year").value;
    let category = document.getElementById("artwork-category").value;
    let medium = document.getElementById("artwork-medium").value;
    let desc = document.getElementById("artwork-description").value;
    let link = document.getElementById("artwork-link").value;

    if(name==="" || year==="" ||category==="" || medium==="" || desc==="" || link===""){
        alert("One or more of the values are empty");
        return;
    }
    if(isNaN(year)){
        alert("Year should be a number");
        return;
    }

    let xhttp =  new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if(this.readyState ==4 && this.status ==200){
            alert("artwork added")
            location.href = `http://localhost:3000/artwork/${name}`
            //location.reload();
        }
        else if(this.readyState ==4 && this.status ==400){
            alert("Cannot add artwork with duplicate name try again")
            //location.href = `http://localhost:3000/artist/${artistName}`
        }
        else if(this.readyState ==4 && this.status ==201){
            alert("Your account has been upgraded to artist")
            location.href = `http://localhost:3000/artwork/${name}`
           // location.href = `http://localhost:3000/artist/addart`;
        }
    }
xhttp.open("POST",`/artist/addart`);
xhttp.setRequestHeader('Content-Type', 'application/json');
xhttp.send(JSON.stringify({name:name, year:year, category:category,medium:medium,description:desc,image:link}));

}