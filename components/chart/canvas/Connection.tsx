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
  const middleY = (fromY + toY) / 2;
  const spaceFromX = 20;
  const returnBackX = 110;

  if (fromX >= toX + 50) {
    coordinateList.push(`L ${fromX + spaceFromX} ${fromY},`);
    coordinateList.push(`L ${fromX + spaceFromX} ${middleY},`);
    coordinateList.push(`L ${fromX - returnBackX} ${middleY},`);
    coordinateList.push(`L ${fromX - returnBackX} ${toY},`);
  } else if (fromX >= toX) {
    coordinateList.push(`L ${fromX + spaceFromX} ${fromY},`);
    coordinateList.push(`L ${fromX + spaceFromX} ${middleY},`);
    coordinateList.push(`L ${fromX - returnBackX / 2} ${middleY},`);
    coordinateList.push(`L ${fromX - returnBackX / 2} ${toY},`);
  } else if (toX - fromX <= 50) {
    coordinateList.push(`L ${fromX + spaceFromX} ${fromY},`);
    coordinateList.push(`L ${fromX + spaceFromX} ${middleY},`);
    coordinateList.push(`L ${fromX - returnBackX / 3} ${middleY},`);
    coordinateList.push(`L ${fromX - returnBackX / 3} ${toY},`);
  } else {
    coordinateList.push(`L ${middleX} ${fromY},`);
    coordinateList.push(`L ${middleX} ${toY},`);
  }

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
        key={`${fromX}-${toX}-${fromY}-${toY}-polyline`}
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
          key={`${fromX}-${toX}-${fromY}-${toY}-polyline2`}
          className={'connection'}
        />
      ) : null}
      ,
      <circle
        cx={fromX}
        cy={fromY}
        r={4}
        stroke={fromColor}
        strokeWidth="1"
        fill={fromColor}
        key={`${fromX}-${toX}-circle`}
      />
      ,
      <polygon
        points={`${toX - 6},${toY - 4} ${toX - 6},${toY + 4} ${toX},${toY} `}
        stroke={toColor}
        fill={toColor}
        key={`${fromX}-${toX}-polygon`}
      />
      ,
    </>
  );
}

export default ModuleConnection;
