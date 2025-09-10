
/*
* @Author: 大剑师兰特（xiaozhuanlan），还是大剑师兰特（CSDN）
* @此源代码版权归大剑师兰特所有，可供学习或商业项目中借鉴，未经授权，不得重复地发表到博客、论坛，问答，git等公共空间或网站中。
* @Email: 2909222303@qq.com
* @First published in xiaozhuanlan.com
* @Second published in CSDN
* @First published time: 2022-05-18
*/
<template>
	<div class="container">
		<h3>vue+openlayers: set extent 和 fit extent</h3>
		<p>大剑师兰特, 还是大剑师兰特</p>
		<h4 >
			<el-button type="danger" size="mini" @click="setbyextent()">set extent</el-button>
			<el-button type="danger" size="mini" @click="fitbyextent()">fit extent</el-button>
		</h4>
		<div id="vue-openlayers"></div>

	</div>
</template>

<script>
	import 'ol/ol.css';
	import Map from 'ol/Map';
	import View from 'ol/View';
	import OSM from 'ol/source/OSM';
	import TileLayer from 'ol/layer/Tile';
	export default {
		name: 'extent',
		data() {
			return {
				map: null,
				osmLayer:null,
				newextent: [-90,-45,90,45],
			}
		},
		methods: {
			setbyextent() {
               this.osmLayer.setExtent(this.newextent)
			},
			fitbyextent() {
			   this.map.getView().fit(this.newextent, this.map.getSize(), {
					padding: [20, 10, 20, 10]
				}
			   );
			},			
			initMap() {
				this.osmLayer=new TileLayer({
							source: new OSM(),
						}),
				
				this.map = new Map({
					layers: [
						this.osmLayer
					],
					target: 'vue-openlayers',
					view: new View({
						center: [116, 39],
						projection: "EPSG:4326",
						zoom: 2,
						extent:[-180,-85,180,85]
					}),
				});
			},
		},
		mounted() {
			this.initMap();
		},

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
		height: 400px;
		margin: 0 auto;
		border: 1px solid #42B983;
		position: relative;
	}

</style>


