
/*
* @Author: 大剑师兰特（xiaozhuanlan），还是大剑师兰特（CSDN）
* @此源代码版权归大剑师兰特所有，可供学习或商业项目中借鉴，未经授权，不得重复地发表到博客、论坛，问答，git等公共空间或网站中。
* @Email: 2909222303@qq.com
* @First published in xiaozhuanlan.com
* @Second published in CSDN
* @First published time: 2023-03-13
*/

<template>
	<div class="container">
		<h3>vue+openlayers: 加载geoserver瓦片WMS数据，使用getFeatureInfoUrl获取瓦片数据信息</h3>
		<p>大剑师兰特, 还是大剑师兰特</p>
		<h4>
			{{ name }}
		</h4>
		<div id="vue-openlayers"></div>
	</div>
</template>

<script>
	import 'ol/ol.css';
	import {Map,View} from 'ol'
	import TileLayer from 'ol/layer/Tile'
	import ImageLayer from 'ol/layer/Image.js';
	import VectorLayer from 'ol/layer/Vector'
	import VectorSource from 'ol/source/Vector'
	import {TileWMS,ImageWMS} from 'ol/source';
	import {fromLonLat} from 'ol/proj'
	import XYZ from 'ol/source/XYZ'

	export default {
		data() {
			return {
				map: null,
				myImageLayer: null,
				dataSource: null,
				name:'点击图形后显示名称',
			};
		},

		methods: {
			showGEO() {
				this.dataSource = new TileWMS({
					url: 'http://XXXXXXX/geoserver/vs_data/wms',
					ratio: 1,
					params: {
						'FORMAT': 'image/png',
						'VERSION': '1.1.0',
						'LAYERS': 'vs_data:tile',
						transparent: 'true',
						'STYLES': '',
						'TILED': true,
					},
					serverType: "geoserver"
				});
				this.wmsLayer = new TileLayer({
					zIndex: 200,
					visiable: true,
					className: "wms",
					source: this.dataSource
				});
				this.map.addLayer(this.wmsLayer);
			},

			clickFeature() {
				this.map.on("click", (e) => {
					let viewResolution = this.map.getView().getResolution();
					let url = this.dataSource.getFeatureInfoUrl(e.coordinate, viewResolution, "EPSG:3857", {
							INFO_FORMAT: "application/json", //输出为json字符串  application/json
						});

					if (url) {
						fetch(url)
						.then((res)=> { return res.text()
						}).then((data)=>{
							//console.log(JSON.parse(data))
							this.name = JSON.parse(data).features[0].properties.ImageSourc;
						})
					}
				});
			},

			// 初始化地图     
			initMap() {
				let google_Layer = new TileLayer({
					source: new XYZ({
						url: 'https://www.google.com/maps/vt?lyrs=m&gl=en&x={x}&y={y}&z={z}',
						crossOrigin: "anonymous"
					}),

				})

				this.map = new Map({
					target: "vue-openlayers",
					layers: [
						google_Layer,
					],
					view: new View({
						projection: "EPSG:3857",
						center: fromLonLat([-74.8, 6.13]),
						zoom: 8
					}),
				})
			},
		},
		mounted() {
			this.initMap();
			this.showGEO();
			this.clickFeature();
		}
	}
</script>
<style scoped>
	.container {
		width: 840px;
		height: 640px;
		margin: 50px auto;
		border: 1px solid #42B983;
	}

	#vue-openlayers {
		width: 800px;
		height: 470px;
		margin: 0 auto;
		border: 1px solid #42B983;
		position: relative;
	}
</style>



