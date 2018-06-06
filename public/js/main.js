function getInfo() {
    return fetch('/series.json')
    .then(series => {
        return series.json()
    })
    .then(json => {
        $('div.random-show').remove();
        for (i = 0; i < 5; i++) {
            let random = Math.ceil(Math.random() * (json.length - 1))
            let randomShow = json[random]
            $('body').append($(`<div class="random-show" style="background-image: url('${randomShow.image_url}')"><p class="random-show-text">${randomShow.show_name}</p></div> `))
        }
   
    })
}

let infoButton = $('.info');
infoButton.click(getInfo);