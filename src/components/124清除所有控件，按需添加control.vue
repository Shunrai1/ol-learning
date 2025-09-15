
/*
* @Author: 大剑师兰特（xiaozhuanlan），还是大剑师兰特（CSDN）
* @此源代码版权归大剑师兰特所有，可供学习或商业项目中借鉴，未经授权，不得重复地发表到博客、论坛，问答，git等公共空间或网站中。
* @Email: 2909222303@qq.com
* @First published in xiaozhuanlan.com
* @Second published in CSDN
* @First published time: 2022-09-05
*/
<template>
	<div class="container">
		<h3>vue+openlayers:清除所有控件，按需添加Control</h3>
		<p>大剑师兰特, 还是大剑师兰特</p>
		<h4>
			<el-button type="danger" size="mini" @click='clearAllControls()'> 清除所有控件</el-button>
			<el-button type="success" size="mini" @click='addZoom()'> 添加zoom控件</el-button>
			<el-button type="success" size="mini" @click='addFullScreen()'> 添加全屏控件</el-button>
		</h4>
		<div id="vue-openlayers" class="map-x"></div>
	</div>
</template>
<script>
	import 'ol/ol.css'
	import {Map,View} from 'ol'
	import Tile from 'ol/layer/Tile'
	import {OSM} from 'ol/source'
	import * as control from 'ol/control'


// module:ol/control/Attribution -地图属性控件
// module:ol/control/FullScreen -全屏控件
// module:ol/control/MousePosition -鼠标位置控件
// module:ol/control/OverviewMap -鹰眼控件
// module:ol/control/Rotate -地图旋转控件
// module:ol/control/ScaleLine -比例尺控件
// module:ol/control/ZoomSlider -缩放滚动条控件
// module:ol/control/ZoomToExtent -缩放到范围控件
// module:ol/control/Zoom -放大缩小控件



	export default {
		data() {
			return {
				map: null
			}
		},
		methods: {
			clearAllControls() {
				let ctls = this.map.getControls();
				let ctlsLength = ctls.getArray().length;
				for (let i = 0; i < ctlsLength; i++)
					this.map.removeControl(ctls.getArray()[i])
			},
			addZoom() {
				let zoom = new control.Zoom();
				this.map.addControl(zoom);
			},
			addFullScreen() {
				let fs = new control.FullScreen();
				this.map.addControl(fs);
			},

			initMap() {
				this.map = new Map({
					target: 'vue-openlayers',
					layers: [
						new Tile({
							source: new OSM()
						})
					],
					view: new View({
						projection: "EPSG:4326",
						center: [114.064839, 22.548857],
						zoom: 4
					}),
				})
			}
		},
		mounted() {
			this.initMap()
		}
	}
</script>

<style scoped>
	.container {
		width: 840px;
		height: 580px;
		margin: 50px auto;
		border: 1px solid #42B983;
		position: relative;
	}
	#vue-openlayers {
		width: 800px;
		height: 400px;
		margin: 0 auto;
		border: 1px solid #42B983;
	}

</style>


