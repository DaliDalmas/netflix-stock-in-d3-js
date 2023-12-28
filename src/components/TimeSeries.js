import { useRef, useEffect } from "react"
import * as d3 from 'd3'
import './TimeSeries.css'

export default function TimeSeries({df, width, height}){

    const svgRef = useRef()

    useEffect(()=>{
        if (!df || df.length===0) return;

        const svg = d3.select(svgRef.current)
        svg.selectAll('*').remove()

        const margin = {top: 20, right: 20, bottom: 30, left: 40}
        const innerHeight = height - margin.top - margin.bottom
        const innerWidth = width - margin.left - margin.right

        const xScale = d3.scaleUtc()
            .domain([
                d3.min(df, d=>d.date),
                d3.max(df, d=>d.date)
            ])
            .range([0, innerWidth])
            .nice()

        const yScale = d3.scaleLinear()
            .domain([
                d3.min(df, d=>d.value),
                d3.max(df, d=>d.value),
            ])
            .range([innerHeight, 0])
            .nice()

        const g = svg.append('g')
            .attr('transform', `translate(${margin.left},${margin.top})`)
        
        // x axis
        g.append('g')
            .attr('transform', `translate(0,${innerHeight})`)
            .call(
                d3.axisBottom(xScale)
                    .ticks(d3.timeYear.every(2))
                    .tickFormat(d3.timeFormat('%Y'))
                )
        
        g.append('text')
            // .attr('class', 'axis-title')
            .attr('text-anchor', 'end')
            .attr('x', innerWidth/2)
            .attr('y', height-margin.bottom+9)
            .text('time')
        
        // y axis
        g.append('g')
            .call(d3.axisRight(yScale))
        
        const g2 = g.append('g')
                .attr('transform', `translate(0, ${height/2})`)
            
        g2.append('text')
            // .attr('class', 'axis-title')
            .attr('y', -6)
            .attr('transform', `rotate(-90)`)
            .text('stock closing price')
        
        // add line
        g.append('path')
            .datum(df)
            .attr('fill', 'None')
            .attr('stroke', '#005d6e')
            .attr('stroke-width', 2)
            .attr('d', d3.line()
                        .x(d=>xScale(d.date))
                        .y(d=>yScale(d.value))
            
            )
        
        // create tooltip div
        const tooltip = d3.select("body")
                .append("div")
                .attr("class", "tooltip")

        // add circle element
        const circle = g.append("circle")
                .attr("r", 0)
                .attr("fill", "#bc6e24")
                .attr("stroke", "white")
                .attr("opacity", 0.7)
                .style("pointer-events", "none")
    
        // creating a listening rectangle
        const listeningRect = g.append("rect")
                .attr("width", innerWidth)
                .attr("height", innerHeight)
        
        // create the mouse move function
        listeningRect.on("mousemove", event=>{
            const [xCoord] = d3.pointer(event, this)
            const bisectDate = d3.bisector(d=>d.date).left
            const x0 = xScale.invert(xCoord)
            const i = bisectDate(df, x0, 1)
            const d = df[i-1]
            const xPos = xScale(d.date)
            const yPos = yScale(d.value)


            // update circle position
            circle.attr("cx", xPos)
                .attr("cy", yPos)
            
            // add transition for the circle radius
            circle.transition().duration(50).attr('r', 5)

            // add in tooltip
            tooltip
                .style("display", "block")
                .style("left", `${xPos+200}px`)
                .style("top", `${yPos}px`)
                .html(`<strong>Date:</strong>${d.date.toLocaleDateString()}<br><strong>Price:</strong> ${d.value !== undefined ? Math.round(d.value*10000)/10000 : 'N/A'}`)
        })

        listeningRect.on("mouseleave", ()=>{
            circle.transition()
                .duration(50)
                .attr("r", 0)
        
            tooltip.style("display", "none")
        })

        
    },[df, width, height])
    return(
        <>
        <div id="tooltip"></div>
        <svg ref={svgRef} width={width} height={height}>
            
        </svg>
        </>

    )
}