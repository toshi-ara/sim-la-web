import { describe, expect, test, it } from 'vitest'
import { phi } from "../src/ts/MyStat";


let digits = 6;

describe("Check Timer class", () => {
    it("Check phi function (6-digits)", () => {
        expect(phi(-0.7)).toBeCloseTo(0.241963652223073, digits);
        expect(phi(0)).toBeCloseTo(0.5, digits);
        expect(phi(0.5)).toBeCloseTo(0.691462461274013, digits);
        expect(phi(1.5)).toBeCloseTo(0.9331927987311419, digits);
    });

    it("Check phi function: upper = true (6-digits)", () => {
        expect(phi(0.7, true)).toBeCloseTo(0.241963652223073, digits);
        expect(phi(0, true)).toBeCloseTo(0.5, digits);
        expect(phi(-0.5, true)).toBeCloseTo(0.691462461274013, digits);
        expect(phi(-1.5, true)).toBeCloseTo(0.9331927987311419, digits);
    });
});

