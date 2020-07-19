var goldenRatio = (1 + Math.sqrt(5))/2;
var alpha = 0.2;
var minYear = 1900,
    maxYear = 2016;
var spacing = 3;
var width = 100 * goldenRatio,
    height = 100;
var wws = width + spacing,
    hws = height + spacing;
var gw = wws * 27,
    gh = hws * 22;
var tx = 0,
    ty = 0;
var yearX = minYear,
    yearY = maxYear;
var interval = 0;

var colorMenu;
var svgMenu;
var selectedGraph;
var isSelected = 0;
var redrawTimer;
var mouseholdTimer;

function hideMenu(menu){
  menu.transition().duration("200").style("opacity",0)
      .on("end",function(){
        menu.attr("transform","translate(-1000,-1000)");
      });
}
function showMenu(menu){
  var mousePos = d3.mouse(svg.node());
  mousePos[0] = mousePos[0]/0.35;
  mousePos[1] = mousePos[1]/0.35;
  menu.node().parentNode.appendChild(menu.node());
  menu.attr("transform","translate("+mousePos+")scale(3)")
      .transition().duration("200").style("opacity",1);
}
var zoomScale = 1;
var zoomTranslate = [,];
var zoom = d3.zoom().scaleExtent([1, 10])
                    .translateExtent([[0,0], [gw*0.35,gh*0.35]])
                    .extent([[0,0], [gw*0.35,gh*0.35]])
                    .on("start", function(){
                      if(colorMenu.style("opacity")==1)hideMenu(colorMenu);
                      if(svgMenu.style("opacity")==1)hideMenu(svgMenu);
                    }).on("zoom", function () {
                      zoomTranslate[0] = d3.event.transform.x/0.35;
                      zoomTranslate[1] = d3.event.transform.y/0.35;
                      if(zoomScale!=d3.event.transform.k){
                        zoomScale = d3.event.transform.k;
                        svg.selectAll(".country").transition().ease(d3.easeLinear)
                            .delay(10).duration(50)
                            .attr("transform","translate("+zoomTranslate+")scale("+zoomScale+")");
                      }else{
                        svg.selectAll(".country")
                           .attr("transform","translate("+zoomTranslate+")scale("+zoomScale+")");
                      }
                     });

d3.select("body").on("keydown",function(){
  if(d3.event.key=="+"){
    svg.interrupt();
    zoom.scaleBy(svg.transition().duration(500).on("interrupt",function(){
      zoom.scaleBy(svg, 1.3);
    }), 1.3);
  }
  if(d3.event.key=="-"){
    svg.interrupt();
    zoom.scaleBy(svg.transition().duration(500).on("interrupt",function(){
      zoom.scaleBy(svg, 0.7);
    }), 0.7);
  }
  if(d3.event.key=="Escape"){
    d3.selectAll("*").interrupt();
  }

  if(d3.event.ctrlKey&&d3.event.key=="z"){
    undoAction();
  }else if(d3.event.ctrlKey&&d3.event.shiftKey&&d3.event.key=="Z"){
    redoAction();
  }
});

var svg = d3.select("body").append("svg")
                            .style("transform-origin","top left")
                            .style("transform","scale(0.35)")
                            .attr("width", gw)
                            .attr("height", gh)
                            .call(zoom).on("mousedown",function(e){
                              if(d3.select(d3.event.target.parentNode).attr("id") != "svgmenu" || d3.event.which == 3){
                                hideMenu(svgMenu);
                              }
                            }).on("contextmenu",function(){
                              d3.event.preventDefault();
                              if(!isSelected){
                                if(colorMenu.style("opacity")==1)hideMenu(colorMenu);
                                else showMenu(svgMenu);
                              }
                            });

d3.select("#info").on("click",function(){
  d3.selectAll("*").interrupt();
  var infoG = svg.append("g")
              .attr("width",gw)
              .attr("height",gh)
              .style("opacity",0);
  infoG.append("rect")
    .attr("x",0)
    .attr("y",0)
    .attr("width",gw)
    .attr("height",gh)
    .attr("fill","white")
    .style("opacity",0.8);

  var infoText0 = infoG.append("text")
                .attr("class","svgtext")
                .attr("x", 0)
                .attr("y", 0)
                .attr("width",gw)
                .attr("height",gh)
                .style("text-anchor", "middle")
                .attr("dy", "1.0em")
                .attr("dx", gw/2)
                .style("font-size", "60px")
                .style("opacity",1)
                .text("Press 'Esc' To Skip Animation");

  function addLine(line,dy,size){
    infoG.append("text")
          .attr("class","svgtext")
          .attr("x", 0)
          .attr("y", 0)
          .attr("width",gw)
          .attr("height",gh)
          .attr("dy", dy)
          .attr("dx", 100)
          .style("font-size", size)
          .style("opacity",1)
          .text(line);
  }
  addLine("Visualization by Daniel Josefson and Juraj Medzihorsky","2.0em","100px");
  addLine("using [d3js]","3.0em","100px");
  addLine("V-Dem Dataset 7.1 by Varieties of Democracy Institute, University of Gothenburg","5.0em","100px");
  addLine("https://www.v-dem.net/en/data/data-version-7-1/","6.0em","100px");

  addLine("Coppedge, Michael, John Gerring, Staffan I. Lindberg, Svend-Erik Skaaning, Jan Teorell, David Altman, Michael Bernhard,","14.0em","60px");
  addLine("M. Steven Fish, Adam Glynn, Allen Hicken, Carl Henrik Knutsen, Joshua Krusell, Anna Lührmann, Kyle L. Marquardt,","15.0em","60px");
  addLine("Kelly McMann, Valeriya Mechkova, Moa Olin, Pamela Paxton, Daniel Pemstein, Josefine Pernes, Constanza Sanhueza Petrarca,","16.0em","60px");
  addLine("Johannes von Römer, Laura Saxer, Brigitte Seim, Rachel Sigman, Jeffrey Staton, Natalia Stepanova, and Steven Wilson.","17.0em","60px");
  addLine("2017. “V-Dem Dataset v7.1” Varieties of Democracy (V-Dem) Project.","18.0em","60px");

  addLine("Pemstein, Daniel, Kyle L. Marquardt, Eitan Tzelgov, Yi-ting Wang, Joshua Krusell and Farhad Miri. 2017.","20.0em","60px");
  addLine("“The V-Dem Measurement Model: Latent Variable Analysis for Cross-National and Cross-Temporal Expert-Coded Data”.","21.0em","60px");
  addLine("University of Gothenburg, Varieties of Democracy Institute: Working Paper No. 21, 2nd edition.","22.0em","60px");

  var infoLogo = infoG.append("svg:image")
                .attr('x', gw-2200)
                .attr('y', gh-600)
                .attr('width', 1200)
                .attr('height', 400)
                .style("opacity", 1)
                .attr("xlink:href", "misc/V-Dem_institute_Logo.svg");

  var infoLogo2 = infoG.append("svg:image")
                .attr('x', gw-600)
                .attr('y', gh-600)
                .attr('width', 400)
                .attr('height', 400)
                .style("opacity", 1)
                .attr("xlink:href", "misc/gu_seal_2.svg");
  function endAnimation(){
    infoG.remove();
  }
  infoG.append("g").attr("id","animation")
                .transition().duration(17000)
                .on("end",endAnimation)
                .on("interrupt",endAnimation);

  infoG.transition().duration(2000).style("opacity",1)
    .transition().delay(12000).duration(2000).style("opacity",0);

  infoText0.transition().delay(6000).duration(2000).style("opacity",0);
});

