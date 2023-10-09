const queryParams = new URLSearchParams(window.location.search);
const queryPassword = queryParams.get('password');

if (!queryParams.has('password')) window.location.href = '/404';

const countPage = document.getElementById('count-page');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const ordersContainer = document.getElementById('orders-container');
const ordersCount = document.getElementById('orders-count');
const allPrice = document.getElementById('all-price');
const lastOrderTime = document.getElementById('last-order-time');
const logOut = document.getElementById('log-out');
const orderElements = document.getElementsByClassName('order');

let partedArr;
let pagintationCounter = 1;
countPage.innerText = pagintationCounter;

function updateResults(allOrdersArr) {
    let latestOrder = allOrdersArr[allOrdersArr.length - 1];
    let totalPrice = allOrdersArr.reduce((sum, order) => sum + parseFloat(order.price), 0);

    const sortedOrderArr__ClientName = allOrdersArr.slice().sort((a, b) => a.client.localeCompare(b.client));
    const sortedOrderArr__price = allOrdersArr.slice().sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
    const sortedOrderArr__date = allOrdersArr.slice().reverse();

    partedArr = getPartedArr(allOrdersArr);
    getOrders(partedArr[pagintationCounter - 1]);

    function attachSortListeners(arr, id) {
        document.getElementById(id).addEventListener('click', function () {
            partedArr = getPartedArr(arr);
            getOrders(partedArr[pagintationCounter - 1]);
        });
    }

    attachSortListeners(sortedOrderArr__ClientName, 'sort-clientName');
    attachSortListeners(sortedOrderArr__price, 'sort-price');
    attachSortListeners(sortedOrderArr__date, 'sort-date');

    refreshResults(totalPrice, latestOrder, allOrdersArr);
}

function refreshResults(totalPrice, latestOrder, allOrdersArr) {
    allPrice.innerText = `$${totalPrice}`;
    lastOrderTime.innerText = latestOrder.orderTime;
    ordersCount.innerText = allOrdersArr.length;
}

function attachDeleteListeners(allOrdersArr) {
    const deleteOrderBtn = document.getElementsByClassName('delete-order');
    for (let btn of deleteOrderBtn) {
        btn.addEventListener('click', function () {
            const clickedID = this.closest('.order').id;
            document.getElementById(clickedID).remove();
            axios.post('/delete-order', clickedID)
                axios.get('/get-orders')
                    .then((response) => {
                        updateResults(response.data);
                    })
                    .catch((error) => {
                        console.error(`Error getting info: ${error}`);
                    });  
        });
    }
}

function attachToggleListeners() {
    for (let i = 0; i < orderElements.length; i++) {
        let marginLeftValue = 0;
        orderElements[i].addEventListener('click', function () {
            marginLeftValue = (marginLeftValue === 0) ? -540 : 0;
            this.style.marginLeft = `${marginLeftValue}px`;
        });
    }
}

function nextClick(partedArr) {
    if (pagintationCounter <= partedArr.length - 1) {
        pagintationCounter++;
        countPage.innerText = pagintationCounter;
        getOrders(partedArr[pagintationCounter - 1]);
    }
}

function prevClick(partedArr) {
    if (pagintationCounter > 1) {
        pagintationCounter--;
        countPage.innerText = pagintationCounter;
        getOrders(partedArr[pagintationCounter - 1]);
    }
}

function getPartedArr(arr) {
    let partedArr = [];
    for (let i = 0; i < arr.length; i += 2) {
        partedArr.push(arr.slice(i, i + 2));
    }
    return partedArr;
}

function getOrders(ordersArr) {
    ordersContainer.innerHTML = '';
    for (let el of ordersArr) {
        const orderDiv = document.createElement('div');
        orderDiv.setAttribute('class', 'order');
        orderDiv.setAttribute('id', el.orderID);
        orderDiv.innerHTML = `
            <div class="left-part">
                <img src="${el.img}" alt="">
            </div>
            <div class="right-part">
                <h2>${el.good}</h2>
                <p>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Natus corporis perferendis reprehenderit. Quia dolorum possimus minus voluptatibus quibusdam! Velit, harum.</p>
                <p>Count: <span>${el.count} pcs</span></p>
                <p>Client: <span>${el.client}</span></p>
                <p>Ordered: <span>${el.orderTime}</span></p>
                <h4 style="align-self: center;">Costs: <span class="price">$${el.price}</span></h4>
            </div>
            <div class="delete-order">delete</div>
        `;
        ordersContainer.appendChild(orderDiv);
    }

    attachDeleteListeners(ordersArr);
    attachToggleListeners();
}

nextBtn.addEventListener('click', function () {
    nextClick(partedArr);
});

prevBtn.addEventListener('click', function () {
    prevClick(partedArr);
});

logOut.addEventListener('click', function () {
    window.location.href = '/';
});

document.querySelector('.open-sort').addEventListener('click', function () {
    const sortContainer = document.querySelector('.sort-container');
    sortContainer.style.left = (sortContainer.style.left === '0px') ? '-320px' : '0px';
});

axios.get('/get-orders')
    .then((response) => {
        updateResults(response.data);
    })
    .catch((error) => {
        console.error(`Error getting info: ${error}`);
    });