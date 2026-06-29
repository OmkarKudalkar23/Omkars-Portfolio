import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as d3 from 'd3';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { X, ExternalLink } from 'lucide-react';
import { PageShell } from '@/components/layout/PageShell';

gsap.registerPlugin(ScrollTrigger);

// ─── Data Scaffolding ────────────────────────────────────────────────────────

const BRAND_COLOR = "#4f8ef7";

const skillsData = [
  { id: "python", label: "Python", icon: "python", category: "languages", usageWeight: 9, description: "Used extensively for data processing, AI agent pipelines, and backend logic in both research and production systems.", projectLink: null },
  { id: "cpp", label: "C++", icon: "cplusplus", category: "languages", usageWeight: 7, description: "Core language for algorithmic problem solving and performance-critical systems.", projectLink: null },
  { id: "c", label: "C", icon: "c", category: "languages", usageWeight: 6, description: "Foundational language used for systems programming and embedded understanding.", projectLink: null },
  { id: "java", label: "Java", icon: "java", category: "languages", usageWeight: 6, description: "Object-oriented backend development and enterprise architecture exposure.", projectLink: null },
  { id: "js", label: "JavaScript", icon: "javascript", category: "languages", usageWeight: 9, description: "The backbone of my web development workflow, heavily used across the entire stack.", projectLink: null },
  
  { id: "nextjs", label: "Next.js", icon: "nextdotjs", category: "frontend", usageWeight: 9, description: "My go-to React framework for production applications, utilizing SSR, API routes, and App Router.", projectLink: "/projects/nolan-studio" },
  { id: "react", label: "React.js", icon: "react", category: "frontend", usageWeight: 9, description: "Used for building highly interactive and component-driven user interfaces.", projectLink: null },
  { id: "threejs", label: "Three.js", icon: "threedotjs", category: "frontend", usageWeight: 6, description: "Leveraged via React Three Fiber to build immersive 3D web experiences.", projectLink: null },
  { id: "framer", label: "Framer Motion", icon: "framer", category: "frontend", usageWeight: 8, description: "Used to orchestrate complex, fluid, physics-based animations across all my frontends.", projectLink: null },
  { id: "tailwind", label: "Tailwind CSS", icon: "tailwindcss", category: "frontend", usageWeight: 9, description: "My primary styling tool for rapid, design-system-driven utility class development.", projectLink: null },
  
  { id: "nodejs", label: "Node.js", icon: "nodedotjs", category: "backend", usageWeight: 8, description: "Powers the backend servers and API layers of my full-stack applications.", projectLink: null },
  { id: "express", label: "Express.js", icon: "express", category: "backend", usageWeight: 8, description: "Used for robust, traditional RESTful API development and middleware orchestration.", projectLink: null },
  { id: "mongodb", label: "MongoDB", icon: "mongodb", category: "backend", usageWeight: 8, description: "Flexible NoSQL database used for rapid prototyping and unstructured data storage.", projectLink: "/projects/finverse" },
  { id: "neo4j", label: "Neo4j", icon: "neo4j", category: "backend", usageWeight: 9, description: "Graph database powering complex relationship engines. Replaced traditional vector chunking with graph-based retrieval for long-form story consistency.", projectLink: "/projects/nolan-studio" },
  { id: "rest", label: "REST APIs", icon: null, category: "backend", usageWeight: 9, description: "Core architectural style I use for client-server communication.", projectLink: null },
  
  { id: "langchain", label: "LangChain", icon: "langchain", category: "ai", usageWeight: 8, description: "Used to orchestrate LLM calls, tools, and chains for complex AI agent workflows.", projectLink: "/projects/nolan-studio" },
  { id: "langgraph", label: "LangGraph", icon: "langchain", category: "ai", usageWeight: 8, description: "Utilized for stateful, multi-agent coordination in production AI pipelines.", projectLink: "/projects/nolan-studio" },
  { id: "mediapipe", label: "MediaPipe", icon: "google", category: "ai", usageWeight: 7, description: "Used for real-time computer vision tasks like hand landmark detection.", projectLink: "/projects/signsync" },
  { id: "opencv", label: "OpenCV", icon: "opencv", category: "ai", usageWeight: 7, description: "Core library for image processing and vision algorithms.", projectLink: "/projects/signsync" },
  { id: "lstm", label: "LSTM", icon: null, category: "ai", usageWeight: 6, description: "Implemented recurrent neural networks for sequence modeling and temporal data.", projectLink: "/projects/signsync" },
  { id: "whisper", label: "Whisper", icon: "openai", category: "ai", usageWeight: 6, description: "Integrated OpenAI's Whisper model for robust speech-to-text transcription.", projectLink: null },
  
  { id: "git", label: "Git", icon: "git", category: "tools", usageWeight: 9, description: "Essential version control for all my codebases.", projectLink: null },
  { id: "github", label: "GitHub", icon: "github", category: "tools", usageWeight: 9, description: "Used for collaboration, issue tracking, and CI/CD pipelines.", projectLink: null },
  { id: "vercel", label: "Vercel", icon: "vercel", category: "tools", usageWeight: 8, description: "My primary deployment platform for frontend and serverless projects.", projectLink: null },
  { id: "n8n", label: "n8n", icon: "n8n", category: "tools", usageWeight: 6, description: "Used for building internal automation workflows and nocode API integrations.", projectLink: null },
  { id: "cicd", label: "CI/CD", icon: "githubactions", category: "tools", usageWeight: 7, description: "Automated testing and deployment pipelines to ensure production reliability.", projectLink: null },
];

