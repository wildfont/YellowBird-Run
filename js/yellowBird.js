class YellowBird {
  constructor() {
    this.node = document.createElement("img");
    this.node.src = "/img/sprites/maincar/maincharacter.png";
    gameBoxNode.append(this.node);
    this.width = 200;
    this.height = 140;
    this.x = 800;
    this.targetX = 800;
    this.step = 80;
    this.node.style.width = `${this.width}px`;
    this.node.style.height = `${this.height}px`;
    this.node.style.position = "absolute";
    this.baseY = 600;
    this.node.style.left = `${this.x}px`;

    this.lives = 3;
    this.isInvulnerable = false;

    this._loop();
  }

  forward() {
    const maxX = gameBoxNode.offsetWidth - this.width;
    this.targetX = Math.min(this.targetX + this.step, maxX);
  }

  backward() {
    this.targetX = Math.max(this.targetX - this.step, 0);
  }

  hit() {
    if (this.isInvulnerable) return;

    this.lives--;

    if (this.lives === 2) {
      this.node.src = "/img/sprites/maincar/maincharacter.png";
    } else if (this.lives === 1) {
      this.node.src = "/img/sprites/maincar/maincharacter2.png";
    } else if (this.lives <= 0) {
      this.node.src = "/img/sprites/maincar/maincharacter3.png";
      return;
    }

    this.isInvulnerable = true;
    setTimeout(() => {
      this.isInvulnerable = false;
    }, 1500);
  }

  isDead() {
    return this.lives <= 0;
  }

  _loop() {
    this.x += (this.targetX - this.x) * 0.15;
    const idleY = Math.sin(Date.now() * 0.012) * 1;
    this.node.style.left = `${this.x}px`;
    this.node.style.top = `${this.baseY + idleY}px`;
    requestAnimationFrame(() => this._loop());
  }
}