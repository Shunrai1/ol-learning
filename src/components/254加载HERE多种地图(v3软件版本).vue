/*
* @Author: 大剑师兰特（xiaozhuanlan），还是大剑师兰特（CSDN）
* @此源代码版权归大剑师兰特所有，可供学习或商业项目中借鉴，未经授权，不得重复地发表到博客、论坛，问答，git等公共空间或网站中。
* @Email: 2909222303@qq.com
* @First published in xiaozhuanlan.com
* @Second published in CSDN
* @First published time: 2024-01-17
*/

<template>
	<div class="container">
		<h3>vue+openlayers: 加载HERE多种地图（v3软件版本）</h3>
		<p>大剑师兰特, 还是大剑师兰特</p>
		<h4>
			<el-button type="primary" size="mini" @click='loadMap(1)'>中文标记 </el-button>
			<el-button type="primary" size="mini" @click='loadMap(2)'>英文标记 </el-button>
			<el-button type="success" size="mini" @click='loadMap(3)'>夜晚英中双语</el-button>
			<el-button type="success" size="mini" @click='loadMap()'>基本地图大字体 </el-button>
		</h4>
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
	import XYZ from 'ol/source/XYZ'

	export default {
		data() {
			return {
				map: null,
				geo_Layer: null,
				source: new XYZ({}),

			};
		},

		methods: {

			loadMap(n) {
				this.source.clear()
				let key = '你申请的here地图key';
				let url;
				switch (n) {
					case 1: //中文标记 Returns a tile that contains only labels.
						url = 'https://maps.hereapi.com/v3/label/mc/{z}/{x}/{y}/png8?style=lite.day&lang=zh&apiKey='
						break;
					case 2: //英文标记 Returns a tile that contains only labels.
						url = 'https://maps.hereapi.com/v3/label/mc/{z}/{x}/{y}/png8?style=lite.day&lang=en&apiKey='
						break;
					case 3: //
						url = 'https://maps.hereapi.com/v3/base/mc/{z}/{x}/{y}/png8?style=explore.night&lang=en&lang2=zh&apiKey='
						break;
					default: //Returns a map tile image.
						url = 'https://maps.hereapi.com/v3/base/mc/{z}/{x}/{y}/png8?ppi=400&style=lite.day&lang=zh&apiKey='
				}

				this.source.setUrl(url + key);
			},

			initMap() {
				let HereMap = new TileLayer({
					source: this.source
				});

				this.map = new Map({
					target: "vue-openlayers",
					layers: [HereMap],
					view: new View({
						projection: "EPSG:3857",
						center: [0, 0],
						zoom: 1
					}),
				})

			},
		},
		mounted() {
			this.initMap();
			this.loadMap();
		}
	}
</script>
<style scoped>
	.container {
		width: 1000px;
		height: 660px;
		margin: 50px auto;
		border: 1px solid #42B983;
	}

	#vue-openlayers {
		width: 960px;
		height: 480px;
		margin: 0 auto;
		border: 1px solid #42B983;
		position: relative;
		/* background-color: gold; */
	}
</style>


