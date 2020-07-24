document.addEventListener("DOMContentLoaded", async event => {
  let info = await fetch(
  "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json");

  let data = await info.json();

  console.log(data);

  data.forEach(function (d) {
    d.Place = +d.Place;
    let parsedTime = d.Time.split(":");
    d.Time = new Date(1970, 0, 1, 0, parsedTime[0], parsedTime[1]);
  });

  let h = 600;
  let w = 800;
  let padding = 48;

  let xScale = d3.
  scaleLinear().
  domain([d3.min(data, d => d.Year) - 1, d3.max(data, d => d.Year) + 1]).
  range([padding, w]);

  let yScale = d3.
  scaleTime().
  domain(d3.extent(data, d => d.Time)).
  range([padding, h - padding]);

  console.log(yScale);

  let yAxis = d3.axisLeft(yScale).ticks(12, "%M:%S");

  let xAxis = d3.axisBottom(xScale).tickFormat(d3.format("d"));

  let svg = d3.
  select("#svgc").
  append("svg").
  attr("width", w + padding).
  attr("height", h + padding);

  let legend = d3.select("#svgc").append("div").
  attr("id", "legend").
  style("position", "absolute").
  style("top", h / 2 + "px").
  style("right", 400 + "px").
  style("padding", 16 + "px");


  legend.append("span").
  attr("class", "no-dope icons");

  legend.append("span").
  text("No doping aligation");


  legend.
  append("span");

  legend.
  append("span").attr("class", "dope icons");

  legend.append("span").
  text("Doping aligation");

  let tooltip = d3.select("#tooltip");
  let country = d3.select("#tooltip #country");
  let title = d3.select("#tooltip .title");
  let time = d3.select("#tooltip .time");
  let doping = d3.select("#tooltip .doping");

  svg.
  selectAll("circle").
  data(data).
  enter().
  append("circle").
  attr("r", 8).
  attr("cx", d => xScale(d.Year)).
  attr("cy", d => yScale(d.Time)).
  attr("fill", d => d.Doping ? "#c64d4d" : "#3c92cc").
  attr("class", "dot").
  attr("data-xvalue", d => d3.format("d")(d.Year)).
  attr("data-yvalue", d => d.Time).
  on("mouseover", d => {
    tooltip.transition().
    duration(200).
    style("opacity", "1");

    tooltip.
    style("top", d3.event.pageY + "px").
    style("left", d3.event.pageX + "px").
    attr("data-year", d.Year);

    console.log(d3.event.pageY);

    country.html(d.Nationality);
    title.html(d.Name);
    time.html("Year: " + d.Year + " | Time: " + d.Time.getMinutes() + ":" + d.Time.getSeconds());
    doping.html(d.Doping ? d.Doping : "");

  }).on("mouseout", d => {
    tooltip.transition().
    duration(200).
    style("opacity", "0");
  });

  svg.
  append("g").
  attr("id", "x-axis").
  attr("transform", `translate(0,${h - padding})`).
  call(xAxis);

  svg.
  append("g").
  attr("id", "y-axis").
  attr("transform", `translate(${padding},0)`).
  call(yAxis);
});