function tutorialAnimation(){
  d3.selectAll("*").interrupt();
  var countryPositions = [];
  var rect,prevX,prevY,nextX,nextY;
  for(var i=0;i<globalCountries.length;i++){
    var countryGroup = d3.select("#"+globalCountries[i][2]);
    rect = countryGroup.select("#drag");
    prevX = rect.attr("x"),
    prevY = rect.attr("y"),
    nextX = wws*globalCountries[i][9],
    nextY = hws*globalCountries[i][10];
    if(prevX!=nextX||prevY!=nextY){
      countryGroup.data([{x: nextX,y: nextY}]);
      countryGroup.select("#drag").transition().duration(1000).attr("x",nextX).attr("y",nextY);
      countryGroup.select("#shine").transition().duration(1000).attr("x",nextX-1).attr("y",nextY-1);
      countryGroup.select("text").transition().duration(1000).attr("x",nextX).attr("y",nextY);
      countryGroup.select("svg").transition().duration(1000).attr("x",nextX).attr("y",nextY+18);
      countryPositions.push([countryGroup,prevX,prevY,nextX,nextY]);
    }
  }
  zoom.transform(svg, d3.zoomIdentity);

  var canada = d3.select("#CAN");
  var usa = d3.select("#USA");
  var mousePos = [0,0];

  var canadaPos = [parseFloat(canada.select("#drag").attr("x")),
                  parseFloat(canada.select("#drag").attr("y"))];
  var usaPos = [parseFloat(usa.select("#drag").attr("x")),
                parseFloat(usa.select("#drag").attr("y"))];
  var canadaNewPos = [canadaPos[0]+450,canadaPos[1]+200];
  var colorMenuPos = [canadaNewPos[0]+50,canadaNewPos[1]];
  var canadaColor = canada.select("#graphSvg").attr("stroke");

  colorMenu.node().parentNode.appendChild(colorMenu.node());

  var tutorialG = svg.append("g")
                      .attr("width",gw)
                      .attr("height",gh)
                      .style("opacity",0);
  var tutorialRect = tutorialG.append("rect")
                        .attr("x",0)
                        .attr("y",0)
                        .attr("width",gw)
                        .attr("height",gh)
                        .attr("fill","white")
                        .style("opacity",0.8);

  function createText(text,offset,size,opacity,x,y,w,h){
    if(!x){
      x = 0;
      y = 0;
      w = gw;
      h = gh;
    }
    var label = tutorialG.append("text")
                          .attr("class","svgtext")
                          .attr("x", x)
                          .attr("y", y)
                          .attr("width",w)
                          .attr("height",h)
                          .style("text-anchor", "middle")
                          .attr("dy", offset)
                          .attr("dx", w/2)
                          .style("font-size", size)
                          .style("opacity",opacity)
                          .text(text);
    return label;
  }
  var tutorialText0 = createText("Press 'Esc' To Skip Animation","1.0em","100px",1) ;
  var tutorialText = createText("", "4.0em","200px",0);
  var tutorialText2 = createText("","5.0em","200px",0);
  var mouseCursor = tutorialG.append("svg:image")
                            .attr('x', mousePos[0])
                            .attr('y', 0)
                            .attr('width', 100)
                            .attr('height', 100)
                            .style("opacity", 0)
                            .attr("xlink:href", "misc/cursor.png");

  var pathData = "M164.80339887498948,309L164.80339887498948,824L329.60679774997897,824"+
                  "L329.60679774997897,1133L494.4101966249684,1133L494.4101966249684,1442"+
                  "L659.2135954999579,1442L659.2135954999579,1648L988.8203932499368,1648"+
                  "L988.8203932499368,1236L824.0169943749474,1236L824.0169943749474,1133"+
                  "L988.8203932499368,1133L988.8203932499368,824L824.0169943749474,824"+
                  "L824.0169943749474,618L329.60679774997897,618L329.60679774997897,309"+
                  "L164.80339887498948,309"+
          "M1318.4271909999159,103L1318.4271909999159,412L1648.033988749895,412"+
                  "L1648.033988749895,618L1483.2305898749053,618L1483.2305898749053,721"+
                  "L1812.8373876248843,721L1812.8373876248843,824L2142.444185374863,824"+
                  "L2142.444185374863,1030L2472.0509831248423,1030L2636.8543819998317,1030"+
                  "L2636.8543819998317,618L2801.657780874821,618L2801.657780874821,515"+
                  "L2966.4611797498105,515L2966.4611797498105,412L2636.8543819998317,412"+
                  "L2636.8543819998317,103L2307.247584249853,103L2307.247584249853,206"+
                  "L2142.444185374863,206L2142.444185374863,309L1977.6407864998737,309"+
                  "L1977.6407864998737,412L1648.033988749895,412L1648.033988749895,309"+
                  "L1483.2305898749053,309L1483.2305898749053,103L1318.4271909999159,103"+

        "M1483.2305898749053,1236L1483.2305898749053,1545L1318.4271909999159,1545L1318.4271909999159,1648"+
                  "L1483.2305898749053,1648L1483.2305898749053,1751L1648.033988749895,1751L1648.033988749895,1648"+
                  "L1812.8373876248843,1648L1812.8373876248843,1854L1977.6407864998737,1854L1977.6407864998737,1957"+
                  "L2142.444185374863,1957L2142.444185374863,2060L2307.247584249853,2060L2307.247584249853,2163"+
                  "L2472.0509831248423,2163L2472.0509831248423,2060L2636.8543819998317,2060L2636.8543819998317,1957"+
                  "L2801.657780874821,1957L2801.657780874821,2163L2966.4611797498105,2163L2966.4611797498105,1957"+
                  "L2801.657780874821,1957L2801.657780874821,1648L2636.8543819998317,1648L2636.8543819998317,1545"+
                  "L2801.657780874821,1545L2801.657780874821,1339L2472.0509831248423,1339L2472.0509831248423,1133"+
                  "L1648.033988749895,1133L1648.033988749895,1236L1483.2305898749053,1236"+
        "M2472.0509831248423,1030L2472.0509831248423,1339L2966.4611797498105,1339L2966.4611797498105,1133"+
                  "L3131.2645786248004,1133L3131.2645786248004,1339L3296.06797749979,1339L3296.06797749979,1236"+
                  "L3460.871376374779,1236L3460.871376374779,1030L3625.6747752497686,1030L3625.6747752497686,1236"+
                  "L3790.478174124758,1236L3790.478174124758,1339L3625.6747752497686,1339L3625.6747752497686,1442"+
                  "L3790.478174124758,1442L3790.478174124758,1545L3955.2815729997474,1545L3955.2815729997474,1236"+
                  "L3790.478174124758,1236L3790.478174124758,1133L4284.888370749726,1133L4284.888370749726,1030"+
                  "L4120.084971874737,1030L4120.084971874737,927L4284.888370749726,927L4284.888370749726,618"+
                  "L4120.084971874737,618L4120.084971874737,927L3790.478174124758,927L3790.478174124758,824"+
                  "L3955.2815729997474,824L3955.2815729997474,618L3790.478174124758,618L3790.478174124758,515"+
                  "L3460.871376374779,515L3460.871376374779,618L2966.4611797498105,618L2966.4611797498105,721"+
                  "L2801.657780874821,721L2801.657780874821,824L2636.8543819998317,824L2636.8543819998317,1030"+
                  "L2472.0509831248423,1030"+
        "M3790.478174124758,1751L3790.478174124758,1957L3625.6747752497686,1957L3625.6747752497686,2060"+
                  "L3790.478174124758,2060L3955.2815729997474,2060L3955.2815729997474,2163L4120.084971874737,2163"+
                  "L4120.084971874737,2060L4284.888370749726,2060L4284.888370749726,1957L4120.084971874737,1957"+
                  "L4120.084971874737,1854L3955.2815729997474,1854L3955.2815729997474,1751L3790.478174124758,1751";

  var continent1 = createText("Americas","1.0em","150px",0,450,750,400,200),
      continent2 = createText("Europe","1.0em","150px",0,2000,450,400,200),
      continent3 = createText("Africa","1.0em","150px",0,2000,1350,400,200),
      continent4 = createText("Asia","1.0em","150px",0,3100,750,400,200),
      continent5 = createText("Oceania","1.0em","150px",0,3750,1850,400,200);
  var continentPath = tutorialG.append("svg")
                              .append("path")
                              .attr("opacity",0)
                              .attr("fill",d3.rgb(0,0,256))
                              .attr("stroke",d3.rgb(0,0,256))
                              .attr("fill-opacity",0.05)
                              .attr("d",pathData);

  function endAnimation(){
    if(countryPositions.length){
      for(var i=0;i<countryPositions.length;i++){
        nextX = countryPositions[i][1];
        nextY = countryPositions[i][2];
        prevX = countryPositions[i][3];
        prevY = countryPositions[i][4];
        countryPositions[i][0].data([{x: nextX,y: nextY}]);
        countryPositions[i][0].select("#drag").transition().duration(200).attr("x",nextX).attr("y",nextY);
        countryPositions[i][0].select("#shine").transition().duration(200).attr("x",nextX-1).attr("y",nextY-1);
        countryPositions[i][0].select("svg").transition().duration(200).attr("x",nextX).attr("y",nextY+18);
        countryPositions[i][0].select("text").transition().duration(200).attr("x",nextX).attr("y",nextY)
                        .on("end",function(){
                          checkCountryStack(actionCountries[i][0],prevX,prevY,nextX,nextY);
                        });
      }
    }

    usa.transition().duration(1000).attr("transform","");
    canada.select(".svgtext").transition().duration(1000).attr("opacity",1);
    canada.select("#graphSvg").transition().duration(1000)
          .attr("fill",canadaColor).attr("stroke",canadaColor);
    canada.transition().delay(1000).duration(1000).attr("transform","").on("end",function(){
      mouseCursor.remove();
      tutorialG.remove();
    });
  }
  tutorialG.append("g").attr("id","animation")
                      .transition().duration(79000)
                      .on("end",endAnimation)
                      .on("interrupt",endAnimation);

  tutorialG.transition().duration(1000).style("opacity",1)
          .transition().delay(76000).duration(1000).style("opacity",0);
  tutorialText0.transition().delay(6000).duration(2000).style("opacity",0);

  tutorialText.transition().delay(1000).duration(2000).text("This visualization lets you explore").style("opacity",1)
              .transition().delay(2000).duration(2000).style("opacity",0)
              .transition().duration(2000).text("the data is geographically organized").style("opacity",1)
              .transition().delay(1000).duration(2000).style("opacity",0);
  tutorialText2.transition().delay(1000).duration(2000).text("selected indicators from the V-Dem Dataset 7.1").style("opacity",1)
              .transition().delay(2000).duration(2000).style("opacity",0);

  tutorialRect.transition().delay(12000).duration(1000).style("opacity",0)
              .transition().delay(5000).duration(1000).style("opacity",0.8);

  continent1.transition().delay(13000).duration(2000).style("opacity",1)
            .transition().delay(1000).duration(2000).style("opacity",0);
  continent2.transition().delay(13000).duration(2000).style("opacity",1)
            .transition().delay(1000).duration(2000).style("opacity",0);
  continent3.transition().delay(13000).duration(2000).style("opacity",1)
            .transition().delay(1000).duration(2000).style("opacity",0);
  continent4.transition().delay(13000).duration(2000).style("opacity",1)
            .transition().delay(1000).duration(2000).style("opacity",0);
  continent5.transition().delay(13000).duration(2000).style("opacity",1)
            .transition().delay(1000).duration(2000).style("opacity",0);
  continentPath.transition().delay(13000).duration(2000).style("opacity",1)
              .transition().delay(1000).duration(2000).style("opacity",0);

  tutorialText.transition().delay(19000).duration(2000).text("you can grab a tile").style("opacity",1)
              .transition().delay(1000).duration(2000).style("opacity",0);
  tutorialText2.transition().delay(19000).duration(2000).text("with a left click").style("opacity",1)
               .transition().delay(1000).duration(2000).style("opacity",0);

  tutorialRect.transition().delay(24000).duration(1000).style("opacity",0);
  mouseCursor.transition().delay(25000).duration(1000).style("opacity",1)
            .transition().duration(3000).attr("x",canadaPos[0]).attr("y",canadaPos[1])
            .transition().duration(800).attr("xlink:href", "misc/grabCursor.png")
            .transition().duration(200).attr("xlink:href", "misc/grabbingCursor.png")
            .transition().duration(2000).attr("x",canadaNewPos[0]).attr("y",canadaNewPos[1])
            .transition().duration(800).attr("xlink:href", "misc/grabCursor.png")
            .transition().duration(200).attr("xlink:href", "misc/cursor.png")
            .transition().duration(2000).style("opacity",0);

  canada.transition().delay(30000).duration(2000).attr("transform","translate(450,200)")
        .transition().duration(1000).attr("transform","translate("+Math.round(450/wws)*wws+","+Math.round(200/hws)*hws+")");

  tutorialRect.transition().delay(35000).duration(1000).style("opacity",0.8)
            .transition().delay(5000).duration(1000).style("opacity",0);

  tutorialText.transition().delay(36000).duration(2000).text("change the color").style("opacity",1)
              .transition().delay(1000).duration(2000).style("opacity",0);
  tutorialText2.transition().delay(36000).duration(2000).text("with a right click").style("opacity",1)
              .transition().delay(1000).duration(2000).style("opacity",0);

  mouseCursor.transition().delay(42000).duration(1000).style("opacity",1)
            .transition().duration(1000).attr("x",canadaNewPos[0]+50).attr("y",canadaNewPos[1])
            .transition().duration(1000).attr("xlink:href", "misc/grabCursor.png")
            .transition().duration(1000).attr("xlink:href", "misc/pointerCursor.png")
            .transition().duration(1000).attr("x",canadaNewPos[0]+100).attr("y",canadaNewPos[1]+100)
            .transition().delay(1000).duration(1000).attr("xlink:href", "misc/cursor.png").style("opacity",0);

  colorMenu.attr("transform","translate("+colorMenuPos+")scale(2)")
          .transition().delay(45000).duration(200).style("opacity",1)
          .transition().delay(2000).duration(200).style("opacity",0);

  canada.select("#graphSvg").transition().delay(47000).duration(400)
        .attr("fill",d3.rgb(237,32,23)).attr("stroke",d3.rgb(237,32,23));;

  tutorialRect.transition().delay(49000).duration(1000).style("opacity",0.8)
          .transition().delay(5000).duration(1000).style("opacity",0);

  tutorialText.transition().delay(50000).duration(2000).text("zoom in and out").style("opacity",1)
              .transition().delay(1000).duration(2000).style("opacity",0);
  tutorialText2.transition().delay(50000).duration(2000).text("with the mouse wheel").style("opacity",1)
              .transition().delay(1000).duration(2000).style("opacity",0);

  svg.selectAll(".country").each(function(){
    if(this.id=="CAN"){
      d3.select(this).transition().delay(56000).duration(2000).attr("transform","scale(2)translate("+Math.round(450/wws)*wws+","+Math.round(200/hws)*hws+")")
        .transition().delay(1000).duration(2000).attr("transform","translate("+Math.round(450/wws)*wws+","+Math.round(200/hws)*hws+")");
    }else{
      d3.select(this).transition().delay(56000).duration(2000).attr("transform","scale(2)")
        .transition().delay(1000).duration(2000).attr("transform","");
    }
  });

  tutorialRect.transition().delay(61000).duration(1000).style("opacity",0.8)
          .transition().delay(5000).duration(1000).style("opacity",0);

  tutorialText.transition().delay(62000).duration(2000).text("and stack the tiles").style("opacity",1)
              .transition().delay(1000).duration(2000).style("opacity",0);

  mouseCursor.transition().delay(68000).duration(1000).style("opacity",1)
            .transition().duration(2000).attr("x",usaPos[0]).attr("y",usaPos[1])
            .transition().duration(800).attr("xlink:href", "misc/grabCursor.png")
            .transition().duration(200).attr("xlink:href", "misc/grabbingCursor.png")
            .transition().duration(2000).attr("x",canadaNewPos[0]).attr("y",canadaNewPos[1])
            .transition().duration(800).attr("xlink:href", "misc/grabCursor.png")
            .transition().duration(200).attr("xlink:href", "misc/cursor.png")
            .transition().delay(1000).duration(1000).style("opacity",0);
  usa.transition().delay(72000).duration(2000).attr("transform","translate(450,100)")
      .transition().duration(1000).attr("transform","translate("+Math.round(450/wws)*wws+","+Math.round(100/hws)*hws+")");
  canada.select(".svgtext").transition().delay(74000).duration(200).attr("opacity",0);

}

