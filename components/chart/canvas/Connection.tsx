import { useThemeContext } from "../../common/context/themeContext";

export type ModuleConnectionProps = {
  fromID: number;
  toID: number;
  fromX: number;
  fromY: number;
  toX: number;
  toY: number;
  fromColor: string;
  toColor: string;
  parentColor: string;
  isSelected: boolean;
  hasChildrenSelected: boolean;
};

function ModuleConnection({
  fromX,
  fromY,
  toX,
  toY,
  fromColor,
  toColor,
  parentColor,
  isSelected,
  hasChildrenSelected,
}: ModuleConnectionProps) {
  const coordinateList = [`M ${fromX} ${fromY}`];
  const middleX = (fromX + toX) / 2;
  const middleY = (fromY + toY) / 2;
  const spaceFromX = 20;
  const { themeColors } = useThemeContext();
  const { connection_color } = themeColors;

  if (fromX >= toX) {
    coordinateList.push(`L ${fromX + spaceFromX} ${fromY},`);
    coordinateList.push(`L ${fromX + spaceFromX} ${middleY},`);
    coordinateList.push(`L ${fromX - (fromX - toX + 20)} ${middleY},`);
    coordinateList.push(`L ${fromX - (fromX - toX + 20)} ${toY},`);
  } else if (toX - fromX <= 25) {
    coordinateList.push(`L ${fromX + spaceFromX} ${fromY},`);
    coordinateList.push(`L ${fromX + spaceFromX} ${middleY},`);
    coordinateList.push(`L ${fromX - 20} ${middleY},`);
    coordinateList.push(`L ${fromX - 20} ${toY},`);
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
          stroke: connection_color,
          strokeWidth: 1,
          zIndex: 1,
        }}
        key={`${fromX}-${toX}-${fromY}-${toY}-polyline`}
      />
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
          className="connection"
        />
      ) : null}

      {hasChildrenSelected ? (
        <path
          d={coordinateList.join(' ')}
          stroke="black"
          fill="transparent"
          strokeDasharray="5 5"
          strokeLinecap="round"
          strokeLinejoin="bevel"
          style={{
            fill: 'none',
            stroke: parentColor,
            strokeWidth: 3,
            zIndex: 9,
          }}
          key={`${fromX}-${toX}-${fromY}-${toY}-polyline3`}
          className="connection"
        />
      ) : null}
      <circle
        cx={fromX}
        cy={fromY}
        r={4}
        stroke={fromColor}
        strokeWidth="1"
        fill={fromColor}
        key={`${fromX}-${toX}-circle`}
      />
      <polygon
        points={`${toX - 6},${toY - 4} ${toX - 6},${toY + 4} ${toX},${toY} `}
        stroke={toColor}
        fill={toColor}
        key={`${fromX}-${toX}-polygon`}
      />
    </>
  );
}

export default ModuleConnection;