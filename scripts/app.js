const record = document.getElementById('record');
const shot = document.getElementById('shot');
const hit = document.getElementById('hit');
const sunk = document.getElementById('sunk');
const player = document.getElementById('player');
const enemy = document.getElementById('enemy');
const again = document.getElementById('again');
const header = document.querySelector('.header');

const game = {
  ships: [],
  shipCount: 0,
  optionShip: {
    count: [1, 1, 1, 1, 1],
    size: [5, 4, 3, 3, 2]
  },
  generateShip() {
    for (let i = 0; i < this.optionShip.count.length; i++) {
      for (let j = 0; j < this.optionShip.count[i]; j++) {
        const size = this.optionShip.size[i];
        const ship = this.generateOptionShip(size);
        this.ships.push(ship);
        this.shipCount++;
      }
    }
  },
  generateOptionShip(shipSize) {
    const ship = {
      hit: [],
      location: [],
    };

    const direction = Math.random() < 0.5;
    let x, y;

    if (direction) {
      x = Math.floor(Math.random() * 10);
      y = Math.floor(Math.random() * (10 - shipSize));
    } else {
      x = Math.floor(Math.random() * (10 - shipSize));
      y = Math.floor(Math.random() * 10);
    }

    for (let i = 0; i < shipSize; i++) {
      if (direction) {
          ship.location.push(x + '' + (y + i))
      } else {
          ship.location.push((x + i) + '' + y)
      }
      ship.hit.push('');
    }

    return ship;
  }
};

const play = {
  record: localStorage.getItem('battleshipsScore') || 0,
  shot: 0,
  hit: 0,
  sunk: 0,
  set updateData(data) {
    this[data] += 1;
    this.render();
  },
  render() {
    record.textContent = this['record'];
    shot.textContent = this.shot;
    hit.textContent = this.hit;
    sunk.textContent = this.sunk;
  }
}

const show = {
  hit(elem) {
    this.changeClass(elem, 'hit');
  },
  miss(elem) {
    this.changeClass(elem, 'miss');
  },
  sunk(elem) {
    this.changeClass(elem, 'sunk');

  },
  changeClass(elem, value) {
    elem.className = value;
  }
};

const fire = (event) => {
  const target = event.target;
  if (target.classList.length > 0 ||
    target.tagName !== 'TD' ||
    !game.shipCount) return;
  show.miss(target);
  play.updateData = 'shot';

  for (let i = 0; i < game.ships.length; i++) {
    const ship = game.ships[i];
    const index = ship.location.indexOf(target.id);
    if (index >= 0) {
      show.hit(target);
      play.updateData = 'hit';
      ship.hit[index] = 'x';
      const life = ship.hit.indexOf('');
      if (life < 0) {
        play.updateData = 'sunk';
        for (const id of ship.location) {
          show.sunk(document.getElementById(id));
        }

        game.shipCount -= 1;

        if (!game.shipCount) {
          header.textContent = 'Game Over!';
          header.style.color = 'red';

          if (play.shot < play.record || play.record === 0) {
            localStorage.setItem('battleshipsScore', play.shot);
            play.record = play.shot;
            play.render();
          }

          localStorage.setItem('battleshipsScore', play.shot);
          play.record = play.shot;
          play.render();
        }
      }
    }
  }
};                               


const init = () => {
  enemy.addEventListener('click', fire);
  play.render();
  game.generateShip();

  again.addEventListener('click', () => {
    location.reload();
  });
  record.addEventListener('dblclick', () => {
    localStorage.clear();
    play.record = 0;
    play.render();
  });

  console.log(game.ships);
};

init();