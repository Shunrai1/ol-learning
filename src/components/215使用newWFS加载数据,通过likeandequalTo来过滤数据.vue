
/*
* @Author: 大剑师兰特（xiaozhuanlan），还是大剑师兰特（CSDN）
* @此源代码版权归大剑师兰特所有，可供学习或商业项目中借鉴，未经授权，不得重复地发表到博客、论坛，问答，git等公共空间或网站中。
* @Email: 2909222303@qq.com
* @First published in xiaozhuanlan.com
* @Second published in CSDN
* @First published time: 2023-03-10
*/

<template>
	<div class="container">
		<h3>vue+openlayers: 使用new WFS加载数据，通过like,and,equalTo来过滤数据</h3>
		<p>大剑师兰特, 还是大剑师兰特</p>
		<h4>
			<el-button type="danger" size="mini" @click="showGEO()">显示过滤后的数据</el-button>
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
	import {GeoJSON,WFS} from 'ol/format.js';
	import {Stroke,Style} from 'ol/style.js';
	import {fromLonLat} from 'ol/proj'
	import XYZ from 'ol/source/XYZ'
	import {and as andFilter,equalTo as equalToFilter,like as likeFilter,} from 'ol/format/filter.js';

	export default {
		data() {
			return {
				map: null,
				myImageLayer: null,
				dataSource: new VectorSource({
					wrapX: false,
				}),
			};
		},

		methods: {
			showGEO() {
				
				const featureRequest = new WFS().writeGetFeature({
					srsName: 'EPSG:3857',
					featureNS: 'http://openstreemap.org',
					featurePrefix: 'osm',
					featureTypes: ['water_areas'],
					outputFormat: 'application/json',
					filter: andFilter(
						likeFilter('name', 'M*'),
						equalToFilter('waterway', 'riverbank')
					),
				});
				
				// then post the request and add the received features to a layer
				fetch('https://ahocevar.com/geoserver/wfs', {
					 method: 'POST',
						body: new XMLSerializer().serializeToString(featureRequest),
					})
					.then((response) => {
						console.log(response);
						return response.json();
					})
					.then((json) => {
						console.log(json);
						const features = new GeoJSON().readFeatures(json);
						this.dataSource.addFeatures(features);
						this.map.getView().fit(this.dataSource.getExtent());
					});

				this.myImageLayer = new VectorLayer({
					source: this.dataSource,
					style: new Style({
						stroke: new Stroke({
							color: 'rgba(0, 0, 255, 1.0)',
							width: 2,
						}),
					}),

				});
				this.map.addLayer(this.myImageLayer);



			},

			// 初始化地图     
			initMap() {
				let OSM_Layer = new TileLayer({
					source: new XYZ({
						url: 'https://www.google.com/maps/vt?lyrs=m&gl=en&x={x}&y={y}&z={z}',
						crossOrigin: "anonymous"
					}),

				})

				this.map = new Map({
					target: "vue-openlayers",
					layers: [
						OSM_Layer,
					],
					view: new View({
						center: [-8908887.277395891, 5381918.072437216],
						maxZoom: 19,
						zoom: 3,
					}),
				})
			},
		},
		mounted() {
			this.initMap()
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


