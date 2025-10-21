
/*
* @Author: 大剑师兰特（xiaozhuanlan），还是大剑师兰特（CSDN）
* @此源代码版权归大剑师兰特所有，可供学习或商业项目中借鉴，未经授权，不得重复地发表到博客、论坛，问答，git等公共空间或网站中。
* @Email: 2909222303@qq.com
* @First published in xiaozhuanlan.com
* @Second published in CSDN
* @First published time: 2024-05-29
*/
<template>
	<div class="container">
		<h3>vue+openlayers: 更改layer透明度，并用 change:opacity 进行监听</h3>
		<p>大剑师兰特, 还是大剑师兰特</p>
		<h4>
			<el-button type="primary" size="mini" @click='changeLayer(-10)'> 透明度-10%</el-button>
			<el-button type="danger" size="mini" @click='changeLayer(10)'> 透明度+10%</el-button>
			监听当前：{{opacity}}
		</h4>
		<div id="vue-openlayers" class="map-x"></div>
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
				mylayer:null,
				opacity:1.0,
			}
		},
		methods: {
			listenChange(){
				this.mylayer.on('change:opacity', (event)=> {				
					this.opacity=(this.mylayer.getOpacity()).toFixed(1);
				});
			},
			
            changeLayer(v){
				let c=this.mylayer.getOpacity();
				let p=c + v*0.01
				if(p>1){
					this.mylayer.setOpacity(1.0)
				}else if(p<0){
					this.mylayer.setOpacity(0)
				}else{
					this.mylayer.setOpacity(p)
				}								
			},

			initMap() {
				this.mylayer=new Tile({
							source: new XYZ({
								url: 'https://www.google.com/maps/vt?lyrs=m&gl=en&x={x}&y={y}&z={z}',
							})
						})

				this.map = new Map({
					target: 'vue-openlayers',
					layers: [
                          this.mylayer
					],
					view: new View({
						projection: "EPSG:3857",
						center: [114.064839, -22.548857],
						zoom: 4
					}),
                 
				})
				
				this.listenChange()
			}
		},
		mounted() {
			this.initMap()			
		}
	}
</script>

<style scoped>
	.container {
		width: 1000px;
		height: 660px;
		margin: 50px auto;
		border: 1px solid #42B983;
		position: relative;
	}

	#vue-openlayers {
		width: 960px;
		height: 480px;
		margin: 0 auto;
		border: 1px solid #42B983;
	}
</style>

