const autoCompleteConfig = {
    name:'movie',
    autoCompleteField :(movie)=>{
        const imgSrc = movie.Poster === 'N/A' ? '' : movie.Poster
        return `<img src="${movie.Poster}" />
        <p>${movie.Title}</p>
        `

    },
    inputValue:(movie)=>{
        return movie.Title 
    },
    
    fetchData :async(searchTerm)=>{
        const response = await axios.get('https://www.omdbapi.com/',{
            params:{
                apikey:'9e7fc232',
                s:searchTerm
            }
            
        })
        if(response.data.Error){
            return [];
        }
    return response.data.Search
    }
    

}

autoComplete({
    ...autoCompleteConfig,
    root: document.querySelector('#left-autocomplete'),
    onItemSelect :(movie)=>{
        document.querySelector('.tutorial').classList.add('is-hidden')
        const movieSide = document.querySelector('#left-summary')
        onMovieSelect(movie,movieSide,'left')
       }, 
})
autoComplete({
    ...autoCompleteConfig,
    root: document.querySelector('#right-autocomplete'), 
    onItemSelect :(movie)=>{
        document.querySelector('.tutorial').classList.add('is-hidden')
        const movieSide = document.querySelector('#right-summary')
        onMovieSelect(movie,movieSide,'right')
       },
})

const movieTemplate = (movieDetail)=>{
    let dollars = ''
    if(movieDetail.BoxOffice){
         dollars = parseInt(movieDetail.BoxOffice.replace(/\D/g,''));

    }
    const MetaScore = parseInt(movieDetail.Metascore);
    const imdbRating = parseFloat(movieDetail.imdbRating);
    const imdbVotes = parseInt(movieDetail.imdbVotes.replace(/\D/g,''));
    
    
const awards = movieDetail.Awards.split(' ')
.reduce((prev,word)=>{
    value = parseInt(word)
    if(isNaN(value)){
        return prev;
    }
    else{
        return  prev + value
    }
},0)

 
return `<article class='media'>
<figure class='media-left'>
    <p class='image'>
        <img src="${movieDetail.Poster}"
    </p>
</figure>
<div class='media-content'>
    <div class='content'>
        <h1>${movieDetail.Title}</h1>
        <h4>${movieDetail.Genre}</h4>
        <p>${movieDetail.Plot}</p>
    </div>
</div>
</article>
<article data-value='${awards}'class='notification is-primary'>
    <p class='title'>${movieDetail.Awards}</p>
    <p class='subtitle'>Awards</p>
</article>
<article data-value='${dollars}' class='notification is-primary'>
    <p class='title'>${movieDetail.BoxOffice}</p>
    <p class='subtitle'>Box Office</p>
</article>
<article data-value='${MetaScore}'class='notification is-primary'>
    <p class='title'>${movieDetail.Metascore}</p>
    <p class='subtitle'>MetaScore</p>
</article>
<article data-value='${imdbRating}'class='notification is-primary'>
    <p class='title'>${movieDetail.imdbRating}</p>
    <p class='subtitle'>IMDB Rating</p>
</article>
<article data-value='${imdbVotes}'class='notification is-primary'>
    <p class='title'>${movieDetail.imdbVotes}</p>
    <p class='subtitle'>IMDB Votes</p>
</article>
`
}


let leftSide;
let rightSide;
    const onMovieSelect = async(movie,movieSide,side)=>{
        
        const response = await axios.get('http://www.omdbapi.com/',{
            params:{
                apikey:'9e7fc232',
                i:movie.imdbID
            }
            
        })
        
         movieSide.innerHTML = movieTemplate(response.data)
         if(side === 'left'){
            leftSide = response.data
        }
        else{
            rightSide = response.data;

        }
        if(leftSide && rightSide){
      
         compareData()
        }
        
    }

    const compareData = ()=>{
        const leftStat = document.querySelectorAll('#left-summary .notification')
        const rightStat = document.querySelectorAll('#right-summary .notification')
        leftStat.forEach((left,index) => {
            leftData = parseInt(left.dataset.value)
            const right = rightStat[index]
            rightData = parseInt(right.dataset.value)
            if(leftData > rightData){
                right.classList.remove('is-primary')
                right.classList.add('is-warning')
            }
            else{
                left.classList.remove('is-primary')
                left.classList.add('is-warning')
            }
        });
        

    }
