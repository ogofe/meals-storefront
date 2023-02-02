

function normalizeDigits(number) {
    if (typeof number === Number)
      number = number.toString();
    let _num = number.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return _num;
}

module.exports = {
    normalizeDigits
}