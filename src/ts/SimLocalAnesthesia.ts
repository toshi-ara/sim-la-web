import { VERSION } from "./Version";
import * as ConstVal from "./ConstVal";
import { Labels, DrugName } from "./Labels";
import Parameter from "./Parameter";
import TimerStorage from "./TimerStorage";
import {
    getCircleNumber,
    getResponse
} from "./SimLocalAnesthesia_func";

import {
    getStorageSpeed,
    setStorageSpeed,
    getStorageLang,
    setStorageLang,
    clearStorage,
    clearStorageTimer
} from "./Storage"

import {
    Item,
    openDB,
    getAllItems,
    addItem,
    clearDB
} from "./indexedDB"

import ExcelJS from "exceljs";
import { saveAs } from "file-saver";


import back1Png from "/assets/back1.png";
import back2Png from "/assets/back2.png";

type Position = [number, number];


// variables for elements in HTML
let elemVersion: HTMLElement;
let elemNewExp: HTMLInputElement;
let elemStart: HTMLInputElement;
let elemSave: HTMLInputElement;
let elemQuit: HTMLInputElement;
let elemSpeedMsg: HTMLElement;
let elemTimer: HTMLElement;
let elemResponse: HTMLElement;
let elemLang: HTMLFormElement;
let elemSlider: HTMLSelectElement;
let elemImageWrapper: HTMLDivElement;
let elemImageNormal: HTMLImageElement;
let elemImageActive: HTMLImageElement;

let isLocked = false;



//////////////////////////////////////
// Main class
//////////////////////////////////////
export default class SimLocalAnesthesia {
    private lang: string;
    private timer: TimerStorage;
    private param: Parameter;

    constructor() {
        initialize();
        this.showImage();
        this.setCallback();

        // set Timer and Parameters
        this.timer = new TimerStorage();
        this.param = new Parameter();

        // set & restore Parameters
        elemSlider.value = getStorageSpeed();
        this.lang = getStorageLang();
        elemLang["la"].value = this.lang;
        this.setLang();

        // change buttons status (color)
        this.toggleButtonColor();
    }

    async start() {
        await openDB()
        this.displayTimer();
    }

    //////////////////////////////////////////////////////////////////
    // Methods
    //////////////////////////////////////////////////////////////////

    private showImage(): void {
        elemImageNormal.src = back1Png;
        elemImageActive.src = back2Png;

        elemImageNormal.classList.remove("image-hidden");
        elemImageActive.classList.add("image-hidden");

        isLocked = false;
        elemImageWrapper.classList.remove("is-disabled");
        elemImageWrapper.setAttribute("aria-disabled", "false");
    }

    // add EventListener to buttons
    private setCallback() :void {
        elemNewExp.addEventListener("pointerdown", () => this.clickNewExp(), false);
        elemStart.addEventListener("pointerdown", () => this.clickStart(), false);
        elemSave.addEventListener("pointerdown", () => this.clickSave(), false);
        elemQuit.addEventListener("pointerdown", () => this.clickQuit(), false);

        // add EventListener to droplist, slider and image
        elemLang.addEventListener("change", () => this.toggleLang(), false);
        elemSlider.addEventListener("input", () => this.changeSpeed(), false);
        elemImageWrapper.addEventListener("pointerdown",
            (e: PointerEvent) => this.clickImage(e), false);
    }


    //////////////////////////////////
    // main function
    //   pointerdown in image area
    //   get circle number
    //   get and display response
    //////////////////////////////////
    private async clickImage(e: PointerEvent): Promise<void> {
        if (!this.timer.isRunning) { return }
        if (isLocked) { return }

        // running
        // get clicked position and circle number (site)
        const pos = getClickedPosition(e);
        const site = getCircleNumber(pos, ConstVal.CENTERS, ConstVal.Rnormal);

        if (site < 0) { return }  // outside circles
        // get response from drug (site), time and parameters

        const time = this.timer.getMinute;
        const isResponse = getResponse(site, time, this.param.getParameter);

        const result: Item = {
            time: time,
            drug: DrugName[site],
            response: isResponse ? 1 : 0
        };
        await addItem(result);

        // display response
        responseDisplay(isResponse, this.lang, ConstVal.ACTIVE_DURATION);
    }

    //////////////////////////////////
    // select language
    //////////////////////////////////
    private toggleLang(): void {
        this.lang = elemLang["la"].value;
        this.setLang()
        setStorageLang(this.lang)
    }

    // change labels
    private setLang(): void {
        // start/restart/pause button
        // let lab;
        let id: string;
        if (this.timer.isRunning) {
            id = "pause";
        } else {
            if (this.timer.getTime == 0) {
                id = "start";
            } else {
                id = "restart";
            }
        }
        elemStart.textContent = Labels[id][this.lang];
        elemNewExp.textContent = Labels["newexp"][this.lang];
        elemSave.textContent = Labels["save"][this.lang];
        elemQuit.textContent = Labels["quit"][this.lang];
        this.toggleButtonColor();

        // slider
        this.printSpeed(elemSlider.value)
    }

    //////////////////////////////////
    // buttons
    //////////////////////////////////
    // push New Experiment button
    private async clickNewExp(): Promise<void> {
        if (this.timer.isRunning) { return }
        // in pause
        const check = window.confirm(Labels["msg_newexp"][this.lang]);
        if (check) {
            this.timer.actionNewExp();
            this.param.setInitParameter();
            elemSlider.value = "1";
            this.changeSpeed();
            this.setLang()
            setStorageSpeed(elemSlider.value);
            await clearDB();
        }
    }

