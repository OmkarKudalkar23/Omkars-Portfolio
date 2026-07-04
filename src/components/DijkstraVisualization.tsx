import React, { useEffect, useRef, useState, useCallback } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { gsap } from 'gsap';

// --- Types ---
type Category = 'source' | 'languages' | 'frontend' | 'backend' | 'ai' | 'tools' | 'goal';

interface NodeData {
  id: string;
  label: string;
  category: Category;
  lat: number;
  lng: number;
  usageWeight: number;
}

interface EdgeData {
  source: string;
  target: string;
  weight: number;
}

interface PathResult {
  coordinates: [number, number][]; // [lng, lat]
  distance: number;
  duration: number;
}

// --- Data ---
const skillNodes: NodeData[] = [
  // SOURCE — MG Road area
  { id: "you", label: "Omkar", category: "source", lat: 12.9756, lng: 77.6097, usageWeight: 10 },
  // LANGUAGES cluster — Indiranagar
  { id: "python", label: "Python", category: "languages", lat: 12.9784, lng: 77.6408, usageWeight: 9 },
  { id: "javascript", label: "JavaScript", category: "languages", lat: 12.9812, lng: 77.6389, usageWeight: 8 },
  { id: "cpp", label: "C++", category: "languages", lat: 12.9798, lng: 77.6431, usageWeight: 5 },
  { id: "java", label: "Java", category: "languages", lat: 12.9823, lng: 77.6367, usageWeight: 4 },
  // FRONTEND cluster — Koramangala
  { id: "react", label: "React.js", category: "frontend", lat: 12.9352, lng: 77.6245, usageWeight: 9 },
  { id: "nextjs", label: "Next.js", category: "frontend", lat: 12.9334, lng: 77.6268, usageWeight: 8 },
  { id: "threejs", label: "Three.js", category: "frontend", lat: 12.9318, lng: 77.6289, usageWeight: 7 },
  { id: "framer", label: "Framer Motion", category: "frontend", lat: 12.9367, lng: 77.6223, usageWeight: 7 },
  { id: "tailwind", label: "Tailwind CSS", category: "frontend", lat: 12.9383, lng: 77.6201, usageWeight: 8 },
  // BACKEND cluster — HSR Layout
  { id: "nodejs", label: "Node.js", category: "backend", lat: 12.9116, lng: 77.6389, usageWeight: 8 },
  { id: "express", label: "Express.js", category: "backend", lat: 12.9098, lng: 77.6412, usageWeight: 7 },
  { id: "mongodb", label: "MongoDB", category: "backend", lat: 12.9132, lng: 77.6367, usageWeight: 7 },
  { id: "neo4j", label: "Neo4j", category: "backend", lat: 12.9084, lng: 77.6434, usageWeight: 8 },
  { id: "restapi", label: "REST APIs", category: "backend", lat: 12.9148, lng: 77.6345, usageWeight: 7 },
  // AI cluster — Jayanagar
  { id: "langchain", label: "LangChain", category: "ai", lat: 12.9252, lng: 77.5934, usageWeight: 8 },
  { id: "langgraph", label: "LangGraph", category: "ai", lat: 12.9234, lng: 77.5956, usageWeight: 8 },
  { id: "mediapipe", label: "MediaPipe", category: "ai", lat: 12.9268, lng: 77.5912, usageWeight: 6 },
  { id: "opencv", label: "OpenCV", category: "ai", lat: 12.9218, lng: 77.5978, usageWeight: 6 },
  { id: "lstm", label: "LSTM", category: "ai", lat: 12.9284, lng: 77.5890, usageWeight: 5 },
  { id: "whisper", label: "Whisper", category: "ai", lat: 12.9201, lng: 77.6000, usageWeight: 5 },
  // TOOLS cluster — Whitefield
  { id: "git", label: "Git", category: "tools", lat: 12.9698, lng: 77.7499, usageWeight: 9 },
  { id: "github", label: "GitHub", category: "tools", lat: 12.9712, lng: 77.7523, usageWeight: 9 },
  { id: "vercel", label: "Vercel", category: "tools", lat: 12.9684, lng: 77.7478, usageWeight: 7 },
  { id: "n8n", label: "n8n", category: "tools", lat: 12.9726, lng: 77.7545, usageWeight: 6 },
  { id: "cicd", label: "CI/CD", category: "tools", lat: 12.9670, lng: 77.7456, usageWeight: 6 },
  // DESTINATION
  { id: "goal", label: "Next Role", category: "goal", lat: 12.9507, lng: 77.5848, usageWeight: 10 },
];

