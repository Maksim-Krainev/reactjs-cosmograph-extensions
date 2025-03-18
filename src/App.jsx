import GraphVisualization from "./components/GraphVisualization";
import { CosmographProvider } from '@cosmograph/react';

function App() {

  return (
    <>
      <CosmographProvider>
        <GraphVisualization />
      </CosmographProvider>
    </>
  )
}

export default App
