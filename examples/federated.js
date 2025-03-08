// Linear Regression model using gradient descent
class LinearRegression {
    constructor(learningRate = 0.01) {
        this.w = Math.random();
        this.b = Math.random();
        this.learningRate = learningRate;
    }

    predict(x) {
        return this.w * x + this.b;
    }

    train(x, y, epochs = 100) {
        const n = x.length;
        for (let epoch = 0; epoch < epochs; epoch++) {
            let dw = 0;
            let db = 0;

            for (let i = 0; i < n; i++) {
                const y_pred = this.predict(x[i]);
                dw += (y_pred - y[i]) * x[i];
                db += (y_pred - y[i]);
            }

            dw /= n;
            db /= n;

            this.w -= this.learningRate * dw;
            this.b -= this.learningRate * db;
        }
    }
}

// Simulate clients
function generateClientData(numPoints, noise=0.1) {
    const x = [];
    const y = [];

    for(let i=0; i<numPoints; i++){
        const xi = Math.random() * 10;
        const yi = 2 * xi + 1 + Math.random() * noise;
        x.push(xi);
        y.push(yi);
    }

    return { x, y };
}

function federatedLearning(numClients, rounds, localEpochs) {
    const globalModel = new LinearRegression(0.01);

    for (let round = 0; round < rounds; round++) {
        let w_sum = 0;
        let b_sum = 0;

        for (let client = 0; client < numClients; client++) {
            const localModel = new LinearRegression(0.01);
            localModel.w = globalModel.w;
            localModel.b = globalModel.b;

            const { x, y } = generateClientData(100);
            localModel.train(x, y, localEpochs);

            w_sum += localModel.w;
            b_sum += localModel.b;
        }

        // Aggregate client models
        globalModel.w = w_sum / numClients;
        globalModel.b = b_sum / numClients;

        console.log(`Round ${round+1}: Global Model => w: ${globalModel.w.toFixed(4)}, b: ${globalModel.b.toFixed(4)}`);
    }

    return globalModel;
}

// Run Federated Learning Simulation
const trainedModel = federatedLearning(numClients=5, rounds=10, localEpochs=50);
console.log(`Final Model => w: ${trainedModel.w.toFixed(4)}, b: ${trainedModel.b.toFixed(4)}`);
