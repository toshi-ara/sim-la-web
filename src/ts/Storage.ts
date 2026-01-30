// name of local strage
const storageNameLang = "SimLaLang";
const storageNameSpeed = "SimLaSpeed";
const storageNameParam = "SimLaParam";
const storageNameTimer = "SimLaTime";


//////////////////////////////////
// Language
//////////////////////////////////

// save language to localStorage
export function setStorageLang(lang: string): void {
    localStorage.setItem(storageNameLang, lang)
}

// get language in localStorage
// return
//   language as string
//   if not registered, return "en"
export function getStorageLang(): string {
    const lang = localStorage.getItem(storageNameLang);
    return lang ? lang : "en"
}



//////////////////////////////////
// Speed
//////////////////////////////////

// save speed to localStorage
export function setStorageSpeed(speed: string): void {
    localStorage.setItem(storageNameSpeed, speed);
}

// get speed in localStorage
// return
//   speed as string
//   if not registered, return "1"
export function getStorageSpeed(): string {
    const speed = localStorage.getItem(storageNameSpeed);
    return speed ? speed : "1";
}


//////////////////////////////////
// Clear Language, Speed, Parameters
//////////////////////////////////

// delete data in localStorage
export function clearStorage(): void {
    localStorage.removeItem(storageNameLang);
    localStorage.removeItem(storageNameSpeed);
    localStorage.removeItem(storageNameParam);
}



//////////////////////////////////
// Parameter
//////////////////////////////////

// save parameters to localStorage
export function setStorageParam(param: string): void {
    localStorage.setItem(storageNameParam, param);
}

// get data in localStorage
export function getStorageParam(): string {
    const params = localStorage.getItem(storageNameParam);
    return params ? params : "{}";
}



//////////////////////////////////
// Timer
//////////////////////////////////

// set data in localStorage
// input: JSON as string
export function setStorageTimer(data: string): void {
    localStorage.setItem(storageNameTimer, data);
}

// get data in localStorage
// output: JSON as string
export function getStorageTimer(): string {
    const params = localStorage.getItem(storageNameTimer);
    return params ? params : "{}";
}

// delete data in localStorage
export function clearStorageTimer(): void {
    localStorage.removeItem(storageNameTimer);
}

