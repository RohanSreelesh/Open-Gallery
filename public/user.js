function init(){
    document.getElementById("switch").addEventListener("click",switchAccount);
}

function switchAccount(){
    let xhttp =  new XMLHttpRequest();
		xhttp.onreadystatechange = function() {
			if(this.readyState ==4 && this.status ==201){
                location.href = "http://localhost:3000/artist/addart"
			}
            else if(this.readyState ==4 && this.status ==200){
                alert("Your account type was downgraded to user/patron")
				location.reload();
            }
		}
	xhttp.open("POST",`/user/switch`);
	xhttp.setRequestHeader('Content-Type', 'application/json');
	xhttp.send();
}