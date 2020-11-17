const searchDiv = document.querySelector('.search-container');
const galleryDiv = document.querySelector('#gallery');
const bodyDiv = document.querySelector('body');
const divCardsArray = document.querySelectorAll('div .card');
let userArray = [];

function searchBar() {
    searchDiv.insertAdjacentHTML ('beforeend', 
        `<form> 
        <input type="search" id="search-input" class="search-input" placeholder="Search...">
        <input type="submit" value="&#x1F50D;" id="search-submit" class="search-submit">
    </form>`)
}
searchBar();

function errorMessage(err){
        const h2 = document.createElement('h2');
        h2.className = 'error';
        h2.textContent = "There was an error loading the users. Try refreshing the page";
        bodyDiv.appendChild(h2);
        console.log(err);
}
function userDisplay (data) {
    const arrayOfUsers = data.results;
    arrayOfUsers.forEach(user => userArray.push(user))
    for(i=0; i< arrayOfUsers.length; i++){
        galleryDiv.insertAdjacentHTML('beforeend',  
            `<div class="card target ${i}">
                <div class="card-img-container target ${i}">
                    <img class="card-img target ${i}" src="${arrayOfUsers[i].picture.medium} " alt="profile picture">
                </div>
                <div class="card-info-container target">
                    <h3 id="name" class="card-name cap target ${i}">${arrayOfUsers[i].name.first} ${arrayOfUsers[i].name.last}</h3>
                    <p class="card-text target ${i}">${arrayOfUsers[i].email}</p>
                    <p class="card-text cap target ${i}">${arrayOfUsers[i].location.city}, ${arrayOfUsers[i].location.state}</p>
                </div>
            </div>`)}; 
};

fetch('https://randomuser.me/api/?results=12&nat=us')
    .then(response => response.json())
    .then(data => userDisplay(data))
    .catch(err => errorMessage(err))

function parseDate(str) {
        var m = str.match(/^(\d{4})\-(\d{1,2})\-(\d{1,2})/);
        return (m) ? `${m[2]}/${m[3]}/${m[1]}` : null;
      }
function parseAddress(user){
     let address = '';
    return address = `${user.location.street.number} ${user.location.street.name}, ${user.location.city}, ${user.location.state} ${user.location.postcode}`
}
function parsePhoneNum (str) {
    var phoneNumbers = str.phone.replace(/\D/g, '')
    var m = phoneNumbers.match(/^(\d{3})(\d{3})(\d{4})$/);
    return (m) ? `(${m[1]}) ${m[2]}-${m[3]}` : null;
}
function modalWindowMaker (eventTarget, clickIndex ){
    if (eventTarget.classList.contains('target')){
        const birthday = userArray[clickIndex].dob.date
        const birthdayReplace = parseDate(birthday);
        bodyDiv.insertAdjacentHTML('beforeend', `
         <div class="modal-container">
                <div class="modal">
                    <button type="button" id="modal-close-btn" class="modal-close-btn"><strong>X</strong></button>
                    <div class="modal-info-container">
                        <img class="modal-img" src="${userArray[clickIndex].picture.medium}" alt="profile picture">
                        <h3 id="name" class="modal-name cap">${userArray[clickIndex].name.first} ${userArray[clickIndex].name.last}</h3>
                        <p class="modal-text">${userArray[clickIndex].email}</p>
                        <p class="modal-text cap">${userArray[clickIndex].location.city}</p>
                        <hr>
                        <p class="modal-text">${parsePhoneNum(userArray[clickIndex])}</p>
                        <p class="modal-text">${parseAddress(userArray[clickIndex])}</p>
                        <p class="modal-text">Birthday: ${birthdayReplace}</p>
                    </div>
                </div>

                
                <div class="modal-btn-container">
                    <button type="button" id="modal-prev" class="modal-prev btn">Prev</button>
                    <button type="button" id="modal-next" class="modal-next btn">Next</button>
                </div>
            </div>`)
    };
}
function nextEmployee(eventTarget,index){
    if(index <= 10){
        let nextIndex = index + 1;
        modalWindowMaker(eventTarget, nextIndex);  
    }
}
function prevEmployee(eventTarget,index) {
    if(index >= 1){
        let previousIndex = index - 1;
        modalWindowMaker(eventTarget, previousIndex);  
    } else {

    }
}
galleryDiv.addEventListener('click', (event)=> {
    let initialClick = event.target;
    const clickClass = event.target.className.replace(/\D+/g, '');
    const userIndex = parseInt(clickClass, 10);

    modalWindowMaker(initialClick, userIndex);

    const modalDiv = document.querySelector('.modal-container');
    let modalClose = document.querySelector('#modal-close-btn');

    modalClose.addEventListener('click', () => {
        bodyDiv.removeChild(modalDiv);
        modalDiv.style.display = 'none';
    });

    const buttonDiv = document.querySelector('.modal-btn-container');
    const prevButton = document.querySelector('#modal-prev');
    const nextButton = document.querySelector('#modal-next');

    prevButton.addEventListener('click',()=> {
        console.log('hello');
        bodyDiv.removeChild(modalDiv);
        prevEmployee(initialClick, userIndex)
        initialClick = '';
    });
    nextButton.addEventListener('click', ()=> {
        bodyDiv.removeChild(modalDiv);
        nextEmployee(initialClick, userIndex)
        initialClick = '';;
    });
});



