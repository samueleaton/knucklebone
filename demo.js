import knucklebone from './knucklebone'
import finalform from 'finalform';
import each from 'lodash.foreach';

window.finalform = finalform;
window.knucklebone = knucklebone;

each(document.getElementsByTagName('input'), input => {
  input.addEventListener('focus', () => {
    input.classList.remove('error');
  })
});

const form = document.querySelector('#form');
form.addEventListener('submit', evt => {
  evt.preventDefault();
})

const parser = finalform.create(form);

parser.validations({
  path: element => {
    if (element.value.trim().length)
      return true;
    else
      element.classList.add('error');
  }
});

window.parseForm = function() {
  return parser.parse({
    pick: ['path']
  })
}