const skillEdges: EdgeData[] = [
  // You -> core skills
  { source: "you", target: "javascript", weight: 1 },
  { source: "you", target: "python", weight: 1 },
  { source: "you", target: "cpp", weight: 1 },
  { source: "you", target: "git", weight: 2 },
  
  // Langs -> frontend
  { source: "javascript", target: "react", weight: 1 },
  { source: "javascript", target: "nodejs", weight: 1 },
  { source: "react", target: "nextjs", weight: 1 },
  { source: "react", target: "framer", weight: 2 },
  { source: "react", target: "tailwind", weight: 1 },
  { source: "javascript", target: "threejs", weight: 3 },
  
  // Langs -> backend
  { source: "python", target: "nodejs", weight: 3 },
  { source: "nodejs", target: "express", weight: 1 },
  { source: "express", target: "restapi", weight: 1 },
  { source: "express", target: "mongodb", weight: 1 },
  { source: "python", target: "neo4j", weight: 2 },
  { source: "nodejs", target: "neo4j", weight: 2 },
  
  // Langs/Backend -> AI
  { source: "python", target: "langchain", weight: 1 },
  { source: "langchain", target: "langgraph", weight: 1 },
  { source: "python", target: "opencv", weight: 1 },
  { source: "opencv", target: "mediapipe", weight: 1 },
  { source: "python", target: "lstm", weight: 2 },
  { source: "python", target: "whisper", weight: 2 },
  
  // Tools interconnections
  { source: "git", target: "github", weight: 1 },
  { source: "github", target: "vercel", weight: 1 },
  { source: "github", target: "cicd", weight: 1 },
  { source: "github", target: "n8n", weight: 2 },
  
  // Towards Goal
  { source: "nextjs", target: "goal", weight: 2 },
  { source: "restapi", target: "goal", weight: 2 },
  { source: "langgraph", target: "goal", weight: 2 },
  { source: "vercel", target: "goal", weight: 3 },
  { source: "cicd", target: "goal", weight: 3 },
];

// --- Helpers ---
const chunkArray = (arr: any[], size: number) => {
  const chunks = [];
  for (let i = 0; i < arr.length; i += size) {
    chunks.push(arr.slice(i, i + size));
  }
  return chunks;
};
const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

async function getRoadPath(fromLat: number, fromLng: number, toLat: number, toLng: number): Promise<PathResult> {
  try {
    const url = `https://router.project-osrm.org/route/v1/driving/${fromLng},${fromLat};${toLng},${toLat}?overview=full&geometries=geojson`;
    const res = await fetch(url);
    const data = await res.json();
    if (data.routes && data.routes[0]) {
      return {
        coordinates: data.routes[0].geometry.coordinates,
        distance: data.routes[0].distance,
        duration: data.routes[0].duration,
      };
    }
  } catch (err) {
    console.error("OSRM fetch failed:", err);
  }
  return {
    coordinates: [[fromLng, fromLat], [toLng, toLat]],
    distance: 0,
    duration: 0,
  };
}

const getNodeRadius = (id: string) => {
  const node = skillNodes.find(n => n.id === id);
  if (!node) return 6;
  if (id === 'you' || id === 'goal') return 18;
  return 6 + (node.usageWeight / 10) * 10;
};

const getPolylineLength = (polyline: SVGPolylineElement) => {
  return polyline.getTotalLength ? polyline.getTotalLength() : 1000;
};

