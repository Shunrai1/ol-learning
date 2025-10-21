

/*
* @Author: 大剑师兰特（xiaozhuanlan），还是大剑师兰特（CSDN）
* @此源代码版权归大剑师兰特所有，可供学习或商业项目中借鉴，未经授权，不得重复地发表到博客、论坛，问答，git等公共空间或网站中。
* @Email: 2909222303@qq.com
* @First published in xiaozhuanlan.com
* @Second published in CSDN
* @First published time: 2024-11-27
*/
<template>
	<div class="container">
		<h3>vue+openlayers: 随机加载20000个点，聚合数据，单个显示时更换颜色和添加文字标签</h3>
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
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import {Style,Fill,Stroke, Icon, Text, Circle} from 'ol/style';
import Cluster from 'ol/source/Cluster';

	export default {
		name: 'points',
		data() {
			return {
				map: null,
			}
		},
		methods: {

			initMap() {
			// 创建地图
			this.map = new Map({
			  target: 'vue-openlayers',
			  layers: [
			    new TileLayer({
			      source: new OSM()
			    })
			  ],
			  view: new View({
			    center: [0, 0],
			    zoom: 7,
				 projection: "EPSG:4326",
			  })
			});
			
			// 创建点数据
			const features = [];
			for (let i = 0; i < 20000; i++) {
			  const coordinates = [Math.random() * 360 - 180, Math.random() * 180 - 90];
			  let feature = new Feature({
							  geometry: new Point(coordinates),
							  name: 'point'+i,
							});
			  features.push(feature);
			}
			
			// 创建聚合源
			const vectorSource = new VectorSource({
			  features: features
			});
			
			const clusterSource = new Cluster({
			  distance: 100,
			  source: vectorSource
			});
			
			// 创建矢量层
			const vectorLayer = new VectorLayer({
			  source: clusterSource,
			  style: function(feature) {
			    const size = feature.get('features').length;
			    let style;
			
			    if (size === 1) {
			      // 单个点
			      const pointFeature = feature.get('features')[0];
			      const text = pointFeature.get('name') || 'Point'; // 假设每个点有一个 name 属性
			      style = new Style({
			        image: new Circle({
			          radius: 10,
			          stroke: new Stroke({
			            color: '#fff'
			          }),
			          fill: new Fill({
			            color: '#ff0000'
			          })
			        }),
			        text: new Text({
			          text: text,
			          font: '12px Arial',
			          fill: new Fill({color: 'red'}),
			          stroke: new Stroke({color: 'white', width: 2}),
			          offsetX: 15,
			          offsetY: -15
			        })
			      });
			    } else {
			      // 聚合点
			      style = new Style({
			        image: new Circle({
			          radius: 10,
			          stroke: new Stroke({
			            color: '#fff'
			          }),
			          fill: new Fill({
			            color: '#3399CC'
			          })
			        }),
			        text: new Text({
			          text: size.toString(),
			          fill: new Fill({
			            color: '#fff'
			          })
			        })
			      });
			    }
			
			    return style;
			  }
			});
			
			// 添加矢量层到地图
			this.map.addLayer(vectorLayer);
				
			},
		},
		mounted() {
			this.initMap();
		},
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
		height: 530px;
		margin: 0 auto;
		border: 1px solid #42B983;
		position: relative;
	}
</style>



