// Vue.filter('formatDate', function(d) {
// 	if(!window.Intl) return d;
// 	return new Intl.DateTimeFormat('en-US').format(new Date(d));
// }); 

// shared arrays with each calendar years data
let filtered2018 = []
let filtered2017 = []
let filtered2016 = []

// default filters
let startDate = '2016-01-01'
let endDate = '2018-12-30'
let rating = 'All'

// default stats
let count = 0
let max = 0


// helper functions to get date into usable format
let pad = function(str) {
  return function(str) {
    while (str.length < n) {
      str = '0'+ str;
    }
    return str;
  }
};

let unpad = function(str) {
	str.replace(/-0/g, '-')
}





function requestData() {
	$.get( `/api/reviewFilter?startDate=${encodeURIComponent(startDate)}&endDate=${encodeURIComponent(endDate)}&rating=${rating}`, function( data ) {
	  	max = data.data.length
		$("#recordCount").text(max)
		updateFilters(data)
	});
}

function updateFilters(data) {
	let filtered2018 = []
	let filtered2017 = []
	let filtered2016 = []
	let newMax = 0;
	console.log('map data')
	data.chartData.map(function(a){
		if(a.count > newMax) newMax = a.count;
		if(a.date.startsWith('2018')){
			filtered2018.push([a.date, a.count])
		}
		if(a.date.startsWith('2017')){
			filtered2017.push([a.date, a.count])
		}
		if(a.date.startsWith('2016')){
			filtered2016.push([a.date, a.count])
		}
	})


	// console.log(data.length)
	// console.log('setting chart options', filtered2018, filtered2017, filtered2016)
	myChart.setOption({
			visualMap: {
				max: newMax
			},
		    series: [{
		        calendarIndex: 0,
		        data: filtered2018
		    }, {
		        calendarIndex: 1,
		        data: filtered2017
		    }, {
		        calendarIndex: 2,
		        data: filtered2016
		    }]
	});
	this.max = newMax;
	this.searching = false;
	this.results = data;
	this.count = data.length;
}

// Watch the filters in the header
$( "#startDateBox" ).change(function() {
	startDate = $("#startDateBox").val()
	requestData()
});

$( "#endDateBox" ).change(function() {
	endDate = $("#endDateBox").val()
	requestData()
});

$( "#ratingSelector" ).change(function() {
	rating = $("#ratingSelector").val()
	requestData()
});

$("#clearFilters").click(function(event){
	event.preventDefault()
	startDate = '2016-01-01'
	endDate = '2018-12-30'
	rating = 'All'
	$("#startDateBox").val(startDate)
	$("#endDateBox").val(endDate)
	$("#ratingSelector").val(rating)
	requestData()

})

let myChart = echarts.init(document.getElementById('calendarChart'));

function getVirtulData(year) {
    let responseData;
	switch(year) {
	    case '2016':
	        responseData = filtered2016;
	        break;
	    case '2017':
	    	responseData = filtered2017;
	        break;
	    default:
	        responseData = filtered2018;
	} 
    return responseData;
}

option = {
    tooltip: {
        position: 'top'
    },
    visualMap: {
        min: 1,
        max: 50,
        calculable: true,
        orient: 'horizontal',
        left: 'center',
        top: 'top',
        show: false
    },
    calendar: [
    {
        range: '2018',
        cellSize: ['auto', 20]
    },
    {
        top: 250,
        range: '2017',
        cellSize: ['auto', 20]
    },
    {
        top: 450,
        range: '2016',
        cellSize: ['auto', 20],
        right: 5
    }],

    series: [{
        type: 'heatmap',
        coordinateSystem: 'calendar',
        calendarIndex: 0,
        data: getVirtulData(2018),
        tooltip: {
        	formatter: function (params) {
        		return `<b>Reviews:</b> ${params.value[1]}</br><b>Date:</b> ${params.value[0]}`
        	}
        }
    }, {
        type: 'heatmap',
        coordinateSystem: 'calendar',
        calendarIndex: 1,
        data: getVirtulData(2017),
        tooltip: {
        	formatter: function (params) {
        		return `<b>Reviews:</b> ${params.value[1]}</br><b>Date:</b> ${params.value[0]}`
        	}
        }
    }, {
        type: 'heatmap',
        coordinateSystem: 'calendar',
        calendarIndex: 2,
        data: getVirtulData(2016),
        tooltip: {
        	formatter: function (params) {
        		return `<b>Reviews:</b> ${params.value[1]}</br><b>Date:</b> ${params.value[0]}`
        	}
        }
    }]

};


myChart.setOption(option); 


$( document ).ready(function() {
    console.log( "page loaded - request data" );
    requestData()

    // load filters with defaults
    $("#startDateBox").val(startDate)
    $("#endDateBox").val(endDate)
    $("#ratingSelector").val(rating)

});

myChart.on('click', function (params) {
    startDate = params.value[0]
    endDate = params.value[0]
    requestData()
});