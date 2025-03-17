import React, { useRef, useState } from 'react';
import { Cosmograph } from '@cosmograph/react';

// Опис вузлів
const nodes = [
  { id: '1', color: '#88C6FF' },
  { id: '2', color: '#FF99D2' },
  { id: '3', color: [227, 17, 108, 1] }, 
  { id: '4', color: '#50E3C2' },
  { id: '5', color: '#F5A623' },
  { id: '6', color: '#7ED321' },
  { id: '7', color: '#BD10E0' },
];

// Опис зв'язків
const links = [
  { source: '1', target: '2' },
  { source: '1', target: '3' },
  { source: '2', target: '3' },
  { source: '3', target: '4' },
  { source: '6', target: '7' },
  { source: '5', target: '4' },
  { source: '3', target: '6' },
  { source: '7', target: '2' },
  { source: '6', target: '2' },
];

export default function GraphVisualization() {
    // Анімація
    const graphRef = useRef(null);
    const simulationPausedRef = useRef(false);

    // Клік
    const clickTimeoutRef = useRef(null);
    const [clickInfo, setClickInfo] = useState('');

    // Як працює анімація
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

    // Обробка кліку та двойного кліку
    const handleNodeClick = (clickedNode, index, nodePosition, event) => {
      if (clickTimeoutRef.current) {
        clearTimeout(clickTimeoutRef.current);
        clickTimeoutRef.current = null;
        setClickInfo(`2 clicks on node ${clickedNode.id}`);
      } else {
        clickTimeoutRef.current = setTimeout(() => {
          setClickInfo(`1 click on node ${clickedNode.id}`);
          clickTimeoutRef.current = null;
        }, 300);
      }
    };

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
          nodes={nodes}
          links={links}
          nodeColor={node => node.color}
          nodeSize={node => node.size}
          linkColor='#666666'
          linkWidth={2}
          onClick={handleNodeClick}
          onLabelClick={handleNodeClick}
        />
      </div>
    );
}
