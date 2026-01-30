import { describe, expect, test, it } from 'vitest'
import {
    isInCircle,
    getCircleNumber,
    getProbability,
    getProbabilityDrug
} from "../src/ts/SimLocalAnesthesia_func";


const CENTERS = [[200, 100], [300, 100], [400, 100],
                 [200, 200], [300, 200], [400, 200]];
const radius = 20;

const param1 = [50, 10, 0];
const param2 = [50, 10, 0.7];
const param = [[0, 0, 0], param1, param2];

let digits = 6;


describe("Check functions in SimLocalAnesthesia.ts", () => {
    it("Check isInCircle function (in)", () => {
        // center in each circle
        expect(isInCircle([200, 100], CENTERS[0], radius)).toEqual(true);
        expect(isInCircle([300, 100], CENTERS[1], radius)).toEqual(true);
        expect(isInCircle([400, 100], CENTERS[2], radius)).toEqual(true);
        expect(isInCircle([200, 200], CENTERS[3], radius)).toEqual(true);
        expect(isInCircle([300, 200], CENTERS[4], radius)).toEqual(true);
        expect(isInCircle([400, 200], CENTERS[5], radius)).toEqual(true);

        // x - 10
        expect(isInCircle([200 - 10, 100], CENTERS[0], radius)).toEqual(true);
        expect(isInCircle([300 - 10, 100], CENTERS[1], radius)).toEqual(true);
        expect(isInCircle([400 - 10, 100], CENTERS[2], radius)).toEqual(true);
        expect(isInCircle([200 - 10, 200], CENTERS[3], radius)).toEqual(true);
        expect(isInCircle([300 - 10, 200], CENTERS[4], radius)).toEqual(true);
        expect(isInCircle([400 - 10, 200], CENTERS[5], radius)).toEqual(true);

        // x + 10
        expect(isInCircle([200 + 10, 100], CENTERS[0], radius)).toEqual(true);
        expect(isInCircle([300 + 10, 100], CENTERS[1], radius)).toEqual(true);
        expect(isInCircle([400 + 10, 100], CENTERS[2], radius)).toEqual(true);
        expect(isInCircle([200 + 10, 200], CENTERS[3], radius)).toEqual(true);
        expect(isInCircle([300 + 10, 200], CENTERS[4], radius)).toEqual(true);
        expect(isInCircle([400 + 10, 200], CENTERS[5], radius)).toEqual(true);

        // y - 10
        expect(isInCircle([200, 100 - 10], CENTERS[0], radius)).toEqual(true);
        expect(isInCircle([300, 100 - 10], CENTERS[1], radius)).toEqual(true);
        expect(isInCircle([400, 100 - 10], CENTERS[2], radius)).toEqual(true);
        expect(isInCircle([200, 200 - 10], CENTERS[3], radius)).toEqual(true);
        expect(isInCircle([300, 200 - 10], CENTERS[4], radius)).toEqual(true);
        expect(isInCircle([400, 200 - 10], CENTERS[5], radius)).toEqual(true);

        // y + 10
        expect(isInCircle([200, 100 + 10], CENTERS[0], radius)).toEqual(true);
        expect(isInCircle([300, 100 + 10], CENTERS[1], radius)).toEqual(true);
        expect(isInCircle([400, 100 + 10], CENTERS[2], radius)).toEqual(true);
        expect(isInCircle([200, 200 + 10], CENTERS[3], radius)).toEqual(true);
        expect(isInCircle([300, 200 + 10], CENTERS[4], radius)).toEqual(true);
        expect(isInCircle([400, 200 + 10], CENTERS[5], radius)).toEqual(true);

        // x + 10, y + 10
        expect(isInCircle([200 + 10, 100 + 10], CENTERS[0], radius)).toEqual(true);
        expect(isInCircle([300 + 10, 100 + 10], CENTERS[1], radius)).toEqual(true);
        expect(isInCircle([400 + 10, 100 + 10], CENTERS[2], radius)).toEqual(true);
        expect(isInCircle([200 + 10, 200 + 10], CENTERS[3], radius)).toEqual(true);
        expect(isInCircle([300 + 10, 200 + 10], CENTERS[4], radius)).toEqual(true);
        expect(isInCircle([400 + 10, 200 + 10], CENTERS[5], radius)).toEqual(true);
    })

    it("Check isInCircle function (out)", () => {
        // x + 15, y + 15 => r = 21.21...
        expect(isInCircle([200 + 15, 100 + 15], CENTERS[0], radius)).toEqual(false);
        expect(isInCircle([300 + 15, 100 + 15], CENTERS[1], radius)).toEqual(false);
        expect(isInCircle([400 + 15, 100 + 15], CENTERS[2], radius)).toEqual(false);
        expect(isInCircle([200 + 15, 200 + 15], CENTERS[3], radius)).toEqual(false);
        expect(isInCircle([300 + 15, 200 + 15], CENTERS[4], radius)).toEqual(false);
        expect(isInCircle([400 + 15, 200 + 15], CENTERS[5], radius)).toEqual(false);
    })

    it("Check getCircleNumber function", () => {
        // x + 15, y + 15 => r = 21.21...
        expect(getCircleNumber([200 + 15, 100 + 15], CENTERS, radius)).toEqual(-1);

        // x + 10, y + 10
        expect(getCircleNumber([200 + 10, 100 + 10], CENTERS, radius)).toEqual(0);
        expect(getCircleNumber([300 + 10, 100 + 10], CENTERS, radius)).toEqual(1);
        expect(getCircleNumber([400 + 10, 100 + 10], CENTERS, radius)).toEqual(2);
        expect(getCircleNumber([200 + 10, 200 + 10], CENTERS, radius)).toEqual(3);
        expect(getCircleNumber([300 + 10, 200 + 10], CENTERS, radius)).toEqual(4);
        expect(getCircleNumber([400 + 10, 200 + 10], CENTERS, radius)).toEqual(5);
    })

    it("Check getProbability function", () => {
        // without adr
        // phi(-0.7)
        expect(getProbability(43, param1))
            .toBeCloseTo(0.241963652223073, digits);
        // phi(0)
        expect(getProbability(50, param1))
            .toBeCloseTo(0.5, digits);
        // phi(0.5)
        expect(getProbability(55, param1))
            .toBeCloseTo(0.691462461274013, digits);
        // phi(1.5)
        expect(getProbability(65, param1))
            .toBeCloseTo(0.9331927987311419, digits);

        // with adr
        expect(getProbability(120, param2))
            .toBeCloseTo(0.08075665923, digits);
    })

    it("Check getProbabilityDrug function", () => {
        // Saline
        expect(getProbabilityDrug(0, 10, param)).toBeCloseTo(0.99, digits);
        expect(getProbabilityDrug(0, 60, param)).toBeCloseTo(1, digits);

        // without adr
        expect(getProbabilityDrug(1, 20, param))
            .toBeCloseTo(0, digits);
        expect(getProbabilityDrug(1, 43, param))
            .toBeCloseTo(0.241963652223073, digits);
        expect(getProbabilityDrug(1, 50, param))
            .toBeCloseTo(0.5, digits);
        expect(getProbabilityDrug(1, 65, param))
            .toBeCloseTo(0.9331927987311419, digits);

        // with adr
        expect(getProbabilityDrug(2, 120, param))
            .toBeCloseTo(0.08075665923, digits);

    })
});

