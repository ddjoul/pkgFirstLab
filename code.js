const text = document.getElementById('text');

function rgbToHex(RGB) {
  const rgbValues = RGB.match(/\d+/g);
  const [r, g, b] = rgbValues.map(Number);
  const toHex = (c) => {
    const hex = c.toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  };
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

function hexToRgb(hex) {
  hex = hex.replace(/^#/, '');
  if (hex.length === 3) {
    hex = hex.split('').map(char => char + char).join('');
  }
  const r = parseInt(hex.slice(0, 2), 16);
  const g = parseInt(hex.slice(2, 4), 16);
  const b = parseInt(hex.slice(4, 6), 16);

  return `rgb(${r}, ${g}, ${b})`;
}

function rgbToCmyk(RGB){
  const rgbValues = RGB.match(/\d+/g);
  const [r, g, b] = rgbValues.map(Number);
  const k = Math.min(1 - r/255, 1 - g/255, 1 - b/255);
  c = 0;
  m = 0;
  y = 0;
  if(k != 1){
    c = (1 - r/255 - k)/(1-k);
    m = (1 - g/255 - k)/(1-k);
    y = (1 - b/255 - k)/(1-k);
  }
  return [Math.round(100*c), Math.round(100*m), Math.round(100*y), Math.round(100*k)]
}


function cmykToRGB(CMYK){
  const r = 255*(1 - CMYK[0]/100)*(1-CMYK[3]/100);
  const g = 255*(1 - CMYK[1]/100)*(1-CMYK[3]/100);
  const b = 255*(1 - CMYK[2]/100)*(1-CMYK[3]/100);
  return `rgb(${Math.round(r)}, ${Math.round(g)}, ${Math.round(b)})`;
}

function rgbToXyz(RGB){
  const rgbValues = RGB.match(/\d+/g);
  const [r, g, b] = rgbValues.map(Number);
  var array = [r / 255, g /255, b/255];
  array.forEach((value, index) => {
    if(value >= 0.04045){
      array[index] = Math.pow(((value + 0.055) / 1.055), 2.4);
    }
    else array[index] = value / 12.92;
  });
  const x = (array[0] * 0.4124 + array[1] * 0.3576 + array[2] * 0.1805) * 100;
  const y = (array[0] * 0.2126 + array[1] * 0.7152 + array[2] * 0.0722) * 100;
  const z = (array[0] * 0.0193 + array[1] * 0.1192 + array[2] * 0.9505) * 100;
  return [Math.round(x), Math.round(y), Math.round(z)];
}

function xyzToRGB(XYZ){
  const rN = 16203*XYZ[0] / 500000 - 3843*XYZ[1] / 250000 - 2493*XYZ[2] / 500000;
  const gN = -9689*XYZ[0] / 1000000 + 9379*XYZ[1] / 500000 + 83*XYZ[2] / 200000;
  const bN = 557*XYZ[0] / 1000000 - 51*XYZ[1] / 25000 + 1057*XYZ[2] / 100000;
  var array = [rN, gN, bN];
  array.forEach((value, index) => {
    if(value >= 0.0031308){
      array[index] = (1.055 * Math.pow(value, 1/2.4) - 0.055)*255; 
    }
    else array[index] = value * 12.92*255;
    if(value > 255 || value < 0){
      text.style.color = "red";
    }
  });
  return `rgb(${Math.round(Math.max(Math.min(array[0], 255), 0)) 
  }, ${Math.round(Math.max(Math.min(array[1], 255), 0))}, ${Math.round(Math.max(Math.min(array[2], 255), 0))})`;
}
const buttons = document.querySelectorAll('.button');
const colorPicker = document.getElementById('colorpicker');

const rangesRGB = ['rangeInputRED', 'rangeInputGREEN', 'rangeInputBLUE'];
const numberInputsRGB = ['numberInputRED', 'numberInputGREEN', 'numberInputBLUE'];

const rangesCMYK = ['rangeInputCYAN', 'rangeInputMAGENTA', 'rangeInputYELLOW', 'rangeInputKEY'];
const numberInputsCMYK = ['numberInputCYAN', 'numberInputMAGENTA', 'numberInputYELLOW', 'numberInputKEY'];

const rangesXYZ = ['rangeInputX', 'rangeInputY', 'rangeInputZ'];
const numberInputsXYZ = ['numberInputX', 'numberInputY', 'numberInputZ'];

buttons.forEach(button => {
  button.addEventListener('click', () => {
    const selectedColor = button.style.backgroundColor;
    document.body.style.backgroundColor = selectedColor;
    colorPicker.style.backgroundColor = selectedColor;
    colorPicker.value = rgbToHex(selectedColor);
    updateRgbFromColor(selectedColor);
    updateCmykFromColor(selectedColor);
    updateXyzFromColor(selectedColor);
  });
});

colorPicker.addEventListener('input', (event) => {
  text.style.color = "#272424";
  const selectedColor = event.target.value;
  document.body.style.backgroundColor = selectedColor;
  colorPicker.style.backgroundColor = selectedColor;
  updateRgbFromColor(hexToRgb(selectedColor));
  updateCmykFromColor(hexToRgb(selectedColor));
  updateXyzFromColor(hexToRgb(selectedColor));
});

function updateBackgroundColor(type) {
  var rgb = `rgb(${0}, ${0}, ${0})`;
  text.style.color = "#272424";
  if (type == 'RGB'){
    const r = document.getElementById(rangesRGB[0]).value;
    const g = document.getElementById(rangesRGB[1]).value;
    const b = document.getElementById(rangesRGB[2]).value;
    rgb = `rgb(${r}, ${g}, ${b})`;
    updateCmykFromColor(rgb);
    updateXyzFromColor(rgb);
  }
  if(type == "CMYK"){
    const CMYK = [document.getElementById(rangesCMYK[0]).value, document.getElementById(rangesCMYK[1]).value, document.getElementById(rangesCMYK[2]).value
  , document.getElementById(rangesCMYK[3]).value];
    rgb = cmykToRGB(CMYK);
    updateRgbFromColor(rgb);
    updateXyzFromColor(rgb);
  }
  if(type == "XYZ"){
    const XYZ = [document.getElementById(rangesXYZ[0]).value, document.getElementById(rangesXYZ[1]).value, document.getElementById(rangesXYZ[2]).value];
    console.log(XYZ);
    rgb = xyzToRGB(XYZ);
    updateRgbFromColor(rgb);
    updateCmykFromColor(rgb);
  }
  document.body.style.backgroundColor = rgb;
  colorPicker.style.backgroundColor = rgb;
  colorPicker.value = rgbToHex(rgb);
}

function updateRgbFromColor(color) {
  const rgbValues = color.match(/\d+/g);
  if (rgbValues) {
    rgbValues.forEach((value, index) => {
      document.getElementById(rangesRGB[index]).value = value;
      document.getElementById(numberInputsRGB[index]).value = value;
    });
  }
}

function updateCmykFromColor(color) {
  var cmykValues = rgbToCmyk(color);
  if (cmykValues) {
    cmykValues.forEach((value, index) => {
      document.getElementById(rangesCMYK[index]).value = value;
      document.getElementById(numberInputsCMYK[index]).value = value;
    });
  }
}

function updateXyzFromColor(color) {
  var xyzValues = rgbToXyz(color);
      xyzValues.forEach((value, index) => {
      document.getElementById(rangesXYZ[index]).value = value;
      document.getElementById(numberInputsXYZ[index]).value = value;
    });
}

function syncrangesRGB(rangeId, valueId) {
  const rangeInput = document.getElementById(rangeId);
  const numberInput = document.getElementById(valueId);

  rangeInput.addEventListener('input', () => {
    numberInput.value = rangeInput.value;
    updateBackgroundColor('RGB');
  });

  numberInput.addEventListener('input', () => {
    const value = numberInput.value;
    numberInput.value = value;
    rangeInput.value = value;
    updateBackgroundColor('RGB');
  });
}

function syncrangesCMYK(rangeId, valueId) {
  const rangeInput = document.getElementById(rangeId);
  const numberInput = document.getElementById(valueId);

  rangeInput.addEventListener('input', () => {
    numberInput.value = rangeInput.value;
    updateBackgroundColor('CMYK');
  });

  numberInput.addEventListener('input', () => {
    const value = numberInput.value;
    numberInput.value = value;
    rangeInput.value = value;
    updateBackgroundColor('CMYK');
  });
}

function syncrangesXYZ(rangeId, valueId) {
  const rangeInput = document.getElementById(rangeId);
  const numberInput = document.getElementById(valueId);

  rangeInput.addEventListener('input', () => {
    numberInput.value = rangeInput.value;
    updateBackgroundColor('XYZ');
  });

  numberInput.addEventListener('input', () => {
    const value = numberInput.value;
    numberInput.value = value;
    rangeInput.value = value;
    updateBackgroundColor('XYZ');
  });
}

rangesRGB.forEach((rangeId, index) => {
  syncrangesRGB(rangeId, numberInputsRGB[index]);
});

rangesCMYK.forEach((rangeId, index) => {
  syncrangesCMYK(rangeId, numberInputsCMYK[index]);
});

rangesXYZ.forEach((rangeId, index) => {
  syncrangesXYZ(rangeId, numberInputsXYZ[index]);
});