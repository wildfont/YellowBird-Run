const gameBoxNode = document.getElementById('game-box');

class YellowBird {
    constructor() {
        this.node = document.createElement("img");
        this.node.src = "/img/sprites/maincar/maincharacter.png";
        gameBoxNode.append(this.node);

        this.x = 650;
        this.y = 500;
        this.width = 400;
        this.height = 280;

        this.node.style.width = `${this.width}px`;
        this.node.style.height = `${this.height}px`;
        this.node.style.position = "absolute";
        this.node.style.top = `${this.y}px`;
        this.node.style.left = `${this.x}px`;

        this.gravitySpeed = 2;
        this.jumpSpeed = 40;
    }
forward() {
    const maxX = gameBoxNode.offsetWidth - this.width; // borde derecho
    if (this.x + this.jumpSpeed <= maxX) {
        this.x += this.jumpSpeed;
    } else {
        this.x = maxX; // lo fija justo en el borde
    }
    this.node.style.left = `${this.x}px`;
}

backward() {
    if (this.x - this.jumpSpeed >= 0) { // borde izquierdo
        this.x -= this.jumpSpeed;
    } else {
        this.x = 0; // lo fija justo en el borde
    }
    this.node.style.left = `${this.x}px`;
}
}