
/*
* @Author: 大剑师兰特（xiaozhuanlan），还是大剑师兰特（CSDN）
* @此源代码版权归大剑师兰特所有，可供学习或商业项目中借鉴，未经授权，不得重复地发表到博客、论坛，问答，git等公共空间或网站中。
* @Email: 2909222303@qq.com
* @First published in xiaozhuanlan.com
* @Second published in CSDN
* @First published time: 2022-09-09
*/
<template>
	<div class="container">
		<h3>vue+openlayers: 给图层设置层级数，显示图层层级数</h3>
		<p>大剑师兰特, 还是大剑师兰特</p>
		<h4>
		<el-button type="danger" size="mini" @click='getzindex()'>获取层级数</el-button>
		<el-button type="danger" size="mini" @click='setzindex()'>设置层级数</el-button>
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
			}
		},
		methods: {		
			getzindex(){
				let num=this.osmLayer.getZIndex()
				if(num==2){
					this.$message.warning('原始设定的OSM层级数为：'+num)
				}else{
					this.$message.success('重新设定的OSM层级数为：'+num)
				}
				
			},
			
			setzindex(){
			  this.osmLayer.setZIndex(3)
			  this.$message.error('设置OSM层级数为：3')	
			},
			initMap() {
				this.osmLayer=new TileLayer({
							source: new OSM(),
							zIndex:2,
						})
				this.map = new Map({
					layers: [
						this.osmLayer
					],
					target: 'vue-openlayers',
					view: new View({
						center: [116.86981, 39.48475],
						projection: "EPSG:4326",
						zoom: 2,
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
		margin: 20px auto;
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


