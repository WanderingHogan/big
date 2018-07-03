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

let categories = ['edibles', 'hemp-cbd']

// default stats
let count = 0
let max = 0


// helper functions to get date into usable format
let pad = function(str) {
    return function(str) {
        while (str.length < n) {
            str = '0' + str;
        }
        return str;
    }
};

let unpad = function(str) {
    str.replace(/-0/g, '-')
}





function requestData() {
	if(categories.length === 0){
		// tells the backend to look for category named cats, returning no records TODO: this is stupid
		categories.push('cats')
	}
    $.get(`/api/reviewFilter?startDate=${encodeURIComponent(startDate)}&endDate=${encodeURIComponent(endDate)}&rating=${rating}&category=${encodeURIComponent(categories)}`, function(response) {

        max = response.data.length
        $("#recordCount").text(max)
        updateFilters(response)
        $('#cardRow').empty()
        response.data.map(function(record) {
            generateCards(record)
        })
    });
}

function createStarHtml(numberOfStars) {
    let checkedStar = `<span class="fa fa-star checked"></span>`
    let uncheckedStar = '<span class="fa fa-star"></span>'
    let responseStarHtml = ''


	for(var i=0; i < 5; i++){
		if(i < numberOfStars){
			responseStarHtml += checkedStar
		}
		else {
			responseStarHtml += uncheckedStar	
		}
	}

    return responseStarHtml
    
}

function categoryPill(cat){
	let responseString;
	switch(cat){
		case "edibles":
			responseString = `<span class="badge badge-info"><i class="fas fa-utensils"></i>&nbsp;Edible</span>`;
			break;
		case "hemp-cbd":
			responseString = `<span class="badge badge-danger"><i class="fas fa-cannabis"></i>&nbsp;Hemp CBD</span>`;
			break;
	}
	return responseString
}

function generateCards(record) {
	// console.log(record)
    let starTemplate = createStarHtml(record.rating)
    let dateParse = new Date(record.timestamp)
    let friendlyDate = `${dateParse.getMonth()+1}/${dateParse.getDate()}/${dateParse.getFullYear()}`
    let cardTemplate = `
    <div class="col-sm-12 col-md-6 col-lg-6">
    	<div class="card stylisedCard">
				<div class="card-body">
				<h5 class="card-title"><b>${record.product}</b></h5>
				<h5>${starTemplate} | ${friendlyDate} | ${categoryPill(record.category)}</h5>
				<b>Review:</b>
		    	<p class="card-text">${record.text}</p>
		  	</div>
		</div>
	</div>`

    $('#cardRow').append(cardTemplate)
}

