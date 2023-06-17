const autoComplete = ({root,name, autoCompleteField,inputValue,onItemSelect,fetchData})=>{
root.innerHTML = `
<label><b>Search for ${name}</b></label>
<input class="input"> 
<div class="dropdown">
  <div class="dropdown-menu" id="dropdown-menu">
      <div class="dropdown-content results">
      </div>
  </div>
</div> `
const input = root.querySelector('input');
const dropdown = root.querySelector('.dropdown');
const resultsWrapper  = root.querySelector('.results');
const onInput = async (e)=>{
    
    const items = await fetchData(e.target.value)
    if(!items.length){
        dropdown.classList.remove('is-active');
        return;
    }
    resultsWrapper.innerHTML = '';
    dropdown.classList.add('is-active')
    for(let item of items){
        const options = document.createElement('a')
        options.classList.add('dropdown-item')
        options.innerHTML = autoCompleteField(item)
        options.addEventListener('click',()=>{
            dropdown.classList.remove('is-active')
            input.value = inputValue(item);
            onItemSelect(item)
        })
        resultsWrapper.appendChild(options)
       
    }

    
}
input.addEventListener('input',debounce(onInput,500))
document.addEventListener('click',e=>{
    if(!root.contains(e.target)){
        dropdown.classList.remove('is-active')
    }
})


}