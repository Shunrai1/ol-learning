
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
		<h3>vue+openlayers: 加载动画，采用css的@keyframes方式</h3>
		<p>大剑师兰特, 还是大剑师兰特</p>
		<div id="vue-openlayers"></div>
	</div>
</template>

<script>
	import 'ol/ol.css'
	import {Map,View,Overlay} from 'ol'
	import TileLayer from 'ol/layer/Tile'
	import XYZ from 'ol/source/XYZ';
	import {fromLonLat , useGeographic} from 'ol/proj'
	export default {
		data() {
			return {
				map: null,
				overlay: {},
				markerPoint: {},
				geojsonData: {
					type: "FeatureCollection",
					features: [{
							type: "Feature",
							properties: {
								title: "point1",
							},
							geometry: {
								type: "Point",
								coordinates: [-95.4, 31.8],
							},
						},
						{
							type: "Feature",
							properties: {
								title: "point2",
							},
							geometry: {
								type: "Point",
								coordinates: [-97.1, 38.7],
							},
						},

					],
				},

			}
		},
		methods: {

			showAnimation() {
				let coordinates = this.getCoordinatesByGeojson(this.geojsonData);
				for (const i in coordinates) {
			  let point_div = document.createElement("div");
					point_div.className = "cssAnimation";
					point_div.id = `coordinate_${i}`;
					document.documentElement.appendChild(point_div);
	
					this.marker = new Overlay({
						position: coordinates[i],
						element: point_div,
						positioning: "center-center",
					});
					this.map.addOverlay(this.marker);
				}
			},

			getCoordinatesByGeojson(geojsonData) {
				let coordinates = [];
				geojsonData.features.map((feature) => {
					coordinates = [...coordinates, feature.geometry.coordinates];
				});
				return coordinates;
			},

			initMap() {
				let googleLayer = new TileLayer({
					source: new XYZ({
						url: 'https://www.google.com/maps/vt?lyrs=m&gl=en&x={x}&y={y}&z={z}',
						crossOrigin: "anonymous"
					}),
				})

				this.map = new Map({
					target: "vue-openlayers",
					layers: [googleLayer],
					view: new View({
						projection: "EPSG:3857",
						center: fromLonLat([-97.1, 38.7]),
						zoom: 4,
					}),
				})

			},

		},
		mounted() {
			this.initMap();
			this.showAnimation();
			useGeographic()  //核心，必须要有
		}
	}
</script>
<style>
	.container {
		width: 840px;
		height: 620px;
		margin: 50px auto;
		border: 1px solid #42B983;
	}

	#vue-openlayers {
		width: 800px;
		height: 490px;
		margin: 0 auto;
		border: 1px solid #42B983;
		position: relative;
	}

   .cssAnimation {
       height: 20px;
       width: 20px;
       border-radius: 50%;
       background: rgba(255, 0, 0, 0.9);
       box-shadow: inset 0 0 8px red;
       transform: scale(0);
       animation: myfirst 3s;
       animation-iteration-count: infinite;
     }
     @keyframes myfirst {
       to {
         transform: scale(2);
        background: rgba(255, 0, 0, 0.2);
         box-shadow: inset 0 0 50px rgba(255, 0, 0, 0);
       }
     }
</style>

