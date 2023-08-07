import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Root, { loader as rootLoader } from "./routes/root";
import NewRaffle, { action as newRaffleAction } from "./routes/new";
import RafflePage, { loader as raffleLoader } from "./routes/raffle";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    loader: rootLoader,
    children: [
      {
        path: "new",
        element: <NewRaffle />,
        action: newRaffleAction,
      },
      {
        path: "sorteio/:id",
        element: <RafflePage />,
        loader: raffleLoader,
        errorElement: <h2>Sorteio não encontrado</h2>,
      },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
