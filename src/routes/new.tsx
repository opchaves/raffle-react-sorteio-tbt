import { Form, redirect } from "react-router-dom";
import { Participant, createRaffle, getNewID } from "../data";
import { useState } from "react";

const initParticipants: Participant[] = [{ id: getNewID(), name: "" }];

export default function NewRaffle() {
  const [rounds, setRounds] = useState(1);
  const [repeatWinner, setRepeatWinner] = useState(false);
  const [participants, setParticipants] =
    useState<Participant[]>(initParticipants);

  const addParticipant = () => {
    const newParticipant = { id: getNewID(), name: "" };
    const newArray = [...participants, newParticipant];
    setParticipants(newArray);
  };

  const updateParticipant = ({
    id,
    value,
    index,
  }: {
    id: string;
    value: string;
    index: number;
  }) => {
    const newArray = [...participants];
    const participant = newArray[index];
    participant.name = value;
    setParticipants(newArray);
  };

  return (
    <div className="mt-8">
      <Form method="post">
        <div className="grid grid-cols-1 gap-6">
          <div className="block">
            <label>
              <span className="text-gray-700">Título</span>
              <input type="text" name="title" className="mt-1 block w-full sm:w-80" />
            </label>
          </div>
          <div className="block">
            <label>
              <span className="text-gray-700">Quantidade de rodadas</span>
              <input
                type="number"
                name="rounds"
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
          {participants.map((participant, index) => (
            <div className="block" key={participant.id}>
              <label>
                <span className="text-gray-700">Participante {index + 1}</span>
                <input
                  type="text"
                  id={`participant-${index}`}
                  name="participants[]"
                  className="mt-1 block w-full sm:w-80"
                  value={participant.name}
                  onChange={(e) =>
                    updateParticipant({
                      value: e.target.value,
                      id: participant.id,
                      index,
                    })
                  }
                />
              </label>
            </div>
          ))}
          <div className="block -mt-4">
            <button
              type="button"
              className="px-4 py-2 font-semibold text-sm bg-gray-700 text-white rounded-none shadow-sm"
              onClick={addParticipant}
            >
              Add
            </button>
          </div>

          <div className="block pt-8">
            <button
              className="px-4 py-2 font-semibold text-sm bg-sky-500 text-white rounded-none shadow-sm sm:w-80"
              type="submit"
            >
              Salvar
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
  const participants = formParticipants.map((name) => ({ name }));

  const raffle = await createRaffle({
    title: formData.get("title") as string,
    repeatWinner: formData.get("repeatWinner") === "true",
    rounds: Number(formData.get("rounds")),
    participants,
  });

  return redirect(`/sorteio/${raffle.id}`);
}
