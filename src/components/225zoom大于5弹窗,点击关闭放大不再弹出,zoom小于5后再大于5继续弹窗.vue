
/*
* @Author: 大剑师兰特（xiaozhuanlan），还是大剑师兰特（CSDN）
* @此源代码版权归大剑师兰特所有，可供学习或商业项目中借鉴，未经授权，不得重复地发表到博客、论坛，问答，git等公共空间或网站中。
* @Email: 2909222303@qq.com
* @First published in xiaozhuanlan.com
* @Second published in CSDN
* @First published time: 2023-03-16
*/
<template>
	<div class="container">
		<h3>vue+openlayers: zoom大于5弹窗，点击关闭放大不再弹出；zoom小于5后再大于5,继续弹窗 </h3>
		<p>大剑师兰特, 还是大剑师兰特</p>
		<h4>
         当前zoom：{{cZoom}}
		</h4>
		<div id="vue-openlayers"></div>
		<div class="box" v-show="isOpen">
			<p>zoom大于5弹窗</p>
			<el-button type="primary" size="mini" @click='close()'> 关闭窗口</el-button>
		</div>
	</div>
</template>

<script>
	import 'ol/ol.css'
	import {Map,View} from 'ol'
	import Tile from 'ol/layer/Tile'
	import XYZ from 'ol/source/XYZ'

	export default {
		data() {
			return {
				map: null, 
				cZoom:4,
				zoomFlag:true,
				zoomLevellong: 3,
				isOpen:false,
			}
		},
		watch:{
			zoomLevellong(newVal,oldVal){
				    if(newVal<5 && oldVal >5){
						this.zoomFlag=true;
					}
					if(newVal<5 && oldVal <5){
						this.zoomFlag=true;
					}
			}
		},
		methods: {
			close(){
				this.isOpen=false;
				this.zoomFlag=false;
			},
			initMap() {
				let raster = new Tile({
					source: new XYZ({
						url: 'https://www.google.com/maps/vt?lyrs=m&gl=en&x={x}&y={y}&z={z}',
						crossOrigin: "anonymous"
					})
				});
				this.map = new Map({
					target: "vue-openlayers",
					layers: [raster],
					view: new View({
						projection: "EPSG:3857",
						center: [0, 0],
						zoom: this.cZoom,
						minZoom:3,
						maxZoom:8,
					}),
				})
				
				this.map.on('moveend', (e) => {
				  this.zoomLevellong=this.map.getView().getZoom();
				  this.cZoom = Math.floor(this.zoomLevellong) ;
					   
				  if(this.cZoom>5 && this.zoomFlag ){
                    this.isOpen=true;
				  }				   				   
				});
			},

		},
		mounted() {
			this.initMap()
		}
	}
</script>
<style scoped>
	.container {
		width: 840px;
		height: 590px;
		margin: 50px auto;
		border: 1px solid #42B983;
		position: relative;
	}

	#vue-openlayers {
		width: 800px;
		height: 420px;
		margin: 0 auto;
		border: 1px solid #42B983;
		position: relative;
	}
	.box{ 
		position: absolute;
		width: 200px;
		height: 100px;
		background: #fff;
		border-radius: 10px;
		left: calc( 50% - 100px );
		bottom: calc( 50% - 50px );
		}
</style>


