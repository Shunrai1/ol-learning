/*
* @Author: 大剑师兰特（xiaozhuanlan），还是大剑师兰特（CSDN）
* @此源代码版权归大剑师兰特所有，可供学习或商业项目中借鉴，未经授权，不得重复度过高（超过60%）地发表到博客、论坛，问答，git等公共空间或网站中。
* @Email: 2909222303@qq.com
* @First published in xiaozhuanlan.com
* @Second published in CSDN
* @First published time: 2022-09-09
*/
<template>
	<div class="container">
		<h3>vue+openlayers: 清空删除所有的图层 </h3>
		<p>文件来源：https://xiaozhuanlan.com/vue-openlayers</p>
		<h4>
            <el-button type="primary" size="mini" @click='StamenMap("watercolor")'>Watercolor</el-button>
            <el-button type="primary" size="mini" @click='StamenMap("toner")'>Toner</el-button>
			<el-button type="warning" size="mini" @click='clearALl()'>清除所有图层</el-button>
		</h4>
		<div id="vue-openlayers"></div>
	</div>
</template>

<script>
	import 'ol/ol.css'
	import {Map,View} from 'ol'
	import Tile from 'ol/layer/Tile'
	import Stamen from 'ol/source/Stamen';
	export default {
		data() {
			return {
				map: null,
			}
		},
		methods: {
			//清除所有layer
			clearALl(){		
				this.map.getLayers().getArray().slice(0).forEach((layer) => {
					if (layer) {
						this.map.removeLayer(layer);
					}
				});
			},
			
			StamenMap(data) {
                let StamenMap = new Tile({
                    source: new Stamen({
                    layer: data,
                })
                });

				this.map.addLayer(StamenMap);
			},

			initMap() {
				this.map = new Map({
					target: "vue-openlayers",
					layers: [],
					view: new View({
						center: [13247019.404399557, 4721671.572580107],
						zoom: 3
					})
				})
			},

		},
		mounted() {
			this.initMap();
			this.StamenMap("terrain");
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
		height: 420px;
		margin: 0 auto;
		border: 1px solid #42B983;
		position: relative;
	}
</style>
