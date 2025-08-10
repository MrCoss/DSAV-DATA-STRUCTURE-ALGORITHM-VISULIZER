import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { motion } from 'framer-motion';

const GraphDisplay = ({ graph, highlightedNode, highlightedEdge }) => {
    const svgRef = useRef();

    useEffect(() => {
        if (!graph || !svgRef.current) return;

        const svg = d3.select(svgRef.current);
        const width = svg.node().getBoundingClientRect().width;
        const height = svg.node().getBoundingClientRect().height;

        // Clear previous render
        svg.selectAll("*").remove();

        // Add definitions for markers
        const defs = svg.append("defs");
        defs.append("linearGradient")
            .attr("id", "arrow-gradient")
            .attr("x1", "0%").attr("y1", "0%")
            .attr("x2", "100%").attr("y2", "0%")
            .selectAll("stop")
            .data([
                { offset: "0%", color: "#e94560" },
                { offset: "100%", color: "#53a9ff" }
            ])
            .enter().append("stop")
            .attr("offset", d => d.offset)
            .attr("stop-color", d => d.color);
            
        defs.append("marker")
            .attr("id", "arrowhead")
            .attr("viewBox", "-0 -5 10 10")
            .attr("refX", 23)
            .attr("refY", 0)
            .attr("orient", "auto")
            .attr("markerWidth", 8)
            .attr("markerHeight", 8)
            .attr("xoverflow", "visible")
            .append("svg:path")
            .attr("d", "M 0,-5 L 10 ,0 L 0,5")
            .attr("fill", "url(#arrow-gradient)")
            .style("stroke", "none");

        const simulation = d3.forceSimulation(graph.nodes)
            .force("link", d3.forceLink(graph.edges).id(d => d.id).distance(120))
            .force("charge", d3.forceManyBody().strength(-300))
            .force("center", d3.forceCenter(width / 2, height / 2))
            .force("x", d3.forceX(width / 2).strength(0.1))
            .force("y", d3.forceY(height / 2).strength(0.1));

        const edge = svg.append("g")
            .selectAll("line")
            .data(graph.edges)
            .join("line")
            .attr("stroke-width", 3)
            .attr("stroke", d => (highlightedEdge && highlightedEdge.source === d.source.id && highlightedEdge.target === d.target.id) ? "url(#arrow-gradient)" : "#999")
            .attr("marker-end", "url(#arrowhead)");

        const node = svg.append("g")
            .selectAll("circle")
            .data(graph.nodes)
            .join("circle")
            .attr("r", 25)
            .attr("fill", d => d.id === highlightedNode ? "#e94560" : "#16213e")
            .attr("stroke", d => d.id === highlightedNode ? "#e94560" : "#53a9ff")
            .attr("stroke-width", 3)
            .call(d3.drag()
                .on("start", dragstarted)
                .on("drag", dragged)
                .on("end", dragended));

        const label = svg.append("g")
            .selectAll("text")
            .data(graph.nodes)
            .join("text")
            .text(d => d.id)
            .attr("dy", 5)
            .attr("text-anchor", "middle")
            .attr("fill", "#dcdcdc")
            .style("font-weight", "bold");

        simulation.on("tick", () => {
            edge
                .attr("x1", d => d.source.x)
                .attr("y1", d => d.source.y)
                .attr("x2", d => d.target.x)
                .attr("y2", d => d.target.y);

            node
                .attr("cx", d => d.x)
                .attr("cy", d => d.y);

            label
                .attr("x", d => d.x)
                .attr("y", d => d.y);
        });
        
        function dragstarted(event, d) {
            if (!event.active) simulation.alphaTarget(0.3).restart();
            d.fx = d.x;
            d.fy = d.y;
        }

        function dragged(event, d) {
            d.fx = event.x;
            d.fy = event.y;
        }

        function dragended(event, d) {
            if (!event.active) simulation.alphaTarget(0);
            d.fx = null;
            d.fy = null;
        }

    }, [graph, highlightedNode, highlightedEdge]);

    return (
        <motion.svg ref={svgRef} width="100%" height="100%" initial={{ opacity: 0 }} animate={{ opacity: 1 }} />
    );
};

export default GraphDisplay;
