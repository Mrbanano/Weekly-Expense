//variables
const budgetUser = prompt("Cual es tu presupuesto Semanal");
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
