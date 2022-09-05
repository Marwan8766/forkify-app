import view from './View';
import icons from 'url:../../img/icons.svg';

class AddIngredient extends view {
  // _parentElement = document.querySelector('.ingredients');
  _parentElement = document.querySelector('.upload');
  _newIngredient = document.querySelector('.new-ingredient');
  _btnAdd = document.querySelector('.add-new-ing');
  _counter = 2;

  addHandlerNewIng = function () {
    this._btnAdd.addEventListener(
      'click',
      this._generateMarkupIngCallBack.bind(this)
    );
    // handler(this._counter);
  };
  _generateMarkupIngCallBack() {
    const markup = this._generateMarkupIng();
    this._newIngredient.insertAdjacentHTML('beforeend', markup);
    this._counter++;
    // const dataArr = [...new FormData(this)];
    // console.log(dataArr);
    // const data = Object.fromEntries(dataArr);
    // console.log(data);
  }
  _generateMarkupIng() {
    return `
    <label>Ingredient_${this._counter}</label>
    <div class="ingredient" style="display: flex; flex-direction: row">
      <input
        style="width: 100px; margin: 15px; margin-left: 26px"
        value="0.5"
        type="number"
         min="0";
         step="1";
        required
        name="Ingredient-Quantity_${this._counter}"
        placeholder="Format: 'Quantity'"
      />
      <input
        style="width: 100px; margin: 15px"
        value="kg"
        type="text"
        required
        name="Ingredient-Unit_${this._counter}""
        placeholder="Format: 'Unit'"
      />
      <input
        style="width: 100px; margin: 15px"
        value="Rice"
        type="text"
        required
        name="Ingredient-Description_${this._counter}""
        placeholder="Format: 'Description'"
      />
    </div>
    `;
  }
}

export default new AddIngredient();
