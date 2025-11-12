import { createBrowserRouter } from "react-router-dom";

import App from "../App";
import SearchPage from "../pages/search/SearchPage";
import TourPage from "../pages/tour/TourPage";

export enum AppRoute {
  Root = "/",
  Tour = "/tour/:priceId",
}

export const router = createBrowserRouter([
  {
    path: AppRoute.Root,
    element: <App />,
    children: [
      {
        index: true,
        element: <SearchPage />,
      },
      {
        path: AppRoute.Tour,
        element: <TourPage />,
      },
    ],
  },
]);
