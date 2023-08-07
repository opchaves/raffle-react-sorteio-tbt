import { useLoaderData } from "react-router-dom";
import { Participant, Raffle, getRaffle } from "../data";
import { Wheel } from "react-custom-roulette";
import { useState } from "react";

type LoaderProps = {
  params: Record<string, unknown>;
};

const backgroundColors = [
  "#ea580c",
  "#65a30d",
  "#dc2626",
  "#0891b2",
  "#c026d3",
];
const textColors = ["#ffffff"];
const outerBorderColor = "#eeeeee";
const outerBorderWidth = 10;
const innerBorderColor = "#30261a";
const innerBorderWidth = 0;
const innerRadius = 0;
const radiusLineColor = "#eeeeee";
const radiusLineWidth = 8;
const fontFamily = "Nunito";
const fontWeight = "bold";
const fontSize = 24;
const fontStyle = "normal";
const textDistance = 60;
const spinDuration = 1.0;

export default function RafflePage() {
  const raffle = useLoaderData() as Raffle;
  const [mustSpin, setMustSpin] = useState(false);
  const [prizeNumber, setPrizeNumber] = useState(0);

  const handleSpinClick = () => {
    if (!mustSpin) {
      const newPrizeNumber = Math.floor(
        Math.random() * raffle.participants.length
      );
      setPrizeNumber(newPrizeNumber);
      setMustSpin(true);
    }
  };

  return (
    <div className="grid grid-cols-1 gap-6 mt-8">
      <h1 className="text-gray-700 text-4xl text-center">
        Sorteio: <b>{raffle.title}</b>
      </h1>
      <div className="mt-6 flex items-center flex-col">
        <Wheel
          mustStartSpinning={mustSpin}
          prizeNumber={prizeNumber}
          data={getData(raffle.participants)}
          backgroundColors={backgroundColors}
          textColors={textColors}
          fontFamily={fontFamily}
          fontSize={fontSize}
          fontWeight={fontWeight}
          fontStyle={fontStyle}
          outerBorderColor={outerBorderColor}
          outerBorderWidth={outerBorderWidth}
          innerRadius={innerRadius}
          innerBorderColor={innerBorderColor}
          innerBorderWidth={innerBorderWidth}
          radiusLineColor={radiusLineColor}
          radiusLineWidth={radiusLineWidth}
          spinDuration={spinDuration}
          startingOptionIndex={2}
          // perpendicularText
          textDistance={textDistance}
          onStopSpinning={() => {
            setMustSpin(false);
          }}
        />
        <button
          type="button"
          className="px-4 py-2 mt-4 font-semibold text-sm bg-gray-700 text-white rounded-none shadow-sm"
          onClick={handleSpinClick}
        >
          Play
        </button>
      </div>
    </div>
  );
}

export async function loader({ params }: LoaderProps) {
  const raffle = await getRaffle(params.id as string);
  if (!raffle) {
    throw new Response("", { status: 404 });
  }

  return raffle;
}

function getData(participants: Participant[]) {
  return participants.map((p) => ({ option: p.name }));
}
