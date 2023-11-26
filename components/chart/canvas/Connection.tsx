const DISTINCEOFSTART = 15;

export type ModuleConnectionProps = {
  fromID: number;
  toID: number;
  fromX: number;
  fromY: number;
  toX: number;
  toY: number;
  fromColor: string;
  toColor: string;
  isSelected: boolean;
};

function ModuleConnection({
  fromX,
  fromY,
  toX,
  toY,
  fromColor,
  toColor,
  isSelected,
}: ModuleConnectionProps) {
  const coordinateList = [`M ${fromX} ${fromY}`];
  const middleX = (fromX + toX) / 2;
  coordinateList.push(`L ${middleX} ${fromY},`);
  coordinateList.push(`L ${middleX} ${toY},`);
  //TODO: Allow to point parent node to child on the left side
  // if (toX - fromY > DISTINCEOFSTART * 2) {
  //   // if from is above to
  //   if (fromX !== toX) {
  //     const middleY = (fromY + toY) / 2;
  //     coordinateList.push(`C ${fromX} ${middleY},`);
  //     coordinateList.push(`${toX} ${middleY},`);
  //   }
  // } else {
  //   if (fromX !== toX) {
  //     const middle2X = (fromX + toX) / 2;
  //     const middle2Y = (fromY + toY) / 2;

  //     const middle1X = (fromX + middle2X) / 2;

  //     const middle3X = (toX + toX + middle2X) / 3;

  //     coordinateList.push(`C ${middle1X} ${fromY + DISTINCEOFSTART * 3},`);
  //     coordinateList.push(`${middle1X} ${fromY + DISTINCEOFSTART},`);
  //     coordinateList.push(`${middle2X} ${middle2Y},`);
  //     coordinateList.push(`S ${middle3X} ${toY - DISTINCEOFSTART * 5},`);
  //   }
  // }
  coordinateList.push(`${toX} ${toY}`);
  return (
    <>
      <path
        d={coordinateList.join(' ')}
        stroke="black"
        fill="transparent"
        strokeDasharray="5 5"
        strokeLinecap="round"
        strokeLinejoin="bevel"
        style={{
          fill: 'none',
          stroke: '#AAA',
          strokeWidth: 1,
          zIndex: 1,
        }}
        key={`${fromY}-${toY}-polyline`}
      />
      ,

      {isSelected ? (
      <path
        d={coordinateList.join(' ')}
        stroke="black"
        fill="transparent"
        strokeDasharray="5 5"
        strokeLinecap="round"
        strokeLinejoin="bevel"
        style={{
          fill: 'none',
          stroke: fromColor,
          strokeWidth: 3,
          zIndex: 9,
        }}
        key={`${fromX}-${toX}-polyline`}
        className={'connection'}
      />
      ) : null}
      ,
      <circle
        cx={fromX}
        cy={fromY}
        r={6}
        stroke={fromColor}
        strokeWidth="1"
        fill={fromColor}
        key={`${fromX}-${toX}-circle`}
      />
      ,
      <polygon
        points={`${toX - 10},${toY - 6} ${toX - 10},${toY + 6} ${toX},${toY} `}
        stroke={toColor}
        fill={toColor}
        key={`${fromX}-${toX}-polygon`}
      />
      ,
    </>
  );
}

export default ModuleConnection;
