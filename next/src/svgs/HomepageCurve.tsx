import React from 'react'

type Props = {
  width: number;
  height: number;
}

export default function HomepageCurve({width, height}: Props) {
  // 604 1658 default
  return (
    // <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} fill="none" xmlns="http://www.w3.org/2000/svg">
    <svg width={width} height={height} viewBox={`0 600 604 ${height}`} fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M17 457.5C155.5 155.5 529.329 68.5207 604 0L604 1658C466 1614.5 58.5789 1491.73 155.5 1339.5C254.5 1184 546.602 1139.6 477.5 1006C440 933.5 -99.5972 711.741 17 457.5Z" fill="url(#paint0_linear_494_154)"/>
      <defs>
      <linearGradient id="paint0_linear_494_154" x1="337.5" y1="0" x2="337.5" y2="1658" gradientUnits="userSpaceOnUse">
      <stop stopColor="#8F8DDB" stopOpacity="0"/>
      <stop offset="1" stopColor="#8F8DDB"/>
      </linearGradient>
      </defs>
    </svg>
  )
}