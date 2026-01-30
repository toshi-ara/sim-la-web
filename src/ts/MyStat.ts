import { Matrix, EigenvalueDecomposition } from 'ml-matrix';
import random from 'random';


//////////////////////////////////
// statistical functions
//////////////////////////////////

const M_SQ_2 = 0.7071067811865475;

// Cumulative distribution function (CDF)
// q -> p
// Abramowitz and Stegun (1964) formula 7.1.26
// precision: abs(err) < 1.5e-7
export function phi(x: number, upper: boolean = false): number {
    const a1 =  0.254829592;
    const a2 = -0.284496736;
    const a3 =  1.421413741;
    const a4 = -1.453152027;
    const a5 =  1.061405429;
    const p  =  0.3275911;

    // AS formula 7.1.26
    const sign = x < 0 ? -1 : 1;
    const xx = Math.abs(x) * M_SQ_2;  // = Math.abs(x) / Math.sqrt(2);
    const t = 1 / (1 + p * xx)
    const erf = 1 - (((((a5 * t + a4) * t) + a3) * t + a2) * t + a1) * t * Math.exp(-xx * xx);

    const signup = upper ? -1 : 1;
    return (1 + signup * sign * erf) * 0.5;
}



// generate random number following multivariate normal distribution
export function multivariateNormal(meanVector: number[],
                                   covarianceMatrix: number[][],
                                   n: number) {
    const N = meanVector.length;

    // calculate Eigen value / Eigen vector
    const eig = new EigenvalueDecomposition(covarianceMatrix);
    const eig_value = eig.realEigenvalues;
    const eig_vector = eig.eigenvectorMatrix;

    // transpose of eigen vector
    const invVectors = eig_vector.transpose();

    // multiple transpose(eigen vector) lambda at each row
    const scaledMatrix = invVectors.clone();
    for (let i = 0; i < N; i++) {
        const scaledRow = invVectors.getRow(i).map(
            element => element * Math.sqrt(Math.max(eig_value[i], 0))
        );
        scaledMatrix.setRow(i, scaledRow);
    }

    const R = eig_vector.mmul(scaledMatrix);

    // matrix (N x n) of random numbers following to normal distribution
    const normalGenerator = random.normal();
    const randoms = Array.from({ length: n * N }, () => normalGenerator());
    const rnd = new Matrix(to2DArray(randoms, N));


    const resultMatrix = rnd.mmul(R);

    // add meanVector at each column
    for (let i = 0; i < N; i++) {
        const scaledColumn = resultMatrix.getColumn(i).map(
            element => element + meanVector[i]
        );
        resultMatrix.setColumn(i, scaledColumn);
    }

    // convert to array
    return resultMatrix.to2DArray();
}


/**
 * convert 1-dim array to 2-dim array
 * @param {number[]} arr - 1-dim array
 * @param {number} size - row size of 2-dim array
 * @returns {number[][]} - 2-dim array
 */
function to2DArray(arr: number[], size: number): number[][] {
    const result = [];
    for (let i = 0; i < arr.length; i += size) {
        result.push(arr.slice(i, i + size));
    }
    return result;
}

