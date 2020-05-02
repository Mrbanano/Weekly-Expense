//variables
//const budgetUser = prompt("Cual es tu presupuesto Semanal");
//const form = document.getElementById("agregar-gasto");
const btnMode = document.getElementById("switch");
const btnAdd = document.getElementById("add");
let QuantityBudget;

//cont elements
class IndexForSiblings {
  static get(el) {
    let children = el.parentNode.children;

    for (let i = 0; i < children.length; i++) {
      let child = children[i];
      if (child == el) return i;
    }
  }
}
//control slider
class Slider {
  constructor(selector, movimiento = true) {
    this.move = this.move.bind(this);
    this.moveByButton = this.moveByButton.bind(this);
    this.slider = document.querySelector(selector);
    this.itemsCount = this.slider.querySelectorAll(".Daycontainer >* ").length;
    this.interval = null;
    this.contador = 0;
    this.movimiento = movimiento;

    this.start();
    this.buildControls();
    this.bindEvents();
  }

  start() {
    if (!this.movimiento) return;
    this.interval = window.setInterval(this.move, 5000);
  }
  resetContador() {
    if (this.interval) window.clearInterval(this.interval);
    this.start();
  }
  bindEvents() {
    this.slider.querySelectorAll(".controls li").forEach((item) => {
      item.addEventListener("click", this.moveByButton);
    });
  }
  moveByButton(ev) {
    let index = IndexForSiblings.get(ev.currentTarget);
    this.contador = index;
    this.moveTo(index);
    this.resetContador();
  }
  move() {
    this.contador++;
    if (this.contador > this.itemsCount - 1) this.contador = 0;
    this.moveTo(this.contador);
  }

  resetIndicador() {
    this.slider
      .querySelectorAll(".controls li.active")
      .forEach((item) => item.classList.remove("active"));
  }
  moveTo(index) {
    const card = -1 * document.querySelector("#dayOne").clientWidth;
    let left = index * card;
    let indicador = index + 1;
    this.resetIndicador();
    this.slider
      .querySelector(".controls li:nth-child(" + indicador + ")")
      .classList.add("active");
    this.slider.querySelector(".Daycontainer").style.left = left + "px";
  }

  buildControls() {
    const Day = ["D", "L", "M", "M", "J", "V", "S"];
    let InitalDay = Day[3];
    let InitalDaty = 5;
    for (let i = 0; i < this.itemsCount; i++) {
      let control = document.createElement("li");

      control.innerHTML = `
        <div class="circuleDay">
        <span class="sub"><strong>${InitalDaty + i}</strong></span>
        <span class="sub">${Day[i]}</span>
        </div>
      `;

      if (i == 0) control.classList.add("active");

      this.slider.querySelector(".controls ul").appendChild(control);
    }
  }
}

//class budget manage all relaship for logic
class Budge {
  constructor() {
    this.budgetUser = Number(budgetUser);
    this.remaining = Number(budgetUser);
  }

  bundgetRemaining(quantity = 0) {
    return (this.remaining -= Number(quantity));
  }
}

//class interfase manage all relaship for HTML
class Interfase {
  insertBudget(quantity) {
    const budgetUi = document.querySelector("span#total");
    const remainingUi = document.querySelector("span#restante");
    //insertHtml
    budgetUi.innerHTML = `${quantity}`;
    remainingUi.innerHTML = `${quantity}`;
  }
  printMessage(message, type) {
    const divMessage = document.createElement("div");
    divMessage.classList.add("text-center", "alert");

    if (type === "error") {
      divMessage.classList.add("alert-danger");
    } else {
      divMessage.classList.add("alert-success");
    }
    divMessage.appendChild(document.createTextNode(message));
    //insetDOM
    document.querySelector(".primario").insertBefore(divMessage, form);
    //timer Out message
    setTimeout(() => {
      document.querySelector(".primario .alert").remove();
      form.reset();
    }, 3000);
  }
  //inset spending in Html
  addSpending(name, quantity) {
    const listSpending = document.querySelector("#gastos ul");
    //create il
    const li = document.createElement("li");
    li.className =
      "list-group-item d-flex justify-content-between align-item-center";
    //insert
    li.innerHTML = `
        ${name}
       <span class="badge badge-pill badge-primary">$${quantity}</span>
    `;
    listSpending.appendChild(li);
  }
  //update remaining
  remainingBudget(quantity) {
    const reimaining = document.querySelector("span#restante");
    //update remaining ub logic
    const reimainingUi = QuantityBudget.bundgetRemaining(quantity);
    //update html
    reimaining.innerHTML = `${reimainingUi}`;

    this.checkBundget();
  }
  //change color remaining
  checkBundget() {
    const bundgetTotal = QuantityBudget.budgetUser;
    const bundgetRemaining = QuantityBudget.remaining;
    const remainingUi = document.querySelector(".restante");
    let quarter = bundgetTotal / 4;
    let half = bundgetTotal / 2;
    //25%
    if (quarter > bundgetRemaining) {
      remainingUi.classList.remove("alert-success", "alert-warning");
      remainingUi.classList.add("alert-danger");
    } else if (half > bundgetRemaining) {
      remainingUi.classList.remove("alert-success");
      remainingUi.classList.add("alert-warning");
    }
  }
}
//EventListener
document.addEventListener("DOMContentLoaded", function () {
  new Slider(".slider", false);

  (async () => {
    const { value: budget } = await Swal.fire({
      imageUrl: "./img/money.svg",
      imageHeight: 100,
      imageAlt: "Administra tus gastos",
      allowOutsideClick: false,
      allowEscapeKey: false,
      stopKeydownPropagation: false,
      title: "¡Bienvenido!",
      text: "Ingresa tu presupuesto para esta semana",
      input: "text",
      inputPlaceholder: " $00.00Mxn",
      inputValue: "",
    });
    console.log(budget);
    if (budget == null || budget === "") {
      window.location.reload();
    } else {
      //create obj to budget
      QuantityBudget = new Budge(budget);
      const ui = new Interfase();
      console.log(QuantityBudget);
      //ui.insertBudget(budgetUser);
    }
  })();
});
btnMode.addEventListener("click", function (e) {
  e.preventDefault();
  btnMode.classList.toggle("active");
});

btnAdd.addEventListener("click", function (e) {
  Swal.fire({});
});
