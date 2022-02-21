function createPayment(services = {}) {
  return {
    phone: services.hasOwnProperty('phone') ? services.phone : 0,
    internet: services.hasOwnProperty('internet') ? services.internet : 0,
    total: function() {
      return services.hasOwnProperty('amount') ? services.amount : this.phone + this.internet;
    },
  };
}

function paymentTotal(payments) {
  return payments.reduce((sum, payment)  => sum + payment.total(), 0);
}

let payments = [];
payments.push(createPayment());
payments.push(createPayment({
  internet: 6500,
}));

payments.push(createPayment({
  phone: 2000,
}));

payments.push(createPayment({
  phone: 1000,
  internet: 4500,
}));

payments.push(createPayment({
  amount: 10000,
}));

console.log(paymentTotal(payments));      // => 24000