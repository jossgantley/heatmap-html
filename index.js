        var legW= 440
        var legH= 60
        const legPaddingH = 80;
        const legPaddingV = 10
        
        var w= 0.975 * window.innerWidth;
        var h= 0.75 * window.innerHeight;
        const paddingH = 80;
        const paddingV= 100;
        const svg = d3.select("#app")
        .append("svg")
        .attr("width", w)
        .attr("height", h)
        .style("background-color", "#eee")

        svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 10 )
        .attr("x",0 - (h / 2))
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .text("Month");     

        svg.append("text")
        .attr("transform", "translate("+w/2+","+(h -50) + ")")
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .text("Year"); 

        const legend = svg.append("svg")
        .attr("width", legW)
        .attr("height", legH)
        .attr("x", w-legW)
        .attr("y", h - (legPaddingV + legH)) 
        .attr("id", "legend")
        
        
        const svgDefs = legend.append("defs")

        const grad = svgDefs.append("linearGradient")
            .attr("id", "grad")
        
        grad.append("stop")
            .attr("class", "stop-one")
            .attr("offset", 0)
        
        grad.append("stop")
            .attr("class", "stop-two")
            .attr("offset", 0.5)
        grad.append("stop")
            .attr("class", "stop-three")
            .attr("offset", 0.5)
        
        grad.append("stop")
            .attr("class", "stop-four")
            .attr("offset", 1)

        legend.append("rect")
            .classed("filled", "true")
            .attr("width", legW-2*legPaddingH)
            .attr("x", legPaddingH)
            .attr("height", (legH/2) - legPaddingV)

        legend.append("text")
            .text("Temperature(℃)")
            .attr("dy", "0.75em")
            .style("text-anchor", "middle")
            .attr("transform", "translate("+legW/2+","+(legH/2+legPaddingV) + ")")

        legend.append("rect")
            .style("fill", "orange")
            .style("display", "none")
            legend.append("rect")
            .style("fill", "white")
            .style("display", "none")
            legend.append("rect")
            .style("fill", "green")
            .style("display", "none")
            legend.append("rect")
            .style("fill", "blue")
            .style("display", "none")

window.onload = ()=>{
    fetch("https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json")
    .then(response => response.json())
    .then(data =>{
        data.monthlyVariance.forEach(item=> item.month-=1)
       
        const newData = data.monthlyVariance.map(item=>{
            return {...item, netTemp: item.variance + data.baseTemperature}
        })
     
        const xScale = d3.scaleBand()
            .domain(newData.map(item=>{
                return item.year;
            }))
            .range([paddingH, w-paddingH])  

        const yScale = d3.scaleBand()
        .domain(["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December" ].reverse())
        .range([h-paddingV, paddingV])
     
        const numMonth = d3.scaleBand()
    
        .domain([11,10,9,8,7,6,5,4,3,2,1,0])
        .range([h-paddingV, paddingV])
        
        const blueColorScale = d3.scaleLinear()
        .domain([0, 6])
        .range(["darkblue", "lightblue"])

        const redColorScale = d3.scaleLinear()
        .domain([7, 14])
        .range(["yellow", "darkred"])

        const legScale = d3.scaleLinear()
            .domain([0,14])
            .range([legPaddingH, legW - legPaddingH])

        const tooltip= d3.select("body")
            .append("div")
            .attr("id", "tooltip")
            .style("opacity", "0")
                       
        svg.selectAll(".cell")
            .data(newData)
            .enter()
            .append("rect")
            .attr("class", "cell")
            .attr("x", (d,i)=> xScale(d.year))
            .attr("y", (d,i) =>  numMonth(d.month))
            .attr("width", d=>  xScale.bandwidth()) 
            .attr("height", d=> numMonth.bandwidth())
            .attr("data-year", d=>d.year)
            .attr("data-month", d=>d.month)
            .attr("data-temp", d=>d.netTemp)
            .attr("fill", d=> d.netTemp<= 6 ? blueColorScale(d.netTemp) : redColorScale(d.netTemp))
            .on("mousemove", (d)=>{
                tooltip
                    .style("opacity", "0.9")
                    .html(`${yScale.domain().reverse()[d.month]}, ${d.year} <br>
                            Temperature: ${d.netTemp}℃ <br>
                            Variance: ${d.variance}℃`)
                    .attr("data-year", d.year)
                    .style("top", d3.event.pageY - 100 + "px")
                    .style("left", d3.event.pageX  -50 + "px")
               })
            .on("mouseleave", ()=>tooltip.style("opacity", "0"))
        
        const xAxis = d3.axisBottom(xScale)
                        .tickFormat(d3.format("d"))
                        .tickValues(xScale.domain().filter(item=>{
                            return item%10==0
                        }))
        const yAxis = d3.axisLeft(yScale)

        const legAxis = d3.axisBottom(legScale);
                                   
        svg.append("g")
            .attr("id", "x-axis")
            .attr("transform", "translate(0," + (h-paddingV) + ")")
            .call(xAxis)
            
        svg.append("g")
            .attr("id", "y-axis")
            .attr("transform", "translate(" + paddingH + ",0)")
            .call(yAxis)
        
        legend.append("g")
            .attr("id", "legend-axis")
            .attr("transform", "translate(0," + (legH/2-legPaddingV) + ")")
                .call(legAxis)
         
  
        
    
        })
    .catch(()=>{
        console.log("Error")
    })
    }
            
window.onresize = ()=>{
    h= 0.6 * window.innerHeight
    w= 0.8 * window.innerWidth
}
            
    



