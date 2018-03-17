queue()
    .defer(d3.json, "/massmurders/projects")
    .defer(d3.json, "/static/us_states/us-states.json")
    .await(makeGraphs);

function makeGraphs(error, projectsJson, statesJson) {

	//Clean projectsJson data
	var massmurderProjects = projectsJson;

//	alert(donorschooseProjects)
//	alert(donorschooseProjects.length)
//	//var dateFormat = d3.time.format("%Y-%m-%d");
    var dateFormat = d3.time.format("%Y-%m-%d %H:%M:%S")
	massmurderProjects.forEach(function(d) {
		d["date"] = dateFormat.parse(d["date"]);
		d["date"].setDate(1);
		d["deaths"] = +d["deaths"];
	});


	//Create a Crossfilter instance
	var ndx = crossfilter(massmurderProjects);

	//Define Dimensions
	var dateDim = ndx.dimension(function(d) { return d["date"]; });
	var raceTypeDim = ndx.dimension(function(d) { return d["race"]; });
	var motiveDim = ndx.dimension(function(d) { return d["motive"]; });
	var stateDim = ndx.dimension(function(d) { return d["state"]; });
	var deathsDim  = ndx.dimension(function(d) { return d["deaths"]; });
	var fatesDim = ndx.dimension(function(d) { return d["shooter_fate"]; });


	//Calculate metrics
	var numShootingsByDate = dateDim.group();
	var numShootingsByRace = raceTypeDim.group();
	var numShootingsByMotive = motiveDim.group();
	var totalDeathByState = stateDim.group().reduceSum(function(d) {
		return d["deaths"];
	});
	var deathByFate = fatesDim.group();

	var all = ndx.groupAll();
	var totalDeaths = ndx.groupAll().reduceSum(function(d) {return d["deaths"];});

	var max_state = totalDeathByState.top(1)[0].value;

	//Define values (to be used in charts)
	var minDate = dateDim.bottom(1)[0]["date"];
	var maxDate = dateDim.top(1)[0]["date"];

    //Charts
	var timeChart = dc.barChart("#time-chart");
	var raceTypeChart = dc.rowChart("#race-row-chart");
	var motiveTypeChart = dc.rowChart("#motive-row-chart-2");
	var usChart = dc.geoChoroplethChart("#us-chart");
	var numberShootingsND = dc.numberDisplay("#number-shooting-nd");
	var totalDeathsND = dc.numberDisplay("#total-deaths-nd");
	var fateChart = dc.pieChart("#fate-row-chart-2");

	numberShootingsND
		.formatNumber(d3.format("d"))
		.valueAccessor(function(d){return d; })
		.group(all);

	totalDeathsND
		.formatNumber(d3.format("d"))
		.valueAccessor(function(d){return d; })
		.group(totalDeaths)
		.formatNumber(d3.format(".3s"));

	timeChart
		.width(600)
		.height(160)
		.margins({top: 10, right: 50, bottom: 30, left: 50})
		.dimension(dateDim)
		.group(numShootingsByDate)
		.transitionDuration(500)
		.x(d3.time.scale().domain([minDate, maxDate]))
		.elasticY(true)
		.xAxisLabel("Year")
		.yAxis().ticks(4);

	raceTypeChart
        .width(900)
        .height(250)
        .dimension(raceTypeDim)
        .group(numShootingsByRace)
        .xAxis().ticks(4);
//        .yAxis().ticks(14)

	motiveTypeChart
		.width(900)
		.height(250)
//		.x(d3.scale.ordinal())
//		.xUnits(dc.units.ordinal)
        .dimension(motiveDim)
        .group(numShootingsByMotive)
        .xAxis().ticks(4);
//        .yAxis().ticks(14)
            

    fateChart
        .width(700)
        .height(250)
        .radius(125)
        .innerRadius(50)
        .dimension(fatesDim)
        .group(deathByFate)

	usChart.width(1000)
		.height(330)
		.dimension(stateDim)
		.group(totalDeathByState)
		.colors(["#E2F2FF", "#C4E4FF", "#9ED2FF", "#81C5FF", "#6BBAFF", "#51AEFF", "#36A2FF", "#1E96FF", "#0089FF", "#0061B5"])
		.colorDomain([0, max_state])
		.overlayGeoJson(statesJson["features"], "state", function (d) {
			return d.properties.name;
		})
		.projection(d3.geo.albersUsa()
    				.scale(600)
    				.translate([340, 150]))
		.title(function (p) {
			return "State: " + p["key"]
					+ "\n"
					+ "Total Deaths: " + Math.round(p["value"]);
		})

    dc.renderAll();

};