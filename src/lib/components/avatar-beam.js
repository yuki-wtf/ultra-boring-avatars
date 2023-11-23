import * as React from 'react';
import { hashCode, getUnit, getBoolean, getRandomColor, getContrast } from '../utilities';

const SIZE = 36;
const PIXEL_SIZE = 1;

function generateData(name, colors) {
  const numFromName = hashCode(name);
  const range = colors && colors.length;
  const wrapperColor = getRandomColor(numFromName, colors, range);
  const preTranslateX = getUnit(numFromName, 10, 1);
  const wrapperTranslateX = preTranslateX < 5 ? preTranslateX + SIZE / 9 : preTranslateX;
  const preTranslateY = getUnit(numFromName, 10, 2);
  const wrapperTranslateY = preTranslateY < 5 ? preTranslateY + SIZE / 9 : preTranslateY;

  const data = {
    wrapperColor: wrapperColor,
    faceColor: getContrast(wrapperColor),
    backgroundColor: getRandomColor(numFromName + 13, colors, range),
    wrapperTranslateX: wrapperTranslateX,
    wrapperTranslateY: wrapperTranslateY,
    wrapperRotate: getUnit(numFromName, 360),
    wrapperScale: 1 + getUnit(numFromName, SIZE / 12) / 10,
    isMouthOpen: getBoolean(numFromName, 2),
    isCircle: getBoolean(numFromName, 1),
    eyeSpread: getUnit(numFromName, 5),
    mouthSpread: getUnit(numFromName, 3),
    faceRotate: getUnit(numFromName, 10, 3),
    faceTranslateX:
      wrapperTranslateX > SIZE / 6 ? wrapperTranslateX / 2 : getUnit(numFromName, 8, 1),
    faceTranslateY:
      wrapperTranslateY > SIZE / 6 ? wrapperTranslateY / 2 : getUnit(numFromName, 7, 2),
  };

  return data;
}
function generatePixelatedEye(x, y, color) {
  let eyeSvg = '';
  for (let row = 0; row < 2; row++) {
    for (let col = 0; col < 3; col++) {
      eyeSvg += `<rect x="${x + col * PIXEL_SIZE}" y="${
        y + row * PIXEL_SIZE
      }" width="${PIXEL_SIZE}" height="${PIXEL_SIZE}" fill="${color}" />`;
    }
  }
  return eyeSvg;
}
function generatePixelatedMouth(x, y, spread, color, isMouthOpen) {
  let mouthSvg = '';
  const mouthWidth = isMouthOpen ? 6 : 10;
  const mouthHeight = isMouthOpen ? 1 : 3;

  for (let row = 0; row < mouthHeight; row++) {
    for (let col = 0; col < mouthWidth; col++) {
      mouthSvg += `<rect x="${x + col * PIXEL_SIZE}" y="${
        y + row * PIXEL_SIZE + spread
      }" width="${PIXEL_SIZE}" height="${PIXEL_SIZE}" fill="${color}" />`;
    }
  }
  return mouthSvg;
}

const AvatarBeam = (props) => {
  const data = generateData(props.name, props.colors);
  const maskID = React.useId();

  return (
    <svg
      viewBox={'0 0 ' + SIZE + ' ' + SIZE}
      fill="none"
      role="img"
      xmlns="http://www.w3.org/2000/svg"
      width={props.size}
      height={props.size}
    >
      {props.title && <title>{props.name}</title>}
      <mask id={maskID} maskUnits="userSpaceOnUse" x={0} y={0} width={SIZE} height={SIZE}>
        <rect width={SIZE} height={SIZE} rx={props.square ? undefined : SIZE * 2} fill="#FFFFFF" />
      </mask>
      <g mask={`url(#${maskID})`}>
        <rect width={SIZE} height={SIZE} fill={data.backgroundColor} />
        <rect
          x="0"
          y="0"
          width={SIZE}
          height={SIZE}
          transform={
            `translate(${data.wrapperTranslateX} ${data.wrapperTranslateY}) ` +
            `rotate(${data.wrapperRotate} ${SIZE / 2} ${SIZE / 2}) ` +
            `scale(${data.wrapperScale})`
          }
          fill={data.wrapperColor}
          rx={data.isCircle ? SIZE : SIZE / 6}
        />
        <g
          transform={
            `translate(${data.faceTranslateX} ${data.faceTranslateY}) ` +
            `rotate(${data.faceRotate} ${SIZE / 2} ${SIZE / 2})`
          }
          dangerouslySetInnerHTML={{
            __html: `
              ${generatePixelatedEye(14 - data.eyeSpread, 14, data.faceColor)}
              ${generatePixelatedEye(20 + data.eyeSpread, 14, data.faceColor)}
              ${generatePixelatedMouth(13, 19, data.mouthSpread, data.faceColor, data.isMouthOpen)}
            `,
          }}
        />
      </g>
    </svg>
  );
};

export default AvatarBeam;