const projectLinksData = [
  // Nolan AI Studio
  { source: "neo4j", target: "langgraph", project: "Nolan AI Studio", route: "/projects/nolan-studio" },
  { source: "neo4j", target: "nextjs", project: "Nolan AI Studio", route: "/projects/nolan-studio" },
  { source: "langchain", target: "langgraph", project: "Nolan AI Studio", route: "/projects/nolan-studio" },
  { source: "mongodb", target: "nextjs", project: "Nolan AI Studio", route: "/projects/nolan-studio" },
  
  // SignSync
  { source: "mediapipe", target: "opencv", project: "SignSync", route: "/projects" },
  { source: "lstm", target: "python", project: "SignSync", route: "/projects" },
  { source: "react", target: "mediapipe", project: "SignSync", route: "/projects" },
  
  // Finverse
  { source: "react", target: "nodejs", project: "Finverse", route: "/projects" },
  { source: "mongodb", target: "express", project: "Finverse", route: "/projects" },
  { source: "threejs", target: "react", project: "Finverse", route: "/projects" },
  
  // General connections
  { source: "js", target: "react", project: "Frontend ecosystem", route: null },
  { source: "python", target: "langchain", project: "AI ecosystem", route: null },
  { source: "git", target: "github", project: "Version control", route: null },
];

// ─── D3 Node/Link Types ──────────────────────────────────────────────────────

type ConstellationNode = d3.SimulationNodeDatum & typeof skillsData[0] & { radius: number };
type ConstellationLink = d3.SimulationLinkDatum<ConstellationNode> & typeof projectLinksData[0];

// ─── Skill Constellation Component ────────────────────────────────────────────

