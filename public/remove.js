function init(){


    document.querySelectorAll("#remove-review").forEach(button => button.addEventListener("click",handleRemoveReview));
    document.querySelectorAll("#remove-like").forEach(button => button.addEventListener("click",handleRemoveLike));
}

function handleRemoveReview(){
    let artname = this.value;
    let xhttp =  new XMLHttpRequest();
		xhttp.onreadystatechange = function() {
			if(this.readyState ==4 && this.status ==200){
                alert("Review was successfully removed")
                location.href = `http://localhost:3000/user/managereview`
			}
            else if(this.readyState ==4 && this.status ==400){
                alert("review was not removed due to an error")
                location.href = `http://localhost:3000/user/managereview`
            }
		}
	xhttp.open("PUT",`removereview/${artname}`);
	xhttp.setRequestHeader('Content-Type', 'application/json');
	xhttp.send();
}


function handleRemoveLike(){
    let artname = this.value;
    let xhttp =  new XMLHttpRequest();
		xhttp.onreadystatechange = function() {
			if(this.readyState ==4 && this.status ==200){
                alert("Like was successfully removed")
                location.href = `http://localhost:3000/user/managereview`
			}
            else if(this.readyState ==4 && this.status ==400){
                alert("Like was not removed due to an error")
                location.href = `http://localhost:3000/user/managereview`
            }
		}
	xhttp.open("PUT",`removelike/${artname}`);
	xhttp.setRequestHeader('Content-Type', 'application/json');
	xhttp.send();
}
