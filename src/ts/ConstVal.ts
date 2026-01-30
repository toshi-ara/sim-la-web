// parameters of drugs
export const MU0 = [[75, 8], [67, 5], [43, 6], [30, 10]];
export const LOG_SIGMA0 = [[2.2, 0.4], [2.4, 0.4], [2.4, 0.4], [2.5, 0.5]];
export const ADR = 0.7;
export const MU0_adj = 0;


////////////////////////////////////////
// Covariance Matrix for drug parameters
////////////////////////////////////////

// r between mean and logSigma
const r1 = -0.22;  // Pro
const r2 = -0.30;  // Lid
const r3 = -0.01;  // Mep
const r4 = -0.16;  // Bup

// mean among drugs
const m12 = 0.57;  // Pro vs. Lid
const m13 = 0.47;  // Pro vs. Mep
const m14 = 0.50;  // Pro vs. Bup
const m23 = 0.53;  // Lid vs. Mep
const m24 = 0.53;  // Lid vs. Bup
const m34 = 0.42;  // Mep vs. Bup

//  logSigma among drugs
const s12 = 0.42;  // Pro vs. Lid
const s13 = 0.34;  // Pro vs. Mep
const s14 = 0.26;  // Pro vs. Bup
const s23 = 0.41;  // Lid vs. Mep
const s24 = 0.47;  // Lid vs. Bup
const s34 = 0.56;  // Mep vs. Bup

// Covariance Matrix
export const covarianceMatrix = [
    [ 1,   m12, m13, m14, r1,  0,   0,   0   ],
    [ m12, 1,   m23, m24, 0,   r2,  0,   0   ],
    [ m13, m23, 1,   m34, 0,   0,   r3,  0   ],
    [ m14, m24, m34, 1,   0,   0,   0,   r4  ],
    [ r1,  0,   0,   0,   1,   s12, s13, s14 ],
    [ 0,   r2,  0,   0,   s12, 1,   s23, s24 ],
    [ 0,   0,   r3,  0,   s13, s23, 1,   s34 ],
    [ 0,   0,   0,   r4,  s14, s24, s34, 1   ]
];


// image
export const CENTERS = [[272, 122], [342, 122], [412, 122],
                        [272, 178], [342, 178], [412, 178]];
export const Rnormal = 15;

// threshold of probability not to respond
export const ProbThreshold = 0.05;


// Response duration (msec) of animation
export const ACTIVE_DURATION = 300;

