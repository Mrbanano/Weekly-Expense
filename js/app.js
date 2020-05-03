//variables
let budgetUser = 0;
let accumulatedExpense = 0;
let dayLetter;
let yearInitial = 0;
let monthInitial = 0;
let dayInitial = 0;
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
    let InitalDaty = Number(dayInitial);
    let day = this.getDaysLetter(dayLetter);
    let limitMonth = this.getDaysLimit(monthInitial, yearInitial);

    for (let i = 0; i < this.itemsCount; i++) {
      let control = document.createElement("li");
      control.innerHTML = `
        <div class="circuleDay">
        <span class="sub"><strong>${InitalDaty + i}</strong></span>
        <span class="sub">${day[i]}</span>
        </div>
      `;
      if (i == 0) control.classList.add("active");

      this.slider.querySelector(".controls ul").appendChild(control);
    }
  }

  getDaysLetter(dayInitial) {
    let Day = [];
    switch (dayInitial) {
      case 0:
        Day = ["D", "L", "M", "M", "J", "V", "S"];
        break;
      case 1:
        Day = ["L", "M", "M", "J", "V", "S", "D"];
        break;
      case 2:
        Day = ["M", "M", "J", "V", "S", "D", "L"];
        break;
      case 3:
        Day = ["M", "J", "V", "S", "D", "L", "M"];
        break;
      case 4:
        Day = ["J", "V", "S", "D", "L", "M", "M"];
        break;
      case 5:
        Day = ["V", "S", "D", "L", "M", "M", "J"];
        break;
      case 6:
        Day = ["S", "D", "L", "M", "M", "J", "V"];
        break;
    }
    return Day;
  }

  getDaysLimit(month, year) {
    //check if year is bisiesto
    const yearbase = 2020;
    let isBisisto = false;
    for (let i = 0; i < 21; i++) {
      let a = yearbase + i * 4;
      if (a === Number(year)) {
        isBisisto = true;
      }
    }
  }
}

//class budget manage all relaship for logic
class Budge {
  constructor() {
    this.budgetUser = Number(budgetUser);
    this.remaining = Number(budgetUser);
    this.expenditure = Number(accumulatedExpense);
  }
  bundgetRemaining(quantity = 0) {
    this.BundgetExpense(quantity);
    return (this.remaining -= Number(quantity));
  }
  BundgetExpense(expenditure = 0) {
    return (this.accumulatedExpense += expenditure);
  }
}
//class interfase manage all relaship for HTML
class Interfase {
  insertBudget(quantity) {
    const budgetUi = document.querySelector("span#total");
    const remainingUi = document.querySelector("span#restante");
    const accumulatedExpenses = document.querySelector("span#Expense");
    //insertHtml
    quantity = quantity.toFixed(2);
    budgetUi.innerHTML = `$${quantity}`;
    remainingUi.innerHTML = `$${quantity}`;
    accumulatedExpenses.innerHTML = `$${accumulatedExpense}`;
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
  const year = dayjs().format("YYYY");
  const month = dayjs().format("M");
  const day = dayjs().format("D");
  const dateletter = new Date().getDay();
  yearInitial = year;
  monthInitial = month;
  dayLetter = dateletter;
  dayInitial = day;
  new Slider(".slider", false);
  /*(async () => {
    const { value: budgetInitail } = await Swal.fire({
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
    budgetUser = budgetInitail;
    if (budgetUser == null || budgetUser === "") {
      window.location.reload();
    } else {
      QuantityBudget = new Budge(budgetUser);
      console.log(QuantityBudget);
      const ui = new Interfase();
      ui.insertBudget(QuantityBudget.budgetUser);
    }
  })();*/
});

btnMode.addEventListener("click", function (e) {
  e.preventDefault();
  btnMode.classList.toggle("active");
});

btnAdd.addEventListener("click", function (e) {
  (async () => {
    const { value: formValues } = await Swal.fire({
      imageUrl: "./img/outsale.svg",
      imageHeight: 100,
      imageAlt: "Agrega un gasto",
      allowOutsideClick: false,
      allowEscapeKey: false,
      stopKeydownPropagation: false,
      title: "¡Gasto!",
      text: "Agrega un gasto",
      html:
        '<input id="swal-input1" required placeholder="Nombre del gasto" class="swal2-input text-center">' +
        '<input id="swal-input2" required placeholder="Monto Gastado $00.00"class="swal2-input text-center">',
      focusConfirm: false,
      preConfirm: () => {
        return [
          document.getElementById("swal-input1").value,
          document.getElementById("swal-input2").value,
        ];
      },
      function(formValues) {
        const value = Swal.fire(JSON.stringify(formValues));
        console.log(value);
        if (value[0] === "" || value[0] === null) {
          swal.showInputError("Necesitas ponerle Nombre al gasto!");
          return false;
        }
      },
    });
    //read data form
    const nameSpending = formValues[0];
    const quantitySpending = formValues[0];
    //check empty
    if (nameSpending === "" || quantitySpending === "") {
      return false;
      console.log("no hay nada ");
    }
  })();
});

/*form.addEventListener("submit", function (e) {
  e.preventDefault();
  console.log(click);

  //instance interfases
  //const ui = new Interfase();
 //check empty inputs
  //
  //ui.printMessage("Te hace falta algun campo.", "error");
  //} else {
  // ui.printMessage("Gasto agregado", "ok");
  //ui.addSpending(nameSpending, quantitySpending);
  // ui.remainingBudget(quantitySpending);
  //}
});
*/
