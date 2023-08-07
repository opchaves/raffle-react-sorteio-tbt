import localforage from "localforage";

const KEY = "raffles";

export type Participant = {
  id?: string;
  name: string;
  color?: string; // random selected
};

type RoundWinner = {
  participant: Participant;
  round: number;
};

export type Raffle = {
  id?: string;
  title: string;
  description?: string;
  date: number; // eg. Date.now()
  rounds: number; // default is 1
  repeatWinner: boolean; // default is false
  currentRound: number; // start with 0
  roundWinners: RoundWinner[];
  participants: Participant[];
};

export type NewRaffle = {
  title: string;
  participants: Participant[];
  repeatWinner: boolean;
  rounds: number;
};

export async function getRaffles() {
  const raffles = await localforage.getItem<Raffle[]>(KEY);

  if (!raffles) return [];

  return raffles;
}

export async function createRaffle(input: NewRaffle) {
  const id = getNewID();
  const raffle: Raffle = {
    ...input,
    id,
    date: Date.now(),
    currentRound: 0,
    roundWinners: [],
  };
  await save(raffle);
  return raffle;
}

export async function getRaffle(id: string) {
  const raffles = await localforage.getItem<Raffle[]>(KEY);
  const raffle = raffles?.find((item) => item.id === id);
  return raffle ?? null;
}

export function getNewID() {
  return Math.random().toString(36).substring(2, 12);
}

async function save(input: Raffle) {
  const raffles = await getRaffles();
  raffles.unshift(input);

  return localforage.setItem<Raffle[]>(KEY, raffles);
}
