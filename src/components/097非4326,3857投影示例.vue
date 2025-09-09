/*
* @Author: 大剑师兰特（xiaozhuanlan），还是大剑师兰特（CSDN）
* @此源代码版权归大剑师兰特所有，可供学习或商业项目中借鉴，未经授权，不得重复地发表到博客、论坛，问答，git等公共空间或网站中。
* @Email: 2909222303@qq.com
* @First published in xiaozhuanlan.com
* @Second published in CSDN
* @First published time: 2022-05-07
*/

<template>
	<div class="container">
		<h3>vue+openlayers: 非4326,3857的投影示例</h3>
		<p>大剑师兰特, 还是大剑师兰特</p>
		<div id="vue-openlayers"></div>
	</div>
</template>

<script>
	import 'ol/ol.css';
	import GeoJSON from 'ol/format/GeoJSON';
	import Graticule from 'ol/layer/Graticule';
	import Map from 'ol/Map';
	import Projection from 'ol/proj/Projection';
	import VectorLayer from 'ol/layer/Vector';
	import VectorSource from 'ol/source/Vector';
	import View from 'ol/View';
	import proj4 from 'proj4';
	import {
		Fill,
		Style
	} from 'ol/style';
	import {
		register
	} from 'ol/proj/proj4';

	export default {
		data() {
			return {
				map: null,
			}
		},
		methods: {

			initMap() {

				proj4.defs(
					'ESRI:53009',
			  '+proj=moll +lon_0=0 +x_0=0 +y_0=0 +a=6371000 ' +
					'+b=6371000 +units=m +no_defs'
				);
				register(proj4);

				const sphereMollweideProjection = new Projection({
					code: 'ESRI:53009',
					extent: [
						-18019909.21177587, -9009954.605703328, 18019909.21177587,
						9009954.605703328,
					],
					worldExtent: [-179, -89.99, 179, 89.99],
				});

				const style = new Style({
					fill: new Fill({
						color: '#eeeeee',
					}),
				});

				this.map = new Map({
					target: "vue-openlayers",
					layers: [
						new VectorLayer({
							source: new VectorSource({
								url: 'https://openlayers.org/data/vector/ecoregions.json',
								format: new GeoJSON(),
							}),
							style: function(feature) {
								const color = feature.get('COLOR_BIO') || '#eeeeee';
						 	style.getFill().setColor(color);
								return style;
							},
						}),
						new Graticule(),
					],
					view: new View({
						center: [0, 0],
						projection: sphereMollweideProjection,
						zoom: 2,
					})
				})
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
		height: 590px;
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


