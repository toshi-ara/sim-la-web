export default class Timer {
    protected _isRunning: boolean;
    protected _start: number;
    protected _elapsed: number;
    protected _total: number;
    protected _speed: number;

    constructor() {
        this._isRunning = false;
        this._start = 0;
        this._elapsed = 0;
        this._total = 0;
        this._speed = 1;
    }

    get isRunning(): boolean {
        return this._isRunning;
    }

    // get time as minute
    get getMinute(){
        return this.getTime / 60000;
    };

    // get time as msec
    get getTime(): number {
        let t;
        if (this.isRunning) {
            t = this._total + this.getElaplsed();
        } else {
            t = this._total;
        }
        return t;
    }

    // get time as "0:00:00"
    get getTimeStr(): string {
        return this.timeFormat(this.getTime);
    }

    // get as "0:00:00"
    protected timeFormat(t: number) {
        return Math.floor(t / 36e5) + new Date(t).toISOString().slice(13, 19);
    }

    // get elapsed time (from start/restart to Now) * speed
    protected getElaplsed(): number {
        return (Date.now() - this._start) * this._speed;
    }

    //////////////////////////////////
    // push buttons / change speed
    //////////////////////////////////

    // push New Experiment Button
    actionNewExp() {
        if (!this.isRunning) {
            this._elapsed = 0;
            this._total = 0;
        }
    };

    // push Start/Restart/Pause Button
    actionStart() {
        if (!this.isRunning) { // before start / in pause
            this._start = Date.now();
            this._elapsed = 0;
            // this._isRunning = true;   // => running
        } else { // in running
            this._elapsed = this.getElaplsed();
            this._total += this._elapsed;
            // this._isRunning = false;  // => pause
        }
        this._isRunning = !this._isRunning;
    };

    // push Quit Button
    actionQuit() {
        if (!this.isRunning) { // before start / in pause
            this._elapsed = 0;
            this._total = 0;
            this._speed = 1;
        }
    };

    // change Speed
    changeSpeed(speed: number) {
        if (this.isRunning) {
            // add total time and elapsed time (x previous speed)
            this._total += this.getElaplsed();

            // reset start and elapsed time
            this._start = Date.now();
            this._elapsed = 0;
        }

        // set new speed
        this._speed = speed;
    };
}

