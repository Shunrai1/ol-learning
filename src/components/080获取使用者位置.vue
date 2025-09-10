/*
* @Author: 大剑师兰特（xiaozhuanlan），还是大剑师兰特（CSDN）
* @此源代码版权归大剑师兰特所有，可供学习或商业项目中借鉴，未经授权，不得重复地发表到博客、论坛，问答，git等公共空间或网站中。
* @Email: 2909222303@qq.com
* @First published in xiaozhuanlan.com
* @Second published in CSDN
* @First published time: 2022-05-10
*/
<template>
	<div class="container">
		<h3>vue+openlayers: 获取使用者当前的geoLocation</h3>
		<p>大剑师兰特, 还是大剑师兰特</p>
		<div id="vue-openlayers"></div>
	</div>
</template>

<script>
	import 'ol/ol.css';
	import {Map,View} from 'ol'
    import {OSM, Vector as VectorSource} from 'ol/source';
	import Geolocation from 'ol/Geolocation';
	import Feature from 'ol/Feature';
	import Point from 'ol/geom/Point';
	import {Circle as CircleStyle,Fill,Stroke,Style} from 'ol/style';
	import {Tile as TileLayer,Vector as VectorLayer} from 'ol/layer';
	export default {
		data() {
			return {
				map: null,
			};
		},

		methods: {

			// 初始化地图     
			initMap() {
				const view = new View({
					center: [-55555555, 0],
					zoom: 2,
				});

				this.map = new Map({
					layers: [
						new TileLayer({
							source: new OSM(),
						}),
					],
					target: 'vue-openlayers',
					view: view,
				});

               let geolocation = new Geolocation({
					projection: this.map.getView().getProjection(),
				});

                geolocation.setTracking(true);  

				const positionFeature = new Feature();
				positionFeature.setStyle(
					new Style({
						image: new CircleStyle({
							radius: 10,
							fill: new Fill({
								color: 'orange',
							}),
							stroke: new Stroke({
								color: 'red',
								width: 2,
							}),
						}),
					})
				);

				geolocation.on('change:position', function() {
					const coordinates = geolocation.getPosition();
					positionFeature.setGeometry(coordinates ? new Point(coordinates) : null);
				});

				new VectorLayer({
					map: this.map,
					source: new VectorSource({
						features: [positionFeature],
					}),
				});
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
		height: 570px;
		margin: 50px auto;
		border: 1px solid #42B983;
	}

	#vue-openlayers {
		width: 800px;
		height: 450px;
		margin: 0 auto;
		border: 1px solid #42B983;
		position: relative;
	}
</style>

