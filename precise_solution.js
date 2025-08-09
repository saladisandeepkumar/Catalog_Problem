const fs = require('fs');

// Function to convert a number from given base to decimal
function decodeValue(base, value) {
    return BigInt(parseInt(value, parseInt(base)));
}
function lagrangeInterpolation(points) {
    let secret = 0n;
    const k = points.length;
    
    for (let i = 0; i < k; i++) {
        let [xi, yi] = points[i];
        let numerator = 1n;
        let denominator = 1n;
        
        for (let j = 0; j < k; j++) {
            if (i !== j) {
                let [xj] = points[j];
                numerator *= -xj;
                denominator *= (xi - xj);
            }
        }
        
        secret += (yi * numerator) / denominator;
    }
    
    return secret;
}

// Main function to solve the problem
function solvePolynomial(inputFile) {
    try {
        // Read and parse JSON input
        const data = JSON.parse(fs.readFileSync(inputFile, 'utf8'));
        
        const { keys } = data;
        const n = keys.n;
        const k = keys.k;
        
        console.log(`Processing: n=${n}, k=${k}`);
        
        // Collect and decode all points
        const points = [];
        for (const key in data) {
            if (key !== 'keys') {
                const x = BigInt(key);
                const y = decodeValue(data[key].base, data[key].value);
                points.push([x, y]);
                console.log(`Decoded point: x=${x}, y=${y} (base ${data[key].base}: ${data[key].value})`);
            }
        }
        
        // Sort points by x value and take first k points
        points.sort((a, b) => Number(a[0] - b[0]));
        const selectedPoints = points.slice(0, k);
        
        console.log(`Using first ${k} points for interpolation`);
        
        // Calculate the secret using Lagrange interpolation
        const secret = lagrangeInterpolation(selectedPoints);
        
        return {
            secret: secret.toString(),
            polynomialDegree: k - 1,
            pointsUsed: k,
            totalPoints: n
        };
        
    } catch (error) {
        console.error('Error:', error.message);
        return null;
    }
}

// Create test files and run tests
function runTests() {
    console.log('=== Running Polynomial Interpolation Tests ===\n');
    
    // Test case 1
    const test1 = {
        "keys": { "n": 4, "k": 3 },
        "1": { "base": "10", "value": "4" },
        "2": { "base": "2", "value": "111" },
        "3": { "base": "10", "value": "12" },
        "6": { "base": "4", "value": "213" }
    };
    
    fs.writeFileSync('testcase1.json', JSON.stringify(test1, null, 2));
    console.log('Test Case 1:');
    const result1 = solvePolynomial('testcase1.json');
    console.log('Result:', result1);
    console.log();
    
    // Test case 2
    const test2 = {
        "keys": { "n": 10, "k": 7 },
        "1": { "base": "6", "value": "13444211440455345511" },
        "2": { "base": "15", "value": "aed7015a346d63" },
        "3": { "base": "15", "value": "6aeeb69631c227c" },
        "4": { "base": "16", "value": "e1b5e05623d881f" },
        "5": { "base": "8", "value": "316034514573652620673" },
        "6": { "base": "3", "value": "2122212201122002221120200210011020220200" },
        "7": { "base": "3", "value": "20120221122211000100210021102001201112121" },
        "8": { "base": "6", "value": "20220554335330240002224253" },
        "9": { "base": "12", "value": "45153788322a1255483" },
        "10": { "base": "7", "value": "1101613130313526312514143" }
    };
    
    fs.writeFileSync('testcase2.json', JSON.stringify(test2, null, 2));
    console.log('Test Case 2:');
    const result2 = solvePolynomial('testcase2.json');
    console.log('Result:', result2);
}

// Run the tests
runTests();

// Export for use as module
module.exports = { solvePolynomial, decodeValue, lagrangeInterpolation };
