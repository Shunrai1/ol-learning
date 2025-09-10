/*
* @Author: 大剑师兰特（xiaozhuanlan），还是大剑师兰特（CSDN）
* @此源代码版权归大剑师兰特所有，可供学习或商业项目中借鉴，未经授权，不得重复地发表到博客、论坛，问答，git等公共空间或网站中。
* @Email: 2909222303@qq.com
* @First published in xiaozhuanlan.com
* @Second published in CSDN
* @First published time: 2022-05-06
*/

<template>
	<div class="container">
		<h3>vue+openlayers: 点击旋转loading，渲染后取消loading</h3>
		<p>大剑师兰特, 还是大剑师兰特</p>
		<div id="vue-openlayers"></div>
	</div>
</template>

<script>
	import 'ol/ol.css'
	import {Map,View} from 'ol'
    import Tile from 'ol/layer/Tile'
    import XYZ from "ol/source/XYZ";

	export default {
		data() {
			return {
				map: null,
			}
		},
		methods: {
			initMap() {
				let OSMlayer=new Tile({
                            source: new XYZ({
                                url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
								tileSize: 512,
                            })
                        });
						
				this.map = new Map({
					target: "vue-openlayers",
					layers: [OSMlayer],
					view: new View({
					center: [0, 0],
					zoom: 2,
					}),
				})

			this.map.on('click', ()=>{
			  this.map.getTargetElement().classList.add('spinner');
			});
			this.map.on('postrender', ()=> {
			  this.map.getTargetElement().classList.remove('spinner');
			});

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
	@keyframes spinner {
	        to {
	          transform: rotate(360deg);
	        }
	      }
	
	      .spinner:after {
	        content: "";
	        box-sizing: border-box;
	        position: absolute;
	        top: 50%;
	        left: 50%;
	        width: 40px;
	        height: 40px;
	        margin-top: -20px;
	        margin-left: -20px;
	        border-radius: 50%;
	        border: 5px solid rgba(180, 180, 180, 0.6);
	        border-top-color: rgba(0, 0, 0, 0.6);
	        animation: spinner 0.6s linear infinite;
	      }
</style>


