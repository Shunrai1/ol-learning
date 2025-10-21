/*
* @Author: 大剑师兰特（xiaozhuanlan），还是大剑师兰特（CSDN）
* @此源代码版权归大剑师兰特所有，可供学习或商业项目中借鉴，未经授权，不得重复地发表到博客、论坛，问答，git等公共空间或网站中。
* @Email: 2909222303@qq.com
* @First published in xiaozhuanlan.com
* @Second published in CSDN
* @First published time: 2024-01-19
*/

<template>
	<div class="container">
		<h3>vue+openlayers: 加载tomtom地图（多种形式）</h3>
		<p>大剑师兰特, 还是大剑师兰特</p>
		<h4>
			<el-button type="primary" size="mini" @click='loadMap(1)'>中文标记 </el-button>
			<el-button type="primary" size="mini" @click='loadMap(2)'>英文标记 </el-button>
			<el-button type="success" size="mini" @click='loadMap(3)'>夜晚多国语言</el-button>
			<el-button type="success" size="mini" @click='loadMap(4)'>白天多国语言</el-button>
			<el-button type="danger" size="mini" @click='loadMap(5)'>卫星影像图 </el-button>
			<el-button type="danger" size="mini" @click='loadMap(6)'>高山地形图 </el-button>
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
				let key = 'px9xQerCsg111T9jamKJNfqAtn7pfXEA';
				let url;

				switch (n) {
					case 1: 
						url = 'https://{a-d}.api.tomtom.com/map/1/tile/labels/main/{z}/{x}/{y}.png?view=CN&language=zh-CN&key='
						break;
					case 2: 
						url = 'https://{a-d}.api.tomtom.com/map/1/tile/labels/main/{z}/{x}/{y}.png?view=CN&language=en-US&key='
						break;
					case 3:
						url = 'https://{a-d}.api.tomtom.com/map/1/tile/basic/night/{z}/{x}/{y}.png?view=CN&language=NGT&key='
						break;
					case 4: 
						url = 'https://{a-d}.api.tomtom.com/map/1/tile/basic/main/{z}/{x}/{y}.png?language=NGT&key='
						break;
					case 5:
						url = 'https://a.api.tomtom.com/map/1/tile/sat/main/{z}/{x}/{y}.jpg?view=CN&language=cn&key='
						break;
					case 6: 
						url = 'https://{a-d}.api.tomtom.com/map/1/tile/hill/main/{z}/{x}/{y}.png?language=NGT&key='
						break;						
				}

				this.source.setUrl(url + key);
			},

			initMap() {
				let tomtom = new TileLayer({
					source: this.source
				});

				this.map = new Map({
					target: "vue-openlayers",
					layers: [tomtom],
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
			this.loadMap(4);
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
		height: 490px;
		margin: 0 auto;
		border: 1px solid #42B983;
	}
</style>

