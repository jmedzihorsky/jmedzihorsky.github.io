var alpha = 0.3;
var goldenRatio = (1 + Math.sqrt(5))/2;
var spacing = 3;
var width = 100 * goldenRatio,
    height = 100;
var wws = width + spacing,
    hws = height + spacing;
var gw = wws * 29,
    gh = hws * 23;
var tx = 0,
    ty = 0;
var yearX = 1900;
    yearY = 2016;
var interval = 0;
    last = 0;
var colorMenu;
var selectedGraph;
var isSelected = 0;
var redrawTimer;
var lineFunction = d3.svg.line().x(function(d) { return d.x; })
                                .y(function(d) { return d.y; })
                                .interpolate("basis");

var svg = d3.select("body").append("svg")
    .attr("width", gw)
    .attr("height", gh)
    .on("click",function(){
      if(colorMenu.style("opacity")==1){
        colorMenu.style("opacity",0)
                  .attr("transform","translate(-1000,-1000)");
      }
    })
    .on("contextmenu",function(){
      d3.event.preventDefault();
      /*if(isSelected && colorMenu.style("opacity")==0){
        colorMenu.style("opacity",1)
                .attr("transform","translate("+d3.mouse(this)[0]+","+d3.mouse(this)[1]+")");
      }*/
      if(!isSelected){
        colorMenu.style("opacity",0)
                .attr("transform","translate(-1000,-1000)");
      }
    });

var color = d3.rgb(220,220,220);
var colorPalette = [[d3.rgb(7,15,132),d3.rgb(146,19,19),d3.rgb(0,120,42),d3.rgb(0,0,0)],
                    [d3.rgb(0,0,256),d3.rgb(237,32,23),d3.rgb(144,200,152),d3.rgb(170,170,170)]];

var globalCountries = [];
//var countryIds = [];
//var countryPolyarchies = [];

var startYear = d3.select("#startYear").on("input", function(){
  if(parseInt(this.value)>=parseInt(this.min) && parseInt(this.value)<=parseInt(this.max)){
    yearX = parseInt(this.value);
    endYear.attr("min",yearX+1);

    //svg.select("#LVA").selectAll("path").each(function(){redrawPath();});
    //svg.selecAll("g").transition().duration(2000);
    clearTimeout(redrawTimer);
    svg.selectAll("#graph").remove();
    redrawTimer = setTimeout(drawGraphs, 500);
  }
});
var endYear = d3.select("#endYear").on("input", function(){
  if(parseInt(this.value)>=parseInt(this.min) && parseInt(this.value)<=parseInt(this.max)){
    yearY = parseInt(this.value);
    startYear.attr("max",yearY-1);
    clearTimeout(redrawTimer);
    svg.selectAll("#graph").remove();
    redrawTimer = setTimeout(drawGraphs, 500);
  }
});



function createColorMenu(){
  colorMenu = svg.append("g").attr("transform","translate(-1000,-1000)")
                .style("opacity",0);
  for(var i=0;i<2;i++){
    for(var j=0;j<4;j++){
      colorMenu.append("rect")
              .attr("x",j*20)
              .attr("y",i*20)
              .attr("width",20)
              .attr("height",20)
              .attr("fill",colorPalette[i][j])
              .attr("stroke",d3.rgb(40,40,40))
              .attr("cursor","crosshair")
              .on("click",function(){
                color = d3.select(this).style("fill");
                selectedGraph.attr("fill",color)
                            .attr("stroke",color);
              });
    }
  }
}