function updateFilters(data) {
    let filtered2018 = []
    let filtered2017 = []
    let filtered2016 = []

    let newMax = 0;

    data.chartData.map(function(a) {
        if (a.count > newMax) newMax = a.count;
        if (a.date.startsWith('2018')) {
            filtered2018.push([a.date, a.count])
        }
        if (a.date.startsWith('2017')) {
            filtered2017.push([a.date, a.count])
        }
        if (a.date.startsWith('2016')) {
            filtered2016.push([a.date, a.count])
        }
    })

    calendarChart.setOption({
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

    donutChart.setOption({
    	series: [{
            data:[
                {value: data.reviewStars['1star'], name:'1 Star Reviews'},
                {value: data.reviewStars['2star'], name:'2 Star Reviews'},
                {value: data.reviewStars['3star'], name:'3 Star Reviews'},
                {value: data.reviewStars['4star'], name:'4 Star Reviews'},
                {value: data.reviewStars['5star'], name:'5 Star Reviews'}
            ]
        }]
    })
    this.max = newMax;
    this.searching = false;
    this.results = data;
    this.count = data.length;
}

// Watch the filters in the header
$("#startDateBox").change(function() {
    startDate = $("#startDateBox").val()
    requestData()
});

$("#endDateBox").change(function() {
    endDate = $("#endDateBox").val()
    requestData()
});

$("#ratingSelector").change(function() {
    rating = $("#ratingSelector").val()
    requestData()
});

$("#toggleCategoryEdible").click(function(event) {
    event.preventDefault()
    // showEdibles = !showEdibles;
    let edibleIndex = categories.indexOf('edibles');
	if (edibleIndex !== -1) {
		categories.splice(edibleIndex, 1);
		$('#toggleCategoryEdibletext').html(`&nbsp;Edibles (Off)`)
	}
	else {
		categories.push('edibles')
		$('#toggleCategoryEdibletext').html(`&nbsp;Edibles (On)`)
	}
	console.log('categories', categories)
    requestData()

})

$("#toggleCategoryHempCBD").click(function(event) {
    event.preventDefault()
    let hempcbdIndex = categories.indexOf('hemp-cbd');
	if (hempcbdIndex !== -1) {
		categories.splice(hempcbdIndex, 1)
		$('#toggleCategoryHempCBDtext').html(`&nbsp;Hemp CBD (Off)`)
	}
	else {
		categories.push('hemp-cbd')
		$('#toggleCategoryHempCBDtext').html(`&nbsp;Hemp CBD (On)`)
	}
	console.log('categories', categories)
    requestData()

})

$("#clearFilters").click(function(event) {
    event.preventDefault()
    startDate = '2016-01-01'
    endDate = '2018-12-30'
    rating = 'All'
    categories = ['edibles', 'hemp-cbd']
    $("#startDateBox").val(startDate)
    $("#endDateBox").val(endDate)
    $("#ratingSelector").val(rating)
    requestData()

})


let calendarChart = echarts.init(document.getElementById('calendarChart'));
let donutChart = echarts.init(document.getElementById('donutChart'));

function getVirtulData(year) {
    let responseData;
    switch (year) {
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

calendarOption = {
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
    calendar: [{
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
        }
    ],

    series: [{
        type: 'heatmap',
        coordinateSystem: 'calendar',
        calendarIndex: 0,
        data: getVirtulData(2018),
        tooltip: {
            formatter: function(params) {
                return `<b>Reviews:</b> ${params.value[1]}</br><b>Date:</b> ${params.value[0]}`
            }
        }
    }, {
        type: 'heatmap',
        coordinateSystem: 'calendar',
        calendarIndex: 1,
        data: getVirtulData(2017),
        tooltip: {
            formatter: function(params) {
                return `<b>Reviews:</b> ${params.value[1]}</br><b>Date:</b> ${params.value[0]}`
            }
        }
    }, {
        type: 'heatmap',
        coordinateSystem: 'calendar',
        calendarIndex: 2,
        data: getVirtulData(2016),
        tooltip: {
            formatter: function(params) {
                return `<b>Reviews:</b> ${params.value[1]}</br><b>Date:</b> ${params.value[0]}`
            }
        }
    }]

};

let donutOption = {
    tooltip: {
        trigger: 'item',
        formatter: "{b}: {c} ({d}%)"
    },
    legend: {
        orient: 'vertical',
        x: 'left',
        data:['1 Star Reviews','2 Star Reviews','3 Star Reviews','4 Star Reviews','5 Star Reviews']
    },
    series: [
        {
            type:'pie',
            radius: ['50%', '70%'],
            avoidLabelOverlap: false,
            label: {
                normal: {
                    show: false,
                    position: 'center'
                },
                emphasis: {
                    show: true,
                    textStyle: {
                        fontSize: '30',
                        fontWeight: 'bold'
                    }
                }
            },
            labelLine: {
                normal: {
                    show: false
                }
            },
            data:[
                {value:0, name:'1 Star Reviews'},
                {value:0, name:'2 Star Reviews'},
                {value:0, name:'3 Star Reviews'},
                {value:0, name:'4 Star Reviews'},
                {value:0, name:'5 Star Reviews'}
            ]
        }
    ]
};

calendarChart.setOption(calendarOption);
donutChart.setOption(donutOption)

$(document).ready(function() {
    console.log("page loaded - request data");
    requestData()

    // load filters with defaults
    $("#startDateBox").val(startDate)
    $("#endDateBox").val(endDate)
    $("#ratingSelector").val(rating)

});

calendarChart.on('click', function(params) {
    startDate = params.value[0]
    endDate = params.value[0]
    requestData()
});