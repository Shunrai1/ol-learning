/*
* @Author: 大剑师兰特（xiaozhuanlan），还是大剑师兰特（CSDN）
* @此源代码版权归大剑师兰特所有，可供学习或商业项目中借鉴，未经授权，不得重复地发表到博客、论坛，问答，git等公共空间或网站中。
* @Email: 2909222303@qq.com
* @First published in xiaozhuanlan.com
* @Second published in CSDN
* @First published time: 2022-04-29
*/


<template>
	<div class="container">
		<h3>vue+openlayers：实现多个图形的合并、交叉、差集等功能</h3>
		<p>大剑师兰特, 还是大剑师兰特</p>
		<div id="vue-openlayers"></div>
	</div>
</template>

<script>
	import 'ol/ol.css';
	import Map from 'ol/Map';
	import View from 'ol/View';
	import TileLayer from 'ol/layer/Tile';
	import OSM from 'ol/source/OSM';
	import LayerVector from 'ol/layer/Vector'
	import SourceVector from 'ol/source/Vector'
    const  ole=require('ole/build/index.js') ;
	export default {
		data() {
			return {
				map:null,
				editLayer :new LayerVector({
				        source: new SourceVector({
				          wrapX: false
				        })
				      }),
			};
		},
		methods: {
			initMap() {
				let OSM_Layer = new TileLayer({
					source: new OSM()
				})

				this.map = new Map({
					target: "vue-openlayers",
					layers: [
						OSM_Layer,
						this.editLayer
					],
					view: new View({
                     center: [262616.26450171735, 6254013.833457053],
                     zoom: 10,
					}),
				});
				var myeditor = new ole.Editor(this.map);

				var drawPoly = new ole.control.Draw({
				        type: "Polygon",
				        source: this.editLayer.getSource()
				      });
				var union = new ole.control.Union({
				        source: this.editLayer.getSource()
				      });
				
				var intersection = new ole.control.Intersection({
				        source: this.editLayer.getSource()
				      });
				
				var difference = new ole.control.Difference({
				        source: this.editLayer.getSource()
				      });	  

				myeditor.addControls([ drawPoly,union,intersection,difference]);
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
	}

	#vue-openlayers {
		width: 800px;
		height: 470px;
		margin: 0 auto;
		border: 1px solid #42B983;
		position: relative;
	}
</style>


