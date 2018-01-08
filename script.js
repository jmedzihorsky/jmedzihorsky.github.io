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
var interval = (width-(8*(width/117)))/117;
var last = (2016-1900)*interval;
var svg = d3.select("body").append("svg")
    .attr("width", gw)
    .attr("height", gh)
    .on("contextmenu",function(d){d3.event.preventDefault();});

var color = d3.rgb(220,220,220);
var colorPalette = [[d3.rgb(0,0,256),d3.rgb(227,32,23),d3.rgb(255,211,0),d3.rgb(0,120,42),d3.rgb(0,54,136)],
                    [d3.rgb(240,234,198),d3.rgb(225,198,115),d3.rgb(176,167,133),d3.rgb(184,185,206),d3.rgb(242,192,207)],
                    [d3.rgb(51,66,91),d3.rgb(0,152,212),d3.rgb(252,194,154),d3.rgb(236,240,241),d3.rgb(170,170,170)]];


function createNew(rx,ry,country,countryId){
  var drag = d3.behavior.drag()
    .origin(Object)
    .on("drag", dragmove)
    .on("dragend",dragend)
    .on("dragstart",dragstart);

  var newg = svg.append("g").data([{x: rx, y: ry}])
                            .attr("id",countryId)
			    .on("mouseover",function(){
				dragrect.attr("fill-opacity", alpha+0.3);})
			   .on("mouseout",function(){
				dragrect.attr("fill-opacity", alpha);});

  var dragrect = newg.append("rect")
    .attr("x", function(d) { return d.x; })
    .attr("y", function(d) { return d.y; })
    .attr("height", height)
    .attr("width", width)
    .attr("fill", color)
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
      dragInitiated = true;
      this.parentNode.parentNode.appendChild(this.parentNode);
      //newg.style("opacity", alpha+0.3);
      dragrect.attr("cursor", "grabbing");
      text.attr("cursor", "grabbing");
    }else if(d3.event.sourceEvent.which == 3){
      graph.attr("fill",color).attr("stroke",color);
    }
  }

  function dragend(d){
    if(dragInitiated){
      tx = Math.round(d.x/wws)*wws;
      ty = Math.round(d.y/hws)*hws;
      //newg.style("opacity", alpha);
      dragrect.attr("x",d.x=tx).attr("y",d.y=ty).attr("cursor", "grab").attr("fill-opacity", alpha);
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
  var g = d3.select("#"+countryId.replace(/"/g,""));//.attr("fill","red");
  if(!g.empty()){
    var countryGraph = g.select("svg");
    var countryData = [];
    var countryData2 = [];
    var previousYear = years[0]-1;
    var lineFunction = d3.svg.line().x(function(d) { return d.x; })
                                    .y(function(d) { return d.y; })
                                    .interpolate("basis");
    var x = [],
        y = [],
        z = [];
    var y2;
    //var last = (2016-1900)*((width)/117);

    for(var i=0;i<polyarchies.length;i++){
      if(years[i]-1!=previousYear){
        countryGraph.append("path").attr("d", lineFunction(countryData))
                                     //.attr("stroke", "blue")
                                     .attr("stroke-width", 1)
                                     .attr("fill", "none");
        for(var j=x.length-1;j>-1;j--){
          //y2 = y[j]-20;
          y2 = 100 - (y[j]*80+(80*z[j]));
          //y2 = 100 - (y[j]*100+10);
          countryData2.push(x[j].toString() + "," + y2.toString() + " ");
        }
        countryGraph.append("polygon").attr("points",countryData2)
                                        //.attr("stroke","blue")
                                        //.style("fill", "blue")
                                        .attr("fill-opacity",0.2)
                                        .attr("stroke-opacity",0.2)
                                        .attr("stroke-width",1);
        countryData = [];
        countryData2 = [];
        x = [];
        y = [];
        z = [];
      }
      previousYear = years[i];

      //x.push((years[i]-1900)*((width)/117));
      x.push((years[i]-1900)*interval*((width-(8*interval))/last)+(4*interval));
      //y.push(100 - (polyarchies[i]*100-10));
      //y2 = y[y.length-1];
      y.push(polyarchies[i]);
      z.push(polyarchies2[i]);
      //z.push(NormSInv(polyarchies2[i])/40);
      //y2 = 100 - (polyarchies[i]*100-10);
      y2 = 100 - (polyarchies[i]*80-(80*z[z.length-1]));
      countryData2.push(x[x.length-1].toString() + "," + y2.toString() + " ");
      countryData.push({"x": x[x.length-1],"y": 100 - (polyarchies[i]*80)});
    }
    for(var i=x.length-1;i>-1;i--){
      //y2 = y[i]-20;
      y2 = 100 - (y[i]*80+(80*z[i]));
      //y2 = 100 - (y[i]*100+10);
      countryData2.push(x[i].toString() + "," + y2.toString() + " ");
    }
    countryGraph.append("polygon").attr("points",countryData2)
                                     //.attr("stroke","blue")
                                     //.style("fill", "blue")
                                     .attr("fill-opacity",0.2)
                                     .attr("stroke-opacity",0.2)
                                     .attr("stroke-width",1);
    countryGraph.append("path").attr("d", lineFunction(countryData))
                                   //.attr("stroke", "blue")
                                   .attr("stroke-width", 1)
                                   .attr("fill", "none");

  countryGraph.transition()
              .duration(2000)
              .ease("Linear")
              .attr("width",width);
  }else alert(countryId);
}

function tiles(countries,countryYears){
  var tabs = [];// = countries[0].split(",");
  var polyarchies = [];
  var polyarchies2 = [];
  var years = [];
  var countryId = countryYears[1].split(",")[1];
  var newCountry = "";
  for(var i=1;i<countries.length;i++){
      tabs = countries[i].split(",");
      if(countries[i]!=""){
        if(tabs[0].length>22)tabs[0]=tabs[2];
        createNew(wws*tabs[9],hws*tabs[10],tabs[0],tabs[2]);//!isNaN(tabs[9])
      }
  }

  for(var i=1;i<countryYears.length;i++){
    tabs = countryYears[i].split(",");
    if(tabs[1]!=countryId){
      oneTile(countryId,polyarchies,years,polyarchies2);
      polyarchies = [];
      polyarchies2 = [];
      years = [];
      countryId = tabs[1];
    }
    if(!isNaN(tabs[3])){
      polyarchies.push(tabs[3]);
      polyarchies2.push(tabs[4]);
      years.push(tabs[5]);
    }
  }
}

function readTextFile(filepath){
  var file = new XMLHttpRequest();
  file.open("GET", filepath, false);
  file.send(null);
  return file.responseText.split("\n");
}

tiles(readTextFile("misc/worldtilegrid_vdem.csv"),readTextFile("misc/data20171230.csv"));

function createColorTable(){
  var table = d3.select("body").append('table');
  for(var i=0;i<3;i++){
    var row = table.append('tr');
    for(var j=0;j<5;j++){
      row.append('td').attr("width",20).append("svg").attr("width",100)
                                                  .attr("height",100).append("rect").attr("width",100)
                                                  .attr("height",100)
                                                  .attr("fill",colorPalette[i][j])
                                                  .attr("cursor","crosshair")
                                                  .on("click",function(){color = d3.select(this).style("fill");});
    }
  }
}
createColorTable();