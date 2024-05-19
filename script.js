function computeLagrange() {
    const pointsInput = document.getElementById('lagrange-points').value;
    const points = parsePoints(pointsInput);
    const lagrangePoly = lagrange(points);
    document.getElementById('lagrange-result').innerText = lagrangePoly;
    plotLagrange(points, lagrangePoly);
}

function computeNewton() {
    const pointsInput = document.getElementById('newton-points').value;
    const points = parsePoints(pointsInput);
    const newtonPoly = newton(points);
    document.getElementById('newton-result').innerText = newtonPoly;
    plotNewton(points, newtonPoly);
}

function computeRegression() {
    const pointsInput = document.getElementById('regression-points').value;
    const points = parsePoints(pointsInput);
    const regressionResult = linearRegression(points);
    plotRegression(points, regressionResult);
}

function parsePoints(input) {
    return input.trim().split('\n').map(line => {
        const [x, y] = line.split(',').map(Number);
        return { x, y };
    });
}

function lagrange(points) {
    const n = points.length;
    let terms = [];
    for (let i = 0; i < n; i++) {
        let term = `${points[i].y}`;
        for (let j = 0; j < n; j++) {
            if (i !== j) {
                term += ` * (x - ${points[j].x}) / (${points[i].x} - ${points[j].x})`;
            }
        }
        terms.push(term);
    }
    return terms.join(' + ');
}

function newton(points) {
    const n = points.length;
    let dividedDifferences = Array.from({ length: n }, () => Array(n).fill(0));
    for (let i = 0; i < n; i++) {
        dividedDifferences[i][0] = points[i].y;
    }
    for (let j = 1; j < n; j++) {
        for (let i = 0; i < n - j; i++) {
            dividedDifferences[i][j] = (dividedDifferences[i + 1][j - 1] - dividedDifferences[i][j - 1]) / (points[i + j].x - points[i].x);
        }
    }
    let result = `${dividedDifferences[0][0]}`;
    let term = '';
    for (let j = 1; j < n; j++) {
        term += `(x - ${points[j - 1].x})`;
        result += ` + ${dividedDifferences[0][j]} * ${term}`;
    }
    return result;
}

function linearRegression(points) {
    const n = points.length;
    let sumX = 0, sumY = 0, sumXY = 0, sumX2 = 0;
    for (let i = 0; i < n; i++) {
        sumX += points[i].x;
        sumY += points[i].y;
        sumXY += points[i].x * points[i].y;
        sumX2 += points[i].x * points[i].x;
    }
    const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
    const intercept = (sumY - slope * sumX) / n;
    return { slope, intercept };
}

function plotLagrange(points, lagrangePoly) {
    const ctx = document.getElementById('lagrange-chart').getContext('2d');
    const minX = Math.min(...points.map(p => p.x)) - 1;
    const maxX = Math.max(...points.map(p => p.x)) + 1;
    const step = (maxX - minX) / 100;
    const labels = [];
    const data = [];
    
    for (let x = minX; x <= maxX; x += step) {
        labels.push(x);
        data.push(eval(lagrangePoly.replace(/x/g, `(${x})`)));
    }

    new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [
                {
                    label: 'Lagrange Polynomial',
                    data: data,
                    borderColor: 'red',
                    fill: false,
                    showLine: true,
                    pointRadius: 0
                },
                {
                    label: 'Data Points',
                    data: points,
                    type: 'scatter',
                    backgroundColor: 'blue'
                }
            ]
        },
        options: {
            scales: {
                x: { type: 'linear', position: 'bottom' },
                y: { type: 'linear', position: 'left' }
            }
        }
    });
}

function plotNewton(points, newtonPoly) {
    const ctx = document.getElementById('newton-chart').getContext('2d');
    const minX = Math.min(...points.map(p => p.x)) - 1;
    const maxX = Math.max(...points.map(p => p.x)) + 1;
    const step = (maxX - minX) / 100;
    const labels = [];
    const data = [];
    
    for (let x = minX; x <= maxX; x += step) {
        labels.push(x);
        data.push(eval(newtonPoly.replace(/x/g, `(${x})`)));
    }

    new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [
                {
                    label: 'Newton Polynomial',
                    data: data,
                    borderColor: 'red',
                    fill: false,
                    showLine: true,
                    pointRadius: 0
                },
                {
                    label: 'Data Points',
                    data: points,
                    type: 'scatter',
                    backgroundColor: 'blue'
                }
            ]
        },
        options: {
            scales: {
                x: { type: 'linear', position: 'bottom' },
                y: { type: 'linear', position: 'left' }
            }
        }
    });
}

function plotRegression(points, regressionResult) {
    const ctx = document.getElementById('regression-chart').getContext('2d');
    const minX = Math.min(...points.map(p => p.x)) - 1;
    const maxX = Math.max(...points.map(p => p.x)) + 1;
    const regressionLine = [
        { x: minX, y: regressionResult.slope * minX + regressionResult.intercept },
        { x: maxX, y: regressionResult.slope * maxX + regressionResult.intercept }
    ];

    new Chart(ctx, {
        type: 'scatter',
        data: {
            datasets: [
                {
                    label: 'Data Points',
                    data: points,
                    backgroundColor: 'blue'
                },
                {
                    label: 'Regression Line',
                    data: regressionLine,
                    type: 'line',
                    borderColor: 'red',
                    fill: false,
                    showLine: true,
                    pointRadius: 0
                }
            ]
        },
        options: {
            scales: {
                x: { type: 'linear', position: 'bottom' },
                y: { type: 'linear', position: 'left' }
            }
        }
    });
}
