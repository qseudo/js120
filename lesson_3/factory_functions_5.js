/* eslint-disable max-lines-per-function */
function createInvoice(services = {}) {
  return {
    phone: services.hasOwnProperty('phone') ? services.phone : 3000,
    internet: services.hasOwnProperty('internet') ? services.internet : 5500,

    total: function() {
      return this.phone + this.internet;
    },

    paymentsMade: 0,

    amountDue: function () {
      return this.total() - this.paymentsMade;
    },

    addPayment: function(payment) {
      this.paymentsMade += payment.total();
    },

    addPayments: function(paymentsArr) {
      paymentsArr.forEach(paymentObj => {
        this.paymentsMade += paymentObj.total();
      });
    },
  };
}

function createPayment(services = {}) {
  return {
    phone: services.hasOwnProperty('phone') ? services.phone : 0,
    internet: services.hasOwnProperty('internet') ? services.internet : 0,
    total: function() {
      return services.hasOwnProperty('amount') ? services.amount : this.phone + this.internet;
    },
  };
}

let invoice = createInvoice({
  phone: 1200,
  internet: 4000,
});

let payment1 = createPayment({ amount: 2000 });
let payment2 = createPayment({
  phone: 1000,
  internet: 1200
});

let payment3 = createPayment({ phone: 1000 });

invoice.addPayment(payment1);
invoice.addPayments([payment2, payment3]);
console.log(invoice.amountDue());