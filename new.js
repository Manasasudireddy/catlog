const fs = require('fs');

// Function to decode a value from a given base to a decimal integer
function decodeValue(value, base) {
  return parseInt(value, base);
}

// Function to perform Lagrange interpolation to find the constant term
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

// Function to solve for the constant term of the polynomial from the JSON data
function solvePolynomial(jsonFilePath) {
  // Read and parse the JSON data from the file
  const data = JSON.parse(fs.readFileSync(jsonFilePath, 'utf8'));
  
  const n = data.keys.n;
  const k = data.keys.k;
  let points = [];

  // Extract and decode the roots
  for (let key in data) {
    if (!isNaN(key)) {  // Check if the key is a digit (i.e., it represents a root)
      const x = parseInt(key);
      const base = data[key].base;
      const y = decodeValue(data[key].value, base);
      points.push([x, y]);
    }
  }

  // Ensure there are enough points to perform the interpolation
  if (points.length < k) {
    throw new Error("Not enough roots to reconstruct the polynomial.");
  }

  // Perform Lagrange interpolation using the first 'k' points
  const constantTerm = lagrangeInterpolation(points.slice(0, k));
  return constantTerm;
}

// Sample file path (you need to update this with the actual path to your JSON file)
const jsonFilePath = 'input.json';

// Solve and print the constant term
try {
  const constantTerm = solvePolynomial(jsonFilePath);
  console.log(`The constant term of the polynomial is: ${constantTerm}`);
} catch (error) {
  console.error(error.message);
}
