
/*
* @Author: 大剑师兰特（xiaozhuanlan），还是大剑师兰特（CSDN）
* @此源代码版权归大剑师兰特所有，可供学习或商业项目中借鉴，未经授权，不得重复地发表到博客、论坛，问答，git等公共空间或网站中。
* @Email: 2909222303@qq.com
* @First published in xiaozhuanlan.com
* @Second published in CSDN
* @First published time: 2022-08-31
*/

<template>
	<div class="container">
		<h3>vue+openlayers: 实时显示zoom，并显示左下、左上、右上、右下的坐标</h3>
		<p>大剑师兰特, 还是大剑师兰特</p>
        <h4>
            当前zoom值： {{czoom}}; <br> 左上{{tl}} --- 左下{{bl}} --- 右上{{tr}}  --- 右下{{br}};
        </h4>
		<div id="vue-openlayers"></div>
	</div>
</template>

<script>
	import 'ol/ol.css';
	import {Map,View} from 'ol'
	import TileLayer from 'ol/layer/Tile'
	import VectorLayer from 'ol/layer/Vector'
	import VectorSource from 'ol/source/Vector'
	import XYZ from 'ol/source/XYZ'
	import {TileWMS,ImageWMS} from 'ol/source';
	import OSM from 'ol/source/OSM'
	import {getTopLeft,getBottomRight,getBottomLeft,getTopRight} from 'ol/extent';

	export default {
		data() {
			return {
				map: null,
				czoom:6,
				tl: [],
				tr: [],
				bl: [],
				br: [],				
			};
		},

		methods: {
             moveendEvent() {
                 this.map.on('moveend', (e) => {
                     this.czoom = this.map.getView().getZoom();
					 let extent = this.map.getView().calculateExtent(this.map.getSize());
					 let gtl = getTopLeft(extent);
					 this.tl=[Number(gtl[0].toFixed(2)),Number(gtl[1].toFixed(2))]
					 let gbr= getBottomRight(extent);
					 this.br=[Number(gbr[0].toFixed(2)), Number(gbr[1].toFixed(2))]					 
					 let gtr = getTopRight(extent);
					 this.tr=[Number(gtr[0].toFixed(2)),Number(gtr[1].toFixed(2))]
					 let gbl = getBottomLeft(extent);
					 this.bl=[Number(gbl[0].toFixed(2)), Number(gbl[1].toFixed(2))]
                 });
             },
			 
			initMap() {
				let OSM_Layer = new TileLayer({
					source: new OSM()
				})

				this.map = new Map({
					target: "vue-openlayers",
					layers: [
						OSM_Layer,
					],
					view: new View({
						projection: "EPSG:4326",
						center: [116.15, 40.79],
						zoom: this.czoom
					}),
				})
              
			},
		},
		mounted() {
			this.initMap();
			this.moveendEvent()
		}
	}
</script>
<style scoped>
	.container {
		width: 840px;
		height: 630px;
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