function createNew(rx,ry,country,countryId){
  var drag = d3.behavior.drag()
    .origin(Object)
    .on("drag", dragmove)
    .on("dragend",dragend)
    .on("dragstart",dragstart);

  var newg = svg.append("g").data([{x: rx, y: ry}])
                            .attr("id",countryId)
                            .on("contextmenu",function(){
                              if(colorMenu.style("opacity")==0 || selectedGraph!=graph){
                                selectedGraph = graph;
                                colorMenu.style("opacity",1)
                                        .attr("transform","translate("+d3.mouse(this)[0]+","+d3.mouse(this)[1]+")");
                              }else if(colorMenu.style("opacity")==1){
                                colorMenu.style("opacity",0)
                                        .attr("transform","translate(-1000,-1000)");
                              }
                            })
			    .on("mouseover",function(){
              //if(colorMenu.style("opacity")==0)selectedGraph = graph;
              isSelected = 1;
				      dragrect.attr("fill-opacity", alpha+0.3);})
			   .on("mouseout",function(){
              isSelected = 0;
				      dragrect.attr("fill-opacity", alpha);});

  var dragrect = newg.append("rect")
    .attr("x", function(d) { return d.x; })
    .attr("y", function(d) { return d.y; })
    .attr("height", height)
    .attr("width", width)
    .attr("fill", d3.rgb(220,220,220))
    .attr("fill-opacity", alpha)
    .attr("cursor", "grab")
    .call(drag);

  var text = newg.append("text")
    .attr("class","svgtext")
    .attr("x", function(d) { return d.x; })
    .attr("y", function(d) { return d.y; })
    .style("text-anchor", "middle")
    .attr("dy", ".8em")
    .attr("dx", width/2)
    .style("font-size", "20px")
    .text(country)
    .attr("cursor", "grab")
    .call(drag);

  var graph = newg.append("svg")
    .attr("x", function(d) { return d.x; })
    .attr("y", function(d) { return d.y; })
    .attr("fill", "blue")
    .attr("stroke", "blue")
    .attr("cursor", "grab")
    .attr("height", height)
    .attr("stroke-width", 1)
    .attr("width", 0)
    .call(drag);

  var dragInitiated = false;
  function dragmove(d){
    if(dragInitiated){
      tx = Math.max(0, Math.min(gw - width, d3.event.x));
      ty = Math.max(0, Math.min(gh - height, d3.event.y));
      dragrect.attr("x",d.x=tx).attr("y",d.y=ty);
      text.attr("x",d.x=tx).attr("y",d.y=ty);
      graph.attr("x",d.x=tx).attr("y",d.y=ty);
    }
  }

  function dragstart(d){
    if(d3.event.sourceEvent.which == 1){//d3.event.sourceEvent.button == 0
      colorMenu.style("opacity",0)
              .attr("transform","translate(-1000,-1000)");
      dragInitiated = true;
      this.parentNode.parentNode.appendChild(this.parentNode);
      //newg.style("opacity", alpha+0.3);
      dragrect.attr("cursor", "grabbing");
      text.attr("cursor", "grabbing");
    }else if(d3.event.sourceEvent.which == 3){
      colorMenu.node().parentNode.appendChild(colorMenu.node());
      //graph.attr("fill",color).attr("stroke",color);
      //selectedGraph = graph;//d3.select(this);

      //colorMenu.style("opacity",1)
      //        .attr("transform","translate("+d3.mouse(this)[0]+","+d3.mouse(this)[1]+")");
    }
  }

  function dragend(d){
    if(dragInitiated){
      tx = Math.round(d.x/wws)*wws;
      ty = Math.round(d.y/hws)*hws;
      //newg.style("opacity", alpha);
      dragrect.attr("x",d.x=tx).attr("y",d.y=ty).attr("cursor", "grab");//.attr("fill-opacity", alpha);
      text.attr("x",d.x=tx).attr("y",d.y=ty).attr("cursor", "grab");
      graph.attr("x",d.x=tx).attr("y",d.y =ty).attr("cursor","grab");
      dragInitiated = false;
    }
  }
}
function NormSInv(p) {
    var a1 = -39.6968302866538, a2 = 220.946098424521, a3 = -275.928510446969;
    var a4 = 138.357751867269, a5 = -30.6647980661472, a6 = 2.50662827745924;
    var b1 = -54.4760987982241, b2 = 161.585836858041, b3 = -155.698979859887;
    var b4 = 66.8013118877197, b5 = -13.2806815528857, c1 = -7.78489400243029E-03;
    var c2 = -0.322396458041136, c3 = -2.40075827716184, c4 = -2.54973253934373;
    var c5 = 4.37466414146497, c6 = 2.93816398269878, d1 = 7.78469570904146E-03;
    var d2 = 0.32246712907004, d3 = 2.445134137143, d4 = 3.75440866190742;
    var p_low = 0.02425, p_high = 1 - p_low;
    var q, r;
    var retVal;

    if ((p < 0) || (p > 1)){
        alert("NormSInv: Argument out of range.");
        retVal = 0;
    }else if (p < p_low){
        q = Math.sqrt(-2 * Math.log(p));
        retVal = (((((c1 * q + c2) * q + c3) * q + c4) * q + c5) * q + c6) / ((((d1 * q + d2) * q + d3) * q + d4) * q + 1);
    }else if (p <= p_high){
        q = p - 0.5;
        r = q * q;
        retVal = (((((a1 * r + a2) * r + a3) * r + a4) * r + a5) * r + a6) * q / (((((b1 * r + b2) * r + b3) * r + b4) * r + b5) * r + 1);
    }else{
        q = Math.sqrt(-2 * Math.log(1 - p));
        retVal = -(((((c1 * q + c2) * q + c3) * q + c4) * q + c5) * q + c6) / ((((d1 * q + d2) * q + d3) * q + d4) * q + 1);
    }

    return retVal;
}

