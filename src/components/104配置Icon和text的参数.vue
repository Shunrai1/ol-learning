
/*
* @Author: 大剑师兰特（xiaozhuanlan），还是大剑师兰特（CSDN）
* @此源代码版权归大剑师兰特所有，可供学习或商业项目中借鉴，未经授权，不得重复地发表到博客、论坛，问答，git等公共空间或网站中。
* @Email: 2909222303@qq.com
* @First published in xiaozhuanlan.com
* @Second published in CSDN
* @First published time: 2022-08-25
*/

<template>
	<div class="container">
		<h3>vue+openlayers: 配置Icon和text的参数</h3>
		<p>大剑师兰特, 还是大剑师兰特</p>
		<div id="vue-openlayers"></div>
	</div>
</template>

<script>
	import 'ol/ol.css';
	import {Map,View} from 'ol'
	import TileLayer from 'ol/layer/Tile'
	import VectorLayer from 'ol/layer/Vector'
	import VectorSource from 'ol/source/Vector'
	import OSM from 'ol/source/OSM'
	import Feature from 'ol/Feature'
	import {Point} from "ol/geom"
    import {Circle, Fill, Icon, Stroke, Style, Text} from 'ol/style';

	export default {
		data() {
			return {
				map: null,
				dataSource: new VectorSource({
					wrapX: false
				}),
				pointData: [116, 39],
			};
		},

		methods: {
			showPoint() {
				const iconFeature = new Feature({
				  geometry: new Point([116, 39]),
				});
				
				const iconStyle = new Style({
                    image: new Icon({
                        rotation:45,						
                        crossOrigin: 'anonymous',
						anchor: [0.5, 1.5],
                        src: require('@/assets/img/tianjin.png')
                    }),
				  text: new Text({
				    text: 'cuclife',
					anchor: [0.5, 1.5],
					rotation:50,
				    font: 'bold 20px Arial,sans-serif',
					textAlign:'right',
					offsetX:-50,
					offsetY:20,
				    fill: new Fill({
				      color: 'red',
				    }),
				    stroke: new Stroke({
				      color: 'white',
				      width: 2,
				    }),
				  }),
				});
				
				const pointStyle = new Style({
				  image: new Circle({
				    radius: 7,
				    fill: new Fill({
				      color: 'red',
				    }),
				    stroke: new Stroke({
				      color: 'blue',
				      width: 1,
				    }),
				  }),
				});
				
				iconFeature.setStyle([pointStyle, iconStyle]);
				this.dataSource.addFeature(iconFeature)
			},

			// 初始化地图	 
			initMap() {
				let OSM_Layer = new TileLayer({
					source: new OSM()
				})
				let feature_Layer = new VectorLayer({
					source: this.dataSource,
				})

				this.map = new Map({
					target: "vue-openlayers",
					layers: [
						OSM_Layer,
						feature_Layer
					],
					view: new View({
						projection: "EPSG:4326",
						center: [116, 39],
						zoom: 14
					}),
				})
              
			},
		},
		mounted() {
			this.initMap()
			this.showPoint()
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

