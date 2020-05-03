//variables
let hours, dayLetter;
let budgetUser = 0;
let accumulatedExpense = 0;
let yearInitial = 0;
let monthInitial = 0;
let dayInitial = 0;
let ImagenState = true;
const imgBg = ["./img/header.jpg", "./img/header1.jpg"];
//const form = document.getElementById("agregar-gasto");
const btnAdd = document.getElementById("add");
const btnMode = document.getElementById("switch");
let QuantityBudget;
//dark mode
class DarkMode {
  constructor(body, container, img, card, control, expenditures) {
    this.body = document.querySelector(body);
    this.container = document.querySelector(container);
    this.img = document.querySelector(img);
    this.card = document.querySelector(card).children;
    this.control = document.querySelector(control).children;
    this.expenditure = document.querySelector(expenditures).children;
    this.bg = imgBg;
  }
  toggle() {
    let cards = Array.from(this.card);
    let indicators = Array.from(this.control);
    let expenditures = Array.from(this.expenditure);
    ImagenState = !ImagenState;
    this.body.classList.toggle("bg-dark");
    this.container.classList.toggle("bg-dark");
    this.container.classList.toggle("text-white");
    ImagenState
      ? this.img.setAttribute("src", this.bg[1])
      : this.img.setAttribute("src", this.bg[0]);
    cards.forEach(function (card) {
      card.classList.toggle("bg-dark");
    });
    indicators.forEach(function (indicator) {
      indicator.classList.toggle("bg-dark");
    });
    expenditures.forEach(function (expenditure) {
      expenditure.classList.toggle("bg-secondary");
      expenditure.style.color = "#000";
    });
    this.saveMode();
  }
  saveMode() {
    if (document.body.classList.contains("bg-dark")) {
      localStorage.setItem("dark-mode", "true");
    } else {
      localStorage.setItem("dark-mode", "false");
    }
  }
  InitailMode() {
    let cards = Array.from(this.card);
    let indicators = Array.from(this.control);
    let expenditures = Array.from(this.expenditure);
    if (localStorage.getItem("dark-mode") === "true") {
      btnMode.classList.remove("active");
      ImagenState = true;
      this.img.setAttribute("src", this.bg[1]);
      this.body.classList.add("bg-dark");
      this.container.classList.add("bg-dark");
      this.container.classList.add("text-white");
      cards.forEach(function (card) {
        card.classList.add("bg-dark");
      });
      indicators.forEach(function (indicator) {
        indicator.classList.add("bg-dark");
      });
      expenditures.forEach(function (expenditure) {
        expenditure.classList.add("bg-secondary");
        expenditure.style.color = "#000";
      });
    } else {
      this.img.setAttribute("src", this.bg[0]);
      ImagenState = false;
      btnMode.classList.add("active");
      this.body.classList.remove("bg-dark");
      this.container.classList.remove("bg-dark");
      this.container.classList.remove("text-white");
      cards.forEach(function (card) {
        card.classList.remove("bg-dark");
      });
      indicators.forEach(function (indicator) {
        indicator.classList.remove("bg-dark");
      });
      expenditures.forEach(function (expenditure) {
        expenditure.classList.remove("bg-secondary");
        expenditure.style.color = "#000";
      });
    }
  }
}
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
  //initail
  start() {
    if (!this.movimiento) return;
    this.interval = window.setInterval(this.move, 5000);
  }
  //reset count
  resetContador() {
    if (this.interval) window.clearInterval(this.interval);
    this.start();
  }
  //bind events
  bindEvents() {
    this.slider.querySelectorAll(".controls li").forEach((item) => {
      item.addEventListener("click", this.moveByButton);
    });
  }
  //check
  moveByButton(ev) {
    let index = IndexForSiblings.get(ev.currentTarget);
    this.contador = index;
    this.moveTo(index);
    this.resetContador();
  }
  //if indicator is true
  move() {
    this.contador++;
    if (this.contador > this.itemsCount - 1) this.contador = 0;
    this.moveTo(this.contador);
  }
  //reset
  resetIndicador() {
    this.slider
      .querySelectorAll(".controls li.active")
      .forEach((item) => item.classList.remove("active"));
  }
  //control to move days
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
  //create html controls
  builHtml(Start, End, InitalDaty, day, regulation = 0) {
    for (let i = Start; i < End; i++) {
      let control = document.createElement("li");
      control.innerHTML = `
        <div class="circuleDay">
        <span class="sub"><strong>${InitalDaty + i}</strong></span>
        <span class="sub">${day[i + regulation]}</span>
        </div>
      `;
      if (i == 0) control.classList.add("active");
      this.slider.querySelector(".controls ul").appendChild(control);
    }
  }

  buildControls() {
    let InitalDaty = Number(dayInitial);
    let day = this.getDaysLetter(dayLetter);
    let limitMonth = this.getDaysLimit(monthInitial, yearInitial);
    let dayLess = limitMonth - InitalDaty;
    //check if month finisher
    if (dayLess <= this.itemsCount) {
      //buil 2component
      const buil = this.builHtml(0, dayLess + 1, InitalDaty, day);
      const builm = this.builHtml(
        1,
        this.itemsCount - dayLess,
        0,
        day,
        dayLess
      );
    } else {
      //buil normal controls
      const buil = this.builHtml(0, this.itemsCount, InitalDaty, day);
    }
  }
  //select array days
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
  //select limit day and verify if year have febrary 29 days
  getDaysLimit(month, year) {
    //check if year is bisiesto
    const yearbase = 2020;
    let isBisisto = false;
    let Month = Number(month);
    let limit = 0;
    for (let i = 0; i < 21; i++) {
      let a = yearbase + i * 4;
      if (a === Number(year)) {
        isBisisto = true;
      }
    }
    //check limit month
    if (Month === 4 || Month === 6 || Month === 9 || month === 11) {
      limit = 30;
    } else if (
      Month === 1 ||
      Month === 3 ||
      Month === 5 ||
      month === 7 ||
      Month === 8 ||
      Month === 10 ||
      Month === 12
    ) {
      limit = 31;
    } else if (Month === 2 && isBisisto === true) {
      limit = 29;
    } else {
      limit = 28;
    }

    return limit;
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
class Alert {
  StarAlert() {
    (async () => {
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
    })();
  }
}
//EventListener
document.addEventListener("DOMContentLoaded", function () {
  const year = dayjs().format("YYYY");
  const month = dayjs().format("M");
  const day = dayjs().format("D");
  const dateletter = new Date().getDay();
  hours = dayjs().format("hh:mmA");

  console.log(hours);
  yearInitial = year;
  monthInitial = month;
  dayLetter = dateletter;
  dayInitial = day;
  const mode = new DarkMode(
    "body",
    "#card",
    ".card-img-top",
    "#money ",
    ".controls ul",
    ".Daycontainer"
  );
  new Slider(".slider", false);
  const startAlert = new Alert();
  mode.InitailMode();
  startAlert.StarAlert();
});

btnMode.addEventListener("click", function (e) {
  e.preventDefault();
  const darkmode = new DarkMode(
    "body",
    "#card",
    ".card-img-top",
    "#money ",
    ".controls ul",
    ".Daycontainer"
  );
  darkmode.toggle();
  btnMode.classList.toggle("active");
});

btnAdd.addEventListener("click", function (e) {});

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
