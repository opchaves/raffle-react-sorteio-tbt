import { Form, redirect } from "react-router-dom";
import { useEffect, useState } from "react";
import { Participant, createRaffle, getNewID } from "../data";
import iconDelete from "../assets/delete.svg";

export default function NewRaffle() {
  const [rounds, setRounds] = useState(1);
  const [numParticipants, setNumParticipants] = useState(0);
  const [entryType, setEntryType] = useState("names");
  const [repeatWinner, setRepeatWinner] = useState(false);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [recreateList, setRecreatList] = useState(true);

  useEffect(() => {
    if (numParticipants > 0 && recreateList) {
      const participantKeys = [...Array(numParticipants).keys()];
      const list: Participant[] = participantKeys.map((i) => ({
        id: getNewID(),
        name: entryType === "names" ? "" : `${i + 1}`,
      }));
      setParticipants(list);
    }
  }, [numParticipants, entryType, recreateList]);

  const addParticipant = () => {
    setRecreatList(false);
    setNumParticipants((prev) => prev + 1);
    setParticipants((prev) => [...prev, { id: getNewID(), name: "" }]);
  };

  const updateParticipant = ({
    value,
    index,
  }: {
    value: string;
    index: number;
  }) => {
    const newArray = [...participants];
    const participant = newArray[index];
    participant.name = value;
    setParticipants(newArray);
  };

  const deleteParticipant = (id: string) => {
    const newArray = participants.filter((p) => p.id !== id);
    setRecreatList(false);
    setParticipants(newArray);
    setNumParticipants((prev) => prev - 1);
  };

  return (
    <div className="mt-8">
      <Form method="post">
        <div className="grid grid-cols-1 gap-3">
          <div className="block">
            <label>
              <span className="text-gray-700">Título</span>
              <input
                type="text"
                name="title"
                required
                className="mt-1 block w-full sm:w-80"
              />
            </label>
          </div>
          <div className="block">
            <label>
              <span className="text-gray-700">Quantidade de rodadas</span>
              <input
                type="number"
                name="rounds"
                required
                value={rounds}
                onChange={(e) => setRounds(+e.target.value)}
                className="mt-1 block w-full sm:w-80"
              />
            </label>
          </div>
          <div className="block">
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                name="repeatWinner"
                id="repeatWinner"
                checked={repeatWinner}
                onChange={(e) => setRepeatWinner(e.target.checked)}
              />
              <span className="ml-2 text-gray-700">Repetir vencedor</span>
            </label>
          </div>
          <div className="block">
            <p className="text-gray-700 mb-1">Sortear</p>
            <label className="inline-flex items-center">
              <input
                type="radio"
                name="entryType"
                value="names"
                id="names"
                checked={entryType === "names"}
                onChange={(e) => setEntryType(e.target.value)}
              />
              <span className="ml-2 text-gray-700">Nomes</span>
            </label>
            <label className="inline-flex items-center ml-4">
              <input
                type="radio"
                name="entryType"
                value="numbers"
                id="numbers"
                checked={entryType === "numbers"}
                onChange={(e) => setEntryType(e.target.value)}
              />
              <span className="ml-2 text-gray-700">Números</span>
            </label>
          </div>
          <div className="block">
            <label>
              <span className="text-gray-700">Quantidade de participantes</span>
              <input
                type="number"
                name="numParticipants"
                value={numParticipants}
                onChange={(e) => {
                  setRecreatList(true);
                  setNumParticipants(+e.target.value);
                }}
                className="mt-1 block w-full sm:w-80"
              />
            </label>
          </div>
          {entryType === "numbers" && participants.length > 0 && (
            <div className="grid grid-cols-5 gap-2 mb-4">
              {participants.map((participant) => (
                <div
                  className="bg-gray-400 text-white text-center py-2 text-xl"
                  key={participant.id}
                >
                  {participant.name}
                </div>
              ))}
            </div>
          )}
          {entryType === "names" && participants.length > 0 && (
            <>
              {participants.map((participant, index) => (
                <div className="block" key={participant.id}>
                  <label>
                    <span className="text-gray-700">
                      Participante {index + 1}
                    </span>
                    <div className="flex">
                      <input
                        type="text"
                        id={`participant-${index}`}
                        name="participants[]"
                        required
                        className="mt-1 block w-full sm:w-80"
                        value={participant.name}
                        onChange={(e) =>
                          updateParticipant({ value: e.target.value, index })
                        }
                      />
                      <button
                        className="px-4 mt-1 font-semibold text-sm bg-gray-200 text-white rounded-none shadow-sm sm:w-80"
                        type="button"
                        onClick={() => deleteParticipant(participant.id!)}
                      >
                        <img src={iconDelete} className="w-7" />
                      </button>
                    </div>
                  </label>
                </div>
              ))}

              <div className="block mt-2">
                <button
                  type="button"
                  className="px-4 py-2 font-semibold text-sm bg-gray-700 text-white rounded-none shadow-sm"
                  onClick={() => addParticipant()}
                >
                  Add
                </button>
              </div>
            </>
          )}

          <div className="block py-4">
            <button
              className="px-4 py-2 font-semibold text-sm bg-sky-500 text-white rounded-none shadow-sm sm:w-80"
              type="submit"
            >
              Iniciar sorteio
            </button>
          </div>
        </div>
      </Form>
    </div>
  );
}

export async function action({ request }: { request: Request }) {
  const formData = await request.formData();
  const formParticipants = formData.getAll("participants[]");
  const entryType = formData.get("entryType");
  const numParticipants = +formData.get("numParticipants")!;
  let participants = [];

  if (entryType === "names") {
    participants = formParticipants.map((val) => ({ name: val.toString() }));
  } else {
    participants = [...Array(numParticipants).keys()].map((i) => ({
      name: `${i + 1}`,
    }));
  }

  const input = {
    title: formData.get("title") as string,
    repeatWinner: formData.get("repeatWinner") === "on",
    rounds: Number(formData.get("rounds")),
    participants,
  };

  console.log(">>>>>", input);

  const raffle = await createRaffle(input);

  return redirect(`/sorteio/${raffle.id}`);
}