// --- Component ---
export default function DijkstraVisualization() {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const svgOverlayRef = useRef<SVGSVGElement>(null);
  const labelsContainerRef = useRef<HTMLDivElement>(null);

  const [mapInstance, setMapInstance] = useState<L.Map | null>(null);
  const [isLoadingRoutes, setIsLoadingRoutes] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [edgePathsMap, setEdgePathsMap] = useState<Map<string, PathResult>>(new Map());
  
  const [isRunning, setIsRunning] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [visitedCount, setVisitedCount] = useState(0);
  
  const [svgElements, setSvgElements] = useState<{
    nodes: Map<string, SVGCircleElement>;
    edges: Map<string, { casing: SVGPolylineElement, surface: SVGPolylineElement, highlight: SVGPolylineElement }>;
    labels: Map<string, HTMLDivElement>;
  }>({ nodes: new Map(), edges: new Map(), labels: new Map() });
  
  const timelineRef = useRef<gsap.core.Timeline | null>(null);

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    const map = L.map(mapContainerRef.current, {
      center: [12.9516, 77.6546],
      zoom: 12,
      zoomControl: false,
      attributionControl: false,
      dragging: false,
      scrollWheelZoom: false,
      doubleClickZoom: false,
      touchZoom: false,
      boxZoom: false,
      keyboard: false,
    });

    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}{r}.png', {
      opacity: 0.85,
      maxZoom: 19,
    }).addTo(map);

    L.rectangle(map.getBounds().pad(1), {
      color: 'transparent',
      fillColor: '#0a0f1e',
      fillOpacity: 0.35,
      interactive: false,
    }).addTo(map);

    setMapInstance(map);

    return () => {
      map.remove();
    };
  }, []);

  // Preload OSRM paths
  useEffect(() => {
    if (!mapInstance) return;

    let isMounted = true;
    const loadPaths = async () => {
      setIsLoadingRoutes(true);
      const nodeMap = new Map(skillNodes.map(n => [n.id, n]));
      const paths = new Map<string, PathResult>();
      
      const chunks = chunkArray(skillEdges, 1);
      let processedEdges = 0;

      for (const chunk of chunks) {
        if (!isMounted) return;
        await Promise.all(chunk.map(async (edge) => {
          const from = nodeMap.get(edge.source);
          const to = nodeMap.get(edge.target);
          if (!from || !to) return;

          const path = await getRoadPath(from.lat, from.lng, to.lat, to.lng);
          if (path.coordinates.length <= 2) {
             console.warn('Fallback to straight line for:', edge.source, '->', edge.target);
          }
          paths.set(`${edge.source}→${edge.target}`, path);
          paths.set(`${edge.target}→${edge.source}`, {
            ...path,
            coordinates: [...path.coordinates].reverse()
          });
        }));
        
        processedEdges += chunk.length;
        setLoadingProgress(Math.round((processedEdges / skillEdges.length) * 100));
        await sleep(400);
      }

      if (isMounted) {
        setEdgePathsMap(paths);
        setIsLoadingRoutes(false);
      }
    };

    loadPaths();
    return () => { isMounted = false; };
  }, [mapInstance]);

  // Initial SVG Render
  const renderSVGElements = useCallback(() => {
    if (!mapInstance || !svgOverlayRef.current || !labelsContainerRef.current) return;
    
    // Clear existing
    svgOverlayRef.current.innerHTML = '';
    labelsContainerRef.current.innerHTML = '';
    
    // Add Defs
    const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
    defs.innerHTML = `
      <filter id="blue-glow" x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur stdDeviation="4" result="blur"/>
        <feColorMatrix type="matrix" values="0 0 0 0 0.23  0 0 0 0 0.51  0 0 0 0 0.96  0 0 0 0.8 0" in="blur" result="coloredBlur"/>
        <feMerge>
          <feMergeNode in="coloredBlur"/>
          <feMergeNode in="coloredBlur"/>
          <feMergeNode in="SourceGraphic"/>
        </feMerge>
      </filter>
      <filter id="green-glow" x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur stdDeviation="6" result="blur"/>
        <feColorMatrix type="matrix" values="0 0 0 0 0.13  0 0 0 0 0.77  0 0 0 0 0.37  0 0 0 0.9 0" in="blur" result="coloredBlur"/>
        <feMerge>
          <feMergeNode in="coloredBlur"/>
          <feMergeNode in="coloredBlur"/>
          <feMergeNode in="SourceGraphic"/>
        </feMerge>
      </filter>
      <filter id="red-glow" x="-100%" y="-100%" width="300%" height="300%">
        <feGaussianBlur stdDeviation="8" result="blur"/>
        <feColorMatrix type="matrix" values="0 0 0 0 0.94  0 0 0 0 0.27  0 0 0 0 0.27  0 0 0 0.9 0" in="blur" result="coloredBlur"/>
        <feMerge>
          <feMergeNode in="coloredBlur"/>
          <feMergeNode in="SourceGraphic"/>
        </feMerge>
      </filter>
    `;
    svgOverlayRef.current.appendChild(defs);

    const edgesMap = new Map();
    const nodesMap = new Map();
    const labelsMap = new Map();

    const coordsToSVGPoints = (coordinates: [number, number][]) => {
      return coordinates.map(([lng, lat]) => {
        const point = mapInstance.latLngToContainerPoint([lat, lng]);
        return `${point.x},${point.y}`;
      }).join(' ');
    };

    // Render Edges (initially hidden/dark)
    skillEdges.forEach(edge => {
      const pathKey = `${edge.source}→${edge.target}`;
      const edgePath = edgePathsMap.get(pathKey);
      if (!edgePath) return;

      const points = coordsToSVGPoints(edgePath.coordinates);
      
      const casing = document.createElementNS('http://www.w3.org/2000/svg', 'polyline');
      casing.setAttribute('points', points);
      casing.setAttribute('stroke', '#060d1a');
      casing.setAttribute('stroke-width', '9');
      casing.setAttribute('fill', 'none');
      casing.setAttribute('stroke-linecap', 'round');
      casing.setAttribute('stroke-linejoin', 'round');

      const surface = document.createElementNS('http://www.w3.org/2000/svg', 'polyline');
      surface.setAttribute('points', points);
      surface.setAttribute('stroke', '#1a2744');
      surface.setAttribute('stroke-width', '4');
      surface.setAttribute('fill', 'none');
      surface.setAttribute('stroke-linecap', 'round');

      const highlight = document.createElementNS('http://www.w3.org/2000/svg', 'polyline');
      highlight.setAttribute('points', points);
      highlight.setAttribute('stroke', '#93c5fd');
      highlight.setAttribute('stroke-width', '1.5');
      highlight.setAttribute('fill', 'none');
      highlight.setAttribute('opacity', '0');

      svgOverlayRef.current?.appendChild(casing);
      svgOverlayRef.current?.appendChild(surface);
      svgOverlayRef.current?.appendChild(highlight);
      
      edgesMap.set(pathKey, { casing, surface, highlight });
      edgesMap.set(`${edge.target}→${edge.source}`, { casing, surface, highlight }); // Bidirectional lookup
    });

    // Render Nodes
    skillNodes.forEach(node => {
      const point = mapInstance.latLngToContainerPoint([node.lat, node.lng]);
      const radius = getNodeRadius(node.id);

      const pingRing = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      pingRing.setAttribute('cx', point.x.toString());
      pingRing.setAttribute('cy', point.y.toString());
      pingRing.setAttribute('r', radius.toString());
      pingRing.setAttribute('fill', 'none');
      pingRing.setAttribute('stroke', node.id === 'you' ? '#ef4444' : '#3b82f6');
      pingRing.setAttribute('stroke-width', '1.5');
      pingRing.setAttribute('opacity', '0');

      const borderRing = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      borderRing.setAttribute('cx', point.x.toString());
      borderRing.setAttribute('cy', point.y.toString());
      borderRing.setAttribute('r', (radius + 2).toString());
      borderRing.setAttribute('fill', 'rgba(255,255,255,0.08)');
      borderRing.setAttribute('stroke', 'rgba(255,255,255,0.25)');
      borderRing.setAttribute('stroke-width', '1');

      const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      circle.setAttribute('cx', point.x.toString());
      circle.setAttribute('cy', point.y.toString());
      circle.setAttribute('r', radius.toString());
      circle.setAttribute('fill', node.id === 'you' ? '#ef4444' : '#1a2744');
      circle.setAttribute('opacity', node.id === 'you' ? '1' : '0.1');
      if (node.id === 'you') circle.setAttribute('filter', 'url(#red-glow)');

      svgOverlayRef.current?.appendChild(pingRing);
      svgOverlayRef.current?.appendChild(borderRing);
      svgOverlayRef.current?.appendChild(circle);

      nodesMap.set(node.id, circle);

      if (node.id === 'you') {
        gsap.to(pingRing, {
          attr: { r: radius * 2.5 },
          opacity: 0,
          duration: 1.5,
          repeat: -1,
          ease: 'power2.out',
          delay: 0.5
        });
      }

      // Render Label
      const label = document.createElement('div');
      label.style.cssText = `
        position: absolute;
        left: ${point.x}px;
        top: ${point.y + radius + 6}px;
        transform: translateX(-50%);
        font-family: 'JetBrains Mono', monospace;
        font-size: 11px;
        font-weight: 600;
        color: rgba(255,255,255,0.9);
        text-shadow: 0 0 8px rgba(59,130,246,0.8), 0 1px 3px rgba(0,0,0,0.9);
        white-space: nowrap;
        opacity: ${node.id === 'you' ? '1' : '0'};
        pointer-events: none;
        letter-spacing: 0.05em;
        background: rgba(6,13,26,0.7);
        padding: 2px 6px;
        border-radius: 4px;
        border: 1px solid rgba(59,130,246,0.2);
        transition: opacity 0.3s ease;
      `;
      label.textContent = node.label;
      labelsContainerRef.current?.appendChild(label);
      labelsMap.set(node.id, label);
    });

    setSvgElements({ nodes: nodesMap, edges: edgesMap, labels: labelsMap });
  }, [mapInstance, edgePathsMap]);

  useEffect(() => {
    if (!isLoadingRoutes && mapInstance) {
      renderSVGElements();
    }
  }, [isLoadingRoutes, mapInstance, renderSVGElements]);

  // Handle Resize
  useEffect(() => {
    if (!mapInstance) return;
    const handleResize = () => {
      mapInstance.invalidateSize();
      if (!isLoadingRoutes) renderSVGElements();
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [mapInstance, isLoadingRoutes, renderSVGElements]);

  // Dijkstra Algorithm
  const dijkstra = (sourceId: string, targetId: string) => {
    const dist = new Map<string, number>();
    const prev = new Map<string, string>();
    const visited = new Set<string>();
    const visitOrder: { nodeId: string, timestamp: number }[] = [];
    const relaxedEdges: { source: string, target: string, timestamp: number }[] = [];

    skillNodes.forEach(n => dist.set(n.id, Infinity));
    dist.set(sourceId, 0);

    const pq = [{ id: sourceId, dist: 0 }];
    let timestamp = 0;

    while (pq.length > 0) {
      pq.sort((a, b) => a.dist - b.dist);
      const { id: u } = pq.shift()!;

      if (visited.has(u)) continue;
      visited.add(u);
      visitOrder.push({ nodeId: u, timestamp: timestamp++ });

      const neighbors = skillEdges.filter(e => e.source === u || e.target === u);

      for (const edge of neighbors) {
        const v = edge.source === u ? edge.target : edge.source;
        if (visited.has(v)) continue;

        const pathKey = `${edge.source}→${edge.target}`;
        const roadPath = edgePathsMap.get(pathKey);
        const roadWeight = roadPath ? roadPath.distance : edge.weight * 1000;

        const newDist = (dist.get(u) || 0) + roadWeight;
        if (newDist < (dist.get(v) || Infinity)) {
          dist.set(v, newDist);
          prev.set(v, u);
          relaxedEdges.push({ source: u, target: v, timestamp: timestamp++ });
          pq.push({ id: v, dist: newDist });
        }
      }
    }

    const shortestPath = [];
    let current: string | undefined = targetId;
    while (current) {
      shortestPath.unshift(current);
      current = prev.get(current);
    }

    return { visitOrder, relaxedEdges, shortestPath };
  };

  const runDijkstra = () => {
    if (isRunning || isLoadingRoutes) return;
    setIsRunning(true);
    setIsComplete(false);
    setVisitedCount(0);

    // Reset styles
    renderSVGElements();
    
    if (timelineRef.current) {
      timelineRef.current.kill();
    }

    const dijkstraResult = dijkstra('you', 'goal');
    
    const tl = gsap.timeline({
      onComplete: () => {
        setIsRunning(false);
        setIsComplete(true);
      }
    });
    timelineRef.current = tl;

    const { relaxedEdges, shortestPath } = dijkstraResult;

    // PHASE 1 — Blue flood
    relaxedEdges.forEach((edge) => {
      const edgeKey = `${edge.source}→${edge.target}`;
      const edgeKeyRev = `${edge.target}→${edge.source}`;
      const edgeEl = svgElements.edges.get(edgeKey) || svgElements.edges.get(edgeKeyRev);
      
      if (!edgeEl) return;

      const { surface, highlight, casing } = edgeEl;
      const pathLength = getPolylineLength(surface);

      [casing, surface, highlight].forEach(el => {
        el.style.strokeDasharray = `${pathLength}`;
        el.style.strokeDashoffset = `${pathLength}`;
      });

      const startTime = edge.timestamp * 0.08;

      tl.to(casing, { strokeDashoffset: 0, duration: 0.4, ease: 'none' }, startTime);
      
      tl.to(surface, {
        strokeDashoffset: 0,
        stroke: '#3b82f6',
        strokeWidth: 4,
        duration: 0.4,
        ease: 'none',
        onStart: () => surface.setAttribute('filter', 'url(#blue-glow)')
      }, startTime + 0.05);

      tl.to(highlight, {
        strokeDashoffset: 0,
        opacity: 0.5,
        duration: 0.4,
        ease: 'none'
      }, startTime + 0.1);

      const targetNodeEl = svgElements.nodes.get(edge.target);
      const targetLabelEl = svgElements.labels.get(edge.target);

      if (targetNodeEl) {
        tl.fromTo(targetNodeEl,
          { attr: { r: 0, opacity: 0 } },
          {
            attr: { r: getNodeRadius(edge.target), opacity: 1 },
            duration: 0.3,
            ease: 'back.out(2)',
            onComplete: () => {
              gsap.to(targetNodeEl, {
                attr: { r: getNodeRadius(edge.target) * 1.5 },
                duration: 0.15,
                yoyo: true,
                repeat: 1,
                ease: 'power2.out'
              });
            }
          },
          startTime + 0.35
        );
      }

      if (targetLabelEl) {
        tl.to(targetLabelEl, { opacity: 1, duration: 0.3, ease: 'power2.out' }, startTime + 0.45);
      }

      tl.call(() => {
        setVisitedCount(prev => prev + 1);
      }, [], startTime + 0.35);
    });

    // PHASE 2 — Green path reveal
    const phase2Start = relaxedEdges.length * 0.08 + 0.6;
    const pathEdges = [];
    for (let i = 0; i < shortestPath.length - 1; i++) {
      pathEdges.push({ source: shortestPath[i], target: shortestPath[i + 1] });
    }

    pathEdges.forEach((pathEdge, i) => {
      const edgeKey = `${pathEdge.source}→${pathEdge.target}`;
      const edgeKeyRev = `${pathEdge.target}→${pathEdge.source}`;
      const edgeEl = svgElements.edges.get(edgeKey) || svgElements.edges.get(edgeKeyRev);
      
      if (!edgeEl) return;

      const { surface, highlight, casing } = edgeEl;
      const pathLength = getPolylineLength(surface);
      const segStart = phase2Start + i * 0.25;

      tl.set([surface, highlight], {
        strokeDasharray: pathLength,
        strokeDashoffset: pathLength,
      }, segStart - 0.01);

      tl.to(casing, {
        stroke: '#064e3b',
        strokeWidth: 10,
        duration: 0.25,
        ease: 'none',
      }, segStart);

      tl.to(surface, {
        strokeDashoffset: 0,
        stroke: '#22c55e',
        strokeWidth: 6,
        duration: 0.25,
        ease: 'none',
        onStart: () => surface.setAttribute('filter', 'url(#green-glow)')
      }, segStart);

      tl.to(highlight, {
        strokeDashoffset: 0,
        stroke: '#86efac',
        opacity: 0.8,
        strokeWidth: 2,
        duration: 0.25,
        ease: 'none',
      }, segStart + 0.05);

      const targetNodeEl = svgElements.nodes.get(pathEdge.target);
      if (targetNodeEl) {
        tl.to(targetNodeEl, {
          attr: { fill: '#22c55e' },
          duration: 0.2,
          ease: 'power2.out',
        }, segStart + 0.2);
      }
    });

    const destinationEl = svgElements.nodes.get('goal');
    if (destinationEl) {
      const arrivalTime = phase2Start + pathEdges.length * 0.25;
      tl.to(destinationEl, {
        attr: { r: 28, fill: '#22c55e' },
        duration: 0.2,
        ease: 'back.out(3)',
      }, arrivalTime);
      tl.to(destinationEl, {
        attr: { r: 20 },
        duration: 0.3,
        ease: 'elastic.out(1, 0.5)',
      }, arrivalTime + 0.2);
    }
  };

  return (
    <div style={{ position: 'relative', width: '100%', height: '100vh', background: '#0a0f1e', overflow: 'hidden' }}>
      {/* Map Container */}
      <div ref={mapContainerRef} style={{ width: '100%', height: '100%', position: 'absolute', inset: 0, zIndex: 1 }} />
      
      {/* SVG Overlay */}
      <svg
        ref={svgOverlayRef}
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', zIndex: 2, pointerEvents: 'none' }}
      />
      
      {/* HTML Labels */}
      <div ref={labelsContainerRef} style={{ position: 'absolute', inset: 0, zIndex: 3, pointerEvents: 'none' }} />

      {/* Loading State UI */}
      {isLoadingRoutes && (
        <div style={{
          position: 'absolute', inset: 0, zIndex: 10,
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          background: 'rgba(6,13,26,0.85)',
          backdropFilter: 'blur(4px)',
        }}>
          <div style={{ color: '#3b82f6', fontFamily: 'JetBrains Mono', fontSize: 13 }}>
            Mapping road network...
          </div>
          <div style={{
            marginTop: 12, width: 200, height: 2,
            background: 'rgba(59,130,246,0.2)',
            borderRadius: 2, overflow: 'hidden'
          }}>
            <div style={{
              height: '100%', background: '#3b82f6',
              width: `${loadingProgress}%`,
              transition: 'width 0.3s ease',
              boxShadow: '0 0 8px #3b82f6'
            }}/>
          </div>
          <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11, marginTop: 8 }}>
            {loadingProgress}% — fetching {skillEdges.length} road segments
          </div>
        </div>
      )}

      {/* Controls Bar */}
      <div style={{
        position: 'absolute', bottom: 20, left: '50%',
        transform: 'translateX(-50%)',
        display: 'flex', alignItems: 'center', gap: 16,
        zIndex: 10,
        background: 'rgba(6,13,26,0.8)',
        border: '1px solid rgba(59,130,246,0.3)',
        borderRadius: 12, padding: '10px 20px',
        backdropFilter: 'blur(8px)',
      }}>
        <button onClick={runDijkstra} disabled={isRunning || isLoadingRoutes} style={{
          background: isRunning ? 'transparent' : 'rgba(59,130,246,0.15)',
          border: '1px solid rgba(59,130,246,0.4)',
          color: '#93c5fd',
          padding: '6px 16px',
          borderRadius: 8,
          fontFamily: 'JetBrains Mono',
          fontSize: 12,
          cursor: isRunning || isLoadingRoutes ? 'not-allowed' : 'pointer',
          letterSpacing: '0.05em',
        }}>
          {isRunning ? '⬡ ROUTING...' : "▶ RUN DIJKSTRA'S"}
        </button>

        <div style={{ color: 'rgba(255,255,255,0.5)', fontFamily: 'JetBrains Mono', fontSize: 11 }}>
          <span style={{ color: '#ef4444' }}>● MG Road</span>
          {' → '}
          <span style={{ color: '#22c55e' }}>● Lalbagh</span>
        </div>

        <div style={{ color: '#3b82f6', fontFamily: 'JetBrains Mono', fontSize: 11 }}>
          {isRunning || isComplete ? `${visitedCount} / ${skillNodes.length} nodes` : 'Ready'}
        </div>
      </div>
    </div>
  );
}
