/** Exercise 01 - Coins **/

// Add your function here
const calculateChange = function calculateChange(amount) {
  if (typeof amount !== 'number' || !Number.isFinite(amount)) {
    return 'Error: enter a valid dollar amount';
  }
  if (amount < 0) {
    return 'Error: the number cannot be negative';
  }
  if (amount > 100) {
    return 'Error: the number is too large';
  }

  let cents = Math.round(amount * 100);
  const coins = [
    { value: 100, singular: 'dollar', plural: 'dollars' },
    { value: 25, singular: 'quarter', plural: 'quarters' },
    { value: 10, singular: 'dime', plural: 'dimes' },
    { value: 5, singular: 'nickel', plural: 'nickels' },
    { value: 1, singular: 'penny', plural: 'pennies' },
  ];
  const result = [];

  coins.forEach(({ value, singular, plural }) => {
    const count = Math.floor(cents / value);
    cents %= value;
    if (count > 0) {
      result.push(`${count} ${count === 1 ? singular : plural}`);
    }
  });

  return result.length > 0 ? result.join(', ') : '0 coins';
};

// Sample test cases
console.log(calculateChange(4.62));
// $4.62 ==> 4 dollars, 2 quarters, 1 dime, 2 pennies
console.log(calculateChange(0.16));
// $0.16 ==> 1 dime, 1 nickel, 1 penny
console.log(calculateChange(150.11));
// $150.11 ==> Error: the number is too large

// Add additional test cases here
console.log(calculateChange(0)); // 0 coins
console.log(calculateChange(0.01)); // 1 penny
console.log(calculateChange(0.05)); // 1 nickel
console.log(calculateChange(0.25)); // 1 quarter
console.log(calculateChange(1)); // 1 dollar
console.log(calculateChange(0.99)); // 3 quarters, 2 dimes, 4 pennies
console.log(calculateChange(4.1)); // 4 dollars, 1 dime
console.log(calculateChange(99.99)); // 99 dollars, 3 quarters, 2 dimes, 4 pennies
console.log(calculateChange(100)); // 100 dollars
console.log(calculateChange(100.01)); // Error: the number is too large
console.log(calculateChange(-1)); // Error: the number cannot be negative
console.log(calculateChange('4.62')); // Error: enter a valid dollar amount
console.log(calculateChange(NaN)); // Error: enter a valid dollar amount
console.log(calculateChange(Infinity)); // Error: enter a valid dollar amount
console.log(calculateChange(1.234)); // 1 dollar, 2 dimes, 3 pennies
