const countPage = document.getElementById('count-page');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const ordersContainer = document.getElementById('orders-container');
const ordersCount = document.getElementById('orders-count');
const allPrice = document.getElementById('all-price');
const lastOrderTime = document.getElementById('last-order-time');
const logOut = document.getElementById('log-out');

let pagintationCounter = 1;
countPage.innerText = pagintationCounter;

axios
.get('/get-orders')
.then((response) => {
    let allOrdersArr = response.data;

    let latestOrder = allOrdersArr[allOrdersArr.length-1];
    let totalPrice = allOrdersArr.reduce((sum, order) => sum + parseFloat(order.price), 0);

    let partedArr = getPartedArr(allOrdersArr);
    getOrders(partedArr[pagintationCounter-1]);
    

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
            `;
            ordersContainer.appendChild(orderDiv);
        }
    }
    nextBtn.addEventListener('click', function() {
        nextClick(partedArr);
    });
    prevBtn.addEventListener('click', function() {
        prevClick(partedArr);
    });
    function nextClick(partedArr) {
        if(pagintationCounter <= partedArr.length - 1) {
            pagintationCounter++;
            countPage.innerText = pagintationCounter;
            getOrders(partedArr[pagintationCounter-1]);
        }
    }
    function prevClick(partedArr) {
        if(pagintationCounter >1) {
            pagintationCounter--;
            countPage.innerText = pagintationCounter;
            getOrders(partedArr[pagintationCounter-1]);
        }
    }

    // оновлення результатів
    function refreshResults() {
        allPrice.innerText = `$${totalPrice}`;
        lastOrderTime.innerText = latestOrder.orderTime;
        ordersCount.innerText = allOrdersArr.length;
    }
    refreshResults();
})
.catch((error) => {
    console.error(`Error getting info: ${error}`);
})

logOut.addEventListener('click', function() {
    window.location.href = '/';
});