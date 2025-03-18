import React, { useRef, useState, useEffect } from 'react';
import { Cosmograph } from '@cosmograph/react';

const initialNodes = [
  { id: '1' },
  { id: '2' },
  { id: '3' },
  { id: '4' },
  { id: '5' },
  { id: '6' },
  { id: '7' },
];

const initialLinks = [
  { source: '1', target: '2' },
  { source: '1', target: '3' },
  { source: '1', target: '4' },
  { source: '1', target: '5' },
  { source: '1', target: '6' },
  { source: '1', target: '7' },
];

export default function GraphVisualization() {
  const [nodeData, setNodeData] = useState(initialNodes);
  const [linkData, setLinkData] = useState(initialLinks);

  const graphRef = useRef(null);
  const simulationPausedRef = useRef(false);

  const clickTimeoutRef = useRef(null);
  const [clickInfo, setClickInfo] = useState('');

  const toggleAnimation = () => {
    if (graphRef.current) {
      if (graphRef.current.isSimulationRunning) {
        graphRef.current.pause();
        simulationPausedRef.current = true;
      } else {
        graphRef.current.restart();
        simulationPausedRef.current = false;
      }
    }
  };

  const addNode = clickedNode => {
    if (!clickedNode) {
      console.error('Clicked node is undefined!');
      return;
    }

    if (!graphRef.current) return;

    // Перевірка наявності координат для кожного вузла
    const currentNodes = nodeData.map(node => ({
      id: node.id,
      x: node.x || 0,
      y: node.y || 0, 
    }));

    console.log('Before adding new node, node positions:', currentNodes);

    // Оновлюємо координати для всіх вузлів
    const updatedNodes = [...currentNodes];

    // Генеруємо новий вузол
    const newNode = {
      id: (updatedNodes.length + 1).toString(), 
      x: clickedNode.x + 20, // координати нового вузла
      y: clickedNode.y + 20,
    };

    updatedNodes.push(newNode);

    // Додаємо новий зв'язок
    const updatedLinks = [
      ...linkData,
      { source: clickedNode.id, target: newNode.id },
    ];

    setNodeData(updatedNodes);
    setLinkData(updatedLinks);

    // Лог перед відправкою в setData
    console.log('Updated node positions before setData:', updatedNodes);

    // Оновлюємо граф з новими даними
    graphRef.current.setData(updatedNodes, updatedLinks, false);

    // Перевірка на правильність оновлених координат
    console.log(
      'Graph updated, current node positions:',
      graphRef.current.getNodePositions()
    );
  };


  const handleNodeClick = (clickedNode, index, nodePosition, event) => {
    if (clickTimeoutRef.current) {
      clearTimeout(clickTimeoutRef.current);
      clickTimeoutRef.current = null;
      setClickInfo(`2 clicks on node ${clickedNode.id}`);
      addNode(clickedNode);
    } else {
      clickTimeoutRef.current = setTimeout(() => {
        setClickInfo(`1 click on node ${clickedNode.id}`);
        clickTimeoutRef.current = null;
      }, 300);
    }
  };


  useEffect(() => {
    console.log(
      'Graph updated, current node positions:',
      nodeData.map(node => ({ id: node.id, x: node.x, y: node.y }))
    );
  }, [nodeData]);

  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative' }}>
      <button
        onClick={toggleAnimation}
        style={{ position: 'absolute', top: '0', left: '0', zIndex: '1000' }}>
        Animation
      </button>
      <div
        style={{
          position: 'absolute',
          top: '50px',
          left: '0',
          zIndex: '1000',
          padding: '8px',
          border: '1px solid black',
        }}>
        {clickInfo}
      </div>
      <Cosmograph
        ref={graphRef}
        nodes={nodeData}
        links={linkData}
        nodeColor={'red'}
        nodeSize={1}
        linkColor='#666666'
        linkWidth={2}
        onClick={handleNodeClick}
        onLabelClick={handleNodeClick}
      />
    </div>
  );
}
