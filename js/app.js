//variables
const budgetUser = prompt("Cual es tu presupuesto Semanal");
const form = document.getElementById("agregar-gasto");
let QuantityBudget;
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
  if (budgetUser == null || budgetUser === "") {
    window.location.reload();
  } else {
    //create obj to budget
    QuantityBudget = new Budge(budgetUser);
    const ui = new Interfase();
    ui.insertBudget(QuantityBudget.budgetUser);
  }
});
form.addEventListener("submit", function (e) {
  e.preventDefault();
  //read data form
  const nameSpending = document.querySelector("#gasto").value;
  const quantitySpending = document.querySelector("#cantidad").value;
  //instance interfases
  const ui = new Interfase();
  //check empty inputs
  if (nameSpending === "" || quantitySpending === "") {
    ui.printMessage("Te hace falta algun campo.", "error");
  } else {
    ui.printMessage("Gasto agregado", "ok");
    ui.addSpending(nameSpending, quantitySpending);
    ui.remainingBudget(quantitySpending);
  }
});