    // push Start/Restart/Pause button
    private clickStart(): void {
        // When this.param is absent (after clickQuit),
        //  generate new parameters
        this.param = new Parameter();

        this.timer.actionStart();
        this.setLang()
        this.toggleButtonColor();
    }

    // push Save button
    private async clickSave(): Promise<void> {
        if (this.timer.isRunning) { return }

        const result = await getAllItems();
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Sheet1');

        // header
        worksheet.getCell(1, 1).value = "Time";
        worksheet.getCell(1, 2).value = "Drug";
        worksheet.getCell(1, 3).value = "Response";

        // contents
        for (let i: number = 0; i < result.length; i++) {
            worksheet.getCell(i + 2, 1).value = result[i].time;
            worksheet.getCell(i + 2, 1).numFmt = '0.00';
            worksheet.getCell(i + 2, 2).value = result[i].drug;
            worksheet.getCell(i + 2, 3).value = result[i].response;
        }

        // Output
        // generate Blob and download
        const buffer = await workbook.xlsx.writeBuffer();
        const blob = new Blob([buffer], {
            type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        });
        saveAs(blob, `SimLA_${new Date().toISOString().slice(0, 10)}.xlsx`);
    }

    // push Quit button
    private async clickQuit(): Promise<void> {
        if (this.timer.isRunning) { return }
        if (!window.confirm(Labels["msg_quit"][this.lang])) { return }

        window.alert(Labels["msg_close"][this.lang]);
        elemStart.textContent = Labels["start"][this.lang];
        this.timer.actionQuit();
        elemSlider.value = "1";
        this.changeSpeed();
        clearStorage();
        clearStorageTimer();
        await clearDB();
    }

    // change buttons status (color)
    private toggleButtonColor(): void {
        if (this.timer.isRunning) {
            elemStart.style.background = "springgreen";
            elemNewExp.style.color = "gray";
            elemSave.style.color = "gray";
            elemQuit.style.color = "gray";
        } else {
            elemStart.style.background = "cyan";
            elemNewExp.style.color = "black";
            elemSave.style.color = "black";
            elemQuit.style.color = "black";
        }
    }

    //////////////////////////////////
    // change slider (speed)
    //////////////////////////////////
    private changeSpeed(): void {
        let speed: string = elemSlider.value;
        this.printSpeed(speed)
        this.timer.changeSpeed(Number(speed));
        setStorageSpeed(speed);
    }

    private printSpeed(speed: string): void {
        elemSpeedMsg.textContent = speed + Labels["speed"][this.lang];
    }

    //////////////////////////////////
    // display timer
    //////////////////////////////////
    displayTimer(): void {
        elemTimer.textContent = this.timer.getTimeStr;
        requestAnimationFrame(() => { this.displayTimer() });
    }
}



//////////////////////////////////
// Set elements
//////////////////////////////////
function initialize(): void {
    elemVersion = <HTMLElement>document.getElementById("version");

    elemNewExp = <HTMLInputElement>document.getElementById("newexp");
    elemStart = <HTMLInputElement>document.getElementById("start");
    elemSave = <HTMLInputElement>document.getElementById("save");
    elemQuit = <HTMLInputElement>document.getElementById("quit");

    elemSpeedMsg = <HTMLElement>document.getElementById("speed_msg");
    elemTimer = <HTMLElement>document.getElementById("timer");
    elemResponse = <HTMLElement>document.getElementById("response");

    elemLang = <HTMLFormElement>document.getElementById("select-lang");
    elemSlider = <HTMLSelectElement>document.getElementById("slider");

    elemImageWrapper = <HTMLDivElement>document.getElementById("image");
    elemImageNormal = <HTMLImageElement>document.getElementById("image-normal");
    elemImageActive = <HTMLImageElement>document.getElementById("image-active");

    elemVersion.innerText = `Simulator of Local Anesthetics version ${VERSION}`;
    elemTimer.textContent = "0:00:00"
}



//////////////////////////////////
//
// Get position in canvas
//
// Args:
//   canvas: HTMLCanvasElement
//   e: ClickEvent
// Return:
//   [int:x, int:y]: Position
//
//////////////////////////////////
function getClickedPosition(e: PointerEvent): Position {
    const rect = elemImageNormal.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    return [x, y];
}


//////////////////////////////////
//
// Display response
//
// args:
//   context
//   isResponse: boolean
//   site: number (Drug number)
//   lang: string
//   duration: number (msec)
//
//////////////////////////////////
function responseDisplay(isResponse: boolean,
                         lang: string,
                         duration: number): void {
    if (isLocked) { return }

    isLocked = true;
    if (isResponse) {
        // effects with response
        elemImageWrapper.classList.add("is-disabled");
        elemImageWrapper.setAttribute("aria-disabled", "true");

        elemImageNormal.classList.add("image-hidden");
        elemImageActive.classList.remove("image-hidden");

        elemResponse.textContent = Labels["with_response"][lang];
        elemResponse.style.color = "red";
        elemTimer.style.color = "red";

        setTimeout(() => {
            elemImageActive.classList.add("image-hidden");
            elemImageNormal.classList.remove("image-hidden");

            elemImageWrapper.classList.remove("is-disabled");
            elemImageWrapper.setAttribute("aria-disabled", "false");

            elemResponse.textContent = "";
            elemTimer.style.color = "black";
            isLocked = false;
        }, duration);
    } else {
        // effects without response
        elemResponse.textContent = Labels["without_response"][lang];
        elemResponse.style.color = "black";
        setTimeout(() => {
            elemResponse.textContent = "";
            isLocked = false;
        }, duration);
    }
}

