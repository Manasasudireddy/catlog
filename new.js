const fs = require('fs');

function decodeValue(value, base) {
  return parseInt(value, base);
}

function lagrangeInterpolation(points) {
  const n = points.length;
  let constantTerm = 0;

  for (let i = 0; i < n; i++) {
    let numerator = points[i][1];
    let denominator = 1;

    for (let j = 0; j < n; j++) {
      if (i !== j) {
        numerator *= (-points[j][0]);
        denominator *= (points[i][0] - points[j][0]);
      }
    }

    constantTerm += numerator / denominator;
  }

  return constantTerm;
}

function solvePolynomial(jsonFilePath) {
  const data = JSON.parse(fs.readFileSync(jsonFilePath, 'utf8'));
  
  const n = data.keys.n;
  const k = data.keys.k;
  let points = [];

  for (let key in data) {
    if (!isNaN(key)) {  
      const x = parseInt(key);
      const base = data[key].base;
      const y = decodeValue(data[key].value, base);
      points.push([x, y]);
    }
  }

  if (points.length < k) {
    throw new Error("Not enough roots to reconstruct the polynomial.");
  }

  const constantTerm = lagrangeInterpolation(points.slice(0, k));
  return constantTerm;
}

const jsonFilePath = 'input.json';

try {
  const constantTerm = solvePolynomial(jsonFilePath);
  console.log(`The constant term of the polynomial is: ${constantTerm}`);
} catch (error) {
  console.error(error.message);
}