function SkillConstellation({
  prefersReducedMotion,
  externalSelectedNodeId,
  onExternalSelectChange,
}: {
  prefersReducedMotion: boolean;
  externalSelectedNodeId?: string | null;
  onExternalSelectChange?: (id: string | null) => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const wrapperRef = useRef<SVGGElement>(null);
  const navigate = useNavigate();
  
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const [selectedNodeId, _setSelectedNodeId] = useState<string | null>(null);

  // Merge external control with internal selection
  const effectiveSelected = externalSelectedNodeId !== undefined ? externalSelectedNodeId : selectedNodeId;
  const setSelectedNodeId = (id: string | null) => {
    _setSelectedNodeId(id);
    onExternalSelectChange?.(id);
  };
  
  // GSAP Cinematic Camera State
  const isAnimatingRef = useRef(false);
  const travelTweenRef = useRef<gsap.core.Tween | null>(null);
  const idleTweenRef = useRef<gsap.core.Tween | null>(null);
  const [isTravelling, setIsTravelling] = useState(false);
  
  // Generate a massive network of dummy nodes to make the graph feel huge and dense
  const dummyGraph = useMemo(() => {
    const nodes = Array.from({ length: 400 }).map((_, i) => ({
      id: `dummy-${i}`,
      label: "",
      icon: null,
      category: "dummy",
      usageWeight: Math.random() * 2.5 + 0.5,
      description: "",
      projectLink: null
    }));

    const links: { source: string; target: string; project: string; route: string | null }[] = [];
    nodes.forEach(node => {
      const numConnections = Math.floor(Math.random() * 2) + 1;
      for (let i = 0; i < numConnections; i++) {
        const connectToReal = Math.random() > 0.85; 
        const targetId = connectToReal 
          ? skillsData[Math.floor(Math.random() * skillsData.length)].id
          : nodes[Math.floor(Math.random() * nodes.length)].id;
        
        if (targetId !== node.id) {
          links.push({ source: node.id, target: targetId, project: "dummy", route: null });
        }
      }
    });
    return { nodes, links };
  }, []);

  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });
  
  const graphData = useMemo(() => {
    const allSkills = [...skillsData, ...dummyGraph.nodes];
    const allLinks = [...projectLinksData, ...dummyGraph.links];
    
    const nodes: ConstellationNode[] = allSkills.map(s => ({
      ...s,
      radius: s.category === 'dummy' ? (2 + Math.random() * 4) : (6 + (s.usageWeight / 10) * 14),
    }));
    const links: ConstellationLink[] = allLinks.map(l => ({ ...l }));
    return { nodes, links };
  }, [dummyGraph]);

  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new ResizeObserver(entries => {
      for (let entry of entries) {
        setDimensions({ width: entry.contentRect.width, height: entry.contentRect.height });
      }
    });
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  // ─── D3 Zoom & Infinite Panning ───────────────────────────
  const zoomBehavior = useMemo(() => d3.zoom<SVGSVGElement, unknown>()
    .scaleExtent([0.3, 4])
    .on('start', (event) => {
      // If the user manually starts dragging/zooming, instantly kill any idle float animations
      if (event.sourceEvent && idleTweenRef.current) {
        idleTweenRef.current.kill();
        idleTweenRef.current = null;
      }
    })
    .on('zoom', (event) => {
      d3.select(wrapperRef.current).attr('transform', event.transform);
    }), []);

  useEffect(() => {
    if (!svgRef.current) return;
    const svg = d3.select(svgRef.current);
    svg.call(zoomBehavior);
    svg.on("dblclick.zoom", null);
  }, [zoomBehavior]);

  // Force simulation setup
  useEffect(() => {
    const { nodes, links } = graphData;
    const { width, height } = dimensions;
    if (width === 0 || height === 0) return;

    const simulation = d3.forceSimulation<ConstellationNode>(nodes)
      .force("charge", d3.forceManyBody().strength(-200)) 
      .force("link", d3.forceLink<ConstellationNode, ConstellationLink>(links).id(d => d.id).distance(120))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force("collide", d3.forceCollide<ConstellationNode>().radius(d => d.radius + 15).iterations(2));

    const svgNode = svgRef.current;
    if (!svgNode) return;
    const svg = d3.select(svgNode);
    
    const linkSelection = svg.selectAll<SVGLineElement, ConstellationLink>('.graph-link').data(links);
    const nodeSelection = svg.selectAll<SVGGElement, ConstellationNode>('.graph-node').data(nodes);

    if (!prefersReducedMotion) {
      simulation.alphaTarget(0.015).restart();
    }

    simulation.on("tick", () => {
      linkSelection
        .attr('x1', d => (d.source as ConstellationNode).x ?? 0)
        .attr('y1', d => (d.source as ConstellationNode).y ?? 0)
        .attr('x2', d => (d.target as ConstellationNode).x ?? 0)
        .attr('y2', d => (d.target as ConstellationNode).y ?? 0);
        
      nodeSelection
        .attr('transform', d => `translate(${d.x ?? 0},${d.y ?? 0})`);
    });

    const drag = d3.drag<SVGGElement, ConstellationNode>()
      .on('start', (event, d) => {
        if (isAnimatingRef.current) return; // Prevent drag during camera travel
        if (!event.active && !prefersReducedMotion) simulation.alphaTarget(0.1).restart();
        d.fx = d.x;
        d.fy = d.y;
      })
      .on('drag', (event, d) => {
        if (isAnimatingRef.current) return;
        d.fx = event.x;
        d.fy = event.y;
      })
      .on('end', (event, d) => {
        if (isAnimatingRef.current) return;
        if (!event.active && !prefersReducedMotion) simulation.alphaTarget(0.015);
        d.fx = null;
        d.fy = null;
      });

    nodeSelection.call(drag);

    return () => {
      simulation.stop();
    };
  }, [graphData, dimensions, prefersReducedMotion]);

  // ─── Cinematic GSAP Camera Animation ─────────────────────────────────────
  useEffect(() => {
    const svgNode = svgRef.current;
    if (!svgNode) return;
    const svg = d3.select(svgNode);
    const { width, height } = dimensions;
    if (width === 0 || height === 0) return;

    // Cleanup any existing camera tweens
    if (travelTweenRef.current) travelTweenRef.current.kill();
    if (idleTweenRef.current) idleTweenRef.current.kill();
    
    const currentTransform = d3.zoomTransform(svgNode);
    const proxy = { 
      x: currentTransform.x, 
      y: currentTransform.y, 
      k: currentTransform.k 
    };

    if (selectedNodeId) {
      const node = graphData.nodes.find(n => n.id === selectedNodeId);
      if (node && node.x != null && node.y != null) {
        // Calculate framing logic
        const panelWidth = window.innerWidth < 768 ? 0 : 320;
        const scale = 1.6;
        const targetX = (width - panelWidth) / 2 - node.x * scale;
        const targetY = height / 2 - node.y * scale;

        isAnimatingRef.current = true;
        setIsTravelling(true);

        travelTweenRef.current = gsap.to(proxy, {
          x: targetX,
          y: targetY,
          k: scale,
          duration: 1.4,
          ease: "back.out(1.2)", // Momentum with subtle 2-4% overshoot
          onUpdate: () => {
            // Continuously interpolate internal D3 zoom state synchronously
            svg.call(zoomBehavior.transform, d3.zoomIdentity.translate(proxy.x, proxy.y).scale(proxy.k));
          },
          onComplete: () => {
            isAnimatingRef.current = false;
            setIsTravelling(false);
            
            // Trigger zero-gravity idle float
            const idleProxy = { offset: 0 };
            idleTweenRef.current = gsap.to(idleProxy, {
              offset: Math.PI * 2,
              duration: 8,
              repeat: -1,
              ease: "none",
              onUpdate: () => {
                // Continuous, extremely slow 1-3 pixel floating movement
                const floatX = targetX + Math.sin(idleProxy.offset) * 2.5;
                const floatY = targetY + Math.cos(idleProxy.offset * 0.8) * 2.5;
                svg.call(zoomBehavior.transform, d3.zoomIdentity.translate(floatX, floatY).scale(scale));
              }
            });
          }
        });
      }
    } else {
      // Reset Camera Sequence
      isAnimatingRef.current = true;
      setIsTravelling(true);

      travelTweenRef.current = gsap.to(proxy, {
        x: 0,
        y: 0,
        k: 1, // Default scale
        duration: 1.2,
        ease: "power3.inOut", // Smooth deceleration
        onUpdate: () => {
          svg.call(zoomBehavior.transform, d3.zoomIdentity.translate(proxy.x, proxy.y).scale(proxy.k));
        },
        onComplete: () => {
          isAnimatingRef.current = false;
          setIsTravelling(false);
        }
      });
    }
  }, [selectedNodeId, dimensions, graphData.nodes, zoomBehavior]);

  // Determine opacities based on hover/select state
  const getNodeOpacity = (nodeId: string) => {
    if (effectiveSelected) {
      if (nodeId === effectiveSelected) return 1;
      const isConnected = graphData.links.some(l => 
        ((l.source as ConstellationNode).id === effectiveSelected && (l.target as ConstellationNode).id === nodeId) ||
        ((l.target as ConstellationNode).id === effectiveSelected && (l.source as ConstellationNode).id === nodeId)
      );
      return isConnected ? 1 : 0.15;
    }
    
    if (!hoveredNode) return 1;
    if (hoveredNode === nodeId) return 1;
    const isConnected = graphData.links.some(l => 
      ((l.source as ConstellationNode).id === hoveredNode && (l.target as ConstellationNode).id === nodeId) ||
      ((l.target as ConstellationNode).id === hoveredNode && (l.source as ConstellationNode).id === nodeId)
    );
    return isConnected ? 1 : 0.2;
  };

  const getLinkOpacity = (link: ConstellationLink) => {
    if (effectiveSelected) {
      if ((link.source as ConstellationNode).id === effectiveSelected || (link.target as ConstellationNode).id === effectiveSelected) return 0.6;
      return 0.05;
    }

    if (!hoveredNode) return 0.15;
    if ((link.source as ConstellationNode).id === hoveredNode || (link.target as ConstellationNode).id === hoveredNode) return 0.6;
    return 0.05;
  };

  // Get connected skills for the selected node
  const selectedNodeData = useMemo(() => graphData.nodes.find(n => n.id === effectiveSelected), [effectiveSelected, graphData.nodes]);
  const connectedSkills = useMemo(() => {
    if (!effectiveSelected) return [];
    const connectedIds = new Set<string>();
    graphData.links.forEach(l => {
      if ((l.source as ConstellationNode).id === effectiveSelected) connectedIds.add((l.target as ConstellationNode).id);
      if ((l.target as ConstellationNode).id === effectiveSelected) connectedIds.add((l.source as ConstellationNode).id);
    });
    return graphData.nodes.filter(n => connectedIds.has(n.id) && n.category !== 'dummy'); // Exclude dummy nodes from panel list
  }, [effectiveSelected, graphData]);

  // Sync GSAP camera when externalSelectedNodeId changes
  useEffect(() => {
    if (externalSelectedNodeId !== undefined) {
      _setSelectedNodeId(externalSelectedNodeId);
    }
  }, [externalSelectedNodeId]);

  return (
    <div 
      ref={containerRef} 
      style={{ width: '100%', height: '100%', position: 'relative', overflow: 'hidden' }}
    >
      <svg 
        ref={svgRef} 
        width="100%" 
        height="100%" 
        style={{ display: 'block', cursor: 'grab' }}
        onClick={(e) => {
          if (isAnimatingRef.current) return;
          if (e.target === svgRef.current || (e.target as Element).id === 'infinite-bg') setSelectedNodeId(null);
        }}
        onMouseDown={() => {
          if (svgRef.current) svgRef.current.style.cursor = 'grabbing';
        }}
        onMouseUp={() => {
          if (svgRef.current) svgRef.current.style.cursor = 'grab';
        }}
      >
        <defs>
          <pattern id="gridPattern" width="60" height="60" patternUnits="userSpaceOnUse">
            <circle cx="1" cy="1" r="1.5" fill="rgba(255,255,255,0.08)" />
          </pattern>
        </defs>

        {/* Main Graph Layer */}
        <g ref={wrapperRef}>
          {/* Infinite background layer */}
          <rect id="infinite-bg" x="-20000" y="-20000" width="40000" height="40000" fill="url(#gridPattern)" />

          {/* Edges */}
          <g className="links">
            {graphData.links.map((link, i) => (
              <line
                key={i}
                className="graph-link"
                stroke={BRAND_COLOR}
                strokeWidth={1}
                style={{ opacity: getLinkOpacity(link), transition: 'opacity 0.3s' }}
              />
            ))}
          </g>
          
          {/* Nodes */}
          <g className="nodes">
            {graphData.nodes.map(node => {
              const isDummy = node.category === 'dummy';
              const isTargetNode = selectedNodeId === node.id;
              const showTravelBloom = isTargetNode && isTravelling;
              
              // Dynamic drop-shadow calculation
              const shadowSize = showTravelBloom ? 25 : ((hoveredNode === node.id || isTargetNode) ? 15 : 5);
              const shadowOpacity = showTravelBloom ? 1 : 0.6;
              const dropShadowFilter = isDummy ? 'none' : `drop-shadow(0 0 ${shadowSize}px rgba(79,142,247,${shadowOpacity}))`;
              
              return (
              <g 
                key={node.id} 
                className="graph-node"
                style={{ 
                  opacity: getNodeOpacity(node.id), 
                  transition: 'opacity 0.3s', 
                  cursor: isDummy ? 'default' : 'pointer',
                  pointerEvents: isDummy ? 'none' : 'auto'
                }}
                onMouseEnter={() => !isDummy && setHoveredNode(node.id)}
                onMouseLeave={() => !isDummy && setHoveredNode(null)}
                onClick={() => {
                  if (isAnimatingRef.current) return;
                  if (!isDummy) setSelectedNodeId(node.id);
                }}
              >
                <circle 
                  r={node.radius * (hoveredNode === node.id || isTargetNode ? 1.2 : 1)} 
                  fill={node.icon ? `rgba(79,142,247,0.15)` : (isDummy ? 'rgba(79,142,247,0.4)' : BRAND_COLOR)} 
                  stroke={node.icon ? BRAND_COLOR : "none"}
                  strokeWidth={node.icon ? 1 : 0}
                  style={{ 
                    filter: dropShadowFilter,
                    transition: 'r 0.3s ease, filter 0.3s ease, fill 0.3s ease'
                  }} 
                />
                {node.icon && (
                  <image 
                    href={`https://cdn.simpleicons.org/${node.icon}/white`}
                    x={-node.radius * 0.6 * (hoveredNode === node.id || isTargetNode ? 1.2 : 1)}
                    y={-node.radius * 0.6 * (hoveredNode === node.id || isTargetNode ? 1.2 : 1)}
                    width={node.radius * 1.2 * (hoveredNode === node.id || isTargetNode ? 1.2 : 1)}
                    height={node.radius * 1.2 * (hoveredNode === node.id || isTargetNode ? 1.2 : 1)}
                    style={{ transition: 'all 0.3s ease', pointerEvents: 'none' }}
                  />
                )}
                {!isDummy && (
                  <text 
                    y={node.radius * (hoveredNode === node.id || isTargetNode ? 1.2 : 1) + 14} 
                    textAnchor="middle" 
                    fill={(hoveredNode === node.id || isTargetNode) ? "#fff" : "#a0a0a8"} 
                    fontSize={(hoveredNode === node.id || isTargetNode) ? 14 : 11}
                    fontFamily="'Geist Mono', monospace"
                    pointerEvents="none"
                    style={{ transition: 'all 0.3s ease' }}
                  >
                    {node.label}
                  </text>
                )}
              </g>
            )})}
          </g>
        </g>
      </svg>
      
      {/* Slide-in Side Panel */}
      <AnimatePresence>
        {selectedNodeData && (
          <motion.div
            initial={{ x: '100%', opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: '100%', opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            style={{
              position: 'absolute',
              top: 16,
              right: 16,
              bottom: 16,
              width: 320,
              maxWidth: 'calc(100% - 32px)',
              background: 'rgba(8,8,9,0.85)',
              backdropFilter: 'blur(24px)',
              WebkitBackdropFilter: 'blur(24px)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: 20,
              padding: 24,
              display: 'flex',
              flexDirection: 'column',
              zIndex: 20,
              boxShadow: '-8px 0 32px rgba(0,0,0,0.5)'
            }}
          >
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
              <div>
                <span style={{ fontSize: 10, color: '#505058', textTransform: 'uppercase', letterSpacing: '0.1em', fontFamily: "'Geist Mono', monospace", display: 'block', marginBottom: 4 }}>
                  {selectedNodeData.category}
                </span>
                <h3 style={{ margin: 0, fontSize: 24, color: '#f2f2f3', fontWeight: 500 }}>
                  {selectedNodeData.label}
                </h3>
              </div>
              <button 
                onClick={() => {
                  if (isAnimatingRef.current) return;
                  setSelectedNodeId(null);
                }}
                style={{ background: 'transparent', border: 'none', color: '#a0a0a8', cursor: 'pointer', padding: 4 }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Usage Meter */}
            <div style={{ marginBottom: 24 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <span style={{ fontSize: 11, color: '#a0a0a8', fontFamily: "'Geist Mono', monospace" }}>Usage Intensity</span>
                <span style={{ fontSize: 11, color: BRAND_COLOR, fontFamily: "'Geist Mono', monospace" }}>{selectedNodeData.usageWeight}/10</span>
              </div>
              <div style={{ display: 'flex', gap: 3 }}>
                {Array.from({ length: 10 }).map((_, i) => (
                  <div key={i} style={{ flex: 1, height: 4, borderRadius: 2, background: i < selectedNodeData.usageWeight ? BRAND_COLOR : 'rgba(255,255,255,0.08)' }} />
                ))}
              </div>
            </div>

            {/* Description */}
            <p style={{ fontSize: 14, color: '#a0a0a8', lineHeight: 1.6, margin: '0 0 24px 0' }}>
              {selectedNodeData.description}
            </p>

            {/* Connected Skills */}
            {connectedSkills.length > 0 && (
              <div style={{ marginBottom: 24, flex: 1 }}>
                <span style={{ fontSize: 10, color: '#505058', textTransform: 'uppercase', letterSpacing: '0.1em', fontFamily: "'Geist Mono', monospace", display: 'block', marginBottom: 12 }}>
                  Connected Skills
                </span>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {connectedSkills.map(skill => (
                    <button
                      key={skill.id}
                      onClick={() => {
                        if (isAnimatingRef.current) return;
                        setSelectedNodeId(skill.id);
                      }}
                      style={{
                        background: 'rgba(255,255,255,0.03)',
                        border: '0.5px solid rgba(255,255,255,0.08)',
                        borderRadius: 8,
                        padding: '6px 12px',
                        fontSize: 12,
                        color: '#f2f2f3',
                        fontFamily: "'Geist Mono', monospace",
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                      }}
                      onMouseEnter={(e) => {
                        if (isAnimatingRef.current) return;
                        e.currentTarget.style.background = 'rgba(79,142,247,0.1)';
                        e.currentTarget.style.borderColor = 'rgba(79,142,247,0.3)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'rgba(255,255,255,0.03)';
                        e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)';
                      }}
                    >
                      {skill.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Project CTA */}
            {selectedNodeData.projectLink && (
              <button
                onClick={() => navigate({ to: selectedNodeData.projectLink! })}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8,
                  background: 'rgba(79,142,247,0.1)',
                  border: '1px solid rgba(79,142,247,0.3)',
                  borderRadius: 12,
                  padding: '12px',
                  color: BRAND_COLOR,
                  fontSize: 13,
                  fontWeight: 500,
                  cursor: 'pointer',
                  width: '100%',
                  transition: 'all 0.2s ease',
                  marginTop: 'auto'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(79,142,247,0.2)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(79,142,247,0.1)';
                }}
              >
                View in Project <ExternalLink size={14} />
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

function SkillsPage() {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [tourIndex, setTourIndex] = useState(0);
  const sectionRef = useRef<HTMLDivElement>(null);

  // The ordered list of real skill IDs for the scroll tour
  const tourIds = useMemo(() => skillsData.map(s => s.id), []);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);
    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  // Scroll-driven camera tour
  useEffect(() => {
    if (prefersReducedMotion || !sectionRef.current) return;

    const steps = tourIds.length;

    const st = ScrollTrigger.create({
      trigger: sectionRef.current,
      start: 'top top',
      end: `+=${steps * 300}`,   // 300px of scroll per skill
      pin: true,
      scrub: false,
      onUpdate: (self) => {
        const idx = Math.min(steps - 1, Math.floor(self.progress * steps));
        if (idx !== tourIndex) {
          setTourIndex(idx);
          setSelectedNodeId(tourIds[idx]);
        }
      },
      onLeave: () => {
        // After touring all skills, deselect and let the user scroll away
        setSelectedNodeId(null);
      },
      onLeaveBack: () => {
        setSelectedNodeId(tourIds[0]);
        setTourIndex(0);
      },
    });

    return () => st.kill();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [prefersReducedMotion, tourIds]);

  const currentlyLearning = [
    'WebGL shaders',
    'Rust',
    'Distributed systems',
    'RL fundamentals',
    'Transformers architecture',
    'CUDA programming',
  ];

  return (
    <PageShell path="/skills">
      <div ref={sectionRef} style={{ position: 'relative', width: '100%', height: '100vh' }}>
        {/* Full Screen Graph Layer */}
        <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
          <SkillConstellation
            prefersReducedMotion={prefersReducedMotion}
            externalSelectedNodeId={selectedNodeId}
            onExternalSelectChange={setSelectedNodeId}
          />
        </div>

        {/* Floating Hero Layer */}
        <div style={{ position: 'relative', zIndex: 10, padding: '80px 64px 48px', maxWidth: 1200, margin: '0 auto', pointerEvents: 'none' }}>
          <div>
            <p style={{ fontSize: 11, color: '#505058', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 16, fontFamily: 'Geist Mono, monospace' }}>
              Technical Stack
            </p>
            <h1 style={{ fontSize: 52, fontWeight: 300, color: '#f2f2f3', fontFamily: 'Geist, system-ui, sans-serif', letterSpacing: '-0.03em', lineHeight: 1.15, margin: 0 }}>
              Full-stack. AI-native.<br />Graph-first.
            </h1>
            <p style={{ fontSize: 17, color: '#a0a0a8', maxWidth: 460, marginTop: 16, lineHeight: 1.7 }}>
              Every skill in production — none in a tutorial repo.
            </p>
          </div>
        </div>

        {/* Scroll Tour Progress HUD */}
        {!prefersReducedMotion && selectedNodeId && (
          <div style={{
            position: 'absolute', bottom: 90, left: '50%', transform: 'translateX(-50%)',
            zIndex: 20, display: 'flex', alignItems: 'center', gap: 6, pointerEvents: 'none',
          }}>
            {skillsData.map((s, i) => (
              <div key={s.id} style={{
                width: i === tourIndex ? 20 : 5, height: 5,
                borderRadius: 3,
                background: i === tourIndex ? '#4f8ef7' : 'rgba(255,255,255,0.15)',
                transition: 'width 0.3s ease, background 0.3s ease',
              }} />
            ))}
          </div>
        )}
        {!prefersReducedMotion && selectedNodeId && (
          <div style={{
            position: 'absolute', bottom: 110, left: '50%', transform: 'translateX(-50%)',
            zIndex: 20, pointerEvents: 'none',
            fontSize: 10, color: '#505058', fontFamily: "'Geist Mono', monospace",
            letterSpacing: '0.1em', textTransform: 'uppercase',
          }}>
            {tourIndex + 1} / {skillsData.length} — {skillsData[tourIndex]?.label}
          </div>
        )}

        {/* Floating Marquee Layer at bottom */}
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 10, paddingBottom: 24, pointerEvents: 'none' }}>
          <div style={{ padding: '0 64px', maxWidth: 1200, margin: '0 auto' }}>
            <div style={{ fontSize: 11, color: '#505058', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 16, fontFamily: 'Geist Mono, monospace' }}>
              Currently going deeper
            </div>
          </div>
          <div style={{ overflow: 'hidden' }}>
            <div className="marquee-track" style={{ pointerEvents: 'auto' }}>
              {[...currentlyLearning, ...currentlyLearning].map((item, i) => (
                <span
                  key={i}
                  style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(8,8,9,0.5)', backdropFilter: 'blur(12px)', border: '0.5px solid rgba(255,255,255,0.08)', borderRadius: 20, padding: '6px 16px', fontSize: 13, color: '#505058', whiteSpace: 'nowrap', flexShrink: 0, fontFamily: 'Geist Mono, monospace' }}
                >
                  → {item}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </PageShell>
  );
}

export const Route = createFileRoute('/skills')({
  component: SkillsPage,
});
