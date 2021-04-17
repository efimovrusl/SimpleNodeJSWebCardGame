class Card {
    delete = () => {}

    constructor(name, str, hp, cost, img) {
        this.name = name;
        this.str = str;
        this.hp = hp;
        this.cost = cost;
        this.img = img;
    }

    render(id) {
        let newSpan = document.createElement('span');
        newSpan.classList.add("card");
        newSpan.innerHTML = `<img src="${this.img}" alt="${this.name}Card" class="cardImgRaw">
                             <img src="assets/img/stats.png" alt="${this.name}Stats" class="cardStatsImg">
                             <div class="cardStats">
                                <span>${this.str}</span>
                                <span>${this.hp}</span>
                                <span>${this.cost}</span>
                             </div>`;
        
        let idItem = document.getElementById(id);
        idItem.appendChild(newSpan);
        this.container = id
        setTimeout(() => {document.getElementById(id).innerHTML = ''}, 200)
        // this.delete = () => {document.getElementById(id).innerHTML = ''}
    }

}