function init(){
    if(document.getElementById("follow")!=null){
        document.getElementById("follow").addEventListener("click",handleFollow);
    }
    if(document.getElementById("unfollow")!=null){
        document.getElementById("unfollow").addEventListener("click",handleUnfollow);
    }
    if(document.getElementById("addworkshop")!=null){
        document.getElementById("addworkshop").addEventListener("click",getAddWorkshopPage);
    }
    if(document.getElementById("addartwork")!=null){
        document.getElementById("addartwork").addEventListener("click",getAddArtPage);
    }
    if( document.querySelectorAll("#register").length!=0){
        let register = document.querySelectorAll("#register");
        register.forEach(button => button.addEventListener("click",registerUser))
        console.log(register);
    }


}

function handleFollow(){
    let artistName= document.getElementById("follow").value;
    let xhttp =  new XMLHttpRequest();
		xhttp.onreadystatechange = function() {
			if(this.readyState ==4 && this.status ==200){
                location.href = `http://localhost:3000/artist/profile/${artistName}`
                //location.reload();
			}
            else if(this.readyState ==4 && this.status ==400){
                alert("Follow failed")
                location.href = `http://localhost:3000/artist/profile/${artistName}`
            }
		}
	xhttp.open("POST",`http://localhost:3000/artist/profile/follow/${artistName}`);
	xhttp.setRequestHeader('Content-Type', 'application/json');
	xhttp.send(JSON.stringify({artist:artistName}));
}

function handleUnfollow(){
    let artistName= document.getElementById("unfollow").value;
    let xhttp =  new XMLHttpRequest();
		xhttp.onreadystatechange = function() {
			if(this.readyState ==4 && this.status ==200){
                location.href = `http://localhost:3000/artist/profile/${artistName}`
                //location.reload();
			}
            else if(this.readyState ==4 && this.status ==400){
                alert("Follow failed")
                location.href = `http://localhost:3000/artist/profile/${artistName}`
            }
		}
	xhttp.open("POST",`http://localhost:3000/artist/profile/unfollow/${artistName}`);
	xhttp.setRequestHeader('Content-Type', 'application/json');
	xhttp.send(JSON.stringify({artist:artistName}));
}

function getAddWorkshopPage(){
    let xhttp =  new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
            if(this.readyState ==4 && this.status ==200){
                location.href = `http://localhost:3000/artist/addworkshop`
            }
        }
	xhttp.open("GET",`http://localhost:3000/artist/addworkshop`);
	xhttp.setRequestHeader('Content-Type', 'application/json');
	xhttp.send();
}

function getAddArtPage(){
    let xhttp =  new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if(this.readyState ==4 && this.status ==200){
            location.href = `http://localhost:3000/artist/addart`
        }
    }
    xhttp.open("GET",`http://localhost:3000/artist/addart`);
    xhttp.setRequestHeader('Content-Type', 'application/json');
    xhttp.send();
}

function registerUser(){
    let name = this.value;
    let xhttp =  new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if(this.readyState ==4 && this.status ==200){
            //location.href = `http://localhost:3000/artist/addart`
            alert(`You have registered for the workshop: ${name}`)
        }
        else if(this.readyState ==4 && this.status ==400){
            alert(`You are already registered for the workshop: ${name}`)
        }
    }
    xhttp.open("post",`http://localhost:3000/artist/workshop/${this.value}/adduser`);
    xhttp.setRequestHeader('Content-Type', 'application/json');
    xhttp.send();
}