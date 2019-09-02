'use strict'

import getData from './modules/getData';
import renderCards from './modules/renderCards';
import renderCatalog from './modules/renderCatalog';
import activeActions from './modules/activeActions';
import toggleCheckbox from './modules/toggleCheckbox';
import toggleCart from './modules/toggleCart';
import addRemoveCart from './modules/addRemoveCart';





getData().then( (data) => {
  renderCards(data); 
  renderCatalog();
  activeActions();
  toggleCheckbox();
  toggleCart();
  addRemoveCart(); 
});

