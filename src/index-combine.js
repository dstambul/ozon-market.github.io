'use strict'

function activeActions() {
  const cards = document.querySelectorAll('.goods .card'),
    discountCheckbox = document.getElementById('discount-checkbox'),
    goods = document.querySelector('.goods'),
    min = document.getElementById('min'),
    max = document.getElementById('max'),
    search = document.querySelector('.search-wrapper_input'),
    searchBtn = document.querySelector('.search-btn');
    
  discountCheckbox.addEventListener('click', filter);   

  min.addEventListener('change', filter );
  max.addEventListener('change', filter );

  searchBtn.addEventListener('click', () => {
    const searchText = new RegExp(search.value.trim(), 'i');
    cards.forEach((card) => {
      const title = card.querySelector('.card-title');
      if(!searchText.test(title.textContent)) {
        card.parentNode.style.display = 'none';
      } else {
        card.parentNode.style.display = '';
      }
    });
    search.value = '';
  });
}

function addRemoveCart () {
  const cards =  document.querySelectorAll('.goods .card '),
      cartWrapper = document.querySelector('.cart-wrapper'),
      cartEmpty = document.getElementById('cart-empty'),
      countGoods = document.querySelector('.counter'),
      cardPrice = document.querySelectorAll('.card-price');

  cards.forEach( (card) => {
    const btn = card.querySelector('button');

      btn.addEventListener('click', () => {
        const cardClone = card.cloneNode(true);
        cartWrapper.appendChild(cardClone);
        showData();

      const removeBtn = cardClone.querySelector('.btn');
      removeBtn.textContent = 'Удалить товар';
      removeBtn.addEventListener('click', () => {
        cardClone.remove();
        showData();
      });
    });
  });

  function showData() {
    const cardsCart = cartWrapper.querySelectorAll('.card'),
      cardsPrice = cartWrapper.querySelectorAll('.card-price'),
      cardTotal = document.querySelector('.cart-total span');

    countGoods.textContent = cardsCart.length;

    let sum = 0;
    cardsPrice.forEach((cardPrice) => {
      let price = parseFloat(cardPrice.textContent);
      sum += price;    
    });
    cardTotal.textContent = sum;

    if( cardsCart.length !== 0 ) {
      cartEmpty.remove();
      } else {
        cartWrapper.appendChild(cartEmpty);
      }
  }
}

function filter() {
  const cards = document.querySelectorAll('.goods .card'),
  discountCheckbox = document.getElementById('discount-checkbox'),
  min = document.getElementById('min'),
  max = document.getElementById('max'),
  activeLi = document.querySelector('.catalog-list li.active');

  cards.forEach((card) => {   
    const cardPrice = card.querySelector('.card-price'),
      price = parseFloat(cardPrice.textContent);     
      console.log(card.dataset.category);
    if( (min.value && price < min.value) || (max.value && price > max.value) ) {
        card.parentNode.style.display = 'none';
    } else if( discountCheckbox.checked && !card.querySelector('.card-sale') ) {
        card.parentNode.style.display = 'none';
    } else if( activeLi && card.dataset.category !== activeLi.textContent) {
        card.parentNode.style.display = 'none';
    } else {
        card.parentNode.style.display = '';
    }        
  });
}

function getData() {
  const goodsWrapper = document.querySelector('.goods');
  return fetch('./db/db.json')
    .then((response) => {
      if(response.ok) {
         return response.json();
      } else {
        throw new Error ('Данные не были получены, ошибка: ' + response.status);
      }
    })
    .then( (data) => {
      return data;
    })
    .catch((err) => {
      goodsWrapper.innerHTML = '<div style="color:red; font-size: 20px;">Упс что-то пошло не так</div>';
    }); 
}

function renderCards(data) {
  const goodsWrapper = document.querySelector('.goods');
  data.goods.forEach((good) => {
    const card = document.createElement('div');
    card.className = 'col-12 col-md-6 col-lg-4 col-xl-3';
    card.innerHTML = `              
              <div class="card" data-category="${good.category}">
                ${ good.sale ? '<div class="card-sale">🔥Hot Sale🔥</div>' : ''}
                
                <div class="card-img-wrapper">
                  <span class="card-img-top"
                    style="background-image: url('${good.img}')"></span>
                </div>
                <div class="card-body justify-content-between">
                  <div class="card-price">${good.price} ₽</div>
                  <h5 class="card-title">${good.title}</h5>
                  <button class="btn btn-primary">В корзину</button>
                </div>
              </div>
    `; 
    goodsWrapper.appendChild(card);
  });
}

function renderCatalog(){
  const cards = document.querySelectorAll('.goods .card'),
    catalogList = document.querySelector('.catalog-list'),
    catalogWrapper = document.querySelector('.catalog'),
    catalogBtn = document.querySelector('.catalog-button'),
    categories = new Set();

  cards.forEach((card) => {
    categories.add(card.dataset.category);
  });

  categories.forEach((item) => {  
    const li = document.createElement('li');
    li.textContent = item;
    catalogList.appendChild(li);
  });

  const allLi = catalogList.querySelectorAll('LI');

  catalogBtn.addEventListener('click', ()=> {
    if(catalogWrapper.style.display) {
      catalogWrapper.style.display = '';
    } else {
      catalogWrapper.style.display = 'block';
    }
    
    if(event.target.tagName === 'LI') {
      allLi.forEach((elem) => {
        if(elem === event.target) {
          elem.classList.add('active');
        } else {
          elem.classList.remove('active');
        }
      });
      filter();
    }
  });
}

function toggleCart() {
  const btnCart = document.getElementById('cart'),
        modalCart = document.querySelector('.cart'),
        closeBtn = document.querySelector('.cart-close');

  btnCart.addEventListener('click', () => {
      modalCart.style.display = 'flex';
      document.body.style.overflow = 'hidden';
    });
  closeBtn.addEventListener('click', () => {
      modalCart.style.display = 'none';
      document.body.style.overflow = 'scroll';
    });
}

function toggleCheckbox () {
  const checkbox = document.querySelectorAll('.filter-check_checkbox');

  checkbox.forEach( (elem) => {
    elem.addEventListener('change', function(){
      if(this.checked) {
        this.nextElementSibling.classList.add('checked');
        } else {
          this.nextElementSibling.classList.remove('checked');
        }
    }); 
  });
}

getData().then( (data) => {
  renderCards(data); 
  renderCatalog();
  activeActions();
  toggleCheckbox();
  toggleCart();
  addRemoveCart(); 
});

