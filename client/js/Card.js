class Card {
    // parentEl
    // element
    name
    str
    hp
    cost
    img
    dom_element
    is_transparent
    id

    constructor(dom_element, id = -1, name = "unknown", str = '?', hp = '?', cost = '?', 
        img = "assets/img/cards/secret_card.jpg") {
        this.name = name;
        this.str = str;
        this.hp = hp;
        this.cost = cost;
        this.img = img;
        this.dom_element = dom_element;
        this.is_transparent = (this.name == null)
        this.id = id
        fuck(dom_element)
        this.dom_element.onclick = () => {
            socket.emit('use_card', this.id)
            socket.once('use_result', result => {
                if (result.id == this.id && result.result == true) {
                    this.move()
                    this.hide(300)
                }
            })
        }
    }

    set(card) {
        this.name = card.name
        this.img = card.url
        this.str = card.str
        this.hp = card.hp
        this.cost = card.cost
        if (this.img != card.url) this.show()
    }

    update() {

        if (this.is_transparent) {
            this.hide()
        } else {
            this.show()
        }
    }

    show() {
        if (this.dom_element) this.dom_element.classList.remove("transparent")
    }

    hide(timeout = 0) {
        setTimeout(() => { if (this.dom_element) this.dom_element?.classList.add("transparent") }, timeout)
    }

    move() {
        if (this.dom_element) {
            this.dom_element?.classList.add("active")
            setTimeout(() => { this.dom_element?.classList.remove("active") }, 600)
        }
    }

    // render(id) {
        


        // let newSpan = document.createElement('span');
        // newSpan.classList.add("card");
        // newSpan.innerHTML = `<img src="${this.img}" alt="${this.name}Card" class="cardImgRaw">
        //                      <img src="assets/img/stats.png" alt="${this.name}Stats" class="cardStatsImg">
        //                      <div class="cardStats">
        //                         <span>${this.str}</span>
        //                         <span>${this.hp}</span>
        //                         <span>${this.cost}</span>
        //                      </div>`;
        
        // let idItem = document.getElementById(id);
        // idItem.appendChild(newSpan);



        // this.parentEl = idItem;
        // this.element = newSpan;
        // setTimeout(() => { this.parentEl.removeChild(this.element) }, 499)
    // }

}