
/*
* @Author: 大剑师兰特（xiaozhuanlan），还是大剑师兰特（CSDN）
* @此源代码版权归大剑师兰特所有，可供学习或商业项目中借鉴，未经授权，不得重复地发表到博客、论坛，问答，git等公共空间或网站中。
* @Email: 2909222303@qq.com
* @First published in xiaozhuanlan.com
* @Second published in CSDN
* @First published time: 2022-10-24
*/

<template>
	<div class="container">
		<h3>vue+openlayers: 地图上添加Echarts柱状图</h3>
		<p>大剑师兰特, 还是大剑师兰特</p>
		<div id="vue-openlayers"></div>
	</div>
</template>

<script>
	import 'ol/ol.css';
	import {
		Map,
		View
	} from 'ol'
	import TileLayer from 'ol/layer/Tile'
	import OSM from 'ol/source/OSM'
	import EChartsLayer from 'ol-echarts'
	import {
		fromLonLat,
		toLonLat,
		transform
	} from "ol/proj";
	export default {
		data() {
			return {
				map: null,
				osmLayer: null,
			};
		},
		methods: {
			initMap() {
				this.osmLayer = new TileLayer({
					source: new OSM(),
				});
				this.map = new Map({
					target: "vue-openlayers",
					layers: [
						this.osmLayer,
					],
					view: new View({
						projection: "EPSG:4326",
						center: [118.53, 33.44], //fromLonLat([118.53, 33.44]),
						zoom: 5
					}),
				})

				// 以下为加载echarts代码
				
				  var options = {
				    color: ['green','#f30000','#f0f'],
				    tooltip : {
				      trigger: 'axis',
				      axisPointer : {            // 坐标轴指示器，坐标轴触发有效
				        type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
				      },
					  formatter:function(params){
					  　　　　var res = params[0].seriesName + params[0].name +'：'+ params[0].data ;
					  　　　　return res;
					  　　}
				    },

				    grid: [],
				    xAxis : [],
				    yAxis : [],
				    series: []
				  }
				
				  var series = [
				    {
				      name: '北京',
				      type: 'bar',
				      barWidth: '15',
				      coordinates: [116.388, 39.906],
				      data: [20, 12, 31],
				      xAxisIndex: 0,
				      yAxisIndex: 0
				    },
				    {
				      name:'忻州',
				      type:'bar',
				      barWidth: '15',
				      coordinates: [112.721, 38.445],
				      data: [1, 1, 2 ],
				      xAxisIndex: 1,
				      yAxisIndex: 1
				    },
				    {
				      name:'大连',
				      type:'bar',
				      barWidth: '15',
				      coordinates: [121.628, 38.916],
				      data: [1, 1, 2 ],
				      xAxisIndex: 2,
				      yAxisIndex: 2
				    }

				  ];
				
				  series.forEach(function (item, index) {
				    options.grid.push({
				      show: true,
				      containLabel: false,
				      borderWidth: 0,
				      borderColor: '#fff',
				      width: 70,
				      height: 40
				    });
				    options.xAxis.push({
				      type : 'category',
				      show: true,
				      gridIndex: index,
				      nameTextStyle: {
				        color: '#3c3c3c'
				      },
				      axisLine: {
				        show: false,
				        onZero: false
				      },
				      axisLabel: {
				        show: true,
				        interval: 0,
				        rotate: 45,
				        textStyle: {
				          color: 'blue',
				          fontSize: 10
				        }
				      },
				      axisTick: {
				        show: false
				      },
					   data : ['医院', '图书馆', '教堂']
				      
				    });
				    options.yAxis.push({
				      type: 'value',
				      show: true,
				      min: 0.001,
				      splitLine: {show: false},
				      axisLabel: {
				        show: false
				      },
				      axisLine: {
				        show: false,
				        onZero: false
				      },
				      nameGap: '1',
				      axisTick: {
				        show: false
				      },
				      nameTextStyle: {
				        color: '#3c3c3c',
				        fontSize: 14
				      },
				      gridIndex: index,
					 
				    });
				    options.series.push(item)
				  })

				let echartslayer = new EChartsLayer(options)
				echartslayer.appendTo(this.map);
			},
		},
		mounted() {
			this.initMap();
		}
	}
</script>
<style scoped>
	.container {
		width: 840px;
		height: 570px;
		margin: 50px auto;
		border: 1px solid #42B983;
		position: relative;
	}

	#vue-openlayers {
		width: 800px;
		height: 450px;
		margin: 0 auto;
		border: 1px solid #42B983;
		position: relative;
	}
</style>


