//variables
const budgetUser = prompt("Cual es tu presupuesto Semanal");
let QuantityBudget;
//class
class Budge {
  constructor() {
    this.budgetUser = Number(budgetUser);
    this.remaining = Number(budgetUser);
  }

  bundgetRemaining(quantity = 0) {
    return (this.remaining -= Number(quantity));
  }
}

//EventListener
document.addEventListener("DOMContentLoaded", function () {
  if (budgetUser == null || budgetUser === "") {
    window.location.reload();
  } else {
    QuantityBudget = new Budge(budgetUser);
  }
});
