<!-- npm install echarts --save  //ol-echarts需要依赖echarts，项目中要安装此包
npm install ol-echarts --save

template中引用
import EChartsLayer from 'ol-echarts' -->


/*
* @Author: 大剑师兰特（xiaozhuanlan），还是大剑师兰特（CSDN）
* @此源代码版权归大剑师兰特所有，可供学习或商业项目中借鉴，未经授权，不得重复地发表到博客、论坛，问答，git等公共空间或网站中。
* @Email: 2909222303@qq.com
* @First published in xiaozhuanlan.com
* @Second published in CSDN
* @First published time: 2022-10-21
*/

<template>
	<div class="container">
		<h3>vue+openlayers: 地图上添加Echarts饼图</h3>
		<p>大剑师兰特, 还是大剑师兰特</p>
		<div id="vue-openlayers"></div>
	</div>
</template>

<script>
	import 'ol/ol.css';
	import {Map,View} from 'ol'
	import TileLayer from 'ol/layer/Tile'
	import OSM from 'ol/source/OSM'
	import EChartsLayer from 'ol-echarts'
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
						center: [116.53, 39.44],
						zoom: 7
					}),
				})
				
				this.map.on('postcompose', (evt) => {
					document.querySelector('canvas').style.filter = `hue-rotate(180deg)`;
				});

                // 以下为加载echarts代码
				let echartslayer = new EChartsLayer({
					tooltip: {
						trigger: "item",
						formatter: "{a} <br/>{b} : {c} ({d}%)"
					},
					color:['#45C2E0', '#FF0000','#FF00ff'],
					series: [{
							name: "行业发展",
							type: "pie",
							radius: "50",
							coordinates: [116.53, 39.44],
							data: [{
									value: 335,
									name: "林业"
								},
								{
									value: 310,
									name: "钢铁业"
								},
								{
									value: 234,
									name: "畜牧业"
								}
							],
							itemStyle: {
								emphasis: {
									shadowBlur: 10,
									shadowOffsetX: 0,
									shadowColor: "rgba(255, 0, 0, 0.5)"
								}
							}
						},

					]
				});
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



