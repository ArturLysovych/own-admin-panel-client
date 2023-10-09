const queryParams = new URLSearchParams(window.location.search);
const queryLogin = queryParams.get('login');
const queryPassword = queryParams.get('password');
let myAccount;
if (queryParams.has('login') && queryParams.has('password')) {
    myAccount = {
        login: queryLogin,
        password: queryPassword
    };
} else {
    window.location.href = '/404';
}

const goodsContainer = document.getElementById('goodsContainer');
const orderContainer = document.getElementById('orderContainer');
const totalPrice = document.getElementById('totalPrice');
let addToCart = document.getElementsByClassName('addToCart');
let orderElements = document.getElementsByClassName('order');
let orderArr = [];
let totalCosts;

document.getElementById('userName').innerText = myAccount.login;

let goods = [
    {
        name: 'Humburger',
        link: 'humburger-link',
        image: './images/humburger.jpg',
        info: 'Lorem, ipsum dolor sit amet consectetur adipisicing elit. Nam.',
        price: '8'
    },
    {
        name: 'Hawaiian pizza',
        link: 'hawaiian-link',
        image: './images/hawaiian-pizza.jpg',
        info: 'Lorem, ipsum dolor sit amet consectetur adipisicing elit. Nam.',
        price: '16'
    },
    {
        name: 'Pepperoni pizza',
        link: 'pepperoni-link',
        image: './images/pepperoni-pizza.jpg',
        info: 'Lorem, ipsum dolor sit amet consectetur adipisicing elit. Nam.',
        price: '14'
    }
];

goodsContainer.innerHTML = '';
for(let el of goods) {
    let card = document.createElement('div');
    card.setAttribute('class', 'card');
    card.innerHTML = `
        <div class="topPart">
            <img src="${el.image}" alt="">
        </div>
        <div class="bottomPart">
            <h2>${el.name}</h2>
            <p>${el.info}</p>
            <h3>$${el.price}</h3>
            <div class="buttons">
                <div class="addToCart">
                    <i class="fa-solid fa-cart-shopping"></i>
                </div>
                <div class="copy" id="${el.link}">
                    <i class="fa-solid fa-copy"></i>
                </div>
            </div>
        </div>
    `;
    goodsContainer.appendChild(card);
}
function generateId() {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let id = '';
    for (let i = 0; i < 6; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        id += characters[randomIndex];
    }
    return id;
}
for (let i = 0; i < addToCart.length; i++) {
    addToCart[i].addEventListener('click', function() {
        const currentDateTime = new Date();
        const formattedDateTime = `${currentDateTime.getDate().toString().padStart(2, '0')}.${(currentDateTime.getMonth() + 1).toString().padStart(2, '0')}.${currentDateTime.getFullYear()}, ${currentDateTime.getHours().toString().padStart(2, '0')}:${currentDateTime.getMinutes().toString().padStart(2, '0')}:${currentDateTime.getSeconds().toString().padStart(2, '0')}`;
        orderArr.push(
            {
                good: goods[i].name,
                price: goods[i].price,
                client: myAccount.login,
                orderID: generateId(),
                count: 1,
                img: goods[i].image,
                orderTime: formattedDateTime,
            }
        );
        addOrder();
        console.log(orderArr);
        totalCosts = orderArr.reduce((acc, item) => acc + parseFloat(item.price), 0);
        totalPrice.innerText = `$${totalCosts}`;
    });
}
function addOrder() {
    orderContainer.innerHTML = '';
    for(let el of orderArr) {
        const order = document.createElement('div');
        order.setAttribute('class', 'order');
        order.innerHTML = `
            <img src="${el.img}" alt="">
            <h3>${el.good}</h3>
            <div class="deleteThis">delete</div>
        `;
        orderContainer.appendChild(order);
    }
    for (let i = 0; i < orderElements.length; i++) {
        let marginLeftValue = 0;
    
        orderElements[i].addEventListener('click', function() {
            marginLeftValue = (marginLeftValue === 0) ? -145 : 0;
            this.style.marginLeft = `${marginLeftValue}px`;
        });
    }
    let deleteElements = document.getElementsByClassName('deleteThis');
    for (let i = 0; i < deleteElements.length; i++) {
        deleteElements[i].addEventListener('click', function() {
            let orderElement = this.closest('.order');
            if (orderElement) {
                let index = Array.from(orderElement.parentElement.children).indexOf(orderElement);
                orderArr.splice(index, 1);
                orderElement.remove();
            }
            totalCosts = orderArr.reduce((acc, item) => acc + parseFloat(item.price), 0);
            totalPrice.innerText = `$${totalCosts}`;
        });
    }
}

document.getElementById('orderBtn').addEventListener('click', function() {
    axios.post('/send-order', orderArr)
    orderArr = [];
    orderContainer.innerHTML = '';
    totalPrice.innerText = '$0';
});

document.querySelector('.user-image').addEventListener('dblclick', function() {
    window.location.href = '/log-panel';
});

Array.from(document.getElementsByClassName('copy')).forEach(button => {
    button.addEventListener('click', function() {
        let textToCopy = window.location.href + '#' + this.id;
        const tempInput = document.createElement('input');
        tempInput.value = textToCopy;
        document.body.appendChild(tempInput);
        tempInput.select();
        tempInput.setSelectionRange(0, 99999);
        document.execCommand('copy');
        document.body.removeChild(tempInput);
    });
});