var tutorial = d3.select("#tutorial").on("click",tutorialAnimation);

var color = d3.rgb(220,220,220);
var colorPalette = [[d3.rgb(7,15,132),d3.rgb(146,19,19),d3.rgb(0,120,42),d3.rgb(0,0,0)],
                    [d3.rgb(0,0,256),d3.rgb(237,32,23),d3.rgb(144,200,152),d3.rgb(170,170,170)]];

var globalCountries = [];
var globalCountryYears = [["",[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[]
                                      ,[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[]]];
var globalIntervals = [0];
var intervalIndex = 95;
var graphIndex = 4;

var actions = [];
var actionIndex = -1,
    actionState = 0;

function addAction(action){
  if(actionState){
    actions.length = actionIndex;
  }else{
    if(actionIndex+1!=actions.length){
      actions.length = actionIndex+1;
    }
    actionIndex++;
  }
  actions.push(action);
  actionState = 0;
}
function undoAction(){
  if((actionIndex!=0||!actionState)&&actionIndex>-1){
    if(actionState&&actionIndex>0)actionIndex--;
    else actionState = 1;
    actions[actionIndex](1);
  }
}
function redoAction(){
  if((actionIndex+1!=actions.length||actionState)&&actionIndex>-1){
    if(!actionState&&actionIndex+1<actions.length)actionIndex++;
    else actionState = 0;
    actions[actionIndex](0);
  }
}

function changeYears(nextYearX,nextYearY){
  if(nextYearX!=yearX || nextYearY!=yearY){
    var prevYearX = yearX,
        prevYearY = yearY;
    yearX = nextYearX;
    yearY = nextYearY;
    addAction(function(undo){
      yearX = undo ? prevYearX : nextYearX;
      yearY = undo ? prevYearY : nextYearY;
      startYear.property("value",yearX);
      endYear.property("value",yearY);
      drawGraphs();
    });
    drawGraphs();
  }
}

function changeIntervals(nextIndex){
  var prevIndex = intervalIndex;
  addAction(function(undo){
    intervalIndex = undo ? prevIndex : nextIndex;
    intervalInput.property("value",intervalIndex);
    drawGraphs();
  });
  intervalIndex = nextIndex;
  drawGraphs();
}

function checkCountryStack(group,prevX,prevY,nextX,nextY){
  var px = parseInt(prevX),
      py = parseInt(prevY),
      nx = parseInt(nextX),
      ny = parseInt(nextY);
  var x,y;
  var thisGroup,rect;
  var lastText;
  d3.selectAll(".country").each(function(){
    thisGroup = d3.select(this);
    rect = thisGroup.select("#drag");
    x = parseInt(rect.attr("x"));
    y = parseInt(rect.attr("y"));
    if(x==nx && y==ny && this.id!=group.attr("id")){
      thisGroup.select("text").transition("textOpacity").duration(200).attr("opacity",0);
      group.select("text").transition("textOpacity").duration(200).attr("opacity",1);
    }else if(x==px && y==py && this.id!=group.attr("id")){
      lastText = thisGroup.select("text");
    }
  });
  if(lastText)lastText.transition("textOpacity").duration(500).attr("opacity",1);
}

var startYear = d3.select("#startYear").on("keyup",function(){
                  if(d3.event.key=="Enter"){
                    this.blur();
                    if(this.value>=minYear && this.value<endYear.property("value")){
                      changeYears(parseInt(this.value),yearY);
                    }
                  }
                });
var endYear = d3.select("#endYear").on("keyup",function(){
                  if(d3.event.key=="Enter"){
                    this.blur();
                    if(this.value<=maxYear && this.value>startYear.property("value")){
                      changeYears(yearX,parseInt(this.value));
                    }
                  }
                });

var intervalInput = d3.select("#interval").on("keyup",function(){
    if(d3.event.key=="Enter"){
      var value = parseInt(this.value);
      if(value>0 && value<=99){
        if(value!=intervalIndex)changeIntervals(value);
        this.blur();
      }
    }
  });

var selection = d3.select("#select").on("change",function(){
  var prevIndex = graphIndex,
      nextIndex = parseInt(this.value);
  if(prevIndex!=nextIndex){
    addAction(function(undo){
        graphIndex = undo ? prevIndex : nextIndex;
        selection.property("value",graphIndex);
        drawGraphs();
    });
    graphIndex = nextIndex;
    drawGraphs();
  }
});

d3.select("#startYearUp").on("mousedown", function(){
  this.src = "misc/buttonUpClicked.svg";
  clearTimeout(redrawTimer);
  var value = parseInt(startYear.property("value"));
  if(value+1<parseInt(endYear.property("value")))startYear.property("value",value+1);
  mouseholdTimer = setInterval(function(){
    value = parseInt(startYear.property("value"));
    if(value+1<parseInt(endYear.property("value")))startYear.property("value",value+1);
  },100);
}).on("mouseup mouseout",function(){
  this.src = "misc/buttonUp.svg";
  clearInterval(mouseholdTimer);
  changeYears(parseFloat(startYear.property("value")),parseFloat(endYear.property("value")));
});
d3.select("#startYearDown").on("mousedown", function(){
  this.src = "misc/buttonDownClicked.svg";
  clearTimeout(redrawTimer);
  var value = parseInt(startYear.property("value"));
  if(value>minYear)startYear.property("value",value-1);
  mouseholdTimer = setInterval(function(){
    value = parseInt(startYear.property("value"));
    if(value>minYear)startYear.property("value",value-1);
  },100);
}).on("mouseup mouseout",function(){
  this.src = "misc/buttonDown.svg";
  clearInterval(mouseholdTimer);
  changeYears(parseFloat(startYear.property("value")),parseFloat(endYear.property("value")));
});

d3.select("#endYearUp").on("mousedown", function(){
  this.src = "misc/buttonUpClicked.svg";
  clearTimeout(redrawTimer);
  var value = parseInt(endYear.property("value"));
  if(value<maxYear)endYear.property("value",value+1);
  mouseholdTimer = setInterval(function(){
    value = parseInt(endYear.property("value"));
    if(value<maxYear)endYear.property("value",value+1);
  },100);
}).on("mouseup mouseout",function(){
  this.src = "misc/buttonUp.svg";
  clearInterval(mouseholdTimer);
  changeYears(parseFloat(startYear.property("value")),parseFloat(endYear.property("value")));
});
d3.select("#endYearDown").on("mousedown", function(){
  this.src = "misc/buttonDownClicked.svg";
  clearTimeout(redrawTimer);
  var value = parseInt(endYear.property("value"));
  if(value-1>parseInt(startYear.property("value")))endYear.property("value",value-1);
  mouseholdTimer = setInterval(function(){
    value = parseInt(endYear.property("value"));
    if(value-1>parseInt(startYear.property("value")))endYear.property("value",value-1);
  },100);
}).on("mouseup mouseout",function(){
  this.src = "misc/buttonDown.svg";
  clearInterval(mouseholdTimer);
  changeYears(parseFloat(startYear.property("value")),parseFloat(endYear.property("value")));
});

d3.select("#intervalsUp").on("mousedown", function(){
  this.src = "misc/buttonUpClicked.svg";
  clearTimeout(redrawTimer);
  var value = parseInt(intervalInput.property("value"));
  if(value<99)intervalInput.property("value",value+1);
  mouseholdTimer = setInterval(function(){
    value = parseInt(intervalInput.property("value"));
    if(value<99)intervalInput.property("value",value+1);
  },100);
}).on("mouseup mouseout",function(){
  this.src = "misc/buttonUp.svg";
  clearInterval(mouseholdTimer);
  if(intervalIndex!=parseInt(intervalInput.property("value"))){
    changeIntervals(parseInt(intervalInput.property("value")));
  }
});
d3.select("#intervalsDown").on("mousedown", function(){
  this.src = "misc/buttonDownClicked.svg";
  clearTimeout(redrawTimer);
  var value = parseInt(intervalInput.property("value"));
  if(value-1>0)intervalInput.property("value",value-1);
  mouseholdTimer = setInterval(function(){
    value = parseInt(intervalInput.property("value"));
    if(value-1>0)intervalInput.property("value",value-1);
  },100);
}).on("mouseup mouseout",function(){
  this.src = "misc/buttonDown.svg";
  clearInterval(mouseholdTimer);
  if(intervalIndex!=parseInt(intervalInput.property("value"))){
    changeIntervals(parseInt(intervalInput.property("value")));
  }
});

function createMenus(){
  svgMenu = svg.append("g").attr("transform","translate(-1000,-1000)")
                          .attr("id","svgmenu")
                          .on("click",function(){
                            hideMenu(svgMenu);
                          }).style("opacity",0);
  svgMenu.append("rect").attr("x",0)
                        .attr("y",0)
                        .attr("rx", 6)
                        .attr("ry", 6)
                        .attr("width",162)
                        .attr("height",147)
                        .attr("fill",d3.rgb(100,100,100));
  svgMenu.append("rect").attr("x",3)
                        .attr("y",4)
                        .attr("rx",6)
                        .attr("ry",6)
                        .attr("width",156)
                        .attr("height",17)
                        .attr("fill",d3.rgb(248,248,248))
                        .on("click", function() { d3.event.stopPropagation(); });
  svgMenu.append("text").attr("class","svgtext")
                        .attr("x", 3)
                        .attr("y", 4)
                        .style("text-anchor", "middle")
                        .attr("dy", ".8em")
                        .attr("dx", 80)
                        .style("font-size", "18px")
                        .text("Tile Menu");

  function addMenu(y,menuText,clickFunction){
    svgMenu.append("rect").attr("x",3)
                          .attr("y",y)
                          .attr("rx",6)
                          .attr("ry",6)
                          .attr("width",156)
                          .attr("height",20)
                          .attr("cursor","pointer")
                          .attr("fill",d3.rgb(248,248,248))
                          .on("mouseover",function(){
                            d3.select(this).attr("fill",d3.rgb(200,220,240))
                          }).on("mouseout",function(){
                            d3.select(this).attr("fill",d3.rgb(248,248,248))
                          }).on("click",clickFunction);
    svgMenu.append("text").attr("class","svgtext")
                          .attr("x", 3)
                          .attr("y", y)
                          .style("text-anchor", "middle")
                          .attr("dy", ".8em")
                          .attr("dx", 80)
                          .style("font-size", "18px")
                          .text(menuText)
                          .attr("cursor", "pointer");
  }

  addMenu(22,"Reset Tiles",function(){
    var actionCountries = [];
    var countryGroup,rect,prevX,prevY,nextX,nextY;
    for(var i=0;i<globalCountries.length;i++){
      countryGroup = d3.select("#"+globalCountries[i][2]);
      rect = countryGroup.select("#drag");
      prevX = rect.attr("x"),
      prevY = rect.attr("y"),
      nextX = wws*globalCountries[i][9],
      nextY = hws*globalCountries[i][10];
      if(prevX!=nextX||prevY!=nextY){
        var thisGroup = countryGroup;
        thisGroup.data([{x: nextX,y: nextY}]);
        thisGroup.select("#drag").transition().duration(200).attr("x",nextX).attr("y",nextY);
        thisGroup.select("#shine").transition().duration(200).attr("x",nextX-1).attr("y",nextY-1);
        thisGroup.select("svg").transition().duration(200).attr("x",nextX).attr("y",parseFloat(nextY)+18);
        thisGroup.select("text").transition().duration(200).attr("x",nextX).attr("y",nextY).attr("opacity",1);

        actionCountries.push([countryGroup,prevX,prevY,nextX,nextY]);
      }
    }
    if(actionCountries.length){
      setTimeout(function(){
        for(var i=0;i<actionCountries.length;i++){
          countryGroup = actionCountries[i];
          nextX = countryGroup[3],
          nextY = countryGroup[4],
          prevX = countryGroup[1],
          prevY = countryGroup[2];
          checkCountryStack(countryGroup[0],prevX,prevY,nextX,nextY);
        }
      },300);

      addAction(function(undo){
        var actionGroup,actionPrevX,actionPrevY,actionNextX,actionNextY;
        for(var i=0;i<actionCountries.length;i++){
          actionGroup = actionCountries[i];
          actionNextX = undo ? actionGroup[1] : actionGroup[3],
          actionNextY = undo ? actionGroup[2] : actionGroup[4],
          actionPrevX = undo ? actionGroup[3] : actionGroup[1],
          actionPrevY = undo ? actionGroup[4] : actionGroup[2];
          actionGroup[0].data([{x: actionNextX,y: actionNextY}]);
          actionGroup[0].select("#drag").transition().duration(200).attr("x",actionNextX).attr("y",actionNextY);
          actionGroup[0].select("#shine").transition().duration(200).attr("x",actionNextX-1).attr("y",actionNextY-1);
          actionGroup[0].select("svg").transition().duration(200).attr("x",actionNextX).attr("y",parseFloat(actionNextY)+18);
          actionGroup[0].select("text").transition("textPosition").duration(200).attr("x",actionNextX).attr("y",actionNextY);
        }
        setTimeout(function(){
          for(var i=0;i<actionCountries.length;i++){
            actionGroup = actionCountries[i];
            actionNextX = undo ? actionGroup[1] : actionGroup[3],
            actionNextY = undo ? actionGroup[2] : actionGroup[4],
            actionPrevX = undo ? actionGroup[3] : actionGroup[1],
            actionPrevY = undo ? actionGroup[4] : actionGroup[2];
            checkCountryStack(actionGroup[0],actionPrevX,actionPrevY,actionNextX,actionNextY);
          }
        },300);
      });
    }
  });
  addMenu(42,"Reset Years",function(){
    if(startYear.property("value")!=minYear||endYear.property("value")!=maxYear){
      startYear.property("value",minYear);
      endYear.property("value",maxYear);
      changeYears(minYear,maxYear);
    }
  });
  addMenu(62,"Reset Zoom",function(){
    zoom.transform(svg, d3.zoomIdentity);
  });
  addMenu(82,"Transparent Tiles",function(){
    if(d3.select(this.nextSibling).text()=="Transparent Tiles"){
      d3.select(this.nextSibling).text("Non-transparent Tiles");
      alpha = 0;
      d3.selectAll(".dragrect").each(function(){
        d3.select(this).attr("fill-opacity",alpha);
      });
    }else{
      d3.select(this.nextSibling).text("Transparent Tiles");
      alpha = 0.2;
      d3.selectAll(".dragrect").each(function(){
        d3.select(this).attr("fill-opacity",alpha);
      });
    }
  });
  addMenu(102,"Undo Action",undoAction);
  addMenu(122,"Redo Action",redoAction);

  colorMenu = svg.append("g")
                .attr("id","#colorMenu")
                .attr("transform","translate(-1000,-1000)")
                .style("opacity",0);
  colorMenu.append("rect")
          .attr("x",-2)
          .attr("y",-2)
          .attr("rx",6)
          .attr("ry",6)
          .attr("width",124)
          .attr("height",64)
          .attr("fill",d3.rgb(100,100,100));
  for(var i=0;i<2;i++){
    for(var j=0;j<4;j++){
      colorMenu.append("rect")
              .attr("x",j*30)
              .attr("y",i*30)
              .attr("rx",6)
              .attr("ry",6)
              .attr("width",30)
              .attr("height",30)
              .attr("fill",colorPalette[i][j])
              .attr("stroke",d3.rgb(40,40,40))
              .attr("cursor","pointer")
              .on("click",function(){
                d3.select(this).attr("cursor","auto")
                color = d3.select(this).attr("fill");
                var prevColor = selectedGraph.attr("fill");
                if(color!=prevColor){
                  var actionGraph = selectedGraph;
                  var nextColor = color;
                  addAction(function(undo){
                    var actionColor;
                    if(undo)actionColor=prevColor;
                    else actionColor=nextColor;
                    actionGraph.transition("color")
                                .duration(100)
                                .attr("fill",actionColor)
                                .attr("stroke",actionColor);
                  });

                  selectedGraph.transition("color")
                              .duration(200)
                              .attr("fill",color)
                              .attr("stroke",color);
                }
                var colorRect = d3.select(this);
                setTimeout(function(){
                  colorRect.attr("cursor","pointer");
                },100);
                colorMenu.style("opacity",0).attr("transform","translate(-1000,1000)");
              });
    }
  }
}


function createNewTile(country){
  var tileUnder;
  var drag = d3.drag()
    .on("drag", dragmove)
    .on("end",dragend)
    .on("start",dragstart);
  var newg = svg.append("g").data([{x: wws*country[9], y: hws*country[10]}])
                            .attr("id",country[2])
                            .attr("class","country")
                            .call(drag)
                            .on("contextmenu",function(){
                                selectedGraph = graph;
                                if(svgMenu.style("opacity")==1){
                                  hideMenu(svgMenu);
                                }else{
                                  showMenu(colorMenu);
                                }
                             })
			    .on("mouseover",function(){
              isSelected = 1;
				      dragrect.attr("fill-opacity", alpha+0.3);
          }).on("mouseout",function(){
              isSelected = 0;
				      dragrect.attr("fill-opacity", alpha);
          });
  newg.attr("transform","translate(0,0)");

  var shinerect = newg.append("rect")
    .attr("class","dragrect")
    .attr("id","shine")
    .attr("x", function(d) { return d.x-1; })
    .attr("y", function(d) { return d.y-1; })
    .attr("rx", 6)
    .attr("ry", 6)
    .attr("height", height)
    .attr("width", width)
    .attr("stroke-width",0.3)
    .attr("stroke",d3.rgb(220,220,220))
    .style("stroke-dasharray",width-6+","+parseInt(width+height-10))
    .attr("fill", d3.rgb(240,240,240))
    .attr("fill-opacity", alpha)
    .attr("cursor", "grab");

  var dragrect = newg.append("rect")
    .attr("class","dragrect")
    .attr("id","drag")
    .attr("x", function(d) { return d.x; })
    .attr("y", function(d) { return d.y; })
    .attr("rx", 6)
    .attr("ry", 6)
    .attr("height", height)
    .attr("width", width)
    .attr("stroke","black")
    .attr("stroke-opacity",0.4)
    .attr("stroke-width",1)
    .style("stroke-dasharray","0,"+parseInt(width-6)+","+parseInt(width+height-6)+","+height)
    .attr("fill", d3.rgb(230,230,230))
    .attr("fill-opacity", alpha)
    .attr("cursor", "grab");

  var text = newg.append("text")
    .attr("class","svgtext")
    .attr("x", function(d) { return d.x; })
    .attr("y", function(d) { return d.y; })
    .style("text-anchor", "middle")
    .attr("dy", "0.8em")
    .attr("dx", width/2)
    .style("font-size", "20px")
    .text(country[0])
    .attr("cursor", "grab");

  if(text.node().getComputedTextLength()>width-8){
    text.text(country[2]);
  }

  var graph = newg.append("svg")
    .attr("id","graphSvg")
    .attr("x", function(d) { return d.x; })
    .attr("y", function(d) { return d.y+18; })
    .attr("rx", 6)
    .attr("ry", 6)
    .attr("fill", d3.rgb(0,0,256))
    .attr("stroke", d3.rgb(0,0,256))
    .attr("cursor", "grab")
    .attr("height", height-15)
    .attr("stroke-width", 1)
    .attr("width", 0);

  var dragInitiated = false;
  var ix,iy,ex,ey;
  var grabPos;
  function dragmove(d){
    if(dragInitiated){
      var c = d3.mouse(this)
      tx = Math.max(0, Math.min(gw - width, c[0]/0.35-ex));
      ty = Math.max(0, Math.min(gh - height, c[1]/0.35-ey));
      dragrect.attr("x",d.x=tx).attr("y",d.y=ty);
      text.attr("x",d.x=tx).attr("y",d.y=ty);
      graph.attr("x",d.x=tx).attr("y",d.y=ty+18);
      shinerect.attr("x",d.x=tx-1).attr("y",d.y=ty-1);
    }
  }

  function dragstart(d){
    ix = parseFloat(dragrect.attr("x"));
    iy = parseFloat(dragrect.attr("y"));
    ex = d3.mouse(this)[0]/0.35 - ix;
    ey = d3.mouse(this)[1]/0.35 - iy;
    hideMenu(svgMenu);
    hideMenu(colorMenu);
    dragInitiated = true;
    this.parentNode.appendChild(this);
    dragrect.attr("cursor", "grabbing").transition().duration(200)
            .attr("stroke-width",1.5)
            .style("stroke-dasharray","0,"+parseInt(width-6.5)+","+parseInt(width+height-4)+","+height)
            .attr("height", height+0.5).attr("width", width+0.5);
    text.attr("cursor", "grabbing").transition().duration(200).style("font-size", "20.2px").attr("dy", "0.79em");
    graph.attr("cursor", "grabbing");
    shinerect.attr("cursor", "grabbing");
  }

  function dragend(d){
    if(dragInitiated){
      tx = Math.round(d.x/wws)*wws;
      ty = Math.round(d.y/hws)*hws;
      dragrect.attr("cursor","grab").transition().duration(200).attr("x",d.x=tx).attr("y",d.y=ty)
              .attr("stroke-width",1).attr("stroke-opacity",0.35)
              .attr("height", height).attr("width", width)
              .style("stroke-dasharray","0,"+parseInt(width-6)+","+parseInt(width+height-6)+","+height);
      shinerect.attr("cursor","grab").transition().duration(200).attr("height", height).attr("width", width).attr("x",d.x=tx-1).attr("y",d.y=ty-1);
      text.attr("cursor","grab").transition("textPosition").duration(200).attr("x",d.x=tx).attr("y",d.y=ty).style("font-size", "20px").attr("dy", "0.8em");
      graph.attr("cursor","grab").transition().duration(200).attr("x",d.x=tx).attr("y",d.y=ty+18)
            .on("end",function(){
              if(tx!=ix || ty!=iy){
                var tileUnder = checkCountryStack(newg,ix,iy,tx,ty);
                var actionDragrect = dragrect;
                var actionShinerect = shinerect;
                var actionText = text;
                var actionGraph = graph;
                var actionGroup = newg;
                var prevX = ix,
                    prevY = iy,
                    nextX = tx,
                    nextY = ty;
                addAction(function(undo){
                  var actionNextX = undo ? prevX : nextX,
                      actionNextY = undo ? prevY : nextY,
                      actionPrevX = undo ? nextX : prevX,
                      actionPrevY = undo ? nextY : prevY;
                  actionGroup.data([{x: actionNextX,y: actionNextY}]);
                  actionDragrect.transition().duration(200).attr("x",actionNextX).attr("y",actionNextY);
                  actionShinerect.transition().duration(200).attr("x",actionNextX-1).attr("y",actionNextY-1);
                  actionGraph.transition().duration(200).attr("x",actionNextX).attr("y",actionNextY+18);
                  actionText.transition("textPosition").duration(200).attr("x",actionNextX).attr("y",actionNextY);
                  setTimeout(function(){
                      actionText.transition("textn").duration(200).attr("opacity",1);
                      checkCountryStack(actionGroup,actionPrevX,actionPrevY,actionNextX,actionNextY);
                    },300);
                });
              }
            });
      dragInitiated = false;
    }
  }
}

function drawGraph(polyarchies){;
  polyarchies[2][0].transition()
                    .delay(100)
                    .ease(d3.easeLinear)
                    .duration(2000)
                    .attr("d", polyarchies[3][0]);
  polyarchies[2][1].transition()
                    .delay(100)
                    .ease(d3.easeLinear)
                    .duration(2000)
                    .attr("d",polyarchies[3][1]);
}

function computeGraph(polyarchies){
  var countryData = "";
  var countryData2 = "";
  var countryData3 = "";
  var countryData4 = "";
  var countryData5 = "";

  var x,z,y;
  var previousYear = polyarchies[1][0]-1;

  for(var i=0;i<polyarchies[1].length;i++){
    if(polyarchies[1][i]-1!=previousYear){
      countryData5 += countryData;
      countryData4 += countryData2+countryData3;
      countryData2 = "";
      countryData3 = "";
      countryData = "";
    }
    previousYear = polyarchies[1][i];
    x = (polyarchies[1][i]-yearX)*interval+4;
    y = 80 - polyarchies[graphIndex][i]*75;
    z = 75*globalIntervals[intervalIndex]*polyarchies[graphIndex+17][i];

    if(countryData)countryData += "L" + x + "," + y;
    else countryData = "M" + x + "," + y;

    if(countryData2)countryData2 += "L" + x + "," + parseFloat(y+z);
    else countryData2 = "M" + x + "," + parseFloat(y-z) + "L" + x + "," + parseFloat(y+z);
    countryData3 = "L" + x + "," + parseFloat(y-z) + countryData3;
  }
  polyarchies[3][0] = countryData5 + countryData;
  polyarchies[3][1] = countryData4 + countryData2 + countryData3;
}

function oneTile(polyarchies){
  var g = d3.select("#"+polyarchies[0].replace(/"/g,""));
  if(!g.empty()){
    var countryGraph = g.select("svg");
    polyarchies[2].push(countryGraph.append("path").attr("id","graph")
                                                  .attr("fill", "none"));
    polyarchies[2].push(countryGraph.append("path").attr("id","graph")
                                                     .attr("fill-opacity",0.2)
                                                     .attr("stroke-opacity",0));
    polyarchies[2].push(countryGraph);
  }
}

function drawGraphs(){
  interval = (width-8)/(yearY-yearX);

  for(var i=0;i<globalCountryYears.length;i++)computeGraph(globalCountryYears[i]);
  for(var i=0;i<globalCountryYears.length;i++)drawGraph(globalCountryYears[i]);
}

function loadIntervals(intervals){
  for(var i=1;i<intervals.length;i++){
    globalIntervals.push(intervals[i].split(",")[1]);
  }
}

function loadDescriptions(descriptions){
  var description;
  for(var i=1;i<descriptions.length;i++){
    description = descriptions[i].split(",")[1];
    if(description){
      selection.append("option")
              .attr("value",i+3)
              .text(description);
    }
  }
}

function loadData(countryYears){
  var countryYear = [];
  globalCountryYears[0][0] = countryYears[1].split(",")[1];
  for(var i=1;i<countryYears.length;i++){
    countryYear = countryYears[i].split(",");
    if(countryYear[1]!=globalCountryYears[globalCountryYears.length-1][0]&&countryYear[1]){
      oneTile(globalCountryYears[globalCountryYears.length-1]);
      globalCountryYears.push(["",[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[]
                                          ,[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[]]);
      globalCountryYears[globalCountryYears.length-1][0] = countryYear[1];
    }
    if(!isNaN(countryYear[3])){
      globalCountryYears[globalCountryYears.length-1][1].push(parseFloat(countryYear[2]));

      for(var j=3;j<20;j++){
        globalCountryYears[globalCountryYears.length-1][j+1].push(parseFloat(countryYear[j]));
        if(j==3)globalCountryYears[globalCountryYears.length-1][j+18].push(parseFloat(countryYear[35]));
        else if(j==17)globalCountryYears[globalCountryYears.length-1][j+18].push(0);
        else if(j==18||j==19)globalCountryYears[globalCountryYears.length-1][j+18].push(parseFloat(countryYear[j+15]));
        else globalCountryYears[globalCountryYears.length-1][j+18].push(parseFloat(countryYear[j+16]));
      }
    }
  }
  oneTile(globalCountryYears[globalCountryYears.length-1]);
  drawGraphs();

  d3.selectAll("#graphSvg").transition()
                          .delay(10)
                          .ease(d3.easeLinear)
                          .duration(2000)
                          .attr("width",width)
                          .on("interrupt",function(){
                            d3.select(this).attr("width",width);
                          });

}

function loadWorldMap(countries){
  for(var i=1;i<countries.length;i++){
    if(countries[i]!=""){
      globalCountries.push(countries[i].split(","));
      createNewTile(globalCountries[globalCountries.length-1]);
    }
  }
}

function readTextFile(filepath){
  var file = new XMLHttpRequest();
  file.open("GET", filepath, false);
  file.send(null);
  return file.responseText.split("\n");
}

createMenus();
loadWorldMap(readTextFile("misc/worldtilegrid_vdem.csv"));
loadIntervals(readTextFile("misc/intervals.csv"));
loadData(readTextFile("misc/vdem71selection.csv"));
loadDescriptions(readTextFile("misc/descriptions.csv"));


if(!localStorage.getItem('tutorial')){
  localStorage.setItem('tutorial', 1);
  setTimeout(tutorialAnimation,2000);
}
