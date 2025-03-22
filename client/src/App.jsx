import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { ErrorBoundary } from "react-error-boundary";
import NavBar from "./components/NavBar";
import Home from "./components/Home";
import VoterRegistration from "./components/VoterRegistration";
import Results from "./components/Results";
import { VotingContextProvider } from "./context/VotingContextProvider";
import Vote from "./components/Vote";
import CandidateRegistration from "./components/CandidateRegistration";
import PageNotFound from "./components/PageNotFound";

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: (
        <VotingContextProvider>
          <NavBar />
          <Home />
        </VotingContextProvider>
      ),
      errorElement: <PageNotFound />,
    },
    {
      path: "/voterRegistration",
      element: (
        <VotingContextProvider>
          <NavBar />
          <VoterRegistration />
        </VotingContextProvider>
      ),
      errorElement: <PageNotFound />,
    },
    {
      path: "/candidateRegistration",
      element: (
        <VotingContextProvider>
          <NavBar />
          <CandidateRegistration />
        </VotingContextProvider>
      ),
      errorElement: <PageNotFound />,
    },
    {
      path: "/vote",
      element: (
        <VotingContextProvider>
          <NavBar />
          <Vote />
        </VotingContextProvider>
      ),
      errorElement: <PageNotFound />,
    },
    {
      path: "/results",
      element: (
        <VotingContextProvider>
          <NavBar />
          <Results />
        </VotingContextProvider>
      ),
      errorElement: <PageNotFound />,
    },
  ]);

  return (
    <ErrorBoundary fallback={<p>404! Something went wrong</p>}>
      <div className="App">
        <RouterProvider router={router} />
      </div>
    </ErrorBoundary>
  );
}

export default App;
