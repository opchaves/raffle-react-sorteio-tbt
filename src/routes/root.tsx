import { useLoaderData, Link, Outlet } from "react-router-dom";
import { Raffle, getRaffles } from "../data";

// eslint-disable-next-line react-refresh/only-export-components
export async function loader() {
  return getRaffles();
}

export default function Root() {
  const raffles = useLoaderData() as Raffle[];

  return (
    <div className="sm:flex">
      <div className="flex-none sm:w-56 text-center px-8 pt-8">
        <h1 className="font-bold text-2xl">
          <Link to="/">Sorteios TBT</Link>
        </h1>
        <hr className="mt-4" />
        <p className="pt-4 font-bold underline">
          <Link to="new">Novo Sorteio</Link>
        </p>
        <hr className="my-4" />
        <h2 className="font-bold mb-2">Sorteios anteriores</h2>
        <ul>
          {raffles.map((item) => (
            <li key={item.id}>
              <Link to={`/sorteio/${item.id}`}>{item.title}</Link>
            </li>
          ))}
        </ul>
      </div>

      <div className="py-0 px-8 w-full">
        <Outlet />
      </div>
    </div>
  );
}