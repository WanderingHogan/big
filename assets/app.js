Vue.filter('formatDate', function(d) {
	if(!window.Intl) return d;
	return new Intl.DateTimeFormat('en-US').format(new Date(d));
}); 


let filtered2018 = []
let filtered2017 = []
let filtered2016 = []

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
        cellSize: ['auto', 20],
        right: 5
    },
    {
        top: 250,
        range: '2017',
        cellSize: ['auto', 20],
        right: 5
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
        data: getVirtulData(2018)
    }, {
        type: 'heatmap',
        coordinateSystem: 'calendar',
        calendarIndex: 1,
        data: getVirtulData(2017)
    }, {
        type: 'heatmap',
        coordinateSystem: 'calendar',
        calendarIndex: 2,
        data: getVirtulData(2016)
    }]

};


myChart.setOption(option); 


const app = new Vue({
	el:'#app',
	data:{
		startDate:'2016-1-1',
		endDate: '2018-6-30',
		ratingsSelected: '',
		ratings: [
		  { text: 'All', value: '' },
	      { text: '1', value: '1' },
	      { text: '2', value: '2' },
	      { text: '3', value: '3' },
	      { text: '4', value: '4' },
	      { text: '5', value: '5' }
	    ],
		count: 0,
		max: 0,
		results:[],
		noResults:false,
		searching:false
	},
	methods:{
		search:function() {
			this.searching = true;
			fetch(`/api/reviewFilter?startDate=${encodeURIComponent(this.startDate)}&endDate=${encodeURIComponent(this.endDate)}&rating=${this.ratingsSelected}`)
			.then(res => res.json())
			.then(res => {
				// pverwrite rid of old arrays
				let filtered2018 = []
				let filtered2017 = []
				let filtered2016 = []
				let newMax = 0;
				res.chartData.map(function(a){
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
				console.log('setting new chart data')
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
				this.results = res.data;
				this.count = res.data.length;
				// this.noResults = this.results.length === 0;
			});
		}
	}
});
//do this on page load
app.search()