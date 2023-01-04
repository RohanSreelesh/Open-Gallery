
function init(){
    
    document.getElementById("submit-review").addEventListener("click",handleSubmitReview);
    document.getElementById("submit-like").addEventListener("click",handleSubmitLike);
    document.getElementById("category").addEventListener("click",handleCategorySearch);
    document.getElementById("medium").addEventListener("click",handleMediumSearch);
    document.getElementById("artist").addEventListener("click",handleArtist);
}

//sends an object in the format we need to add the review
function handleSubmitReview(){
    let reviewText= document.getElementById("review-text").value;
    let artname = document.getElementById("artname").innerHTML;
    let reviewObject = {review:reviewText ,artwork: artname}

    let xhttp =  new XMLHttpRequest();
		xhttp.onreadystatechange = function() {
			if(this.readyState ==4 && this.status ==200){
                location.href = `http://localhost:3000/artwork/${artname}`
			}
            else if(this.readyState ==4 && this.status ==400){
                alert("You cannot add a review twice, to remove your review go to your profile")
                //location.href = `http://localhost:3000/artwork/${artname}`
            }
            else if(this.readyState ==4 && this.status ==401){
                alert("You cannot add a review to your own artwork")
                //location.href = `http://localhost:3000/artwork/${artname}`
            }
		}
	xhttp.open("POST",`review/${artname}`);
	xhttp.setRequestHeader('Content-Type', 'application/json');
	xhttp.send(JSON.stringify(reviewObject));
}

function handleSubmitLike(){
    let artname = document.getElementById("artname").innerHTML;
    //console.log(text);
    //console.log(artname);
    let likeObject = {artwork: artname}

    let xhttp =  new XMLHttpRequest();
		xhttp.onreadystatechange = function() {
			if(this.readyState ==4 && this.status ==200){
                location.href = `http://localhost:3000/artwork/${artname}`
			}
            else if(this.readyState ==4 && this.status ==400){
                alert("You cannot like this again, to remove your like go to your profile")
                //location.href = `http://localhost:3000/artwork/${artname}`
            }
            else if(this.readyState ==4 && this.status ==401){
                alert("You cannot add a like to your own artwork")
                //location.href = `http://localhost:3000/artwork/${artname}`
            }
		}
	xhttp.open("POST",`like/${artname}`);
	xhttp.setRequestHeader('Content-Type', 'application/json');
	xhttp.send(JSON.stringify(likeObject));
}

function handleCategorySearch(){
    let categoryName = document.getElementById("category-name").innerHTML;

    let xhttp =  new XMLHttpRequest();
		xhttp.onreadystatechange = function() {
			if(this.readyState ==4 && this.status ==200){
               console.log("success")
               location.href = `http://localhost:3000/artwork/searchcategory/${categoryName}`
			}


		}
	xhttp.open("GET",`searchcategory/${categoryName}`);
	xhttp.setRequestHeader('Content-Type', 'text/html');
    xhttp.send();

	//xhttp.send(JSON.stringify(searchObject));
}


function handleMediumSearch(){
    let mediumName = document.getElementById("medium-name").innerHTML;
    
    let xhttp =  new XMLHttpRequest();
		xhttp.onreadystatechange = function() {
			if(this.readyState ==4 && this.status ==200){
               console.log("success")
               location.href = `http://localhost:3000/artwork/searchmedium/${mediumName}`
			}

		}
	xhttp.open("GET",`searchmedium/${mediumName}`);
	xhttp.setRequestHeader('Content-Type', 'text/html');
    xhttp.send();
}


function handleArtist(){
    let artistName = document.getElementById("artist-name").innerHTML;
    let xhttp =  new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if(this.readyState ==4 && this.status ==200){
           console.log("success")
           location.href = `http://localhost:3000/artist/profile/${artistName}`

        }

    }
    xhttp.open("GET",`http://localhost:3000/artist/profile/${artistName}`);
	xhttp.setRequestHeader('Content-Type', 'text/html');
    xhttp.send();
}