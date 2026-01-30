import { ProbThreshold } from "./ConstVal";
import { phi } from "./MyStat";

type Position = [number, number];


//////////////////////////////////
// various functions
//////////////////////////////////

// Return whether position is present in circle
//
// Args:
//   position: position of mouse click
//   center: position of center of circle
//   radius:
// Return: true/false
export function isInCircle(position: Position,
                           center: number[], radius: number): boolean {
    const l2 = Math.pow(position[0] - center[0], 2) +
               Math.pow(position[1] - center[1], 2);
    return l2 <= Math.pow(radius, 2);
}

// Return the number which circle coordinate is present
//
// Args:
//   centers: 2D-array of coordinates of the center of the circle
//   radius
// Return: circle number
//   (return -1 when coordinate is out of circles)
export function getCircleNumber(position: Position,
                                centers: number[][], radius: number): number {
    let result = -1;
    for (let i = 0; i < centers.length; i++) {
        if (isInCircle(position, centers[i], radius)) {
            result = i
        }
    }
    return result
}

// Return probability to respond from time (min) and parameters
//
// Args:
//   time (min)
//   param[mu, sigma, adr]
// Return: probability (0-1)
export function getProbability(time: number, param: number[]): number {
    let X = 100 - (1 - param[2]) * time;
    return phi((X - param[0]) / param[1], true)
}

// Return probability to respond from drug, time (min) and parameters
//
// Args
//   num: kind of drug (integer)
//   time:  minute
//   param[mu, sigma, adr]
// Return: prob (0-1)
export function getProbabilityDrug(num: number, time: number, param: number[][]): number {
    let prob;
    if (num == 0) {
        // saline
        //   prob is 0.99 before 30 min
        //   prob is 1 after 30 min
        prob = (time < 30) ? 0.99 : 1;
    } else {
        prob = getProbability(time, param[num]);
        // not respond when probability is less than threshold
        if (prob < ProbThreshold) {
            return 0;
        }
    }

    return prob
}

// Return "respond / not respond" with random number
//   from time (min) and parameters
//
// Args
//   num: kind of drug (integer)
//   time:  minute
//   param[mu, sigma, adr]
// Return: true/false
export function getResponse(num: number, time: number, param: number[][]): boolean {
    const prob = getProbabilityDrug(num, time, param);
    return Math.random() <= prob
}

