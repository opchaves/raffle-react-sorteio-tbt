import { useLoaderData } from "react-router-dom";
import { Participant, Raffle, getRaffle } from "../data";
import { Wheel } from "react-custom-roulette";
import { useEffect, useState } from "react";

type LoaderProps = {
  params: Record<string, unknown>;
};

const backgroundColors = [
  "#64748b",
  "#475569",
  "#334155",
  "#1e293b",
  "#0f172a",
];
const textColors = ["#ffffff"];
const outerBorderColor = "#eeeeee";
const outerBorderWidth = 10;
const innerBorderColor = "#ffffff";
const innerBorderWidth = 5;
const innerRadius = 5;
const radiusLineColor = "#ffffff";
const radiusLineWidth = 3;
const fontFamily = "Nunito";
const fontWeight = "bold";
const fontSize = 22;
const fontStyle = "normal";
const textDistance = 75;
const spinDuration = 0.8;

export default function RafflePage() {
  const raffle = useLoaderData() as Raffle;
  const [mustSpin, setMustSpin] = useState(false);
  const [prizeNumber, setPrizeNumber] = useState(-1);
  const [rounds] = useState(raffle.rounds);
  const [currentRound, setCurrentRound] = useState(raffle.currentRound);
  const [participants, setParticipants] = useState(
    getData(raffle.participants),
  );
  const [particantToDelete, setParticipantToDelete] = useState<number>(-1);
  const [winners, setWinners] = useState<Participant[]>([]);

  useEffect(() => {
    if (particantToDelete >= 0) {
      const timer = setTimeout(() => {
        const newParticipants = [...participants];
        newParticipants.splice(particantToDelete, 1);
        setParticipants(newParticipants);
        setPrizeNumber(-1);
        setParticipantToDelete(-1);
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [particantToDelete, participants]);

  const handleSpinClick = () => {
    if (!mustSpin && particantToDelete < 0) {
      const newPrizeNumber = Math.floor(Math.random() * participants.length);
      setPrizeNumber(newPrizeNumber);
      setMustSpin(true);
    }
  };

  const handleOnStopSpinning = () => {
    setMustSpin(false);

    const newWinners = [...winners, { name: participants[prizeNumber].option }];
    setWinners(newWinners);

    setCurrentRound(currentRound + 1);

    // do nothing if it was already the last round
    if (currentRound >= rounds) return;

    if (!raffle.repeatWinner) {
      setParticipantToDelete(prizeNumber);
    }
  };

  return (
    <div className="grid grid-cols-1 mt-8">
      <h1 className="text-gray-700 text-4xl text-center text-bold">
        {raffle.title}
      </h1>
      {currentRound <= rounds && (
        <div className="grid mt-4">
          <span>Número de rodadas: {rounds}</span>
          <span>Rodada atual: {currentRound}</span>
        </div>
      )}
      <div className="mt-6 flex items-center flex-col">
        <Wheel
          mustStartSpinning={mustSpin}
          prizeNumber={prizeNumber}
          data={participants}
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
          startingOptionIndex={0}
          textDistance={textDistance}
          onStopSpinning={handleOnStopSpinning}
        />
        {currentRound <= rounds ? (
          <>
            <button
              type="button"
              className="px-4 py-2 mt-4 font-semibold text-sm bg-gray-700 text-white rounded-none shadow-sm"
              onClick={handleSpinClick}
              disabled={mustSpin}
            >
              Play
            </button>

            {!mustSpin && prizeNumber > -1 && (
              <p className="mt-2">
                <b>Sorteado:</b> {participants[prizeNumber].option}
              </p>
            )}
          </>
        ) : (
          <>
            <h2 className="font-bold mt-4">Selecionados:</h2>
            <p>{winners.map((w, i) => `${i + 1}. ${w.name}`).join(", ")}</p>
          </>
        )}
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