function oneTile(countryId,polyarchies,years,polyarchies2){
  var g = d3.select("#"+countryId.replace(/"/g,""));
  if(!g.empty()){
    var countryGraph = g.select("svg");
    countryGraph.attr("width",0);
    var countryData = [];
    var countryData2 = [];
    var previousYear = years[0]-1;

    var x = [],
        y = [],
        z = [];
    var y2;

    for(var i=0;i<polyarchies.length;i++){
      if(years[i]-1!=previousYear){
        countryGraph.append("path").attr("id","graph")
                                   .attr("d", lineFunction(countryData))
                                   //.attr("stroke-width", 1)
                                   .attr("fill", "none");

        for(var j=x.length-1;j>-1;j--){
          y2 = 100 - (y[j]*80+(80*z[j]));
          countryData2.push(x[j].toString() + "," + y2.toString() + " ");
        }
        countryGraph.append("polygon").attr("id","graph")
                                      .attr("points",countryData2)
                                      .attr("fill-opacity",0.2)
                                      .attr("stroke-opacity",0.2);
        countryData = [];
        countryData2 = [];
        x = [];
        y = [];
        z = [];
      }
      previousYear = years[i];

      x.push((years[i]-yearX)*interval*((width-(8*interval))/last)+(4*interval));
      y.push(polyarchies[i]);
      z.push(polyarchies2[i]);
      y2 = 100 - (polyarchies[i]*80-(80*z[z.length-1]));
      countryData2.push(x[x.length-1].toString() + "," + y2.toString() + " ");
      countryData.push({"x": x[x.length-1],"y": 100 - (polyarchies[i]*80)});
    }
    for(var i=x.length-1;i>-1;i--){
      y2 = 100 - (y[i]*80+(80*z[i]));
      countryData2.push(x[i].toString() + "," + y2.toString() + " ");
    }
    countryGraph.append("polygon").attr("id","graph")
                                  .attr("points",countryData2)
                                 .attr("fill-opacity",0.2)
                                 .attr("stroke-opacity",0.2);
    countryGraph.append("path").attr("id","graph")
                               .attr("d", lineFunction(countryData))
                               .attr("fill", "none");

/*                               */
   //countryGraph.attr("width",width);
    //if(countryGraph.attr("width")==0){
      countryGraph.transition()
                  .ease("Linear")
                  .duration(2000)
                  .attr("width",width);
    /*}else{
      countryGraph.transition()
                   //.delay(500)
                   .ease("Linear")
                   .duration(400)
                   .attr("width",0);
      countryGraph.transition().delay(400)
                   .ease("Linear")
                   .duration(2000)
                   .attr("width",width);
    }*/
  }else alert(countryId);
}

function drawGraphs(){
  var countryId = globalCountries[0][1];
  var years = [];
  var polyarchies = [];
  var polyarchies2 = [];

  var timeline = yearY - yearX;
  interval = (width-(8*(width/timeline)))/timeline;
  last = timeline*interval;
  for(var i=0;i<globalCountries.length;i++){
    if(globalCountries[i][1]!=countryId){
      oneTile(countryId,polyarchies,years,polyarchies2);
      polyarchies = [];
      polyarchies2 = [];
      years = [];
      countryId = globalCountries[i][1];
    }
    if(!isNaN(globalCountries[i][3])){
      if(globalCountries[i][5]>yearX && globalCountries[i][5]<yearY){
        polyarchies.push(globalCountries[i][3]);
        polyarchies2.push(globalCountries[i][4]);
        years.push(globalCountries[i][5]);
      }
    }
  }
}

function tiles(countries,countryYears){
  var tabs = [];
  var newCountry = "";
  for(var i=1;i<countries.length;i++){
      tabs = countries[i].split(",");
      if(countries[i]!=""){
        if(tabs[0].length>22)tabs[0]=tabs[2];
        createNew(wws*tabs[9],hws*tabs[10],tabs[0],tabs[2]);//!isNaN(tabs[9])
      }
  }
  for(var i=1;i<countryYears.length;i++){
    globalCountries.push(countryYears[i].split(","));
  }

  drawGraphs();
  createColorMenu();
}

function readTextFile(filepath){
  var file = new XMLHttpRequest();
  file.open("GET", filepath, false);
  //file.setRequestHeader("Content-Type","text/plain");
  file.send(null);
  return file.responseText.split("\n");
}

tiles(readTextFile("misc/worldtilegrid_vdem.csv"),readTextFile("misc/data20171230.csv"));
