import React from 'react'

type Props = {
  width?: number;
  height?: number;
  dontPreserveAspectRatio?: boolean;
}

export default function RectangleCurve({width, height, dontPreserveAspectRatio}: Props) {
  // 964 1405
  return (
    <svg 
      width="100vw" 
      height={height} 
      viewBox="0 0 964 1405"
      preserveAspectRatio={dontPreserveAspectRatio ? "none": ""}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M516.716 273.746C817.589 149.943 876.899 75.3343 964 0V1083.13C732.568 1314.58 224.903 1394.15 0 1405V577.253C89.3425 496.941 310.278 358.69 516.716 273.746Z" fill="url(#paint0_linear_497_157)"/>
      <defs>
      <linearGradient id="paint0_linear_497_157" x1="482" y1="0" x2="482" y2="1405" gradientUnits="userSpaceOnUse">
      <stop stop-color="#A09FE3" stop-opacity="0.81"/>
      <stop offset="0.273148" stop-color="#A09FE3" stop-opacity="0.57"/>
      <stop offset="0.596065" stop-color="#A09FE3"/>
      <stop offset="0.877315" stop-color="#A09FE3" stop-opacity="0.96"/>
      </linearGradient>
      </defs>
    </svg>
  )
}