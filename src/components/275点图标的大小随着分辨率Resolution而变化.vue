
/*
* @Author: 大剑师兰特（xiaozhuanlan），还是大剑师兰特（CSDN）
* @此源代码版权归大剑师兰特所有，可供学习或商业项目中借鉴，未经授权，不得重复地发表到博客、论坛，问答，git等公共空间或网站中。
* @Email: 2909222303@qq.com
* @First published in xiaozhuanlan.com
* @Second published in CSDN
* @First published time: 2024-07-03
*/

<template>
	<div class="container">
		<h3>vue+openlayers: 点图标的大小随着分辨率而变化</h3>
		<p>大剑师兰特, 还是大剑师兰特</p>
		<h4>
			分辨率：{{F}} ，Zoom：{{Z}}
		</h4>
		<div id="vue-openlayers"></div>
	</div>
</template>
<script>
	import 'ol/ol.css'
	import {Map,View} from 'ol'
	import Tile from 'ol/layer/Tile'
	import XYZ from 'ol/source/XYZ'
	import VectorLayer from 'ol/layer/Vector'
	import VectorSource from 'ol/source/Vector'
	import Style from 'ol/style/Style'
	import Icon from 'ol/style/Icon'
	import Feature from 'ol/Feature'
	import {Point} from "ol/geom";
	import {toLonLat,fromLonLat} from 'ol/proj'

	export default {
		data() {
			return {
				map: null,
				F:'',
				Z:'',
			}
		},

		methods: {
			showinfo(){
				this.map.on('moveend', (e) => {
				this.F=this.map.getView().getResolution();
				this.Z= this.map.getView().getZoom() ;
			   });
			
			},
			
			showPoint() {				
				let marker = new Feature({
				  geometry: new Point(fromLonLat([68.4677376, 35.4096416]))
				});
				
				let vectorSource = new VectorSource({
				  features: [marker]
				});
				
				let vectorLayer = new VectorLayer({
				  source: vectorSource,
				  style: (feature)=> {
				    let size = this.map.getView().getResolution() ;
					let zoom = this.map.getView().getZoom() ;
					console.log(size)
				    return new Style({
				      image: new Icon({
				        src: require('@/assets/endPoint.png'),
				        scale: size*zoom/1000
				      })
				    });
				  }
				});
				
				this.map.addLayer(vectorLayer);
			},

			initMap() {
               let googlelayer = new Tile({
               source: new XYZ({
               		url: 'https://www.google.com/maps/vt?lyrs=m&gl=en&x={x}&y={y}&z={z}',
                  	})
               });
			   
				this.map = new Map({
					target: "vue-openlayers",
					layers: [googlelayer],
					view: new View({
						projection: "EPSG:3857",
						center: fromLonLat([68.4677376, 35.4096416]),
						zoom: 10
					})
				})
			},

		},
		mounted() {
			this.initMap();
			this.showPoint();
			this.showinfo()
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
		position: relative;
	}
</style>

